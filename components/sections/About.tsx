"use client";

import { motion } from "framer-motion";
import { BookOpen, Trophy, Target, Compass } from "lucide-react";
import { naturalTransition } from "@/lib/motion";
import { SectionTitle } from "@/components/ui/section-title";


export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={naturalTransition}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#8C5747]/20 dark:border-[#E7C3B5]/30 bg-card font-mono text-xs font-semibold text-[#8C5747] dark:text-[#E7C3B5] uppercase tracking-[0.08em] mb-3 shadow-2xs"
          >
            About Me
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...naturalTransition, delay: 0.08 }}
            className="inline-block"
          >
            <SectionTitle>Behind the Code</SectionTitle>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Biography Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={naturalTransition}
            className="lg:col-span-8 rounded-2xl p-7 sm:p-8 flex flex-col justify-between border border-border bg-card shadow-xs hover:border-border  transition-colors"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-muted-foreground" />
                My Journey
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 font-normal">
                I am a passionate Full-Stack Web Developer and an Information Systems student (S1 Sistem Informasi) at Telkom University. My journey in technology is driven by a deep curiosity for system design and a focus on developing scalable frontend and backend web applications. I enjoy building efficient systems, integrating AI solutions, and constantly adapting to cutting-edge technologies.
              </p>
              <p className="text-muted-foreground leading-relaxed font-normal">
                With academic training in Software Engineering, Database Systems, OOP, and System Analysis & Design, I prioritize structural reliability, clean code, and intuitive user experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-border">
              <div>
                <p className="text-3xl font-extrabold text-foreground">3+</p>
                <p className="text-xs font-sans text-muted-foreground uppercase font-semibold tracking-wider mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground">10+</p>
                <p className="text-xs font-sans text-muted-foreground uppercase font-semibold tracking-wider mt-1">Built Projects</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground">3.84</p>
                <p className="text-xs font-sans text-muted-foreground uppercase font-semibold tracking-wider mt-1">Academic GPA</p>
              </div>
            </div>
          </motion.div>

          {/* Side Info Cards */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...naturalTransition, delay: 0.1 }}
              className="rounded-2xl p-5 flex-1 flex flex-col justify-center gap-2.5 border border-border bg-card shadow-xs hover:border-border  transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-secondary border border-border text-muted-foreground shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Education</h4>
              </div>
              <div>
                <p className="font-bold text-sm text-foreground ">S1 Sistem Informasi</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Telkom University</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="font-semibold text-muted-foreground font-mono">GPA: 3.84 / 4.00</span>
                  <span>•</span>
                  <span className="font-mono">2022 – 2026</span>
                </div>
              </div>
            </motion.div>

            {/* Career Objective Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...naturalTransition, delay: 0.18 }}
              className="rounded-2xl p-5 flex-1 flex flex-col justify-center gap-2.5 border border-border bg-card shadow-xs hover:border-border  transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-secondary border border-border text-muted-foreground shadow-2xs">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Career Objective</h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                To engineer scalable full-stack web architectures, optimizing data-intensive backends, and delivering frictionless user interfaces for real-world enterprise applications.
              </p>
            </motion.div>

            {/* Current Focus Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...naturalTransition, delay: 0.24 }}
              className="rounded-2xl p-5 flex-1 flex flex-col justify-center gap-2.5 border border-border bg-card shadow-xs hover:border-border  transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-secondary border border-border text-muted-foreground shadow-2xs">
                  <Trophy className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Current Focus</h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                Focusing on full-stack web architectures, optimizing database performance, and integrating secure payment processing and AI technologies.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
