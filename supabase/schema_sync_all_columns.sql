-- ==============================================================================
-- SUPABASE COMPLETE DATABASE SCHEMA SYNCHRONIZATION
-- File: supabase/schema_sync_all_columns.sql
--
-- Tujuan:
-- 1. Menyinkronkan seluruh kolom database Supabase dengan kebutuhan Frontend CMS Next.js.
-- 2. Memperbaiki error schema cache PostgREST (seperti kolom 'photos' pada 'experiences').
-- 3. Mengatur hak akses Row Level Security (RLS) dengan standar keamanan Least Privilege.
-- 4. Mereload cache schema PostgREST secara otomatis via NOTIFY pgrst.
--
-- CARA PENGGUNAAN:
-- Buka Supabase Dashboard -> SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- Salin seluruh isi skrip ini, tempelkan ke SQL Editor, lalu klik 'RUN'.
-- Skrip ini 100% IDEMPOTENT (aman dieksekusi berkali-kali tanpa merusak data yang ada).
-- ==============================================================================

-- 0. EKSTENSI DATABASE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABEL: EXPERIENCES (RIWAYAT PENGALAMAN KERJA)
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

-- Pastikan seluruh kolom tersedia secara idempotent
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

-- Hapus batasan NOT NULL lama jika sebelumnya pernah ada
DO $$
BEGIN
    ALTER TABLE public.experiences ALTER COLUMN duration DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.experiences ALTER COLUMN start_date DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Sinkronisasi kolom lama jika gallery_urls pernah dibuat di tabel experiences
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiences' AND column_name = 'gallery_urls'
    ) THEN
        UPDATE public.experiences 
        SET photos = COALESCE(NULLIF(photos, '{}'), gallery_urls, '{}')
        WHERE photos IS NULL OR photos = '{}';
    END IF;
END $$;


-- ==============================================================================
-- 2. TABEL: PROJECTS (PORTOFOLIO PROYEK & KARYA)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Full-stack Developer',
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

-- Pastikan seluruh kolom standar V2 tersedia secara idempotent
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Full-stack Developer';
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

-- Kolom penunjang kompatibilitas
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

-- Sinkronisasi kolom lama ke kolom standar jika terdapat data lama
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'featured'
    ) THEN
        UPDATE public.projects SET is_featured = COALESCE(is_featured, featured, false) WHERE is_featured IS NULL;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'demo_url'
    ) THEN
        UPDATE public.projects SET live_url = COALESCE(NULLIF(live_url, ''), demo_url, '') WHERE live_url IS NULL OR live_url = '';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'github_url'
    ) THEN
        UPDATE public.projects SET repo_url = COALESCE(NULLIF(repo_url, ''), github_url, '') WHERE repo_url IS NULL OR repo_url = '';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'tags'
    ) THEN
        UPDATE public.projects SET tech_stacks = COALESCE(NULLIF(tech_stacks, '{}'), tags, '{}') WHERE tech_stacks IS NULL OR tech_stacks = '{}';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'order_index'
    ) THEN
        UPDATE public.projects SET display_order = COALESCE(display_order, order_index, 0) WHERE display_order IS NULL OR display_order = 0;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'summary'
    ) THEN
        UPDATE public.projects SET short_summary = COALESCE(NULLIF(short_summary, ''), summary, '') WHERE short_summary IS NULL OR short_summary = '';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'description'
    ) THEN
        UPDATE public.projects SET full_description = COALESCE(NULLIF(full_description, ''), description, '') WHERE full_description IS NULL OR full_description = '';
    END IF;
END $$;


-- ==============================================================================
-- 3. TABEL: CERTIFICATES (SERTIFIKASI & KREDENSIAL)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT '',
    issue_date TEXT DEFAULT '',
    credential_id TEXT DEFAULT '',
    credential_url TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    skills_verified TEXT[] DEFAULT '{}',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pastikan seluruh kolom tersedia secara idempotent
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS date TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS issue_date TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS credential_id TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS credential_url TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS skills_verified TEXT[] DEFAULT '{}';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Hapus batasan NOT NULL lama jika sebelumnya pernah ada
DO $$
BEGIN
    ALTER TABLE public.certificates ALTER COLUMN date DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.certificates ALTER COLUMN issue_date DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;


-- ==============================================================================
-- 4. TABEL: PROFILE (KONFIGURASI BIODATA, SOSMED & HERO CMS)
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
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pastikan seluruh kolom tersedia secara idempotent jika tabel sudah ada sebelumnya
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Muhammad Raka Pradana';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Full-Stack Web Developer';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT 'Crafting scalable web architectures, robust transactional backends, and data-driven systems. Focused on clean system design, database query efficiency, and high-performance user experiences.';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/profile.jpg';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS status_badge TEXT DEFAULT 'Available for Engineering Projects';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cta_primary_text TEXT DEFAULT 'Explore Projects';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cta_primary_url TEXT DEFAULT '#projects';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cta_cv_text TEXT DEFAULT 'Download CV';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cta_cv_url TEXT DEFAULT '/cv.pdf';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cta_contact_text TEXT DEFAULT 'Contact Me';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS cta_contact_url TEXT DEFAULT '#contact';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT 'https://github.com/raakaprx';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT 'https://linkedin.com/in/rakaprx';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS whatsapp_url TEXT DEFAULT 'https://wa.me/6285156000636';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'rakapradana.work@gmail.com';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[
    {"label": "CURRENT ROLE", "title": "Web Developer", "subtitle": "PT Maxxima Innovative Engineering", "icon": "briefcase"},
    {"label": "CORE SPECIALTIES", "title": "Laravel & Next.js", "subtitle": "REST APIs & ML Pipelines", "icon": "layers"},
    {"label": "DATABASE FOCUS", "title": "PostgreSQL & MySQL", "subtitle": "ACID & Index Tuning", "icon": "database"}
]'::jsonb;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Inisialisasi baris default 'main' jika tabel profile kosong
INSERT INTO public.profile (id, name, role, tagline, avatar_url, status_badge, is_available)
VALUES (
    'main',
    'Muhammad Raka Pradana',
    'Full-Stack Web Developer',
    'Crafting scalable web architectures, robust transactional backends, and data-driven systems. Focused on clean system design, database query efficiency, and high-performance user experiences.',
    '/profile.jpg',
    'Available for Engineering Projects',
    true
)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 5. TABEL: TECH_STACKS (KEAHLIAN & TEKNOLOGI)
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

ALTER TABLE public.tech_stacks ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT '';
ALTER TABLE public.tech_stacks ADD COLUMN IF NOT EXISTS proficiency TEXT DEFAULT 'Proficient';
ALTER TABLE public.tech_stacks ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;


-- ==============================================================================
-- 6. TABEL: ANALYTICS_EVENTS (LOG ANALITIK PENGUNJUNG)
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

ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS page_path TEXT DEFAULT '/';
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS target_name TEXT DEFAULT '';
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'Desktop';
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS referrer TEXT DEFAULT '';
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT '';
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS ip_address TEXT DEFAULT '';
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;


-- ==============================================================================
-- 7. TABEL PENDUKUNG: PROJECT_MEDIA (OPTIONAL)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    media_type TEXT DEFAULT 'image',
    media_url TEXT NOT NULL,
    caption TEXT DEFAULT '',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);


-- ==============================================================================
-- 8. INDEXING UNTUK OPTIMALISASI QUERY & SORTING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON public.experiences(order_index ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_order ON public.certificates(order_index ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_order ON public.tech_stacks(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);


-- ==============================================================================
-- 9. KEAMANAN: ROW LEVEL SECURITY (RLS) & HAK AKSES OPERASIONAL
-- ==============================================================================
-- Pastikan RLS aktif pada seluruh tabel
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Cabut seluruh hak akses publik yang berlebihan
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon;

-- Pastikan anon dan authenticated dapat menggunakan schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Role anon (Pengunjung publik): HANYA baca konten & rekam analitik
GRANT SELECT ON TABLE public.projects TO anon;
GRANT SELECT ON TABLE public.experiences TO anon;
GRANT SELECT ON TABLE public.certificates TO anon;
GRANT SELECT ON TABLE public.profile TO anon;
GRANT SELECT ON TABLE public.tech_stacks TO anon;
GRANT SELECT ON TABLE public.project_media TO anon;
GRANT INSERT ON TABLE public.analytics_events TO anon;

-- Role authenticated (Admin): Akses penuh ke seluruh tabel dan sequence
GRANT ALL ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.experiences TO authenticated;
GRANT ALL ON TABLE public.certificates TO authenticated;
GRANT ALL ON TABLE public.profile TO authenticated;
GRANT ALL ON TABLE public.tech_stacks TO authenticated;
GRANT ALL ON TABLE public.analytics_events TO authenticated;
GRANT ALL ON TABLE public.project_media TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Policies: Role anon (Hanya SELECT)
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can view experiences" ON public.experiences;
CREATE POLICY "Public can view experiences" ON public.experiences FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can view certificates" ON public.certificates;
CREATE POLICY "Public can view certificates" ON public.certificates FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can view profile" ON public.profile;
CREATE POLICY "Public can view profile" ON public.profile FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can view tech_stacks" ON public.tech_stacks;
CREATE POLICY "Public can view tech_stacks" ON public.tech_stacks FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can view project_media" ON public.project_media;
CREATE POLICY "Public can view project_media" ON public.project_media FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can insert analytics_events" ON public.analytics_events;
CREATE POLICY "Public can insert analytics_events" ON public.analytics_events FOR INSERT TO anon WITH CHECK (true);

-- Policies: Role authenticated (Admin: Akses Penuh)
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access experiences" ON public.experiences;
CREATE POLICY "Admin full access experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access certificates" ON public.certificates;
CREATE POLICY "Admin full access certificates" ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access profile" ON public.profile;
CREATE POLICY "Admin full access profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access tech_stacks" ON public.tech_stacks;
CREATE POLICY "Admin full access tech_stacks" ON public.tech_stacks FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access analytics_events" ON public.analytics_events;
CREATE POLICY "Admin full access analytics_events" ON public.analytics_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access project_media" ON public.project_media;
CREATE POLICY "Admin full access project_media" ON public.project_media FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ==============================================================================
-- 10. RELOAD SCHEMA CACHE POSTGREST
-- Perintah ini mewajibkan Supabase PostgREST merefresh cache skema seketika,
-- sehingga error "Could not find column ... in schema cache" langsung tuntas.
-- ==============================================================================
NOTIFY pgrst, 'reload schema';
