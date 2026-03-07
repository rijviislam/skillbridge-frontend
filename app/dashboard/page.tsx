"use client";

import { Avatar, Card, Spinner, StatusBadge } from "@/components/ui";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { bookingsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Booking } from "@/types";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle,
  Plus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi
      .getAll({ limit: 10 })
      .then((r) => {
        console.log("bookings response:", r.data);
        const data = r.data?.data || r.data?.bookings || r.data || [];
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: bookings.length,
    upcoming: bookings?.filter((b) => b.status === "confirmed").length,
    completed: bookings?.filter((b) => b.status === "completed").length,
    cancelled: bookings?.filter((b) => b.status === "cancelled").length,
  };

  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Good day, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 font-body text-sm mt-1">
          Here's your learning overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Bookings",
            value: stats.total,
            icon: <CalendarDays className="h-5 w-5" />,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: <BookOpen className="h-5 w-5" />,
            color: "text-brand-500",
            bg: "bg-brand-50",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: <CheckCircle className="h-5 w-5" />,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            icon: <XCircle className="h-5 w-5" />,
            color: "text-red-400",
            bg: "bg-red-50",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div
              className={`inline-flex p-2 rounded-xl ${stat.bg} ${stat.color} mb-3`}
            >
              {stat.icon}
            </div>
            <p className="font-display text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 font-body mt-0.5">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/tutors">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Book New Session
          </Button>
        </Link>
        <Link href="/dashboard/bookings">
          <Button variant="outline" size="sm">
            View All Bookings <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Recent bookings */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-slate-900">
            Recent Bookings
          </h2>
          <Link
            href="/dashboard/bookings"
            className="text-xs text-brand-600 hover:text-brand-700 font-body font-medium"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-10">
            <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-body mb-4">
              No bookings yet
            </p>
            <Link href="/tutors">
              <Button size="sm">Find a Tutor</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Avatar name={b.tutor?.user?.name || "T"} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 font-body truncate">
                    {b.tutor?.user?.name || "Tutor"}
                  </p>
                  <p className="text-xs text-slate-500 font-body">
                    {b.subject} · {formatDate(b.scheduledDate)}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
