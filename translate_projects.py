import re

file_path = 'c:/portofolio-project/components/sections/Projects.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Kumpulan proyek sistem web enterprise, modul backend, dan model machine learning. Klik kartu untuk melihat ringkasan cepat atau langsung telusuri arsitektur lengkap.': 'A collection of enterprise web systems, backend modules, and machine learning projects. Click on a card for a quick preview or to explore the full architecture.',
    'Buka Ringkasan Cepat': 'Open Quick Preview',
    'Buka Detail Lengkap Langsung': 'Open Full Details',
    'Tidak ada proyek yang sesuai dengan kata kunci': 'No projects found matching the keyword'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated Projects.tsx')
