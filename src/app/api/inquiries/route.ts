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

  // ---- Deduplication / rapid-repeat guard ----
  // If a booking with the same registration AND a matching email or phone was
  // created within the dedup window, update that record instead of inserting a
  // duplicate. This collapses rapid repeat submissions of the same vehicle.
  const windowHours = Number(process.env.DEDUP_WINDOW_HOURS) || 24;
  const since = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
  const emailNorm = payload.email.trim().toLowerCase();
  const phoneNorm = payload.phone.replace(/\D/g, "");

  try {
    const { data: recent } = await sb
      .from("vehicle_inquiries")
      .select("id, email, phone")
      .eq("registration_number", payload.registration_number)
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    const dup = (recent ?? []).find(
      (r: { id: string; email: string | null; phone: string | null }) => {
        const sameEmail = emailNorm !== "" && (r.email || "").trim().toLowerCase() === emailNorm;
        const samePhone = phoneNorm !== "" && (r.phone || "").replace(/\D/g, "") === phoneNorm;
        return sameEmail || samePhone;
      }
    );

    if (dup) {
      // Refresh vehicle/contact details; leave status, offered_price,
      // internal_notes and the email log untouched (payload has no such keys).
      const { data: updated, error: updateError } = await sb
        .from("vehicle_inquiries")
        .update(payload)
        .eq("id", dup.id)
        .select("id")
        .single();
      if (!updateError && updated) {
        return NextResponse.json({ id: updated.id, deduped: true });
      }
      if (updateError) {
        console.error("[inquiries] dedup update failed, inserting instead:", updateError.message);
      }
    }
  } catch (err) {
    console.error("[inquiries] dedup check failed (continuing to insert):", err);
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
