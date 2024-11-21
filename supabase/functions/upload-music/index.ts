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
    const startTime = Date.now();
    console.log('Starting file upload process');

    const { fileName, fileType, fileData } = await req.json();
    console.log(`Processing file: ${fileName}, type: ${fileType}, data length: ${fileData?.length || 0}`);

    if (!fileName || !fileType || !fileData) {
      throw new Error('Missing required file data');
    }

    // Convert base64 to Uint8Array more efficiently
    const base64Data = fileData.split(',')[1];
    const binaryData = new Uint8Array(base64Data.length);
    for (let i = 0; i < base64Data.length; i++) {
      binaryData[i] = base64Data.charCodeAt(i);
    }
    
    console.log(`Binary data prepared, size: ${binaryData.length} bytes`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract basic metadata without full parse
    console.log('Extracting basic metadata...');
    const metadata = await mm.parseBuffer(binaryData, {
      duration: true,
      skipCovers: true, // Skip artwork parsing to save memory
      skipPostHeaders: true,
    });
    
    console.log('Metadata extracted:', {
      title: metadata.common.title,
      artist: metadata.common.artist,
      duration: metadata.format.duration
    });

    // Prepare Bunny CDN upload
    const bunnyStorageName = Deno.env.get('BUNNY_STORAGE_NAME');
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');

    if (!bunnyStorageName || !bunnyApiKey) {
      throw new Error('Missing Bunny CDN configuration');
    }

    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
    const bunnyUrl = `https://storage.bunnycdn.com/${bunnyStorageName}/${uniqueFileName}`;

    console.log('Uploading to Bunny CDN:', bunnyUrl);

    // Upload to Bunny CDN with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    try {
      const uploadResponse = await fetch(bunnyUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyApiKey,
          'Content-Type': fileType,
        },
        body: binaryData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Bunny CDN upload failed:', errorText);
        throw new Error(`Failed to upload to Bunny CDN: ${errorText}`);
      }

      console.log('Successfully uploaded to Bunny CDN');
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Upload timeout - request took too long');
      }
      throw error;
    }

    // Get the user information from the auth header
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
      file_url: bunnyUrl,
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

    const endTime = Date.now();
    console.log(`Upload process completed in ${endTime - startTime}ms`);

    return new Response(
      JSON.stringify({ 
        message: 'Upload successful',
        song: savedSong,
        processingTime: endTime - startTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Upload failed', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});