"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Spinner } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, LayoutDashboard, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const studentNav = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/dashboard/bookings",
    label: "My Bookings",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    href: "/dashboard/profile",
    label: "My Profile",
    icon: <User className="h-4 w-4" />,
  },
];

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={studentNav} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
