const express = require('express');
require('dotenv').config();

const fetchFn =
  typeof global.fetch === 'function'
    ? (...args) => global.fetch(...args)
    : (...args) => import('node-fetch').then(({ default: fetchModule }) => fetchModule(...args));

const app = express();
const port = process.env.PORT || 3001;

const LIVE_ENDPOINT =
  process.env.DVLA_API_URL || 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';
const TEST_ENDPOINT =
  process.env.DVLA_API_TEST_URL || 'https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';
const CACHE_TTL_MS = Number(process.env.DVLA_CACHE_TTL_MS || 5 * 60 * 1000);

const vrmCache = new Map();

app.get('/api/dvla', async (req, res) => {
  const rawVrm = (req.query.vrm || '').toString().trim();
  if (!rawVrm) {
    return res.status(400).json({ error: 'VRM parameter is required' });
  }

  const vrm = rawVrm.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!/^[A-Z0-9]{1,8}$/.test(vrm)) {
    return res.status(400).json({ error: 'Invalid VRM format' });
  }

  const envOverride = (req.query.env || req.query.environment || '').toLowerCase();
  const { endpoint, apiKey, context } = selectCredentials(envOverride);

  if (!apiKey) {
    console.error('DVLA API key missing for context:', context);
    return res.status(500).json({ error: 'DVLA API key not configured' });
  }

  const cacheKey = `${context}:${vrm}`;
  const cached = vrmCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return res.json(cached.payload);
  }

  try {
    const dvlaResponse = await fetchFn(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ registrationNumber: vrm })
    });

    if (!dvlaResponse.ok) {
      if (dvlaResponse.status === 404) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      if (dvlaResponse.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      const errorBody = await safeReadBody(dvlaResponse);
      console.error('DVLA API error', dvlaResponse.status, errorBody);
      return res.status(502).json({ error: 'DVLA lookup failed' });
    }

    const payload = await dvlaResponse.json();
    const normalized = normalizeVehicle(payload, vrm);

    vrmCache.set(cacheKey, {
      payload: normalized,
      expiresAt: Date.now() + CACHE_TTL_MS
    });

    return res.json(normalized);
  } catch (error) {
    console.error('DVLA lookup error', error);
    return res.status(502).json({ error: 'Unable to reach DVLA service' });
  }
});

app.listen(port, () => {
  console.log(`DVLA proxy listening at http://localhost:${port}`);
});

function selectCredentials(envOverride) {
  const testPreferred =
    envOverride === 'test' ||
    (!envOverride && process.env.NODE_ENV !== 'production' && process.env.DVLA_API_TEST_KEY);

  if (testPreferred && process.env.DVLA_API_TEST_KEY) {
    return {
      endpoint: TEST_ENDPOINT,
      apiKey: process.env.DVLA_API_TEST_KEY,
      context: 'test'
    };
  }

  return {
    endpoint: LIVE_ENDPOINT,
    apiKey: process.env.DVLA_API_KEY,
    context: 'live'
  };
}

function normalizeVehicle(payload, fallbackVrm) {
  const registration = (payload?.registrationNumber || fallbackVrm || '').toUpperCase();
  const year =
    payload?.yearOfManufacture ||
    (payload?.monthOfFirstRegistration ? new Date(payload.monthOfFirstRegistration).getFullYear() : undefined) ||
    (payload?.registrationDate ? new Date(payload.registrationDate).getFullYear() : undefined) ||
    null;

  return {
    vrm: registration,
    make: payload?.make || '',
    model: payload?.model || '',
    year,
    colour: payload?.colour || '',
    body: payload?.bodyType || '',
    fuel: payload?.fuelType || ''
  };
}

async function safeReadBody(response) {
  try {
    const text = await response.text();
    return text.slice(0, 500);
  } catch (error) {
    return '<unreadable>';
  }
}
