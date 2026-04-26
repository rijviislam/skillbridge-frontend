"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BookOpenCheck,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

function RegisterContent() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const defaultRole =
    searchParams.get("role") === "tutor" ? "tutor" : "student";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole as "student" | "tutor",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success("Account created! Welcome to SkillBridge 🎉");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-slate-900 text-xl">
              Skill<span className="text-brand-500">Bridge</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">
            Create your account
          </h1>
          <p className="text-slate-500 font-body text-sm">
            Join thousands of learners and tutors
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {
              role: "student" as const,
              label: "I want to learn",
              icon: <GraduationCap className="h-5 w-5" />,
              desc: "Find expert tutors",
            },
            {
              role: "tutor" as const,
              label: "I want to teach",
              icon: <BookOpenCheck className="h-5 w-5" />,
              desc: "Share your expertise",
            },
          ].map((opt) => (
            <button
              key={opt.role}
              type="button"
              onClick={() => setForm((f) => ({ ...f, role: opt.role }))}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all duration-200",
                form.role === opt.role
                  ? "border-brand-400 bg-brand-50 shadow-brand/20 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300",
              )}
            >
              <div
                className={cn(
                  "mb-1.5",
                  form.role === opt.role ? "text-brand-500" : "text-slate-400",
                )}
              >
                {opt.icon}
              </div>
              <p
                className={cn(
                  "text-sm font-medium font-body",
                  form.role === opt.role ? "text-brand-700" : "text-slate-700",
                )}
              >
                {opt.label}
              </p>
              <p className="text-xs text-slate-400 font-body">{opt.desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jane Smith"
              icon={<User className="h-4 w-4" />}
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="At least 6 characters"
              icon={<Lock className="h-4 w-4" />}
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
              size="lg"
            >
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 font-body mt-5">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-brand-600 font-medium hover:text-brand-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
