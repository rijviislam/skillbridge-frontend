"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const role = user.role?.toUpperCase();
      if (role === "ADMIN") router.replace("/admin");
      else if (role === "TUTOR") router.replace("/tutor/dashboard");
      else router.replace("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2 z-10">
          <div className="h-9 w-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-white text-xl">
            Skill<span className="text-brand-400">Bridge</span>
          </span>
        </Link>

        <div className="relative z-10">
          <blockquote className="font-display text-2xl text-white font-semibold leading-snug mb-4">
            "SkillBridge helped me ace my exams. My tutor was incredible."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center font-display font-bold text-white">
              R
            </div>
            <div>
              <p className="text-white font-body text-sm font-medium">
                Rijvi Islam
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              className="h-5 w-5 text-brand-400 fill-brand-400"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-slate-900 text-xl">
                Skill<span className="text-brand-500">Bridge</span>
              </span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">
            Welcome back
          </h1>
          <p className="text-slate-500 font-body text-sm mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 font-body mt-6">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
