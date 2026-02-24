import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registrationNumber } = await req.json();

    if (!registrationNumber || typeof registrationNumber !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Registration number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const vrm = registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^[A-Z0-9]{1,8}$/.test(vrm)) {
      return new Response(
        JSON.stringify({ error: 'Invalid registration number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('DVLA_API_KEY');
    if (!apiKey) {
      console.error('DVLA_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'DVLA API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dvlaResponse = await fetch(
      'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ registrationNumber: vrm }),
      }
    );

    if (!dvlaResponse.ok) {
      if (dvlaResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: 'Vehicle not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await dvlaResponse.text();
      console.error('DVLA API error:', dvlaResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'DVLA lookup failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await dvlaResponse.json();

    const year =
      payload?.yearOfManufacture ||
      (payload?.monthOfFirstRegistration
        ? new Date(payload.monthOfFirstRegistration).getFullYear()
        : null);

    const result = {
      registrationNumber: (payload?.registrationNumber || vrm).toUpperCase(),
      make: payload?.make || '',
      model: payload?.model || '',
      year,
      colour: payload?.colour || '',
      fuelType: payload?.fuelType || '',
      engineCapacity: payload?.engineCapacity || null,
      co2Emissions: payload?.co2Emissions || null,
      taxStatus: payload?.taxStatus || '',
      motStatus: payload?.motStatus || '',
      motExpiryDate: payload?.motExpiryDate || null,
      taxDueDate: payload?.taxDueDate || null,
    };

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('DVLA lookup error:', error);
    return new Response(
      JSON.stringify({ error: 'Unable to reach DVLA service' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
