import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { DeviceManager } from './deviceManager.ts';
import { PlaylistHandler } from './playlistHandler.ts';
import { WebSocketMessage } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('Expected websocket upgrade', { status: 426, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  const { socket, response } = Deno.upgradeWebSocket(req);
  const deviceManager = new DeviceManager();
  const playlistHandler = new PlaylistHandler(supabase, deviceManager);
  let isAuthenticated = false;
  let userToken: string | null = null;

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;
      console.log('Received message:', data);

      if (data.type === 'authenticate') {
        const { data: { user }, error } = await supabase.auth.getUser(data.payload.token);
        
        if (error || !user) {
          socket.send(JSON.stringify({
            type: 'error',
            payload: { message: 'Authentication failed' }
          }));
          return;
        }

        isAuthenticated = true;
        userToken = data.payload.token;
        socket.send(JSON.stringify({ type: 'auth_success' }));
        return;
      }

      if (!isAuthenticated) {
        socket.send(JSON.stringify({
          type: 'error',
          payload: { message: 'Not authenticated' }
        }));
        return;
      }

      if (data.type === 'sync_playlist') {
        const result = await playlistHandler.handlePlaylistSync(data, userToken);
        socket.send(JSON.stringify(result));
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
  socket.onclose = () => {
    console.log('WebSocket connection closed');
    if (userToken) {
      deviceManager.removeDevice(userToken);
    }
  };

  return response;
});