import { getAllInquiries } from "@/lib/inquiries";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const bookings = await getAllInquiries();
  return <AdminDashboardClient initialBookings={bookings} />;
}
