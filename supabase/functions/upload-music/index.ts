import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const bunnyStorageName = Deno.env.get('BUNNY_STORAGE_NAME')
  const bunnyStorageHost = Deno.env.get('BUNNY_STORAGE_HOST')
  const bunnyApiKey = Deno.env.get('BUNNY_API_KEY')

  console.log('Bunny.net configuration loaded:', {
    storageName: bunnyStorageName,
    storageHost: bunnyStorageHost,
    apiKeyExists: !!bunnyApiKey
  })

  return new Response(
    JSON.stringify({ 
      message: 'Bunny.net credentials configured successfully',
      storageName: bunnyStorageName,
      storageHost: bunnyStorageHost
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
})