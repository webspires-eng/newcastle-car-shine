import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Booking } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

async function ensureStore(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<Booking[]> {
  await ensureStore();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(bookings: Booking[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
}

export async function getAllBookings(): Promise<Booking[]> {
  const bookings = await readAll();
  return bookings.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const bookings = await readAll();
  return bookings.find((b) => b.id === id);
}

export async function saveBooking(booking: Booking): Promise<Booking> {
  const bookings = await readAll();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.push(booking);
  }
  await writeAll(bookings);
  return booking;
}

function generateId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BK-${ts}-${rand}`;
}

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt" | "status" | "emails"> & {
    status?: Booking["status"];
    emails?: Booking["emails"];
  }
): Promise<Booking> {
  const booking: Booking = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: data.status ?? "new",
    emails: data.emails ?? [],
    reg: data.reg,
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    condition: data.condition,
    colour: data.colour,
    serviceHistory: data.serviceHistory,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    postcode: data.postcode,
    estimatedValue: data.estimatedValue,
    offeredPrice: data.offeredPrice,
    notes: data.notes,
  };
  await saveBooking(booking);
  return booking;
}
