"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { Card, Spinner, EmptyState } from "@/components/ui";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui";
import type { Category } from "@/types";
import toast from "react-hot-toast";
import { Tag, Plus, Pencil, Trash2, X, Check } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    adminApi.getCategories().then(r => {
      setCategories(r.data?.data || r.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      await adminApi.createCategory(form);
      toast.success("Category created!");
      setForm({ name: "", description: "" });
      setCreating(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create");
    } finally { setSaving(false); }
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      await adminApi.updateCategory(id, editForm);
      toast.success("Category updated!");
      setEditId(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setDeleting(id);
    try {
      await adminApi.deleteCategory(id);
      toast.success("Category deleted");
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally { setDeleting(null); }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditForm({ name: cat.name, description: cat.description || "" });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 font-body text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Create form */}
      {creating && (
        <Card className="p-5 mb-5 border-brand-200 animate-fade-up">
          <h3 className="font-display font-semibold text-slate-900 mb-4">New Category</h3>
          <div className="space-y-3">
            <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mathematics" />
            <Textarea label="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." rows={2} />
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>Cancel</Button>
            <Button size="sm" loading={saving} onClick={handleCreate}>Create</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={<Tag className="h-10 w-10" />}
            title="No categories yet"
            action={<Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add Category</Button>}
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {categories.map(cat => (
              <div key={cat.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                {editId === cat.id ? (
                  <div className="space-y-2">
                    <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                    <Textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" loading={saving} onClick={() => handleUpdate(cat.id)} className="gap-1">
                        <Check className="h-3.5 w-3.5" /> Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditId(null)} className="gap-1">
                        <X className="h-3.5 w-3.5" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-brand-50 flex items-center justify-center">
                        <Tag className="h-4 w-4 text-brand-500" />
                      </div>
                      <div>
                        <p className="font-body font-medium text-slate-800 text-sm">{cat.name}</p>
                        {cat.description && <p className="text-xs text-slate-400 font-body">{cat.description}</p>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deleting === cat.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
