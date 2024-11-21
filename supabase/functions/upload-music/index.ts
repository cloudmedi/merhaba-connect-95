import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as mm from 'https://esm.sh/music-metadata-browser'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting file upload process');
    const { fileName, fileType, fileData } = await req.json();
    
    if (!fileName || !fileType || !fileData) {
      throw new Error('Missing required file data');
    }

    // Verify Bunny CDN configuration
    const bunnyStorageName = Deno.env.get('BUNNY_STORAGE_NAME');
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST');
    
    console.log('Checking Bunny CDN configuration:', {
      storageName: bunnyStorageName ? 'present' : 'missing',
      apiKey: bunnyApiKey ? 'present' : 'missing',
      storageHost: bunnyStorageHost ? 'present' : 'missing'
    });

    if (!bunnyStorageName || !bunnyApiKey || !bunnyStorageHost) {
      throw new Error('Missing Bunny CDN configuration. Please check environment variables.');
    }

    console.log(`Processing file: ${fileName}, type: ${fileType}`);

    // Convert base64 to ArrayBuffer
    const base64Data = fileData.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract metadata
    console.log('Extracting metadata...');
    const metadata = await mm.parseBuffer(bytes, {
      duration: true,
      skipCovers: true,
      skipPostHeaders: true,
    });

    // Prepare Bunny CDN upload
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageName}/${uniqueFileName}`;

    console.log('Uploading to Bunny CDN:', bunnyUrl);

    // Upload to Bunny CDN with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    try {
      const uploadResponse = await fetch(bunnyUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyApiKey,
          'Content-Type': fileType,
        },
        body: bytes,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Bunny CDN upload failed:', errorText);
        throw new Error(`Failed to upload to Bunny CDN: ${errorText}`);
      }

      console.log('Successfully uploaded to Bunny CDN');

      // Get CDN URL
      const cdnUrl = `https://${Deno.env.get('BUNNY_STORAGE_ZONE_NAME')}/${uniqueFileName}`;

      // Get user information
      const authHeader = req.headers.get('Authorization')?.split(' ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader!);

      if (userError || !user) {
        throw new Error('Unauthorized');
      }

      // Save song metadata
      const songData = {
        title: metadata.common.title || fileName.replace(/\.[^/.]+$/, ""),
        artist: metadata.common.artist || null,
        album: metadata.common.album || null,
        genre: metadata.common.genre || [],
        duration: Math.round(metadata.format.duration || 0),
        file_url: cdnUrl,
        bunny_id: uniqueFileName,
        artwork_url: null,
        created_by: user.id
      };

      console.log('Saving song metadata to database');

      const { data: savedSong, error: insertError } = await supabase
        .from('songs')
        .insert(songData)
        .select()
        .single();

      if (insertError) {
        console.error('Failed to save song metadata:', insertError);
        throw new Error('Failed to save song metadata');
      }

      return new Response(
        JSON.stringify({ 
          message: 'Upload successful',
          song: savedSong
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Upload failed', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});