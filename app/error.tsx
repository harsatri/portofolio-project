"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log exception for debugging/monitoring
    console.error("[GlobalError] Uncaught application exception:", error);
  }, [error]);

  return (
    <main className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden grid-mesh">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[300px] sm:h-[420px] bg-red-500/10 dark:bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Bento Error Card */}
        <div className="rounded-3xl border border-red-500/20 dark:border-red-900/40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 sm:p-12 shadow-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs font-semibold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>RUNTIME_EXCEPTION</span>
          </div>

          {/* Icon Badge */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>

          {/* Heading and Description */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white">
              Terjadi Kendala Teknis
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-md mx-auto">
              Aplikasi mengalami kesalahan tak terduga saat memproses halaman ini. Silakan coba muat ulang atau kembali ke beranda.
            </p>
          </div>

          {/* Diagnostics Panel */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/90 dark:bg-zinc-950/80 p-3.5 text-left font-mono text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              <span>DIAGNOSTIC LOG</span>
              {error.digest && (
                <span className="ml-auto text-zinc-500">ID: {error.digest}</span>
              )}
            </div>
            <p className="text-red-500 dark:text-red-400 font-medium break-all pt-1">
              {error.message || "An unexpected runtime error occurred."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => reset()}
              className="w-full sm:w-auto rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium font-sans h-10 px-5 gap-2 shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-medium font-sans h-10 px-5 gap-2"
            >
              <Link href="/">
                <Home className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>Kembali ke Beranda</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
