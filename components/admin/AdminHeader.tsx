"use client";

import { useState } from "react";
import { Menu, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { triggerRevalidation } from "@/lib/revalidate";
import { toast } from "sonner";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  title?: string;
}

export function AdminHeader({
  onOpenMobileSidebar,
  title = "CMS Dashboard",
}: AdminHeaderProps) {
  const [isRevalidating, setIsRevalidating] = useState(false);

  const handleRevalidate = async () => {
    setIsRevalidating(true);
    try {
      const ok = await triggerRevalidation("/");
      if (ok) {
        toast.success("Cache berhasil diperbarui!", {
          description: "Halaman landing page langsung menampilkan data terbaru.",
        });
      } else {
        toast.error("Gagal melakukan revalidasi cache.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat revalidasi.");
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-zinc-100 shrink-0">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold font-mono tracking-tight text-white">
          {title}
        </h1>
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-[11px] font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Supabase Active</span>
        </div>

        {/* Revalidate Cache Button */}
        <Button
          onClick={handleRevalidate}
          disabled={isRevalidating}
          size="sm"
          variant="outline"
          className="rounded-xl border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-mono h-8 px-2.5 sm:px-3 gap-1.5"
          title="Segarkan cache publik agar update langsung terlihat di landing page"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRevalidating ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Revalidate</span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
