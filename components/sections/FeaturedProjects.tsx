"use client";

import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import { getTechLogo } from "@/components/icons";

interface Project {
  title: string;
  description: string;
  details: string[];
  techStack: string[];
  github: string;
  demo: string;
  featured: boolean;
  visualPlaceholder: React.ComponentType; // Render a beautiful customized UI mockup in CSS
}

const FEATURED_PROJECTS: Project[] = [
  {
    title: "Smart Material Management System (SMMS)",
    description: "Sistem full-stack berbasis web untuk digitalisasi seluruh proses pengajuan material, persetujuan, pemantauan stok, dan alur kerja pengadaan untuk PT. Sundaya Indonesia.",
    details: [
      "Menggantikan proses pencatatan manual berbasis Excel dan WhatsApp menjadi sistem terpusat.",
      "Membangun frontend interaktif menggunakan React.js dan backend RESTful dengan Node.js & Express.js.",
      "Mengintegrasikan notifikasi real-time dan dashboard pemantauan menggunakan Socket.IO.",
      "Mengimplementasikan kontrol akses berbasis peran (RBAC) untuk 5 peran pengguna berbeda."
    ],
    techStack: ["React.js", "Node.js", "Express.js", "MySQL", "Socket.IO", "Docker", "JWT", "JavaScript (ES6+)"],
    github: "https://github.com/raakaprx/warehouse-sundaya-v2/tree/main",
    demo: "https://github.com/raakaprx/warehouse-sundaya-v2/tree/main",
    featured: true,
    visualPlaceholder: () => (
      <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 font-mono text-[9px] text-zinc-500">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <span className="text-zinc-400 font-bold">SMMS DASHBOARD v1.0</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">ONLINE</span>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-800/40 rounded">
            <span>[REQ-8902] Copper Winding Wire</span>
            <span className="text-emerald-400 font-bold">APPROVED</span>
          </div>
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-800/40 rounded">
            <span>[REQ-8903] LED Driver Board</span>
            <span className="text-amber-500 font-bold">PENDING APPROVAL</span>
          </div>
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-800/40 rounded">
            <span>[REQ-8904] Aluminum Case</span>
            <span className="text-white font-bold">IN TRANSIT</span>
          </div>
        </div>
        <div className="text-[8px] text-zinc-650 flex justify-between">
          <span>Active Session: Admin</span>
          <span>Socket: CONNECTED</span>
        </div>
      </div>
    )
  },
  {
    title: "Plastani",
    description: "Platform E-Commerce yang dirancang khusus untuk membantu petani dan produsen lokal (UMKM) dalam memasarkan dan menyalurkan hasil produk mereka secara online.",
    details: [
      "Menyediakan fitur katalog produk terorganisir, pencarian efektif, dan detail produk lengkap.",
      "Mengintegrasikan komunikasi langsung melalui WhatsApp API untuk menghubungkan pembeli dan penjual secara seamless.",
      "Membangun sistem administrasi komprehensif untuk manajemen produk, kategori, artikel, dan analitik transaksi."
    ],
    techStack: ["PHP", "Laravel", "MySQL", "Eloquent ORM", "Blade", "Tailwind CSS", "WhatsApp API", "Laravel Auth"],
    github: "https://github.com/raakaprx/plastani",
    demo: "https://github.com/raakaprx/plastani",
    featured: true,
    visualPlaceholder: () => (
      <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 font-mono text-[9px] text-zinc-500">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <span className="text-zinc-400 font-bold">PLASTANI E-COMMERCE</span>
          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400">ADMIN PORTAL</span>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-800/40 rounded">
            <span>Organik Red Rice (5kg)</span>
            <span className="text-white font-bold">Rp 75,000</span>
          </div>
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-800/40 rounded">
            <span>Fresh Potatoes (1kg)</span>
            <span className="text-white font-bold">Rp 18,000</span>
          </div>
          <div className="flex justify-between items-center bg-zinc-900/40 p-2 border border-zinc-800/40 rounded">
            <span>Fresh Tomatoes (1kg)</span>
            <span className="text-white font-bold">Rp 12,000</span>
          </div>
        </div>
        <div className="text-[8px] text-zinc-650 flex justify-between">
          <span>Integrated: WhatsApp API</span>
          <span>Transactions: Active</span>
        </div>
      </div>
    )
  }
];

export default function FeaturedProjects() {
  return (
    <section id="featured" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3"
          >
            Showcase
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Featured Engineering Projects
          </motion.h2>
        </div>

        <div className="flex flex-col gap-16">
          {FEATURED_PROJECTS.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text Area */}
              <div className={`lg:col-span-6 flex flex-col justify-center ${
                index % 2 === 1 ? "lg:order-2" : ""
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-medium border border-zinc-800 bg-zinc-900/50 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    Featured Project
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 hover:text-zinc-300 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-zinc-400 leading-relaxed mb-6">
                  {project.description}
                </p>

                <ul className="flex flex-col gap-2 text-zinc-500 text-sm mb-6 pl-1">
                  {project.details.map((detail, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-zinc-700 font-mono mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-300 font-mono text-xs hover:border-zinc-800 transition-colors"
                    >
                      <span className="shrink-0 flex items-center justify-center">
                        {getTechLogo(tech, "w-3.5 h-3.5")}
                      </span>
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
                  >
                    Live Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-300 font-medium text-sm hover:bg-zinc-900 hover:text-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                    Source Code
                  </a>
                </div>
              </div>

              {/* Visual Mockup Box */}
              <div className={`lg:col-span-6 h-64 sm:h-80 ${
                index % 2 === 1 ? "lg:order-1" : ""
              }`}>
                <div className="w-full h-full bg-white/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden group shadow-xs">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Decorative mesh/radial glow on background */}
                  <div className="absolute inset-0 grid-mesh opacity-20" />
                  <div className="absolute inset-0 radial-glow opacity-30" />

                  {/* Render Visual Mockup */}
                  <div className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                    <project.visualPlaceholder />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
