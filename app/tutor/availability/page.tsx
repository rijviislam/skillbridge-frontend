"use client";

import { Card, Spinner } from "@/components/ui";
import Button from "@/components/ui/Button";
import { tutorApi } from "@/lib/api";
import { DAYS_OF_WEEK } from "@/lib/utils";
import { Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TimeSlot {
  id?: string; // existing slot এর id
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
}

interface DaySlots {
  dayOfWeek: number;
  isAvailable: boolean;
  slots: TimeSlot[];
}

const defaultDaySlots = (): DaySlots[] =>
  DAYS_OF_WEEK.map((_, i) => ({
    dayOfWeek: i,
    isAvailable: false,
    slots: [{ startTime: "09:00", endTime: "10:00" }],
  }));

export default function AvailabilityPage() {
  const [days, setDays] = useState<DaySlots[]>(defaultDaySlots());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    tutorApi
      .getAvailability()
      .then((r) => {
        const data = r.data?.data || r.data || [];
        if (data.length > 0) {
          setDays(
            defaultDaySlots().map((def) => {
              // ✅ এই day এর সব slots খোঁজো
              const daySlots = data.filter((d: any) => {
                return new Date(d.startTime).getDay() === def.dayOfWeek;
              });

              if (daySlots.length > 0) {
                return {
                  ...def,
                  isAvailable: true,
                  slots: daySlots.map((d: any) => ({
                    id: d.id,
                    startTime: new Date(d.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }),
                    endTime: new Date(d.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }),
                  })),
                };
              }
              return def;
            }),
          );
        }
      })
      .catch((err) => console.log("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (dayOfWeek: number) => {
    setDays((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek
          ? { ...d, isAvailable: !d.isAvailable }
          : d,
      ),
    );
  };

  const addSlot = (dayOfWeek: number) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek && d.slots.length < 5) {
          return {
            ...d,
            slots: [...d.slots, { startTime: "09:00", endTime: "10:00" }],
          };
        }
        return d;
      }),
    );
  };

  const removeSlot = (dayOfWeek: number, index: number) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          const newSlots = d.slots.filter((_, i) => i !== index);
          return {
            ...d,
            slots: newSlots.length > 0 ? newSlots : d.slots,
          };
        }
        return d;
      }),
    );
  };

  const updateSlot = (
    dayOfWeek: number,
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek === dayOfWeek) {
          const newSlots = d.slots.map((s, i) =>
            i === index ? { ...s, [field]: value } : s,
          );
          return { ...d, slots: newSlots };
        }
        return d;
      }),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const enabledDays = days.filter((d) => d.isAvailable);

      for (const day of enabledDays) {
        for (const slot of day.slots) {
          const [startHour, startMin] = slot.startTime.split(":").map(Number);
          const [endHour, endMin] = slot.endTime.split(":").map(Number);

          const now = new Date();
          const currentDay = now.getDay();
          const diff = day.dayOfWeek - currentDay;

          const startTime = new Date(now);
          startTime.setDate(now.getDate() + diff);
          startTime.setHours(startHour, startMin, 0, 0);

          const endTime = new Date(now);
          endTime.setDate(now.getDate() + diff);
          endTime.setHours(endHour, endMin, 0, 0);

          // ✅ existing slot হলে skip, নতুন হলে create
          if (!slot.id) {
            await tutorApi.updateAvailability({
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            });
          }
        }
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

  const enabledCount = days.filter((d) => d.isAvailable).length;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Availability
        </h1>
        <p className="text-slate-500 font-body text-sm mt-0.5">
      You can set a maximum of 5 time slots per day · {enabledCount} days enabled
        </p>
      </div>

      <Card className="p-6">
        
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                day.isAvailable
                  ? "border-brand-200 bg-brand-50/50"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(day.dayOfWeek)}
                    className={`relative h-6 w-11 rounded-full transition-all duration-200 flex-shrink-0 ${
                      day.isAvailable ? "bg-brand-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                        day.isAvailable ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm font-body font-semibold ${
                      day.isAvailable ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {DAYS_OF_WEEK[day.dayOfWeek]}
                  </span>
                </div>

                {/* Add slot button */}
                {day.isAvailable && day.slots.length < 5 && (
                  <button
                    onClick={() => addSlot(day.dayOfWeek)}
                    className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-body font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Slot
                  </button>
                )}
              </div>

              {/* Time slots */}
              {day.isAvailable && (
                <div className="space-y-2 pl-14">
                  {day.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateSlot(
                            day.dayOfWeek,
                            index,
                            "startTime",
                            e.target.value,
                          )
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-body text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                      />
                      <span className="text-sm text-slate-400">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateSlot(
                            day.dayOfWeek,
                            index,
                            "endTime",
                            e.target.value,
                          )
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-body text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                      />
                      {/* ✅ Delete button — শুধু একটার বেশি থাকলে দেখাবে */}
                      {day.slots.length > 1 && (
                        <button
                          onClick={() => removeSlot(day.dayOfWeek, index)}
                          className="text-red-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="text-xs text-slate-400 font-body">
                    {day.slots.length}/5 slots
                  </p>
                </div>
              )}

              {!day.isAvailable && (
                <p className="text-sm text-slate-400 font-body italic pl-14">
                  Not available
                </p>
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