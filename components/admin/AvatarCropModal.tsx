"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AvatarCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, previewUrl: string) => void;
  aspect?: number;
  cropShape?: "round" | "rect";
  title?: string;
  description?: string;
}

/**
 * Ekstrak pixel hasil crop menjadi file Blob berkualitas tinggi (WebP)
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputSize = 512,
  cropShape: "round" | "rect" = "round",
  aspect = 1
): Promise<{ blob: Blob; url: string }> {
  let sourceUrl = imageSrc;
  let objectUrlCreated = false;

  // Jika URL remote, upayakan fetch sebagai blob untuk mencegah tainted canvas
  try {
    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
      const res = await fetch(imageSrc, { mode: "cors" });
      if (res.ok) {
        const b = await res.blob();
        sourceUrl = URL.createObjectURL(b);
        objectUrlCreated = true;
      }
    }
  } catch {
    sourceUrl = imageSrc;
  }

  const image = new window.Image();
  image.crossOrigin = "anonymous";
  image.src = sourceUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (err) => reject(err);
  });

  const canvas = document.createElement("canvas");
  let targetWidth = outputSize;
  let targetHeight = outputSize;

  if (cropShape === "rect") {
    targetWidth = Math.min(1920, Math.max(800, Math.round(pixelCrop.width)));
    targetHeight = Math.round(targetWidth / (aspect || (16 / 9)));
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    if (objectUrlCreated) URL.revokeObjectURL(sourceUrl);
    throw new Error("Gagal menginisialisasi canvas context 2D");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  if (objectUrlCreated) {
    URL.revokeObjectURL(sourceUrl);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          canvas.toBlob(
            (jpegBlob) => {
              if (!jpegBlob) {
                reject(new Error("Gagal membuat blob gambar"));
                return;
              }
              const url = URL.createObjectURL(jpegBlob);
              resolve({ blob: jpegBlob, url });
            },
            "image/jpeg",
            0.95
          );
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      },
      "image/webp",
      0.95
    );
  });
}

export function AvatarCropModal({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspect = 1,
  cropShape = "round",
  title,
  description,
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropAreaComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleApply = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      toast.error("Area crop belum siap");
      return;
    }

    setProcessing(true);
    try {
      const { blob, url } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        cropShape === "round" ? 512 : 1280,
        cropShape,
        aspect
      );
      onCropComplete(blob, url);
      onClose();
    } catch (err) {
      console.error("Gagal melakukan crop gambar:", err);
      toast.error("Gagal memproses crop gambar");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const resolvedTitle = title || (cropShape === "round" ? "Sesuaikan Foto Profil" : "Sesuaikan & Crop Gambar");
  const resolvedDesc = description || (cropShape === "round"
    ? "Geser foto agar wajah berada tepat di dalam lingkaran, lalu atur zoom sesuai keinginan."
    : "Geser dan perbesar gambar untuk menyesuaikan area tampilan yang pas.");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-zinc-950 border border-zinc-800 text-white p-6 rounded-2xl shadow-2xl space-y-4">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-mono font-bold text-white flex items-center gap-2">
            <span>{resolvedTitle}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 font-sans">
            {resolvedDesc}
          </DialogDescription>
        </DialogHeader>

        {/* Cropper Container */}
        <div className="relative w-full h-72 sm:h-80 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={cropShape === "rect"}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropAreaComplete}
              minZoom={1}
              maxZoom={3}
              classes={{
                containerClassName: "rounded-xl",
              }}
            />
          )}
        </div>

        {/* Zoom Controls */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
            <span className="flex items-center gap-1 text-zinc-400">
              <ZoomOut className="w-3.5 h-3.5" />
              <span>Zoom</span>
            </span>
            <span className="text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
              {zoom.toFixed(2)}x
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.02}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1"
              title="Reset Posisi & Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-850">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={processing}
            className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs cursor-pointer"
          >
            Batal
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold gap-1.5 cursor-pointer shadow-md"
          >
            {processing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan Foto</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
