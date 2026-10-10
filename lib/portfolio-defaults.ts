export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ArchitectureFlowStep {
  step: string;
  detail: string;
}

export interface DatabaseSchemaTable {
  table: string;
  fields: string[];
}

export interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  role: string;
  year?: string;
  period?: string;
  short_summary: string;
  full_description: string;
  thumbnail_url: string;
  gallery_urls: string[];
  tech_stacks: string[];
  live_url?: string;
  repo_url?: string;
  is_featured: boolean;
  display_order: number;

  // Backward-compatible properties
  subtitle?: string;
  description?: string;
  summary?: string;
  category?: "all" | "machine-learning" | "laravel" | "fullstack" | string;
  techStack?: string[];
  metrics?: ProjectMetric[];
  github?: string;
  demo?: string;
  thumbnailUrl?: string;
  featuredSpan?: string;
  architectureFlow?: ArchitectureFlowStep[];
  databaseSchema?: DatabaseSchemaTable[];
  codeSnippet?: CodeSnippet;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  duration: string;
  status: "Active" | "Completed";
  type: "Industry" | "Internship" | "Organization";
  highlights: string;
  deliverables: string[];
  technologies: string[];
  metrics?: { label: string; value: string }[];
  photos?: string[];
}

export interface CertificateItem {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  credentialId?: string;
  imageUrl?: string;
  skillsVerified: string[];
  expirationDate?: string;
  isNoExpiration?: boolean;
}

export interface TechItem {
  name: string;
  proficiency: "Advanced" | "Proficient";
}

export interface TechGroup {
  category: string;
  items: TechItem[];
}

export interface ProfileHighlightCard {
  label: string;
  title: string;
  subtitle: string;
  icon?: "briefcase" | "layers" | "database" | string;
}

export interface ProfileData {
  id?: string;
  name: string;
  role: string;
  tagline: string;
  avatar_url: string;
  avatar_position?: string;
  avatar_scale?: number;
  avatar_offset_y?: number;
  avatar_offset_x?: number;
  avatar_opacity?: number;
  status_badge: string;
  is_available: boolean;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_cv_text: string;
  cta_cv_url: string;
  cta_contact_text: string;
  cta_contact_url: string;
  github_url: string;
  linkedin_url: string;
  whatsapp_url: string;
  phone?: string;
  email: string;
  highlights: ProfileHighlightCard[];
}

export function parseAvatarUrl(url?: string): {
  cleanUrl: string;
  position?: string;
  scale?: number;
  offsetY?: number;
  offsetX?: number;
  opacity?: number;
} {
  const raw = url || "/profile.jpg";
  if (!raw.includes("?") && !raw.includes("#")) {
    return { cleanUrl: raw };
  }

  try {
    const [base, query] = raw.split(/[?#]/);
    const params = new URLSearchParams(query);
    const result: {
      cleanUrl: string;
      position?: string;
      scale?: number;
      offsetY?: number;
      offsetX?: number;
      opacity?: number;
    } = { cleanUrl: base || "/profile.jpg" };

    if (params.has("pos")) result.position = params.get("pos") || undefined;
    if (params.has("scale")) result.scale = Number(params.get("scale")) || undefined;
    if (params.has("y")) result.offsetY = Number(params.get("y")) || undefined;
    if (params.has("x")) result.offsetX = Number(params.get("x")) || undefined;
    if (params.has("op")) result.opacity = Number(params.get("op")) || undefined;
    return result;
  } catch {
    return { cleanUrl: raw };
  }
}

export function buildAvatarUrl(
  baseCleanUrl: string,
  config: { position?: string; scale?: number; offsetY?: number; offsetX?: number; opacity?: number }
): string {
  const clean = (baseCleanUrl || "/profile.jpg").split(/[?#]/)[0];
  const params = new URLSearchParams();
  if (config.position && config.position !== "55% 20%") params.set("pos", config.position);
  if (typeof config.scale === "number" && config.scale !== 100) params.set("scale", String(config.scale));
  if (typeof config.offsetY === "number" && config.offsetY !== 0) params.set("y", String(config.offsetY));
  if (typeof config.offsetX === "number" && config.offsetX !== 0) params.set("x", String(config.offsetX));
  if (typeof config.opacity === "number" && config.opacity !== 45) params.set("op", String(config.opacity));

  const qs = params.toString();
  return qs ? `${clean}?${qs}` : clean;
}

export const DEFAULT_PROFILE: ProfileData = {
  id: "main",
  name: "Harsa Tri Novenda",
  role: "Full-Stack Web Developer",
  tagline:
    "Information Systems graduate from Telkom University (awaiting graduation) focusing on full-stack web and system development. Experienced in building web-based applications, including frontend and backend development, database management, REST API integration, and system design. Has additional experience in machine learning development using Python and Scikit-learn.",
  avatar_url: "/hero-cutout.png",
  avatar_position: "55% 20%",
  avatar_scale: 100,
  avatar_offset_y: 0,
  avatar_offset_x: 0,
  avatar_opacity: 45,
  status_badge: "Open to Work • Fresh Graduate",
  is_available: true,
  cta_primary_text: "Explore Projects",
  cta_primary_url: "#projects",
  cta_cv_text: "Download CV",
  cta_cv_url: "/cv.pdf",
  cta_contact_text: "Contact Me",
  cta_contact_url: "#contact",
  github_url: "https://github.com/harsatri",
  linkedin_url: "https://linkedin.com/in/harsa-tri-novenda",
  whatsapp_url: "https://wa.me/6285175210941",
  email: "harsatn.work@gmail.com",
  highlights: [
    {
      label: "EDUCATION",
      title: "S1 Sistem Informasi",
      subtitle: "Telkom University (IPK 3.84)",
      icon: "briefcase",
    },
    {
      label: "CORE SPECIALTIES",
      title: "React.js & Laravel",
      subtitle: "Frontend & Full-Stack",
      icon: "layers",
    },
    {
      label: "DATABASE & ML",
      title: "MySQL & Python",
      subtitle: "REST API & Scikit-learn",
      icon: "database",
    },
  ],
};


export const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    company: "BLUD UPT Lokawisata Baturraden",
    role: "UI/UX Intern",
    duration: "Jan 2025 – Jun 2025",
    status: "Completed",
    type: "Internship",
    highlights:
      "Designed a responsive web-based booking platform using Figma, translating stakeholder requirements into user flows, wireframes, high-fidelity interfaces, and interactive prototypes.",
    deliverables: [
      "Designed a responsive web-based booking platform using Figma, translating stakeholder requirements into user flows, wireframes, high-fidelity interfaces, and interactive prototypes.",
      "Collaborated with stakeholders to define booking flows and page structures, and iterated designs based on feedback to improve usability and user experience.",
      "Prepared design handoffs for developers and contributed to frontend implementation using JavaScript and Tailwind CSS, bridging UI/UX design with the implemented interface.",
    ],
    technologies: [
      "Figma",
      "UI/UX Design",
      "Wireframing",
      "Prototyping",
      "JavaScript",
      "Tailwind CSS",
      "User Flow",
    ],
    metrics: [
      { label: "Location", value: "Baturraden, Indonesia" },
      { label: "Period", value: "Jan – Jun 2025" },
      { label: "Project Focus", value: "Web Booking Platform" },
    ],
    photos: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    ],
  },
];

export const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    title: "Surat Pencatatan Ciptaan (HKI) — Sistem Informasi & Layanan Sewa Lokasi \"MyBludvenue\" untuk BLUD Lokawisata Baturraden",
    issuer: "Direktorat Jenderal Kekayaan Intelektual, Kementerian Hukum RI",
    date: "Nov 2025",
    credentialId: "001026584",
    credentialUrl: "",
    skillsVerified: [
      "Information Systems & Location Rental Services",
      "Intellectual Property Rights (IPR)",
      "BLUD Lokawisata Baturraden",
    ],
  },
  {
    title: "Certified Web Developer (CWDev)",
    issuer: "Lembaga Sertifikasi Profesi Informatika (LSP Informatika), BNSP",
    date: "Jun 2026",
    credentialId: "BNSP-CWDEV",
    credentialUrl: "https://bnsp.go.id",
    skillsVerified: [
      "Web Development (CWDev)",
      "Software Engineering",
      "Indonesian National Work Competency Standards (SKKNI)",
    ],
  },
  {
    title: "Medali Perunggu – Lomba Karya Tulis Ilmiah",
    issuer: "Jambi Accounting Competition Seminar Nasional (JACSen) 2024",
    date: "Feb 2024",
    credentialId: "JACSEN-2024",
    credentialUrl: "",
    skillsVerified: [
      "Scientific Writing",
      "Research & Data Analysis",
    ],
  },
  {
    title: "Asisten Programmer Komputer — KKNI Level II Bidang Keahlian Rekayasa Perangkat Lunak",
    issuer: "LSP SMK Negeri 1 Purwokerto, BNSP",
    date: "May 2022",
    credentialId: "BNSP-RPL-2022",
    credentialUrl: "https://bnsp.go.id",
    skillsVerified: [
      "Computer Programming",
      "Software Engineering (RPL)",
      "KKNI Level II",
    ],
  },
];

export const DEFAULT_TECH_GROUPS: TechGroup[] = [
  {
    category: "Frontend Development",
    items: [
      { name: "React.js", proficiency: "Advanced" },
      { name: "Next.js", proficiency: "Advanced" },
      { name: "JavaScript", proficiency: "Advanced" },
      { name: "TypeScript", proficiency: "Advanced" },
      { name: "Tailwind CSS", proficiency: "Advanced" },
      { name: "HTML & CSS", proficiency: "Advanced" },
      { name: "Figma", proficiency: "Advanced" },
    ],
  },
  {
    category: "Backend & Systems",
    items: [
      { name: "Laravel", proficiency: "Advanced" },
      { name: "PHP", proficiency: "Advanced" },
      { name: "Node.js", proficiency: "Advanced" },
      { name: "Express.js", proficiency: "Advanced" },
      { name: "REST API", proficiency: "Advanced" },
    ],
  },
  {
    category: "Databases & Storage",
    items: [
      { name: "MySQL", proficiency: "Advanced" },
      { name: "MariaDB", proficiency: "Advanced" },
      { name: "PostgreSQL", proficiency: "Proficient" },
    ],
  },
  {
    category: "AI / Data Science & Tools",
    items: [
      { name: "Python", proficiency: "Advanced" },
      { name: "Scikit-learn", proficiency: "Proficient" },
      { name: "Pandas", proficiency: "Proficient" },
      { name: "NumPy", proficiency: "Proficient" },
      { name: "Machine Learning", proficiency: "Proficient" },
      { name: "Git", proficiency: "Advanced" },
      { name: "GitHub", proficiency: "Advanced" },
      { name: "Postman", proficiency: "Advanced" },
      { name: "Streamlit", proficiency: "Proficient" },
    ],
  },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "dilayakin-evaluasi-kelayakan",
    slug: "dilayakin-evaluasi-kelayakan",
    title: "DILAYAKIN — Web-Based Prospective Student Eligibility Evaluation System",
    role: "Full-Stack Developer | Final Project",
    year: "2025 – 2026",
    short_summary:
      "A full-stack web-based decision support system for the initial screening of prospective elementary school students using React.js, Vite, Express.js, and MySQL with the Simple Additive Weighting (SAW) method.",
    full_description: `## Project Summary
Final Project 2025 – 2026 implementing a web-based decision support system (DSS) for the initial eligibility screening of prospective elementary school students. This system integrates the Simple Additive Weighting (SAW) method for objective and measurable eligibility evaluation and school recommendations.

## Requirements & Challenges
- The previous student screening process faced manual constraints and subjectivity in assessing eligibility criteria.
- A centralized platform was needed to handle eligibility simulation, dynamic criteria management, and provide school recommendations for parents and student admission committees.

## Solutions & Architecture
- **Full-Stack SPA**: Built using React.js and Vite on the frontend, supported by Express.js REST API and MySQL database.
- **Simple Additive Weighting (SAW) Method**: Implemented a standardized criteria weighting algorithm to automatically generate eligibility scores and school recommendation rankings.
- **Role-Based Access Control (RBAC)**: Authentication and multi-role access control for school admins, criteria evaluators, and general applicants.
- **RAD (Rapid Application Development) Methodology**: Iterative development based on direct feedback from partner schools and the local Education Office.

## Testing & Results
- Comprehensive functional testing with Black Box Testing.
- User Acceptance Testing (UAT) with school officials and parents yielded an acceptance score of **89.59% (Highly Feasible category)**.`,
    thumbnail_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    gallery_urls: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    ],
    tech_stacks: ["React.js", "Vite", "Express.js", "MySQL", "JavaScript", "REST API", "Tailwind CSS", "SAW", "RAD"],
    live_url: "https://github.com/harsatri",
    repo_url: "https://github.com/harsatri",
    is_featured: true,
    display_order: 1,

    subtitle: "Prospective Student Eligibility Decision Support System (SAW Method)",
    description:
      "Developed a full-stack web-based decision support system for initial elementary school student screening using React.js, Express.js, and MySQL with the Simple Additive Weighting (SAW) method. UAT reached 89.59% (Highly Feasible).",
    category: "fullstack",
    techStack: ["React.js", "Vite", "Express.js", "MySQL", "JavaScript", "REST API", "Tailwind CSS"],
    github: "https://github.com/harsatri",
    demo: "https://github.com/harsatri",
    thumbnailUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    featuredSpan: "lg:col-span-12",
    metrics: [
      { label: "UAT Acceptance", value: "89.59% (Highly Feasible)" },
      { label: "DSS Method", value: "Simple Additive Weighting" },
      { label: "Methodology", value: "Rapid Application Dev" },
      { label: "Architecture", value: "Full-Stack React & Express" },
    ],
    architectureFlow: [
      { step: "Requirements Analysis", detail: "Iterative development with partner schools and local Education Office" },
      { step: "Criteria & Weighting", detail: "Formulation of eligibility criteria weights based on the SAW method" },
      { step: "Full-Stack Implementation", detail: "Express.js REST API integrated with React.js frontend and MySQL database" },
      { step: "Black Box & UAT Testing", detail: "Functional validation and user acceptance testing with 89.59% result" },
    ],
  },
  {
    id: "panpin-shoe-treatment",
    slug: "panpin-shoe-treatment",
    title: "Panpin Shoe Treatment — Web-Based POS & Business Management System",
    role: "Full-Stack Developer | Capstone Project",
    year: "2025",
    short_summary:
      "A web-based point-of-sale and business management system to digitize transaction processes, service management, financial reporting, and automate Telegram Bot notifications.",
    full_description: `## Project Summary
Capstone Project 2025 aimed at digitizing all operations of Panpin Shoe Treatment, transitioning from manual paper-based recording to an integrated POS and operational management system.

## Business Problems & Needs
- Transaction and shoe queue recording were manual, making them prone to input errors and lost service history.
- Daily and monthly financial reporting took a long time to recapitulate.
- Customers and cashiers needed fast and transparent service status updates.

## Solutions & Architecture
- **Full-Stack Laravel & MariaDB**: Robust backend system with role-based access control (Admin/Owner, Cashier, Operational User).
- **Complete Transaction & Service Module**: Order recording, shoe service status, digital invoices, and automatic financial recapitulation.
- **Telegram Bot & n8n Automation**: Webhook integration to send direct and real-time transaction notifications and service progress.
- **Usability Evaluation**: System Usability Scale (SUS) testing with the business owner and cashiers, obtaining evaluation scores of 65 and 72.5.`,
    thumbnail_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
    gallery_urls: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop",
    ],
    tech_stacks: ["Laravel", "PHP", "MariaDB", "MySQL", "Telegram Bot API", "n8n", "HTML", "CSS", "JavaScript"],
    live_url: "https://github.com/harsatri",
    repo_url: "https://github.com/harsatri",
    is_featured: true,
    display_order: 2,

    subtitle: "Integrated POS & Business Management System with Telegram Bot",
    description:
      "Developed a web-based POS and business management system using Laravel and MariaDB with real-time Telegram Bot notifications via n8n and multi-role access control.",
    category: "laravel",
    techStack: ["Laravel", "PHP", "MariaDB", "Telegram Bot API", "n8n", "JavaScript"],
    github: "https://github.com/harsatri",
    demo: "https://github.com/harsatri",
    thumbnailUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
    featuredSpan: "lg:col-span-12",
    metrics: [
      { label: "SUS Score", value: "65 & 72.5 (Usability)" },
      { label: "Automation", value: "Telegram Bot & n8n" },
      { label: "Access Control", value: "Role-Based Multi-User" },
      { label: "Core Modules", value: "POS & Financial Reports" },
    ],
    architectureFlow: [
      { step: "Requirements Analysis", detail: "Mapping manual POS and reporting processes of Panpin Shoe Treatment" },
      { step: "Database Design", detail: "Normalization of transaction, service, customer, and financial audit tables on MariaDB" },
      { step: "Laravel Development", detail: "Implementation of MVC architecture, RBAC, and intuitive POS module" },
      { step: "Bot & n8n Integration", detail: "Automated notification delivery of service status changes to Telegram" },
    ],
  },
  {
    id: "skincare-product-catalog",
    slug: "skincare-product-catalog",
    title: "Skincare Product Catalog — Web-Based Skincare Product Catalog",
    role: "Full-Stack Developer | Personal Project",
    year: "2024",
    short_summary:
      "A web-based skincare product catalog to display products, prices, descriptions, and product details through a clean and responsive interface.",
    full_description: `## Project Summary
A personal web project featuring a skincare-themed product catalog built to showcase beauty products with an elegant appearance, fast navigation, and dynamic database integration.

## Key Features
- **Dynamic Product Catalog**: Displays a list of products with filters for category, price, availability status, and detailed product specifications.
- **Responsive & Aesthetic Interface**: Clean and modern visual design with structured product cards and an intuitive layout comfortable on both mobile and desktop devices.
- **Database Integration**: Supported by a Laravel and MySQL backend for structured and easily updatable product data management.`,
    thumbnail_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    gallery_urls: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    ],
    tech_stacks: ["Laravel", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    live_url: "https://github.com/harsatri",
    repo_url: "https://github.com/harsatri",
    is_featured: false,
    display_order: 3,

    subtitle: "Dynamic & Responsive Skincare Product Catalog",
    description:
      "A skincare-themed product catalog website based on Laravel and MySQL that displays products, prices, descriptions, and neatly structured visual galleries.",
    category: "laravel",
    techStack: ["Laravel", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/harsatri",
    demo: "https://github.com/harsatri",
    thumbnailUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    featuredSpan: "lg:col-span-6",
    metrics: [
      { label: "Project Type", value: "Personal Project" },
      { label: "Technology", value: "Laravel & MySQL" },
      { label: "Design", value: "Clean & Responsive UI" },
      { label: "Content", value: "Dynamic Product Catalog" },
    ],
  },
  {
    id: "stroke-risk-prediction",
    slug: "stroke-risk-prediction",
    title: "Stroke Risk Prediction — Machine Learning & Interactive Dashboard",
    role: "Data Science / Machine Learning Developer | Academic Project",
    year: "2024",
    short_summary:
      "A Naive Bayes-based machine learning classification system to predict potential stroke risks with a real-time interactive Streamlit dashboard.",
    full_description: `## Project Summary
An Academic Project in 2024 that developed a machine learning classification model to predict the risk of stroke in patients based on clinical and demographic characteristics.

## Model Development Workflow
- **Data Preprocessing**: Encoding categorical features, missing value imputation, train-test split dataset division, and preparation of standardized numerical features.
- **Naive Bayes Modeling & Tuning**: Building the Naive Bayes classification model followed by hyperparameter tuning to maximize evaluation metrics.
- **Metric Evaluation**: Comparative performance analysis before and after tuning using Confusion Matrix, Precision, Recall, and F1-Score.
- **Interactive Streamlit Dashboard**: A user-friendly web interface allowing instant clinical data input for new patients, displaying real-time stroke risk probability predictions, and dataset exploration visualization with Matplotlib and Seaborn.`,
    thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    gallery_urls: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    ],
    tech_stacks: ["Python", "Pandas", "NumPy", "Scikit-learn", "Naive Bayes", "Streamlit", "Matplotlib", "Seaborn"],
    live_url: "https://github.com/harsatri",
    repo_url: "https://github.com/harsatri",
    is_featured: false,
    display_order: 4,

    subtitle: "Stroke Risk Prediction Based on Naive Bayes Algorithm & Streamlit",
    description:
      "Developed a Naive Bayes machine learning pipeline with hyperparameter tuning for stroke risk prediction, equipped with a real-time interactive dashboard using Streamlit.",
    category: "machine-learning",
    techStack: ["Python", "Scikit-learn", "Pandas", "NumPy", "Naive Bayes", "Streamlit"],
    github: "https://github.com/harsatri",
    demo: "https://github.com/harsatri",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    featuredSpan: "lg:col-span-6",
    metrics: [
      { label: "Algoritma", value: "Naive Bayes Classification" },
      { label: "Optimasi", value: "Hyperparameter Tuning" },
      { label: "Dashboard", value: "Streamlit Real-Time" },
      { label: "Visualisasi", value: "Matplotlib & Seaborn" },
    ],
  },
];
