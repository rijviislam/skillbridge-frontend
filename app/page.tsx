"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TutorCard from "@/components/tutor/TutorCard";
import { Spinner } from "@/components/ui";
import Button from "@/components/ui/Button";
import { tutorsApi } from "@/lib/api";
import type { Category, TutorProfile } from "@/types";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Search,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [tutorRes, catRes] = await Promise.all([
          tutorsApi.getAll({ limit: 6, sort: "rating" }),
          tutorsApi.getCategories(),
        ]);

        const tutorPayload = tutorRes.data?.data;
        const tutorList = Array.isArray(tutorPayload)
          ? tutorPayload
          : (tutorPayload?.data ?? []);

        const catPayload = catRes.data?.data;
        const catList = Array.isArray(catPayload)
          ? catPayload
          : (catPayload?.data ?? []);

        setFeaturedTutors(tutorList);
        setCategories(catList);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tutors?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-pattern">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-100/40 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-50/60 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <Star className="h-3.5 w-3.5 text-brand-500 fill-brand-500" />
              <span className="text-xs font-body font-medium text-brand-700">
                Trusted by 10,000+ students
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 animate-fade-up">
              Learn from the{" "}
              <span className="relative inline-block text-brand-500">
                best tutors
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 4 150 2 298 8"
                    stroke="#d97213"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              , anywhere
            </h1>

            <p className="text-lg text-slate-600 font-body leading-relaxed mb-10 animate-fade-up animate-delay-100">
              Connect with expert tutors in any subject. Book sessions
              instantly, learn at your pace, and achieve your goals faster.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex gap-3 animate-fade-up animate-delay-200"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by subject, name…"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-card"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-2xl px-8">
                Search
              </Button>
            </form>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-10 animate-fade-up animate-delay-300">
              {[
                { label: "Expert Tutors", value: "500+" },
                { label: "Sessions Completed", value: "25K+" },
                { label: "Avg. Rating", value: "4.9★" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-2xl text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 font-body">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-1">
                Browse Categories
              </h2>
              <p className="text-slate-500 font-body text-sm">
                Find tutors in your area of interest
              </p>
            </div>
            <Link
              href="/tutors"
              className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 font-body"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.slice(0, 12).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/tutors?categoryId=${cat.id}`}
                className="group flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50 hover:shadow-card transition-all duration-200"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="h-10 w-10 rounded-xl bg-brand-100 group-hover:bg-brand-200 flex items-center justify-center text-brand-600 transition-colors">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-xs font-body font-medium text-slate-700 text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Tutors */}
      <section className="bg-slate-50/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-1">
                Top-Rated Tutors
              </h2>
              <p className="text-slate-500 font-body text-sm">
                Handpicked experts ready to help you
              </p>
            </div>
            <Link href="/tutors">
              <Button variant="outline" size="sm">
                View all tutors <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredTutors?.map((tutor, i) => (
                <div
                  key={tutor.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <TutorCard tutor={tutor} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            How SkillBridge Works
          </h2>
          <p className="text-slate-500 font-body max-w-md mx-auto">
            Get started in minutes and begin learning today
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Find your tutor",
              desc: "Browse verified tutors by subject, price, and availability. Read reviews from real students.",
              icon: <Search className="h-6 w-6" />,
            },
            {
              step: "02",
              title: "Book a session",
              desc: "Choose a time that works for you and book instantly. No waiting for approval.",
              icon: <BookOpen className="h-6 w-6" />,
            },
            {
              step: "03",
              title: "Start learning",
              desc: "Connect with your tutor and start achieving your learning goals.",
              icon: <Award className="h-6 w-6" />,
            },
          ].map((item, i) => (
            <div key={item.step} className="relative">
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-200 to-transparent z-0" />
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="h-16 w-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brand-500 text-white text-xs font-display font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to start learning?
          </h2>
          <p className="text-slate-400 font-body mb-8 text-lg">
            Join thousands of students already learning with SkillBridge tutors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="min-w-[180px]">
                Find a Tutor
              </Button>
            </Link>
            <Link href="/auth/register?role=tutor">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[180px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
              >
                Teach on SkillBridge
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
