import re

with open('src/pages/Fase1_EmprendimientoMentor.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'className="bg-white p-8 rounded-2xl shadow-xl"': 'style={{ background: \'white\', padding: \'2rem\', borderRadius: \'1rem\', boxShadow: \'0 20px 25px -5px rgba(0, 0, 0, 0.1)\' }}',
    'className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 relative"': 'style={{ background: \'#f8fafc\', padding: \'1.5rem\', borderRadius: \'1rem\', border: \'1px solid #e2e8f0\', marginBottom: \'2rem\', position: \'relative\' }}',
    'className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8"': 'style={{ background: \'#f8fafc\', padding: \'1.5rem\', borderRadius: \'1rem\', border: \'1px solid #e2e8f0\', marginBottom: \'2rem\' }}',
    'className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"': 'style={{ width: \'100%\', padding: \'0.75rem\', borderRadius: \'0.5rem\', border: \'1px solid #cbd5e1\', marginTop: \'0.5rem\', outline: \'none\', boxSizing: \'border-box\' }}'
}

for old, new_s in replacements.items():
    content = content.replace(old, new_s)

with open('src/pages/Fase1_EmprendimientoMentor.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
