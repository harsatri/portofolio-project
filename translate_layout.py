import re

file_path = 'c:/portofolio-project/app/layout.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    '"Portfolio Harsa Tri Novenda — Fresh Graduate S1 Sistem Informasi Universitas Telkom. Frontend & Full-Stack Web Developer dengan keahlian React.js, Next.js, Laravel, dan Node.js."': '"Portfolio of Harsa Tri Novenda — Information Systems Graduate from Telkom University. Frontend & Full-Stack Web Developer with expertise in React.js, Next.js, Laravel, and Node.js."',
    '"Portfolio dan showcase project Harsa Tri Novenda — Frontend & Full-Stack Web Developer."': '"Portfolio and project showcase of Harsa Tri Novenda — Frontend & Full-Stack Web Developer."',
    'locale: "id_ID"': 'locale: "en_US"'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated metadata')
