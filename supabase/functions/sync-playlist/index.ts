import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { token } = new URL(req.url).searchParams;
  
  if (!token) {
    console.error('Token is required');
    return new Response(
      JSON.stringify({ error: 'Token is required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('Expected websocket upgrade', { status: 426 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  // Validate device token
  const { data: deviceToken, error: tokenError } = await supabase
    .from('device_tokens')
    .select('token')
    .eq('token', token)
    .in('status', ['active', 'used'])
    .single();

  if (tokenError || !deviceToken) {
    console.error('Invalid or expired token');
    return new Response(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.type === 'sync_playlist') {
        const { playlist } = data.payload;
        console.log(`Syncing playlist ${playlist.id}`);
        
        // Send success response
        socket.send(JSON.stringify({
          type: 'sync_success',
          payload: {
            playlistId: playlist.id
          }
        }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        payload: error.message
      }));
    }
  };

  socket.onerror = (e) => console.log('WebSocket error:', e);
  socket.onclose = () => console.log('WebSocket connection closed');

  return response;
});