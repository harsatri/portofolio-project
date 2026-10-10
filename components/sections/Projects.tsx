"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Search,
  ArrowRight,
  Layers,
  Sparkles,
  Eye,
  Cpu,
  CreditCard,
  Code2,
} from "lucide-react";
import { Github, getTechLogo } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackEvent } from "@/lib/analytics";
import type { ProjectItem } from "@/lib/portfolio-defaults";
import { SectionTitle } from "@/components/ui/section-title";


export default function Projects({
  initialProjects = [],
}: {
  initialProjects?: ProjectItem[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewProject, setPreviewProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchTab =
        activeTab === "all" ||
        (activeTab === "machine-learning" &&
          (p.category === "machine-learning" ||
            p.tech_stacks.some((t) =>
              ["python", "machine learning", "tensorflow", "pytorch", "scikit-learn", "ai", "pandas", "numpy"].some((ml) =>
                t.toLowerCase().includes(ml)
              )
            ))) ||
        (activeTab === "laravel" &&
          (p.category === "laravel" ||
            p.tech_stacks.some((t) => t.toLowerCase().includes("laravel")))) ||
        (activeTab === "fullstack" &&
          (p.category === "fullstack" ||
            p.category === "all" ||
            p.tech_stacks.some((t) =>
              ["next.js", "react", "fullstack", "full-stack"].some((fs) =>
                t.toLowerCase().includes(fs)
              )
            )));

      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tech_stacks.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchTab && matchSearch;
    });
  }, [initialProjects, activeTab, searchQuery]);

  return (
    <section id="projects" className="py-24 bg-background relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <Badge
            variant="outline"
            className="mb-3 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#8C5747] dark:text-[#E7C3B5] border-[#8C5747]/20 dark:border-[#E7C3B5]/30 bg-card shadow-2xs"
          >
            Portfolio Showcase
          </Badge>
          <SectionTitle>
            Featured Systems & Applications
          </SectionTitle>
          <p className="text-muted-foreground text-sm max-w-xl mt-3 font-normal">
            A collection of enterprise web systems, backend modules, and machine learning projects. Click on a card for a quick preview or to explore the full architecture.
          </p>
        </div>

        {/* Filter Controls: Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-secondary border border-border p-1 rounded-xl flex overflow-x-auto max-w-full scrollbar-none w-full sm:w-auto justify-start sm:justify-center shadow-xs">
              <TabsTrigger
                value="all"
                className="whitespace-nowrap shrink-0 text-xs font-semibold font-mono text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
              >
                All Projects
              </TabsTrigger>
              <TabsTrigger
                value="fullstack"
                className="whitespace-nowrap shrink-0 text-xs font-semibold font-mono text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
              >
                Full-Stack
              </TabsTrigger>
              <TabsTrigger
                value="laravel"
                className="whitespace-nowrap shrink-0 text-xs font-semibold font-mono text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
              >
                Laravel & Backend
              </TabsTrigger>
              <TabsTrigger
                value="machine-learning"
                className="whitespace-nowrap shrink-0 text-xs font-semibold font-mono text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
              >
                Machine Learning
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search technologies, titles, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-colors shadow-2xs font-sans"
            />
          </div>
        </div>

        {/* Minimalist Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug || project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => {
                  setPreviewProject(project);
                  trackEvent("project_click", `${project.title} (Card Click Preview)`);
                }}
                className="group cursor-pointer rounded-2xl border border-border bg-card hover:border-border  p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 mb-4 border border-border">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card backdrop-blur-md text-[11px] font-sans font-medium text-foreground shadow-md">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        Quick Preview
                      </span>
                    </div>

                    {project.is_featured && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary backdrop-blur-md text-[10px] font-sans font-semibold text-foreground shadow-xs border border-border">
                          <Sparkles className="w-3 h-3 text-amber-400 dark:text-amber-500" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Role / Category Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">
                      {project.role}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight mb-2 group-hover:text-muted-foreground dark:group-hover:text-muted-foreground transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Short Summary (1-2 sentences) */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 font-normal">
                    {project.short_summary}
                  </p>
                </div>

                {/* Footer: Tech Badges & Dual Actions (Preview vs Direct Detail) */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {project.tech_stacks.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary  border border-border  text-[10px] font-sans text-muted-foreground truncate max-w-[100px]"
                        title={tech}
                      >
                        <span className="shrink-0 flex items-center justify-center">
                          {getTechLogo(tech, "w-3 h-3")}
                        </span>
                        <span className="truncate">{tech}</span>
                      </span>
                    ))}
                    {project.tech_stacks.length > 2 && (
                      <span className="text-[10px] font-sans text-muted-foreground shrink-0">
                        +{project.tech_stacks.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Dual Action Controls: Quick Preview or Direct Link */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewProject(project);
                        trackEvent("project_click", `${project.title} (Quick Preview Button)`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-secondary hover:bg-secondary  text-[11px] font-sans font-medium text-muted-foreground transition-colors cursor-pointer"
                      title="Open Quick Preview"
                    >
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      <span>Preview</span>
                    </button>
                    <Link
                      href={`/projects/${project.slug || project.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        trackEvent("project_click", `${project.title} (Direct Link Button)`);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-sans font-semibold transition-colors shadow-2xs"
                      title="Open Full Details"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-sm font-sans text-muted-foreground">
              No projects found matching the keyword &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {/* Quick Preview Modal */}
        <Dialog open={Boolean(previewProject)} onOpenChange={(open) => !open && setPreviewProject(null)}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border border-border sm:rounded-2xl">
            {previewProject && (
              <div className="flex flex-col">
                {/* Modal Banner Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 border-b border-border">
                  <Image
                    src={previewProject.thumbnail_url}
                    alt={previewProject.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/70 backdrop-blur-md text-white border-border font-sans text-xs">
                      {previewProject.role}
                    </Badge>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                  <DialogHeader className="text-left space-y-1.5 p-0">
                    <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                      {previewProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                      {previewProject.short_summary}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Key Tech Stacks */}
                  <div>
                    <h4 className="text-xs font-sans font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                      Technologies & Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {previewProject.tech_stacks.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-sans text-foreground font-medium hover:border-border transition-colors"
                        >
                          <span className="shrink-0 flex items-center justify-center">
                            {getTechLogo(tech, "w-4 h-4")}
                          </span>
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {previewProject.repo_url && (
                        <a
                          href={previewProject.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() =>
                            trackEvent("project_click", `${previewProject.title} (GitHub Repo)`)
                          }
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary border border-border text-xs font-sans text-foreground hover:text-foreground hover:border-border transition-colors w-full sm:w-auto font-medium"
                        >
                          <Github className="w-4 h-4" />
                          <span>Repository</span>
                        </a>
                      )}
                      {previewProject.live_url && (
                        <a
                          href={previewProject.live_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() =>
                            trackEvent("project_click", `${previewProject.title} (Live Demo)`)
                          }
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary border border-border text-xs font-sans text-foreground hover:text-foreground hover:border-border transition-colors w-full sm:w-auto font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>

                    {/* Primary Button: View Full Details */}
                    <Link
                      href={`/projects/${previewProject.slug || previewProject.id}`}
                      onClick={() =>
                        trackEvent("project_click", `${previewProject.title} (Detail Page)`)
                      }
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs font-sans transition-all shadow-sm"
                    >
                      <span>View Full Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
