import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('Expected websocket connection', { 
      status: 400,
      headers: corsHeaders 
    })
  }

  // Get authentication token from URL params
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  
  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Verify device token if provided
  if (token) {
    const { data: deviceToken, error } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !deviceToken) {
      return new Response('Invalid device token', { 
        status: 403,
        headers: corsHeaders 
      })
    }
  }

  // Create WebSocket connection
  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.onopen = () => {
    console.log('WebSocket connection opened')
  }

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('Received message:', data)

      if (data.type === 'sync_playlist') {
        const { deviceId, playlist } = data.payload

        // Find the offline_player record for this device
        const { data: offlinePlayer } = await supabase
          .from('offline_players')
          .select('id')
          .eq('device_id', deviceId)
          .single()

        if (offlinePlayer) {
          // Update or create offline_playlists record
          const { error: playlistError } = await supabase
            .from('offline_playlists')
            .upsert({
              device_id: offlinePlayer.id,
              playlist_id: playlist.id,
              sync_status: 'pending',
              last_synced_at: new Date().toISOString()
            })

          if (playlistError) throw playlistError

          // Add songs to offline_songs table
          const songPromises = playlist.songs.map(async (song: any) => {
            const { error: songError } = await supabase
              .from('offline_songs')
              .upsert({
                device_id: offlinePlayer.id,
                song_id: song.id,
                sync_status: 'pending',
                last_synced_at: new Date().toISOString()
              })

            if (songError) throw songError
          })

          await Promise.all(songPromises)

          // Send success response
          socket.send(JSON.stringify({
            type: 'sync_success',
            payload: {
              deviceId,
              playlistId: playlist.id
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error processing message:', error)
      socket.send(JSON.stringify({
        type: 'error',
        payload: error.message
      }))
    }
  }

  socket.onerror = (e) => console.log('WebSocket error:', e)
  socket.onclose = () => console.log('WebSocket connection closed')

  return response
})