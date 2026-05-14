"use client";

import { Avatar, Card, Select, Spinner, Textarea } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { tutorApi, tutorsApi } from "@/lib/api";
import type { Category, TutorProfile } from "@/types";
import { BookOpen, DollarSign, GraduationCap, Mail, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TutorProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<TutorProfile>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");

  useEffect(() => {
    Promise.all([tutorApi.getProfile(), tutorsApi.getCategories()])
      .then(([pRes, cRes]) => {
        setProfile(pRes.data?.data || pRes.data || {});
        setCategories(cRes.data?.data || cRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const [form, setForm] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });

  const addSubject = () => {
    if (!subjectInput.trim()) return;
    const current = profile.subjects || [];
    if (!current.includes(subjectInput.trim())) {
      setProfile((p) => ({
        ...p,
        subjects: [...current, subjectInput.trim()],
      }));
    }
    setSubjectInput("");
  };

  const removeSubject = (s: string) => {
    setProfile((p) => ({
      ...p,
      subjects: (p.subjects || []).filter((x) => x !== s),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await tutorApi.updateProfile({
        ...profile,
        hourlyRate: profile.hourlyRate ? Number(profile.hourlyRate) : 0,
        experience: profile.experience ? Number(profile.experience) : 0, // ✅ String → Int
        subjects: profile.subjects || [],
      });
      toast.success("Profile updated!");
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

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Tutor Profile
        </h1>
        <p className="text-slate-500 font-body text-sm mt-0.5">
          How students see you on SkillBridge
        </p>
      </div>

      {/* Avatar section */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name || "T"} size="xl" />
          <div>
            <p className="font-display font-semibold text-slate-900">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400 font-body mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6 mb-5">
        <h3 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-brand-500" /> About You
        </h3>
        <div className="space-y-4">
          <Textarea
            label="Bio"
            value={profile.bio || ""}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Tell students about yourself, your teaching style, and what makes you a great tutor..."
            rows={4}
          />
          <Input
            label="Experience"
            type="number"
            value={profile.experience || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, experience: e.target.value }))
            }
            placeholder="e.g. 5 years teaching Mathematics"
          />
          <Input
            label="Education"
            value={profile.education || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, education: e.target.value }))
            }
            placeholder="e.g. MSc Mathematics, MIT"
            icon={<GraduationCap className="h-4 w-4" />}
          />
        </div>
      </Card>

      {/* Edit form */}
      <Card className="p-6 mb-5">
        <h3 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-brand-500" /> Personal Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={user?.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            icon={<User className="h-4 w-4" />}
          />
          <Input
            label="Email Address"
            type="email"
            disabled
            value={user?.email || ""}
            icon={<Mail className="h-4 w-4" />}
            className="opacity-60 cursor-not-allowed"
          />
          <Input
            label="Profile Picture URL"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            icon={<Image className="h-4 w-4" />}
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs text-slate-400 font-body -mt-2">Imgur URL</p>
        </div>
        <Button className="mt-5" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </Card>

      {/* Teaching */}
      <Card className="p-6 mb-5">
        <h3 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-brand-500" /> Teaching Details
        </h3>
        <div className="space-y-4">
          <Select
            label="Category"
            options={[
              { value: "", label: "Select a category" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={profile.categoryId || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, categoryId: e.target.value }))
            }
          />

          <Input
            label="Hourly Rate (USD)"
            type="number"
            value={profile.hourlyRate || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, hourlyRate: Number(e.target.value) }))
            }
            placeholder="50"
            icon={<DollarSign className="h-4 w-4" />}
          />

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 font-body">
              Subjects
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSubject())
                }
                placeholder="Add a subject and press Enter"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <Button variant="outline" size="sm" onClick={addSubject}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.subjects || []).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 text-sm font-body rounded-xl border border-brand-100"
                >
                  {s}
                  <button
                    onClick={() => removeSubject(s)}
                    className="text-brand-400 hover:text-brand-600 text-lg leading-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Button size="lg" loading={saving} onClick={handleSave}>
        Save Profile
      </Button>
    </div>
  );
}
