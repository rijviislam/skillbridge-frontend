"use client";

import { Avatar, Card } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";

import { Image, Mail, Shield, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
export default function StudentProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userApi.updateProfile({
        name: form.name,
        image: form.image || undefined,
      });

      // ✅ localStorage এ updated user save করো
      const updatedUser = res.data?.data;
      if (updatedUser) {
        const currentUser = JSON.parse(localStorage.getItem("sb_user") || "{}");
        const newUser = { ...currentUser, ...updatedUser };
        localStorage.setItem("sb_user", JSON.stringify(newUser));
      }

      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          My Profile
        </h1>
        <p className="text-slate-500 font-body text-sm mt-0.5">
          Manage your account information
        </p>
      </div>

      {/* Avatar */}
      <Card className="p-6 mb-5">
        <div className="flex items-center gap-5">
          <Avatar name={user?.name || "U"} src={form.image} size="xl" />
          <div>
            <h2 className="font-display font-semibold text-lg text-slate-900">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-500 font-body capitalize">
              {user?.role}
            </p>
            <p className="text-xs text-slate-400 font-body mt-1">
              {user?.email}
            </p>
          </div>
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
            value={form.name}
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

      {/* Account info */}
      <Card className="p-6">
        <h3 className="font-display font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand-500" /> Account Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-body">
            <span className="text-slate-500">Role</span>
            <span className="font-medium text-slate-800 capitalize">
              {user?.role}
            </span>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-slate-500">Status</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-slate-500">User ID</span>
            <span className="font-mono text-xs text-slate-400">{user?.id}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
