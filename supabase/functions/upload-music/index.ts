import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as mm from 'https://esm.sh/music-metadata-browser@2.5.10'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, contentType } = await req.json();

    if (!fileData || !fileName) {
      throw new Error('File data and fileName are required');
    }

    // Get Bunny CDN configuration
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST');
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME');

    if (!bunnyApiKey || !bunnyStorageHost || !bunnyStorageZoneName) {
      throw new Error('Missing Bunny CDN configuration');
    }

    // Convert base64 to Uint8Array
    const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));

    // Extract metadata from the audio file
    let metadata;
    try {
      metadata = await mm.parseBlob(new Blob([binaryData], { type: contentType }));
      console.log('Extracted metadata:', metadata);
    } catch (error) {
      console.error('Error extracting metadata:', error);
      metadata = null;
    }

    // Generate unique filename
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `music/${crypto.randomUUID()}.${fileExt}`;

    // Upload to Bunny CDN
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageZoneName}/${uniqueFileName}`;
    console.log('Uploading to Bunny CDN:', bunnyUrl);

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': contentType || 'audio/mpeg'
      },
      body: binaryData
    });

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text();
      console.error('Bunny CDN upload failed:', responseText);
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`);
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get the user ID from the authorization header
    let userId = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // Extract and process genres
    const genres = metadata?.common?.genre || [];
    
    // Create any missing genres
    if (genres.length > 0) {
      for (const genreName of genres) {
        // Check if genre exists
        const { data: existingGenre } = await supabase
          .from('genres')
          .select('id')
          .eq('name', genreName)
          .single();

        // If genre doesn't exist, create it
        if (!existingGenre) {
          await supabase
            .from('genres')
            .insert([{
              name: genreName,
              description: `Automatically created from uploaded song: ${metadata?.common?.title || fileName}`,
              created_by: userId
            }]);
        }
      }
    }

    // Prepare song metadata
    const songData = {
      title: metadata?.common?.title || fileName.replace(/\.[^/.]+$/, ""),
      artist: metadata?.common?.artist || null,
      album: metadata?.common?.album || null,
      genre: genres,
      duration: metadata?.format?.duration ? Math.round(metadata.format.duration) : null,
      artwork_url: metadata?.common?.picture?.[0] ? 
        `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}` : 
        null,
      file_url: uniqueFileName,
      bunny_id: uniqueFileName,
      created_by: userId
    };

    console.log('Saving song metadata to Supabase:', songData);

    const { data: song, error: insertError } = await supabase
      .from('songs')
      .insert([songData])
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save song metadata:', insertError);
      throw new Error(`Failed to save song metadata: ${insertError.message}`);
    }

    console.log('Successfully saved song metadata:', song);

    return new Response(
      JSON.stringify({ 
        message: 'Upload successful',
        song 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Upload process failed:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});