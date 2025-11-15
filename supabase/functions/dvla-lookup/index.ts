import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LIVE_ENDPOINT = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';
const TEST_ENDPOINT = 'https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const vrmCache = new Map<string, { payload: any; expiresAt: number }>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let rawVrm = '';
    
    // Try to get VRM from body first, then fall back to query params
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        rawVrm = body.vrm?.trim() || '';
      } catch {
        // If body parsing fails, try query params
        rawVrm = url.searchParams.get('vrm')?.trim() || '';
      }
    } else {
      rawVrm = url.searchParams.get('vrm')?.trim() || '';
    }
    
    if (!rawVrm) {
      return new Response(
        JSON.stringify({ error: 'VRM parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate and clean VRM
    const vrm = rawVrm.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^[A-Z0-9]{1,8}$/.test(vrm)) {
      return new Response(
        JSON.stringify({ error: 'Invalid VRM format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Select credentials based on environment
    const envOverride = url.searchParams.get('env')?.toLowerCase() || '';
    const useTest = envOverride === 'test';

    const endpoint = useTest ? TEST_ENDPOINT : LIVE_ENDPOINT;
    const apiKey = useTest ? Deno.env.get('DVLA_API_TEST_KEY') : Deno.env.get('DVLA_API_KEY');
    const context = useTest ? 'test' : 'live';

    if (!apiKey) {
      console.error('DVLA API key missing for context:', context);
      return new Response(
        JSON.stringify({ error: 'DVLA API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check cache
    const cacheKey = `${context}:${vrm}`;
    const cached = vrmCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      console.log('Returning cached result for VRM:', vrm);
      return new Response(
        JSON.stringify(cached.payload),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call DVLA API
    console.log('Calling DVLA API for VRM:', vrm, 'context:', context);

    const dvlaResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({ registrationNumber: vrm }),
    });

    if (!dvlaResponse.ok) {
      if (dvlaResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: 'Vehicle not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      if (dvlaResponse.status === 403) {
        console.error('DVLA API key unauthorized or invalid');
        return new Response(
          JSON.stringify({ error: 'DVLA API key invalid or unauthorized. Please check your API credentials.' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      if (dvlaResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const errorBody = await dvlaResponse.text();
      console.error('DVLA API error', dvlaResponse.status, errorBody.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'DVLA lookup failed' }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const payload = await dvlaResponse.json();
    
    // Normalize response
    const year = payload?.yearOfManufacture ||
      (payload?.monthOfFirstRegistration ? new Date(payload.monthOfFirstRegistration).getFullYear() : undefined) ||
      (payload?.registrationDate ? new Date(payload.registrationDate).getFullYear() : undefined) ||
      null;

    const normalized = {
      vrm: (payload?.registrationNumber || vrm).toUpperCase(),
      make: payload?.make || '',
      model: payload?.model || '',
      year,
      colour: payload?.colour || '',
      body: payload?.bodyType || '',
      fuel: payload?.fuelType || '',
    };

    // Cache the result
    vrmCache.set(cacheKey, {
      payload: normalized,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    console.log('DVLA lookup successful for VRM:', vrm);
    return new Response(
      JSON.stringify(normalized),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('DVLA lookup error:', error);
    return new Response(
      JSON.stringify({ error: 'Unable to reach DVLA service' }),
      { 
        status: 502, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
