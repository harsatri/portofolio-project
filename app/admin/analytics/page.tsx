"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  RefreshCw,
  Search,
  Filter,
  Smartphone,
  Monitor,
  Eye,
  FileDown,
  FolderGit2,
  MessageSquare,
  Loader2,
  Globe,
  Users,
  Send,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/StatsCard";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

interface AnalyticsEventRecord {
  id: string;
  event_type: string;
  page_path?: string;
  target_name?: string;
  device_type?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export default function AdminAnalyticsPage() {
  const [events, setEvents] = useState<AnalyticsEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sendingTest, setSendingTest] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const supabase = createClient();

  const fetchEvents = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);

      if (error) {
        toast.error(getErrorMessage(error, "Gagal memuat analitik"));
        setEvents([]);
      } else {
        setEvents(data || []);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Terjadi kesalahan koneksi saat memuat analitik"));
      setEvents([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optional auto-refresh every 20 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchEvents(true);
    }, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  const extractIp = (row: AnalyticsEventRecord) => {
    if (row.ip_address) return row.ip_address;
    if (row.user_agent) {
      const match = row.user_agent.match(/\[IP:\s*([^\]]+)\]/);
      if (match) return match[1];
    }
    return "127.0.0.1";
  };

  const cleanDevice = (row: AnalyticsEventRecord) => {
    if (row.device_type) return row.device_type;
    return "Desktop";
  };

  const handleTestPing = async () => {
    setSendingTest(true);
    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "page_view",
          pagePath: "/admin/analytics",
          targetName: "Uji Coba Pelacak (Owner Verification)",
        }),
      });

      if (res.ok) {
        toast.success("Event uji coba berhasil dikirim!", {
          description: "Data IP dan perangkat Anda langsung tercatat.",
        });
        setTimeout(() => fetchEvents(false), 500);
      } else {
        toast.error("Gagal mengirim event uji coba");
      }
    } catch {
      toast.error("Gagal terhubung ke endpoint analitik");
    } finally {
      setSendingTest(false);
    }
  };

  const handleClearLogs = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin mengosongkan riwayat log analitik? Data yang sudah dihapus tidak dapat dipulihkan."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("analytics_events")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      toast.success("Seluruh log analitik berhasil dikosongkan");
      setEvents([]);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal membersihkan log"));
    }
  };

  // Aggregated Counts
  const totalViews = events.filter((e) => e.event_type === "page_view").length;
  const totalCv = events.filter((e) => e.event_type === "cv_download").length;
  const totalProjects = events.filter((e) => e.event_type === "project_click").length;
  const totalContacts = events.filter((e) => e.event_type === "contact_click").length;

  const uniqueIps = new Set(events.map((e) => extractIp(e))).size;
  const mobileCount = events.filter((e) => (e.device_type || "").includes("Mobile")).length;
  const desktopCount = events.filter((e) => (e.device_type || "").includes("Desktop")).length;

  const filtered = events.filter((e) => {
    const ip = extractIp(e);
    const matchSearch =
      (e.target_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.referrer || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.device_type || "").toLowerCase().includes(search.toLowerCase()) ||
      ip.toLowerCase().includes(search.toLowerCase()) ||
      e.event_type.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === "all" || e.event_type === typeFilter;

    return matchSearch && matchType;
  });

  const formatTimestamp = (str: string) => {
    try {
      const d = new Date(str);
      return d.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return str;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "page_view":
        return "bg-blue-950/80 text-blue-400 border-blue-800/60";
      case "cv_download":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-800/60";
      case "project_click":
        return "bg-purple-950/80 text-purple-400 border-purple-800/60";
      case "contact_click":
        return "bg-amber-950/80 text-amber-400 border-amber-800/60";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>Visitor Analytics & Real-Time Logs</span>
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/70 border border-emerald-800/80 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Tracking Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Pantau setiap pengunjung yang masuk ke link portfolio, mengunduh CV, dan melihat project secara detail beserta alamat IP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleTestPing}
            disabled={sendingTest}
            variant="outline"
            size="sm"
            className="rounded-xl border-blue-500/30 bg-blue-950/40 text-blue-300 hover:text-white hover:bg-blue-900/50 text-xs font-mono h-9 gap-1.5"
            title="Kirim event uji coba untuk mengecek IP Anda sendiri"
          >
            <Send className={`w-3.5 h-3.5 ${sendingTest ? "animate-pulse" : ""}`} />
            <span>Test Ping (Cek IP Saya)</span>
          </Button>

          <Button
            onClick={() => fetchEvents(false)}
            variant="outline"
            size="sm"
            className="rounded-xl border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono h-9 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          {events.length > 0 && (
            <Button
              onClick={handleClearLogs}
              variant="outline"
              size="sm"
              className="rounded-xl border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/50 hover:text-red-300 text-xs font-mono h-9 gap-1.5"
              title="Bersihkan seluruh log aktivitas"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Kunjungan Halaman"
          value={totalViews}
          description="Page View tercatat"
          icon={Eye}
          accentColor="blue"
        />
        <StatsCard
          title="Unduh CV"
          value={totalCv}
          description="Konversi Rekruter"
          icon={FileDown}
          accentColor="emerald"
        />
        <StatsCard
          title="Eksplorasi Project"
          value={totalProjects}
          description="Klik Demo & GitHub"
          icon={FolderGit2}
          accentColor="purple"
        />
        <StatsCard
          title="Inquiry Kontak"
          value={totalContacts}
          description="Interaksi Pesan"
          icon={MessageSquare}
          accentColor="amber"
        />
      </div>

      {/* Visitor Insights Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Users className="w-4 h-4 text-purple-400" />
            <span>
              Total IP Unik: <strong className="text-white">{uniqueIps}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Monitor className="w-4 h-4 text-blue-400" />
            <span>Desktop: <strong>{desktopCount}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Mobile: <strong>{mobileCount}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-blue-500 rounded w-3.5 h-3.5"
            />
            <span className="text-[11px]">Auto-Refresh (20s)</span>
          </label>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database Supabase Aktif</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan IP, target aksi, referrer, perangkat..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
          >
            <option value="all">Semua Tipe Event</option>
            <option value="page_view">Page View</option>
            <option value="cv_download">Download CV</option>
            <option value="project_click">Project Click</option>
            <option value="contact_click">Contact Click</option>
          </select>
        </div>
      </div>

      {/* Log Activity Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-xs font-mono">Memuat log aktivitas real-time...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center px-4">
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-500">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white">
              {events.length === 0
                ? "Belum Ada Riwayat Aktivitas Pengunjung"
                : "Tidak ada data yang cocok dengan pencarian / filter"}
            </h3>
            <p className="text-xs text-zinc-400 font-mono max-w-md">
              {events.length === 0
                ? "Setiap ada pengunjung yang membuka link website Anda, mengunduh CV, atau mengklik project, log aktivitas lengkap beserta alamat IP akan langsung muncul di tabel ini."
                : "Coba ubah kata kunci pencarian atau ganti filter tipe event."}
            </p>
            {events.length === 0 && (
              <Button
                onClick={handleTestPing}
                disabled={sendingTest}
                size="sm"
                className="mt-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-mono font-semibold"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>Kirim Uji Coba Event (Cek IP Saya)</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Aksi / Event</th>
                  <th className="py-3 px-4">Target Aksi</th>
                  <th className="py-3 px-4">Alamat IP</th>
                  <th className="py-3 px-4">Perangkat & Browser</th>
                  <th className="py-3 px-4">Sumber (Referrer)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((row) => {
                  const ip = extractIp(row);
                  return (
                    <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {formatTimestamp(row.created_at)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${getEventBadge(
                            row.event_type
                          )}`}
                        >
                          {row.event_type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                        {row.target_name || "—"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-[11px]">
                          <Globe className="w-3 h-3 text-blue-400 shrink-0" />
                          <span>{ip}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-xs truncate">
                        <span className="inline-flex items-center gap-1.5">
                          {cleanDevice(row).includes("Mobile") ? (
                            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span className="truncate">{cleanDevice(row)}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">
                        {row.referrer && row.referrer !== "Direct" ? (
                          <span
                            title={row.referrer}
                            className="text-blue-400 underline underline-offset-2"
                          >
                            {row.referrer}
                          </span>
                        ) : (
                          <span className="text-zinc-500">Direct / Langsung</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
