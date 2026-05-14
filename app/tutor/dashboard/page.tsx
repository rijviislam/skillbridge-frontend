"use client";

import { Avatar, Card, Spinner, StatusBadge } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { bookingsApi, reviewsApi, tutorApi } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, CheckCircle, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ReviewsSection({ tutorId }: { tutorId?: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tutorId) return;
    reviewsApi
      .getForTutor(tutorId)
      .then((r) => {
        const list = r.data?.data || r.data || [];
        setReviews(Array.isArray(list) ? list : []);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [tutorId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <Card className="p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-slate-900">
          Ratings & Reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="font-display font-bold text-slate-900">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-body">
              ({reviews.length} reviews)
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10">
          <Star className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-body">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r: any) => (
            <div
              key={r.id}
              className="flex gap-3 border-b border-slate-50 last:border-0 pb-4 last:pb-0"
            >
              <Avatar name={r.student?.name || "Student"} size="sm" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium font-body text-slate-800">
                    {r.student?.name || "Student"}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= r.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {r.booking?.availability && (
                  <p className="text-xs text-brand-600 font-body mb-1 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    Session: {formatDate(
                      r.booking.availability.startTime,
                    )}, {formatTime(r.booking.availability.startTime)} –{" "}
                    {formatTime(r.booking.availability.endTime)}
                  </p>
                )}

                {r.comment && (
                  <p className="text-sm text-slate-600 font-body leading-relaxed">
                    {r.comment}
                  </p>
                )}
                <p className="text-xs text-slate-400 font-body mt-1">
                  {formatDate(r.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    tutorApi
      .getSessions({ limit: 20 })
      .then((r) => {
        const data = r.data?.data;
        let all = [];
        if (data?.upcoming || data?.past) {
          all = [...(data.upcoming || []), ...(data.past || [])];
        } else if (Array.isArray(data)) {
          all = data;
        } else if (Array.isArray(r.data)) {
          all = r.data;
        }
        setSessions(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter((s) => s.status === "CONFIRMED").length,
    completed: sessions.filter((s) => s.status === "COMPLETED").length,
  };

  const handleMarkComplete = async (id: string) => {
    try {
      await bookingsApi.complete(id);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "COMPLETED" } : s)),
      );
      toast.success("Session marked as completed");
    } catch {
      toast.error("Failed to update session");
    }
  };

  const getStudentName = (s: any) =>
    s.student?.name || s.student?.user?.name || "Student";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Welcome, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 font-body text-sm mt-1">
          Manage your tutoring sessions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Sessions",
            value: stats.total,
            icon: <CalendarDays className="h-5 w-5" />,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: <Users className="h-5 w-5" />,
            color: "text-brand-500",
            bg: "bg-brand-50",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: <CheckCircle className="h-5 w-5" />,
            color: "text-green-500",
            bg: "bg-green-50",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div
              className={`inline-flex p-2 rounded-xl ${stat.bg} ${stat.color} mb-3`}
            >
              {stat.icon}
            </div>
            <p className="font-display text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 font-body mt-0.5">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Sessions table */}
      <Card className="p-5">
        <h2 className="font-display font-semibold text-slate-900 mb-4">
          Recent Sessions
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-10">
            <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-body">No sessions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Student", "Date & Time", "Status", "Action"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium text-slate-500 font-body pb-3 pr-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s: any) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={getStudentName(s)} size="sm" />
                        <span className="text-sm font-body text-slate-700">
                          {getStudentName(s)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm font-body text-slate-600">
                      {s.availability ? (
                        <>
                          {formatDate(s.availability.startTime)}
                          <br />
                          <span className="text-xs text-slate-400">
                            {formatTime(s.availability.startTime)} –{" "}
                            {formatTime(s.availability.endTime)}
                          </span>
                        </>
                      ) : (
                        formatDate(s.createdAt)
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="py-3">
                      {s.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleMarkComplete(s.id)}
                          className="text-xs text-green-600 hover:text-green-700 font-body font-medium hover:underline"
                        >
                          Mark Complete
                        </button>
                      )}
                      {s.status === "COMPLETED" && (
                        <span className="text-xs text-green-500 font-body">
                          ✓ Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ReviewsSection tutorId={user?.id} />
    </div>
  );
}
