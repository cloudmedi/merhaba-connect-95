import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as mm from 'https://esm.sh/music-metadata-browser'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileName, fileType, fileData } = await req.json();

    if (!fileName || !fileType || !fileData) {
      return new Response(
        JSON.stringify({ error: 'Missing file data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Convert base64 to Uint8Array
    const base64Data = fileData.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Extract metadata from the audio file
    const metadata = await mm.parseBuffer(binaryData);
    console.log('Extracted metadata:', metadata);

    // Get artwork from metadata if available
    let artworkUrl = null;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      const artworkData = new Uint8Array(picture.data);
      const artworkExt = picture.format.split('/')[1] || 'jpeg';
      const artworkFileName = `${crypto.randomUUID()}.${artworkExt}`;

      // Upload artwork to Bunny CDN
      const bunnyStorageName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME');
      const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');
      const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST');

      if (!bunnyStorageName || !bunnyApiKey || !bunnyStorageHost) {
        throw new Error('Missing Bunny CDN configuration');
      }

      const artworkBunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageName}/${artworkFileName}`;
      
      console.log('Uploading artwork to Bunny CDN:', artworkBunnyUrl);

      const artworkUploadResponse = await fetch(artworkBunnyUrl, {
        method: 'PUT',
        headers: {
          'AccessKey': bunnyApiKey,
          'Content-Type': picture.format,
        },
        body: artworkData,
      });

      if (artworkUploadResponse.ok) {
        artworkUrl = artworkBunnyUrl;
      } else {
        console.error('Failed to upload artwork:', await artworkUploadResponse.text());
      }
    }

    // Upload audio file to Bunny CDN
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}-${fileName}`;
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageName}/${uniqueFileName}`;

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
      title: metadata.common.title || fileName.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || null,
      album: metadata.common.album || null,
      genre: metadata.common.genre || [],
      duration: Math.round(metadata.format.duration || 0),
      file_url: bunnyUrl,
      bunny_id: uniqueFileName,
      artwork_url: artworkUrl,
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