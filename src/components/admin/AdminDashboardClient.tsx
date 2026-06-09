"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, LogOut, Search } from "lucide-react";
import type { Booking, BookingStatus } from "@/types";
import { BookingModal } from "@/components/admin/BookingModal";

const STATUSES: ("all" | BookingStatus)[] = ["all", "new", "contacted", "completed", "cancelled"];
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const statusBadge: Record<BookingStatus, string> = {
  new: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30",
  contacted: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30",
  completed: "bg-green-500/20 text-green-300 ring-1 ring-green-400/30",
  cancelled: "bg-red-500/20 text-red-300 ring-1 ring-red-400/30",
};

interface Stats {
  total: number;
  new: number;
  contacted: number;
  completed: number;
}

interface Props {
  initialBookings: Booking[];
  initialTotal: number;
  initialStats: Stats;
  initialPageSize: number;
  envOk?: boolean;
}

/** Build a compact page-number list with ellipsis sentinels (-1). */
function pageItems(current: number, totalPages: number): number[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const items = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...items].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: number[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push(-1); // ellipsis
    out.push(p);
    prev = p;
  }
  return out;
}

export function AdminDashboardClient({
  initialBookings,
  initialTotal,
  initialStats,
  initialPageSize,
  envOk = true,
}: Props) {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [total, setTotal] = useState(initialTotal);
  const [stats, setStats] = useState<Stats>(initialStats);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // debounced value used for fetching
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);

  // Debounce the search box; reset to page 1 whenever the term changes.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      const q = search.trim();
      if (q) params.set("search", q);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = (await res.json()) as { rows: Booking[]; total: number; stats: Stats };
      setBookings(data.rows);
      setTotal(data.total);
      setStats(data.stats);
      // If the result set shrank below the current page (e.g. a status change
      // moved rows out of the filter), step back to the last valid page.
      const lastPage = Math.max(1, Math.ceil(data.total / pageSize));
      if (page > lastPage) setPage(lastPage);
    } catch (err) {
      console.error("[admin] load failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  // Skip the very first run — the initial page is supplied by the server render.
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function updateBooking(updated: Booking) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setSelected(updated);
    // A status change can move the row in/out of the current filter and shifts
    // the global counts — re-sync the visible page and stat cards.
    load();
  }

  async function logOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Sell My Car Newcastle</h1>
            <p className="text-xs text-gray-400">Admin dashboard</p>
          </div>
          <button
            onClick={logOut}
            className="flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!envOk && (
          <div className="mb-6 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 px-4 py-3 text-sm text-red-200">
            <p className="font-semibold mb-1">Supabase env vars missing on server.</p>
            <p>
              Set <code className="font-mono text-red-100">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono text-red-100">SUPABASE_SERVICE_ROLE_KEY</code> in your
              Vercel project settings, then redeploy.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Total Bookings" value={stats.total} colour="text-white" />
          <StatCard label="New" value={stats.new} colour="text-blue-400" />
          <StatCard label="Contacted" value={stats.contacted} colour="text-amber-400" />
          <StatCard label="Completed" value={stats.completed} colour="text-green-400" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by ID, reg, name, email…"
              className="w-full bg-gray-900 ring-1 ring-gray-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-amber-400/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | BookingStatus);
              setPage(1);
            }}
            className="bg-gray-900 ring-1 ring-gray-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none capitalize"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize bg-gray-900">
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-900/50 ring-1 ring-gray-800 rounded-xl overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              {loading ? (
                <p className="text-lg flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading…
                </p>
              ) : (
                <>
                  <p className="text-lg mb-1">No bookings match your filters.</p>
                  <p className="text-sm">Try clearing the search or status filter.</p>
                </>
              )}
            </div>
          ) : (
            <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-50" : ""}`}>
              <table className="min-w-full divide-y divide-gray-800 text-sm">
                <thead className="bg-gray-900/80 text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Booking ID</th>
                    <th className="px-4 py-3 text-left">Vehicle</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Estimated</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Submitted</th>
                    <th className="px-4 py-3 hidden sm:table-cell" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="hover:bg-gray-800/40 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-amber-400 whitespace-nowrap hidden lg:table-cell">{b.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{b.reg}</div>
                        <div className="text-xs text-gray-400">
                          {b.make} {b.model} {b.year}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white">{`${b.firstName} ${b.lastName}`.trim()}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[180px]">{b.email}</div>
                        <div className="text-xs text-gray-400">{b.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-green-400 whitespace-nowrap hidden md:table-cell">
                        £{Number(b.estimatedValue || 0).toLocaleString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusBadge[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap hidden md:table-cell">
                        {new Date(b.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(b);
                          }}
                          className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination footer */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>
              {total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
            </span>
            <label className="flex items-center gap-2">
              <span className="hidden sm:inline">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-gray-900 ring-1 ring-gray-800 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n} className="bg-gray-900">
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="flex items-center gap-1 text-sm bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-md"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {pageItems(page, totalPages).map((p, i) =>
              p === -1 ? (
                <span key={`gap-${i}`} className="px-2 text-gray-500 select-none">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={loading}
                  aria-current={p === page ? "page" : undefined}
                  className={`min-w-[2rem] text-sm px-2.5 py-1.5 rounded-md disabled:cursor-not-allowed ${
                    p === page
                      ? "bg-amber-500 text-gray-950 font-semibold"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="flex items-center gap-1 text-sm bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-md"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdated={updateBooking}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, colour }: { label: string; value: number; colour: string }) {
  return (
    <div className="bg-gray-900/50 ring-1 ring-gray-800 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colour}`}>{value}</p>
    </div>
  );
}
