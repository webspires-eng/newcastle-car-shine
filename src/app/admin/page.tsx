import { getAllBookings } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const bookings = await getAllBookings();
  return <AdminDashboardClient initialBookings={bookings} />;
}
