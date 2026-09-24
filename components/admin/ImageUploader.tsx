"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Crop, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AvatarCropModal } from "@/components/admin/AvatarCropModal";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  previewShape?: "rounded" | "circle";
  cropAspect?: number;
  imageStyle?: React.CSSProperties;
}

export function ImageUploader({
  value,
  onChange,
  bucket = "portfolio-assets",
  folder = "projects",
  previewShape = "rounded",
  cropAspect,
  imageStyle,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 15MB");
      return;
    }

    // Jika mode avatar lingkaran: buka AvatarCropModal terlebih dahulu
    if (previewShape === "circle") {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCropImageSrc(reader.result);
          setCropModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Alur upload normal untuk gambar proyek / banner
    await uploadDirectFile(file);
  };

  const uploadDirectFile = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      onChange(publicUrl);
      toast.success("Gambar berhasil di-upload!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal upload gambar";
      toast.error("Upload gagal: " + msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCroppedUpload = async (croppedBlob: Blob) => {
    setUploading(true);
    try {
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, croppedBlob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      onChange(publicUrl);
      toast.success("Foto berhasil disesuaikan & disimpan!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan foto hasil crop";
      toast.error("Upload gagal: " + msg);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenCurrentCrop = () => {
    if (!value) return;
    const cleanUrl = value.split(/[?#]/)[0];
    setCropImageSrc(cleanUrl);
    setCropModalOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Crop Modal (Bisa untuk Avatar Lingkaran maupun Gambar Persegi) */}
      <AvatarCropModal
        imageSrc={cropImageSrc}
        isOpen={cropModalOpen}
        cropShape={previewShape === "circle" ? "round" : "rect"}
        aspect={cropAspect || (previewShape === "circle" ? 1 : 16 / 9)}
        title={previewShape === "circle" ? "Sesuaikan & Posisikan Wajah" : "Sesuaikan & Crop Gambar"}
        description={
          previewShape === "circle"
            ? "Geser foto agar wajah berada tepat di dalam lingkaran, lalu atur zoom sesuai keinginan."
            : "Geser dan perbesar area gambar yang ingin ditampilkan."
        }
        onClose={() => {
          setCropModalOpen(false);
          setCropImageSrc("");
        }}
        onCropComplete={handleCroppedUpload}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {value ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/80">
          {/* Thumbnail Preview with Delete button */}
          <div
            className={`relative group overflow-hidden border border-zinc-700 bg-zinc-900 shrink-0 shadow-md ${
              previewShape === "circle"
                ? "rounded-full w-28 h-28 sm:w-32 sm:h-32"
                : "rounded-xl max-w-sm h-36 w-full sm:w-56"
            }`}
          >
            <Image
              src={value.split(/[?#]/)[0]}
              alt="Uploaded Preview"
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              style={imageStyle}
              sizes="256px"
            />
            <button
              type="button"
              onClick={() => {
                onChange("");
                toast.info("Foto dihapus");
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white transition-colors z-10 cursor-pointer shadow-md"
              title="Hapus foto ini"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons (Separated Distinct Actions: Upload, Crop, Delete) */}
          <div className="space-y-2.5 flex-1 w-full text-left">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                ✓ Foto Aktif
              </span>
              <span className="text-[11px] text-zinc-400 font-sans">
                Pilih aksi di bawah untuk foto ini:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {/* Tombol 1: Posisikan / Crop Ulang Gambar Saat Ini */}
              <button
                type="button"
                onClick={handleOpenCurrentCrop}
                disabled={uploading}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                title="Buka crop modal untuk menggeser posisi atau zoom foto yang sudah terpasang"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Posisikan & Crop Foto</span>
              </button>

              {/* Tombol 2: Upload / Ganti File Baru Dari Komputer */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                title="Pilih file baru dari komputer untuk mengganti foto ini"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Upload File Baru</span>
                  </>
                )}
              </button>

              {/* Tombol 3: Hapus Foto */}
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  toast.info("Foto telah dihapus");
                }}
                disabled={uploading}
                className="px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-red-950/50 hover:bg-red-900/70 text-red-300 border border-red-800/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Hapus foto saat ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Foto</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans">
              Klik <strong>Posisikan & Crop Foto</strong> untuk menggeser posisi wajah/objek langsung tanpa perlu pilih file lagi dari komputer.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/40 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-zinc-400">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="text-xs font-mono">Memproses foto...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-400">
                <div className="p-3 rounded-full bg-zinc-800 text-zinc-200">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-zinc-200">
                    Klik untuk upload & sesuaikan foto profil
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Format bebas (JPG, PNG, WebP). Anda bisa geser wajah & zoom seperti di WhatsApp/LinkedIn.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual URL Input Option */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Atau tempelkan URL gambar (https://...)"
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
        />
        <button
          type="button"
          onClick={() => {
            if (urlInput.trim()) {
              onChange(urlInput.trim());
              toast.success("URL gambar berhasil diterapkan!");
              setUrlInput("");
            }
          }}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono font-medium text-zinc-200 cursor-pointer transition-colors"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
}
