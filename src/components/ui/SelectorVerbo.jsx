import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';

const VERBOS_OBJETIVOS = [
  { verbo: "Implementar", significado: "Poner en funcionamiento o aplicar métodos, sistemas o medidas." },
  { verbo: "Desarrollar", significado: "Ampliar, mejorar o llevar a cabo una idea, proyecto o producto." },
  { verbo: "Diseñar", significado: "Idear y trazar un plan o estructura para un producto o servicio." },
  { verbo: "Crear", significado: "Juntar elementos para formar un todo coherente; producir algo nuevo." },
  { verbo: "Comercializar", significado: "Poner a la venta un producto en el mercado con estrategias de negocio." },
  { verbo: "Producir", significado: "Fabricar, elaborar o generar un producto o servicio que genere valor." },
  { verbo: "Evaluar", significado: "Emitir juicios basados en criterios sobre la viabilidad o impacto." },
  { verbo: "Identificar", significado: "Reconocer y establecer las características principales de un problema." },
  { verbo: "Proponer", significado: "Sugerir una idea, plan o proyecto para su consideración y ejecución." },
  { verbo: "Mejorar", significado: "Perfeccionar algo para aumentar su calidad o rendimiento." },
  { verbo: "Establecer", significado: "Fundar o instituir un proceso, negocio o alianza de forma duradera." },
  { verbo: "Analizar", significado: "Descomponer en partes básicas para entender una estructura o mercado." },
  { verbo: "Planificar", significado: "Elaborar un plan metódico y detallado para obtener un objetivo." },
  { verbo: "Organizar", significado: "Coordinar recursos y personas para lograr un fin establecido." },
  { verbo: "Gestionar", significado: "Llevar a cabo diligencias que hacen posible la realización de un proyecto." },
  { verbo: "Incrementar", significado: "Aumentar el número, tamaño o intensidad (ej: ventas, alcance)." },
  { verbo: "Reducir", significado: "Disminuir cantidad o intensidad (ej: costos, tiempos, mermas)." },
  { verbo: "Optimizar", significado: "Buscar la mejor manera de realizar un proceso para hacerlo eficiente." },
  { verbo: "Innovar", significado: "Alterar algo introduciendo novedades en el mercado o producto." }
];

const SelectorVerbo = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredVerbos = VERBOS_OBJETIVOS.filter(v => 
    v.verbo.toLowerCase().includes((value || '').toLowerCase()) || 
    v.significado.toLowerCase().includes((value || '').toLowerCase())
  );

  const handleSelect = (verboSeleccionado) => {
    onChange(verboSeleccionado);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`bg-slate-50 border rounded-xl p-3 transition-all
          ${isOpen ? 'ring-2 ring-indigo-400 border-indigo-400' : 'border-slate-200 hover:border-slate-300'}
          focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400`}
      >
        <label className="text-xs font-bold text-slate-500 mb-1 block">Verbo (Ej: Implementar)</label>
        <div className="flex justify-between items-center">
          <input 
            type="text"
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Escribe o selecciona..."
            className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
          />
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer p-1 -mr-1"
          >
            <ChevronDown size={18} className="text-slate-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
            style={{ width: 'max(100%, 320px)' }} // Para que no quede muy angosto si la columna es chica
          >
            {/* Lista */}
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {filteredVerbos.length > 0 ? (
                filteredVerbos.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelect(item.verbo)}
                    className={`p-3 rounded-lg cursor-pointer mb-1 transition-all flex items-start gap-3
                      ${value === item.verbo ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                  >
                    <div className={`mt-0.5 ${value === item.verbo ? 'text-indigo-600' : 'text-transparent'}`}>
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${value === item.verbo ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {item.verbo}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {item.significado}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
                  <p>No hay coincidencias en la lista.</p>
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-bold text-xs">
                    Usando "{value}" como verbo personalizado
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectorVerbo;
