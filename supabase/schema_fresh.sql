-- ==============================================================================
-- FRESH SCHEMA: PORTFOLIO CMS + VISITOR ANALYTICS (DATABASE KOSONG)
-- File: supabase/schema_fresh.sql
--
-- CARA PAKAI:
-- 1. Buka Supabase Dashboard -> SQL Editor di project BARU Anda.
-- 2. Salin seluruh isi file ini, tempelkan, lalu klik 'RUN' satu kali.
-- 3. Skrip ini IDEMPOTEN (aman dijalankan ulang).
--
-- ISI: hanya struktur tabel + index + RLS + storage bucket.
-- TIDAK ADA seed data (tanpa INSERT data portfolio).
-- TIDAK ADA akses tulis untuk publik (tanpa GRANT ALL TO anon).
-- ==============================================================================

-- 0. EKSTENSI
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABEL: PROJECTS
-- Dibaca: lib/portfolio-data.ts (getProjects/getProjectBySlug, order by
-- display_order, order_index, created_at).
-- Ditulis: app/admin/projects/[id]/page.tsx (kolom baru + kolom legacy
-- dual-field: summary/description/subtitle/tags/demo_url/github_url/
-- featured/order_index, plus year/period).
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

-- ==============================================================================
-- 2. TABEL: EXPERIENCES
-- Dibaca: lib/portfolio-data.ts (getExperiences, order by order_index;
-- kolom photos/gallery_urls/photo_urls).
-- Ditulis: app/admin/experiences/page.tsx (termasuk kolom photos).
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT DEFAULT '',
    type TEXT DEFAULT 'Industry',
    duration TEXT DEFAULT '',
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

-- ==============================================================================
-- 3. TABEL: CERTIFICATES
-- Dibaca: lib/portfolio-data.ts (getCertificates, order by order_index;
-- kolom expiration_date/valid_until/is_no_expiration).
-- Ditulis: app/admin/certificates/page.tsx (issue_date, is_no_expiration,
-- expiration_date).
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
    expiration_date TEXT DEFAULT '',
    valid_until TEXT DEFAULT '',
    is_no_expiration BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. TABEL: TECH_STACKS
-- Dibaca: lib/portfolio-data.ts (getTechStacks, order by order_index;
-- kolom name/category/proficiency).
-- Ditulis: app/admin/tech-stack/page.tsx.
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
-- 5. TABEL: PROFILE (satu baris, id = 'main')
-- Dibaca: lib/portfolio-data.ts (getProfile; 5 kolom tuning avatar).
-- Ditulis: app/admin/profile/page.tsx (upsert, termasuk avatar_opacity).
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '',
    tagline TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    avatar_position TEXT DEFAULT '55% 20%',
    avatar_scale INT DEFAULT 100,
    avatar_offset_y INT DEFAULT 0,
    avatar_offset_x INT DEFAULT 0,
    avatar_opacity INT DEFAULT 45,
    status_badge TEXT DEFAULT '',
    is_available BOOLEAN DEFAULT true,
    cta_primary_text TEXT DEFAULT 'Explore Projects',
    cta_primary_url TEXT DEFAULT '#projects',
    cta_cv_text TEXT DEFAULT 'Download CV',
    cta_cv_url TEXT DEFAULT '/cv.pdf',
    cta_contact_text TEXT DEFAULT 'Contact Me',
    cta_contact_url TEXT DEFAULT '#contact',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    whatsapp_url TEXT DEFAULT '',
    email TEXT DEFAULT '',
    highlights JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 6. TABEL: ANALYTICS_EVENTS
-- Ditulis: app/api/analytics/route.ts (event_type, page_path, target_name,
-- device_type, referrer, user_agent, ip_address).
-- Dibaca: app/admin/analytics/page.tsx + app/admin/page.tsx (agregasi,
-- sebagai role authenticated).
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
-- 7. INDEX UNTUK SORTING & QUERY ANALITIK
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order ASC, order_index ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON public.experiences(order_index ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_order ON public.certificates(order_index ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_order ON public.tech_stacks(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY — LEAST PRIVILEGE
-- anon (publik): hanya SELECT tabel konten + INSERT analytics_events.
-- authenticated (admin CMS): akses penuh.
-- TIDAK ADA policy tulis untuk publik. TIDAK ADA GRANT ALL TO anon.
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Cabut semua hak default dari publik, lalu berikan hak minimal eksplisit.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON TABLE public.projects TO anon;
GRANT SELECT ON TABLE public.experiences TO anon;
GRANT SELECT ON TABLE public.certificates TO anon;
GRANT SELECT ON TABLE public.tech_stacks TO anon;
GRANT SELECT ON TABLE public.profile TO anon;
GRANT INSERT ON TABLE public.analytics_events TO anon;

GRANT ALL ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.experiences TO authenticated;
GRANT ALL ON TABLE public.certificates TO authenticated;
GRANT ALL ON TABLE public.tech_stacks TO authenticated;
GRANT ALL ON TABLE public.profile TO authenticated;
GRANT ALL ON TABLE public.analytics_events TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Policy baca publik (SELECT saja, tanpa akses tulis).
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read experiences" ON public.experiences;
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read certificates" ON public.certificates;
CREATE POLICY "Public read certificates" ON public.certificates FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read tech_stacks" ON public.tech_stacks;
CREATE POLICY "Public read tech_stacks" ON public.tech_stacks FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read profile" ON public.profile;
CREATE POLICY "Public read profile" ON public.profile FOR SELECT TO anon, authenticated USING (true);

-- Publik hanya boleh MENCATAT event analitik, tidak boleh membaca/mengubahnya.
DROP POLICY IF EXISTS "Public insert analytics_events" ON public.analytics_events;
CREATE POLICY "Public insert analytics_events" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Akses penuh hanya untuk role login (admin CMS).
DROP POLICY IF EXISTS "Authenticated manage projects" ON public.projects;
CREATE POLICY "Authenticated manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage experiences" ON public.experiences;
CREATE POLICY "Authenticated manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage certificates" ON public.certificates;
CREATE POLICY "Authenticated manage certificates" ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage tech_stacks" ON public.tech_stacks;
CREATE POLICY "Authenticated manage tech_stacks" ON public.tech_stacks FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage profile" ON public.profile;
CREATE POLICY "Authenticated manage profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage analytics_events" ON public.analytics_events;
CREATE POLICY "Authenticated manage analytics_events" ON public.analytics_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 9. STORAGE BUCKET: portfolio-assets (dipakai ImageUploader/MultiImageUploader)
-- Publik: hanya baca. Tulis/ubah/hapus: hanya role login.
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read portfolio-assets" ON storage.objects;
CREATE POLICY "Public read portfolio-assets"
    ON storage.objects FOR SELECT TO anon, authenticated
    USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated write portfolio-assets" ON storage.objects;
CREATE POLICY "Authenticated write portfolio-assets"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated update portfolio-assets" ON storage.objects;
CREATE POLICY "Authenticated update portfolio-assets"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'portfolio-assets')
    WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated delete portfolio-assets" ON storage.objects;
CREATE POLICY "Authenticated delete portfolio-assets"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'portfolio-assets');

-- ==============================================================================
-- 10. RELOAD SCHEMA CACHE POSTGREST
-- ==============================================================================
NOTIFY pgrst, 'reload schema';
