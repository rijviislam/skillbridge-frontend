"use client";

import {
  Avatar,
  Card,
  EmptyState,
  Select,
  Spinner,
  StatusBadge,
  Textarea,
} from "@/components/ui";
import Button from "@/components/ui/Button";
import { bookingsApi, reviewsApi } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reviewModal, setReviewModal] = useState<any | null>(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    bookingsApi
      .getAll()
      .then((r) => {
        console.log("bookings raw:", r.data);
        const raw = r.data?.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(r.data)
              ? r.data
              : [];
        console.log("bookings list:", list);
        console.log("first booking status:", list[0]?.status);
        setBookings(list);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter(
          (b) => b.status?.toUpperCase() === filter.toUpperCase(),
        );

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      await bookingsApi.cancel(id);
      toast.success("Booking cancelled");
      load();
    } catch {
      toast.error("Failed to cancel");
    } finally {
      setCancelling(null);
    }
  };

  const handleReview = async () => {
    if (!reviewModal) return;
    if (!review.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewsApi.create({
        bookingId: reviewModal.id,
        tutorId: reviewModal.tutorId,
        rating: review.rating,
        comment: review.comment,
      });
      toast.success("Review submitted!");
      setReviewModal(null);
      setReview({ rating: 5, comment: "" });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getTutorName = (b: any) =>
    b.tutor?.name || b.tutor?.user?.name || "Tutor";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            My Bookings
          </h1>
          <p className="text-slate-500 font-body text-sm mt-0.5">
            {bookings.length} sessions
          </p>
        </div>
        <Select
          options={[
            { value: "all", label: "All Sessions" },
            { value: "confirmed", label: "Upcoming" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-40"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-12 w-12" />}
          title="No bookings found"
          description="Book a session with an expert tutor to get started."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((b: any) => (
            <Card key={b.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar name={getTutorName(b)} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-slate-900">
                      {getTutorName(b)}
                    </h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-xs text-slate-400 font-body mt-0.5">
                    {b.availability
                      ? `${formatDate(b.availability.startTime)} · ${formatTime(b.availability.startTime)} – ${formatTime(b.availability.endTime)}`
                      : formatDate(b.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    {b.status === "CONFIRMED" && (
                      <Button
                        variant="danger"
                        size="sm"
                        loading={cancelling === b.id}
                        onClick={() => handleCancel(b.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    {b.status === "COMPLETED" && !b.review && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewModal(b)}
                      >
                        <Star className="h-3.5 w-3.5" /> Leave Review
                      </Button>
                    )}
                    {b.status === "COMPLETED" && b.review && (
                      <span className="text-xs text-green-600 font-body">
                        ✓ Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Leave a Review
              </h2>
              <button
                onClick={() => setReviewModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 font-body mb-5">
              for {getTutorName(reviewModal)}
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-slate-700 font-body mb-2">
                Rating
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setReview((r) => ({ ...r, rating: s }))}
                  >
                    <svg
                      className={`h-8 w-8 transition-colors ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Comment"
              value={review.comment}
              onChange={(e) =>
                setReview((r) => ({ ...r, comment: e.target.value }))
              }
              placeholder="Share your experience..."
              rows={4}
            />

            <div className="flex gap-3 mt-5">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setReviewModal(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                loading={submittingReview}
                onClick={handleReview}
              >
                Submit Review
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
