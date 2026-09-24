-- ==============================================================================
-- FIX SUPABASE: BUCKET STORAGE & PERMISSIONS CMS (RUN IN SUPABASE SQL EDITOR)
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. BUAT STORAGE BUCKET 'portfolio-assets' (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. HAPUS POLICY LAMA YANG MEMBATASI AKSES
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can delete portfolio assets" ON storage.objects;

-- 3. BUAT POLICY STORAGE AGAR CMS BISA UPLOAD GAMBAR DENGAN LANCAR
CREATE POLICY "Public can view portfolio assets" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "CMS can upload portfolio assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "CMS can update portfolio assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-assets');

CREATE POLICY "CMS can delete portfolio assets" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-assets');

-- 4. HAPUS POLICY DATABASE LAMA YANG MEMBLOKIR ROLE ANON
DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
DROP POLICY IF EXISTS "Admin full access experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admin full access tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "Admin full access analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "CMS full access projects" ON public.projects;
DROP POLICY IF EXISTS "CMS full access experiences" ON public.experiences;
DROP POLICY IF EXISTS "CMS full access certificates" ON public.certificates;
DROP POLICY IF EXISTS "CMS full access tech_stacks" ON public.tech_stacks;
DROP POLICY IF EXISTS "CMS full access analytics" ON public.analytics_events;

-- 5. BERIKAN AKSES PENUH AGAR CMS BISA SIMPAN DATA LANGSUNG (INSERT, UPDATE, DELETE)
CREATE POLICY "CMS full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access tech_stacks" ON public.tech_stacks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access analytics" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);
