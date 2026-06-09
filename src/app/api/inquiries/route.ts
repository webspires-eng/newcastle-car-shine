import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-server";

interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  registration_number: string;
  make: string;
  model: string;
  mileage: number;
  transmission: string;
  year: number | null;
  colour: string | null;
  fuel_type: string | null;
  engine_capacity: number | null;
  body_type: string | null;
  hpi_clear: boolean | null;
  condition: string;
  notes: string | null;
}

export async function POST(req: Request) {
  let payload: InquiryPayload;
  try {
    payload = (await req.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.name || !payload.email || !payload.phone || !payload.registration_number) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Lead qualification gate (defensive — the form also enforces this client-side).
  // Accept ONLY IF mileage < 100,000 AND year of manufacture <= 2017.
  const MAX_MILEAGE = 100000;
  const MAX_YEAR = 2017;
  const mileageNum = Number(payload.mileage);
  const yearNum = payload.year != null ? Number(payload.year) : null;
  const qualifies =
    Number.isFinite(mileageNum) &&
    mileageNum > 0 &&
    mileageNum < MAX_MILEAGE &&
    yearNum != null &&
    Number.isFinite(yearNum) &&
    yearNum <= MAX_YEAR;
  if (!qualifies) {
    return NextResponse.json(
      { error: "We're not buying vehicles of this age or mileage right now." },
      { status: 422 }
    );
  }

  let sb;
  try {
    sb = getServiceClient();
  } catch (err) {
    console.error("[inquiries] supabase client init failed:", err);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const { data, error } = await sb
    .from("vehicle_inquiries")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("[inquiries] insert failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
