"use client";

import {
  Card,
  EmptyState,
  Select,
  Spinner,
  StatusBadge,
} from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/types";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, unknown> = { page, limit: 20 };
    if (filter !== "all") params.status = filter;
    adminApi
      .getBookings(params)
      .then((r) => {
        const data = r.data?.data || r.data || [];
        const arr = Array.isArray(data) ? data : [];
        setBookings(arr);
        setTotal(r.data?.total || arr.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, page]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            All Bookings
          </h1>
          <p className="text-slate-500 font-body text-sm mt-0.5">
            {total} total bookings
          </p>
        </div>
   <Select
  options={[
    { value: "all", label: "All Status" },
    { value: "CONFIRMED", label: "Confirmed" }, 
    { value: "COMPLETED", label: "Completed" },   
    { value: "CANCELLED", label: "Cancelled" },  
  ]}
  value={filter}
  onChange={(e) => {
    setFilter(e.target.value);
    setPage(1);
  }}
  className="w-40"
/>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-10 w-10" />}
            title="No bookings found"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {[
                      "Student",
                      "Tutor",
                      "Subject",
                      "Date",
                      "Time",
                      "Status",
                      "Amount",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-medium text-slate-500 font-body px-4 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b: any) => (
                    <tr
                      key={b.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 text-sm font-body text-slate-700">
                        {b.student?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-body text-slate-700">
                        {b.tutor?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-body text-slate-600">
                        {b.availability
                          ? formatDate(b.availability.startTime)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-body text-slate-500">
                        {b.availability
                          ? formatDate(b.availability.startTime)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs font-body text-slate-500">
                        {b.availability ? (
                          <>
                            {formatTime(b.availability.startTime)} –{" "}
                            {formatTime(b.availability.endTime)}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                <td className="px-4 py-3 text-sm font-display font-semibold text-slate-900">
  {b.tutor?.tutorProfile?.hourlyRate
    ? `$${b.tutor.tutorProfile.hourlyRate}`
    : "—"}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total > 20 && (
              <div className="flex justify-center items-center gap-3 px-4 py-4 border-t border-slate-100">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="text-sm font-body text-slate-600 hover:text-slate-900 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm font-body text-slate-500">
                  Page {page} of {Math.ceil(total / 20)}
                </span>
                <button
                  disabled={page >= Math.ceil(total / 20)}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-sm font-body text-slate-600 hover:text-slate-900 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
