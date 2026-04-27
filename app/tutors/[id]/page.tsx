"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Avatar, Card, Rating, Spinner, Textarea } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { bookingsApi, reviewsApi, tutorsApi } from "@/lib/api";
import { DAYS_OF_WEEK, formatCurrency, formatDate } from "@/lib/utils";
import type { Review } from "@/types";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  MessageSquare,
  Star,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isStudent } = useAuth();
  const router = useRouter();

  const [tutor, setTutor] = useState<any | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState({
    scheduledDate: "",
    startTime: "",
    endTime: "",
    subject: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");

useEffect(() => {
  const load = async () => {
    try {
      const tutorRes = await tutorsApi.getById(id);
      const tutorData =
        tutorRes.data?.tutor || tutorRes.data?.data || tutorRes.data;
      setTutor(tutorData);

      try {
        const reviewRes = await reviewsApi.getForTutor(tutorData?.userId || id);
        const reviewList = reviewRes.data?.data || reviewRes.data || [];
        setReviews(Array.isArray(reviewList) ? reviewList : []);
      } catch {
        setReviews([]);
      }
    } catch (err) {
      toast.error("Failed to load tutor profile");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [id]);

  const handleBook = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!isStudent) {
      toast.error("Only students can book sessions");
      return;
    }
    if (!selectedSlot || !subject) {
      toast.error("Please select a time slot and subject");
      return;
    }
    setSubmitting(true);
    try {
      await bookingsApi.create({
        tutorId: tutor?.id,
        availabilityId: selectedSlot,
      });
      toast.success("Session booked successfully!");
      setBookingOpen(false);
      setSelectedSlot("");
      setSubject("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center py-32">
          <Spinner />
        </div>
      </div>
    );

  if (!tutor)
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="text-center py-32 font-body text-slate-500">
          Tutor not found
        </div>
      </div>
    );

  const name = tutor?.user?.name || tutor?.name || "Tutor";
  const bio = tutor?.bio || "";
  const education = tutor?.education || "";
  const hourlyRate = tutor?.hourlyRate || 0;
  const experience = tutor?.experience || 0;
  const rating = tutor?.rating || 0;
  const totalReviews = tutor?.reviews?.length || tutor?.totalReviews || 0;
  const totalSessions = tutor?.totalSessions || 0;
  const subjects = tutor?.subjects || [];
  const availability = tutor?.availability || [];
  const categories = tutor?.categories || [];
  const isVerified = tutor?.isVerified || false;
  const profileImage = tutor?.user?.image || tutor?.profileImage || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar
              name={name}
              src={profileImage}
              size="xl"
              className="ring-4 ring-brand-400/30"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold">{name}</h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-xs px-2.5 py-0.5 rounded-full">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <p className="text-brand-300 font-body text-sm mb-3">
                  {categories
                    .map((c: any) => c?.category?.name || c?.name)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300 font-body">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  {rating.toFixed ? rating.toFixed(1) : rating} ({totalReviews}{" "}
                  reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {totalSessions} sessions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {experience} years exp.
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="font-display text-3xl font-bold text-brand-300">
                {formatCurrency(hourlyRate)}
              </p>
              <p className="text-slate-400 font-body text-sm mb-4">per hour</p>
              {isStudent && (
                <Button size="lg" onClick={() => setBookingOpen(true)}>
                  <Calendar className="h-4 w-4" /> Book Session
                </Button>
              )}
              {!user && (
                <Button size="lg" onClick={() => router.push("/auth/login")}>
                  Sign in to Book
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {bio && (
              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg text-slate-900 mb-3">
                  About
                </h2>
                <p className="text-slate-600 font-body text-sm leading-relaxed">
                  {bio}
                </p>
              </Card>
            )}

            {/* Education */}
            {education && (
              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-brand-500" /> Education
                </h2>
                <p className="text-slate-600 font-body text-sm">{education}</p>
              </Card>
            )}

            {/* Subjects */}
            {subjects.length > 0 && (
              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg text-slate-900 mb-3">
                  Subjects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s: string) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-brand-50 text-brand-700 text-sm font-body rounded-xl border border-brand-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Availability */}
            {availability.length > 0 && (
              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg text-slate-900 mb-4">
                  Availability
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availability.map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <div>
                        <p className="text-xs font-medium text-slate-700 font-body">
                          {a.dayOfWeek !== undefined
                            ? DAYS_OF_WEEK[a.dayOfWeek]
                            : ""}
                        </p>
                        <p className="text-xs text-slate-500 font-body">
                          {a.startTime
                            ? new Date(a.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                          {" – "}
                          {a.endTime
                            ? new Date(a.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="font-display font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-500" /> Reviews (
                {reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-400 font-body">
                  No reviews yet. Be the first!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r: any) => (
                    <div
                      key={r.id}
                      className="border-b border-slate-50 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={r.student?.name || "Student"}
                            size="sm"
                          />
                          <span className="text-sm font-medium font-body text-slate-800">
                            {r.student?.name || "Student"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Rating value={r.rating} />
                          <span className="text-xs text-slate-400 font-body">
                            {formatDate(r.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 font-body leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="font-display font-semibold text-slate-900 mb-4">
                Quick Stats
              </h3>
              {[
                {
                  label: "Rating",
                  value: `${rating.toFixed ? rating.toFixed(1) : rating} / 5.0`,
                  icon: <Star className="h-4 w-4 text-amber-400" />,
                },
                {
                  label: "Sessions",
                  value: totalSessions,
                  icon: <BookOpen className="h-4 w-4 text-brand-500" />,
                },
                {
                  label: "Reviews",
                  value: totalReviews,
                  icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-body">
                    {stat.icon} {stat.label}
                  </div>
                  <span className="font-display font-semibold text-slate-900">
                    {stat.value}
                  </span>
                </div>
              ))}
            </Card>

            {isStudent && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => setBookingOpen(true)}
              >
                <Calendar className="h-4 w-4" /> Book a Session
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-1">
              Book a Session
            </h2>
            <p className="text-sm text-slate-500 font-body mb-5">with {name}</p>
            <div className="space-y-4">
              {/* ✅ Available slots */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Time Slot
                </label>
                {availability.filter((a: any) => !a.isBooked).length === 0 ? (
                  <p className="text-sm text-slate-400">No available slots</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availability
                      .filter((a: any) => !a.isBooked)
                      .map((a: any) => (
                        <button
                          key={a.id}
                          onClick={() => setSelectedSlot(a.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-body transition-all ${
                            selectedSlot === a.id
                              ? "border-brand-500 bg-brand-50 text-brand-700"
                              : "border-slate-200 hover:border-brand-300"
                          }`}
                        >
                          {new Date(a.startTime).toLocaleDateString()} ·{" "}
                          {new Date(a.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" – "}
                          {new Date(a.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Algebra, Python basics"
              />
              <Textarea
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific topics?"
                rows={3}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setBookingOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                loading={submitting}
                onClick={handleBook}
              >
                Confirm Booking
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
