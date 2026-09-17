const fs = require('fs');

const path = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR</h2>
                <p className="text-slate-500 font-medium">Calcula si el proyecto genera valor por encima de lo esperado.</p>
              </div>
            </div>`;

const replacement = `<h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR</h2>
                  <p className="text-slate-500 font-medium">Calcula si el proyecto genera valor por encima de lo esperado.</p>
                </div>
              </div>
              
              <button 
                onClick={handleGenerarIA}
                disabled={isGeneratingIA}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[200px]"
              >
                {isGeneratingIA ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Autocompletar con IA
                  </>
                )}
              </button>
            </div>`;

// Regex to match ignoring whitespace and newlines
content = content.replace(/<div className="flex items-center gap-3 mb-6">[\s\S]*?<Calculator size=\{24\} \/>[\s\S]*?<\/div>[\s\S]*?<div>[\s\S]*?<h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR<\/h2>[\s\S]*?<p className="text-slate-500 font-medium">Calcula si el proyecto genera valor por encima de lo esperado\.<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>/, 
  `<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                  <Calculator size={24} />
                </div>
                <div>
                  ${replacement}`);

fs.writeFileSync(path, content);
console.log("Done");
