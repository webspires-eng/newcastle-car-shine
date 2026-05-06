"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Search } from "lucide-react";
import type { Booking, BookingStatus } from "@/types";
import { BookingModal } from "@/components/admin/BookingModal";

const STATUSES: ("all" | BookingStatus)[] = ["all", "new", "contacted", "completed", "cancelled"];

const statusBadge: Record<BookingStatus, string> = {
  new: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30",
  contacted: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30",
  completed: "bg-green-500/20 text-green-300 ring-1 ring-green-400/30",
  cancelled: "bg-red-500/20 text-red-300 ring-1 ring-red-400/30",
};

interface Props {
  initialBookings: Booking[];
}

export function AdminDashboardClient({ initialBookings }: Props) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  const counts = useMemo(() => {
    return {
      total: bookings.length,
      new: bookings.filter((b) => b.status === "new").length,
      contacted: bookings.filter((b) => b.status === "contacted").length,
      completed: bookings.filter((b) => b.status === "completed").length,
    };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        b.id,
        b.reg,
        `${b.firstName} ${b.lastName}`,
        b.email,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [bookings, search, statusFilter]);

  function updateBooking(updated: Booking) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setSelected(updated);
  }

  async function logOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Bookings" value={counts.total} colour="text-white" />
          <StatCard label="New" value={counts.new} colour="text-blue-400" />
          <StatCard label="Contacted" value={counts.contacted} colour="text-amber-400" />
          <StatCard label="Completed" value={counts.completed} colour="text-green-400" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, reg, name, email…"
              className="w-full bg-gray-900 ring-1 ring-gray-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-amber-400/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | BookingStatus)}
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
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-lg mb-1">No bookings match your filters.</p>
              <p className="text-sm">Try clearing the search or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800 text-sm">
                <thead className="bg-gray-900/80 text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Booking ID</th>
                    <th className="px-4 py-3 text-left">Vehicle</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Estimated</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="hover:bg-gray-800/40 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-amber-400 whitespace-nowrap">{b.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{b.reg}</div>
                        <div className="text-xs text-gray-400">
                          {b.make} {b.model} {b.year}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white">{`${b.firstName} ${b.lastName}`.trim()}</div>
                        <div className="text-xs text-gray-400">{b.email}</div>
                        <div className="text-xs text-gray-400">{b.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-green-400 whitespace-nowrap">
                        £{Number(b.estimatedValue || 0).toLocaleString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusBadge[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {new Date(b.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
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
