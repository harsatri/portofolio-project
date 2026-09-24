"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Eye,
  Edit3,
} from "lucide-react";
import { getTechLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { MarkdownView } from "@/components/ui/markdown-view";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_PROJECTS } from "@/lib/portfolio-defaults";
import { getErrorMessage } from "@/lib/utils";
import { triggerRevalidation } from "@/lib/revalidate";
import { toast } from "sonner";

interface ProjectFormData {
  title: string;
  slug: string;
  role: string;
  year: string;
  category: string;
  short_summary: string;
  full_description: string;
  thumbnail_url: string;
  gallery_urls: string[];
  tech_stacks: string[];
  live_url: string;
  repo_url: string;
  is_featured: boolean;
  display_order: number;
}

const initialFormData: ProjectFormData = {
  title: "",
  slug: "",
  role: "Full-stack Developer",
  year: "",
  category: "fullstack",
  short_summary: "",
  full_description: "",
  thumbnail_url: "",
  gallery_urls: [],
  tech_stacks: [],
  live_url: "",
  repo_url: "",
  is_featured: false,
  display_order: 1,
};

const COMMON_TECH_STACKS = [
  "React.js",
  "Next.js",
  "TypeScript",
  "JavaScript (ES6+)",
  "Tailwind CSS",
  "Bootstrap",
  "HTML5",
  "CSS3",
  "Node.js",
  "Express.js",
  "PHP",
  "Laravel",
  "Eloquent ORM",
  "Blade",
  "MySQL",
  "PostgreSQL",
  "Supabase",
  "Docker",
  "Socket.IO",
  "JWT",
  "Python",
  "Scikit-Learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Midtrans",
  "RESTful APIs",
  "WhatsApp API",
  "Laravel Auth",
  "Git",
  "Redis",
];

export default function ProjectFormPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const isNew = projectId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Consolidated Project Form Data State
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [markdownTab, setMarkdownTab] = useState<"edit" | "preview">("edit");
  const [techInput, setTechInput] = useState("");

  const supabase = createClient();

  const setFormField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      ...(isNew ? { slug: generateSlug(val) } : {}),
    }));
  };

  const handleAddTech = (tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    if (!formData.tech_stacks.includes(trimmed)) {
      setFormField("tech_stacks", [...formData.tech_stacks, trimmed]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormField(
      "tech_stacks",
      formData.tech_stacks.filter((t) => t !== techToRemove)
    );
  };

  useEffect(() => {
    if (isNew) return;

    const loadProject = async () => {
      setLoading(true);
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId);
        const query = supabase.from("projects").select("*");
        const { data, error } = await (isUuid
          ? query.or(`id.eq.${projectId},slug.eq.${projectId}`).maybeSingle()
          : query.eq("slug", projectId).maybeSingle()
        );

        if (data && !error) {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            role: data.role || data.subtitle || "Full-stack Developer",
            year: (typeof data.year === "string" ? data.year : "") || (typeof data.period === "string" ? data.period : "") || "",
            category: data.category || "fullstack",
            short_summary:
              data.short_summary ||
              data.summary ||
              (data.description ? data.description.slice(0, 180) : ""),
            full_description: data.full_description || data.description || "",
            thumbnail_url: data.thumbnail_url || data.image_url || "",
            gallery_urls: Array.isArray(data.gallery_urls) ? data.gallery_urls : [],
            tech_stacks:
              Array.isArray(data.tech_stacks) && data.tech_stacks.length > 0
                ? data.tech_stacks
                : Array.isArray(data.tags)
                ? data.tags
                : [],
            live_url: data.live_url || data.demo_url || "",
            repo_url: data.repo_url || data.github_url || "",
            is_featured: Boolean(data.is_featured ?? data.featured),
            display_order: Number(data.display_order ?? data.order_index ?? 1),
          });
        } else {
          // Fallback to static data
          const fallback = DEFAULT_PROJECTS.find(
            (p) => p.id === projectId || p.slug === projectId
          );
          if (fallback) {
            setFormData({
              title: fallback.title,
              slug: fallback.slug || fallback.id,
              role: fallback.role,
              year: fallback.year || fallback.period || "",
              category: fallback.category || "fullstack",
              short_summary: fallback.short_summary,
              full_description: fallback.full_description,
              thumbnail_url: fallback.thumbnail_url,
              gallery_urls: fallback.gallery_urls || [],
              tech_stacks: fallback.tech_stacks || fallback.techStack || [],
              live_url: fallback.live_url || fallback.demo || "",
              repo_url: fallback.repo_url || fallback.github || "",
              is_featured: fallback.is_featured,
              display_order: fallback.display_order,
            });
          }
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Gagal mengambil data project"));
      } finally {
        setLoading(false);
      }
    };

    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Judul dan Slug wajib diisi");
      return;
    }
    if (!formData.short_summary.trim()) {
      toast.error("Ringkasan Singkat (Short Summary) wajib diisi");
      return;
    }

    setSaving(true);
    try {
      type ProjectFormPayload = {
        title: string;
        slug: string;
        role: string;
        year?: string;
        period?: string;
        short_summary: string;
        full_description: string;
        thumbnail_url: string;
        gallery_urls: string[];
        tech_stacks: string[];
        live_url: string;
        repo_url: string;
        is_featured: boolean;
        display_order: number;
        category: string;
        // Dual-field compatibility with legacy database columns
        summary?: string;
        description?: string;
        subtitle?: string;
        tags?: string[];
        demo_url?: string;
        github_url?: string;
        featured?: boolean;
        order_index?: number;
      };

      const fullPayload: ProjectFormPayload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        role: formData.role.trim(),
        year: formData.year.trim(),
        period: formData.year.trim(),
        short_summary: formData.short_summary.trim(),
        full_description: formData.full_description.trim(),
        thumbnail_url: formData.thumbnail_url.trim(),
        gallery_urls: formData.gallery_urls,
        tech_stacks: formData.tech_stacks,
        live_url: formData.live_url.trim(),
        repo_url: formData.repo_url.trim(),
        is_featured: formData.is_featured,
        display_order: Number(formData.display_order),

        // Dual-field compatibility with existing database columns
        summary: formData.short_summary.trim(),
        description: formData.full_description.trim() || formData.short_summary.trim(),
        subtitle: formData.role.trim(),
        category: formData.category,
        tags: formData.tech_stacks,
        demo_url: formData.live_url.trim(),
        github_url: formData.repo_url.trim(),
        featured: formData.is_featured,
        order_index: Number(formData.display_order),
      };


      const executeSave = async (payloadToUse: ProjectFormPayload) => {
        if (isNew) {
          const { error } = await supabase.from("projects").insert(payloadToUse);
          if (error) throw error;
          toast.success("Project baru berhasil ditambahkan!");
        } else {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId);
          const updateQuery = supabase.from("projects").update(payloadToUse);
          const { data, error } = await (isUuid
            ? updateQuery.or(`id.eq.${projectId},slug.eq.${projectId}`).select()
            : updateQuery.eq("slug", projectId).select()
          );

          if (error) throw error;
          if (!data || data.length === 0) {
            const { error: insertErr } = await supabase.from("projects").insert(payloadToUse);
            if (insertErr) throw insertErr;
          }
          toast.success("Project berhasil diperbarui!");
        }
      };

      try {
        await executeSave(fullPayload);
      } catch (saveErr: unknown) {
        const errorMsg = getErrorMessage(saveErr).toLowerCase();
        if (
          errorMsg.includes("column") ||
          errorMsg.includes("schema cache")
        ) {
          console.warn("[Projects] Kolom baru belum ada di Supabase, menyimpan dengan payload kompatibilitas...");
          const legacyPayload: ProjectFormPayload = {
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            role: formData.role.trim(),
            short_summary: formData.short_summary.trim(),
            full_description: formData.full_description.trim(),
            thumbnail_url: formData.thumbnail_url.trim(),
            gallery_urls: [],
            tech_stacks: formData.tech_stacks,
            live_url: formData.live_url.trim(),
            repo_url: formData.repo_url.trim(),
            is_featured: formData.is_featured,
            display_order: Number(formData.display_order),
            summary: formData.short_summary.trim(),
            description: formData.full_description.trim() || formData.short_summary.trim(),
            subtitle: formData.role.trim(),
            category: formData.category,
            tags: formData.tech_stacks,
            demo_url: formData.live_url.trim(),
            github_url: formData.repo_url.trim(),
            featured: formData.is_featured,
            order_index: Number(formData.display_order),
          };
          await executeSave(legacyPayload);
          toast.warning("Tersimpan dengan mode kompatibilitas skema database.");
        } else {
          throw saveErr;
        }
      }

      // Revalidate public landing page and project page
      await triggerRevalidation("/");

      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan data project"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        <span className="text-xs font-mono">Mengambil data project...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Project</span>
        </Link>
        <div className="flex items-center gap-2">
          {!isNew && formData.slug && (
            <Link
              href={`/projects/${formData.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-mono text-blue-400 hover:underline"
            >
              <span>Lihat Halaman Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <span className="text-xs font-mono text-zinc-500">
            {isNew ? "Mode: Tambah Project Baru" : `Editing: ${formData.slug}`}
          </span>
        </div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-8 shadow-sm"
      >
        {/* SECTION 1: Identitas Utama */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Informasi Pokok Proyek</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Judul Proyek <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Smart Material Management System (SMMS)"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                URL Slug <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormField("slug", generateSlug(e.target.value))}
                placeholder="smart-material-management-system"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
              />
              <p className="text-[11px] text-zinc-500 font-mono">
                Akan diakses melalui /projects/{formData.slug || "slug-anda"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Peran / Role <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormField("role", e.target.value)}
                placeholder="Contoh: Lead Full-Stack Developer"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Kategori Proyek (Untuk Tab Filter Showcase) <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: "fullstack", label: "Full-Stack Web" },
                  { value: "machine-learning", label: "Machine Learning / AI" },
                  { value: "laravel", label: "Laravel Systems" },
                  { value: "all", label: "General / Other" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormField("category", cat.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all text-center border cursor-pointer ${
                      formData.category === cat.value
                        ? "bg-blue-600 text-white border-blue-500 shadow-xs font-semibold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Tahun / Periode Pengerjaan (Opsional)
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">Preset:</span>
                  {["2026", "2025", "2024", "2025 – 2026", "2026 – Present"].map((yPreset) => (
                    <button
                      key={yPreset}
                      type="button"
                      onClick={() => setFormField("year", yPreset)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                        formData.year === yPreset
                          ? "bg-zinc-700 text-white border-zinc-600 font-semibold"
                          : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      {yPreset}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormField("year", e.target.value)}
                placeholder="Pilih preset di atas atau ketik manual: 2026, Jan – Mar 2025"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Ringkasan Singkat (Short Summary) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Ringkasan Singkat (Short Summary) <span className="text-red-400">*</span>
            </label>
            <span
              className={`text-xs font-mono ${
                formData.short_summary.length > 200
                  ? "text-red-400 font-bold"
                  : formData.short_summary.length >= 150
                  ? "text-emerald-400 font-medium"
                  : "text-zinc-500"
              }`}
            >
              {formData.short_summary.length} / 200 karakter (Rekomendasi: 150–200)
            </span>
          </div>
          <textarea
            rows={3}
            value={formData.short_summary}
            onChange={(e) => setFormField("short_summary", e.target.value)}
            placeholder="Tulis ringkasan 1-2 kalimat padat yang menjelaskan nilai inti dan arsitektur proyek untuk kartu showcase..."
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed font-sans"
          />
          <p className="text-[11px] text-zinc-500 font-mono">
            Ditampilkan di Landing Page Card Grid & Modal Quick Preview.
          </p>
        </div>

        {/* SECTION 3: Deskripsi Lengkap (Markdown Editor & Live Preview) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div>
              <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Deskripsi Lengkap Proyek (Markdown / Rich-Text)
              </label>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Mendukung sintaks Markdown: ## Heading, **Bold**, - List, dan ```code
              </p>
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setMarkdownTab("edit")}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                  markdownTab === "edit"
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setMarkdownTab("preview")}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                  markdownTab === "preview"
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>
          </div>

          {markdownTab === "edit" ? (
            <div className="space-y-2">
              <textarea
                rows={12}
                value={formData.full_description}
                onChange={(e) => setFormField("full_description", e.target.value)}
                placeholder="## Ringkasan Proyek&#10;Jelaskan gambaran umum proyek...&#10;&#10;## Masalah & Solusi&#10;- Permasalahan yang dihadapi...&#10;- Solusi rekayasa perangkat lunak...&#10;&#10;## Fitur Utama & Arsitektur&#10;Detail modul teknis..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 leading-relaxed"
              />
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-zinc-500">
                <span>Tips Cepat:</span>
                <code className="text-zinc-400">## Judul Bagian</code>
                <code className="text-zinc-400">**Teks Tebal**</code>
                <code className="text-zinc-400">- Butir Daftar</code>
                <code className="text-zinc-400">```typescript ... ```</code>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 min-h-[250px]">
              {formData.full_description ? (
                <MarkdownView content={formData.full_description} />
              ) : (
                <p className="text-xs font-mono text-zinc-500 italic">
                  Belum ada konten deskripsi untuk dipratinjau.
                </p>
              )}
            </div>
          )}
        </div>

        {/* SECTION 4: Thumbnail & Multi-Image Gallery */}
        <div className="space-y-6 pt-4 border-t border-zinc-800">
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Media Gambar (Thumbnail & Galeri)</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Upload gambar atau tempelkan tautan URL gambar resolusi tinggi
            </p>
          </div>

          {/* Thumbnail Utama */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Gambar Thumbnail Utama <span className="text-red-400">*</span>
            </label>
            <ImageUploader
              value={formData.thumbnail_url}
              onChange={(url) => setFormField("thumbnail_url", url)}
              folder="projects"
            />
          </div>

          {/* Galeri Gambar Pendukung (Multiple Images) */}
          <div className="space-y-3 pt-3">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Galeri Gambar Pendukung (Multiple Gallery Images)
            </label>
            <MultiImageUploader
              values={formData.gallery_urls}
              onChange={(urls) => setFormField("gallery_urls", urls)}
              bucket="portfolio-assets"
              folder="projects"
              maxFiles={12}
              label="Upload Foto Galeri Proyek"
              helperText="Pilih atau seret satu/beberapa file foto screenshot proyek (Maks. 5MB per file)"
            />
          </div>
        </div>

        {/* SECTION 5: Tech Stacks (Multi-select / Tag Input) */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div>
            <label className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Teknologi & Tools (Tech Stacks) <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Klik pill di bawah untuk menambah cepat, atau ketik nama tools manual
            </p>
          </div>

          {/* Quick-add Pills */}
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TECH_STACKS.map((tech) => {
              const selected = formData.tech_stacks.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() =>
                    selected ? handleRemoveTech(tech) : handleAddTech(tech)
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                    selected
                      ? "bg-blue-600 text-white border-blue-500 font-semibold"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <span className="shrink-0 flex items-center justify-center">
                    {getTechLogo(tech, "w-3 h-3")}
                  </span>
                  <span>{selected ? "✓ " : "+ "}{tech}</span>
                </button>
              );
            })}
          </div>

          {/* Manual Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTech(techInput);
                }
              }}
              placeholder="Ketik teknologi kustom lalu tekan Enter..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
            <Button
              type="button"
              onClick={() => handleAddTech(techInput)}
              size="sm"
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono h-9 gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </Button>
          </div>

          {/* Selected Tags Display */}
          <div className="flex flex-wrap gap-2 pt-1">
            {formData.tech_stacks.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200"
              >
                <span className="shrink-0 flex items-center justify-center">
                  {getTechLogo(t, "w-3.5 h-3.5")}
                </span>
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(t)}
                  className="hover:text-red-400 text-zinc-400 transition-colors ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 6: Tautan Eksternal & Urutan Tampilan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Live Demo URL
            </label>
            <input
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormField("live_url", e.target.value)}
              placeholder="https://myproject.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Repository URL (GitHub)
            </label>
            <input
              type="url"
              value={formData.repo_url}
              onChange={(e) => setFormField("repo_url", e.target.value)}
              placeholder="https://github.com/raakaprx/my-repo"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Urutan Tampilan (Display Order)
            </label>
            <input
              type="number"
              min={1}
              value={formData.display_order}
              onChange={(e) => setFormField("display_order", Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          {/* Toggle Featured */}
          <div className="flex items-center gap-3 pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormField("is_featured", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-mono font-medium text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Jadikan Proyek Unggulan (Featured)</span>
              </span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Link
            href="/admin/projects"
            className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Batal
          </Link>

          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-mono font-semibold h-10 px-6 gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNew ? "Buat Proyek" : "Simpan Perubahan"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
