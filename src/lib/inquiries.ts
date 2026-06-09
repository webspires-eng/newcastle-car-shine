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

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;

const VALID_STATUSES: BookingStatus[] = ["new", "contacted", "completed", "cancelled"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface InquiryStats {
  total: number;
  new: number;
  contacted: number;
  completed: number;
}

export interface InquiryPage {
  rows: Booking[];
  total: number;
}

export interface GetInquiriesPageOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "all" | BookingStatus;
}

/**
 * Server-side paginated, filtered fetch of inquiries. Only the requested page
 * of rows is read from the database (via .range), and `total` reflects the
 * full filtered count so the client can render page numbers and a count
 * indicator without loading every row.
 */
export async function getInquiriesPage(opts: GetInquiriesPageOptions): Promise<InquiryPage> {
  let sb;
  try {
    sb = getServiceClient();
  } catch (err) {
    console.error("[inquiries] supabase client init failed:", err);
    return { rows: [], total: 0 };
  }

  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(opts.pageSize ?? NaN)
    ? (opts.pageSize as number)
    : DEFAULT_PAGE_SIZE;
  const page = Number.isInteger(opts.page) && (opts.page as number) > 0 ? (opts.page as number) : 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = sb.from("vehicle_inquiries").select("*", { count: "exact" });

  if (opts.status && opts.status !== "all" && VALID_STATUSES.includes(opts.status)) {
    query = query.eq("status", opts.status);
  }

  // Strip characters that have special meaning in PostgREST's `or` filter
  // syntax so a free-text search can't break the query.
  const q = (opts.search || "").trim().replace(/[%,()]/g, " ").trim();
  if (q) {
    const like = `%${q}%`;
    const parts = [
      `registration_number.ilike.${like}`,
      `name.ilike.${like}`,
      `email.ilike.${like}`,
    ];
    // `id` is a uuid column — ilike isn't valid on it, so only match when the
    // query is a complete UUID (the realistic "pasted a booking ID" case).
    if (UUID_RE.test(q)) parts.push(`id.eq.${q}`);
    query = query.or(parts.join(","));
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[inquiries] paged fetch failed:", error.message);
    return { rows: [], total: 0 };
  }
  return { rows: (data as InquiryRow[]).map(mapRow), total: count ?? 0 };
}

/**
 * Global (unfiltered) status counts for the dashboard stat cards. Uses
 * head-only count queries so no row data is transferred.
 */
export async function getInquiryStats(): Promise<InquiryStats> {
  let sb;
  try {
    sb = getServiceClient();
  } catch (err) {
    console.error("[inquiries] supabase client init failed:", err);
    return { total: 0, new: 0, contacted: 0, completed: 0 };
  }

  const countFor = (status?: BookingStatus) => {
    let q = sb.from("vehicle_inquiries").select("*", { count: "exact", head: true });
    if (status) q = q.eq("status", status);
    return q;
  };

  const [total, neu, contacted, completed] = await Promise.all([
    countFor(),
    countFor("new"),
    countFor("contacted"),
    countFor("completed"),
  ]);

  return {
    total: total.count ?? 0,
    new: neu.count ?? 0,
    contacted: contacted.count ?? 0,
    completed: completed.count ?? 0,
  };
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
