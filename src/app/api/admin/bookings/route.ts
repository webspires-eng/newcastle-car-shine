import { NextResponse } from "next/server";
import {
  getInquiriesPage,
  getInquiryStats,
  DEFAULT_PAGE_SIZE,
  updateInquiry,
} from "@/lib/inquiries";
import type { BookingStatus } from "@/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10);
  const search = url.searchParams.get("search") || "";
  const statusParam = url.searchParams.get("status") || "all";
  const status = statusParam as "all" | BookingStatus;

  const [{ rows, total }, stats] = await Promise.all([
    getInquiriesPage({ page, pageSize, search, status }),
    getInquiryStats(),
  ]);

  return NextResponse.json({ rows, total, stats });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id: string | undefined = body?.id;
  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  const updated = await updateInquiry(id, {
    status: body.status,
    offeredPrice: body.offeredPrice,
    notes: body.notes,
  });

  if (!updated) {
    return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
