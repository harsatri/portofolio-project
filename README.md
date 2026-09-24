# 🚀 Harsa Tri Novenda — Personal Portfolio

Portfolio pribadi yang dibangun dengan **Next.js 16**, **React 19**, **TypeScript**, dan **Tailwind CSS**, terintegrasi dengan **Supabase** untuk manajemen data dan **Vercel Analytics** untuk monitoring.

---

## 👤 About

**Harsa Tri Novenda**
Fresh Graduate S1 Sistem Informasi, Universitas Telkom — dengan fokus pada **Frontend & Full-Stack Web Development**.

- 🔗 GitHub: [@harsatri](https://github.com/harsatri)
- 💼 LinkedIn: [harsa-tri-novenda](https://linkedin.com/in/harsa-tri-novenda)

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React.js, Next.js, JavaScript, TypeScript, Tailwind CSS |
| **Backend** | Laravel, PHP, Node.js, Express.js |
| **Database** | MySQL, PostgreSQL |
| **Data / ML** | Python, Scikit-learn |
| **Tools** | Git, GitHub, Figma |

---

## 📁 Featured Projects

| Project | Deskripsi |
|---|---|
| **DILAYAKAN** | Aplikasi web full-stack |
| **Panpin Shoe Treatment** | Platform layanan perawatan sepatu |
| **Skincare Product Catalog** | Katalog produk skincare berbasis web |
| **Stroke Risk Prediction** | Prediksi risiko stroke menggunakan machine learning (Python, Scikit-learn) |

---

## 💼 Experience

**UI/UX Design Intern** — BLUD UPT Lokawisata Baturraden

---

## ✨ Fitur Portfolio

- **Hero & Profile** — Branding personal dan kontak cepat
- **Tech Stack & Skills** — Keahlian teknis terkategorisasi dengan ikon brand
- **Featured Projects** — Filter kategori dan tampilan detail project
- **Project Detail (`/projects/[slug]`)** — Case study dengan Markdown, galeri screenshot
- **Work Experience** — Timeline karier dan pencapaian
- **Certificates** — Sertifikasi dan kredensial profesional
- **Admin CMS (`/admin`)** — Dashboard manajemen konten real-time, upload media, dan analytics

---

## ⚙️ Environment Variables

Buat file `.env.local` di root direktori:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
REVALIDATION_SECRET=your_revalidation_secret_token
NEXT_PUBLIC_REVALIDATION_SECRET=your_revalidation_secret_token
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

```bash
# Build untuk production
npm run build
npm run start
```

---

## 📂 Struktur Project

```
portofolio-project/
├── app/
│   ├── admin/               # CMS Dashboard & CRUD pages
│   ├── api/                 # Endpoint analytics & revalidasi
│   ├── projects/[slug]/     # Halaman detail project (SSG/ISR)
│   └── page.tsx             # Landing page utama
├── components/
│   ├── sections/            # Seksi portfolio (Hero, Projects, dll.)
│   └── ui/                  # Komponen UI reusable
├── lib/
│   ├── supabase/            # Supabase client & server instances
│   └── portfolio-data.ts    # Data fetching layer
└── public/                  # Aset statis
```

---

*Built with ❤️ by Harsa Tri Novenda*
