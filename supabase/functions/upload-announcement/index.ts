import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileData, fileName, contentType, announcementId } = await req.json()

    if (!fileData || !fileName || !announcementId) {
      throw new Error('Missing required information')
    }

    // Get Bunny CDN configuration
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY')
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST')
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME')

    if (!bunnyApiKey || !bunnyStorageHost || !bunnyStorageZoneName) {
      throw new Error('Missing Bunny CDN configuration')
    }

    // Convert base64 to Uint8Array
    const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0))

    // Generate unique filename
    const fileExt = fileName.split('.').pop()
    const uniqueFileName = `announcements/${crypto.randomUUID()}.${fileExt}`

    // Upload to Bunny CDN
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageZoneName}/${uniqueFileName}`
    console.log('Uploading to Bunny CDN:', bunnyUrl)

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': contentType || 'application/octet-stream'
      },
      body: binaryData
    })

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text()
      console.error('Bunny CDN upload failed:', responseText)
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`)
    }

    // Construct the CDN URL
    const cdnUrl = `https://${bunnyStorageZoneName}.b-cdn.net/${uniqueFileName}`

    // Save file information to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error: insertError } = await supabase
      .from('announcement_files')
      .insert({
        announcement_id: announcementId,
        file_name: fileName,
        file_url: cdnUrl,
        bunny_id: uniqueFileName
      })

    if (insertError) {
      console.error('Failed to save file metadata:', insertError)
      throw new Error(`Failed to save file metadata: ${insertError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Upload successful',
        url: cdnUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Upload process failed:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})