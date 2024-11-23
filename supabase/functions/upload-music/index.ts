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

    // Get form data from request
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Processing file:', file.name);

    // Get Bunny CDN configuration
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST');
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME');

    if (!bunnyApiKey || !bunnyStorageHost || !bunnyStorageZoneName) {
      throw new Error('Missing Bunny CDN configuration');
    }

    // Generate unique filename for Bunny CDN
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `music/${crypto.randomUUID()}.${fileExt}`;
    
    console.log('Uploading to Bunny CDN...');

    // Get file data as array buffer
    const fileData = await file.arrayBuffer();
    const bunnyUrl = `https://${bunnyStorageHost}/${uniqueFileName}`;

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': 'audio/mpeg'
      },
      body: fileData
    });

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text();
      console.error('Bunny CDN upload failed:', responseText);
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`);
    }

    console.log('Successfully uploaded to Bunny CDN');

    // Save song metadata to Supabase
    const songData = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      file_url: uniqueFileName,
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});