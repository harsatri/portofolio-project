"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  Building2,
  Calendar,
  Image as ImageIcon,
  Database,
  Copy,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_EXPERIENCES, type ExperienceItem } from "@/lib/portfolio-defaults";
import { getErrorMessage } from "@/lib/utils";
import { triggerRevalidation } from "@/lib/revalidate";
import {
  formatMonthYear,
  calculateDuration,
  buildDurationPeriod,
  parseDurationString,
} from "@/lib/date-utils";
import { toast } from "sonner";

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [status, setStatus] = useState<"Active" | "Completed">("Active");
  const [type, setType] = useState<"Industry" | "Internship" | "Organization">("Industry");
  const [isCurrent, setIsCurrent] = useState(true);
  const [highlights, setHighlights] = useState("");
  const [deliverablesText, setDeliverablesText] = useState("");
  const [technologiesText, setTechnologiesText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const elapsed = calculateDuration(startMonth, isCurrent ? "" : endMonth, isCurrent);

  const supabase = createClient();

  const fetchExperiences = async (isManualRefresh = false) => {
    if (isManualRefresh) setLoading(true);
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setExperiences(DEFAULT_EXPERIENCES);
      } else {
        setExperiences(
          data.map((item) => ({
            id: item.id,
            company: item.company,
            role: item.role,
            duration: item.duration,
            status: item.status || "Active",
            type: item.type || "Industry",
            highlights: item.highlights || "",
            deliverables: item.deliverables || [],
            technologies: item.technologies || [],
            photos:
              Array.isArray(item.photos) && item.photos.length > 0
                ? item.photos
                : Array.isArray(item.gallery_urls) && item.gallery_urls.length > 0
                ? item.gallery_urls
                : Array.isArray(item.metrics)
                ? ((item.metrics as Array<{ type?: string; photos?: string[] }>).find(
                    (m) => m?.type === "photo_gallery"
                  )?.photos || [])
                : [],
          }))
        );
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal memuat riwayat pengalaman"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartMonthChange = (val: string) => {
    setStartMonth(val);
    if (!isCustomDuration) {
      setDuration(buildDurationPeriod(val, isCurrent ? "" : endMonth, isCurrent));
    }
  };

  const handleEndMonthChange = (val: string) => {
    setEndMonth(val);
    if (!isCustomDuration) {
      setDuration(buildDurationPeriod(startMonth, val, isCurrent));
    }
  };

  const handleCurrentToggle = (checked: boolean) => {
    setIsCurrent(checked);
    setStatus(checked ? "Active" : "Completed");
    if (!isCustomDuration) {
      setDuration(buildDurationPeriod(startMonth, checked ? "" : endMonth, checked));
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setCompany("");
    setRole("");
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setStartMonth(currentYM);
    setEndMonth("");
    setIsCurrent(true);
    setIsCustomDuration(false);
    setDuration(buildDurationPeriod(currentYM, "", true));
    setStatus("Active");
    setType("Industry");
    setHighlights("");
    setDeliverablesText("");
    setTechnologiesText("");
    setPhotos([]);
    setDialogOpen(true);
  };

  const openEditDialog = (exp: ExperienceItem) => {
    setEditingId(exp.id || null);
    setCompany(exp.company);
    setRole(exp.role);
    setDuration(exp.duration);
    setStatus(exp.status);
    setType(exp.type);

    const parsed = parseDurationString(exp.duration);
    const active = exp.status === "Active" || parsed.isCurrent;
    setIsCurrent(active);
    setStartMonth(parsed.startMonth || "");
    setEndMonth(active ? "" : (parsed.endMonth || ""));
    setIsCustomDuration(false);

    setHighlights(exp.highlights);
    setDeliverablesText(exp.deliverables.join("\n"));
    setTechnologiesText(exp.technologies.join(", "));
    setPhotos(exp.photos || []);
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrent && startMonth && endMonth && endMonth < startMonth) {
      toast.error("Periode tidak valid: Bulan selesai tidak boleh lebih awal dari bulan mulai");
      return;
    }

    const finalDuration =
      duration.trim() ||
      buildDurationPeriod(startMonth, isCurrent ? "" : endMonth, isCurrent);

    if (!company.trim() || !role.trim() || !finalDuration) {
      toast.error("Nama Perusahaan, Posisi, dan Periode Durasi wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const deliverables = deliverablesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const technologies = technologiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Record<string, unknown> = {
        company: company.trim(),
        role: role.trim(),
        duration: finalDuration,
        status: isCurrent ? "Active" : status,
        type,
        is_current: isCurrent,
        start_date: startMonth ? `${startMonth}-01` : "2024-01-01",
        end_date: isCurrent ? null : (endMonth ? `${endMonth}-01` : null),
        highlights: highlights.trim(),
        deliverables,
        technologies,
        photos,
      };

      const executeSave = async (payloadToUse: Record<string, unknown>) => {
        if (!editingId) {
          const { error } = await supabase.from("experiences").insert(payloadToUse);
          if (error) throw error;
          toast.success("Pengalaman kerja berhasil ditambahkan!");
        } else {
          const { data, error } = await supabase
            .from("experiences")
            .update(payloadToUse)
            .eq("id", editingId)
            .select();
          if (error) throw error;
          if (!data || data.length === 0) {
            const { error: insertErr } = await supabase.from("experiences").insert(payloadToUse);
            if (insertErr) throw insertErr;
          }
          toast.success("Pengalaman kerja berhasil diperbarui!");
        }
      };

      try {
        await executeSave(payload);
      } catch (saveErr: unknown) {
        const errorMsg = getErrorMessage(saveErr).toLowerCase();
        if (
          errorMsg.includes("photos") ||
          errorMsg.includes("column") ||
          errorMsg.includes("schema cache")
        ) {
          console.warn("[Experiences] Kolom 'photos' belum ada di database Supabase, mencoba menyimpan dengan fallback metadata...");
          const fallbackPayload = { ...payload };
          delete fallbackPayload.photos;

          // Cadangkan foto ke dalam field metrics jsonb jika user mengunggah foto
          if (photos.length > 0) {
            fallbackPayload.metrics = [{ type: "photo_gallery", photos }];
          }

          try {
            await executeSave(fallbackPayload);
            toast.warning(
              "Foto tersimpan di cadangan sementara! Klik tombol 'Salin SQL Migrasi' di atas lalu jalankan di Supabase agar kolom 'photos' aktif permanen."
            );
          } catch {
            // Jika metrics juga tidak ada, simpan tanpa photos sama sekali
            delete fallbackPayload.metrics;
            await executeSave(fallbackPayload);
            toast.warning("Tersimpan tanpa foto karena kolom 'photos' belum dimigrasi di Supabase.");
          }
        } else {
          throw saveErr;
        }
      }

      await triggerRevalidation("/");
      setDialogOpen(false);
      fetchExperiences();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan pengalaman"));
    } finally {
      setSaving(false);
    }
  };

  const copySqlMigration = () => {
    const sql = `-- ==============================================================================
-- AKTIFKAN KOLOM PHOTOS & RELOAD SCHEMA CACHE POSTGREST
-- Jalankan di SQL Editor Supabase:
-- https://supabase.com/dashboard/project/nnmcwzillidcsnwuiodl/sql/new
-- ==============================================================================

ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
NOTIFY pgrst, 'reload schema';`;

    navigator.clipboard.writeText(sql);
    toast.success("Script SQL berhasil disalin ke clipboard!", {
      description: "Buka SQL Editor di dashboard Supabase Anda, tempelkan (Ctrl+V), lalu klik RUN.",
    });
  };

  const handleDelete = async (id?: string, compName?: string) => {
    if (!id) {
      toast.error("Pengalaman default tidak dapat dihapus dari database lokal");
      return;
    }
    if (!confirm(`Hapus pengalaman di "${compName}"?`)) return;

    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
      toast.success("Pengalaman kerja berhasil dihapus");
      await triggerRevalidation("/");
      fetchExperiences();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menghapus pengalaman"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <span>Manajemen Riwayat Pengalaman Kerja</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Kelola perusahaan, peran, periode, dan capaian tanggung jawab teknis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={copySqlMigration}
            variant="outline"
            size="sm"
            className="rounded-xl border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-mono h-9 gap-1.5"
            title="Salin skrip SQL untuk menambahkan kolom photos ke database Supabase"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Salin SQL Migrasi</span>
          </Button>

          <Button
            onClick={() => fetchExperiences(true)}
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
            <span>Tambah Pengalaman</span>
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-xs font-mono">Memuat riwayat kerja...</span>
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
            Belum ada riwayat pengalaman.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-bold font-mono text-white">
                      {exp.role}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      {exp.company}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                        exp.status === "Active"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.duration}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{exp.type}</span>
                  </div>

                  {exp.highlights && (
                    <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                      {exp.highlights}
                    </p>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Foto Dokumentasi Preview */}
                  {exp.photos && exp.photos.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-mono text-zinc-400">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Dokumentasi Kegiatan ({exp.photos.length} foto):</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {exp.photos.map((photoUrl, pIdx) => (
                          <div
                            key={pIdx}
                            className="relative aspect-video w-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0"
                          >
                            <Image
                              src={photoUrl}
                              alt={`Dokumentasi ${exp.company} ${pIdx + 1}`}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  <Button
                    onClick={() => openEditDialog(exp)}
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-xl border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </Button>

                  {exp.id && (
                    <Button
                      onClick={() => handleDelete(exp.id, exp.company)}
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-xl border-red-900/60 bg-red-950/30 hover:bg-red-900/50 text-red-300 text-xs font-mono"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-mono text-base font-bold">
              {editingId ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 font-mono">
              Kelola entri pekerjaan profesional untuk ditampilkan di timeline karir
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Nama Perusahaan / Organisasi <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="PT Maxxima Innovative Engineering"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Posisi / Jabatan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Web Developer"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            {/* Dedicated Calendar-driven Period Section */}
            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono font-bold text-white">
                    Periode Waktu & Durasi (Kalender)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  Format Otomatis
                </span>
              </div>

              {/* Date validation check */}
              {(() => {
                const isInvalidRange = !isCurrent && Boolean(startMonth) && Boolean(endMonth) && endMonth < startMonth;

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Tanggal Mulai */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-medium text-zinc-300 flex items-center justify-between">
                          <span>Bulan Mulai (Start Date) <span className="text-red-400">*</span></span>
                          {startMonth && (
                            <span className="text-blue-400 font-normal">
                              {formatMonthYear(startMonth)}
                            </span>
                          )}
                        </label>
                        <input
                          type="month"
                          required
                          value={startMonth}
                          onChange={(e) => handleStartMonthChange(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      {/* Tanggal Selesai */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono font-medium text-zinc-300 flex items-center justify-between">
                          <span>Bulan Selesai (End Date)</span>
                          {!isCurrent && endMonth && (
                            <span className={isInvalidRange ? "text-red-400 font-semibold" : "text-blue-400 font-normal"}>
                              {formatMonthYear(endMonth)}
                            </span>
                          )}
                        </label>
                        {isCurrent ? (
                          <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400 flex items-center gap-2 min-h-[36px]">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-mono text-emerald-400 font-medium text-[11px]">
                              Sekarang / Masih Bekerja
                            </span>
                          </div>
                        ) : (
                          <input
                            type="month"
                            min={startMonth}
                            value={endMonth}
                            onChange={(e) => handleEndMonthChange(e.target.value)}
                            className={`w-full bg-zinc-900 border rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors ${
                              isInvalidRange
                                ? "border-red-500/80 text-red-300 focus:border-red-500"
                                : "border-zinc-700/80 focus:border-blue-500"
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    {isInvalidRange && (
                      <p className="text-[11px] font-mono text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-900/50 flex items-center gap-1.5">
                        <span>⚠️ Bulan selesai tidak boleh lebih awal dari bulan mulai ({formatMonthYear(startMonth)}).</span>
                      </p>
                    )}
                  </>
                );
              })()}

              {/* Toggle Masih Bekerja */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-mono text-zinc-300 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => handleCurrentToggle(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500/20 cursor-pointer accent-blue-500"
                  />
                  <span>Masih Bekerja di Sini (Role Aktif / Sekarang)</span>
                </label>

                {/* Duration summary badge */}
                {duration && (
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-zinc-500">Hasil:</span>
                    <span className="text-white font-semibold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                      {duration}
                    </span>
                    {elapsed.text && (
                      <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                        {elapsed.text}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Optional Custom Manual Override */}
              {isCustomDuration ? (
                <div className="pt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400">
                      Mode Teks Manual Aktif:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomDuration(false);
                        const autoDur = buildDurationPeriod(
                          startMonth,
                          isCurrent ? "" : endMonth,
                          isCurrent
                        );
                        setDuration(autoDur);
                      }}
                      className="text-[10px] font-mono text-blue-400 hover:underline"
                    >
                      Kembalikan ke Otomatis Kalender
                    </button>
                  </div>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              ) : (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsCustomDuration(true)}
                    className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    + Edit Teks Manual (Opsional)
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Status Timeline
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as "Active" | "Completed";
                    setStatus(newStatus);
                    if (newStatus === "Active" && !isCurrent) {
                      handleCurrentToggle(true);
                    } else if (newStatus === "Completed" && isCurrent) {
                      handleCurrentToggle(false);
                    }
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Active">Active (Masih Bekerja)</option>
                  <option value="Completed">Completed (Selesai)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Tipe Pengalaman
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "Industry" | "Internship" | "Organization")
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Industry">Industry</option>
                  <option value="Internship">Internship / Magang</option>
                  <option value="Organization">Organization</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Deskripsi Singkat / Highlights
              </label>
              <textarea
                rows={2}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="Rangkuman peran, kontribusi sistem, dan teknologi yang difokuskan..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Deliverables / Poin Tanggung Jawab (Pisahkan per baris baru)
              </label>
              <textarea
                rows={3}
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                placeholder="Membangun sistem web performa tinggi menggunakan Next.js...&#10;Melakukan optimasi query database PostgreSQL..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Teknologi yang Dipakai (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="Next.js, TypeScript, PostgreSQL, Docker"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Foto Dokumentasi Pengalaman Kerja */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Foto Dokumentasi Kegiatan / Hasil Pekerjaan (Opsional)
                </label>
                <button
                  type="button"
                  onClick={copySqlMigration}
                  className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors underline"
                  title="Salin skrip SQL untuk mengaktifkan kolom photos di database Supabase"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin SQL Supabase jika foto belum tersimpan</span>
                </button>
              </div>
              <MultiImageUploader
                values={photos}
                onChange={setPhotos}
                bucket="portfolio-assets"
                folder="experiences"
                maxFiles={8}
                label="Upload Foto Dokumentasi Pengalaman"
                helperText="Pilih atau seret foto dokumentasi magang, suasana kantor, presentasi, atau sertifikat (Maks. 5MB per file)"
              />
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
                <span>Simpan Pengalaman</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
