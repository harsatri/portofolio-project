"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  Award,
  Layers,
  BarChart3,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RakaLogo } from "@/components/icons";
import { toast } from "sonner";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/tech-stack", label: "Tech Stack", icon: Layers },
  { href: "/admin/analytics", label: "Visitor Analytics", icon: BarChart3 },
];

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Berhasil keluar dari admin");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Gagal keluar");
    }
  };

  const content = (
    <aside className="w-64 h-full flex flex-col bg-zinc-900 border-r border-zinc-800 text-zinc-300 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-800">
        <Link href="/admin" className="flex items-center gap-3">
          <RakaLogo className="w-7 h-7" />
          <div className="flex flex-col">
            <span className="font-mono text-sm font-extrabold text-white tracking-wider">
              RAKA<span className="text-zinc-500">.ADMIN</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">CMS & Analytics</span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 px-3 mb-2 font-semibold">
          Menu Manajemen
        </div>
        {NAV_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-mono transition-colors ${
                isActive
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-zinc-950" : "text-zinc-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </span>
          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0">{content}</div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
}
