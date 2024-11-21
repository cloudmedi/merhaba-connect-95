import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as mm from 'https://esm.sh/music-metadata-browser'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid content type', 
          details: 'Content type must be multipart/form-data' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Parse form data
    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error('Form data parsing error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Upload failed', 
          details: 'Failed to parse form data: ' + error.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Get file from form data
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded or invalid file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract metadata from the audio file
    const arrayBuffer = await file.arrayBuffer();
    const metadata = await mm.parseBlob(new Blob([arrayBuffer]));

    // Upload to Bunny CDN
    const bunnyStorageName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME');
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST');

    if (!bunnyStorageName || !bunnyApiKey || !bunnyStorageHost) {
      throw new Error('Missing Bunny CDN configuration');
    }

    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageName}/${fileName}`;

    // Upload file to Bunny CDN
    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': file.type,
      },
      body: arrayBuffer,
    });

    if (!uploadResponse.ok) {
      console.error('Bunny CDN upload failed:', await uploadResponse.text());
      throw new Error('Failed to upload to Bunny CDN');
    }

    // Get the user information from the auth header
    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader!);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Extract relevant metadata
    const songData = {
      title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || null,
      album: metadata.common.album || null,
      genre: metadata.common.genre || [],
      duration: Math.round(metadata.format.duration || 0),
      file_url: bunnyUrl,
      bunny_id: fileName,
      artwork_url: null,
      created_by: user.id
    };

    // If there's cover art, upload it to Supabase Storage
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      const artworkFileName = `${crypto.randomUUID()}.${picture.format.split('/')[1]}`;
      
      const { data: artworkData, error: artworkError } = await supabase.storage
        .from('music')
        .upload(
          `artwork/${artworkFileName}`, 
          new Blob([picture.data], { type: picture.format }),
          { contentType: picture.format }
        );

      if (!artworkError && artworkData) {
        const { data: { publicUrl } } = supabase.storage
          .from('music')
          .getPublicUrl(`artwork/${artworkFileName}`);
        
        songData.artwork_url = publicUrl;
      }
    }

    // Save song metadata to Supabase
    const { data: savedSong, error: insertError } = await supabase
      .from('songs')
      .insert(songData)
      .select()
      .single();

    if (insertError) {
      throw new Error('Failed to save song metadata');
    }

    return new Response(
      JSON.stringify({ 
        message: 'Upload successful',
        song: savedSong
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

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