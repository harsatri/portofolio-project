"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RakaLogo } from "@/components/icons";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Tech Stack", href: "#techstack" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map((item) => {
        const id = item.href.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { id, top: rect.top, height: rect.height };
        }
        return null;
      }).filter(Boolean);

      const current = sections.find((sec) => {
        if (!sec) return false;
        return sec.top <= 140 && sec.top + sec.height > 140;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-300 dark:border-zinc-800/80 shadow-md shadow-zinc-200/50 dark:shadow-black/40"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2 group" aria-label="Harsa Dev">
          <RakaLogo className="w-8 h-8 sm:w-9 sm:h-9 group-hover:scale-105 transition-transform" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 rounded-full px-2 py-1 backdrop-blur-md shadow-2xs">
          {NAV_ITEMS.map((item) => {
            const id = item.href.substring(1);
            const isActive = activeSection === id;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 text-xs font-sans font-medium tracking-tight rounded-full transition-colors duration-200 ${
                  isActive
                    ? "text-zinc-950 dark:text-white font-semibold"
                    : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/80 rounded-full -z-10 shadow-xs"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Quick Actions & Theme Toggle (Desktop >= 1024px) */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          <Button
            asChild
            size="sm"
            className="rounded-full bg-zinc-950 text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold px-4.5 h-9 shadow-xs text-xs cursor-pointer hover:-translate-y-0.5 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <a href="#contact">
              Let&apos;s Talk
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </Button>
        </div>

        {/* Mobile & Tablet (< 1024px) Menu & Theme Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-300 dark:border-zinc-800 px-6 py-6 lg:hidden flex flex-col gap-3 backdrop-blur-2xl shadow-xl"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-sans font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white py-2 border-b border-zinc-200 dark:border-zinc-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-750 bg-zinc-100 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 h-11 justify-center gap-2 font-semibold"
              >
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="CV_Harsa_Tri_Novenda.pdf"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Download CV</span>
                </a>
              </Button>

              <Button
                asChild
                className="w-full rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold h-11 justify-center"
              >
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  Let&apos;s Talk
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
