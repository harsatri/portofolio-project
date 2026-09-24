"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, render clean standalone layout
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <Toaster position="top-right" richColors />
        {children}
      </div>
    );
  }

  // Get dynamic title based on path
  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview & Analytics";
    if (pathname.startsWith("/admin/profile")) return "Profile & Hero Configuration";
    if (pathname.startsWith("/admin/projects")) return "Project Management";
    if (pathname.startsWith("/admin/experiences")) return "Experience Management";
    if (pathname.startsWith("/admin/certificates")) return "Certificate Credentials";
    if (pathname.startsWith("/admin/tech-stack")) return "Tech Stack Management";
    if (pathname.startsWith("/admin/analytics")) return "Visitor Activity & Logs";
    return "CMS Dashboard";
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          onOpenMobileSidebar={() => setMobileOpen(true)}
          title={getPageTitle()}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
