import * as React from "react";
import Image from "next/image";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiLaravel,
  SiPhp,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiPrisma,
  SiDocker,
  SiGit,
  SiGithub,
  SiWhatsapp,
  SiGmail,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiRedis,
  SiSocketdotio,
  SiJsonwebtokens,
  SiBootstrap,
  SiSupabase,
  SiPostman,
  SiFigma,
  SiGooglecolab,
  SiLinux,
  SiApache,
  SiNginx,
  SiFlutter,
  SiVercel,
  SiShadcnui,
  SiXampp,
  SiStreamlit,
  SiVuedotjs,
  SiSvelte,
  SiAngular,
  SiGo,
  SiGitlab,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { TbApi } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";
import {
  LineChart,
  ShieldCheck,
  Workflow,
  CheckCircle2,
  Code2,
  Lock,
  Boxes,
  Database,
  Layers,
  Sparkles,
  Server,
  Binary,
  Cpu,
} from "lucide-react";
import { TechIcon } from "@/components/ui/tech-icon";
export { TechIcon };

// Social Icons
export function Github({ className = "w-5 h-5", ...props }: React.ComponentProps<typeof SiGithub>) {
  return <SiGithub className={`${className} transition-colors`} {...props} />;
}

export function Linkedin({ className = "w-5 h-5", ...props }: React.ComponentProps<typeof FaLinkedin>) {
  return <FaLinkedin className={`${className} text-[#0A66C2]`} {...props} />;
}

export function WhatsappLogo({ className = "w-5 h-5", ...props }: React.ComponentProps<typeof SiWhatsapp>) {
  return <SiWhatsapp className={`${className} text-[#25D366]`} {...props} />;
}

export function GmailLogo({ className = "w-5 h-5", ...props }: React.ComponentProps<typeof SiGmail>) {
  return <SiGmail className={`${className} text-[#EA4335]`} {...props} />;
}

// Frontend & Languages
export function ReactLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiReact>) {
  return <SiReact className={`${className} text-[#61DAFB]`} {...props} />;
}

export function NextjsLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiNextdotjs>) {
  return <SiNextdotjs className={`${className} text-zinc-900 dark:text-white`} {...props} />;
}

export function TypescriptLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiTypescript>) {
  return <SiTypescript className={`${className} text-[#3178C6]`} {...props} />;
}

export function JavascriptLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiJavascript>) {
  return <SiJavascript className={`${className} text-[#F7DF1E]`} {...props} />;
}

export function TailwindLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiTailwindcss>) {
  return <SiTailwindcss className={`${className} text-[#38BDF8]`} {...props} />;
}

export function BootstrapLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiBootstrap>) {
  return <SiBootstrap className={`${className} text-[#7952B3]`} {...props} />;
}

export function HtmlLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiHtml5>) {
  return <SiHtml5 className={`${className} text-[#E34F26]`} {...props} />;
}

export function CssLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiCss>) {
  return <SiCss className={`${className} text-[#1572B6]`} {...props} />;
}

export function VueLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiVuedotjs>) {
  return <SiVuedotjs className={`${className} text-[#4FC08D]`} {...props} />;
}

export function SvelteLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiSvelte>) {
  return <SiSvelte className={`${className} text-[#FF3E00]`} {...props} />;
}

export function AngularLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiAngular>) {
  return <SiAngular className={`${className} text-[#DD0031]`} {...props} />;
}

// Backend & Fullstack
export function LaravelLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiLaravel>) {
  return <SiLaravel className={`${className} text-[#FF2D20]`} {...props} />;
}

export function PhpLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiPhp>) {
  return <SiPhp className={`${className} text-[#777BB4]`} {...props} />;
}

export function NodejsLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiNodedotjs>) {
  return <SiNodedotjs className={`${className} text-[#5FA04E]`} {...props} />;
}

export function ExpressLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiExpress>) {
  return <SiExpress className={`${className} text-zinc-800 dark:text-zinc-200`} {...props} />;
}

export function PythonLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiPython>) {
  return <SiPython className={`${className} text-[#3776AB]`} {...props} />;
}

export function GoLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiGo>) {
  return <SiGo className={`${className} text-[#00ADD8]`} {...props} />;
}

export function GitlabLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiGitlab>) {
  return <SiGitlab className={`${className} text-[#FC6D26]`} {...props} />;
}

// AI, ML & Data Science
export function ScikitlearnLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiScikitlearn>) {
  return <SiScikitlearn className={`${className} text-[#F7931E]`} {...props} />;
}

export function PandasLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiPandas>) {
  return <SiPandas className={`${className} text-[#150458] dark:text-[#58A6FF]`} {...props} />;
}

export function NumpyLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiNumpy>) {
  return <SiNumpy className={`${className} text-[#013243] dark:text-[#4DABCF]`} {...props} />;
}

export function MatplotlibLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <LineChart className={`${className} text-[#11557c] dark:text-[#58A6FF]`} />;
}

export function MlLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <Cpu className={`${className} text-[#8B5CF6]`} />;
}

export function CrossValLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <CheckCircle2 className={`${className} text-[#10B981]`} />;
}

// Database & ORM
export function PostgresqlLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiPostgresql>) {
  return <SiPostgresql className={`${className} text-[#4169E1]`} {...props} />;
}

export function MysqlLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiMysql>) {
  return <SiMysql className={`${className} text-[#4479A1]`} {...props} />;
}

export function SupabaseLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiSupabase>) {
  return <SiSupabase className={`${className} text-[#3ECF8E]`} {...props} />;
}

export function RedisLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiRedis>) {
  return <SiRedis className={`${className} text-[#DC382D]`} {...props} />;
}

export function PrismaLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiPrisma>) {
  return <SiPrisma className={`${className} text-zinc-900 dark:text-white`} {...props} />;
}

// Architecture & Real-Time & Security
export function SocketdotioLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiSocketdotio>) {
  return <SiSocketdotio className={`${className} text-zinc-900 dark:text-white`} {...props} />;
}

export function JwtLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiJsonwebtokens>) {
  return <SiJsonwebtokens className={`${className} text-[#FB015B]`} {...props} />;
}

export function DockerLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiDocker>) {
  return <SiDocker className={`${className} text-[#2496ED]`} {...props} />;
}

export function GitLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiGit>) {
  return <SiGit className={`${className} text-[#F05032]`} {...props} />;
}

export function RestApiLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof TbApi>) {
  return <TbApi className={`${className} text-[#38BDF8]`} {...props} />;
}

export function UmlLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <Workflow className={`${className} text-[#0284C7] dark:text-[#38BDF8]`} />;
}

export function SecurityLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <ShieldCheck className={`${className} text-[#10B981]`} />;
}

// Tools & Platforms
export function PostmanLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiPostman>) {
  return <SiPostman className={`${className} text-[#FF6C37]`} {...props} />;
}

export function FigmaLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiFigma>) {
  return <SiFigma className={`${className} text-[#F24E1E]`} {...props} />;
}

export function VscodeLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof VscVscode>) {
  return <VscVscode className={`${className} text-[#007ACC]`} {...props} />;
}

export function GoogleColabLogo({ className = "w-7 h-7", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <title>Google Colaboratory</title>
      {/* Left Golden Yellow Loop */}
      <path
        d="M7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-2.9737-.0997-.0802A7.033 7.033 0 0 0 7.07 4.9855zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zM9.596 14.5909c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l.1368-.1115z"
        fill="#F9AB00"
      />
      {/* Right Deep Orange Loop */}
      <path
        d="M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM22.0793 7.1576l-2.3892 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9456-9.9476z"
        fill="#E8710A"
      />
    </svg>
  );
}

export function LinuxLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiLinux>) {
  return <SiLinux className={`${className} text-[#FCC624]`} {...props} />;
}

export function ApacheLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiApache>) {
  return <SiApache className={`${className} text-[#D22128]`} {...props} />;
}

export function NginxLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiNginx>) {
  return <SiNginx className={`${className} text-[#009639]`} {...props} />;
}

export function FlutterLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiFlutter>) {
  return <SiFlutter className={`${className} text-[#02569B]`} {...props} />;
}

export function ShadcnLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiShadcnui>) {
  return <SiShadcnui className={`${className} text-zinc-900 dark:text-white`} {...props} />;
}

export function VercelLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiVercel>) {
  return <SiVercel className={`${className} text-zinc-900 dark:text-white`} {...props} />;
}

export function XamppLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiXampp>) {
  return <SiXampp className={`${className} text-[#FB7A24]`} {...props} />;
}

export function StreamlitLogo({ className = "w-7 h-7", ...props }: React.ComponentProps<typeof SiStreamlit>) {
  return <SiStreamlit className={`${className} text-[#FF4B4B]`} {...props} />;
}

// Payment Gateway: Midtrans
export function MidtransLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <img src="/icons/midtrans.png" alt="Midtrans" className={`${className} object-contain`} />;
}

// Payment Gateway: DOKU
export function DokuLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <img src="/icons/doku.png" alt="DOKU" className={`${className} object-contain`} />;
}

// Neon Database
export function NeonLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <img src="/icons/neon.png" alt="Neon DB" className={`${className} object-contain`} />;
}

// Laragon
export function LaragonLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <img src="/icons/laragon.png" alt="Laragon" className={`${className} object-contain`} />;
}

// Antigravity IDE
export function AntigravityLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <img src="/icons/antigravity.png" alt="Antigravity IDE" className={`${className} object-contain`} />;
}

// Site Logo
export function RakaLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <Image
        src="/logo.png"
        alt="R/ Logo"
        fill
        sizes="32px"
        className="object-contain invert dark:invert-0 transition-[filter] duration-200"
      />
    </div>
  );
}

// Comprehensive Logo Resolver for all Tech Stacks & Languages
export function getTechLogo(name: string, className = "w-5 h-5"): React.ReactNode {
  const normalized = name.toLowerCase().trim();

  // 1. Specific Framework & Tool Logos with Priority
  if (normalized.includes("laragon")) return <LaragonLogo className={className} />;
  if (normalized.includes("colab")) return <GoogleColabLogo className={className} />;
  if (normalized.includes("antigravity")) return <AntigravityLogo className={className} />;
  if (normalized.includes("midtrans")) return <MidtransLogo className={className} />;
  if (normalized.includes("doku")) return <DokuLogo className={className} />;
  if (normalized.includes("neon")) return <NeonLogo className={className} />;

  // 2. Git & Version Control (GitLab & GitHub before Git)
  if (normalized.includes("gitlab")) return <GitlabLogo className={className} />;
  if (normalized.includes("github")) return <Github className={className} />;
  if (normalized.includes("git")) return <GitLogo className={className} />;

  // 3. Frameworks & Web
  if (normalized.includes("react")) return <ReactLogo className={className} />;
  if (normalized.includes("next")) return <NextjsLogo className={className} />;
  if (normalized.includes("typescript") || normalized === "ts") return <TypescriptLogo className={className} />;
  if (normalized.includes("javascript") || normalized === "js" || normalized.includes("es6"))
    return <JavascriptLogo className={className} />;
  if (normalized.includes("tailwind")) return <TailwindLogo className={className} />;
  if (normalized.includes("bootstrap")) return <BootstrapLogo className={className} />;
  if (normalized.includes("flutter")) return <FlutterLogo className={className} />;
  if (normalized.includes("shadcn")) return <ShadcnLogo className={className} />;
  if (normalized.includes("vue")) return <VueLogo className={className} />;
  if (normalized.includes("svelte")) return <SvelteLogo className={className} />;
  if (normalized.includes("angular")) return <AngularLogo className={className} />;
  if (normalized.includes("blade") || normalized.includes("eloquent") || normalized.includes("laravel"))
    return <LaravelLogo className={className} />;
  if (normalized.includes("php")) return <PhpLogo className={className} />;
  if (normalized.includes("node")) return <NodejsLogo className={className} />;
  if (normalized.includes("express")) return <ExpressLogo className={className} />;
  if (normalized.includes("html")) return <HtmlLogo className={className} />;
  if (normalized.includes("css")) return <CssLogo className={className} />;

  // 4. Go / Golang (Exact word match only, do not match 'laragon' or 'google')
  const isGo =
    normalized === "go" ||
    normalized === "golang" ||
    normalized.startsWith("go ") ||
    normalized.endsWith(" go") ||
    normalized.includes("golang") ||
    normalized.includes("(golang)");
  if (isGo) return <GoLogo className={className} />;

  // 5. Python, ML & Data Science
  if (normalized.includes("python")) return <PythonLogo className={className} />;
  if (normalized.includes("scikit")) return <ScikitlearnLogo className={className} />;
  if (normalized.includes("pandas")) return <PandasLogo className={className} />;
  if (normalized.includes("numpy")) return <NumpyLogo className={className} />;
  if (normalized.includes("matplotlib") || normalized.includes("seaborn"))
    return <MatplotlibLogo className={className} />;
  if (
    normalized.includes("linear regression") ||
    normalized.includes("machine learning") ||
    normalized.includes("feature engineering") ||
    normalized.includes("data preprocessing") ||
    normalized.includes("predictive")
  )
    return <MlLogo className={className} />;
  if (normalized.includes("cross-validation") || normalized.includes("cross validation"))
    return <CrossValLogo className={className} />;
  if (normalized.includes("streamlit")) return <StreamlitLogo className={className} />;

  // 6. Databases & Backend Services
  if (normalized.includes("postgres")) return <PostgresqlLogo className={className} />;
  if (normalized.includes("mysql")) return <MysqlLogo className={className} />;
  if (normalized.includes("supabase")) return <SupabaseLogo className={className} />;
  if (normalized.includes("redis")) return <RedisLogo className={className} />;
  if (normalized.includes("prisma")) return <PrismaLogo className={className} />;
  if (normalized.includes("socket")) return <SocketdotioLogo className={className} />;

  // 7. Auth, Security & Architecture
  if (
    normalized.includes("jwt") ||
    normalized.includes("token") ||
    normalized.includes("rbac") ||
    normalized.includes("laravel auth")
  )
    return <JwtLogo className={className} />;
  if (
    normalized.includes("sha-512") ||
    normalized.includes("security") ||
    normalized.includes("encryption") ||
    normalized.includes("https")
  )
    return <SecurityLogo className={className} />;
  if (
    normalized.includes("uml") ||
    normalized.includes("modeling") ||
    normalized.includes("diagram") ||
    normalized.includes("waterfall") ||
    normalized.includes("sdlc")
  )
    return <UmlLogo className={className} />;

  // 8. DevOps & Tools
  if (normalized.includes("docker") || normalized.includes("container")) return <DockerLogo className={className} />;
  if (normalized.includes("whatsapp")) return <WhatsappLogo className={className} />;
  if (normalized.includes("postman")) return <PostmanLogo className={className} />;
  if (normalized.includes("figma")) return <FigmaLogo className={className} />;
  if (normalized.includes("vscode") || normalized.includes("vs code") || normalized.includes("visual studio"))
    return <VscodeLogo className={className} />;
  if (normalized.includes("linux")) return <LinuxLogo className={className} />;
  if (normalized.includes("apache")) return <ApacheLogo className={className} />;
  if (normalized.includes("nginx")) return <NginxLogo className={className} />;
  if (normalized.includes("vercel")) return <VercelLogo className={className} />;
  if (normalized.includes("xampp")) return <XamppLogo className={className} />;

  // 9. APIs & Fallback
  if (normalized.includes("rest") || normalized.includes("api")) return <RestApiLogo className={className} />;

  // Fallback icon for any custom tag: clean monogram badge (no ugly </> Code2)
  return <TechIcon name={name} iconClassName={className} />;
}

// Reusable Tech Badge with Logo
export function TechBadge({
  name,
  className = "",
  iconClassName = "w-3.5 h-3.5",
  showLabel = true,
}: {
  name: string;
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
}) {
  const logo = getTechLogo(name, iconClassName);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 ${className}`}
      title={name}
    >
      <span className="shrink-0 flex items-center justify-center">{logo}</span>
      {showLabel && <span className="truncate">{name}</span>}
    </span>
  );
}
