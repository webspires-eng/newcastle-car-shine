import { NextResponse } from "next/server";
import { getAllInquiries, updateInquiry } from "@/lib/inquiries";

export async function GET() {
  const bookings = await getAllInquiries();
  return NextResponse.json(bookings);
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
