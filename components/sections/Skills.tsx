"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Wrench,
  Cpu
} from "lucide-react";

interface SkillItem {
  name: string;
  level: number; // 0 to 100
}

interface SkillGroup {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: SkillItem[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Languages & Frameworks",
    icon: Code2,
    skills: [
      { name: "JavaScript / TypeScript", level: 92 },
      { name: "PHP", level: 85 },
      { name: "React.js & Next.js", level: 90 },
      { name: "Python", level: 75 },
    ],
  },
  {
    category: "Frontend Stack",
    icon: Cpu,
    skills: [
      { name: "HTML5 & CSS3", level: 95 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Bootstrap", level: 85 },
      { name: "Flutter", level: 70 },
    ],
  },
  {
    category: "Backend Stack",
    icon: Server,
    skills: [
      { name: "Node.js & Express.js", level: 88 },
      { name: "Laravel", level: 85 },
      { name: "REST APIs & Socket.IO", level: 90 },
    ],
  },
  {
    category: "Databases & Security",
    icon: Database,
    skills: [
      { name: "MySQL & PostgreSQL", level: 88 },
      { name: "Database Modeling", level: 85 },
      { name: "JWT & RBAC", level: 90 },
    ],
  },
  {
    category: "Tools & Platforms",
    icon: Wrench,
    skills: [
      { name: "Git & GitHub", level: 92 },
      { name: "Docker", level: 80 },
      { name: "Postman & Figma", level: 85 },
      { name: "Vercel & Supabase", level: 88 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Skills & Expertise
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SKILL_GROUPS.map((group, groupIdx) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: groupIdx * 0.05 }}
                className="rounded-2xl p-6 flex flex-col border border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/80 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-base">{group.category}</h3>
                </div>

                <div className="flex flex-col gap-4 flex-1 justify-center">
                  {group.skills.map((skill) => (
                    <div key={skill.name} className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-300 font-medium">{skill.name}</span>
                        <span className="text-zinc-500">{skill.level}%</span>
                      </div>
                      
                      {/* Skill visual level bar */}
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/40">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-white rounded-full relative"
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-zinc-300 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
