"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TechIcon, normalizeTechName } from "@/components/ui/tech-icon";
import { getTechLogo } from "@/components/icons";
import { naturalTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface TechItem {
  name: string;
  proficiency: "Advanced" | "Proficient";
}

export interface TechGroup {
  category: string;
  items: TechItem[];
}

const FALLBACK_TECH_GROUPS: TechGroup[] = [
  {
    category: "Frontend Development",
    items: [
      { name: "React", proficiency: "Advanced" },
      { name: "Next.js", proficiency: "Advanced" },
      { name: "TypeScript", proficiency: "Advanced" },
      { name: "JavaScript", proficiency: "Advanced" },
      { name: "Tailwind CSS", proficiency: "Advanced" },
      { name: "Bootstrap", proficiency: "Proficient" },
      { name: "HTML5", proficiency: "Advanced" },
      { name: "CSS3", proficiency: "Advanced" },
      { name: "Vue.js", proficiency: "Proficient" },
    ],
  },
  {
    category: "Backend & Systems",
    items: [
      { name: "Laravel", proficiency: "Advanced" },
      { name: "PHP", proficiency: "Advanced" },
      { name: "Node.js", proficiency: "Advanced" },
      { name: "Express.js", proficiency: "Advanced" },
      { name: "Python", proficiency: "Proficient" },
      { name: "Go (Golang)", proficiency: "Proficient" },
      { name: "REST APIs", proficiency: "Advanced" },
      { name: "Socket.IO", proficiency: "Advanced" },
      { name: "JWT & RBAC", proficiency: "Proficient" },
    ],
  },
  {
    category: "Databases & Storage",
    items: [
      { name: "PostgreSQL", proficiency: "Advanced" },
      { name: "MySQL", proficiency: "Advanced" },
      { name: "Supabase", proficiency: "Advanced" },
      { name: "Redis", proficiency: "Proficient" },
      { name: "Prisma ORM", proficiency: "Advanced" },
      { name: "Neon DB", proficiency: "Proficient" },
    ],
  },
  {
    category: "AI, Tools & Workflow",
    items: [
      { name: "Scikit-Learn", proficiency: "Proficient" },
      { name: "Pandas", proficiency: "Proficient" },
      { name: "NumPy", proficiency: "Proficient" },
      { name: "Docker", proficiency: "Proficient" },
      { name: "Git", proficiency: "Advanced" },
      { name: "GitHub", proficiency: "Advanced" },
      { name: "GitLab", proficiency: "Proficient" },
      { name: "Midtrans Payment", proficiency: "Advanced" },
      { name: "DOKU Payment", proficiency: "Proficient" },
      { name: "Laragon", proficiency: "Advanced" },
      { name: "Antigravity IDE", proficiency: "Advanced" },
      { name: "Postman", proficiency: "Proficient" },
      { name: "Figma", proficiency: "Proficient" },
      { name: "Vercel", proficiency: "Proficient" },
      { name: "Linux", proficiency: "Proficient" },
    ],
  },
];

const CANONICAL_NAMES: Record<string, string> = {
  react: "React",
  nextjs: "Next.js",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tailwindcss: "Tailwind CSS",
  bootstrap: "Bootstrap",
  html5: "HTML5",
  html: "HTML5",
  css3: "CSS3",
  css: "CSS3",
  vue: "Vue.js",
  vuejs: "Vue.js",
  svelte: "Svelte",
  angular: "Angular",
  laravel: "Laravel",
  php: "PHP",
  nodejs: "Node.js",
  express: "Express.js",
  python: "Python",
  go: "Go (Golang)",
  golang: "Go (Golang)",
  rust: "Rust",
  java: "Java",
  spring: "Spring Boot",
  springboot: "Spring Boot",
  fastapi: "FastAPI",
  django: "Django",
  restapi: "REST APIs",
  api: "REST APIs",
  socketdotio: "Socket.IO",
  jwt: "JWT & RBAC",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  supabase: "Supabase",
  redis: "Redis",
  mongodb: "MongoDB",
  sqlite: "SQLite",
  prisma: "Prisma ORM",
  prismaorm: "Prisma ORM",
  neon: "Neon DB",
  docker: "Docker",
  git: "Git",
  github: "GitHub",
  gitlab: "GitLab",
  linux: "Linux",
  vercel: "Vercel",
  postman: "Postman",
  figma: "Figma",
  nginx: "Nginx",
  apache: "Apache",
  aws: "AWS",
  gcp: "Google Cloud (GCP)",
  vscode: "VS Code",
  googlecolab: "Google Colab",
  xampp: "XAMPP",
  laragon: "Laragon",
  scikitlearn: "Scikit-Learn",
  pandas: "Pandas",
  numpy: "NumPy",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  midtrans: "Midtrans Payment",
  doku: "DOKU Payment",
  antigravity: "Antigravity IDE",
};

function resolveCanonicalCategory(name: string, originalCategory?: string): string {
  const norm = normalizeTechName(name);

  // Strict overrides based on tool identity
  const FRONTEND = [
    "react", "nextjs", "typescript", "javascript", "tailwindcss",
    "bootstrap", "html5", "html", "css3", "css", "vue", "vuejs", "svelte", "angular"
  ];
  const BACKEND = [
    "laravel", "php", "nodejs", "express", "python", "go", "golang",
    "rust", "java", "spring", "springboot", "fastapi", "django",
    "restapi", "api", "socketdotio", "jwt"
  ];
  const DATABASE = [
    "postgresql", "mysql", "supabase", "redis", "mongodb", "sqlite",
    "prisma", "prismaorm", "neon"
  ];
  const TOOLS = [
    "docker", "git", "github", "gitlab", "linux", "vercel", "postman",
    "figma", "nginx", "apache", "aws", "gcp", "googlecloud", "vscode",
    "googlecolab", "xampp", "laragon", "scikitlearn", "pandas", "numpy",
    "tensorflow", "pytorch", "midtrans", "doku", "antigravity"
  ];

  if (FRONTEND.includes(norm)) return "Frontend Development";
  if (BACKEND.includes(norm)) return "Backend & Systems";
  if (DATABASE.includes(norm)) return "Databases & Storage";
  if (TOOLS.includes(norm)) return "AI, Tools & Workflow";

  if (originalCategory?.toLowerCase().includes("front")) return "Frontend Development";
  if (originalCategory?.toLowerCase().includes("back")) return "Backend & Systems";
  if (originalCategory?.toLowerCase().includes("data") || originalCategory?.toLowerCase().includes("storage"))
    return "Databases & Storage";
  return "AI, Tools & Workflow";
}

export default function TechStack({
  initialTechGroups,
}: {
  initialTechGroups?: TechGroup[];
}) {
  // Sanitize, categorize properly (e.g. PHP & Laravel strictly in Backend), and deduplicate
  const groups = useMemo(() => {
    const rawItems: { name: string; proficiency: "Advanced" | "Proficient"; category: string }[] = [];

    if (initialTechGroups && initialTechGroups.length > 0) {
      initialTechGroups.forEach((group) => {
        group.items.forEach((it) => {
          rawItems.push({
            name: it.name,
            proficiency: it.proficiency,
            category: group.category,
          });
        });
      });
    }

    if (rawItems.length === 0) {
      FALLBACK_TECH_GROUPS.forEach((group) => {
        group.items.forEach((it) => {
          rawItems.push({
            name: it.name,
            proficiency: it.proficiency,
            category: group.category,
          });
        });
      });
    }

    // Deduplicate while picking best proficiency & canonical title
    const seenItems = new Map<
      string,
      { name: string; proficiency: "Advanced" | "Proficient"; category: string }
    >();

    rawItems.forEach((item) => {
      const norm = normalizeTechName(item.name);
      if (!norm) return;

      const targetCategory = resolveCanonicalCategory(item.name, item.category);
      const canonicalName = CANONICAL_NAMES[norm] || item.name;
      const isAdvanced = item.proficiency === "Advanced";

      const existing = seenItems.get(norm);
      if (existing) {
        if (isAdvanced && existing.proficiency !== "Advanced") {
          existing.proficiency = "Advanced";
        }
      } else {
        seenItems.set(norm, {
          name: canonicalName,
          proficiency: isAdvanced ? "Advanced" : "Proficient",
          category: targetCategory,
        });
      }
    });

    const categoryBuckets: Record<string, TechItem[]> = {
      "Frontend Development": [],
      "Backend & Systems": [],
      "Databases & Storage": [],
      "AI, Tools & Workflow": [],
    };

    seenItems.forEach((item) => {
      if (categoryBuckets[item.category]) {
        categoryBuckets[item.category].push({
          name: item.name,
          proficiency: item.proficiency,
        });
      } else {
        categoryBuckets["AI, Tools & Workflow"].push({
          name: item.name,
          proficiency: item.proficiency,
        });
      }
    });

    return Object.entries(categoryBuckets)
      .filter(([, items]) => items.length > 0)
      .map(([category, items]) => ({
        category,
        items,
      }));
  }, [initialTechGroups]);

  return (
    <TooltipProvider delayDuration={100}>
      <section id="techstack" className="py-24 bg-background relative transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-14">
            <Badge
              variant="outline"
              className="mb-3 px-3.5 py-1 font-sans text-xs font-semibold text-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
            >
              Technology Arsenal
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Technologies & Frameworks
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md mt-3 font-normal">
              Standardized industry tooling utilized across production web platforms and data pipelines.
            </p>
          </div>

          {/* Categorized Data-Dense Interactive Chips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group, groupIdx) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  ...naturalTransition,
                  delay: groupIdx * 0.08,
                }}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/70 p-6 sm:p-7 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors duration-200 backdrop-blur-xs"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-sans font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {group.category}
                  </h3>
                  <span className="text-[11px] font-sans text-zinc-400 dark:text-zinc-500 font-medium">
                    {group.items.length} tools
                  </span>
                </div>

                {/* Data-Dense Labeled Pills / Chips Grid */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {group.items.map((item) => (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>
                        <div
                          tabIndex={0}
                          role="button"
                          aria-label={`${item.name} (${item.proficiency})`}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50/90 dark:bg-zinc-900/70 border border-zinc-200/90 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/90 dark:hover:bg-zinc-800/80 hover:-translate-y-0.5 transition-all duration-150 shadow-2xs cursor-default select-none focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                        >
                          {/* Brand / Tool Icon */}
                          <div className="w-4 h-4 flex items-center justify-center shrink-0">
                            {getTechLogo(item.name, "w-4 h-4 object-contain") || (
                              <TechIcon name={item.name} iconClassName="w-4 h-4" />
                            )}
                          </div>

                          {/* Canonical Technology Name */}
                          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 tracking-tight">
                            {item.name}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1.5 shadow-lg text-xs font-sans text-zinc-900 dark:text-zinc-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-zinc-400 dark:text-zinc-500">•</span>
                          <span
                            className={
                              item.proficiency === "Advanced"
                                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                : "text-zinc-600 dark:text-zinc-400"
                            }
                          >
                            {item.proficiency}
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
