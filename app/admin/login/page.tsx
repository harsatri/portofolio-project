"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RakaLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Mohon masukkan email dan password");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Gagal login: " + error.message, {
          description:
            "Pastikan Anda telah membuat user di dashboard Supabase (Authentication > Users).",
        });
      } else {
        toast.success("Login berhasil! Selamat datang di Dashboard.");
        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg mb-4">
          <RakaLogo className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
          Admin Portal
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Masuk untuk mengelola portfolio dan memantau analitik pengunjung
        </p>
      </div>

      {/* Login Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Email Admin
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                title={showPassword ? "Sembunyikan" : "Tampilkan"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold font-mono text-xs shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Security / Setup Tip */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-start gap-2.5 text-[11px] text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Akun admin diamankan oleh Supabase Authentication. Jika belum ada user, buat di <strong>Supabase &gt; Authentication &gt; Add User</strong>.
          </p>
        </div>
      </div>

      {/* Back to Portfolio */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          &larr; Kembali ke Website Portfolio
        </Link>
      </div>
    </div>
  );
}
