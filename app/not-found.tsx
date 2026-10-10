import Link from "next/link";
import { ArrowLeft, FolderGit2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden grid-mesh">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[300px] sm:h-[420px] bg-blue-500/10 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Bento Error Card */}
        <div className="rounded-3xl border border-border  bg-card backdrop-blur-xl p-8 sm:p-12 shadow-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>404 // NOT_FOUND</span>
          </div>

          {/* Large Stylized 404 Accent */}
          <div className="relative select-none pointer-events-none py-2">
            <div className="text-7xl sm:text-8xl font-black tracking-tighter font-mono text-muted-foreground/40 ">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
              </div>
            </div>
          </div>

          {/* Heading and Description */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-foreground">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed max-w-md mx-auto">
              Halaman atau proyek yang Anda cari mungkin telah dipindahkan, dihapus, atau tautan yang Anda tuju salah.
            </p>
          </div>

          {/* Terminal Diagnostics Preview */}
          <div className="rounded-xl border border-border bg-secondary p-3 text-left font-mono text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-red-400/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-yellow-400/80 inline-block" />
              <span className="w-2 h-2 rounded-full bg-green-400/80 inline-block" />
              <span className="ml-1 text-[10px] text-muted-foreground">status: unresolved_route</span>
            </div>
            <p className="text-muted-foreground pt-1">
              <span className="text-blue-500 dark:text-blue-400">STATUS</span>: 404 <span className="text-amber-500">→ Resource Missing</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="w-full sm:w-auto rounded-xl bg-secondary  text-white  hover:bg-secondary  font-medium font-sans h-10 px-5 gap-2 shadow-md"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-border bg-card hover:bg-secondary  text-zinc-800 font-medium font-sans h-10 px-5 gap-2"
            >
              <Link href="/#projects">
                <FolderGit2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span>View Projects</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
