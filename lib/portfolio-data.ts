import { createPublicClient } from "@/lib/supabase/server";
import {
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_CERTIFICATES,
  DEFAULT_TECH_GROUPS,
  DEFAULT_PROFILE,
  parseAvatarUrl,
  type ProjectItem,
  type ProjectMetric,
  type ArchitectureFlowStep,
  type DatabaseSchemaTable,
  type CodeSnippet,
  type ExperienceItem,
  type CertificateItem,
  type TechGroup,
  type TechItem,
  type ProfileData,
  type ProfileHighlightCard,
} from "./portfolio-defaults";

export * from "./portfolio-defaults";

// ==========================================
// SERVER-SIDE DATA FETCHING WITH SAFE FALLBACK
// ==========================================

export interface ProjectDatabaseRow {
  id?: string;
  slug?: string;
  title?: string;
  role?: string;
  year?: string;
  period?: string;
  subtitle?: string;
  short_summary?: string;
  summary?: string;
  description?: string;
  full_description?: string;
  category?: string;
  thumbnail_url?: string;
  image_url?: string;
  gallery_urls?: string[];
  tech_stacks?: string[];
  tags?: string[];
  live_url?: string;
  demo_url?: string;
  repo_url?: string;
  github_url?: string;
  is_featured?: boolean;
  featured?: boolean;
  display_order?: number;
  order_index?: number;
  metrics?: ProjectMetric[] | unknown;
  featured_span?: string;
  architecture_flow?: ArchitectureFlowStep[] | unknown;
  database_schema?: DatabaseSchemaTable[] | unknown;
  code_snippet?: CodeSnippet | unknown;
  [key: string]: unknown;
}

export function mapProjectRow(item: ProjectDatabaseRow, idx: number = 0): ProjectItem {
  const fallbackItem = DEFAULT_PROJECTS.find(
    (p) => p.slug === item.slug || p.id === item.id || p.id === item.slug
  );

  const slug = item.slug || item.id || `project-${idx + 1}`;
  const title = item.title || fallbackItem?.title || "Untitled Project";
  const role = item.role || item.subtitle || fallbackItem?.role || "Full-stack Developer";
  const year =
    (typeof item.year === "string" ? item.year : "") ||
    (typeof item.period === "string" ? item.period : "") ||
    fallbackItem?.year ||
    fallbackItem?.period ||
    "";

  const short_summary =
    item.short_summary ||
    item.summary ||
    (item.description ? item.description.slice(0, 180) : "") ||
    fallbackItem?.short_summary ||
    "";

  const full_description =
    item.full_description ||
    item.description ||
    fallbackItem?.full_description ||
    short_summary;

  const thumbnail_url =
    item.thumbnail_url ||
    item.image_url ||
    fallbackItem?.thumbnail_url ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop";

  const gallery_urls = Array.isArray(item.gallery_urls) && item.gallery_urls.length > 0
    ? item.gallery_urls
    : (fallbackItem?.gallery_urls || [thumbnail_url]);

  const tech_stacks = Array.isArray(item.tech_stacks) && item.tech_stacks.length > 0
    ? item.tech_stacks
    : (Array.isArray(item.tags) && item.tags.length > 0
      ? item.tags
      : (fallbackItem?.tech_stacks || ["Next.js", "TypeScript", "Tailwind CSS"]));

  const live_url = item.live_url || item.demo_url || fallbackItem?.live_url || "";
  const repo_url = item.repo_url || item.github_url || fallbackItem?.repo_url || "";
  const is_featured = Boolean(item.is_featured ?? item.featured ?? fallbackItem?.is_featured ?? false);
  const display_order = Number(item.display_order ?? item.order_index ?? idx + 1);

  return {
    id: item.id || slug,
    slug,
    title,
    role,
    year,
    period: year,
    short_summary,
    full_description,
    thumbnail_url,
    gallery_urls,
    tech_stacks,
    live_url,
    repo_url,
    is_featured,
    display_order,

    // Backward-compatible properties
    subtitle: role,
    description: full_description,
    summary: short_summary,
    category: item.category || fallbackItem?.category || "fullstack",
    techStack: tech_stacks,
    metrics: (item.metrics as ProjectMetric[]) || fallbackItem?.metrics || [],
    github: repo_url,
    demo: live_url,
    thumbnailUrl: thumbnail_url,
    featuredSpan: item.featured_span || fallbackItem?.featuredSpan || "lg:col-span-6",
    architectureFlow:
      (item.architecture_flow as ArchitectureFlowStep[]) || fallbackItem?.architectureFlow || [],
    databaseSchema:
      (item.database_schema as DatabaseSchemaTable[]) || fallbackItem?.databaseSchema || [],
    codeSnippet: (item.code_snippet as CodeSnippet) || fallbackItem?.codeSnippet || {
      language: "typescript",
      filename: "snippet.ts",
      code: "// Project source code available on GitHub",
    },
  };
}

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[getProjects] Supabase returned an error, using default projects:", error.message);
      return DEFAULT_PROJECTS;
    }

    if (!data || data.length === 0) {
      return DEFAULT_PROJECTS;
    }

    return (data as ProjectDatabaseRow[]).map((item, idx) => mapProjectRow(item, idx));
  } catch (err) {
    console.error("[getProjects] Failed to fetch projects from database:", err);
    return DEFAULT_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    const supabase = createPublicClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);

    const query = supabase.from("projects").select("*");
    const { data, error } = await (isUuid
      ? query.or(`slug.eq.${slug},id.eq.${slug}`).maybeSingle()
      : query.eq("slug", slug).maybeSingle()
    );

    if (error) {
      console.warn(`[getProjectBySlug] Could not find project '${slug}' or query failed:`, error.message);
    } else if (data) {
      return mapProjectRow(data as ProjectDatabaseRow, 0);
    }
  } catch (err) {
    console.error(`[getProjectBySlug] Unexpected error fetching project '${slug}':`, err);
  }

  // Fallback to static data
  const fallback = DEFAULT_PROJECTS.find(
    (p) => p.slug === slug || p.id === slug
  );
  return fallback || null;
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[getExperiences] Supabase query returned an error, using fallback:", error.message);
      return DEFAULT_EXPERIENCES;
    }

    if (!data || data.length === 0) {
      return DEFAULT_EXPERIENCES;
    }

    return data.map((item) => {
      const fallbackItem = DEFAULT_EXPERIENCES.find(
        (e) =>
          (e.company.toLowerCase().includes("maxxima") &&
            (item.company || "").toLowerCase().includes("maxxima")) ||
          (e.company.toLowerCase().includes("sundaya") &&
            (item.company || "").toLowerCase().includes("sundaya"))
      );

      const resolvedPhotos =
        Array.isArray(item.photos) && item.photos.length > 0
          ? item.photos
          : Array.isArray(item.gallery_urls) && item.gallery_urls.length > 0
          ? item.gallery_urls
          : Array.isArray(item.photo_urls) && item.photo_urls.length > 0
          ? item.photo_urls
          : (fallbackItem?.photos || []);

      return {
        id: item.id,
        company: item.company,
        role: item.role,
        duration: item.duration,
        status: item.status || "Active",
        type: item.type || "Industry",
        highlights: item.highlights || "",
        deliverables: item.deliverables || [],
        technologies: item.technologies || [],
        metrics:
          (Array.isArray(item.metrics) && item.metrics.length > 0
            ? (item.metrics as { label: string; value: string }[])
            : fallbackItem?.metrics) || [],
        photos: resolvedPhotos,
      };
    });
  } catch (err) {
    console.error("[getExperiences] Unexpected failure fetching experiences:", err);
    return DEFAULT_EXPERIENCES;
  }
}

export async function getCertificates(): Promise<CertificateItem[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[getCertificates] Supabase query returned an error, using fallback:", error.message);
      return DEFAULT_CERTIFICATES;
    }

    if (!data || data.length === 0) {
      return DEFAULT_CERTIFICATES;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      credentialUrl: item.credential_url || "",
      credentialId: item.credential_id || "",
      imageUrl: item.image_url || undefined,
      skillsVerified: item.skills_verified || [],
      expirationDate: item.expiration_date || item.valid_until || "",
      isNoExpiration: Boolean(item.is_no_expiration ?? !(item.expiration_date || item.valid_until)),
    }));
  } catch (err) {
    console.error("[getCertificates] Unexpected failure fetching certificates:", err);
    return DEFAULT_CERTIFICATES;
  }
}

export async function getTechStacks(): Promise<TechGroup[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("tech_stacks")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("[getTechStacks] Supabase query returned an error, using fallback:", error.message);
      return DEFAULT_TECH_GROUPS;
    }

    if (!data || data.length === 0) {
      return DEFAULT_TECH_GROUPS;
    }

    const groupedMap: Record<string, TechItem[]> = {};
    data.forEach((item) => {
      const cat = item.category || "General";
      if (!groupedMap[cat]) {
        groupedMap[cat] = [];
      }
      groupedMap[cat].push({
        name: item.name,
        proficiency: item.proficiency || "Proficient",
      });
    });

    return Object.entries(groupedMap).map(([category, items]) => ({
      category,
      items,
    }));
  } catch (err) {
    console.error("[getTechStacks] Unexpected failure fetching tech stacks:", err);
    return DEFAULT_TECH_GROUPS;
  }
}

export async function getProfile(): Promise<ProfileData> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .maybeSingle();

    if (error) {
      console.warn("[getProfile] Supabase query returned an error, using fallback:", error.message);
      return DEFAULT_PROFILE;
    }

    if (!data) {
      return DEFAULT_PROFILE;
    }

    const avatarConfig = parseAvatarUrl(data.avatar_url);
    const position = data.avatar_position || avatarConfig.position || DEFAULT_PROFILE.avatar_position || "55% 20%";
    const scale = typeof data.avatar_scale === "number" ? data.avatar_scale : (avatarConfig.scale ?? DEFAULT_PROFILE.avatar_scale ?? 100);
    const offsetY = typeof data.avatar_offset_y === "number" ? data.avatar_offset_y : (avatarConfig.offsetY ?? DEFAULT_PROFILE.avatar_offset_y ?? 0);
    const offsetX = typeof data.avatar_offset_x === "number" ? data.avatar_offset_x : (avatarConfig.offsetX ?? DEFAULT_PROFILE.avatar_offset_x ?? 0);
    const opacity = typeof data.avatar_opacity === "number" ? data.avatar_opacity : (avatarConfig.opacity ?? DEFAULT_PROFILE.avatar_opacity ?? 45);

    return {
      id: data.id || DEFAULT_PROFILE.id,
      name: data.name || DEFAULT_PROFILE.name,
      role: data.role || DEFAULT_PROFILE.role,
      tagline: data.tagline || DEFAULT_PROFILE.tagline,
      avatar_url: data.avatar_url || DEFAULT_PROFILE.avatar_url,
      avatar_position: position,
      avatar_scale: scale,
      avatar_offset_y: offsetY,
      avatar_offset_x: offsetX,
      avatar_opacity: opacity,
      status_badge: data.status_badge || DEFAULT_PROFILE.status_badge,
      is_available: typeof data.is_available === "boolean" ? data.is_available : DEFAULT_PROFILE.is_available,
      cta_primary_text: data.cta_primary_text || DEFAULT_PROFILE.cta_primary_text,
      cta_primary_url: data.cta_primary_url || DEFAULT_PROFILE.cta_primary_url,
      cta_cv_text: data.cta_cv_text || DEFAULT_PROFILE.cta_cv_text,
      cta_cv_url: data.cta_cv_url || DEFAULT_PROFILE.cta_cv_url,
      cta_contact_text: data.cta_contact_text || DEFAULT_PROFILE.cta_contact_text,
      cta_contact_url: data.cta_contact_url || DEFAULT_PROFILE.cta_contact_url,
      github_url: data.github_url || DEFAULT_PROFILE.github_url,
      linkedin_url: data.linkedin_url || DEFAULT_PROFILE.linkedin_url,
      whatsapp_url: data.whatsapp_url || DEFAULT_PROFILE.whatsapp_url,
      email: data.email || DEFAULT_PROFILE.email,
      highlights: Array.isArray(data.highlights) && data.highlights.length > 0
        ? (data.highlights as ProfileHighlightCard[])
        : DEFAULT_PROFILE.highlights,
    };
  } catch (err) {
    console.error("[getProfile] Unexpected failure fetching profile:", err);
    return DEFAULT_PROFILE;
  }
}
