import re

files = [
    'c:/portofolio-project/components/sections/Projects.tsx',
    'c:/portofolio-project/components/sections/Experience.tsx',
    'c:/portofolio-project/components/sections/Certificates.tsx',
    'c:/portofolio-project/components/layout/Navbar.tsx',
    'c:/portofolio-project/components/admin/AdminSidebar.tsx',
    'c:/portofolio-project/components/admin/AdminHeader.tsx'
]

replacements = {
    'Cari teknologi, judul, role...': 'Search technologies, titles, roles...',
    'Lihat Detail Lengkap': 'View Full Details',
    'Fokus Proyek': 'Project Focus',
    'Lihat Foto': 'View Photo',
    'aria-label="Beranda"': 'aria-label="Home"',
    'Lihat Website': 'View Website',
    'aria-label="Beranda Admin"': 'aria-label="Admin Home"',
    '"Pengembangan Perangkat Lunak", "Pemrograman", "Web Development"': '"Software Engineering", "Programming", "Web Development"'
}

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        for old, new in replacements.items():
            content = content.replace(old, new)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    except FileNotFoundError:
        pass

print('Done components')
