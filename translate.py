import re

file_path = 'c:/portofolio-project/lib/portfolio-defaults.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        '''"Lulusan S1 Sistem Informasi dari Universitas Telkom (menunggu wisuda) dengan fokus pada pengembangan web dan sistem secara full-stack. Berpengalaman membangun aplikasi berbasis web, mencakup pengembangan frontend dan backend, manajemen basis data, integrasi REST API, serta perancangan sistem. Memiliki pengalaman tambahan dalam pengembangan machine learning menggunakan Python dan Scikit-learn."''',
        '''"Information Systems graduate from Telkom University (awaiting graduation) focusing on full-stack web and system development. Experienced in building web-based applications, including frontend and backend development, database management, REST API integration, and system design. Has additional experience in machine learning development using Python and Scikit-learn."'''
    ),
    (
        '''"Merancang platform pemesanan (booking) berbasis web yang responsif menggunakan Figma, menerjemahkan kebutuhan stakeholder menjadi user flow, wireframe, antarmuka high-fidelity, dan prototipe interaktif."''',
        '''"Designed a responsive web-based booking platform using Figma, translating stakeholder requirements into user flows, wireframes, high-fidelity interfaces, and interactive prototypes."'''
    ),
    (
        '''"Berkolaborasi dengan stakeholder untuk menentukan alur pemesanan dan struktur halaman, serta melakukan iterasi desain berdasarkan masukan untuk meningkatkan usability dan pengalaman pengguna."''',
        '''"Collaborated with stakeholders to define booking flows and page structures, and iterated designs based on feedback to improve usability and user experience."'''
    ),
    (
        '''"Menyiapkan design handoff untuk developer dan berkontribusi pada implementasi frontend menggunakan JavaScript dan Tailwind CSS, menjembatani desain UI/UX dengan antarmuka yang diimplementasikan."''',
        '''"Prepared design handoffs for developers and contributed to frontend implementation using JavaScript and Tailwind CSS, bridging UI/UX design with the implemented interface."'''
    ),
    (
        '''{ label: "Lokasi", value: "Baturraden, Indonesia" },''',
        '''{ label: "Location", value: "Baturraden, Indonesia" },'''
    ),
    (
        '''{ label: "Periode", value: "Jan – Jun 2025" },''',
        '''{ label: "Period", value: "Jan – Jun 2025" },'''
    ),
    (
        '''{ label: "Fokus Proyek", value: "Web Booking Platform" },''',
        '''{ label: "Project Focus", value: "Web Booking Platform" },'''
    ),
    (
        '''"Sistem Informasi & Layanan Sewa Lokasi",\n      "Hak Kekayaan Intelektual (HKI)",\n      "BLUD Lokawisata Baturraden",''',
        '''"Information Systems & Location Rental Services",\n      "Intellectual Property Rights (IPR)",\n      "BLUD Lokawisata Baturraden",'''
    ),
    (
        '''"Pengembangan Web (CWDev)",\n      "Rekayasa Perangkat Lunak",\n      "Standar Kompetensi Kerja Nasional Indonesia (SKKNI)",''',
        '''"Web Development (CWDev)",\n      "Software Engineering",\n      "Indonesian National Work Competency Standards (SKKNI)",'''
    ),
    (
        '''"Karya Tulis Ilmiah",\n      "Penelitian & Analisis Data",''',
        '''"Scientific Writing",\n      "Research & Data Analysis",'''
    ),
    (
        '''date: "Mei 2022",''',
        '''date: "May 2022",'''
    ),
    (
        '''"Pemrograman Komputer",\n      "Rekayasa Perangkat Lunak (RPL)",\n      "KKNI Level II",''',
        '''"Computer Programming",\n      "Software Engineering (RPL)",\n      "KKNI Level II",'''
    ),
    (
        '''title: "DILAYAKIN — Sistem Evaluasi Kelayakan Calon Siswa Berbasis Web",\n    role: "Full-Stack Developer | Proyek Tugas Akhir",''',
        '''title: "DILAYAKIN — Web-Based Prospective Student Eligibility Evaluation System",\n    role: "Full-Stack Developer | Final Project",'''
    ),
    (
        '''short_summary:\n      "Sistem pendukung keputusan berbasis web secara full-stack untuk penyaringan awal calon siswa sekolah dasar menggunakan React.js, Vite, Express.js, dan MySQL dengan metode Simple Additive Weighting (SAW).",\n    full_description: `## Ringkasan Proyek\nProyek Tugas Akhir 2025 – 2026 yang mengimplementasikan sistem pendukung keputusan (SPK) berbasis web untuk penyaringan awal kelayakan calon siswa sekolah dasar. Sistem ini mengintegrasikan metode Simple Additive Weighting (SAW) untuk evaluasi kelayakan dan rekomendasi sekolah yang objektif dan terukur.\n\n## Kebutuhan & Tantangan\n- Proses penyaringan calon siswa sebelumnya menghadapi kendala manual dan subjektivitas dalam penilaian kriteria kelayakan.\n- Diperlukan platform terpusat yang mampu menangani simulasi kelayakan, manajemen kriteria dinamis, serta memberikan rekomendasi sekolah bagi orang tua dan panitia penerimaan siswa.\n\n## Solusi & Arsitektur\n- **Full-Stack SPA**: Dibangun menggunakan React.js dan Vite pada sisi antarmuka, didukung oleh Express.js REST API dan database MySQL.\n- **Metode Simple Additive Weighting (SAW)**: Menerapkan algoritma pembobotan kriteria terstandarisasi untuk menghasilkan skor kelayakan dan pemeringkatan rekomendasi sekolah secara otomatis.\n- **Role-Based Access Control (RBAC)**: Autentikasi dan kontrol akses multi-peran untuk admin sekolah, evaluator kriteria, dan pendaftar umum.\n- **Metodologi RAD (Rapid Application Development)**: Pengembangan iteratif berbasis masukan langsung dari sekolah mitra dan Dinas Pendidikan setempat.\n\n## Pengujian & Hasil\n- Pengujian fungsional menyeluruh dengan Black Box Testing.\n- Pengujian User Acceptance Testing (UAT) bersama pihak sekolah dan orang tua siswa menghasilkan skor penerimaan sebesar **89,59% (kategori Sangat Layak)**.`,''',
        '''short_summary:\n      "A full-stack web-based decision support system for the initial screening of prospective elementary school students using React.js, Vite, Express.js, and MySQL with the Simple Additive Weighting (SAW) method.",\n    full_description: `## Project Summary\nFinal Project 2025 – 2026 implementing a web-based decision support system (DSS) for the initial eligibility screening of prospective elementary school students. This system integrates the Simple Additive Weighting (SAW) method for objective and measurable eligibility evaluation and school recommendations.\n\n## Requirements & Challenges\n- The previous student screening process faced manual constraints and subjectivity in assessing eligibility criteria.\n- A centralized platform was needed to handle eligibility simulation, dynamic criteria management, and provide school recommendations for parents and student admission committees.\n\n## Solutions & Architecture\n- **Full-Stack SPA**: Built using React.js and Vite on the frontend, supported by Express.js REST API and MySQL database.\n- **Simple Additive Weighting (SAW) Method**: Implemented a standardized criteria weighting algorithm to automatically generate eligibility scores and school recommendation rankings.\n- **Role-Based Access Control (RBAC)**: Authentication and multi-role access control for school admins, criteria evaluators, and general applicants.\n- **RAD (Rapid Application Development) Methodology**: Iterative development based on direct feedback from partner schools and the local Education Office.\n\n## Testing & Results\n- Comprehensive functional testing with Black Box Testing.\n- User Acceptance Testing (UAT) with school officials and parents yielded an acceptance score of **89.59% (Highly Feasible category)**.`,'''
    ),
    (
        '''subtitle: "Sistem Pendukung Keputusan Kelayakan Calon Siswa (Metode SAW)",\n    description:\n      "Mengembangkan sistem pendukung keputusan berbasis web secara full-stack untuk penyaringan awal calon siswa SD menggunakan React.js, Express.js, dan MySQL dengan metode Simple Additive Weighting (SAW). UAT mencapai 89,59% (Sangat Layak).",''',
        '''subtitle: "Prospective Student Eligibility Decision Support System (SAW Method)",\n    description:\n      "Developed a full-stack web-based decision support system for initial elementary school student screening using React.js, Express.js, and MySQL with the Simple Additive Weighting (SAW) method. UAT reached 89.59% (Highly Feasible).",'''
    ),
    (
        '''{ label: "UAT Acceptance", value: "89,59% (Sangat Layak)" },\n      { label: "Metode SPK", value: "Simple Additive Weighting" },\n      { label: "Metodologi", value: "Rapid Application Dev" },\n      { label: "Arsitektur", value: "Full-Stack React & Express" },''',
        '''{ label: "UAT Acceptance", value: "89.59% (Highly Feasible)" },\n      { label: "DSS Method", value: "Simple Additive Weighting" },\n      { label: "Methodology", value: "Rapid Application Dev" },\n      { label: "Architecture", value: "Full-Stack React & Express" },'''
    ),
    (
        '''{ step: "Requirements Analysis", detail: "Pengembangan iteratif bersama sekolah mitra dan Dinas Pendidikan setempat" },\n      { step: "Kriteria & Pembobotan", detail: "Formulasi bobot kriteria kelayakan berbasis metode SAW" },\n      { step: "Full-Stack Implementation", detail: "REST API Express.js terintegrasi dengan frontend React.js dan database MySQL" },\n      { step: "Black Box & UAT Testing", detail: "Validasi fungsional dan pengujian penerimaan pengguna dengan hasil 89,59%" },''',
        '''{ step: "Requirements Analysis", detail: "Iterative development with partner schools and local Education Office" },\n      { step: "Criteria & Weighting", detail: "Formulation of eligibility criteria weights based on the SAW method" },\n      { step: "Full-Stack Implementation", detail: "Express.js REST API integrated with React.js frontend and MySQL database" },\n      { step: "Black Box & UAT Testing", detail: "Functional validation and user acceptance testing with 89.59% result" },'''
    ),
    (
        '''title: "Panpin Shoe Treatment — Sistem Kasir & Manajemen Bisnis Berbasis Web",\n    role: "Full-Stack Developer | Proyek Capstone",\n    year: "2025",\n    short_summary:\n      "Sistem kasir dan manajemen bisnis berbasis web untuk mendigitalisasi proses transaksi, manajemen layanan, pelaporan keuangan, dan otomasi notifikasi Telegram Bot.",\n    full_description: `## Ringkasan Proyek\nProyek Capstone 2025 yang bertujuan mendigitalisasi seluruh operasional Panpin Shoe Treatment, menggantikan pencatatan manual berbasis kertas menuju sistem manajemen kasir (POS) dan operasional terintegrasi.\n\n## Masalah & Kebutuhan Bisnis\n- Pencatatan transaksi dan antrean sepatu masih manual sehingga rentan terjadi kesalahan input dan kehilangan riwayat layanan.\n- Pelaporan keuangan harian dan bulanan memakan waktu rekapitulasi yang lama.\n- Pelanggan dan kasir membutuhkan update status pengerjaan yang cepat dan transparan.\n\n## Solusi & Arsitektur\n- **Full-Stack Laravel & MariaDB**: Sistem backend tangguh dengan kontrol akses berbasis peran (Admin/Owner, Kasir, Pengguna Operasional).\n- **Modul Transaksi & Layanan Lengkap**: Pencatatan order, status pengerjaan sepatu, invoice digital, dan rekapitulasi keuangan otomatis.\n- **Otomasi Telegram Bot & n8n**: Integrasi webhook untuk mengirimkan notifikasi transaksi dan progres layanan secara langsung dan real-time.\n- **Evaluasi Usability**: Pengujian System Usability Scale (SUS) bersama pemilik usaha dan kasir, memperoleh skor evaluasi 65 dan 72,5.`,''',
        '''title: "Panpin Shoe Treatment — Web-Based POS & Business Management System",\n    role: "Full-Stack Developer | Capstone Project",\n    year: "2025",\n    short_summary:\n      "A web-based point-of-sale and business management system to digitize transaction processes, service management, financial reporting, and automate Telegram Bot notifications.",\n    full_description: `## Project Summary\nCapstone Project 2025 aimed at digitizing all operations of Panpin Shoe Treatment, transitioning from manual paper-based recording to an integrated POS and operational management system.\n\n## Business Problems & Needs\n- Transaction and shoe queue recording were manual, making them prone to input errors and lost service history.\n- Daily and monthly financial reporting took a long time to recapitulate.\n- Customers and cashiers needed fast and transparent service status updates.\n\n## Solutions & Architecture\n- **Full-Stack Laravel & MariaDB**: Robust backend system with role-based access control (Admin/Owner, Cashier, Operational User).\n- **Complete Transaction & Service Module**: Order recording, shoe service status, digital invoices, and automatic financial recapitulation.\n- **Telegram Bot & n8n Automation**: Webhook integration to send direct and real-time transaction notifications and service progress.\n- **Usability Evaluation**: System Usability Scale (SUS) testing with the business owner and cashiers, obtaining evaluation scores of 65 and 72.5.`,'''
    ),
    (
        '''subtitle: "Sistem Kasir & Manajemen Bisnis Terintegrasi Telegram Bot",\n    description:\n      "Mengembangkan sistem kasir dan manajemen bisnis berbasis web menggunakan Laravel dan MariaDB dengan notifikasi real-time Telegram Bot via n8n serta kontrol akses multi-peran.",''',
        '''subtitle: "Integrated POS & Business Management System with Telegram Bot",\n    description:\n      "Developed a web-based POS and business management system using Laravel and MariaDB with real-time Telegram Bot notifications via n8n and multi-role access control.",'''
    ),
    (
        '''{ label: "Skor SUS", value: "65 & 72,5 (Usability)" },\n      { label: "Otomasi", value: "Telegram Bot & n8n" },\n      { label: "Kontrol Akses", value: "Role-Based Multi-User" },\n      { label: "Modul Inti", value: "Kasir & Laporan Keuangan" },''',
        '''{ label: "SUS Score", value: "65 & 72.5 (Usability)" },\n      { label: "Automation", value: "Telegram Bot & n8n" },\n      { label: "Access Control", value: "Role-Based Multi-User" },\n      { label: "Core Modules", value: "POS & Financial Reports" },'''
    ),
    (
        '''{ step: "Analisis Kebutuhan", detail: "Pemetaan proses manual kasir dan pelaporan Panpin Shoe Treatment" },\n      { step: "Perancangan Basis Data", detail: "Normalisasi tabel transaksi, layanan, pelanggan, dan audit keuangan pada MariaDB" },\n      { step: "Pengembangan Laravel", detail: "Implementasi MVC architecture, RBAC, dan modul kasir intuitif" },\n      { step: "Integrasi Bot & n8n", detail: "Pengiriman notifikasi otomatis perubahan status layanan ke Telegram" },''',
        '''{ step: "Requirements Analysis", detail: "Mapping manual POS and reporting processes of Panpin Shoe Treatment" },\n      { step: "Database Design", detail: "Normalization of transaction, service, customer, and financial audit tables on MariaDB" },\n      { step: "Laravel Development", detail: "Implementation of MVC architecture, RBAC, and intuitive POS module" },\n      { step: "Bot & n8n Integration", detail: "Automated notification delivery of service status changes to Telegram" },'''
    ),
    (
        '''title: "Skincare Product Catalog — Katalog Produk Skincare Berbasis Web",\n    role: "Full-Stack Developer | Proyek Pribadi",\n    year: "2024",\n    short_summary:\n      "Katalog produk skincare berbasis web untuk menampilkan produk, harga, deskripsi, dan detail produk melalui antarmuka yang bersih dan responsif.",\n    full_description: `## Ringkasan Proyek\nProyek web katalog produk personal bertema skincare yang dibangun untuk memamerkan katalog produk kecantikan dengan tampilan elegan, navigasi cepat, dan integrasi basis data dinamis.\n\n## Fitur Utama\n- **Katalog Produk Dinamis**: Menampilkan daftar produk dengan filter kategori, harga, status ketersediaan, dan detail spesifikasi produk.\n- **Antarmuka Responsif & Estetis**: Desain visual bersih dan modern dengan kartu produk terstruktur dan tata letak intuitif yang nyaman di perangkat mobile maupun desktop.\n- **Integrasi Basis Data**: Didukung backend Laravel dan MySQL untuk pengelolaan data produk yang terstruktur dan mudah diperbarui.`,''',
        '''title: "Skincare Product Catalog — Web-Based Skincare Product Catalog",\n    role: "Full-Stack Developer | Personal Project",\n    year: "2024",\n    short_summary:\n      "A web-based skincare product catalog to display products, prices, descriptions, and product details through a clean and responsive interface.",\n    full_description: `## Project Summary\nA personal web project featuring a skincare-themed product catalog built to showcase beauty products with an elegant appearance, fast navigation, and dynamic database integration.\n\n## Key Features\n- **Dynamic Product Catalog**: Displays a list of products with filters for category, price, availability status, and detailed product specifications.\n- **Responsive & Aesthetic Interface**: Clean and modern visual design with structured product cards and an intuitive layout comfortable on both mobile and desktop devices.\n- **Database Integration**: Supported by a Laravel and MySQL backend for structured and easily updatable product data management.`,'''
    ),
    (
        '''subtitle: "Katalog Produk Skincare Dinamis & Responsif",\n    description:\n      "Website katalog produk bertema skincare berbasis Laravel dan MySQL yang menampilkan produk, harga, deskripsi, dan galeri visual yang terstruktur rapi.",''',
        '''subtitle: "Dynamic & Responsive Skincare Product Catalog",\n    description:\n      "A skincare-themed product catalog website based on Laravel and MySQL that displays products, prices, descriptions, and neatly structured visual galleries.",'''
    ),
    (
        '''{ label: "Tipe Proyek", value: "Proyek Pribadi" },\n      { label: "Teknologi", value: "Laravel & MySQL" },\n      { label: "Desain", value: "Clean & Responsive UI" },\n      { label: "Konten", value: "Katalog Produk Dinamis" },''',
        '''{ label: "Project Type", value: "Personal Project" },\n      { label: "Technology", value: "Laravel & MySQL" },\n      { label: "Design", value: "Clean & Responsive UI" },\n      { label: "Content", value: "Dynamic Product Catalog" },'''
    ),
    (
        '''title: "Stroke Risk Prediction — Machine Learning & Dashboard Interaktif",\n    role: "Data Science / Machine Learning Developer | Proyek Akademik",\n    year: "2024",\n    short_summary:\n      "Sistem klasifikasi machine learning berbasis Naive Bayes untuk memprediksi potensi risiko stroke dengan dashboard Streamlit interaktif secara real-time.",\n    full_description: `## Ringkasan Proyek\nProyek Akademik 2024 yang mengembangkan model klasifikasi machine learning untuk memprediksi risiko penyakit stroke pada pasien berdasarkan karakteristik klinis dan demografis.\n\n## Alur Pengembangan Model\n- **Preprocessing Data**: Encoding fitur kategorikal, imputasi missing values, pembagian dataset train-test split, dan penyiapan fitur numerik terstandarisasi.\n- **Pemodelan Naive Bayes & Tuning**: Pembangunan model klasifikasi Naive Bayes yang dilanjutkan dengan hyperparameter tuning untuk memaksimalkan metrik evaluasi.\n- **Evaluasi Metrik**: Analisis komparatif performa sebelum dan sesudah tuning menggunakan Confusion Matrix, Precision, Recall, dan F1-Score.\n- **Dashboard Streamlit Interaktif**: Antarmuka web ramah pengguna yang memungkinkan input data klinis pasien baru secara instan, menampilkan prediksi probabilitas risiko stroke secara real-time, serta visualisasi eksplorasi dataset dengan Matplotlib dan Seaborn.`,''',
        '''title: "Stroke Risk Prediction — Machine Learning & Interactive Dashboard",\n    role: "Data Science / Machine Learning Developer | Academic Project",\n    year: "2024",\n    short_summary:\n      "A Naive Bayes-based machine learning classification system to predict potential stroke risks with a real-time interactive Streamlit dashboard.",\n    full_description: `## Project Summary\nAn Academic Project in 2024 that developed a machine learning classification model to predict the risk of stroke in patients based on clinical and demographic characteristics.\n\n## Model Development Workflow\n- **Data Preprocessing**: Encoding categorical features, missing value imputation, train-test split dataset division, and preparation of standardized numerical features.\n- **Naive Bayes Modeling & Tuning**: Building the Naive Bayes classification model followed by hyperparameter tuning to maximize evaluation metrics.\n- **Metric Evaluation**: Comparative performance analysis before and after tuning using Confusion Matrix, Precision, Recall, and F1-Score.\n- **Interactive Streamlit Dashboard**: A user-friendly web interface allowing instant clinical data input for new patients, displaying real-time stroke risk probability predictions, and dataset exploration visualization with Matplotlib and Seaborn.`,'''
    ),
    (
        '''subtitle: "Prediksi Risiko Stroke Berbasis Algoritma Naive Bayes & Streamlit",\n    description:\n      "Mengembangkan pipeline machine learning Naive Bayes dengan hyperparameter tuning untuk prediksi risiko stroke, dilengkapi dashboard interaktif real-time menggunakan Streamlit.",''',
        '''subtitle: "Stroke Risk Prediction Based on Naive Bayes Algorithm & Streamlit",\n    description:\n      "Developed a Naive Bayes machine learning pipeline with hyperparameter tuning for stroke risk prediction, equipped with a real-time interactive dashboard using Streamlit.",'''
    ),
    (
        '''cta_primary_text: "Explore Projects",\n  cta_primary_url: "#projects",\n  cta_cv_text: "Download CV",''',
        '''cta_primary_text: "Explore Projects",\n  cta_primary_url: "#projects",\n  cta_cv_text: "Download CV",'''
    )
]

for old, new in replacements:
    if old not in content:
        print(f'WARNING: Could not find substring: {old[:50]}...')
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Replacement complete.')
