"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

export function ProjectShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if (navigator.clipboard && url) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success(`Tautan "${title}" berhasil disalin!`);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Gagal menyalin tautan");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 text-xs font-mono font-semibold transition-colors cursor-pointer shadow-2xs"
      title="Bagikan Tautan Proyek Ini"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500" />
          <span>Tersalin!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-zinc-500" />
          <span>Bagikan Proyek</span>
        </>
      )}
    </button>
  );
}
