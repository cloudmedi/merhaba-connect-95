import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const fileName = formData.get('fileName')

    if (!file || !fileName) {
      throw new Error('File and fileName are required')
    }

    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY')
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST')
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME')

    if (!bunnyApiKey || !bunnyStorageHost || !bunnyStorageZoneName) {
      throw new Error('Missing Bunny CDN configuration')
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBytes = new Uint8Array(arrayBuffer)

    // Upload to Bunny CDN
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageZoneName}/${fileName}`
    console.log('Uploading to Bunny CDN:', bunnyUrl)

    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: fileBytes
    })

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text()
      console.error('Bunny CDN upload failed:', responseText)
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`)
    }

    // Construct the CDN URL
    const cdnUrl = `https://${bunnyStorageZoneName}.b-cdn.net/${fileName}`
    console.log('File uploaded successfully:', cdnUrl)

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