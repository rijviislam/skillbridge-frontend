"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Spinner } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { Clock, LayoutDashboard, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const tutorNav = [
  {
    href: "/tutor/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/tutor/availability",
    label: "Availability",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    href: "/tutor/profile",
    label: "My Profile",
    icon: <User className="h-4 w-4" />,
  },
];

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isTutor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
    if (!loading && user && !isTutor) router.replace("/");
  }, [user, loading, isTutor, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (!user || !isTutor) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={tutorNav} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
