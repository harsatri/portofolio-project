"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3.5">
      {/* Featured Large Viewport */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl cursor-zoom-in"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0.6, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage}
              alt={`${title} - Screenshot ${activeIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={activeIndex === 0}
              className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/90 hover:text-white hover:bg-black/80 transition-colors cursor-pointer"
            title="Perbesar Layar Penuh"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Navigation Arrows (if > 1 image) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              title="Gambar Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              title="Gambar Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-mono text-white flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {activeIndex + 1} / {images.length}
            </span>
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-video w-24 sm:w-28 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                activeIndex === idx
                  ? "border-blue-500 shadow-md scale-105"
                  : "border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-2 bg-black/95 border-zinc-800">
          <DialogTitle className="sr-only">{title} Screenshot</DialogTitle>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden">
            <Image
              src={currentImage}
              alt={title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
