-- ==============================================================================
-- OPSI CEPAT: TAMBAH SEMUA KOLOM YANG HILANG (ALTER TABLE)
-- Jalankan di SQL Editor Supabase jika tidak ingin menghapus tabel
-- ==============================================================================

-- 1. TAMBAH KOLOM PADA TABEL PROJECTS
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'fullstack';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS architecture_flow JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS database_schema JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS code_snippet JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured_span TEXT DEFAULT 'lg:col-span-6';

-- 2. TAMBAH KOLOM PADA TABEL EXPERIENCES & HAPUS BATASAN NOT NULL LAMA
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS highlights TEXT DEFAULT '';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS deliverables TEXT[] DEFAULT '{}';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE public.experiences ALTER COLUMN start_date DROP NOT NULL;

-- 3. TAMBAH KOLOM PADA TABEL CERTIFICATES & HAPUS BATASAN NOT NULL LAMA
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS date TEXT DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS skills_verified TEXT[] DEFAULT '{}';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;
ALTER TABLE public.certificates ALTER COLUMN issue_date DROP NOT NULL;

-- 4. TAMBAH KOLOM PADA TABEL TECH_STACKS
ALTER TABLE public.tech_stacks ADD COLUMN IF NOT EXISTS proficiency TEXT DEFAULT 'Proficient';
ALTER TABLE public.tech_stacks ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT '';
ALTER TABLE public.tech_stacks ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

-- 5. HAK AKSES OPERASIONAL CMS UNTUK ANON & AUTHENTICATED
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 6. RELOAD POSTGREST SCHEMA CACHE SUPAYA SEMUA PERUBAHAN LANGSUNG AKTIF
NOTIFY pgrst, 'reload schema';

