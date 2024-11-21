import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as mm from 'https://esm.sh/music-metadata'

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
    
    const { fileName, fileType, fileSize, fileData } = await req.json()

    if (!fileName || !fileType || !fileData) {
      throw new Error('Missing required file information')
    }

    console.log('File received:', {
      name: fileName,
      size: fileSize,
      type: fileType
    })

    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
    if (!allowedTypes.includes(fileType)) {
      throw new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`)
    }

    const bunnyApiKey = Deno.env.get('BUNNY_API_KEY')
    const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST')
    const bunnyStorageZoneName = Deno.env.get('BUNNY_STORAGE_ZONE_NAME')

    if (!bunnyApiKey || !bunnyStorageHost || !bunnyStorageZoneName) {
      console.error('Missing Bunny CDN configuration')
      throw new Error('Missing Bunny CDN configuration')
    }

    const fileExt = fileName.split('.').pop()
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`
    
    const bunnyUrl = `https://${bunnyStorageHost}/${bunnyStorageZoneName}/${uniqueFileName}`
    console.log('Uploading to Bunny CDN:', bunnyUrl)

    const arrayBuffer = new Uint8Array(fileData)

    console.log('Initiating Bunny CDN upload...')
    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: arrayBuffer
    })

    if (!uploadResponse.ok) {
      const responseText = await uploadResponse.text()
      console.error('Bunny CDN upload failed:', responseText)
      throw new Error(`Failed to upload to Bunny CDN: ${responseText}`)
    }

    console.log('Successfully uploaded to Bunny CDN')

    console.log('Parsing file metadata...')
    const metadata = await mm.parseBuffer(arrayBuffer, fileType, {
      duration: true,
      skipCovers: false,
    })

    console.log('File metadata parsed:', metadata)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      console.error('User authentication error:', userError)
      throw new Error('Unauthorized')
    }

    let artworkUrl = null
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0]
      const artworkData = picture.data
      const artworkType = picture.format
      const artworkExt = artworkType.split('/')[1] || 'jpg'
      const artworkFileName = `${crypto.randomUUID()}.${artworkExt}`

      console.log('Uploading artwork to Supabase storage...')
      const { data: artworkData2, error: artworkError } = await supabase
        .storage
        .from('music')
        .upload(`artworks/${artworkFileName}`, artworkData, {
          contentType: artworkType,
          cacheControl: '3600'
        })

      if (artworkError) {
        console.error('Failed to upload artwork:', artworkError)
      } else {
        const { data: { publicUrl } } = supabase
          .storage
          .from('music')
          .getPublicUrl(`artworks/${artworkFileName}`)
        
        artworkUrl = publicUrl
        console.log('Artwork uploaded successfully:', artworkUrl)
      }
    }

    // Update: Store the complete Bunny CDN URL
    const cdnUrl = `https://${bunnyStorageZoneName}.b-cdn.net/${uniqueFileName}`
    const songData = {
      title: metadata.common.title || fileName.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || null,
      album: metadata.common.album || null,
      genre: metadata.common.genre || [],
      duration: Math.round(metadata.format.duration || 0),
      file_url: cdnUrl,
      artwork_url: artworkUrl,
      bunny_id: uniqueFileName,
      created_by: user.id
    }

    console.log('Saving song metadata to Supabase:', songData)

    const { data: song, error: insertError } = await supabase
      .from('songs')
      .insert([songData])
      .select()
      .single()

    if (insertError) {
      console.error('Failed to save song metadata:', insertError)
      throw new Error(`Failed to save song metadata: ${insertError.message}`)
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