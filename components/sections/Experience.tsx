"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Building2,
  Maximize2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTechLogo } from "@/components/icons";

interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  duration: string;
  status: "Active" | "Completed";
  type: "Industry" | "Internship" | "Organization";
  highlights: string;
  deliverables: string[];
  technologies: string[];
  metrics?: { label: string; value: string }[];
  photos?: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    company: "BLUD UPT Lokawisata Baturraden",
    role: "UI/UX Intern",
    duration: "Jan 2025 – Jun 2025",
    status: "Completed",
    type: "Internship",
    highlights:
      "Merancang platform pemesanan (booking) berbasis web yang responsif menggunakan Figma, menerjemahkan kebutuhan stakeholder menjadi user flow, wireframe, antarmuka high-fidelity, dan prototipe interaktif.",
    deliverables: [
      "Merancang platform pemesanan (booking) berbasis web yang responsif menggunakan Figma, menerjemahkan kebutuhan stakeholder menjadi user flow, wireframe, antarmuka high-fidelity, dan prototipe interaktif.",
      "Berkolaborasi dengan stakeholder untuk menentukan alur pemesanan dan struktur halaman, serta melakukan iterasi desain berdasarkan masukan untuk meningkatkan usability dan pengalaman pengguna.",
      "Menyiapkan design handoff untuk developer dan berkontribusi pada implementasi frontend menggunakan JavaScript dan Tailwind CSS, menjembatani desain UI/UX dengan antarmuka yang diimplementasikan.",
    ],
    technologies: [
      "Figma",
      "UI/UX Design",
      "Wireframing",
      "Prototyping",
      "JavaScript",
      "Tailwind CSS",
      "User Flow",
    ],
    metrics: [
      { label: "Lokasi", value: "Baturraden, Indonesia" },
      { label: "Periode", value: "Jan – Jun 2025" },
      { label: "Fokus Proyek", value: "Web Booking Platform" },
    ],
    photos: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    ],
  },
];

function renderTypeBadge(type: string) {
  const normalized = (type || "").toLowerCase();
  if (normalized === "internship") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 shadow-2xs">
        Internship
      </span>
    );
  }
  if (normalized === "industry") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-blue-500/15 text-blue-900 dark:text-blue-300 border border-blue-500/30 shadow-2xs">
        Industry
      </span>
    );
  }
  if (normalized === "organization") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-purple-500/15 text-purple-900 dark:text-purple-300 border border-purple-500/30 shadow-2xs">
        Organization
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs">
      {type}
    </span>
  );
}

export default function Experience({
  initialExperiences,
}: {
  initialExperiences?: ExperienceItem[];
}) {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0]);
  const [activeGallery, setActiveGallery] = useState<{
    title: string;
    photos: string[];
    index: number;
  } | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const experienceList =
    initialExperiences && initialExperiences.length > 0
      ? initialExperiences
      : EXPERIENCES;

  return (
    <TooltipProvider delayDuration={50}>
      <section id="experience" className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <Badge
              variant="outline"
              className="mb-3 px-3.5 py-1 font-sans text-xs font-semibold text-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
            >
              Career & Trajectory
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Professional Experience
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-lg mt-3">
              Hands-on engineering roles in enterprise web applications, real-time logistics systems, and technical mentorship.
            </p>
          </div>

          {/* Experience Timeline Cards */}
          <div className="space-y-8">
            {experienceList.map((exp, index) => {
              const isCurrent = exp.status === "Active";
              const isExpanded = expandedIndices.includes(index);
              const validTechStack = exp.technologies.filter((t) => Boolean(getTechLogo(t)));
              const authenticPhotos =
                exp.photos?.filter(
                  (photo) =>
                    !photo.includes("images.unsplash.com") &&
                    !photo.includes("unsplash.com") &&
                    !photo.includes("via.placeholder.com")
                ) || [];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative group"
                >
                  <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md">
                    {/* Top Status Border Accent */}
                    {isCurrent && (
                      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
                    )}

                    <div className="p-6 sm:p-8">
                      {/* Top Header: Company, Role, Duration, Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                            <span className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
                              {exp.company}
                            </span>
                            {renderTypeBadge(exp.type)}
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Current Role
                              </span>
                            )}
                          </div>
                          <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                            {exp.role}
                          </p>
                        </div>

                        {/* Duration Pill */}
                        <div className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-sans text-zinc-600 dark:text-zinc-400 font-medium shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                          <span>{exp.duration}</span>
                        </div>
                      </div>

                      {/* Highlight Description */}
                      <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                        {exp.highlights}
                      </p>

                      {/* Key Metrics Bento row */}
                      {exp.metrics && exp.metrics.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3.5 sm:p-4 rounded-xl bg-zinc-50/90 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-2xs">
                          {exp.metrics.map((m, i) => (
                            <div key={i}>
                              <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider">{m.label}</p>
                              <p className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-zinc-100 mt-0.5">{m.value}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Authentic Photo Documentation Showcase (Stock photos automatically excluded) */}
                      {authenticPhotos.length > 0 && (
                        <div className="mb-6 space-y-2.5 p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
                          <div className="flex items-center justify-between text-xs font-sans">
                            <span className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-wider">
                              <ImageIcon className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                              Dokumentasi Kegiatan & Sistem ({authenticPhotos.length})
                            </span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                              Klik foto untuk perbesar
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                            {authenticPhotos.map((photoUrl, photoIdx) => (
                              <button
                                key={photoIdx}
                                type="button"
                                onClick={() =>
                                  setActiveGallery({
                                    title: `${exp.role} · ${exp.company}`,
                                    photos: authenticPhotos,
                                    index: photoIdx,
                                  })
                                }
                                className="group relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                title={`Lihat Foto ${photoIdx + 1} - ${exp.company}`}
                              >
                                <Image
                                  src={photoUrl}
                                  alt={`${exp.company} documentation photo ${photoIdx + 1}`}
                                  fill
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                  <span className="p-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tech Stack - Genuine Logos Only */}
                      <div className="flex flex-wrap items-center gap-2 mb-6">
                        {validTechStack.map((tech) => {
                          const logo = getTechLogo(tech, "w-4 h-4");
                          if (!logo) return null;

                          return (
                            <Tooltip key={tech}>
                              <TooltipTrigger asChild>
                                <div
                                  tabIndex={0}
                                  role="button"
                                  aria-label={tech}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-default shadow-2xs"
                                >
                                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                    {logo}
                                  </div>
                                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 font-sans">
                                    {tech}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1 text-xs font-sans text-zinc-950 dark:text-white shadow-md">
                                {tech}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>

                      {/* Drawer Toggle Button */}
                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                        <span className="text-xs font-sans text-zinc-600 dark:text-zinc-400 font-medium">
                          {isExpanded ? "Hide key deliverables" : "View deliverables & technical scope"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(index)}
                          className="text-xs font-sans text-zinc-900 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white gap-1.5 cursor-pointer font-semibold"
                        >
                          {isExpanded ? (
                            <>
                              Collapse
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Expand Deliverables
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Expandable Deliverables Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden pt-4 mt-2"
                          >
                            <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/90 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 space-y-3 shadow-2xs">
                              <p className="text-xs font-sans text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 font-bold">
                                Key Technical Deliverables & Architecture:
                              </p>
                              <ul className="space-y-2.5 text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-normal">
                                {exp.deliverables.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        <Dialog
          open={!!activeGallery}
          onOpenChange={(open) => !open && setActiveGallery(null)}
        >
          <DialogContent className="max-w-4xl p-3 bg-black/95 border-zinc-800 text-white">
            <DialogTitle className="text-sm font-mono text-zinc-300 px-2 pt-1 flex items-center justify-between">
              <span className="truncate max-w-[75%]">{activeGallery?.title}</span>
              {activeGallery && activeGallery.photos.length > 1 && (
                <span className="text-xs text-zinc-400 font-mono">
                  {activeGallery.index + 1} / {activeGallery.photos.length}
                </span>
              )}
            </DialogTitle>

            {activeGallery && activeGallery.photos[activeGallery.index] && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 mt-2">
                <Image
                  src={activeGallery.photos[activeGallery.index]}
                  alt={activeGallery.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1024px"
                  className="object-contain"
                />

                {activeGallery.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveGallery((prev) =>
                          prev
                            ? {
                                ...prev,
                                index:
                                  prev.index === 0
                                    ? prev.photos.length - 1
                                    : prev.index - 1,
                              }
                            : null
                        );
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white transition-colors cursor-pointer"
                      title="Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveGallery((prev) =>
                          prev
                            ? {
                                ...prev,
                                index:
                                  prev.index === prev.photos.length - 1
                                    ? 0
                                    : prev.index + 1,
                              }
                            : null
                        );
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white transition-colors cursor-pointer"
                      title="Selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </TooltipProvider>
  );
}
