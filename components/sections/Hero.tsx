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
import { DEFAULT_PROFILE, parseAvatarUrl, type ProfileData } from "@/lib/portfolio-defaults";
import { naturalTransition } from "@/lib/motion";

export const CV_URL = "/cv.pdf";

interface HeroProps {
  initialProfile?: ProfileData;
}

export default function Hero({ initialProfile }: HeroProps) {
  const profile = initialProfile || DEFAULT_PROFILE;
  const avatarConfig = parseAvatarUrl(profile.avatar_url);
  const avatarSrc = avatarConfig.cleanUrl || "/profile.jpg";
  const avatarPosition = profile.avatar_position || avatarConfig.position || "55% 20%";
  const avatarScale = (profile.avatar_scale ?? avatarConfig.scale ?? 100) / 100;
  const avatarOffsetY = profile.avatar_offset_y ?? avatarConfig.offsetY ?? 0;
  const avatarOffsetX = profile.avatar_offset_x ?? avatarConfig.offsetX ?? 0;
  const avatarOpacity = (profile.avatar_opacity ?? avatarConfig.opacity ?? 45) / 100;

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
      className="relative min-h-[92vh] flex flex-col justify-between pt-20 sm:pt-24 pb-4 overflow-hidden transition-colors duration-300 bg-background text-foreground"
    >
      {/* ========================================================================= */}
      {/* FULL-BLEED PORTRAIT BACKDROP (Terang, Jelas, & Kontras High-End) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div
          className="relative w-full h-full transition-transform duration-300"
          style={{
            transform: `scale(${avatarScale}) translate(${avatarOffsetX}px, ${avatarOffsetY}px)`,
            transformOrigin: avatarPosition,
          }}
        >
          <Image
            src={avatarSrc}
            alt={profile.name || "Harsa"}
            fill
            priority
            className="object-cover filter contrast-105 brightness-100 transition-all duration-300"
            style={{
              objectPosition: avatarPosition,
              opacity: avatarOpacity,
            }}
            sizes="100vw"
          />
        </div>
        {/* Soft Vignette Gradients agar foto tampak berwibawa tanpa tenggelam */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 flex-1 flex flex-col justify-between">
        
        {/* ========================================================================= */}
        {/* EDITORIAL CONTENT STAGE: OVERVIEW (KIRI) & RAKA PRADANA / DISCIPLINES (KANAN) */}
        {/* ========================================================================= */}
        <div className="my-auto py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Left Column: OVERVIEW & PHILOSOPHY (Desktop: Kiri / Mobile: Urutan Kedua) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={naturalTransition}
            className="lg:col-span-6 space-y-4 sm:space-y-5 text-left order-2 lg:order-1"
          >
            {/* Editorial Clean Label */}
            <span className="font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">
              OVERVIEW & PHILOSOPHY
            </span>

            {/* Architecture / Tagline Bio */}
            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans max-w-lg">
              {profile.tagline}
            </p>

            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/90 shadow-2xs">
              {profile.is_available && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              )}
              <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
                {profile.status_badge || "Available for Engineering Projects"}
              </span>
            </div>
          </motion.div>

          {/* Right Column: Headline & CORE DISCIPLINES & STACK (Desktop: Kanan / Mobile: Tampil Pertama) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...naturalTransition, delay: 0.05 }}
            className="lg:col-span-6 space-y-4 sm:space-y-5 text-left lg:text-right order-1 lg:order-2"
          >
            {/* Headline Name (Scale Down to Proportional & Elegant) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-[0.88] select-none">
              <span className="block text-zinc-950 dark:text-white">{firstName}</span>
              {lastName ? (
                <span className="block text-zinc-400 dark:text-zinc-500">{lastName}</span>
              ) : null}
            </h1>

            {/* Core Disciplines & Stack */}
            <div className="space-y-2 pt-3 border-t border-zinc-300/60 dark:border-zinc-800/60">
              <span className="font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block lg:text-right">
                CORE DISCIPLINES & STACK
              </span>

              {/* Role Title */}
              <p className="text-xs sm:text-sm font-mono font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider lg:text-right">
                {profile.role}
              </p>

              {/* Core Stack Highlights Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 lg:justify-end">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 text-left shadow-2xs"
                  >
                    <span className="text-[9px] font-mono font-semibold text-zinc-500 uppercase block">
                      {item.label}
                    </span>
                    <p className="text-xs font-bold font-mono text-zinc-900 dark:text-white leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-sans mt-0.5 line-clamp-1">
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
        <div className="space-y-4 pt-2">
          {/* Action Buttons & Social Dock */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...naturalTransition, delay: 0.1 }}
            className="flex flex-wrap items-center justify-between gap-4 w-full pb-3 border-b border-zinc-200/60 dark:border-zinc-800/50"
          >
            {/* CTA Buttons Dock */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Primary CTA */}
              <Button
                asChild
                size="lg"
                className="flex-1 sm:flex-initial rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-mono text-xs font-bold uppercase px-6 h-10 shadow-md transition-transform active:scale-95 cursor-pointer justify-center"
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
                className="flex-1 sm:flex-initial rounded-full border border-zinc-300 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs font-semibold px-5 h-10 gap-2 shadow-2xs justify-center"
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
                className="w-full sm:w-auto rounded-full border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-medium px-4 h-10 justify-center"
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
                  className="p-2.5 rounded-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-2xs"
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
                  className="p-2.5 rounded-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-2xs"
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
                  className="p-2.5 rounded-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors shadow-2xs"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsappLogo className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-2xs"
                  aria-label="Email Address via Gmail"
                >
                  <GmailLogo className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Running Ticker / Marquee Bar */}
          <div className="w-full overflow-hidden select-none py-1 border-t border-b border-zinc-200/60 dark:border-zinc-800/40 bg-zinc-100/50 dark:bg-zinc-950/50 font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
            <div className="whitespace-nowrap flex items-center justify-between gap-6 px-2">
              <span>PRODUCTION SYSTEMS</span>
              <span className="text-zinc-400 dark:text-zinc-700">•</span>
              <span>QUERY EFFICIENCY</span>
              <span className="text-zinc-400 dark:text-zinc-700">•</span>
              <span>DISTRIBUTED DATA</span>
              <span className="text-zinc-400 dark:text-zinc-700">•</span>
              <span>TELKOM 2026</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
