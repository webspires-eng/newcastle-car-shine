import { NextResponse } from "next/server";
import { getAllBookings, getBookingById, saveBooking } from "@/lib/db";

export async function GET() {
  const bookings = await getAllBookings();
  return NextResponse.json(bookings);
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id: string | undefined = body?.id;
  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
  }

  const { id: _ignored, createdAt: _ignored2, ...updates } = body;
  void _ignored;
  void _ignored2;

  const updated = { ...booking, ...updates };
  await saveBooking(updated);
  return NextResponse.json(updated);
}
