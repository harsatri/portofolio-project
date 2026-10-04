"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileDown,
} from "lucide-react";
import { Github, Linkedin, GmailLogo, WhatsappLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/portfolio-defaults";
import { naturalTransition } from "@/lib/motion";

export const CV_URL = "/cv.pdf";

interface HeroProps {
  initialProfile?: ProfileData;
}

export default function Hero({ initialProfile }: HeroProps) {
  const profile = initialProfile || DEFAULT_PROFILE;
  const cutoutSrc = "/hero-cutout.png";

  const highlights =
    Array.isArray(profile.highlights) && profile.highlights.length > 0
      ? profile.highlights
      : DEFAULT_PROFILE.highlights;

  // Format display name into headline
  const nameParts = (profile.name || "HARSA").trim().split(" ");
  let firstName = "HARSA";
  let lastName = "";

  if (nameParts.length >= 2) {
    firstName = nameParts[0].toUpperCase();
    lastName = nameParts.slice(1).join(" ").toUpperCase();
  } else if (nameParts.length === 1 && nameParts[0]) {
    firstName = nameParts[0].toUpperCase();
    lastName = "";
  }

  return (
    <section
      id="home"
      className="relative min-h-[clamp(720px,95vh,1080px)] flex flex-col justify-between pt-20 sm:pt-24 pb-4 overflow-hidden transition-colors duration-300 bg-background text-foreground"
    >
      {/* ========================================================================= */}
      {/* DESKTOP HERO PORTRAIT CUTOUT (>=860px) */}
      {/* Diletakkan di tengah hero secara horizontal, menempel di dasar area hero */}
      {/* Dasar foto sejajar dengan garis atas bar 'PRODUCTION SYSTEMS...' */}
      {/* Puncak kepala sekitar 24-40px di bawah navbar (top-[96px]) */}
      {/* Tinggi mengikuti area hero (~100%), minimal clamp(560px, 80vh, 960px) */}
      {/* Foto tajam 100% HD tanpa blur, mask fade di 10-12% terbawah */}
      {/* Mode gelap: rim light tipis drop-shadow 0 0 1px rgba(231,195,181,.6) dan glow radial blush */}
      {/* Mode terang: tanpa glow */}
      {/* ========================================================================= */}
      <div
        className="hidden min-[860px]:flex absolute bottom-[42px] left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none items-end justify-center"
        style={{
          top: "96px",
          height: "calc(100% - 96px - 42px)",
          minHeight: "clamp(560px, 80vh, 960px)",
          maxHeight: "960px",
        }}
      >
        {/* Dark mode glow radial blush (#E7C3B5, opasitas ~22%) di belakang foto */}
        <div
          className="hidden dark:block absolute -inset-x-24 top-1/4 bottom-0 pointer-events-none -z-10"
          style={{
            background: "radial-gradient(ellipse at 50% 60%, rgba(231, 195, 181, 0.22) 0%, rgba(231, 195, 181, 0.08) 50%, transparent 75%)",
          }}
        />

        {/* Foto Cutout transparan HD tanpa blur, mask fade di 10-12% terbawah */}
        <div
          className="relative h-full w-auto flex items-end justify-center"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
          }}
        >
          <Image
            src={cutoutSrc}
            alt={profile.name || "Harsa Tri Novenda"}
            width={1520}
            height={1920}
            priority
            quality={90}
            sizes="(max-width: 860px) 320px, (max-width: 1440px) 800px, 960px"
            className="h-full w-auto object-contain object-bottom dark:drop-shadow-[0_0_1px_rgba(231,195,181,0.6)]"
            style={{
              imageRendering: "auto",
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 flex-1 flex flex-col justify-between">
        
        {/* ========================================================================= */}
        {/* MOBILE HERO PORTRAIT CUTOUT (<860px) */}
        {/* Mobile: foto di atas, tengah, lebar maksimal 320px (tajam, tanpa blur) */}
        {/* ========================================================================= */}
        <div className="block min-[860px]:hidden w-full max-w-[320px] mx-auto pt-2 pb-4 relative z-0 flex flex-col items-center">
          {/* Dark mode radial blush glow */}
          <div
            className="hidden dark:block absolute inset-0 pointer-events-none -z-10"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(231, 195, 181, 0.22) 0%, transparent 70%)",
            }}
          />
          <div
            className="relative w-full aspect-[1520/1920] max-h-[400px] flex items-end justify-center"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 88%, transparent 100%)",
            }}
          >
            <Image
              src={cutoutSrc}
              alt={profile.name || "Harsa Tri Novenda"}
              width={1520}
              height={1920}
              priority
              quality={90}
              sizes="320px"
              className="w-full h-auto object-contain object-bottom dark:drop-shadow-[0_0_1px_rgba(231,195,181,0.6)]"
              style={{
                imageRendering: "auto",
              }}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL CONTENT STAGE: OVERVIEW (KIRI) & HARSA / DISCIPLINES (KANAN) */}
        {/* ========================================================================= */}
        <div className="my-auto py-4 min-[860px]:py-10 grid grid-cols-1 min-[860px]:grid-cols-12 gap-8 items-end">
          {/* Left Column: OVERVIEW & PHILOSOPHY (Desktop: Kiri / Mobile: Urutan Kedua) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={naturalTransition}
            className="min-[860px]:col-span-6 space-y-4 sm:space-y-5 text-left order-2 min-[860px]:order-1"
          >
            {/* Editorial Clean Label */}
            <span className="font-mono text-[11px] font-semibold text-[#8C5747] dark:text-[#E7C3B5] uppercase tracking-[0.08em] block hero-text-halo">
              OVERVIEW & PHILOSOPHY
            </span>

            {/* Architecture / Tagline Bio */}
            <p className="text-sm sm:text-base text-foreground leading-relaxed font-sans max-w-lg hero-text-halo">
              {profile.tagline}
            </p>

            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-secondary shadow-2xs">
              {profile.is_available && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              )}
              <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
                {profile.status_badge || "Available for Engineering Projects"}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Headline & CORE DISCIPLINES & STACK (Desktop: Kanan / Mobile: Tampil Pertama) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...naturalTransition, delay: 0.05 }}
            className="min-[860px]:col-span-6 space-y-4 sm:space-y-5 text-left min-[860px]:text-right order-1 min-[860px]:order-2"
          >
            {/* Headline Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-[0.88] select-none">
              <span className="block text-foreground hero-text-halo">{firstName}</span>
              {lastName ? (
                <span className="block text-muted-foreground hero-text-halo">{lastName}</span>
              ) : null}
            </h1>

            {/* Core Disciplines & Stack */}
            <div className="space-y-2 pt-3 border-t border-border">
              <span className="font-mono text-[11px] font-semibold text-[#8C5747] dark:text-[#E7C3B5] uppercase tracking-[0.08em] block min-[860px]:text-right hero-text-halo">
                CORE DISCIPLINES & STACK
              </span>

              {/* Role Title */}
              <p className="text-xs sm:text-sm font-mono font-bold text-foreground uppercase tracking-wider min-[860px]:text-right hero-text-halo">
                {profile.role}
              </p>

              {/* Core Stack Highlights Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 min-[860px]:justify-end">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-border bg-card text-left shadow-2xs"
                  >
                    <span className="text-[9px] font-mono font-semibold text-muted-foreground uppercase block">
                      {item.label}
                    </span>
                    <p className="text-xs font-bold font-mono text-foreground leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-sans mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM DOCK BAR: ACTION BUTTONS, SOCIALS, & RUNNING TICKER */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-2 relative z-20">
          {/* Action Buttons & Social Dock */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...naturalTransition, delay: 0.1 }}
            className="flex flex-wrap items-center justify-between gap-4 w-full pb-3 border-b border-border "
          >
            {/* CTA Buttons Dock */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Primary CTA */}
              <Button
                asChild
                size="lg"
                className="flex-1 sm:flex-initial rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs font-bold uppercase px-6 h-10 shadow-md transition-transform active:scale-95 cursor-pointer justify-center"
              >
                <a href={profile.cta_primary_url || "#projects"}>
                  <span>{profile.cta_primary_text || "Explore Projects"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </Button>

              {/* Download CV CTA */}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-initial rounded-full border border-border dark:border-[#3E2E28] bg-card hover:bg-secondary text-foreground dark:text-[#F6ECE7] font-mono text-xs font-semibold px-5 h-10 gap-2 shadow-2xs justify-center"
              >
                <a
                  href={profile.cta_cv_url || CV_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="CV_Harsa_Tri_Novenda.pdf"
                  data-track-event="cv_download"
                  data-track-target={`CV ${profile.name}`}
                  onClick={() => trackEvent("cv_download", `CV ${profile.name}`)}
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{profile.cta_cv_text || "Download CV"}</span>
                </a>
              </Button>

              {/* Contact CTA */}
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto rounded-full border border-border dark:border-[#3E2E28] bg-secondary hover:bg-secondary text-foreground dark:text-[#F6ECE7] font-mono text-xs font-medium px-4 h-10 justify-center shadow-2xs"
              >
                <a href={profile.cta_contact_url || "#contact"}>
                  {profile.cta_contact_text || "Contact Me"}
                </a>
              </Button>
            </div>

            {/* Social Icons Dock */}
            <div className="flex items-center gap-2">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground  hover:border-ring  transition-colors shadow-2xs"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground  hover:border-ring  transition-colors shadow-2xs"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.whatsapp_url && (
                <a
                  href={profile.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  data-track-event="contact_click"
                  data-track-target="WhatsApp Hero"
                  className="p-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors shadow-2xs"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsappLogo className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground  hover:border-ring  transition-colors shadow-2xs"
                  aria-label="Email Address via Gmail"
                >
                  <GmailLogo className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Running Ticker / Marquee Bar */}
          <div className="w-full overflow-hidden select-none py-1 border-t border-b border-border bg-secondary font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground relative z-20">
            <div className="whitespace-nowrap flex items-center justify-between gap-6 px-2">
              <span>PRODUCTION SYSTEMS</span>
              <span className="text-muted-foreground">•</span>
              <span>QUERY EFFICIENCY</span>
              <span className="text-muted-foreground">•</span>
              <span>DISTRIBUTED DATA</span>
              <span className="text-muted-foreground">•</span>
              <span>TELKOM 2026</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
