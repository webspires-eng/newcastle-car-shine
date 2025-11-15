import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DVLA_ENDPOINT = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const vrmCache = new Map<string, { payload: any; expiresAt: number }>();

async function fetchWithRetry(url: string, init: RequestInit, attempts = 3) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err) {
      clearTimeout(timeout);
      lastErr = err;
      const backoff = 300 * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw lastErr;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let rawVrm = '';
    
    // Get VRM from body
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        rawVrm = body.vrm?.trim() || '';
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid request body' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
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

    const apiKey = Deno.env.get('DVLA_API_KEY');
    if (!apiKey) {
      console.error('DVLA API key not configured');
      return new Response(
        JSON.stringify({ error: 'DVLA API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check cache
    const cached = vrmCache.get(vrm);
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
    console.log('Calling DVLA API for VRM:', vrm);

    const dvlaResponse = await fetchWithRetry(DVLA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
        console.error('DVLA API key unauthorized');
        return new Response(
          JSON.stringify({ error: 'DVLA API key unauthorized' }),
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
    vrmCache.set(vrm, {
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
