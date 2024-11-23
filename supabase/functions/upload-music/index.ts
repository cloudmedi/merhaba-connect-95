import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    // Save song metadata to Supabase
    const songData = {
      title: fileName.replace(/\.[^/.]+$/, ""),
      file_url: uniqueFileName,
      bunny_id: uniqueFileName,
      created_by: 'system'
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