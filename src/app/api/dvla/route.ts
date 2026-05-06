import { NextResponse } from "next/server";

const LIVE_ENDPOINT =
  process.env.DVLA_API_URL ||
  "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

export async function GET(req: Request) {
  const apiKey = process.env.DVLA_API_KEY;

  const url = new URL(req.url);
  const rawVrm = (url.searchParams.get("vrm") || "").trim();
  if (!rawVrm) {
    return NextResponse.json({ error: "VRM parameter is required" }, { status: 400 });
  }

  const vrm = rawVrm.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z0-9]{1,8}$/.test(vrm)) {
    return NextResponse.json({ error: "Invalid VRM format" }, { status: 400 });
  }

  if (!apiKey) {
    console.error("DVLA_API_KEY not configured");
    return NextResponse.json({ error: "DVLA API key not configured" }, { status: 500 });
  }

  try {
    const dvlaResponse = await fetch(LIVE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ registrationNumber: vrm }),
    });

    if (!dvlaResponse.ok) {
      if (dvlaResponse.status === 404) {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      }
      if (dvlaResponse.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
      if (dvlaResponse.status === 400) {
        try {
          const errorBody = await dvlaResponse.json();
          const detail =
            errorBody?.errors?.[0]?.detail || "Invalid registration number format";
          return NextResponse.json({ error: detail }, { status: 400 });
        } catch {
          return NextResponse.json(
            { error: "Invalid registration number format" },
            { status: 400 }
          );
        }
      }
      console.error("DVLA API error", dvlaResponse.status);
      return NextResponse.json({ error: "DVLA lookup failed" }, { status: 502 });
    }

    const payload = await dvlaResponse.json();

    const registration = (payload?.registrationNumber || vrm).toUpperCase();
    const year =
      payload?.yearOfManufacture ||
      (payload?.monthOfFirstRegistration
        ? new Date(payload.monthOfFirstRegistration).getFullYear()
        : null) ||
      null;

    const normalized = {
      vrm: registration,
      make: payload?.make || "",
      model: payload?.model || "",
      year,
      colour: payload?.colour || "",
      body: payload?.bodyType || "",
      fuel: payload?.fuelType || "",
      taxStatus: payload?.taxStatus || "",
      taxDueDate: payload?.taxDueDate || "",
      motStatus: payload?.motStatus || "",
      engineCapacity: payload?.engineCapacity || null,
      co2Emissions: payload?.co2Emissions || null,
      euroStatus: payload?.euroStatus || "",
      wheelplan: payload?.wheelplan || "",
      typeApproval: payload?.typeApproval || "",
      revenueWeight: payload?.revenueWeight || null,
      monthOfFirstRegistration: payload?.monthOfFirstRegistration || "",
      dateOfLastV5CIssued: payload?.dateOfLastV5CIssued || "",
    };

    return NextResponse.json(normalized, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" },
    });
  } catch (error) {
    console.error("DVLA lookup error", error);
    return NextResponse.json(
      { error: "Unable to reach DVLA service" },
      { status: 502 }
    );
  }
}
