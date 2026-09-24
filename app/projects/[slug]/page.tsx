import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Code2,
  Share2,
} from "lucide-react";
import { Github, getTechLogo } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Footer from "@/components/layout/Footer";
import { MarkdownView } from "@/components/ui/markdown-view";
import { getProjectBySlug, getProjects } from "@/lib/portfolio-data";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectShareButton } from "./ProjectShareButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      slug: project.slug || project.id,
    }));
  } catch (error) {
    console.error("[generateStaticParams] Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Harsa Tri Novenda",
    };
  }

  return {
    title: `${project.title} | Harsa Tri Novenda`,
    description: project.short_summary,
    openGraph: {
      title: `${project.title} - ${project.role}`,
      description: project.short_summary,
      images: [
        {
          url: project.thumbnail_url,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getProjects();
  const otherProjects = allProjects
    .filter((p) => (p.slug || p.id) !== (project.slug || project.id))
    .slice(0, 3);

  const galleryImages =
    project.gallery_urls && project.gallery_urls.length > 0
      ? project.gallery_urls
      : [project.thumbnail_url];

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top Header: Clean bar with only Back button and ThemeToggle (No standard landing navbar) */}
      <header className="sticky top-0 left-0 right-0 z-50 py-3.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-300 shadow-2xs">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-500">
              Project Showcase
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <article className="pt-8 pb-24 max-w-5xl mx-auto px-6">

        {/* Header Title Section */}
        <header className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge
              variant="outline"
              className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/40 px-3 py-1"
            >
              {project.role}
            </Badge>

            {project.is_featured && (
              <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono text-xs gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Project
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal max-w-3xl">
            {project.short_summary}
          </p>

          {/* Quick Action Links */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-mono font-semibold transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Lihat Live Demo</span>
              </a>
            )}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 text-xs font-mono font-semibold transition-colors w-full sm:w-auto"
              >
                <Github className="w-4 h-4" />
                <span>Source Code (GitHub)</span>
              </a>
            )}

            <ProjectShareButton title={project.title} />
          </div>
        </header>

        {/* Interactive Gallery & Featured Media */}
        <section className="mb-14">
          <ProjectGallery images={galleryImages} title={project.title} />
        </section>

        {/* Two-column Layout: Detailed Content + Sticky Sidebar Meta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Rich Markdown Description */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 p-6 sm:p-8 shadow-xs">
              <MarkdownView content={project.full_description} />
            </div>

            {/* Architecture Metrics (if available) */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 p-6 sm:p-8 space-y-4">
                <h3 className="text-sm font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  Engineering Benchmarks & Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-center"
                    >
                      <span className="text-xs text-zinc-500 font-mono block mb-1">
                        {m.label}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white font-mono">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar Meta (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Tech Stack Box */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 p-6 shadow-xs space-y-4 sticky top-28">
              <h3 className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span>Teknologi & Framework</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.tech_stacks.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100 shadow-2xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                  >
                    <span className="shrink-0 flex items-center justify-center">
                      {getTechLogo(tech, "w-4 h-4")}
                    </span>
                    <span>{tech}</span>
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-xs font-mono">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-zinc-500 shrink-0">Role:</span>
                  <span className="text-zinc-950 dark:text-zinc-100 font-semibold text-right">
                    {project.role}
                  </span>
                </div>
                {(project.year || project.period) && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500 shrink-0">Tahun:</span>
                    <span className="text-zinc-950 dark:text-zinc-100 font-semibold text-right">
                      {project.year || project.period}
                    </span>
                  </div>
                )}
                {project.live_url && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500 shrink-0">Live Demo:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Aktif</span>
                  </div>
                )}
                {project.repo_url && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500 shrink-0">Source Code:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Public Repo</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Other Projects Recommendation Section */}
        {otherProjects.length > 0 && (
          <section className="mt-20 pt-12 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  Proyek Lainnya
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Eksplorasi karya dan sistem rekayasa lainnya
                </p>
              </div>

              <Link
                href="/#projects"
                className="text-xs font-mono text-blue-500 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Lihat Semua</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((p) => (
                <Link
                  key={p.slug || p.id}
                  href={`/projects/${p.slug || p.id}`}
                  className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all hover:shadow-md"
                >
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-950 mb-3 border border-zinc-100 dark:border-zinc-800/60">
                    <Image
                      src={p.thumbnail_url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-blue-500 uppercase font-semibold">
                    {p.role}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mt-1 group-hover:text-blue-500 transition-colors line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                    {p.short_summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
}
