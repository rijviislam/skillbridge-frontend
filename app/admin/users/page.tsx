"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { Card, Spinner, StatusBadge, Avatar, Badge, EmptyState } from "@/components/ui";
import { Select } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { User } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Users, Search, ShieldOff, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (roleFilter !== "all") params.role = roleFilter;
    adminApi.getUsers(params).then(r => {
      setUsers(r.data?.data || r.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, roleFilter]);

  const toggleStatus = async (user: User) => {
    setUpdating(user.id);
    try {
      await adminApi.updateUserStatus(user.id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? "banned" : "unbanned"} successfully`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setUpdating(null); }
  };

  const roleColor: Record<string, "default" | "info" | "warning"> = {
    student: "default",
    tutor: "info",
    admin: "warning",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 font-body text-sm mt-0.5">{users.length} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <Select
          options={[
            { value: "all", label: "All Roles" },
            { value: "student", label: "Students" },
            { value: "tutor", label: "Tutors" },
            { value: "admin", label: "Admins" },
          ]}
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="w-36"
        />
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={<Users className="h-10 w-10" />} title="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["User", "Role", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 font-body px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-800 font-body">{u.name}</p>
                          <p className="text-xs text-slate-400 font-body">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={roleColor[u.role] || "default"} className="capitalize">{u.role}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={u.isActive ? "active" : "banned"} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 font-body">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <Button
                        variant={u.isActive ? "danger" : "outline"}
                        size="sm"
                        loading={updating === u.id}
                        onClick={() => toggleStatus(u)}
                        className="gap-1.5"
                      >
                        {u.isActive ? (
                          <><ShieldOff className="h-3.5 w-3.5" /> Ban</>
                        ) : (
                          <><ShieldCheck className="h-3.5 w-3.5" /> Unban</>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
