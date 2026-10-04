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
    "Lulusan S1 Sistem Informasi dari Universitas Telkom (menunggu wisuda) dengan fokus pada pengembangan web dan sistem secara full-stack. Berpengalaman membangun aplikasi berbasis web, mencakup pengembangan frontend dan backend, manajemen basis data, integrasi REST API, serta perancangan sistem. Memiliki pengalaman tambahan dalam pengembangan machine learning menggunakan Python dan Scikit-learn.",
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
      "Merancang platform pemesanan (booking) berbasis web yang responsif menggunakan Figma, menerjemahkan kebutuhan stakeholder menjadi user flow, wireframe, antarmuka high-fidelity, dan prototipe interaktif.",
    deliverables: [
      "Merancang platform pemesanan (booking) berbasis web yang responsif menggunakan Figma, menerjemahkan kebutuhan stakeholder menjadi user flow, wireframe, antarmuka high-fidelity, dan prototipe interaktif.",
      "Berkolaborasi dengan stakeholder untuk menentukan alur pemesanan dan struktur halaman, serta melakukan iterasi desain berdasarkan masukan untuk meningkatkan usability dan pengalaman pengguna.",
      "Menyiapkan design handoff untuk developer dan berkontribusi pada implementasi frontend menggunakan JavaScript dan Tailwind CSS, menjembatani desain UI/UX dengan antarmuka yang diimplementasikan.",
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
      { label: "Lokasi", value: "Baturraden, Indonesia" },
      { label: "Periode", value: "Jan – Jun 2025" },
      { label: "Fokus Proyek", value: "Web Booking Platform" },
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
      "Sistem Informasi & Layanan Sewa Lokasi",
      "Hak Kekayaan Intelektual (HKI)",
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
      "Pengembangan Web (CWDev)",
      "Rekayasa Perangkat Lunak",
      "Standar Kompetensi Kerja Nasional Indonesia (SKKNI)",
    ],
  },
  {
    title: "Medali Perunggu – Lomba Karya Tulis Ilmiah",
    issuer: "Jambi Accounting Competition Seminar Nasional (JACSen) 2024",
    date: "Feb 2024",
    credentialId: "JACSEN-2024",
    credentialUrl: "",
    skillsVerified: [
      "Karya Tulis Ilmiah",
      "Penelitian & Analisis Data",
    ],
  },
  {
    title: "Asisten Programmer Komputer — KKNI Level II Bidang Keahlian Rekayasa Perangkat Lunak",
    issuer: "LSP SMK Negeri 1 Purwokerto, BNSP",
    date: "Mei 2022",
    credentialId: "BNSP-RPL-2022",
    credentialUrl: "https://bnsp.go.id",
    skillsVerified: [
      "Pemrograman Komputer",
      "Rekayasa Perangkat Lunak (RPL)",
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
    title: "DILAYAKIN — Sistem Evaluasi Kelayakan Calon Siswa Berbasis Web",
    role: "Full-Stack Developer | Proyek Tugas Akhir",
    year: "2025 – 2026",
    short_summary:
      "Sistem pendukung keputusan berbasis web secara full-stack untuk penyaringan awal calon siswa sekolah dasar menggunakan React.js, Vite, Express.js, dan MySQL dengan metode Simple Additive Weighting (SAW).",
    full_description: `## Ringkasan Proyek
Proyek Tugas Akhir 2025 – 2026 yang mengimplementasikan sistem pendukung keputusan (SPK) berbasis web untuk penyaringan awal kelayakan calon siswa sekolah dasar. Sistem ini mengintegrasikan metode Simple Additive Weighting (SAW) untuk evaluasi kelayakan dan rekomendasi sekolah yang objektif dan terukur.

## Kebutuhan & Tantangan
- Proses penyaringan calon siswa sebelumnya menghadapi kendala manual dan subjektivitas dalam penilaian kriteria kelayakan.
- Diperlukan platform terpusat yang mampu menangani simulasi kelayakan, manajemen kriteria dinamis, serta memberikan rekomendasi sekolah bagi orang tua dan panitia penerimaan siswa.

## Solusi & Arsitektur
- **Full-Stack SPA**: Dibangun menggunakan React.js dan Vite pada sisi antarmuka, didukung oleh Express.js REST API dan database MySQL.
- **Metode Simple Additive Weighting (SAW)**: Menerapkan algoritma pembobotan kriteria terstandarisasi untuk menghasilkan skor kelayakan dan pemeringkatan rekomendasi sekolah secara otomatis.
- **Role-Based Access Control (RBAC)**: Autentikasi dan kontrol akses multi-peran untuk admin sekolah, evaluator kriteria, dan pendaftar umum.
- **Metodologi RAD (Rapid Application Development)**: Pengembangan iteratif berbasis masukan langsung dari sekolah mitra dan Dinas Pendidikan setempat.

## Pengujian & Hasil
- Pengujian fungsional menyeluruh dengan Black Box Testing.
- Pengujian User Acceptance Testing (UAT) bersama pihak sekolah dan orang tua siswa menghasilkan skor penerimaan sebesar **89,59% (kategori Sangat Layak)**.`,
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

    subtitle: "Sistem Pendukung Keputusan Kelayakan Calon Siswa (Metode SAW)",
    description:
      "Mengembangkan sistem pendukung keputusan berbasis web secara full-stack untuk penyaringan awal calon siswa SD menggunakan React.js, Express.js, dan MySQL dengan metode Simple Additive Weighting (SAW). UAT mencapai 89,59% (Sangat Layak).",
    category: "fullstack",
    techStack: ["React.js", "Vite", "Express.js", "MySQL", "JavaScript", "REST API", "Tailwind CSS"],
    github: "https://github.com/harsatri",
    demo: "https://github.com/harsatri",
    thumbnailUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    featuredSpan: "lg:col-span-12",
    metrics: [
      { label: "UAT Acceptance", value: "89,59% (Sangat Layak)" },
      { label: "Metode SPK", value: "Simple Additive Weighting" },
      { label: "Metodologi", value: "Rapid Application Dev" },
      { label: "Arsitektur", value: "Full-Stack React & Express" },
    ],
    architectureFlow: [
      { step: "Requirements Analysis", detail: "Pengembangan iteratif bersama sekolah mitra dan Dinas Pendidikan setempat" },
      { step: "Kriteria & Pembobotan", detail: "Formulasi bobot kriteria kelayakan berbasis metode SAW" },
      { step: "Full-Stack Implementation", detail: "REST API Express.js terintegrasi dengan frontend React.js dan database MySQL" },
      { step: "Black Box & UAT Testing", detail: "Validasi fungsional dan pengujian penerimaan pengguna dengan hasil 89,59%" },
    ],
  },
  {
    id: "panpin-shoe-treatment",
    slug: "panpin-shoe-treatment",
    title: "Panpin Shoe Treatment — Sistem Kasir & Manajemen Bisnis Berbasis Web",
    role: "Full-Stack Developer | Proyek Capstone",
    year: "2025",
    short_summary:
      "Sistem kasir dan manajemen bisnis berbasis web untuk mendigitalisasi proses transaksi, manajemen layanan, pelaporan keuangan, dan otomasi notifikasi Telegram Bot.",
    full_description: `## Ringkasan Proyek
Proyek Capstone 2025 yang bertujuan mendigitalisasi seluruh operasional Panpin Shoe Treatment, menggantikan pencatatan manual berbasis kertas menuju sistem manajemen kasir (POS) dan operasional terintegrasi.

## Masalah & Kebutuhan Bisnis
- Pencatatan transaksi dan antrean sepatu masih manual sehingga rentan terjadi kesalahan input dan kehilangan riwayat layanan.
- Pelaporan keuangan harian dan bulanan memakan waktu rekapitulasi yang lama.
- Pelanggan dan kasir membutuhkan update status pengerjaan yang cepat dan transparan.

## Solusi & Arsitektur
- **Full-Stack Laravel & MariaDB**: Sistem backend tangguh dengan kontrol akses berbasis peran (Admin/Owner, Kasir, Pengguna Operasional).
- **Modul Transaksi & Layanan Lengkap**: Pencatatan order, status pengerjaan sepatu, invoice digital, dan rekapitulasi keuangan otomatis.
- **Otomasi Telegram Bot & n8n**: Integrasi webhook untuk mengirimkan notifikasi transaksi dan progres layanan secara langsung dan real-time.
- **Evaluasi Usability**: Pengujian System Usability Scale (SUS) bersama pemilik usaha dan kasir, memperoleh skor evaluasi 65 dan 72,5.`,
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

    subtitle: "Sistem Kasir & Manajemen Bisnis Terintegrasi Telegram Bot",
    description:
      "Mengembangkan sistem kasir dan manajemen bisnis berbasis web menggunakan Laravel dan MariaDB dengan notifikasi real-time Telegram Bot via n8n serta kontrol akses multi-peran.",
    category: "laravel",
    techStack: ["Laravel", "PHP", "MariaDB", "Telegram Bot API", "n8n", "JavaScript"],
    github: "https://github.com/harsatri",
    demo: "https://github.com/harsatri",
    thumbnailUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
    featuredSpan: "lg:col-span-12",
    metrics: [
      { label: "Skor SUS", value: "65 & 72,5 (Usability)" },
      { label: "Otomasi", value: "Telegram Bot & n8n" },
      { label: "Kontrol Akses", value: "Role-Based Multi-User" },
      { label: "Modul Inti", value: "Kasir & Laporan Keuangan" },
    ],
    architectureFlow: [
      { step: "Analisis Kebutuhan", detail: "Pemetaan proses manual kasir dan pelaporan Panpin Shoe Treatment" },
      { step: "Perancangan Basis Data", detail: "Normalisasi tabel transaksi, layanan, pelanggan, dan audit keuangan pada MariaDB" },
      { step: "Pengembangan Laravel", detail: "Implementasi MVC architecture, RBAC, dan modul kasir intuitif" },
      { step: "Integrasi Bot & n8n", detail: "Pengiriman notifikasi otomatis perubahan status layanan ke Telegram" },
    ],
  },
  {
    id: "skincare-product-catalog",
    slug: "skincare-product-catalog",
    title: "Skincare Product Catalog — Katalog Produk Skincare Berbasis Web",
    role: "Full-Stack Developer | Proyek Pribadi",
    year: "2024",
    short_summary:
      "Katalog produk skincare berbasis web untuk menampilkan produk, harga, deskripsi, dan detail produk melalui antarmuka yang bersih dan responsif.",
    full_description: `## Ringkasan Proyek
Proyek web katalog produk personal bertema skincare yang dibangun untuk memamerkan katalog produk kecantikan dengan tampilan elegan, navigasi cepat, dan integrasi basis data dinamis.

## Fitur Utama
- **Katalog Produk Dinamis**: Menampilkan daftar produk dengan filter kategori, harga, status ketersediaan, dan detail spesifikasi produk.
- **Antarmuka Responsif & Estetis**: Desain visual bersih dan modern dengan kartu produk terstruktur dan tata letak intuitif yang nyaman di perangkat mobile maupun desktop.
- **Integrasi Basis Data**: Didukung backend Laravel dan MySQL untuk pengelolaan data produk yang terstruktur dan mudah diperbarui.`,
    thumbnail_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    gallery_urls: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    ],
    tech_stacks: ["Laravel", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    live_url: "https://github.com/harsatri",
    repo_url: "https://github.com/harsatri",
    is_featured: false,
    display_order: 3,

    subtitle: "Katalog Produk Skincare Dinamis & Responsif",
    description:
      "Website katalog produk bertema skincare berbasis Laravel dan MySQL yang menampilkan produk, harga, deskripsi, dan galeri visual yang terstruktur rapi.",
    category: "laravel",
    techStack: ["Laravel", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/harsatri",
    demo: "https://github.com/harsatri",
    thumbnailUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    featuredSpan: "lg:col-span-6",
    metrics: [
      { label: "Tipe Proyek", value: "Proyek Pribadi" },
      { label: "Teknologi", value: "Laravel & MySQL" },
      { label: "Desain", value: "Clean & Responsive UI" },
      { label: "Konten", value: "Katalog Produk Dinamis" },
    ],
  },
  {
    id: "stroke-risk-prediction",
    slug: "stroke-risk-prediction",
    title: "Stroke Risk Prediction — Machine Learning & Dashboard Interaktif",
    role: "Data Science / Machine Learning Developer | Proyek Akademik",
    year: "2024",
    short_summary:
      "Sistem klasifikasi machine learning berbasis Naive Bayes untuk memprediksi potensi risiko stroke dengan dashboard Streamlit interaktif secara real-time.",
    full_description: `## Ringkasan Proyek
Proyek Akademik 2024 yang mengembangkan model klasifikasi machine learning untuk memprediksi risiko penyakit stroke pada pasien berdasarkan karakteristik klinis dan demografis.

## Alur Pengembangan Model
- **Preprocessing Data**: Encoding fitur kategorikal, imputasi missing values, pembagian dataset train-test split, dan penyiapan fitur numerik terstandarisasi.
- **Pemodelan Naive Bayes & Tuning**: Pembangunan model klasifikasi Naive Bayes yang dilanjutkan dengan hyperparameter tuning untuk memaksimalkan metrik evaluasi.
- **Evaluasi Metrik**: Analisis komparatif performa sebelum dan sesudah tuning menggunakan Confusion Matrix, Precision, Recall, dan F1-Score.
- **Dashboard Streamlit Interaktif**: Antarmuka web ramah pengguna yang memungkinkan input data klinis pasien baru secara instan, menampilkan prediksi probabilitas risiko stroke secara real-time, serta visualisasi eksplorasi dataset dengan Matplotlib dan Seaborn.`,
    thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    gallery_urls: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    ],
    tech_stacks: ["Python", "Pandas", "NumPy", "Scikit-learn", "Naive Bayes", "Streamlit", "Matplotlib", "Seaborn"],
    live_url: "https://github.com/harsatri",
    repo_url: "https://github.com/harsatri",
    is_featured: false,
    display_order: 4,

    subtitle: "Prediksi Risiko Stroke Berbasis Algoritma Naive Bayes & Streamlit",
    description:
      "Mengembangkan pipeline machine learning Naive Bayes dengan hyperparameter tuning untuk prediksi risiko stroke, dilengkapi dashboard interaktif real-time menggunakan Streamlit.",
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
