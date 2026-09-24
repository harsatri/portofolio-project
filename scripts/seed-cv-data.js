const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seed() {
  console.log('--- Seeding Projects with CV-Aligned Tech Stacks & Rich Markdown ---');

  // Clear existing projects to avoid duplicate slugs
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const projects = [
    {
      title: 'Smart Material Management System (SMMS)',
      slug: 'smart-material-management-system',
      subtitle: 'Lead Full-Stack Developer & System Analyst',
      role: 'Lead Full-Stack Developer & System Analyst',
      category: 'fullstack',
      summary:
        'Aplikasi web pergudangan full-stack terintegrasi dengan 9 modul operasional, otentikasi RBAC 5 role, dan notifikasi real-time Socket.IO.',
      short_summary:
        'Aplikasi web pergudangan full-stack terintegrasi dengan 9 modul operasional, otentikasi RBAC 5 role, dan notifikasi real-time Socket.IO.',
      description: `## Ringkasan Proyek
Proyek Skripsi 2026 yang dikembangkan untuk PT. Sundaya Indonesia bekerja sama dengan Telkom University. Sistem ini mendigitalisasi seluruh alur kerja permintaan material (*material request*), persetujuan multi-level (*multi-tier approval*), pemantauan stok pergudangan (*stock monitoring*), dan pengadaan (*procurement*) yang sebelumnya dikelola secara manual berbasis spreadsheet.

## Masalah & Kebutuhan Bisnis
- Pencatatan stok material di berbagai site distribusi masih manual sehingga sering terjadi inkonsistensi data barang masuk dan keluar.
- Alur persetujuan (*approval*) permintaan material memakan waktu lama karena tidak tersedianya sistem notifikasi instan lintas hierarki manajemen.
- Ketiadaan audit trail transparan untuk setiap perpindahan material antar gudang.

## Solusi Arsitektur
- **9 Modul Terintegrasi**: Mengelola siklus material dari request awal, verifikasi teknis, approval bertingkat, hingga update kartu stok gudang.
- **5 Tingkat Hak Akses (RBAC)**: Pembagian akses tegas antara Admin, NOC, Operations Manager, General Manager, dan Tim Gudang.
- **Notifikasi Real-Time Socket.IO**: Sinkronisasi instan saat status request disetujui atau ditolak tanpa perlu refresh halaman.
- **Containerized Deployment**: Pengemasan seluruh service menggunakan Docker untuk konsistensi di environment staging dan production.

## Fitur Utama
- **Real-Time Stock Monitoring**: Dashboard interaktif yang menampilkan ketersediaan komponen inverter, baterai solar, dan aksesoris secara langsung.
- **Multi-Level Approval Pipeline**: Alur delegasi approval terstruktur dengan tracking timestamp dan identitas penyetujui.
- **Automated Audit Logging**: Riwayat lengkap seluruh tindakan inventaris untuk kebutuhan compliance perusahaan.`,
      full_description: `## Ringkasan Proyek
Proyek Skripsi 2026 yang dikembangkan untuk PT. Sundaya Indonesia bekerja sama dengan Telkom University. Sistem ini mendigitalisasi seluruh alur kerja permintaan material (*material request*), persetujuan multi-level (*multi-tier approval*), pemantauan stok pergudangan (*stock monitoring*), dan pengadaan (*procurement*) yang sebelumnya dikelola secara manual berbasis spreadsheet.

## Masalah & Kebutuhan Bisnis
- Pencatatan stok material di berbagai site distribusi masih manual sehingga sering terjadi inkonsistensi data barang masuk dan keluar.
- Alur persetujuan (*approval*) permintaan material memakan waktu lama karena tidak tersedianya sistem notifikasi instan lintas hierarki manajemen.
- Ketiadaan audit trail transparan untuk setiap perpindahan material antar gudang.

## Solusi Arsitektur
- **9 Modul Terintegrasi**: Mengelola siklus material dari request awal, verifikasi teknis, approval bertingkat, hingga update kartu stok gudang.
- **5 Tingkat Hak Akses (RBAC)**: Pembagian akses tegas antara Admin, NOC, Operations Manager, General Manager, dan Tim Gudang.
- **Notifikasi Real-Time Socket.IO**: Sinkronisasi instan saat status request disetujui atau ditolak tanpa perlu refresh halaman.
- **Containerized Deployment**: Pengemasan seluruh service menggunakan Docker untuk konsistensi di environment staging dan production.

## Fitur Utama
- **Real-Time Stock Monitoring**: Dashboard interaktif yang menampilkan ketersediaan komponen inverter, baterai solar, dan aksesoris secara langsung.
- **Multi-Level Approval Pipeline**: Alur delegasi approval terstruktur dengan tracking timestamp dan identitas penyetujui.
- **Automated Audit Logging**: Riwayat lengkap seluruh tindakan inventaris untuk kebutuhan compliance perusahaan.`,
      thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
      gallery_urls: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
      ],
      tags: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Socket.IO', 'Docker', 'JWT', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'RESTful APIs'],
      tech_stacks: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Socket.IO', 'Docker', 'JWT', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'RESTful APIs'],
      demo_url: 'https://github.com/raakaprx/warehouse-sundaya-v2',
      live_url: 'https://github.com/raakaprx/warehouse-sundaya-v2',
      github_url: 'https://github.com/raakaprx/warehouse-sundaya-v2',
      repo_url: 'https://github.com/raakaprx/warehouse-sundaya-v2',
      featured: true,
      is_featured: true,
      order_index: 1,
      display_order: 1,
      metrics: [
        { label: 'Modul', value: '9 Modul Terpadu' },
        { label: 'RBAC', value: '5 User Roles' },
        { label: 'Socket', value: 'Real-Time Telemetry' },
        { label: 'Deploy', value: 'Docker Container' }
      ]
    },
    {
      title: 'Plastani',
      slug: 'plastani-umkm-ecommerce',
      subtitle: 'Full-Stack Developer | Platform E-Commerce UMKM',
      role: 'Full-Stack Developer',
      category: 'laravel',
      summary:
        'Platform e-commerce agrikultur untuk UMKM dan petani lokal dengan katalog produk terorganisir, integrasi order WhatsApp, dan analitik penjualan.',
      short_summary:
        'Platform e-commerce agrikultur untuk UMKM dan petani lokal dengan katalog produk terorganisir, integrasi order WhatsApp, dan analitik penjualan.',
      description: `## Ringkasan Proyek
Plastani merupakan platform e-commerce digital yang dirancang untuk memberdayakan UMKM dan kelompok tani lokal agar dapat memasarkan produk hasil panen dan olahan pertanian secara mandiri ke konsumen luas.

## Masalah & Kebutuhan
- Rantai pasok konvensional yang panjang sering memotong margin keuntungan petani lokal.
- Pembeli di daerah rural lebih nyaman melakukan konfirmasi pesanan secara personal melalui pesan instan daripada alur checkout yang rumit.

## Solusi & Arsitektur
- Dibangun menggunakan framework **Laravel MVC** dengan performa render cepat berbasis Blade dan Tailwind CSS.
- Integrasi **WhatsApp Direct Order Link** yang secara otomatis mengonversi keranjang belanja menjadi pesan terstruktur berisi daftar produk, kuantitas, dan total harga.
- Panel admin mandiri untuk memantau performa penjualan, menambahkan artikel panduan bertani, dan mengelola stok produk.

## Fitur Utama
- **Katalog Produk Dinamis**: Filter kategori produk pertanian, harga, dan ketersediaan stok real-time.
- **Seamless WhatsApp Checkout**: Kemudahan transaksi langsung ke kontak WhatsApp resmi petani atau admin.
- **Admin Analytics Dashboard**: Rekapitulasi transaksi, performa katalog terlaris, dan manajemen inventaris.`,
      full_description: `## Ringkasan Proyek
Plastani merupakan platform e-commerce digital yang dirancang untuk memberdayakan UMKM dan kelompok tani lokal agar dapat memasarkan produk hasil panen dan olahan pertanian secara mandiri ke konsumen luas.

## Masalah & Kebutuhan
- Rantai pasok konvensional yang panjang sering memotong margin keuntungan petani lokal.
- Pembeli di daerah rural lebih nyaman melakukan konfirmasi pesanan secara personal melalui pesan instan daripada alur checkout yang rumit.

## Solusi & Arsitektur
- Dibangun menggunakan framework **Laravel MVC** dengan performa render cepat berbasis Blade dan Tailwind CSS.
- Integrasi **WhatsApp Direct Order Link** yang secara otomatis mengonversi keranjang belanja menjadi pesan terstruktur berisi daftar produk, kuantitas, dan total harga.
- Panel admin mandiri untuk memantau performa penjualan, menambahkan artikel panduan bertani, dan mengelola stok produk.

## Fitur Utama
- **Katalog Produk Dinamis**: Filter kategori produk pertanian, harga, dan ketersediaan stok real-time.
- **Seamless WhatsApp Checkout**: Kemudahan transaksi langsung ke kontak WhatsApp resmi petani atau admin.
- **Admin Analytics Dashboard**: Rekapitulasi transaksi, performa katalog terlaris, dan manajemen inventaris.`,
      thumbnail_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1200&auto=format&fit=crop',
      gallery_urls: [
        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1200&auto=format&fit=crop'
      ],
      tags: ['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'WhatsApp API', 'Laravel Auth'],
      tech_stacks: ['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'WhatsApp API', 'Laravel Auth'],
      demo_url: 'https://github.com/raakaprx/plastani-ecommerce',
      live_url: 'https://github.com/raakaprx/plastani-ecommerce',
      github_url: 'https://github.com/raakaprx/plastani-ecommerce',
      repo_url: 'https://github.com/raakaprx/plastani-ecommerce',
      featured: true,
      is_featured: true,
      order_index: 2,
      display_order: 2,
      metrics: [
        { label: 'Target', value: 'Petani & UMKM' },
        { label: 'Checkout', value: 'WhatsApp Gateway' },
        { label: 'Admin', value: 'Analytics Report' },
        { label: 'Security', value: 'Laravel RBAC' }
      ]
    },
    {
      title: 'JajanSepy',
      slug: 'jajansepy-single-brand',
      subtitle: 'Full Stack Developer | Single Brand UMKM',
      role: 'Full Stack Developer',
      category: 'laravel',
      summary:
        'Web store single-brand UMKM kuliner dengan integrasi komunikasi WhatsApp Admin dan manajemen inventaris stok terpadu.',
      short_summary:
        'Web store single-brand UMKM kuliner dengan integrasi komunikasi WhatsApp Admin dan manajemen inventaris stok terpadu.',
      description: `## Ringkasan Proyek
Platform penjualan online yang dikembangkan khusus untuk lini produk single-brand UMKM kuliner. Mengutamakan kemudahan navigasi bagi pelanggan dan pengelolaan stok yang efisien bagi pemilik usaha.

## Solusi Teknis
- Arsitektur berbasis Laravel dengan sistem inventory tracking otomatis.
- Format checkout yang ringkas dan memicu pembuatan order payload ke WhatsApp Admin secara instan.
- Tampilan responsif dengan visualisasi produk beresolusi tinggi untuk memaksimalkan daya tarik pelanggan.`,
      full_description: `## Ringkasan Proyek
Platform penjualan online yang dikembangkan khusus untuk lini produk single-brand UMKM kuliner. Mengutamakan kemudahan navigasi bagi pelanggan dan pengelolaan stok yang efisien bagi pemilik usaha.

## Solusi Teknis
- Arsitektur berbasis Laravel dengan sistem inventory tracking otomatis.
- Format checkout yang ringkas dan memicu pembuatan order payload ke WhatsApp Admin secara instan.
- Tampilan responsif dengan visualisasi produk beresolusi tinggi untuk memaksimalkan daya tarik pelanggan.`,
      thumbnail_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
      gallery_urls: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop'
      ],
      tags: ['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'JavaScript', 'HTML5', 'CSS3', 'WhatsApp Admin API', 'Laravel Auth'],
      tech_stacks: ['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'JavaScript', 'HTML5', 'CSS3', 'WhatsApp Admin API', 'Laravel Auth'],
      demo_url: 'https://github.com/raakaprx/jajansepy-ecommerce',
      live_url: 'https://github.com/raakaprx/jajansepy-ecommerce',
      github_url: 'https://github.com/raakaprx/jajansepy-ecommerce',
      repo_url: 'https://github.com/raakaprx/jajansepy-ecommerce',
      featured: true,
      is_featured: true,
      order_index: 3,
      display_order: 3,
      metrics: [
        { label: 'Model', value: 'Single Brand' },
        { label: 'Order', value: 'WhatsApp API' },
        { label: 'Inventory', value: 'Live Stock Tracking' }
      ]
    },
    {
      title: 'Renbook',
      slug: 'renbook-online-rental',
      subtitle: 'Project Lead & Full-Stack Developer',
      role: 'Project Lead & Full-Stack Developer',
      category: 'laravel',
      summary:
        'Sistem informasi peminjaman dan rental buku online dengan pemodelan 4 diagram UML, manajemen denda, dan pelacakan status sewa.',
      short_summary:
        'Sistem informasi peminjaman dan rental buku online dengan pemodelan 4 diagram UML, manajemen denda, dan pelacakan status sewa.',
      description: `## Ringkasan Proyek
Memimpin perancangan dan implementasi platform sewa buku online dari tahap pemodelan kebutuhan sistem hingga siap digunakan. Mendukung katalog 25+ buku, pembatasan kuota peminjaman per akun, dan kalkulasi denda otomatis.

## Pemodelan Rekayasa Perangkat Lunak
- Menggunakan 4 diagram UML: Use Case Diagram, Activity Diagram, Sequence Diagram, dan Class Diagram.
- Arsitektur modular memisahkan business logic sewa dengan sistem pelaporan admin.

## Fitur Utama
- **Katalog & Status Eksemplar**: Menampilkan stok ketersediaan eksemplar buku secara real-time.
- **Rental Life-Cycle**: Pencatatan tanggal pinjam, batas waktu pengembalian, dan histori peminjam.
- **Overdue Tracking**: Peringatan otomatis untuk buku yang melewati tanggal jatuh tempo.`,
      full_description: `## Ringkasan Proyek
Memimpin perancangan dan implementasi platform sewa buku online dari tahap pemodelan kebutuhan sistem hingga siap digunakan. Mendukung katalog 25+ buku, pembatasan kuota peminjaman per akun, dan kalkulasi denda otomatis.

## Pemodelan Rekayasa Perangkat Lunak
- Menggunakan 4 diagram UML: Use Case Diagram, Activity Diagram, Sequence Diagram, dan Class Diagram.
- Arsitektur modular memisahkan business logic sewa dengan sistem pelaporan admin.

## Fitur Utama
- **Katalog & Status Eksemplar**: Menampilkan stok ketersediaan eksemplar buku secara real-time.
- **Rental Life-Cycle**: Pencatatan tanggal pinjam, batas waktu pengembalian, dan histori peminjam.
- **Overdue Tracking**: Peringatan otomatis untuk buku yang melewati tanggal jatuh tempo.`,
      thumbnail_url: 'https://images.unsplash.com/photo-1507842229451-79b1be8d62a2?q=80&w=1200&auto=format&fit=crop',
      gallery_urls: [
        'https://images.unsplash.com/photo-1507842229451-79b1be8d62a2?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop'
      ],
      tags: ['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3', 'Laravel Auth', 'UML Modeling'],
      tech_stacks: ['PHP', 'Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3', 'Laravel Auth', 'UML Modeling'],
      demo_url: 'https://github.com/raakaprx/renbook-platform',
      live_url: 'https://github.com/raakaprx/renbook-platform',
      github_url: 'https://github.com/raakaprx/renbook-platform',
      repo_url: 'https://github.com/raakaprx/renbook-platform',
      featured: true,
      is_featured: true,
      order_index: 4,
      display_order: 4,
      metrics: [
        { label: 'Katalog', value: '25+ Judul Buku' },
        { label: 'UML Models', value: '4 Diagram Types' },
        { label: 'Tracking', value: 'Overdue System' }
      ]
    },
    {
      title: 'Midtrans Payment Gateway Integration',
      slug: 'midtrans-payment-integration',
      subtitle: 'Backend Developer | Integrasi Pembayaran Aman',
      role: 'Backend Developer',
      category: 'fullstack',
      summary:
        'Microservice pembayaran digital dengan verifikasi signature kriptografis SHA-512, webhook callback asinkron, dan transaction audit log.',
      short_summary:
        'Microservice pembayaran digital dengan verifikasi signature kriptografis SHA-512, webhook callback asinkron, dan transaction audit log.',
      description: `## Ringkasan Proyek
Implementasi modul pembayaran digital menyeluruh menggunakan Midtrans API. Menjamin integritas data transaksi keuangan dengan validasi signature kriptografis SHA-512 dan audit logging komprehensif.

## Arsitektur Keamanan Transaksi
- **Snap Token Generation**: Token pembayaran dibuat secara aman di server tanpa mengekspos server-key ke frontend.
- **Asynchronous Webhook Callback**: Menerima HTTP POST notification dari Midtrans dan memverifikasi kesesuaian signature key sebelum mengubah status settlement.
- **Idempotent Handling**: Mencegah duplikasi kredit atau pengiriman barang ganda saat callback diterima berulang kali.`,
      full_description: `## Ringkasan Proyek
Implementasi modul pembayaran digital menyeluruh menggunakan Midtrans API. Menjamin integritas data transaksi keuangan dengan validasi signature kriptografis SHA-512 dan audit logging komprehensif.

## Arsitektur Keamanan Transaksi
- **Snap Token Generation**: Token pembayaran dibuat secara aman di server tanpa mengekspos server-key ke frontend.
- **Asynchronous Webhook Callback**: Menerima HTTP POST notification dari Midtrans dan memverifikasi kesesuaian signature key sebelum mengubah status settlement.
- **Idempotent Handling**: Mencegah duplikasi kredit atau pengiriman barang ganda saat callback diterima berulang kali.`,
      thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=1200&auto=format&fit=crop',
      gallery_urls: [
        'https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=1200&auto=format&fit=crop'
      ],
      tags: ['PHP', 'Laravel', 'Midtrans', 'MySQL', 'RESTful APIs', 'Token-based Auth', 'SHA-512 Encryption'],
      tech_stacks: ['PHP', 'Laravel', 'Midtrans', 'MySQL', 'RESTful APIs', 'Token-based Auth', 'SHA-512 Encryption'],
      demo_url: 'https://github.com/raakaprx/midtrans-laravel-integration',
      live_url: 'https://github.com/raakaprx/midtrans-laravel-integration',
      github_url: 'https://github.com/raakaprx/midtrans-laravel-integration',
      repo_url: 'https://github.com/raakaprx/midtrans-laravel-integration',
      featured: false,
      is_featured: false,
      order_index: 5,
      display_order: 5,
      metrics: [
        { label: 'Security', value: 'SHA-512 Hash' },
        { label: 'Audit', value: '100% Logged' },
        { label: 'Channels', value: 'Multi Payment' }
      ]
    },
    {
      title: 'Vehicle Price Prediction Model',
      slug: 'vehicle-price-prediction-model',
      subtitle: 'Data Science Developer | ML Model Prediksi Harga',
      role: 'Data Science Developer',
      category: 'machine-learning',
      summary:
        'Model regresi machine learning berbasis Python dengan akurasi 87% untuk estimasi harga kendaraan berdasarkan spesifikasi teknis dan kondisi.',
      short_summary:
        'Model regresi machine learning berbasis Python dengan akurasi 87% untuk estimasi harga kendaraan berdasarkan spesifikasi teknis dan kondisi.',
      description: `## Ringkasan Proyek
Pengembangan model estimasi harga wajar kendaraan menggunakan teknik machine learning regresi. Model ini mencapai akurasi sebesar 87% dalam memprediksi nilai pasar berdasarkan kombinasi parameter teknis dan historis.

## Alur Data Science Pipeline
1. **Exploratory Data Analysis (EDA)**: Analisis distribusi harga, korelasi fitur mesin dan usia kendaraan, serta deteksi nilai pencilan (*outlier*).
2. **Data Preprocessing & Cleaning**: Penanganan nilai kosong (*missing values*) dan standarisasi format data.
3. **Feature Scaling**: Penerapan StandardScaler untuk fitur numerik serta One-Hot Encoding untuk fitur kategori (*brand* dan tipe transmisi).
4. **Model Training & Evaluation**: Pelatihan algoritma Linear Regression yang divalidasi menggunakan k-fold cross-validation.`,
      full_description: `## Ringkasan Proyek
Pengembangan model estimasi harga wajar kendaraan menggunakan teknik machine learning regresi. Model ini mencapai akurasi sebesar 87% dalam memprediksi nilai pasar berdasarkan kombinasi parameter teknis dan historis.

## Alur Data Science Pipeline
1. **Exploratory Data Analysis (EDA)**: Analisis distribusi harga, korelasi fitur mesin dan usia kendaraan, serta deteksi nilai pencilan (*outlier*).
2. **Data Preprocessing & Cleaning**: Penanganan nilai kosong (*missing values*) dan standarisasi format data.
3. **Feature Scaling**: Penerapan StandardScaler untuk fitur numerik serta One-Hot Encoding untuk fitur kategori (*brand* dan tipe transmisi).
4. **Model Training & Evaluation**: Pelatihan algoritma Linear Regression yang divalidasi menggunakan k-fold cross-validation.`,
      thumbnail_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
      gallery_urls: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop'
      ],
      tags: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Linear Regression', 'Cross-Validation'],
      tech_stacks: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Linear Regression', 'Cross-Validation'],
      demo_url: 'https://github.com/raakaprx/vehicle-price-prediction',
      live_url: 'https://github.com/raakaprx/vehicle-price-prediction',
      github_url: 'https://github.com/raakaprx/vehicle-price-prediction',
      repo_url: 'https://github.com/raakaprx/vehicle-price-prediction',
      featured: false,
      is_featured: false,
      order_index: 6,
      display_order: 6,
      metrics: [
        { label: 'Accuracy', value: '87% Score' },
        { label: 'Model', value: 'Linear Regression' },
        { label: 'Validation', value: 'Cross-Validation' }
      ]
    }
  ];

  for (const proj of projects) {
    // Attempt insert with all columns first
    let { error } = await supabase.from('projects').insert(proj);
    
    // If Supabase throws schema cache error on new columns, retry with legacy fields
    if (error && error.message.includes('Could not find')) {
      console.warn('Retrying with legacy payload for:', proj.title);
      const legacyPayload = {
        title: proj.title,
        slug: proj.slug,
        subtitle: proj.subtitle,
        category: proj.category,
        summary: proj.summary,
        description: proj.description,
        thumbnail_url: proj.thumbnail_url,
        tags: proj.tags,
        demo_url: proj.demo_url,
        github_url: proj.github_url,
        featured: proj.featured,
        order_index: proj.order_index,
        metrics: proj.metrics
      };
      const res = await supabase.from('projects').insert(legacyPayload);
      error = res.error;
    }

    if (error) {
      console.error('Error inserting project:', proj.title, error.message);
    } else {
      console.log('✓ Project seeded successfully:', proj.title);
    }
  }

  console.log('\n--- Seeding Completed Successfully! ---');
}

seed();
