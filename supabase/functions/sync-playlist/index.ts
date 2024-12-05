import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('Expected websocket connection', { status: 400 })
  }

  // WebSocket bağlantısını yükselt
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

        // Cihazın offline_players tablosundaki kaydını bul
        const { data: offlinePlayer } = await supabase
          .from('offline_players')
          .select('id')
          .eq('device_id', deviceId)
          .single()

        if (offlinePlayer) {
          // Playlist'i offline_playlists tablosuna ekle
          const { error: playlistError } = await supabase
            .from('offline_playlists')
            .upsert({
              device_id: offlinePlayer.id,
              playlist_id: playlist.id,
              sync_status: 'pending',
              last_synced_at: new Date().toISOString()
            })

          if (playlistError) {
            throw playlistError
          }

          // Şarkıları offline_songs tablosuna ekle
          const songPromises = playlist.songs.map(async (song: any) => {
            const { error: songError } = await supabase
              .from('offline_songs')
              .upsert({
                device_id: offlinePlayer.id,
                song_id: song.id,
                sync_status: 'pending',
                last_synced_at: new Date().toISOString()
              })

            if (songError) {
              throw songError
            }
          })

          await Promise.all(songPromises)

          // Başarılı yanıt gönder
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