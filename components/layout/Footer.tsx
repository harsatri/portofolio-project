"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Github, Linkedin, GmailLogo, WhatsappLogo } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/portfolio-defaults";

export default function Footer({
  initialProfile,
}: {
  initialProfile?: ProfileData;
}) {
  const currentYear = new Date().getFullYear();
  const profile = initialProfile || DEFAULT_PROFILE;

  const githubHref = profile.github_url || DEFAULT_PROFILE.github_url;
  const linkedinHref = profile.linkedin_url || DEFAULT_PROFILE.linkedin_url;
  const whatsappHref = profile.whatsapp_url || DEFAULT_PROFILE.whatsapp_url;
  const emailAddress = profile.email || DEFAULT_PROFILE.email || "rakapradana.work@gmail.com";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 bg-background border-t border-border relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-sans text-muted-foreground">
        {/* Left: Branding & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Logo className="w-auto h-5" alt="Logo Harsa Tri Novenda" />
          </div>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            All systems operational
          </span>
        </div>

        {/* Middle: Socials with genuine brand logos */}
        <div className="flex items-center gap-3">
          <a
            href={githubHref}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground  hover:border-ring  transition-colors shadow-2xs"
            aria-label="GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground  hover:border-ring  transition-colors shadow-2xs"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground  hover:border-ring  transition-colors shadow-2xs"
            aria-label="WhatsApp"
          >
            <WhatsappLogo className="w-3.5 h-3.5" />
          </a>
          <a
            href={`mailto:${emailAddress}`}
            className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground  hover:border-ring  transition-colors shadow-2xs"
            aria-label="Gmail Dispatch"
          >
            <GmailLogo className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right: Copyright & Discreet Admin Link & Back to Top */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="text-muted-foreground">
            &copy; {currentYear}
          </span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-muted-foreground text-[11px] font-mono transition-colors"
            title="Masuk ke CMS Dashboard Admin"
            id="footer-admin-link"
          >
            ꗞ
          </Link>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 p-2 rounded-lg bg-secondary border border-border text-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs ml-auto sm:ml-0"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>

  );
}
