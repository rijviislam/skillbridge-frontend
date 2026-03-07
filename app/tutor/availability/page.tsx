"use client";

import { Card, Spinner } from "@/components/ui";
import Button from "@/components/ui/Button";
import { tutorApi } from "@/lib/api";
import { DAYS_OF_WEEK } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AvailSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const defaultSlots: AvailSlot[] = DAYS_OF_WEEK.map((_, i) => ({
  dayOfWeek: i,
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: false,
}));

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailSlot[]>(defaultSlots);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    tutorApi
      .getAvailability()
      .then((r) => {
        const data: AvailSlot[] = r.data?.data || r.data || [];
        if (data.length > 0) {
          setSlots(
            defaultSlots.map((def) => {
              const found = data.find((d) => d.dayOfWeek === def.dayOfWeek);
              return found ? { ...def, ...found } : def;
            }),
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (day: number, field: keyof AvailSlot, value: unknown) => {
    setSlots((s) =>
      s.map((slot) =>
        slot.dayOfWeek === day ? { ...slot, [field]: value } : slot,
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // ✅ শুধু enabled slots save করো
      const enabledSlots = slots.filter((s) => s.isAvailable);

      for (const slot of enabledSlots) {
        // ✅ time string কে DateTime এ convert করো
        const today = new Date();
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);

        const startTime = new Date(today);
        startTime.setHours(startHour, startMin, 0, 0);

        const endTime = new Date(today);
        endTime.setHours(endHour, endMin, 0, 0);

        await tutorApi.updateAvailability({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });
      }
      toast.success("Availability saved!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );

  const enabledCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Availability
        </h1>
        <p className="text-slate-500 font-body text-sm mt-0.5">
          Set when you're available for tutoring sessions · {enabledCount} days
          enabled
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.dayOfWeek}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                slot.isAvailable
                  ? "border-brand-200 bg-brand-50/50"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              {/* Toggle + Day */}
              <div className="flex items-center gap-3 w-36">
                <button
                  onClick={() =>
                    update(slot.dayOfWeek, "isAvailable", !slot.isAvailable)
                  }
                  className={`relative h-6 w-11 rounded-full transition-all duration-200 flex-shrink-0 ${
                    slot.isAvailable ? "bg-brand-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                      slot.isAvailable ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-body font-medium ${slot.isAvailable ? "text-slate-900" : "text-slate-400"}`}
                >
                  {DAYS_OF_WEEK[slot.dayOfWeek]}
                </span>
              </div>

              {/* Time inputs */}
              {slot.isAvailable ? (
                <div className="flex items-center gap-2 flex-1">
                  <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      update(slot.dayOfWeek, "startTime", e.target.value)
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-body text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                  />
                  <span className="text-sm text-slate-400">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      update(slot.dayOfWeek, "endTime", e.target.value)
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-body text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                  />
                </div>
              ) : (
                <span className="text-sm text-slate-400 font-body italic">
                  Not available
                </span>
              )}
            </div>
          ))}
        </div>

        <Button className="mt-6" loading={saving} onClick={handleSave}>
          Save Availability
        </Button>
      </Card>
    </div>
  );
}
