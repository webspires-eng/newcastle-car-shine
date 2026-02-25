export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const LIVE_ENDPOINT = process.env.DVLA_API_URL || 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';
    const apiKey = process.env.DVLA_API_KEY;

    const rawVrm = (req.query.vrm || '').toString().trim();
    if (!rawVrm) {
        return res.status(400).json({ error: 'VRM parameter is required' });
    }

    const vrm = rawVrm.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^[A-Z0-9]{1,8}$/.test(vrm)) {
        return res.status(400).json({ error: 'Invalid VRM format' });
    }

    if (!apiKey) {
        console.error('DVLA_API_KEY not configured');
        return res.status(500).json({ error: 'DVLA API key not configured' });
    }

    try {
        const dvlaResponse = await fetch(LIVE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ registrationNumber: vrm }),
        });

        if (!dvlaResponse.ok) {
            if (dvlaResponse.status === 404) {
                return res.status(404).json({ error: 'Vehicle not found' });
            }
            if (dvlaResponse.status === 429) {
                return res.status(429).json({ error: 'Rate limit exceeded' });
            }
            if (dvlaResponse.status === 400) {
                try {
                    const errorBody = await dvlaResponse.json();
                    const detail = errorBody?.errors?.[0]?.detail || 'Invalid registration number format';
                    return res.status(400).json({ error: detail });
                } catch {
                    return res.status(400).json({ error: 'Invalid registration number format' });
                }
            }

            console.error('DVLA API error', dvlaResponse.status);
            return res.status(502).json({ error: 'DVLA lookup failed' });
        }

        const payload = await dvlaResponse.json();

        // Normalize vehicle data
        const registration = (payload?.registrationNumber || vrm).toUpperCase();
        const year =
            payload?.yearOfManufacture ||
            (payload?.monthOfFirstRegistration ? new Date(payload.monthOfFirstRegistration).getFullYear() : null) ||
            null;

        const normalized = {
            vrm: registration,
            make: payload?.make || '',
            model: payload?.model || '',
            year,
            colour: payload?.colour || '',
            body: payload?.bodyType || '',
            fuel: payload?.fuelType || '',
            taxStatus: payload?.taxStatus || '',
            taxDueDate: payload?.taxDueDate || '',
            motStatus: payload?.motStatus || '',
            engineCapacity: payload?.engineCapacity || null,
            co2Emissions: payload?.co2Emissions || null,
            euroStatus: payload?.euroStatus || '',
            wheelplan: payload?.wheelplan || '',
            typeApproval: payload?.typeApproval || '',
            revenueWeight: payload?.revenueWeight || null,
            monthOfFirstRegistration: payload?.monthOfFirstRegistration || '',
            dateOfLastV5CIssued: payload?.dateOfLastV5CIssued || '',
        };

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json(normalized);
    } catch (error) {
        console.error('DVLA lookup error', error);
        return res.status(502).json({ error: 'Unable to reach DVLA service' });
    }
}
