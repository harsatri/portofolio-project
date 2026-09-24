-- ==============================================================================
-- SKRIP REFACTOR DATABASE: PROJECTS V2 (SUPABASE)
-- Jalankan skrip ini di SQL Editor Supabase (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. PASTIKAN TABEL PROJECTS MEMILIKI SELURUH KOLOM SESUAI SPESIFIKASI BARU
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS short_summary TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Full-stack Developer';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tech_stacks TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repo_url TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- 2. MIGRASI & SINKRONISASI DATA DARI KOLOM LAMA KE KOLOM BARU (JIKA ADA DATA)
UPDATE public.projects SET
  short_summary = COALESCE(short_summary, summary, SUBSTRING(description FROM 1 FOR 180)),
  full_description = COALESCE(full_description, description),
  role = COALESCE(role, 'Full-stack Developer'),
  gallery_urls = COALESCE(gallery_urls, '{}'),
  tech_stacks = COALESCE(tech_stacks, tags, '{}'),
  live_url = COALESCE(live_url, demo_url, ''),
  repo_url = COALESCE(repo_url, github_url, ''),
  is_featured = COALESCE(is_featured, featured, false),
  display_order = COALESCE(display_order, order_index, 0);

-- 3. JIKA ADA TABEL PENDUKUNG MEDIA TAMBAHAN (PROJECT_MEDIA)
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  media_type TEXT DEFAULT 'image', -- 'image' | 'video' | 'diagram'
  media_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. HAK AKSES OPERASIONAL CMS SUPABASE (ANON & AUTHENTICATED)
GRANT ALL ON TABLE public.projects TO anon, authenticated;
GRANT ALL ON TABLE public.project_media TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 5. RELOAD SCHEMA CACHE POSTGREST AGAR PERUBAHAN LANGSUNG AKTIF
NOTIFY pgrst, 'reload schema';
