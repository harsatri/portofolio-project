"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, CheckCircle2 } from "lucide-react";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  credentialId?: string;
  skillsVerified: string[];
}

const CERTIFICATES: Certificate[] = [
  {
    title: "Sertifikat Kompetensi - Pengembang Web Bersertifikat (CWDev)",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    date: "Jun 2026",
    credentialId: "BNSP-CWDEV-62026",
    credentialUrl: "https://bnsp.go.id",
    skillsVerified: ["Pengembangan Perangkat Lunak", "Pemrograman", "Web Development"],
  },
];

export default function Certificates({
  initialCertificates,
}: {
  initialCertificates?: Certificate[];
}) {
  const certificateList =
    initialCertificates && initialCertificates.length > 0
      ? initialCertificates
      : CERTIFICATES;

  return (
    <section id="certificates" className="py-24 bg-background relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3"
          >
            Credentials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight"
          >
            Certificates & Accreditation
          </motion.h2>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm max-w-md mt-3">
            Officially verified professional certifications and national competency accreditations.
          </p>
        </div>

        {/* Dynamic Centered Flex Layout */}
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {certificateList.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md rounded-2xl p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden bg-white dark:bg-zinc-950/80 border border-zinc-300 dark:border-zinc-800 hover:border-zinc-500 dark:hover:border-zinc-650 shadow-sm hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300"
            >
              <div>
                {/* Header: Icon + Official Credential Seal */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    <Award className="w-6 h-6" />
                  </div>

                  {/* Authentic, Clean Official Accreditation Badge (Non-AI Style) */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-[11px] font-bold text-emerald-850 dark:text-emerald-400 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-sans tracking-tight">Verified • BNSP RI</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-zinc-950 dark:text-white text-base leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-zinc-200 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-zinc-800 dark:text-zinc-300 font-semibold text-xs mb-1">{cert.issuer}</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                  <span>Issued: {cert.date}</span>
                  {cert.credentialId && (
                    <>
                      <span>•</span>
                      <span>ID: {cert.credentialId}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-850">
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cert.skillsVerified.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono text-zinc-800 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-md border border-zinc-300 dark:border-zinc-800 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-950 dark:text-white hover:text-blue-600 dark:hover:text-zinc-300 transition-colors"
                >
                  View Credential
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
