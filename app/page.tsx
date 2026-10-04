import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import TechStack from "@/components/sections/TechStack";
import Certificates from "@/components/sections/Certificates";
import Contact from "@/components/sections/Contact";
import {
  getProjects,
  getExperiences,
  getCertificates,
  getTechStacks,
  getProfile,
} from "@/lib/portfolio-data";

// Selalu render data dinamis terbaru secara real-time dari database CMS
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [profile, projects, experiences, certificates, techGroups] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperiences(),
    getCertificates(),
    getTechStacks(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/40 selection:text-foreground dark:selection:bg-accent/30 dark:selection:text-foreground transition-colors duration-300">
      <Navbar />
      <Hero initialProfile={profile} />
      <About />
      <Experience initialExperiences={experiences} />
      <Projects initialProjects={projects} />
      <TechStack initialTechGroups={techGroups} />
      <Certificates initialCertificates={certificates} />
      <Contact initialProfile={profile} />
      <Footer initialProfile={profile} />
    </main>
  );
}