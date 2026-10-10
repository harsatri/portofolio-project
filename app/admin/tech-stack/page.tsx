"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  Pencil,
  AlertTriangle,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils";
import { getTechLogo } from "@/components/icons";
import { triggerRevalidation } from "@/lib/revalidate";
import { toast } from "sonner";

interface TechRecord {
  id: string;
  name: string;
  category: string;
  proficiency: "Advanced" | "Proficient";
}

const CATEGORIES = [
  "Frontend Development",
  "Backend & Systems",
  "Databases & Storage",
  "AI / Data Science & Tools",
] as const;

export default function AdminTechStackPage() {
  const [techList, setTechList] = useState<TechRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Form / Edit Dialog ───────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  /** null = create mode | TechRecord = edit mode */
  const [editingItem, setEditingItem] = useState<TechRecord | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [proficiency, setProficiency] = useState<"Advanced" | "Proficient">("Advanced");

  // ─── Delete Dialog ────────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<TechRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const supabase = createClient();

  // ─── Fetch ────────────────────────────────────────────────
  const fetchTechStack = async (isManualRefresh = false) => {
    if (isManualRefresh) setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tech_stacks")
        .select("id, name, category, proficiency")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;

      setTechList(
        (data ?? []).map((item) => ({
          id: item.id as string,
          name: item.name as string,
          category: item.category as string,
          proficiency: (item.proficiency as "Advanced" | "Proficient") ?? "Proficient",
        }))
      );
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal memuat tech stack"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechStack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Open Create Dialog ───────────────────────────────────
  const openCreateDialog = () => {
    setEditingItem(null);
    setName("");
    setCategory(CATEGORIES[0]);
    setProficiency("Advanced");
    setDialogOpen(true);
  };

  // ─── Open Edit Dialog ─────────────────────────────────────
  const openEditDialog = (item: TechRecord) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setProficiency(item.proficiency);
    setDialogOpen(true);
  };

  // ─── Save (Insert or Update) ──────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama teknologi wajib diisi");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // UPDATE
        const { error } = await supabase
          .from("tech_stacks")
          .update({ name: name.trim(), category, proficiency })
          .eq("id", editingItem.id);
        if (error) throw error;
        toast.success(`"${name.trim()}" berhasil diperbarui`);
      } else {
        // INSERT
        const { error } = await supabase.from("tech_stacks").insert({
          name: name.trim(),
          category,
          proficiency,
          created_at: new Date().toISOString(),
        });
        if (error) throw error;
        toast.success(`"${name.trim()}" berhasil ditambahkan`);
      }

      await triggerRevalidation("/");
      setDialogOpen(false);
      fetchTechStack();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan teknologi"));
    } finally {
      setSaving(false);
    }
  };

  // ─── Open Delete Dialog ───────────────────────────────────
  const openDeleteDialog = (item: TechRecord) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  // ─── Confirm Delete ───────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("tech_stacks")
        .delete()
        .eq("id", deletingItem.id);
      if (error) throw error;
      toast.success(`"${deletingItem.name}" berhasil dihapus`);
      await triggerRevalidation("/");
      setDeleteDialogOpen(false);
      fetchTechStack();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menghapus teknologi"));
    } finally {
      setDeleting(false);
    }
  };

  const isEditMode = editingItem !== null;

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Manajemen Tech Stack &amp; Keahlian</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Atur bahasa pemrograman, framework, database, dan tools yang Anda kuasai
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchTechStack(true)}
            variant="outline"
            size="sm"
            className="rounded-xl border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={openCreateDialog}
            size="sm"
            className="rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-mono font-semibold h-9 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Teknologi</span>
          </Button>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────── */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-xs font-mono">Memuat tech stack...</span>
        </div>
      ) : techList.length === 0 ? (
        /* ─── Empty State ──────────────────────────────────── */
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-zinc-500">
          <PackageOpen className="w-10 h-10 text-zinc-700" />
          <div className="text-center space-y-1">
            <p className="text-sm font-mono font-semibold text-zinc-400">
              Belum ada teknologi
            </p>
            <p className="text-xs font-mono text-zinc-600">
              Klik &ldquo;Tambah Teknologi&rdquo; untuk menambahkan tech stack pertama Anda.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            size="sm"
            className="mt-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-mono font-semibold h-9 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Teknologi</span>
          </Button>
        </div>
      ) : (
        /* ─── Categories Grid ──────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => {
            const items = techList.filter((it) => it.category === cat);
            return (
              <div
                key={cat}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                    {cat}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {items.length} teknologi
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-zinc-600 font-mono py-4 text-center">
                    Belum ada item di kategori ini.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono"
                      >
                        <span className="shrink-0 flex items-center justify-center">
                          {getTechLogo(it.name, "w-3.5 h-3.5")}
                        </span>
                        <span className="text-zinc-200 font-medium">{it.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            it.proficiency === "Advanced"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                              : "bg-blue-950 text-blue-400 border border-blue-800/60"
                          }`}
                        >
                          {it.proficiency}
                        </span>

                        {/* Edit */}
                        <button
                          onClick={() => openEditDialog(it)}
                          className="text-zinc-500 hover:text-emerald-400 ml-0.5 cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => openDeleteDialog(it)}
                          className="text-zinc-500 hover:text-red-400 cursor-pointer transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Form Dialog (Create / Edit) ─────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-zinc-900 border-zinc-800 text-white p-6">
          <DialogHeader>
            <DialogTitle className="font-mono text-base font-bold">
              {isEditMode ? "Edit Teknologi" : "Tambah Teknologi Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 font-mono">
              {isEditMode
                ? "Perbarui nama teknologi, kategori rumpun, atau tingkat kemahiran"
                : "Masukkan nama teknologi, kategori rumpun, dan tingkat kemahiran"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Nama Teknologi / Alat <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Go, Supabase, Tailwind CSS, Redis"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Kategori Rumpun
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Tingkat Kemahiran (Proficiency)
              </label>
              <select
                value={proficiency}
                onChange={(e) =>
                  setProficiency(e.target.value as "Advanced" | "Proficient")
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Advanced">Advanced (Mahir / Berpengalaman Tinggi)</option>
                <option value="Proficient">Proficient (Kompeten / Produktif)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-xl border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono h-9"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-mono font-semibold h-9 gap-1.5"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isEditMode ? "Save Changes" : "Simpan"}</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ───────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm bg-zinc-900 border-zinc-800 text-white p-6">
          <DialogHeader>
            <DialogTitle className="font-mono text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              Konfirmasi Hapus
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 font-mono">
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 px-3 py-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <p className="text-xs font-mono text-zinc-300">
              Apakah Anda yakin ingin menghapus teknologi{" "}
              <span className="text-white font-semibold">
                &ldquo;{deletingItem?.name}&rdquo;
              </span>{" "}
              dari Tech Stack?
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="rounded-xl border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono h-9"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-semibold h-9 gap-1.5"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Hapus</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
