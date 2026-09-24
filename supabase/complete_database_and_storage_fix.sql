-- ==============================================================================
-- MASTER FIX: SUPABASE STORAGE BUCKET, PERMISSIVE RLS, & SCHEMA SYNC
-- File: supabase/complete_database_and_storage_fix.sql
--
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard/project/_/sql)
-- 2. Buka menu 'SQL Editor' di sidebar kiri
-- 3. Salin seluruh isi skrip ini, tempelkan, lalu klik tombol 'Run'
-- 4. Selesai! Upload gambar dan update project akan 100% langsung berhasil.
-- ==============================================================================

-- 0. EKSTENSI UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. SETUP STORAGE BUCKET 'portfolio-assets' (AGAR BISA UPLOAD GAMBAR)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    20971520, -- Maks 20MB
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true, 
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];

-- Hapus policy lama pada storage.objects agar tidak ada konflik
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can delete portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all delete portfolio assets" ON storage.objects;

-- Buat policy Storage yang mengizinkan CMS mengunggah dan membaca gambar
CREATE POLICY "Allow public view portfolio assets" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow all upload portfolio assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow all update portfolio assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow all delete portfolio assets" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-assets');


-- ==============================================================================
-- 2. TABEL: PROJECTS (DENGAN SELURUH KOLOM STANDAR)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Full-stack Developer',
    year TEXT DEFAULT '',
    period TEXT DEFAULT '',
    category TEXT NOT NULL DEFAULT 'fullstack',
    short_summary TEXT DEFAULT '',
    full_description TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    gallery_urls TEXT[] DEFAULT '{}',
    tech_stacks TEXT[] DEFAULT '{}',
    live_url TEXT DEFAULT '',
    repo_url TEXT DEFAULT '',
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    subtitle TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    description TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    featured_span TEXT DEFAULT 'lg:col-span-6',
    demo_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    metrics JSONB DEFAULT '[]'::jsonb,
    architecture_flow JSONB DEFAULT '[]'::jsonb,
    database_schema JSONB DEFAULT '[]'::jsonb,
    code_snippet JSONB DEFAULT '{}'::jsonb,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pastikan seluruh kolom tersedia secara idempotent
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Full-stack Developer';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS period TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'fullstack';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS short_summary TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS full_description TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tech_stacks TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repo_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured_span TEXT DEFAULT 'lg:col-span-6';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS demo_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS architecture_flow JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS database_schema JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS code_snippet JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();


-- ==============================================================================
-- 3. TABEL: EXPERIENCES (PENGALAMAN KERJA)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT DEFAULT '',
    type TEXT DEFAULT 'Industry',
    duration TEXT NOT NULL DEFAULT '',
    status TEXT DEFAULT 'Active',
    start_date TEXT DEFAULT '',
    end_date TEXT DEFAULT '',
    is_current BOOLEAN DEFAULT false,
    highlights TEXT DEFAULT '',
    deliverables TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    photos TEXT[] DEFAULT '{}',
    metrics JSONB DEFAULT '[]'::jsonb,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Industry';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS start_date TEXT DEFAULT '';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS end_date TEXT DEFAULT '';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT false;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS highlights TEXT DEFAULT '';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS deliverables TEXT[] DEFAULT '{}';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();


-- ==============================================================================
-- 4. TABEL: CERTIFICATES (SERTIFIKASI)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    credential_id TEXT DEFAULT '',
    credential_url TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    skills_verified TEXT[] DEFAULT '{}',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS credential_id TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS credential_url TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS skills_verified TEXT[] DEFAULT '{}';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;


-- ==============================================================================
-- 5. TABEL: PROFILE (KONFIGURASI PROFIL HERO)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT NOT NULL DEFAULT 'Muhammad Raka Pradana',
    role TEXT NOT NULL DEFAULT 'Full-Stack Web Developer',
    tagline TEXT NOT NULL DEFAULT 'Crafting scalable web architectures, robust transactional backends, and data-driven systems. Focused on clean system design, database query efficiency, and high-performance user experiences.',
    avatar_url TEXT NOT NULL DEFAULT '/profile.jpg',
    status_badge TEXT DEFAULT 'Available for Engineering Projects',
    is_available BOOLEAN DEFAULT true,
    cta_primary_text TEXT DEFAULT 'Explore Projects',
    cta_primary_url TEXT DEFAULT '#projects',
    cta_cv_text TEXT DEFAULT 'Download CV',
    cta_cv_url TEXT DEFAULT '/cv.pdf',
    cta_contact_text TEXT DEFAULT 'Contact Me',
    cta_contact_url TEXT DEFAULT '#contact',
    github_url TEXT DEFAULT 'https://github.com/raakaprx',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/in/rakaprx',
    whatsapp_url TEXT DEFAULT 'https://wa.me/6285156000636',
    email TEXT DEFAULT 'rakapradana.work@gmail.com',
    highlights JSONB DEFAULT '[
        {"label": "CURRENT ROLE", "title": "Web Developer", "subtitle": "PT Maxxima Innovative Engineering", "icon": "briefcase"},
        {"label": "CORE SPECIALTIES", "title": "Laravel & Next.js", "subtitle": "REST APIs & ML Pipelines", "icon": "layers"},
        {"label": "DATABASE FOCUS", "title": "PostgreSQL & MySQL", "subtitle": "ACID & Index Tuning", "icon": "database"}
    ]'::jsonb,
    avatar_position TEXT DEFAULT '55% 20%',
    avatar_scale INT DEFAULT 100,
    avatar_offset_y INT DEFAULT 0,
    avatar_offset_x INT DEFAULT 0,
    avatar_opacity INT DEFAULT 45,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pastikan kolom baru selalu ada di database Supabase yang sudah aktif
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_position TEXT DEFAULT '55% 20%';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_scale INT DEFAULT 100;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_offset_y INT DEFAULT 0;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_offset_x INT DEFAULT 0;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_opacity INT DEFAULT 45;

-- Inisialisasi baris default 'main' jika tabel profile kosong
INSERT INTO public.profile (id, name, role, tagline, avatar_url, avatar_position, avatar_scale, avatar_opacity, status_badge, is_available)
VALUES (
    'main',
    'Muhammad Raka Pradana',
    'Full-Stack Web Developer',
    'Crafting scalable web architectures, robust transactional backends, and data-driven systems. Focused on clean system design, database query efficiency, and high-performance user experiences.',
    '/profile.jpg',
    '55% 20%',
    100,
    45,
    'Available for Engineering Projects',
    true
)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 6. TABEL: TECH_STACKS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tech_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT DEFAULT '',
    proficiency TEXT DEFAULT 'Proficient',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ==============================================================================
-- 7. TABEL: ANALYTICS_EVENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    page_path TEXT DEFAULT '/',
    target_name TEXT DEFAULT '',
    device_type TEXT DEFAULT 'Desktop',
    referrer TEXT DEFAULT '',
    user_agent TEXT DEFAULT '',
    ip_address TEXT DEFAULT '',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ==============================================================================
-- 8. HAK AKSES PERMISSIVE RLS (AGAR CMS BISA EDIT & SIMPAN DENGAN LANCAR)
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Bersihkan policy lama
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
DROP POLICY IF EXISTS "CMS full access projects" ON public.projects;
CREATE POLICY "CMS full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin full access experiences" ON public.experiences;
DROP POLICY IF EXISTS "CMS full access experiences" ON public.experiences;
CREATE POLICY "CMS full access experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "CMS full access certificates" ON public.certificates;
CREATE POLICY "CMS full access certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view profile" ON public.profile;
DROP POLICY IF EXISTS "Admin full access profile" ON public.profile;
DROP POLICY IF EXISTS "CMS full access profile" ON public.profile;
CREATE POLICY "CMS full access profile" ON public.profile FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "Admin full access tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "CMS full access tech_stacks" ON public.tech_stacks;
CREATE POLICY "CMS full access tech_stacks" ON public.tech_stacks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admin full access analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "CMS full access analytics_events" ON public.analytics_events;
CREATE POLICY "CMS full access analytics_events" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);


-- ==============================================================================
-- 9. SEED INITIAL PROJECTS JIKA TABEL KOSONG
-- ==============================================================================
INSERT INTO public.projects (
    title, slug, role, year, category, short_summary, full_description,
    thumbnail_url, gallery_urls, tech_stacks, live_url, repo_url, is_featured, display_order
)
VALUES (
    'Smart Material Management System (SMMS)',
    'smart-material-management-system',
    'Lead Full-Stack Developer',
    '2026',
    'fullstack',
    'Aplikasi web pergudangan full-stack terintegrasi dengan 9 modul operasional, otentikasi RBAC 5 role, dan notifikasi real-time Socket.IO.',
    'Proyek Skripsi 2026 yang dikembangkan untuk PT. Sundaya Indonesia bekerja sama dengan Telkom University. Sistem ini mendigitalisasi seluruh alur kerja permintaan material, approval multi-level, pemantauan stok, dan procurement.',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop'],
    ARRAY['React.js', 'Node.js', 'Express.js', 'MySQL', 'Socket.IO', 'Docker', 'JWT', 'RESTful APIs'],
    'https://github.com/raakaprx/warehouse-sundaya-v2',
    'https://github.com/raakaprx/warehouse-sundaya-v2',
    true,
    1
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.projects (
    title, slug, role, year, category, short_summary, full_description,
    thumbnail_url, gallery_urls, tech_stacks, live_url, repo_url, is_featured, display_order
)
VALUES (
    'Plastani',
    'plastani-umkm-ecommerce',
    'Full-Stack Laravel Developer',
    '2025',
    'fullstack',
    'Platform e-commerce agrikultur untuk UMKM dan petani lokal dengan katalog produk terorganisir, integrasi order WhatsApp, dan analitik penjualan.',
    'Plastani merupakan platform e-commerce digital yang dirancang untuk memberdayakan UMKM dan kelompok tani lokal agar dapat memasarkan produk hasil panen secara mandiri.',
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1200&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1200&auto=format&fit=crop'],
    ARRAY['Laravel', 'PHP', 'Tailwind CSS', 'MySQL', 'Blade', 'REST APIs'],
    'https://github.com/raakaprx/plastani-ecommerce',
    'https://github.com/raakaprx/plastani-ecommerce',
    true,
    2
)
ON CONFLICT (slug) DO NOTHING;


-- ==============================================================================
-- 10. NOTIFY POSTGREST SCHEMA RELOAD
-- ==============================================================================
NOTIFY pgrst, 'reload schema';
