import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  console.log('Token received:', token);
  
  if (!token) {
    console.error('Token is required');
    return new Response(
      JSON.stringify({ error: 'Token is required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const upgrade = req.headers.get('upgrade') || '';
  console.log('Upgrade header:', upgrade);

  if (upgrade.toLowerCase() != 'websocket') {
    console.error('Expected websocket upgrade');
    return new Response('Expected websocket upgrade', { 
      status: 426,
      headers: corsHeaders
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  console.log('Validating token in device_tokens table...');
  const { data: deviceToken, error: tokenError } = await supabase
    .from('device_tokens')
    .select('token, status')
    .eq('token', token)
    .in('status', ['active', 'used'])
    .single();

  console.log('Token validation result:', { deviceToken, tokenError });

  if (tokenError || !deviceToken) {
    console.error('Invalid or expired token');
    return new Response(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  console.log('WebSocket connection upgraded successfully');

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = async (event) => {
    try {
      console.log('Received raw message:', event.data);
      
      let data;
      try {
        data = JSON.parse(event.data);
        console.log('Parsed message data:', data);
      } catch (error) {
        console.error('Failed to parse message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          payload: {
            message: 'Invalid message format'
          }
        }));
        return;
      }

      if (!data.type || !data.payload) {
        console.error('Invalid message structure - missing type or payload');
        socket.send(JSON.stringify({
          type: 'error',
          payload: {
            message: 'Invalid message structure'
          }
        }));
        return;
      }
      
      if (data.type === 'sync_playlist') {
        console.log('Processing playlist sync:', data.payload);
        
        const { playlist, devices } = data.payload;
        
        if (!playlist || !playlist.id || !devices || !Array.isArray(devices)) {
          console.error('Invalid playlist data or devices:', { playlist, devices });
          socket.send(JSON.stringify({
            type: 'error',
            payload: {
              message: 'Invalid playlist data or devices'
            }
          }));
          return;
        }

        try {
          // Burada playlist sync işlemlerini gerçekleştir
          console.log('Processing playlist with ID:', playlist.id);
          console.log('Target devices:', devices);
          
          // Başarılı yanıt gönder
          socket.send(JSON.stringify({
            type: 'sync_success',
            payload: {
              playlistId: playlist.id,
              deviceCount: devices.length
            }
          }));
        } catch (error) {
          console.error('Error processing playlist:', error);
          socket.send(JSON.stringify({
            type: 'error',
            payload: {
              message: error instanceof Error ? error.message : 'Unknown error occurred'
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        payload: {
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      }));
    }
  };

  socket.onerror = (e) => console.log('WebSocket error:', e);
  socket.onclose = () => console.log('WebSocket connection closed');

  return response;
});