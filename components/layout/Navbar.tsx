"use client";

import { Avatar } from "@/components/ui";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, logout, isStudent, isTutor, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getDashboardPath = () => {
    if (isAdmin) return "/admin";
    if (isTutor) return "/tutor/dashboard";
    return "/dashboard";
  };

  const navLinks = [
    { href: "/tutors", label: " Tutors" },
    { href: "/tutors?featured=true", label: "Featured" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-brand">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">
              Skill<span className="text-brand-500">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-body font-medium transition-colors",
                  pathname === link.href
                    ? "text-brand-600"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                  <span className="text-sm font-medium font-body text-slate-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-slate-400 transition-transform",
                      dropOpen && "rotate-180",
                    )}
                  />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-card-hover py-1 animate-fade-up">
                    <div className="px-4 py-2.5 border-b border-slate-50">
                      <p className="text-xs font-body text-slate-500 capitalize">
                        {user.role}
                      </p>
                      <p className="text-sm font-medium font-body text-slate-800 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      href={isTutor ? "/tutor/profile" : "/dashboard/profile"}
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <div className="border-t border-slate-50 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 animate-fade-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-body text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href={getDashboardPath()}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-body text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-sm font-body text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link href="/auth/login" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register" className="flex-1">
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
