-- ==============================================================================
-- MISSION: REFACTOR KEAMANAN KRITIKAL (P0) & ROW LEVEL SECURITY (RLS)
-- File: supabase/security_fix_rls_p0.sql
--
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PASTIKAN SELURUH KOLOM STANDAR TERSEDIA (PENYATUAN SKEMA P1)
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Full-stack Developer';
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS short_summary TEXT;
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '';
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS tech_stacks TEXT[] DEFAULT '{}';
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT '';
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS repo_url TEXT DEFAULT '';
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- Sinkronisasi kolom lama ke kolom standar jika kolom lama ada
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
END $$;

-- Kolom ip_address pada analytics_events
ALTER TABLE IF EXISTS public.analytics_events ADD COLUMN IF NOT EXISTS ip_address TEXT DEFAULT '';

-- Kolom photos untuk galeri dokumentasi foto kegiatan/sistem pada experiences
ALTER TABLE IF EXISTS public.experiences ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- ------------------------------------------------------------------------------
-- 2. CABUT SELURUH HAK AKSES BERLEBIHAN DARI ROLE ANON (REVOKE ALL)
-- ------------------------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon;

-- Pastikan anon dan authenticated dapat menggunakan schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 3. BERIKAN HAK AKSES MINIMAL & KETAT (LEAST PRIVILEGE)
--    Role anon: HANYA SELECT konten publik & INSERT analytics_events
--    Role authenticated: Akses penuh (SELECT, INSERT, UPDATE, DELETE)
-- ------------------------------------------------------------------------------
-- Role anon:
GRANT SELECT ON TABLE public.projects TO anon;
GRANT SELECT ON TABLE public.experiences TO anon;
GRANT SELECT ON TABLE public.certificates TO anon;
GRANT SELECT ON TABLE public.tech_stacks TO anon;
GRANT INSERT ON TABLE public.analytics_events TO anon;

-- Jika tabel pendukung project_media ada
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_media') THEN
        GRANT SELECT ON TABLE public.project_media TO anon;
        GRANT ALL ON TABLE public.project_media TO authenticated;
    END IF;
END $$;

-- Role authenticated (Admin):
GRANT ALL ON TABLE public.projects TO authenticated;
GRANT ALL ON TABLE public.experiences TO authenticated;
GRANT ALL ON TABLE public.certificates TO authenticated;
GRANT ALL ON TABLE public.tech_stacks TO authenticated;
GRANT ALL ON TABLE public.analytics_events TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ------------------------------------------------------------------------------
-- 4. AKTIFKAN ROW LEVEL SECURITY (RLS) DI SELURUH TABEL
-- ------------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_media') THEN
        ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. HAPUS POLICY LAMA YANG BERBAHAYA (FOR ALL USING (true) DENGAN CHECK (true))
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "CMS full access projects" ON public.projects;
DROP POLICY IF EXISTS "CMS full access experiences" ON public.experiences;
DROP POLICY IF EXISTS "CMS full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "CMS full access tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "CMS full access analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow public all access" ON public.projects;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.projects;
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view experiences" ON public.experiences;
DROP POLICY IF EXISTS "Public can view certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public can view tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "Public can insert analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Public read experiences" ON public.experiences;
DROP POLICY IF EXISTS "Public read certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public read tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Authenticated full access projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated full access experiences" ON public.experiences;
DROP POLICY IF EXISTS "Authenticated full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "Authenticated full access tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "Authenticated manage analytics" ON public.analytics_events;

-- ------------------------------------------------------------------------------
-- 6. BUAT POLICY RLS BARU YANG GRANULAR & AMAN
-- ------------------------------------------------------------------------------

-- Tabel: projects
CREATE POLICY "Public read projects"
    ON public.projects
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Authenticated full access projects"
    ON public.projects
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Tabel: experiences
CREATE POLICY "Public read experiences"
    ON public.experiences
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Authenticated full access experiences"
    ON public.experiences
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Tabel: certificates
CREATE POLICY "Public read certificates"
    ON public.certificates
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Authenticated full access certificates"
    ON public.certificates
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Tabel: tech_stacks
CREATE POLICY "Public read tech_stacks"
    ON public.tech_stacks
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Authenticated full access tech_stacks"
    ON public.tech_stacks
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Tabel: analytics_events
CREATE POLICY "Public insert analytics"
    ON public.analytics_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated manage analytics"
    ON public.analytics_events
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Optional: project_media jika ada
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_media') THEN
        DROP POLICY IF EXISTS "Public read project_media" ON public.project_media;
        DROP POLICY IF EXISTS "Authenticated full access project_media" ON public.project_media;

        CREATE POLICY "Public read project_media"
            ON public.project_media FOR SELECT TO anon, authenticated USING (true);

        CREATE POLICY "Authenticated full access project_media"
            ON public.project_media FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 7. AMANKAN STORAGE BUCKET: portfolio-assets
--    - Publik/anon: HANYA boleh SELECT (melihat/mengunduh gambar publik)
--    - Authenticated: HANYA user login yang boleh INSERT, UPDATE, DELETE
-- ------------------------------------------------------------------------------
-- Pastikan bucket portfolio-assets terdaftar
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Hapus seluruh policy storage lama pada storage.objects
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public select portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete portfolio-assets" ON storage.objects;

-- Storage Policy 1: SELECT (Publik & Authenticated)
CREATE POLICY "Public select portfolio-assets"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'portfolio-assets');

-- Storage Policy 2: INSERT (Authenticated Only)
CREATE POLICY "Authenticated insert portfolio-assets"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets');

-- Storage Policy 3: UPDATE (Authenticated Only)
CREATE POLICY "Authenticated update portfolio-assets"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-assets')
    WITH CHECK (bucket_id = 'portfolio-assets');

-- Storage Policy 4: DELETE (Authenticated Only)
CREATE POLICY "Authenticated delete portfolio-assets"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-assets');

-- ------------------------------------------------------------------------------
-- 8. PROFILE / HERO SECTION MANAGEMENT TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT NOT NULL DEFAULT 'Muhammad Raka Pradana',
    role TEXT NOT NULL DEFAULT 'Full-Stack Web Developer',
    tagline TEXT NOT NULL DEFAULT 'Crafting scalable web architectures, robust transactional backends, and data-driven systems. Focused on clean system design, database query efficiency, and high-performance user experiences.',
    avatar_url TEXT NOT NULL DEFAULT '/profile.jpg',
    avatar_position TEXT DEFAULT 'center 20%',
    avatar_scale INT DEFAULT 100,
    avatar_offset_y INT DEFAULT 0,
    avatar_offset_x INT DEFAULT 0,
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

-- Migrasi kolom jika tabel profile sudah dibuat sebelumnya
ALTER TABLE IF EXISTS public.profile ADD COLUMN IF NOT EXISTS avatar_position TEXT DEFAULT 'center 20%';
ALTER TABLE IF EXISTS public.profile ADD COLUMN IF NOT EXISTS avatar_scale INT DEFAULT 100;
ALTER TABLE IF EXISTS public.profile ADD COLUMN IF NOT EXISTS avatar_offset_y INT DEFAULT 0;
ALTER TABLE IF EXISTS public.profile ADD COLUMN IF NOT EXISTS avatar_offset_x INT DEFAULT 0;

-- Enable RLS on profile table
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Revoke all by default and grant minimal permissions
REVOKE ALL ON TABLE public.profile FROM anon;
REVOKE ALL ON TABLE public.profile FROM authenticated;

GRANT SELECT ON TABLE public.profile TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profile TO authenticated;

-- Policies for profile table
DROP POLICY IF EXISTS "Anon read profile" ON public.profile;
CREATE POLICY "Anon read profile"
    ON public.profile
    FOR SELECT
    TO anon
    USING (true);

DROP POLICY IF EXISTS "Authenticated manage profile" ON public.profile;
CREATE POLICY "Authenticated manage profile"
    ON public.profile
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial default profile row if not exists
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

-- ------------------------------------------------------------------------------
-- 9. RELOAD SCHEMA CACHE POSTGREST
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

