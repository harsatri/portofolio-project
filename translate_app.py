import os

replacements = {
    'Bagikan Tautan Proyek Ini': 'Share This Project Link',
    'Bagikan Proyek': 'Share Project',
    'Kembali ke Portfolio': 'Back to Portfolio',
    'Lihat Live Demo': 'View Live Demo',
    'Tahun:': 'Year:',
    'Proyek Lainnya': 'Other Projects',
    'Lihat Semua': 'View All',
    'Kembali ke Beranda': 'Back to Home',
    'Lihat Proyek': 'View Projects',
    
    # Admin strings
    'Ringkasan Singkat (Short Summary) wajib diisi': 'Short Summary is required',
    'Kembali ke Daftar Project': 'Back to Project List',
    'Lihat Halaman Publik': 'View Public Page',
    'Informasi Pokok Proyek': 'Core Project Information',
    'Judul Proyek': 'Project Title',
    'Peran / Role': 'Role',
    'Kategori Proyek (Untuk Tab Filter Showcase)': 'Project Category (For Showcase Filter Tab)',
    'Tahun / Periode Pengerjaan (Opsional)': 'Year / Project Period (Optional)',
    'Ringkasan Singkat (Short Summary)': 'Short Summary',
    'Deskripsi Lengkap Proyek (Markdown / Rich-Text)': 'Full Project Description (Markdown / Rich-Text)',
    'Upload Foto Galeri Proyek': 'Upload Project Gallery Photos',
    'Jadikan Proyek Unggulan (Featured)': 'Make Featured Project',
    'Buat Proyek': 'Create Project',
    'Simpan Perubahan': 'Save Changes',
    'Cari judul project, kategori, atau tag teknologi...': 'Search project titles, categories, or tech tags...',
    'Deskripsi singkat mengenai fokus keahlian dan minat teknologi Anda...': 'A brief description of your expertise and technology interests...',
    'Kembalikan ke posisi awal terbaik': 'Reset to optimal position',
    'Identitas Utama & Peran': 'Main Identity & Role',
    'Peran / Profesi Utama': 'Main Role / Profession',
    'Tagline Bio / Ringkasan Keahlian': 'Bio Tagline / Expertise Summary',
    'Deskripsi singkat keahlian arsitektur web, performa database, dsb...': 'A short description of your web architecture expertise, database performance, etc...',
    'Tombol Kontak': 'Contact Button',
    'Media Sosial & Kontak Terhubung': 'Social Media & Connected Contacts',
    'Label Kategori': 'Category Label',
    'Ringkasan Statistik & Portfolio': 'Statistics & Portfolio Summary',
    'Kontak Masuk': 'Incoming Contacts',
    'Lihat Detail Analitik &rarr;': 'View Analytics Details &rarr;',
    '&larr; Kembali ke Website Portfolio': '&larr; Back to Portfolio Website',
    'Pengalaman kerja berhasil ditambahkan!': 'Work experience successfully added!',
    'Pengalaman kerja berhasil diperbarui!': 'Work experience successfully updated!',
    'Pengalaman default tidak dapat dihapus dari database lokal': 'Default experience cannot be deleted from the local database',
    'Pengalaman kerja berhasil dihapus': 'Work experience successfully deleted',
    'Manajemen Riwayat Pengalaman Kerja': 'Work Experience History Management',
    'Tambah Pengalaman': 'Add Experience',
    'Edit Pengalaman Kerja': 'Edit Work Experience',
    'Tambah Pengalaman Baru': 'Add New Experience',
    'Kembalikan ke Otomatis Kalender': 'Revert to Auto Calendar'
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        modified = False
        for old, new in replacements.items():
            if old in content:
                content = content.replace(old, new)
                modified = True
                
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

for root, _, files in os.walk('c:/portofolio-project/app'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_in_file(os.path.join(root, file))

print('Done app')
