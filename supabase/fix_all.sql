-- ==============================================================================
-- SOLUSI LENGKAP: PERBAIKAN KOLOM & STORAGE BUCKET SUPABASE
-- Jalankan skrip ini di SQL Editor Supabase (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. BERSIHKAN TABEL LAMA DENGAN STRUKTUR KOLOM LAMA (AMAN KARENA TABEL MASIH KOSONG)
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.tech_stacks CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- 2. AKTIFKAN EKSTENSI UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. BUAT TABEL DENGAN SELURUH KOLOM LENGKAP
-- Tabel: PROJECTS
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    description TEXT DEFAULT '',
    category TEXT NOT NULL DEFAULT 'fullstack', -- 'machine-learning' | 'laravel' | 'fullstack' | 'all'
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    featured_span TEXT DEFAULT 'lg:col-span-6',
    demo_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    metrics JSONB DEFAULT '[]'::jsonb,
    architecture_flow JSONB DEFAULT '[]'::jsonb,
    database_schema JSONB DEFAULT '[]'::jsonb,
    code_snippet JSONB DEFAULT '{}'::jsonb,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: EXPERIENCES
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT DEFAULT '',
    type TEXT DEFAULT 'Industry', -- 'Industry' | 'Internship' | 'Organization'
    duration TEXT NOT NULL,
    status TEXT DEFAULT 'Active', -- 'Active' | 'Completed'
    start_date TEXT DEFAULT '',
    end_date TEXT DEFAULT '',
    is_current BOOLEAN DEFAULT false,
    highlights TEXT DEFAULT '',
    deliverables TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    metrics JSONB DEFAULT '[]'::jsonb,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: CERTIFICATES
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL,
    credential_id TEXT DEFAULT '',
    credential_url TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    skills_verified TEXT[] DEFAULT '{}',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: TECH_STACKS
CREATE TABLE public.tech_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Frontend Development' | 'Backend & Systems' | 'Databases & Storage' | 'AI / Data Science & Tools'
    icon_name TEXT DEFAULT '',
    proficiency TEXT DEFAULT 'Proficient', -- 'Advanced' | 'Proficient'
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: ANALYTICS_EVENTS
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    page_path TEXT DEFAULT '/',
    target_name TEXT DEFAULT '',
    device_type TEXT DEFAULT 'Desktop',
    referrer TEXT DEFAULT '',
    user_agent TEXT DEFAULT '',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES: PUBLIC ACCESS & CMS FULL ACCESS
-- Public read
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public read tech_stacks" ON public.tech_stacks FOR SELECT USING (true);
CREATE POLICY "Public insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- CMS Full access (Insert, Update, Delete tanpa diblokir RLS)
CREATE POLICY "CMS full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access tech_stacks" ON public.tech_stacks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "CMS full access analytics" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);

-- 6. SETUP STORAGE BUCKET 'portfolio-assets' (PUBLIC)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-assets',
    'portfolio-assets',
    true,
    5242880,
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "CMS can delete portfolio assets" ON storage.objects;

CREATE POLICY "Public can view portfolio assets" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "CMS can upload portfolio assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "CMS can update portfolio assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-assets');

CREATE POLICY "CMS can delete portfolio assets" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-assets');

-- 7. SEED DATA AWAL (PORTFOLIO & CV TERBARU)
-- Experiences
INSERT INTO public.experiences (company, role, duration, status, type, is_current, highlights, deliverables, technologies, metrics, order_index)
VALUES 
(
    'PT Maxxima Innovative Engineering',
    'Web Developer',
    '2026 – Present',
    'Active',
    'Industry',
    true,
    'Mengembangkan sistem web berkinerja tinggi, optimalisasi database, dan fitur full-stack yang skalabel untuk platform digital tingkat enterprise.',
    ARRAY[
        'Merancang dan mengoptimalkan sistem web modern dan antarmuka data spasial menggunakan Next.js, React, dan TypeScript.',
        'Melakukan optimasi query database, indexing, dan perancangan skema untuk operasi multi-tenant yang kompleks di PostgreSQL.',
        'Membangun layanan backend andal dan RESTful API throughput tinggi dengan penanganan error ketat dan validasi otomatis.',
        'Berkolaborasi dengan tim rekayasa lintas fungsi dalam implementasi komponen UI skalabel dan pipeline state management.'
    ],
    ARRAY['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma ORM', 'Docker', 'RESTful APIs'],
    '[{"label": "Status Posisi", "value": "Aktif / Bekerja Saat Ini"}, {"label": "Fokus Inti", "value": "Sistem Web & Database"}, {"label": "Core Stack", "value": "Next.js & PostgreSQL"}]'::jsonb,
    1
),
(
    'PT. Sundaya',
    'Frontend Developer Intern',
    'Jan – Mar 2025',
    'Completed',
    'Internship',
    false,
    'Mengembangkan dan merancang responsive warehouse management web application (SMMS) yang mendukung 50+ concurrent users di seluruh site distribusi.',
    ARRAY[
        'Membangun reusable React.js components dengan optimized state management serta mengimplementasikan lazy loading dan code-splitting techniques yang berhasil mengurangi page load times.',
        'Mengintegrasikan fungsionalitas frontend dengan REST APIs untuk enable real-time inventory tracking dan mengurangi manual data-entry errors.',
        'Berkolaborasi dengan warehouse stakeholders dan tim operasional untuk menciptakan intuitive UI/UX.',
        'Membantu transisi alur kerja pergudangan dari pencatatan manual berbasis spreadsheet menuju platform digital terpusat.'
    ],
    ARRAY['React', 'JavaScript', 'HTML5', 'CSS3', 'RESTful APIs', 'Tailwind CSS'],
    '[{"label": "Pengguna Aktif", "value": "50+ Concurrent Users"}, {"label": "Performa", "value": "Lazy Loading & Code Splitting"}, {"label": "Tracking", "value": "Real-Time Inventory"}]'::jsonb,
    2
);

-- Certificates
INSERT INTO public.certificates (title, issuer, date, credential_id, credential_url, skills_verified, order_index)
VALUES 
(
    'Sertifikat Kompetensi - Pengembang Web Bersertifikat (CWDev)',
    'Badan Nasional Sertifikasi Profesi (BNSP)',
    'Jun 2026',
    'BNSP-CWDEV-62026',
    'https://bnsp.go.id',
    ARRAY['Pengembangan Perangkat Lunak dan Pemrograman', 'Pengembangan Web (CWDev)', 'Web Architecture & Best Practices'],
    1
);

-- Projects
INSERT INTO public.projects (
    title, slug, subtitle, description, category, tags, featured, featured_span, demo_url, github_url,
    metrics, architecture_flow, database_schema, code_snippet, order_index
)
VALUES 
(
    'Smart Material Management System (SMMS)',
    'smart-material-management-system',
    'Proyek Skripsi 2026 — PT. Sundaya Indonesia & Telkom University',
    'Merancang dan mengembangkan full-stack web system untuk digitisasi seluruh proses material request, approval, stock-monitoring, dan procurement workflows yang sebelumnya dikelola secara manual. Mengimplementasikan 9 modul terintegrasi dengan 5 level RBAC dan notifikasi real-time Socket.IO.',
    'fullstack',
    ARRAY['React.js', 'Node.js', 'Express.js', 'MySQL', 'Socket.IO', 'Docker', 'JWT', 'Tailwind CSS'],
    true,
    'lg:col-span-12',
    '',
    'https://github.com/raakaprx/warehouse-sundaya-v2',
    '[{"label": "Modul Terintegrasi", "value": "9 Integrated Modules"}, {"label": "Hak Akses (RBAC)", "value": "5 Distinct User Roles"}, {"label": "Notifikasi", "value": "Real-Time Socket.IO"}, {"label": "Deployment", "value": "Docker Containerized"}]'::jsonb,
    '[{"step": "Requirements Analysis", "detail": "Metodologi Waterfall SDLC mendalam untuk pemetaan 9 modul operasional pergudangan"}, {"step": "Role-Based Access", "detail": "JWT Auth untuk 5 role: Admin, NOC, Operations Manager, GM, dan Warehouse"}, {"step": "Real-Time Telemetry", "detail": "Socket.IO menyiarkan perubahan status stok dan approval seketika ke dashboard monitoring"}, {"step": "Container Deployment", "detail": "Kontainerisasi Docker multi-stage memastikan konsistensi staging dan production"}]'::jsonb,
    '[{"table": "material_requests", "fields": ["id (PK)", "user_id (FK)", "status", "priority", "created_at"]}, {"table": "inventory_stocks", "fields": ["id (PK)", "item_code", "quantity", "warehouse_location"]}, {"table": "approval_logs", "fields": ["id (PK)", "request_id (FK)", "approver_id (FK)", "action", "timestamp"]}]'::jsonb,
    '{"language": "typescript", "filename": "socketApprovalHandler.ts", "code": "export function handleMaterialApproval(io, payload) {\n  io.emit(\"material_request:updated\", payload);\n}"}'::jsonb,
    1
),
(
    'Plastani',
    'plastani-umkm-ecommerce',
    'Platform E-Commerce untuk UMKM & Petani Lokal (2025)',
    'Membangun platform e-commerce digital yang dirancang untuk membantu UMKM, khususnya petani dan produsen lokal, dalam menyalurkan produknya secara online dengan katalog terorganisir, pencarian efektif, integrasi WhatsApp order, serta sistem administrasi analitik transaksi.',
    'laravel',
    ARRAY['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'Tailwind CSS', 'Laravel Auth'],
    false,
    'lg:col-span-6',
    '',
    'https://github.com/raakaprx/plastani-ecommerce',
    '[{"label": "Sasaran", "value": "Petani & UMKM Lokal"}, {"label": "Checkout", "value": "Direct WhatsApp Order"}, {"label": "Admin Panel", "value": "Analitik & Laporan Penjualan"}, {"label": "Keamanan", "value": "Laravel Auth RBAC"}]'::jsonb,
    '[{"step": "Katalog & Pencarian", "detail": "Katalog responsif berbasis kategori produk pertanian dan UMKM"}, {"step": "WhatsApp Gateway", "detail": "Penerusan pesanan instan dengan parameter produk ke nomor WhatsApp penjual"}, {"step": "Admin CMS", "detail": "Pengelolaan artikel, katalog, produk, dan pemantauan analitik performa penjualan"}, {"step": "Autentikasi", "detail": "Sistem RBAC Laravel Auth memastikan akses aman bagi admin dan pembeli"}]'::jsonb,
    '[{"table": "products", "fields": ["id (PK)", "seller_id (FK)", "name", "price", "stock", "category_id"]}, {"table": "transactions", "fields": ["id (PK)", "buyer_name", "total_amount", "status", "created_at"]}]'::jsonb,
    '{"language": "php", "filename": "WhatsAppOrderService.php", "code": "public function generateOrderLink($product, $qty) {\n    return \"https://wa.me/\" . $product->seller->phone . \"?text=\" . urlencode(\"Pesan: {$product->name}\");\n}"}'::jsonb,
    2
),
(
    'JajanSepy',
    'jajansepy-single-brand',
    'Platform E-Commerce untuk Single Brand UMKM (2025)',
    'Mengembangkan platform e-commerce khusus untuk penjualan produk single brand dengan sistem komunikasi terintegrasi ke WhatsApp Admin. Fokus pada kemudahan pengelolaan produk, manajemen inventory yang efisien, dan proses checkout yang streamlined.',
    'laravel',
    ARRAY['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'JavaScript', 'WhatsApp Admin API'],
    false,
    'lg:col-span-6',
    '',
    'https://github.com/raakaprx/jajansepy-ecommerce',
    '[{"label": "Fokus Model", "value": "Single Brand UMKM"}, {"label": "Pemesanan", "value": "WhatsApp Admin API"}, {"label": "Inventory", "value": "Streamlined Stock Tracking"}, {"label": "Konversi", "value": "Quick Checkout Flow"}]'::jsonb,
    '[{"step": "Product Display", "detail": "Showcase varian produk single-brand dengan gambar beresolusi tinggi"}, {"step": "Cart & Checkout", "detail": "Form pemesanan ringkas yang langsung mentransformasikan item ke WhatsApp payload"}, {"step": "Inventory Sync", "detail": "Pengecekan ketersediaan stok secara otomatis sebelum pesan diteruskan"}]'::jsonb,
    '[{"table": "products", "fields": ["id (PK)", "sku", "title", "price", "stock"]}, {"table": "orders", "fields": ["id (PK)", "customer_phone", "order_data", "created_at"]}]'::jsonb,
    '{"language": "php", "filename": "OrderController.php", "code": "public function checkout(Request $request) {\n    $order = Order::create($request->validated());\n    return redirect(\"https://wa.me/\" . config(\"app.admin_wa\"));\n}"}'::jsonb,
    3
),
(
    'Renbook (Project Lead)',
    'renbook-online-rental',
    'Platform Penyewaan Buku Online & Rental Management (2023)',
    'Memimpin perancangan dan implementasi platform sewa buku online dengan analisis kebutuhan komprehensif menggunakan UML diagrams (Use Case, Activity, Sequence, Class). Mendukung 25+ koleksi buku, alur peminjaman user-friendly, dan tracking status sewa.',
    'laravel',
    ARRAY['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'Bootstrap', 'Laravel Auth'],
    false,
    'lg:col-span-6',
    '',
    'https://github.com/raakaprx/renbook-platform',
    '[{"label": "Katalog", "value": "25+ Book Titles"}, {"label": "Analisis Sistem", "value": "4 UML Diagram Types"}, {"label": "Pelacakan", "value": "Tracking Status Sewa"}, {"label": "Peran", "value": "Project Lead & Full Stack"}]'::jsonb,
    '[{"step": "UML Modeling", "detail": "Pemodelan use-case, sequence, dan class diagram sebelum implementasi kode"}, {"step": "Rental Pipeline", "detail": "Sistem reservasi, batas kuota pinjam per pengguna, dan verifikasi ketersediaan buku"}, {"step": "Return & Tracking", "detail": "Pencatatan tanggal jatuh tempo dan pemantauan status pengembalian otomatis"}]'::jsonb,
    '[{"table": "books", "fields": ["id (PK)", "isbn", "title", "author", "available_copies"]}, {"table": "rentals", "fields": ["id (PK)", "user_id (FK)", "book_id (FK)", "rent_date", "return_due"]}]'::jsonb,
    '{"language": "php", "filename": "RentalService.php", "code": "public function createRental(User $user, Book $book) {\n    $book->decrement(\"available_copies\");\n    return Rental::create([...]);\n}"}'::jsonb,
    4
),
(
    'Midtrans Payment Gateway Integration',
    'midtrans-payment-integration',
    'Integrasi Sistem Pembayaran Digital & Webhook Aman (2023)',
    'Mengintegrasikan payment processing menggunakan Midtrans dengan implementasi callback handling aman, verifikasi signature kriptografis SHA-512, dan comprehensive transaction logging yang memenuhi standar audit.',
    'fullstack',
    ARRAY['PHP', 'Laravel', 'Midtrans', 'MySQL', 'RESTful APIs', 'JWT'],
    false,
    'lg:col-span-6',
    '',
    'https://github.com/raakaprx/midtrans-laravel-integration',
    '[{"label": "Keamanan", "value": "SHA-512 Signature Hash"}, {"label": "Kanal Bayar", "value": "Multi Payment Channels"}, {"label": "Audit", "value": "100% Transaction Logged"}, {"label": "Protokol", "value": "Token-Based & HTTPS"}]'::jsonb,
    '[{"step": "Snap Token Generation", "detail": "Backend membuat payload transaksi dan meminta Snap Token dari Midtrans API"}, {"step": "Customer Checkout", "detail": "Modal pembayaran responsif Midtrans memproses pembayaran user"}, {"step": "Webhook Callback", "detail": "Midtrans mengirim HTTP POST callback yang diverifikasi dengan SHA-512 signature"}, {"step": "Database Settlement", "detail": "Update status transaksi secara atomic dalam database transaction"}]'::jsonb,
    '[{"table": "orders", "fields": ["id (PK)", "user_id", "total_price", "payment_status"]}, {"table": "payment_logs", "fields": ["id (PK)", "order_id", "transaction_id", "status_code", "raw_response"]}]'::jsonb,
    '{"language": "php", "filename": "PaymentWebhookController.php", "code": "public function handleNotification(Request $request) {\n    // Verify SHA-512 signature\n}"}'::jsonb,
    5
),
(
    'Vehicle Price Prediction Model',
    'vehicle-price-prediction-model',
    'Machine Learning Model untuk Prediksi Harga Kendaraan (2024)',
    'Membangun linear regression model menggunakan Python yang mencapai akurasi 87% dalam memprediksi harga kendaraan berdasarkan fitur-fitur spesifik. Meliputi exploratory data analysis (EDA), feature engineering, data scaling, dan cross-validation.',
    'machine-learning',
    ARRAY['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'Seaborn'],
    true,
    'lg:col-span-12',
    '',
    'https://github.com/raakaprx/vehicle-price-prediction',
    '[{"label": "Akurasi Model", "value": "87% Accuracy"}, {"label": "Algoritma", "value": "Linear Regression"}, {"label": "Validasi", "value": "Cross-Validation"}, {"label": "Teknik", "value": "Feature Scaling & Cleaning"}]'::jsonb,
    '[{"step": "Data Harvesting & EDA", "detail": "Analisis distribusi fitur kendaraan, korelasi variabel, dan visualisasi distribusi"}, {"step": "Data Cleaning", "detail": "Penanganan missing values, deteksi outlier, dan standardisasi fitur"}, {"step": "Feature Engineering", "detail": "Penskalaan nilai numerik (StandardScaler) dan one-hot encoding variabel kategori"}, {"step": "Model Evaluation", "detail": "Pelatihan Linear Regression dengan evaluasi k-fold cross-validation menghasilkan akurasi 87%"}]'::jsonb,
    '[{"table": "vehicle_dataset", "fields": ["id", "brand", "year", "mileage", "engine_size", "price"]}, {"table": "model_metrics", "fields": ["model_name", "r2_score", "mae", "rmse", "trained_at"]}]'::jsonb,
    '{"language": "python", "filename": "train_price_model.py", "code": "model = LinearRegression()\nmodel.fit(X_train, y_train)\nscore = model.score(X_test, y_test)"}'::jsonb,
    6
);

-- Tech Stacks
INSERT INTO public.tech_stacks (name, category, proficiency, order_index)
VALUES 
-- Frontend
('React', 'Frontend Development', 'Advanced', 1),
('Next.js', 'Frontend Development', 'Advanced', 2),
('TypeScript', 'Frontend Development', 'Advanced', 3),
('JavaScript', 'Frontend Development', 'Advanced', 4),
('Tailwind CSS', 'Frontend Development', 'Advanced', 5),
('HTML5', 'Frontend Development', 'Advanced', 6),
('CSS3', 'Frontend Development', 'Advanced', 7),
-- Backend
('Laravel', 'Backend & Systems', 'Advanced', 1),
('PHP', 'Backend & Systems', 'Advanced', 2),
('Node.js', 'Backend & Systems', 'Proficient', 3),
('Express.js', 'Backend & Systems', 'Proficient', 4),
('Python', 'Backend & Systems', 'Proficient', 5),
('RESTful APIs', 'Backend & Systems', 'Advanced', 6),
('JWT Auth', 'Backend & Systems', 'Advanced', 7),
('Midtrans Payment', 'Backend & Systems', 'Advanced', 8),
-- Databases
('PostgreSQL', 'Databases & Storage', 'Advanced', 1),
('MySQL', 'Databases & Storage', 'Advanced', 2),
('Prisma ORM', 'Databases & Storage', 'Advanced', 3),
('Redis', 'Databases & Storage', 'Proficient', 4),
-- Tools & AI
('Scikit-Learn', 'AI / Data Science & Tools', 'Proficient', 1),
('Pandas', 'AI / Data Science & Tools', 'Proficient', 2),
('NumPy', 'AI / Data Science & Tools', 'Proficient', 3),
('Docker', 'AI / Data Science & Tools', 'Proficient', 4),
('Git', 'AI / Data Science & Tools', 'Advanced', 5),
('GitHub', 'AI / Data Science & Tools', 'Advanced', 6);
