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
    console.log('Starting file upload process...')
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Get Bunny CDN configuration
    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY')
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME')

    if (!bunnyApiKey || !bunnyStorageZoneName) {
      console.error('Missing Bunny CDN configuration:', {
        apiKey: !!bunnyApiKey,
        zoneName: !!bunnyStorageZoneName
      })
      throw new Error('Missing Bunny CDN configuration')
    }

    console.log('Bunny CDN configuration loaded:', {
      zoneName: bunnyStorageZoneName
    })

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`
    
    // Construct proper Bunny CDN URL and headers
    const bunnyUrl = `https://storage.bunnycdn.com/${bunnyStorageZoneName}/${uniqueFileName}`
    const bunnyHeaders = {
      'AccessKey': bunnyApiKey,
      'Content-Type': file.type || 'application/octet-stream'
    }

    console.log('Attempting upload to Bunny CDN:', bunnyUrl)

    // Upload to Bunny CDN
    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: bunnyHeaders,
      body: file
    })

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text()
      console.error('Bunny CDN upload failed:', {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        response: responseText
      })
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`)
    }

    console.log('Successfully uploaded to Bunny CDN')

    // Get file metadata
    const arrayBuffer = await file.arrayBuffer()
    const metadata = await mm.parseBuffer(new Uint8Array(arrayBuffer), {
      duration: true,
      skipCovers: true,
      skipPostHeaders: true,
    })

    console.log('File metadata parsed:', metadata)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user information
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Save song metadata to Supabase
    const cdnUrl = `https://${bunnyStorageZoneName}/${uniqueFileName}`
    const songData = {
      title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || null,
      album: metadata.common.album || null,
      genre: metadata.common.genre || [],
      duration: Math.round(metadata.format.duration || 0),
      file_url: cdnUrl,
      bunny_id: uniqueFileName,
      created_by: user.id
    }

    console.log('Saving song metadata to Supabase:', songData)

    const { data: song, error: insertError } = await supabase
      .from('songs')
      .insert(songData)
      .select()
      .single()

    if (insertError) {
      console.error('Failed to save song metadata:', insertError)
      throw new Error('Failed to save song metadata')
    }

    console.log('Successfully saved song metadata:', song)

    return new Response(
      JSON.stringify({ 
        message: 'Upload successful',
        song 
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