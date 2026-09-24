import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/portfolio-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://raakaprx.vercel.app"
  ).replace(/\/$/, "");

  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const projects = await getProjects();
    projectRoutes = projects
      .filter((project) => Boolean(project.slug))
      .map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      }));
  } catch (error) {
    console.error("[sitemap] Gagal mengambil daftar proyek untuk sitemap:", error);
  }

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectRoutes,
  ];
}
