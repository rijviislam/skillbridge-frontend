"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Spinner } from "@/components/ui";
import { LayoutDashboard, Users, CalendarDays, Tag } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/bookings", label: "All Bookings", icon: <CalendarDays className="h-4 w-4" /> },
  { href: "/admin/categories", label: "Categories", icon: <Tag className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
    if (!loading && user && !isAdmin) router.replace("/");
  }, [user, loading, isAdmin, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={adminNav} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
