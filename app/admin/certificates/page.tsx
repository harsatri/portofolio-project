"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_CERTIFICATES, type CertificateItem } from "@/lib/portfolio-defaults";
import { getErrorMessage } from "@/lib/utils";
import { triggerRevalidation } from "@/lib/revalidate";
import {
  formatCertificateDate,
  parseDurationString,
} from "@/lib/date-utils";
import { toast } from "sonner";

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [certMonth, setCertMonth] = useState("");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [isNoExpiration, setIsNoExpiration] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const supabase = createClient();

  const fetchCertificates = async (isManualRefresh = false) => {
    if (isManualRefresh) setLoading(true);
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setCertificates(DEFAULT_CERTIFICATES);
      } else {
        setCertificates(
          data.map((c) => ({
            id: c.id,
            title: c.title,
            issuer: c.issuer,
            date: c.date,
            credentialId: c.credential_id || "",
            credentialUrl: c.credential_url || "",
            imageUrl: c.image_url || undefined,
            skillsVerified: c.skills_verified || [],
            expirationDate: c.expiration_date || c.valid_until || "",
            isNoExpiration: Boolean(c.is_no_expiration ?? !(c.expiration_date || c.valid_until)),
          }))
        );
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal memuat sertifikat"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCertMonthChange = (val: string) => {
    setCertMonth(val);
    if (!isCustomDate) {
      setDate(formatCertificateDate(val));
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setTitle("");
    setIssuer("");
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setCertMonth(currentYM);
    setDate(formatCertificateDate(currentYM));
    setIsCustomDate(false);
    setIsNoExpiration(true);
    setExpirationDate("");
    setCredentialId("");
    setCredentialUrl("");
    setImageUrl("");
    setSkillsText("");
    setDialogOpen(true);
  };

  const openEditDialog = (c: CertificateItem) => {
    setEditingId(c.id || null);
    setTitle(c.title);
    setIssuer(c.issuer);
    setDate(c.date);

    const parsed = parseDurationString(c.date);
    setCertMonth(parsed.startMonth || "");
    setIsCustomDate(false);
    setIsNoExpiration(c.isNoExpiration ?? !c.expirationDate);
    setExpirationDate(c.expirationDate || "");

    setCredentialId(c.credentialId || "");
    setCredentialUrl(c.credentialUrl);
    setImageUrl(c.imageUrl || "");
    setSkillsText(c.skillsVerified.join(", "));
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) {
      toast.error("Nama Sertifikat dan Penerbit wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const skillsVerified = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const finalDate = date.trim() || formatCertificateDate(certMonth);
      const finalIssueDate = certMonth
        ? `${certMonth}-01`
        : (finalDate.length === 4 ? `${finalDate}-01-01` : "2024-01-01");

      const payload: Record<string, unknown> = {
        title: title.trim(),
        issuer: issuer.trim(),
        date: finalDate,
        issue_date: finalIssueDate,
        credential_id: credentialId.trim(),
        credential_url: credentialUrl.trim(),
        image_url: imageUrl.trim(),
        skills_verified: skillsVerified,
        is_no_expiration: isNoExpiration,
        expiration_date: isNoExpiration ? null : expirationDate.trim(),
      };

      const executeSave = async (payloadToUse: Record<string, unknown>) => {
        if (!editingId) {
          const { error } = await supabase.from("certificates").insert(payloadToUse);
          if (error) throw error;
          toast.success("Sertifikat berhasil ditambahkan!");
        } else {
          const { data, error } = await supabase
            .from("certificates")
            .update(payloadToUse)
            .eq("id", editingId)
            .select();
          if (error) throw error;
          if (!data || data.length === 0) {
            const { error: insertErr } = await supabase.from("certificates").insert(payloadToUse);
            if (insertErr) throw insertErr;
          }
          toast.success("Sertifikat berhasil diperbarui!");
        }
      };

      try {
        await executeSave(payload);
      } catch (saveErr: unknown) {
        const errorMsg = getErrorMessage(saveErr).toLowerCase();
        if (errorMsg.includes("column") || errorMsg.includes("schema cache")) {
          console.warn("[Certificates] Kolom tambahan belum ada di Supabase, menyimpan payload minimal...");
          const fallbackPayload: Record<string, unknown> = {
            title: title.trim(),
            issuer: issuer.trim(),
            date: finalDate,
          };
          await executeSave(fallbackPayload);
          toast.warning("Tersimpan dengan penyesuaian kolom karena skema database belum sepenuhnya sinkron.");
        } else {
          throw saveErr;
        }
      }

      await triggerRevalidation("/");
      setDialogOpen(false);
      fetchCertificates();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan sertifikat"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string, certTitle?: string) => {
    if (!id) {
      toast.error("Sertifikat default tidak dapat dihapus dari database lokal");
      return;
    }
    if (!confirm(`Hapus sertifikat "${certTitle}"?`)) return;

    try {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Sertifikat berhasil dihapus");
      await triggerRevalidation("/");
      fetchCertificates();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menghapus sertifikat"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Manajemen Sertifikat & Kredensial</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Kelola sertifikasi kompetensi, lisensi resmi, dan tautan verifikasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchCertificates(true)}
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
            <span>Tambah Sertifikat</span>
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span className="text-xs font-mono">Memuat sertifikat...</span>
          </div>
        ) : certificates.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 font-mono text-xs">
            Belum ada sertifikat terdaftar.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {certificates.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold font-mono text-white">
                      {c.title}
                    </span>
                    {c.credentialId && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {c.credentialId}
                      </span>
                    )}
                    {c.isNoExpiration ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                        Seumur Hidup / No Expiration
                      </span>
                    ) : c.expirationDate ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950/80 text-blue-400 border border-blue-800/60 font-semibold">
                        Berlaku s.d. {c.expirationDate}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs font-mono text-zinc-400">
                    Penerbit: <strong className="text-zinc-300">{c.issuer}</strong> • {c.date}
                  </p>

                  {c.skillsVerified && c.skillsVerified.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.skillsVerified.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      title="Buka Verifikasi"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <Button
                    onClick={() => openEditDialog(c)}
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-xl border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </Button>

                  {c.id && (
                    <Button
                      onClick={() => handleDelete(c.id, c.title)}
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
        <DialogContent className="max-w-xl bg-zinc-900 border-zinc-800 text-white p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-mono text-base font-bold">
              {editingId ? "Edit Sertifikat" : "Tambah Sertifikat Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 font-mono">
              Kelola kredensial profesional dan lisensi kompetensi Anda
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Nama Sertifikat <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sertifikat Kompetensi Pengembang Web (CWDev)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Lembaga Penerbit <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="BNSP / Dicoding / AWS"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-medium text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tanggal Terbit (Kalender)</span>
                  </label>
                  {date && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60 font-semibold">
                      {date}
                    </span>
                  )}
                </div>

                <input
                  type="month"
                  value={certMonth}
                  onChange={(e) => handleCertMonthChange(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />

                {isCustomDate ? (
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400">
                        Mode Teks Manual:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomDate(false);
                          setDate(formatCertificateDate(certMonth));
                        }}
                        className="text-[10px] font-mono text-emerald-400 hover:underline"
                      >
                        Kembalikan ke Kalender
                      </button>
                    </div>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="Contoh: Jun 2026"
                      className="w-full bg-zinc-900 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                ) : (
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => setIsCustomDate(true)}
                      className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      + Edit Teks Manual (Opsional)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Masa Berlaku / Validity Option */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-mono text-zinc-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={isNoExpiration}
                  onChange={(e) => {
                    setIsNoExpiration(e.target.checked);
                    if (e.target.checked) setExpirationDate("");
                  }}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer accent-emerald-500"
                />
                <span>Masa Berlaku: Seumur Hidup / No Expiration</span>
              </label>

              {!isNoExpiration && (
                <div className="space-y-1 pt-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 block">
                    Masa Berlaku s.d. (Valid Until)
                  </label>
                  <input
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="Contoh: Des 2028 atau Jun 2029"
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Credential ID (Opsional)
                </label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="BNSP-CWDEV-62026"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Tautan Verifikasi (Credential URL)
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://bnsp.go.id"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
            </div>

            {/* Certificate Image Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Upload File / Gambar Sertifikat (Opsional)
              </label>
              <ImageUploader
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                bucket="portfolio-assets"
                folder="certificates"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Keahlian yang Diverifikasi (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Web Development, Software Engineering, REST APIs"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
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
                <span>Simpan Sertifikat</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
