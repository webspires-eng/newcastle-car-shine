import "server-only";
import { getServiceClient } from "@/lib/supabase-server";
import type { Booking, BookingStatus } from "@/types";

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
}

function mapRow(row: InquiryRow): Booking {
  const [firstName, ...rest] = (row.name || "").trim().split(/\s+/);
  const lastName = rest.join(" ");

  return {
    id: row.id,
    createdAt: row.created_at,
    status: (row.status ?? "new") as BookingStatus,
    reg: (row.registration_number || "").toUpperCase(),
    make: row.make ?? "",
    model: row.model ?? "",
    year: "",
    mileage: row.mileage ?? "",
    condition: row.condition ?? "",
    colour: "",
    serviceHistory:
      row.hpi_clear === true ? "HPI clear" : row.hpi_clear === false ? "HPI flagged" : "",
    firstName: firstName ?? "",
    lastName,
    email: row.email ?? "",
    phone: row.phone ?? "",
    postcode: row.postcode ?? "",
    estimatedValue: 0,
    offeredPrice: row.offered_price ?? undefined,
    notes: row.internal_notes ?? "",
    emails: [],
  };
}

export async function getAllInquiries(): Promise<Booking[]> {
  const sb = getServiceClient();
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
  const sb = getServiceClient();

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
