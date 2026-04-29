"use client";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col ">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">
            Edu<span className="text-brand-400">Core</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-brand-500 flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate font-body">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 capitalize font-body">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-150",
                isActive
                  ? "bg-brand-500 text-white shadow-brand"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-white" : "text-slate-500",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-body font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
