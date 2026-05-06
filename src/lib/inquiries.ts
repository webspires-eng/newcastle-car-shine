import "server-only";
import { getServiceClient } from "@/lib/supabase-server";
import type { Booking, BookingEmail, BookingStatus } from "@/types";

interface InquiryRow {
  id: string;
  created_at: string;
  status: BookingStatus | null;
  name: string;
  email: string;
  phone: string;
  postcode: string | null;
  registration_number: string;
  make: string;
  model: string;
  mileage: number;
  transmission: string | null;
  hpi_clear: boolean | null;
  condition: string | null;
  notes: string | null;
  internal_notes: string | null;
  offered_price: number | null;
  year: number | null;
  colour: string | null;
  fuel_type: string | null;
  engine_capacity: number | null;
  body_type: string | null;
  emails: BookingEmail[] | null;
}

function mapRow(row: InquiryRow): Booking {
  const [firstName, ...rest] = (row.name || "").trim().split(/\s+/);
  const lastName = rest.join(" ");

  const hpi: Booking["hpiClear"] =
    row.hpi_clear === true ? "yes" : row.hpi_clear === false ? "no" : row.hpi_clear === null ? "" : "";

  return {
    id: row.id,
    createdAt: row.created_at,
    status: (row.status ?? "new") as BookingStatus,
    reg: (row.registration_number || "").toUpperCase(),
    make: row.make ?? "",
    model: row.model ?? "",
    year: row.year ?? "",
    mileage: row.mileage ?? "",
    condition: row.condition ?? "",
    colour: row.colour ?? "",
    fuelType: row.fuel_type ?? "",
    engineCapacity: row.engine_capacity ?? "",
    bodyType: row.body_type ?? "",
    transmission: row.transmission ?? "",
    hpiClear: hpi,
    firstName: firstName ?? "",
    lastName,
    email: row.email ?? "",
    phone: row.phone ?? "",
    postcode: row.postcode ?? "",
    estimatedValue: 0,
    offeredPrice: row.offered_price ?? undefined,
    notes: row.internal_notes ?? "",
    emails: Array.isArray(row.emails) ? row.emails : [],
  };
}

export async function getAllInquiries(): Promise<Booking[]> {
  let sb;
  try {
    sb = getServiceClient();
  } catch (err) {
    console.error("[inquiries] supabase client init failed:", err);
    return [];
  }
  const { data, error } = await sb
    .from("vehicle_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[inquiries] fetch failed:", error.message);
    return [];
  }
  return (data as InquiryRow[]).map(mapRow);
}

export async function updateInquiry(
  id: string,
  updates: Partial<Pick<Booking, "status" | "offeredPrice" | "notes">>
): Promise<Booking | null> {
  let sb;
  try {
    sb = getServiceClient();
  } catch (err) {
    console.error("[inquiries] supabase client init failed:", err);
    return null;
  }

  const patch: Record<string, unknown> = {};
  if (updates.status) patch.status = updates.status;
  if ("offeredPrice" in updates) patch.offered_price = updates.offeredPrice ?? null;
  if ("notes" in updates) patch.internal_notes = updates.notes ?? null;

  const { data, error } = await sb
    .from("vehicle_inquiries")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[inquiries] update failed:", error.message);
    return null;
  }
  return mapRow(data as InquiryRow);
}
