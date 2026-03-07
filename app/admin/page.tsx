"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { Card, Spinner, StatusBadge, Avatar } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, BookOpen, DollarSign, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          adminApi.getStats().catch(() => ({ data: {} })),
          adminApi.getBookings({ limit: 8 }),
        ]);
        setStats(statsRes.data?.data || statsRes.data || {});
        setRecentBookings(bookingsRes.data?.data || bookingsRes.data || []);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers ?? "—", icon: <Users className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-50", href: "/admin/users" },
    { label: "Total Bookings", value: stats.totalBookings ?? "—", icon: <BookOpen className="h-5 w-5" />, color: "text-brand-500", bg: "bg-brand-50", href: "/admin/bookings" },
    { label: "Total Revenue", value: stats.totalRevenue != null ? formatCurrency(stats.totalRevenue) : "—", icon: <DollarSign className="h-5 w-5" />, color: "text-green-500", bg: "bg-green-50", href: "#" },
    { label: "Active Tutors", value: stats.activeTutors ?? "—", icon: <TrendingUp className="h-5 w-5" />, color: "text-purple-500", bg: "bg-purple-50", href: "/admin/users" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 font-body text-sm mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <Link key={s.label} href={s.href}>
            <Card className="p-5 hover:shadow-card-hover transition-all cursor-pointer">
              <div className={`inline-flex p-2 rounded-xl ${s.bg} ${s.color} mb-3`}>
                {s.icon}
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-body mt-0.5">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-500" /> Recent Bookings
          </h2>
          <Link href="/admin/bookings" className="text-xs text-brand-600 hover:text-brand-700 font-body font-medium">View all</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : recentBookings.length === 0 ? (
          <p className="text-sm text-slate-400 font-body text-center py-8">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Student", "Tutor", "Subject", "Date", "Status", "Amount"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 font-body pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 pr-4 text-sm font-body text-slate-700">{b.student?.name || "—"}</td>
                    <td className="py-3 pr-4 text-sm font-body text-slate-700">{b.tutor?.user?.name || "—"}</td>
                    <td className="py-3 pr-4 text-sm font-body text-slate-600">{b.subject}</td>
                    <td className="py-3 pr-4 text-sm font-body text-slate-500">{formatDate(b.scheduledDate)}</td>
                    <td className="py-3 pr-4"><StatusBadge status={b.status} /></td>
                    <td className="py-3 text-sm font-display font-semibold text-slate-900">{formatCurrency(b.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
