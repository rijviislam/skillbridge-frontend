"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TutorCard from "@/components/tutor/TutorCard";
import { EmptyState, Select, Spinner } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { tutorsApi } from "@/lib/api";
import type { Category, TutorProfile } from "@/types";
import { Search, SlidersHorizontal, Users, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function BrowseTutorsContent() {
  const searchParams = useSearchParams();

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "rating",
  });

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.sort) params.sort = filters.sort;

      const res = await tutorsApi.getAll(params);
      const data = res.data;
      setTutors(data?.data || data || []);
      setTotal(data?.total || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    tutorsApi
      .getCategories()
      .then((r) => setCategories(r.data?.data || r.data || []));
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const clearFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sort: "rating",
    });
    setPage(1);
  };

  const hasFilters =
    filters.search ||
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">
            Browse Tutors
          </h1>
          <p className="text-slate-500 font-body text-sm">
            {total > 0 ? `${total} tutors found` : "Find your perfect tutor"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => {
                setFilters((f) => ({ ...f, search: e.target.value }));
                setPage(1);
              }}
              placeholder="Search subjects, tutor names..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <Select
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={filters.categoryId}
            onChange={(e) => {
              setFilters((f) => ({ ...f, categoryId: e.target.value }));
              setPage(1);
            }}
            className="sm:w-48"
          />
          <Select
            options={[
              { value: "rating", label: "Top Rated" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "sessions", label: "Most Sessions" },
            ]}
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value }))
            }
            className="sm:w-44"
          />
          <Button
            variant="ghost"
            size="md"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="gap-2 border border-slate-200"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {filtersOpen && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Min Price ($/hr)"
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minPrice: e.target.value }))
                }
                placeholder="0"
              />
              <Input
                label="Max Price ($/hr)"
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, maxPrice: e.target.value }))
                }
                placeholder="500"
              />
              <Select
                label="Minimum Rating"
                options={[
                  { value: "", label: "Any Rating" },
                  { value: "3", label: "3+ Stars" },
                  { value: "4", label: "4+ Stars" },
                  { value: "4.5", label: "4.5+ Stars" },
                ]}
                value={filters.minRating}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, minRating: e.target.value }))
                }
              />
            </div>
          </div>
        )}

        {hasFilters && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-slate-500 font-body">
              Active filters:
            </span>
            {filters.search && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">
                "{filters.search}"
                <button
                  onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.categoryId && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-body px-2.5 py-1 rounded-full">
                {categories.find((c) => c.id === filters.categoryId)?.name}
                <button
                  onClick={() => setFilters((f) => ({ ...f, categoryId: "" }))}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-slate-600 font-body underline"
            >
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : tutors.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No tutors found"
            description="Try adjusting your search filters to find more tutors."
            action={
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tutors.map((tutor, i) => (
                <div
                  key={tutor.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <TutorCard tutor={tutor} />
                </div>
              ))}
            </div>
            {total > 12 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-body text-slate-600">
                  Page {page} of {Math.ceil(total / 12)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= Math.ceil(total / 12)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function BrowseTutorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-32">
          <Spinner />
        </div>
      }
    >
      <BrowseTutorsContent />
    </Suspense>
  );
}
