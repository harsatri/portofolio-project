"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  Save,
  Loader2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Code2,
  FileDown,
  ArrowRight,
  Briefcase,
  Layers,
  Database,
  Copy,
  Sliders,
  ZoomIn,
  RotateCcw,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Github, Linkedin, GmailLogo, WhatsappLogo } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import {
  DEFAULT_PROFILE,
  parseAvatarUrl,
  buildAvatarUrl,
  type ProfileHighlightCard,
} from "@/lib/portfolio-defaults";
import { triggerRevalidation } from "@/lib/revalidate";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

function parsePositionCoords(posStr: string = "55% 20%"): { x: number; y: number } {
  const parts = posStr.trim().split(/\s+/);
  let x = 55;
  let y = 20;

  if (parts.length >= 2) {
    if (parts[0] === "center") x = 50;
    else if (parts[0] === "left") x = 0;
    else if (parts[0] === "right") x = 100;
    else {
      const parsedX = parseInt(parts[0], 10);
      if (!isNaN(parsedX)) x = parsedX;
    }

    if (parts[1] === "center") y = 50;
    else if (parts[1] === "top") y = 0;
    else if (parts[1] === "bottom") y = 100;
    else {
      const parsedY = parseInt(parts[1], 10);
      if (!isNaN(parsedY)) y = parsedY;
    }
  } else if (posStr === "center") {
    x = 50;
    y = 50;
  }
  return { x, y };
}

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);

  // Form State
  const [name, setName] = useState(DEFAULT_PROFILE.name);
  const [role, setRole] = useState(DEFAULT_PROFILE.role);
  const [tagline, setTagline] = useState(DEFAULT_PROFILE.tagline);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_PROFILE.avatar_url);
  const [avatarPosition, setAvatarPosition] = useState(DEFAULT_PROFILE.avatar_position || "55% 20%");
  const [avatarScale, setAvatarScale] = useState(DEFAULT_PROFILE.avatar_scale ?? 100);
  const [avatarOffsetY, setAvatarOffsetY] = useState(DEFAULT_PROFILE.avatar_offset_y ?? 0);
  const [avatarOffsetX, setAvatarOffsetX] = useState(DEFAULT_PROFILE.avatar_offset_x ?? 0);
  const [avatarOpacity, setAvatarOpacity] = useState(DEFAULT_PROFILE.avatar_opacity ?? 45);
  const [statusBadge, setStatusBadge] = useState(DEFAULT_PROFILE.status_badge);
  const [isAvailable, setIsAvailable] = useState(DEFAULT_PROFILE.is_available);

  // CTA State
  const [ctaPrimaryText, setCtaPrimaryText] = useState(DEFAULT_PROFILE.cta_primary_text);
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(DEFAULT_PROFILE.cta_primary_url);
  const [ctaCvText, setCtaCvText] = useState(DEFAULT_PROFILE.cta_cv_text);
  const [ctaCvUrl, setCtaCvUrl] = useState(DEFAULT_PROFILE.cta_cv_url);
  const [ctaContactText, setCtaContactText] = useState(DEFAULT_PROFILE.cta_contact_text);
  const [ctaContactUrl, setCtaContactUrl] = useState(DEFAULT_PROFILE.cta_contact_url);

  // Socials State
  const [githubUrl, setGithubUrl] = useState(DEFAULT_PROFILE.github_url);
  const [linkedinUrl, setLinkedinUrl] = useState(DEFAULT_PROFILE.linkedin_url);
  const [whatsappUrl, setWhatsappUrl] = useState(DEFAULT_PROFILE.whatsapp_url);
  const [email, setEmail] = useState(DEFAULT_PROFILE.email);

  // Highlights Cards (3 Cards)
  const [highlights, setHighlights] = useState<ProfileHighlightCard[]>(
    DEFAULT_PROFILE.highlights
  );

  const fetchProfile = async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("not find the table")) {
          setTableMissing(true);
        }
        console.warn("[fetchProfile] Gunakan data default profil:", error.message);
        return;
      }

      if (data) {
        setName(data.name || DEFAULT_PROFILE.name);
        setRole(data.role || DEFAULT_PROFILE.role);
        setTagline(data.tagline || DEFAULT_PROFILE.tagline);
        const cfg = parseAvatarUrl(data.avatar_url);
        setAvatarUrl(
          (data.avatar_url ? data.avatar_url.split("?")[0] : "") || DEFAULT_PROFILE.avatar_url
        );
        setAvatarPosition(data.avatar_position || cfg.position || DEFAULT_PROFILE.avatar_position || "55% 20%");
        setAvatarScale(typeof data.avatar_scale === "number" ? data.avatar_scale : (cfg.scale ?? DEFAULT_PROFILE.avatar_scale ?? 100));
        setAvatarOffsetY(typeof data.avatar_offset_y === "number" ? data.avatar_offset_y : (cfg.offsetY ?? DEFAULT_PROFILE.avatar_offset_y ?? 0));
        setAvatarOffsetX(typeof data.avatar_offset_x === "number" ? data.avatar_offset_x : (cfg.offsetX ?? DEFAULT_PROFILE.avatar_offset_x ?? 0));
        setAvatarOpacity(typeof data.avatar_opacity === "number" ? data.avatar_opacity : (cfg.opacity ?? DEFAULT_PROFILE.avatar_opacity ?? 45));

        setStatusBadge(data.status_badge || DEFAULT_PROFILE.status_badge);
        setIsAvailable(
          typeof data.is_available === "boolean"
            ? data.is_available
            : DEFAULT_PROFILE.is_available
        );

        setCtaPrimaryText(data.cta_primary_text || DEFAULT_PROFILE.cta_primary_text);
        setCtaPrimaryUrl(data.cta_primary_url || DEFAULT_PROFILE.cta_primary_url);
        setCtaCvText(data.cta_cv_text || DEFAULT_PROFILE.cta_cv_text);
        setCtaCvUrl(data.cta_cv_url || DEFAULT_PROFILE.cta_cv_url);
        setCtaContactText(data.cta_contact_text || DEFAULT_PROFILE.cta_contact_text);
        setCtaContactUrl(data.cta_contact_url || DEFAULT_PROFILE.cta_contact_url);

        setGithubUrl(data.github_url || DEFAULT_PROFILE.github_url);
        setLinkedinUrl(data.linkedin_url || DEFAULT_PROFILE.linkedin_url);
        setWhatsappUrl(data.whatsapp_url || DEFAULT_PROFILE.whatsapp_url);
        setEmail(data.email || DEFAULT_PROFILE.email);

        if (Array.isArray(data.highlights) && data.highlights.length > 0) {
          setHighlights(data.highlights as ProfileHighlightCard[]);
        }
      }
    } catch (err) {
      console.error("Error saat membaca profil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleHighlightChange = (
    index: number,
    field: keyof ProfileHighlightCard,
    value: string
  ) => {
    setHighlights((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama lengkap tidak boleh kosong");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const cleanAvatar = (avatarUrl || DEFAULT_PROFILE.avatar_url).split("?")[0].trim();
      const builtAvatar = buildAvatarUrl(cleanAvatar, {
        position: avatarPosition,
        scale: avatarScale,
        offsetY: avatarOffsetY,
        offsetX: avatarOffsetX,
        opacity: avatarOpacity,
      });

      const payload: Record<string, unknown> = {
        id: "main",
        name: name.trim(),
        role: role.trim(),
        tagline: tagline.trim(),
        avatar_url: builtAvatar,
        status_badge: statusBadge.trim(),
        is_available: isAvailable,
        cta_primary_text: ctaPrimaryText.trim(),
        cta_primary_url: ctaPrimaryUrl.trim(),
        cta_cv_text: ctaCvText.trim(),
        cta_cv_url: ctaCvUrl.trim(),
        cta_contact_text: ctaContactText.trim(),
        cta_contact_url: ctaContactUrl.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        whatsapp_url: whatsappUrl.trim(),
        email: email.trim(),
        highlights,
        updated_at: new Date().toISOString(),
      };

      // Coba simpan dengan kolom spesifik posisi & skala
      let { error } = await supabase.from("profile").upsert({
        ...payload,
        avatar_position: avatarPosition,
        avatar_scale: avatarScale,
        avatar_offset_y: avatarOffsetY,
        avatar_offset_x: avatarOffsetX,
        avatar_opacity: avatarOpacity,
      }, {
        onConflict: "id",
      });

      if (error && (error.code === "42703" || error.message?.includes("avatar_position") || error.message?.includes("column"))) {
        // Fallback jika kolom avatar_position belum di-alter di DB (data tetap tersimpan rapi di URL parameter avatar_url)
        const res = await supabase.from("profile").upsert(payload, { onConflict: "id" });
        error = res.error;
      }

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("not find the table")) {
          setTableMissing(true);
          toast.error("Tabel 'profile' belum dibuat di database Supabase.");
          return;
        }
        throw error;
      }

      // Revalidate homepage cache
      await triggerRevalidation("/");
      toast.success("Profil berhasil disimpan!");
      setTableMissing(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan profil"));
    } finally {
      setSaving(false);
    }
  };

  const copySqlMigration = () => {
    const sql = `-- Buat tabel public.profile jika belum pernah dibuat sama sekali
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT NOT NULL DEFAULT 'Harsa Tri Novenda',
    role TEXT NOT NULL DEFAULT 'Frontend & Full-Stack Web Developer',
    tagline TEXT NOT NULL DEFAULT 'Fresh Graduate S1 Sistem Informasi Universitas Telkom. Fokus pada membangun antarmuka modern, aplikasi web full-stack, dan sistem berbasis data yang scalable.',
    avatar_url TEXT NOT NULL DEFAULT '/profile.jpg',
    avatar_position TEXT DEFAULT '55% 20%',
    avatar_scale INT DEFAULT 100,
    avatar_offset_y INT DEFAULT 0,
    avatar_offset_x INT DEFAULT 0,
    avatar_opacity INT DEFAULT 45,
    status_badge TEXT DEFAULT 'Open to Work',
    is_available BOOLEAN DEFAULT true,
    cta_primary_text TEXT DEFAULT 'Explore Projects',
    cta_primary_url TEXT DEFAULT '#projects',
    cta_cv_text TEXT DEFAULT 'Download CV',
    cta_cv_url TEXT DEFAULT '/cv.pdf',
    cta_contact_text TEXT DEFAULT 'Contact Me',
    cta_contact_url TEXT DEFAULT '#contact',
    github_url TEXT DEFAULT 'https://github.com/hasnatria',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/in/harsa-tri-novenda',
    whatsapp_url TEXT DEFAULT 'https://wa.me/62',
    email TEXT DEFAULT '',
    highlights JSONB DEFAULT '[
        {"label": "EDUCATION", "title": "S1 Sistem Informasi", "subtitle": "Universitas Telkom", "icon": "briefcase"},
        {"label": "CORE SPECIALTIES", "title": "React.js & Next.js", "subtitle": "Laravel & Node.js", "icon": "layers"},
        {"label": "FOCUS AREA", "title": "Frontend & Full-Stack", "subtitle": "MySQL & PostgreSQL", "icon": "database"}
    ]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_position TEXT DEFAULT '55% 20%';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_scale INT DEFAULT 100;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_offset_y INT DEFAULT 0;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_offset_x INT DEFAULT 0;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_opacity INT DEFAULT 45;

-- Aktifkan RLS dan perizinan akses aman
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON TABLE public.profile TO anon;
GRANT ALL ON TABLE public.profile TO authenticated;

DROP POLICY IF EXISTS "Anon read profile" ON public.profile;
CREATE POLICY "Anon read profile" ON public.profile FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Authenticated manage profile" ON public.profile;
CREATE POLICY "Authenticated manage profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Reload cache schema PostgREST Supabase
NOTIFY pgrst, 'reload schema';`;

    navigator.clipboard.writeText(sql);
    toast.success("Script SQL disalin ke clipboard!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-mono text-zinc-400">Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-400" />
            Profile & Hero Configuration
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            Atur foto profil, bio, status ketersediaan, tautan sosial, dan kartu sorotan hero section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchProfile}
            disabled={loading}
            className="border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-mono gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold gap-2 cursor-pointer shadow-md"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* Database Warning Alert if Table Not Created Yet */}
      {tableMissing && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono font-bold text-xs">
              <span>⚠️ Tabel &apos;public.profile&apos; belum dibuat di Supabase SQL Editor.</span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={copySqlMigration}
              className="h-7 text-xs font-mono border-amber-500/40 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin SQL Migration</span>
            </Button>
          </div>
          <p className="text-xs text-amber-300/80 leading-relaxed font-sans">
            Tabel database untuk menyimpan profil secara online belum ada di proyek Supabase Anda. Anda dapat menyalin script SQL di atas dan menjalankannya di SQL Editor Supabase. Saat ini sistem tetap berjalan menggunakan data default.
          </p>
        </div>
      )}

      {/* Live Hero Preview (Full-Bleed Cinematic Editorial layout) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl min-h-[420px] flex flex-col justify-between">
        {/* Full-bleed Backdrop Image Preview */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <div
            className="relative w-full h-full transition-all duration-200"
            style={{
              transform: `scale(${avatarScale / 100}) translate(${avatarOffsetX}px, ${avatarOffsetY}px)`,
              transformOrigin: avatarPosition,
            }}
          >
            <Image
              src={avatarUrl ? avatarUrl.split(/[?#]/)[0] : "/profile.jpg"}
              alt={name || "Harsa Tri Novenda"}
              fill
              className="object-cover filter contrast-105 brightness-100 transition-all duration-200"
              style={{
                objectPosition: avatarPosition,
                opacity: avatarOpacity / 100,
              }}
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950/80" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Live Hero Section Preview (Cinematic Editorial)
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Tampilan persis seperti di Landing Page
            </span>
          </div>



          {/* Editorial Stage: OVERVIEW & PHILOSOPHY */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-2">
            {/* Left Column */}
            <div className="md:col-span-6 space-y-3 text-left">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-semibold">
                OVERVIEW & PHILOSOPHY
              </span>
              <p className="text-xs font-sans text-zinc-200 font-medium leading-relaxed line-clamp-3">
                {tagline || "A brief description of your expertise and technology interests..."}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 text-[10px] font-mono text-zinc-300">
                {isAvailable && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span>{statusBadge || "Available for Projects"}</span>
              </div>
            </div>

            {/* Right Column: Display Name & Core Disciplines */}
            <div className="md:col-span-6 space-y-3 text-left md:text-right">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none">
                {name ? (
                  name.split(" ").map((word, i) => (
                    <span key={i} className={`block${i > 0 ? " text-zinc-500" : ""}`}>{word}</span>
                  ))
                ) : (
                  <span className="block text-zinc-500">YOUR NAME</span>
                )}
              </h1>
              <div className="pt-2 border-t border-zinc-800/60">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-semibold md:text-right">
                  CORE DISCIPLINES & STACK
                </span>
                <p className="text-xs font-mono font-bold text-zinc-300 uppercase">
                  {role || "Full-Stack Web Developer"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Dock & Ticker Bar */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-full bg-white text-zinc-950 font-semibold text-xs flex items-center gap-1.5">
                  <span>{ctaPrimaryText || "Explore Projects"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                <div className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs flex items-center gap-1.5">
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ctaCvText || "Download CV"}</span>
                </div>

                <div className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-xs">
                  <span>{ctaContactText || "Contact Me"}</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-1.5">
                <div className="p-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400">
                  <Github className="w-3.5 h-3.5" />
                </div>
                <div className="p-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400">
                  <Linkedin className="w-3.5 h-3.5" />
                </div>
                <div className="p-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400">
                  <WhatsappLogo className="w-3.5 h-3.5" />
                </div>
                <div className="p-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400">
                  <GmailLogo className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Running Ticker Marquee Preview */}
            <div className="overflow-hidden py-1 border-t border-b border-zinc-800/40 bg-zinc-950/80 font-mono text-[10px] text-zinc-500 uppercase tracking-widest whitespace-nowrap text-center">
              ◀ PRODUCTION SYSTEMS • QUERY EFFICIENCY • DISTRIBUTED DATA • TELKOM 2026 ▶
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Photo & Availability */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                1. Foto Profil & Status
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                Unggah foto profil Anda. Anda dapat langsung menggeser posisi wajah dan mengatur zoom di dalam lingkaran seperti di WhatsApp / LinkedIn.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Avatar Uploader */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-mono text-zinc-300 font-semibold block">
                Foto Profil (Interactive Circular Crop)
              </label>
              <ImageUploader
                value={avatarUrl}
                onChange={setAvatarUrl}
                bucket="portfolio-assets"
                folder="profile"
                previewShape="circle"
              />
              <p className="text-[11px] text-zinc-500 font-mono text-center sm:text-left">
                Maksimal 15MB. Foto otomatis di-crop 1:1 dan disimpan dalam format WebP berkualitas tinggi.
              </p>
            </div>

            {/* Status & Availability toggle */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-300 font-semibold">
                  Teks Status Badge
                </label>
                <Input
                  value={statusBadge}
                  onChange={(e) => setStatusBadge(e.target.value)}
                  placeholder="Contoh: Available for Engineering Projects"
                  className="bg-zinc-950 border-zinc-700 text-zinc-100 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70">
                <input
                  type="checkbox"
                  id="isAvailableToggle"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-zinc-900 border-zinc-700 cursor-pointer"
                />
                <label
                  htmlFor="isAvailableToggle"
                  className="text-xs font-mono text-zinc-200 cursor-pointer select-none"
                >
                  Aktifkan Indikator Ketersediaan Hijau (Live Ping Pulse)
                </label>
              </div>
            </div>
          </div>

          {/* Card Penyesuaian Posisi Foto di Hero (Biar Pas / Ngepas) */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div>
                <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Penyesuaian Posisi Foto Hero (&ldquo;Biar Ngepas&rdquo;)</span>
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Atur posisi fokus wajah dan ukuran zoom foto portrait agar pas dengan teks dan layout hero. Perubahan langsung terlihat di Live Preview di atas!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAvatarPosition("55% 20%");
                  setAvatarScale(100);
                  setAvatarOffsetY(0);
                  setAvatarOffsetX(0);
                  setAvatarOpacity(45);
                  toast.success("Posisi foto di-reset ke rekomendasi!");
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-300 transition-colors cursor-pointer self-start sm:self-auto"
                title="Reset to optimal position"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Rekomendasi</span>
              </button>
            </div>

            {/* Quick Position Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 font-semibold block">
                Pilihan Posisi Cepat (Preset Otomatis)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPosition("55% 18%");
                    setAvatarScale(100);
                    toast.info("Preset: Fokus Wajah Desktop (55% 18%) diterapkan");
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border text-left transition-colors cursor-pointer ${
                    avatarPosition === "55% 18%" || avatarPosition === "55% 20%"
                      ? "bg-blue-950/70 border-blue-600 text-blue-200 font-bold"
                      : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="block font-bold">🎯 Fokus Wajah Hero</span>
                  <span className="text-[10px] text-zinc-400 block">55% 18% (Rekomendasi)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAvatarPosition("center 15%");
                    setAvatarScale(100);
                    toast.info("Preset: Wajah Tengah Simetris (Center 15%) diterapkan");
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border text-left transition-colors cursor-pointer ${
                    avatarPosition === "center 15%"
                      ? "bg-blue-950/70 border-blue-600 text-blue-200 font-bold"
                      : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="block font-bold">👤 Wajah Tengah</span>
                  <span className="text-[10px] text-zinc-400 block">center 15% (Simetris)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAvatarPosition("55% 32%");
                    setAvatarScale(105);
                    toast.info("Preset: Fokus Setengah Badan (55% 32%) diterapkan");
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border text-left transition-colors cursor-pointer ${
                    avatarPosition === "55% 32%"
                      ? "bg-blue-950/70 border-blue-600 text-blue-200 font-bold"
                      : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="block font-bold">📐 Setengah Badan</span>
                  <span className="text-[10px] text-zinc-400 block">55% 32% (Dada/Bahu)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAvatarPosition("center center");
                    setAvatarScale(100);
                    toast.info("Preset: Tengah Penuh (Center Center) diterapkan");
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border text-left transition-colors cursor-pointer ${
                    avatarPosition === "center center" || avatarPosition === "50% 50%"
                      ? "bg-blue-950/70 border-blue-600 text-blue-200 font-bold"
                      : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <span className="block font-bold">⚖️ Tengah Penuh</span>
                  <span className="text-[10px] text-zinc-400 block">center center (50% 50%)</span>
                </button>
              </div>
            </div>

            {/* Fine-Tuning Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Vertical Position Slider Y */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Move className="w-3 h-3 rotate-90" />
                    <span>Tinggi Wajah (Y)</span>
                  </span>
                  <span className="text-blue-400 font-bold bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
                    {parsePositionCoords(avatarPosition).y}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={parsePositionCoords(avatarPosition).y}
                  aria-label="Tinggi Wajah (Y)"
                  onChange={(e) => {
                    const current = parsePositionCoords(avatarPosition);
                    setAvatarPosition(`${current.x}% ${e.target.value}%`);
                  }}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>Atas (0%)</span>
                  <span>Bawah (100%)</span>
                </div>
              </div>

              {/* Horizontal Position Slider X */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Move className="w-3 h-3" />
                    <span>Posisi Samping (X)</span>
                  </span>
                  <span className="text-blue-400 font-bold bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
                    {parsePositionCoords(avatarPosition).x}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={parsePositionCoords(avatarPosition).x}
                  aria-label="Posisi Samping (X)"
                  onChange={(e) => {
                    const current = parsePositionCoords(avatarPosition);
                    setAvatarPosition(`${e.target.value}% ${current.y}%`);
                  }}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>Kiri (0%)</span>
                  <span>Kanan (100%)</span>
                </div>
              </div>

              {/* Hero Zoom / Scale Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom Foto Hero</span>
                  </span>
                  <span className="text-blue-400 font-bold bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800/40">
                    {avatarScale}%
                  </span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={160}
                  step={2}
                  value={avatarScale}
                  aria-label="Zoom Foto Hero"
                  onChange={(e) => setAvatarScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>80%</span>
                  <span>100% (Normal)</span>
                  <span>160%</span>
                </div>
              </div>

              {/* Opacity / Brightness Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Kecerahan / Opacity</span>
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    {avatarOpacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={85}
                  step={5}
                  value={avatarOpacity}
                  aria-label="Kecerahan / Opacity"
                  onChange={(e) => setAvatarOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>Samar (20%)</span>
                  <span>Terang (85%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Identity */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              2. Main Identity & Role
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-sans">
              Nama lengkap, profesi teknikal, dan ringkasan bio yang tampil di landing page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 font-semibold">
                Nama Lengkap *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Harsa Tri Novenda"
                required
                className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 font-semibold">
                Main Role / Profession *
              </label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Full-Stack Web Developer"
                required
                className="bg-zinc-950 border-zinc-700 text-zinc-100 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300 font-semibold">
              Bio Tagline / Expertise Summary
            </label>
            <Textarea
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={3}
              placeholder="A short description of your web architecture expertise, database performance, etc..."
              className="bg-zinc-950 border-zinc-700 text-zinc-100 text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: Call to Action (CTA) Buttons & CV */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-400" />
              3. Tombol Aksi (CTA) & Tautan CV
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-sans">
              Atur teks dan URL target untuk ketiga tombol utama di Hero section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary CTA */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block">
                Tombol Utama (Explore)
              </span>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Label Teks</label>
                <Input
                  value={ctaPrimaryText}
                  onChange={(e) => setCtaPrimaryText(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Target URL / Anchor</label>
                <Input
                  value={ctaPrimaryUrl}
                  onChange={(e) => setCtaPrimaryUrl(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                />
              </div>
            </div>

            {/* CV Download CTA */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block">
                Tombol CV (Download)
              </span>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Label Teks</label>
                <Input
                  value={ctaCvText}
                  onChange={(e) => setCtaCvText(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">File / URL CV</label>
                <Input
                  value={ctaCvUrl}
                  onChange={(e) => setCtaCvUrl(e.target.value)}
                  placeholder="/cv.pdf"
                  className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                />
              </div>
            </div>

            {/* Contact CTA */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block">
                Contact Button
              </span>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Label Teks</label>
                <Input
                  value={ctaContactText}
                  onChange={(e) => setCtaContactText(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Target URL / Anchor</label>
                <Input
                  value={ctaContactUrl}
                  onChange={(e) => setCtaContactUrl(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Social Media & Contact Links */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-purple-400" />
              4. Social Media & Connected Contacts
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-sans">
              Ikon sosial pada hero section akan otomatis mengarah ke tautan yang Anda tentukan di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <Github className="w-3.5 h-3.5" />
                GitHub URL
              </label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="bg-zinc-950 border-zinc-700 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn URL
              </label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="bg-zinc-950 border-zinc-700 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <WhatsappLogo className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp URL / Nomor
              </label>
              <Input
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://wa.me/628..."
                className="bg-zinc-950 border-zinc-700 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <GmailLogo className="w-3.5 h-3.5 text-red-400" />
                Email Address
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="bg-zinc-950 border-zinc-700 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Bento Highlights Cards */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              5. Tiga Kartu Sorotan Bento (Hero Highlights)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-sans">
              Kelola teks label, judul utama, dan sub-judul pada 3 kartu highlight di bagian bawah Hero section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((card, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                    Kartu {idx + 1}
                  </span>
                  {idx === 0 && <Briefcase className="w-3.5 h-3.5 text-blue-400" />}
                  {idx === 1 && <Layers className="w-3.5 h-3.5 text-emerald-400" />}
                  {idx === 2 && <Database className="w-3.5 h-3.5 text-amber-400" />}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 font-semibold">
                    Category Label
                  </label>
                  <Input
                    value={card.label}
                    onChange={(e) =>
                      handleHighlightChange(idx, "label", e.target.value)
                    }
                    placeholder="Contoh: CURRENT ROLE"
                    className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 font-semibold">
                    Judul Utama
                  </label>
                  <Input
                    value={card.title}
                    onChange={(e) =>
                      handleHighlightChange(idx, "title", e.target.value)
                    }
                    placeholder="Contoh: Web Developer"
                    className="bg-zinc-900 border-zinc-700 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 font-semibold">
                    Sub-Judul / Instansi
                  </label>
                  <Input
                    value={card.subtitle}
                    onChange={(e) =>
                      handleHighlightChange(idx, "subtitle", e.target.value)
                    }
                    placeholder="Contoh: PT Maxxima Innovative Engineering"
                    className="bg-zinc-900 border-zinc-700 text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button
            type="submit"
            disabled={saving}
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold gap-2 px-6 shadow-lg cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan & Memperbarui Cache...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Semua Pengaturan Profil</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
