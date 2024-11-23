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

    console.log('Processing file:', file.name, 'Size:', file.size);

    // Get Bunny CDN configuration
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY');
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST');
    const bunnyStorageName = Deno.env.get('BUNNY_STORAGE_NAME');
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME');

    if (!bunnyApiKey || !bunnyStorageHost || !bunnyStorageName || !bunnyStorageZoneName) {
      throw new Error('Missing Bunny CDN configuration');
    }

    // Check file size (Bunny CDN limit is 5GB)
    const maxFileSize = 5 * 1024 * 1024 * 1024; // 5GB in bytes
    if (file.size > maxFileSize) {
      throw new Error('File size exceeds the 5GB limit');
    }

    // Generate unique filename for Bunny CDN
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `music/${crypto.randomUUID()}.${fileExt}`;
    
    console.log('Uploading to Bunny CDN...');

    // Get file data as array buffer
    const fileData = await file.arrayBuffer();

    // Test Bunny CDN connectivity
    try {
      const testResponse = await fetch(`https://${bunnyStorageHost}`, {
        method: 'HEAD',
        headers: {
          'AccessKey': bunnyApiKey
        }
      });
      console.log('Bunny CDN connectivity test:', testResponse.status);
    } catch (error) {
      console.error('Bunny CDN connectivity test failed:', error);
      throw new Error('Failed to connect to Bunny CDN');
    }

    // Correct Bunny CDN upload URL with storage zone name
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageName}/${uniqueFileName}`;
    console.log('Uploading to:', bunnyUrl);

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': 'audio/mpeg',
        'Accept': '*/*'
      },
      body: fileData
    });

    const responseText = await uploadResponse.text();
    console.log('Bunny CDN response:', uploadResponse.status, responseText);

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`);
    }

    console.log('Successfully uploaded to Bunny CDN');

    // Save song metadata to Supabase with correct CDN URL
    const songData = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      file_url: `https://${bunnyStorageZoneName}/${uniqueFileName}`,
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