import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user information from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('User authentication error:', userError);
      throw new Error('Unauthorized');
    }

    const { fileData, fileName, contentType } = await req.json();

    if (!fileData || !fileName || !contentType) {
      throw new Error('Missing required file information');
    }

    console.log('Processing file:', fileName);

    // Get Bunny CDN configuration
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST');
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME');

    if (!bunnyApiKey || !bunnyStorageHost || !bunnyStorageZoneName) {
      throw new Error('Missing Bunny CDN configuration');
    }

    // Generate unique filename for Bunny CDN
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `music/${crypto.randomUUID()}.${fileExt}`;
    
    console.log('Uploading to Bunny CDN...');
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageZoneName}/${uniqueFileName}`;

    // Convert base64 to Uint8Array for upload
    const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': contentType
      },
      body: binaryData
    });

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text();
      console.error('Bunny CDN upload failed:', responseText);
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`);
    }

    console.log('Successfully uploaded to Bunny CDN');

    // Construct the CDN URL
    const cdnUrl = `https://cloud-media.b-cdn.net/${uniqueFileName}`;

    // Save song metadata to Supabase
    const songData = {
      title: fileName.replace(/\.[^/.]+$/, ""),
      file_url: cdnUrl,
      bunny_id: uniqueFileName,
      created_by: user.id,
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