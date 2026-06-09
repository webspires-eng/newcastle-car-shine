import { getInquiriesPage, getInquiryStats, DEFAULT_PAGE_SIZE } from "@/lib/inquiries";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const hasEnv = Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY)
  );

  const [{ rows, total }, stats] = await Promise.all([
    getInquiriesPage({ page: 1, pageSize: DEFAULT_PAGE_SIZE }),
    getInquiryStats(),
  ]);

  return (
    <AdminDashboardClient
      initialBookings={rows}
      initialTotal={total}
      initialStats={stats}
      initialPageSize={DEFAULT_PAGE_SIZE}
      envOk={hasEnv}
    />
  );
}
