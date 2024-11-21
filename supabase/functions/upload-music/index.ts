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
    const { fileName, fileType, fileData } = await req.json();
    console.log('Received file data:', { fileName, fileType });

    if (!fileName || !fileType || !fileData) {
      throw new Error('Missing required file data');
    }

    // Convert base64 to Uint8Array
    const base64Data = fileData.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    console.log('Converted file to binary data, size:', binaryData.length);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract metadata from the audio file
    console.log('Extracting metadata from audio file...');
    const metadata = await mm.parseBuffer(binaryData);
    console.log('Extracted metadata:', metadata);

    // Prepare Bunny CDN upload
    const bunnyStorageName = Deno.env.get('BUNNY_STORAGE_NAME');
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');

    if (!bunnyStorageName || !bunnyApiKey) {
      throw new Error('Missing Bunny CDN configuration');
    }

    console.log('Bunny CDN configuration loaded:', { bunnyStorageName });

    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}-${fileName}`;
    const bunnyUrl = `https://storage.bunnycdn.com/${bunnyStorageName}/${uniqueFileName}`;

    console.log('Uploading to Bunny CDN:', bunnyUrl);

    // Upload file to Bunny CDN
    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': fileType,
      },
      body: binaryData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Bunny CDN upload failed:', errorText);
      throw new Error(`Failed to upload to Bunny CDN: ${errorText}`);
    }

    console.log('Successfully uploaded to Bunny CDN');

    // Get the user information from the auth header
    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader!);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Extract relevant metadata
    const songData = {
      title: metadata.common.title || fileName.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || null,
      album: metadata.common.album || null,
      genre: metadata.common.genre || [],
      duration: Math.round(metadata.format.duration || 0),
      file_url: bunnyUrl,
      bunny_id: uniqueFileName,
      artwork_url: null, // We'll handle artwork separately in the future
      created_by: user.id
    };

    console.log('Saving song metadata:', songData);

    // Save song metadata to Supabase
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