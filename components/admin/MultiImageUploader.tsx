"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Plus, ImageIcon, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  maxFiles?: number;
  label?: string;
  helperText?: string;
}

export function MultiImageUploader({
  values = [],
  onChange,
  bucket = "portfolio-assets",
  folder = "projects",
  maxFiles = 12,
  label = "Upload Foto Galeri / Dokumentasi",
  helperText = "Pilih satu atau beberapa file foto (PNG, JPG, WebP, maks. 5MB per file)",
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    if (values.length + files.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} foto diperbolehkan.`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" melebihi batas 5MB.`);
        failCount++;
        continue;
      }

      try {
        const fileExt = file.name.split(".").pop() || "jpg";
        const cleanFileName = file.name
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .slice(0, 20);

        const fileName = `${folder}/${Date.now()}-${cleanFileName}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(data.path);

        newUrls.push(publicUrl);
        successCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal upload";
        toast.error(`Gagal upload "${file.name}": ${msg}`);
        failCount++;
      }
    }

    if (newUrls.length > 0) {
      onChange([...values, ...newUrls]);
      toast.success(`${successCount} foto berhasil diunggah ke Supabase Storage!`);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = values.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    toast.info("Foto dihapus dari galeri");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Dropzone / Button */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
            : "border-zinc-700/80 hover:border-zinc-500 bg-zinc-950/60 hover:bg-zinc-900/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-zinc-400 py-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-xs font-mono">Mengunggah foto ke Supabase Storage...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400 text-center">
            <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200 font-mono">
                {label}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {helperText}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium mt-1 border border-zinc-700 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span>Pilih File Dari Komputer</span>
            </span>
          </div>
        )}
      </div>

      {/* Uploaded Photos Grid Preview */}
      {values.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {values.length} foto terpasang (Maks. {maxFiles})
              </span>
            </span>
            <span className="text-[11px] text-zinc-500">
              Arahkan kursor & klik ikon tempat sampah untuk menghapus
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {values.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-sm"
              >
                <Image
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Index badge */}
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90">
                  {idx + 1}
                </span>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                  title="Hapus foto ini"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
