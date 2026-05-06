"use client";

import { useState, useMemo } from "react";
import { X, Save, Loader2, Mail } from "lucide-react";
import type { Booking, BookingStatus, BookingEmail } from "@/types";

const STATUSES: BookingStatus[] = ["new", "contacted", "completed", "cancelled"];

const statusBadge: Record<BookingStatus, string> = {
  new: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30",
  contacted: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30",
  completed: "bg-green-500/20 text-green-300 ring-1 ring-green-400/30",
  cancelled: "bg-red-500/20 text-red-300 ring-1 ring-red-400/30",
};

interface Props {
  booking: Booking;
  onClose: () => void;
  onUpdated: (b: Booking) => void;
}

type Tab = "details" | "emails" | "notes";

export function BookingModal({ booking, onClose, onUpdated }: Props) {
  const [tab, setTab] = useState<Tab>("details");
  const [statusSaving, setStatusSaving] = useState(false);
  const [offered, setOffered] = useState<string>(
    booking.offeredPrice != null ? String(booking.offeredPrice) : ""
  );
  const [offeredSaving, setOfferedSaving] = useState(false);
  const [notes, setNotes] = useState<string>(booking.notes ?? "");
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [openEmailIdx, setOpenEmailIdx] = useState<number | null>(null);

  async function patch(updates: Partial<Booking>): Promise<Booking> {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: booking.id, ...updates }),
    });
    if (!res.ok) throw new Error("Failed to update");
    return (await res.json()) as Booking;
  }

  async function changeStatus(s: BookingStatus) {
    setStatusSaving(true);
    try {
      const updated = await patch({ status: s });
      onUpdated(updated);
    } finally {
      setStatusSaving(false);
    }
  }

  async function saveOffered() {
    setOfferedSaving(true);
    try {
      const offeredPrice = offered === "" ? undefined : Number(offered);
      const updated = await patch({ offeredPrice });
      onUpdated(updated);
    } finally {
      setOfferedSaving(false);
    }
  }

  async function saveNotes() {
    setNotesSaving(true);
    setNotesSaved(false);
    try {
      const updated = await patch({ notes });
      onUpdated(updated);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    } finally {
      setNotesSaving(false);
    }
  }

  const submittedDate = useMemo(
    () =>
      new Date(booking.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [booking.createdAt]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-2xl xl:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-gray-900 ring-1 ring-gray-800 rounded-2xl shadow-2xl text-white flex flex-col">
        <div className="flex items-start justify-between gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-800">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-mono text-xs text-amber-400 tracking-wider">{booking.id}</span>
            <h2 className="text-xl font-bold truncate">
              {booking.reg} – {booking.make} {booking.model}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={booking.status}
                disabled={statusSaving}
                onChange={(e) => changeStatus(e.target.value as BookingStatus)}
                className={`text-xs font-medium rounded-full px-3 py-1.5 bg-gray-800 ring-1 ring-gray-700 capitalize ${statusBadge[booking.status]}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-gray-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
              {statusSaving && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full bg-gray-800 hover:bg-gray-700 p-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-800 px-6">
          {(["details", "emails", "notes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition capitalize ${
                tab === t
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {t === "details" ? "Full Details" : t === "emails" ? "Emails" : "Notes"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-6 py-6 flex-1">
          {tab === "details" && (
            <div className="space-y-8">
              <section>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Vehicle Details</h3>
                <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <Field label="Registration" value={booking.reg} />
                  <Field label="Make" value={booking.make} />
                  <Field label="Model" value={booking.model} />
                  <Field label="Year" value={booking.year ? String(booking.year) : ""} />
                  <Field
                    label="Mileage"
                    value={booking.mileage ? `${Number(booking.mileage).toLocaleString("en-GB")} mi` : ""}
                  />
                  <Field label="Colour" value={booking.colour ? booking.colour.toUpperCase() : ""} />
                  <Field label="Fuel" value={booking.fuelType ? booking.fuelType.toUpperCase() : ""} />
                  <Field
                    label="Engine"
                    value={booking.engineCapacity ? `${booking.engineCapacity}cc` : ""}
                  />
                  <Field label="Body type" value={booking.bodyType} />
                  <Field
                    label="Transmission"
                    value={booking.transmission ? booking.transmission.charAt(0).toUpperCase() + booking.transmission.slice(1) : ""}
                  />
                  <Field
                    label="Condition"
                    value={booking.condition ? booking.condition.charAt(0).toUpperCase() + booking.condition.slice(1) : ""}
                  />
                  <Field
                    label="HPI clear"
                    value={
                      booking.hpiClear === "yes" ? (
                        <span className="text-green-400">Yes</span>
                      ) : booking.hpiClear === "no" ? (
                        <span className="text-red-400">No</span>
                      ) : booking.hpiClear === "unsure" ? (
                        <span className="text-gray-400">Not sure</span>
                      ) : (
                        ""
                      )
                    }
                  />
                </dl>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Customer Details</h3>
                <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <Field label="Name" value={`${booking.firstName} ${booking.lastName}`.trim()} />
                  <Field
                    label="Email"
                    value={
                      <a href={`mailto:${booking.email}`} className="text-amber-400 hover:underline break-all">
                        {booking.email}
                      </a>
                    }
                  />
                  <Field label="Phone" value={booking.phone} />
                  <Field label="Postcode" value={booking.postcode} />
                  <Field label="Submitted" value={submittedDate} />
                </dl>
              </section>

              <section className="bg-gray-800/50 ring-1 ring-gray-800 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Estimated value</p>
                <p className="text-3xl font-bold text-green-400">
                  £{Number(booking.estimatedValue || 0).toLocaleString("en-GB")}
                </p>
                <div className="mt-5">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Offered price
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                      <input
                        type="number"
                        value={offered}
                        onChange={(e) => setOffered(e.target.value)}
                        placeholder="0"
                        className="w-full bg-gray-900 ring-1 ring-gray-700 rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none focus:ring-amber-400/50"
                      />
                    </div>
                    <button
                      onClick={saveOffered}
                      disabled={offeredSaving}
                      className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {offeredSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {tab === "emails" && (
            <div className="space-y-3">
              {booking.emails.length === 0 ? (
                <p className="text-sm text-gray-400">No emails recorded for this booking yet.</p>
              ) : (
                booking.emails.map((email, idx) => (
                  <EmailRow
                    key={idx}
                    email={email}
                    open={openEmailIdx === idx}
                    onToggle={() => setOpenEmailIdx(openEmailIdx === idx ? null : idx)}
                  />
                ))
              )}
            </div>
          )}

          {tab === "notes" && (
            <div className="space-y-4">
              <textarea
                rows={10}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes – only visible in admin."
                className="w-full bg-gray-800 ring-1 ring-gray-700 rounded-lg p-4 text-sm text-white focus:outline-none focus:ring-amber-400/50"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={saveNotes}
                  disabled={notesSaving}
                  className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {notesSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Notes
                </button>
                {notesSaved && <span className="text-sm text-green-400">Notes saved.</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="text-white">{value || <span className="text-gray-500">—</span>}</dd>
    </div>
  );
}

function EmailRow({
  email,
  open,
  onToggle,
}: {
  email: BookingEmail;
  open: boolean;
  onToggle: () => void;
}) {
  const badge =
    email.type === "user"
      ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30"
      : "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30";

  const sentAt = new Date(email.sentAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="ring-1 ring-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 text-left bg-gray-800/40 hover:bg-gray-800/70"
      >
        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className={`text-xs uppercase font-medium px-2 py-0.5 rounded-full ${badge}`}>
          {email.type === "user" ? "User" : "Admin"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white truncate">{email.subject}</p>
          <p className="text-xs text-gray-400 truncate">to {email.to}</p>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">{sentAt}</span>
      </button>
      {open && (
        <pre className="bg-gray-950 text-xs text-gray-300 p-4 whitespace-pre-wrap font-mono overflow-x-auto border-t border-gray-800">
          {email.body}
        </pre>
      )}
    </div>
  );
}
