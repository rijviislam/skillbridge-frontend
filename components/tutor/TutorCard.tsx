import { Avatar, Badge, Card, Rating } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { TutorProfile } from "@/types";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface TutorCardProps {
  tutor: TutorProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const name = tutor.user?.name || "Tutor";

  return (
    <Link href={`/tutors/${tutor.userId}`}>
      <Card className="group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-brand-400 to-brand-600" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar name={name} src={tutor.profileImage} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-slate-900 text-base leading-tight group-hover:text-brand-600 transition-colors line-clamp-1">
                {name}
              </h3>
              {tutor.category && (
                <Badge variant="default" className="mt-1">
                  {tutor.category.name}
                </Badge>
              )}
              <div className="flex items-center gap-1 mt-1.5">
                <Rating value={tutor.rating || 0} />
                <span className="text-xs text-slate-400 font-body">
                  {/* ({tutor.totalReviews || 0})   */}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-slate-500 font-body line-clamp-2 mb-4 leading-relaxed">
            {tutor.bio || "Expert tutor ready to help you succeed."}
          </p>

          {/* Subjects */}
          {tutor.subjects?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tutor.subjects.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs font-body rounded-lg"
                >
                  {s}
                </span>
              ))}
              {tutor.subjects.length > 3 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-body rounded-lg">
                  +{tutor.subjects.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-body">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{tutor.totalSessions || 0} sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-display font-bold text-slate-900">
                {formatCurrency(tutor.hourlyRate || 0)}
              </span>
              <span className="text-xs text-slate-400 font-body">/hr</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
