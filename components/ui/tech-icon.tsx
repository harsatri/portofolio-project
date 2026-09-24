import * as React from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiBootstrap,
  SiHtml5,
  SiCss,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiLaravel,
  SiPhp,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiGo,
  SiRust,
  SiSpring,
  SiFastapi,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiSupabase,
  SiRedis,
  SiMongodb,
  SiSqlite,
  SiPrisma,
  SiNeon,
  SiDocker,
  SiGit,
  SiGithub,
  SiGitlab,
  SiLinux,
  SiVercel,
  SiPostman,
  SiFigma,
  SiNginx,
  SiApache,
  SiGooglecloud,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiTensorflow,
  SiPytorch,
  SiGooglecolab,
  SiSocketdotio,
  SiJsonwebtokens,
  SiXampp,
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";
import { cn } from "@/lib/utils";

// Special Monogram overrides for common tools without direct brand icons
const MONOGRAM_SPECIALS: Record<string, string> = {
  midtrans: "MT",
  apache: "AP",
  doku: "DK",
  antigravity: "AG",
  laragon: "LG",
  postman: "PM",
  socketio: "SI",
  restapi: "RA",
};

/**
 * Normalizes framework/tool string:
 * - lowercase & trim
 * - strips version numbers, parentheses (e.g. "(PHP)", "(App Router)")
 * - removes suffixes like .js, .ts, css, orm, payment, gateway, etc.
 */
export function normalizeTechName(name: string): string {
  if (!name) return "";
  const lower = name.toLowerCase().trim();

  // Priority handles for specific combined strings
  if (lower.includes("scikit")) return "scikitlearn";
  if (lower.includes("socket.io") || lower.includes("socketio")) return "socketdotio";
  if (lower.includes("rest") && lower.includes("api")) return "restapi";
  if (lower.includes("jwt") || lower.includes("json web token")) return "jwt";
  if (lower.includes("colab")) return "googlecolab";
  if (lower.includes("vscode") || lower.includes("vs code") || lower.includes("visual studio"))
    return "vscode";
  if (lower.includes("tailwind")) return "tailwindcss";
  if (lower.includes("next")) return "nextjs";
  if (lower.includes("node")) return "nodejs";
  if (lower.includes("express")) return "express";
  if (lower.includes("react") && !lower.includes("react-")) return "react";
  if (lower.includes("type") && lower.includes("script")) return "typescript";
  if (lower.includes("java") && lower.includes("script")) return "javascript";
  if (lower.includes("postgre")) return "postgresql";
  if (lower.includes("mysql")) return "mysql";
  if (lower.includes("php") && !lower.includes("laravel")) return "php";
  if (lower.includes("laravel")) return "laravel";
  if (lower.includes("golang") || lower.startsWith("go ") || lower === "go") return "go";
  if (lower.includes("spring")) return "spring";
  if (lower.includes("vue")) return "vue";
  if (lower.includes("prisma")) return "prisma";
  if (lower.includes("aws") || lower.includes("amazon web services")) return "aws";
  if (lower.includes("gcp") || lower.includes("google cloud")) return "gcp";

  // General strip
  return lower
    .replace(/\(.*?\)/g, "")
    .replace(/\.js\b|\.ts\b|\.io\b/g, "")
    .replace(/\b(css|orm|framework|web|library|payment|gateway|app router)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Generates a clean 2-letter monogram for unregistered tools (e.g. "MT", "AP")
 */
export function getMonogram(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const [key, value] of Object.entries(MONOGRAM_SPECIALS)) {
    if (lower.includes(key)) return value;
  }

  const words = name
    .trim()
    .replace(/[^a-zA-Z0-9\s-_.]/g, "")
    .split(/[\s\-_/.]+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  if (words.length === 1) {
    const letters = words[0].replace(/[^a-zA-Z0-9]/g, "");
    return (letters.slice(0, 2) || "TX").toUpperCase();
  }

  return "TX";
}

type IconComponent = React.ComponentType<{ className?: string }>;

function GoogleColabSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-2.9737-.0997-.0802A7.033 7.033 0 0 0 7.07 4.9855zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zM9.596 14.5909c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l.1368-.1115z"
        fill="#F9AB00"
      />
      <path
        d="M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM22.0793 7.1576l-2.3892 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9456-9.9476z"
        fill="#E8710A"
      />
    </svg>
  );
}

const TECH_ICON_REGISTRY: Record<string, IconComponent> = {
  // Frontend
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  tailwindcss: SiTailwindcss,
  bootstrap: SiBootstrap,
  html5: SiHtml5,
  html: SiHtml5,
  css3: SiCss,
  css: SiCss,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  svelte: SiSvelte,
  angular: SiAngular,

  // Backend & Systems
  laravel: SiLaravel,
  php: SiPhp,
  nodejs: SiNodedotjs,
  express: SiExpress,
  python: SiPython,
  go: SiGo,
  golang: SiGo,
  rust: SiRust,
  java: FaJava,
  spring: SiSpring,
  springboot: SiSpring,
  fastapi: SiFastapi,
  django: SiDjango,
  restapi: TbApi,
  api: TbApi,
  socketdotio: SiSocketdotio,
  jwt: SiJsonwebtokens,

  // Databases & Storage
  postgresql: SiPostgresql,
  mysql: SiMysql,
  supabase: SiSupabase,
  redis: SiRedis,
  mongodb: SiMongodb,
  sqlite: SiSqlite,
  prisma: SiPrisma,
  prismaorm: SiPrisma,
  neon: SiNeon,

  // DevOps, Cloud & Tools
  docker: SiDocker,
  git: SiGit,
  github: SiGithub,
  gitlab: SiGitlab,
  linux: SiLinux,
  vercel: SiVercel,
  postman: SiPostman,
  figma: SiFigma,
  nginx: SiNginx,
  apache: SiApache,
  aws: FaAws,
  gcp: SiGooglecloud,
  googlecloud: SiGooglecloud,
  vscode: VscVscode,
  googlecolab: GoogleColabSvg,
  xampp: SiXampp,

  // AI & Data Science
  scikitlearn: SiScikitlearn,
  pandas: SiPandas,
  numpy: SiNumpy,
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,
};

export interface TechIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
  iconClassName?: string;
}

const CUSTOM_IMAGE_LOGOS: Record<string, string> = {
  laragon: "/icons/laragon.png",
  antigravity: "/icons/antigravity.png",
  antigravityide: "/icons/antigravity.png",
  neon: "/icons/neon.png",
  neondb: "/icons/neon.png",
  midtrans: "/icons/midtrans.png",
  midtranspayment: "/icons/midtrans.png",
  doku: "/icons/doku.png",
  dokupayment: "/icons/doku.png",
};

export function TechIcon({
  name,
  className,
  iconClassName = "w-4 h-4",
  ...props
}: TechIconProps) {
  const normalized = normalizeTechName(name);

  // Check custom official image logos provided by user
  if (CUSTOM_IMAGE_LOGOS[normalized]) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          className
        )}
        title={name}
        {...props}
      >
        <img
          src={CUSTOM_IMAGE_LOGOS[normalized]}
          alt={name}
          className={cn(iconClassName, "object-contain select-none")}
          loading="lazy"
        />
      </span>
    );
  }

  const IconComponent = TECH_ICON_REGISTRY[normalized];

  if (IconComponent) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center shrink-0 text-zinc-400 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors duration-200",
          className
        )}
        title={name}
        {...props}
      >
        <IconComponent className={cn(iconClassName, "transition-colors")} />
      </span>
    );
  }

  // Clean Monogram Badge Fallback (NO ugly `</>` or generic code icon)
  const monogram = getMonogram(name);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        className
      )}
      title={name}
      {...props}
    >
      <span
        className="inline-flex items-center justify-center font-mono text-[9px] font-bold tracking-tight uppercase bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-1 min-w-[20px] h-4.5 select-none leading-none group-hover:border-zinc-500 group-hover:text-white transition-colors duration-200"
        aria-hidden="true"
      >
        {monogram}
      </span>
    </span>
  );
}
