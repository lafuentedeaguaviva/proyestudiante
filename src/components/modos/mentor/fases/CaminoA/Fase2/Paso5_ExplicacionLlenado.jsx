import React, { useState } from 'react';
import { Database, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Paso5_ExplicacionLlenado = ({ setAyudanteText, onComplete, initialData = [] }) => {
  const encuestasOnline = initialData.filter(e => e.fuente === 'online');
  const encuestasManuales = initialData.filter(e => e.fuente !== 'online');

  const [encuestasEnLinea] = useState(encuestasOnline.length); 
  const [encuestas, setEncuestas] = useState(encuestasManuales);

  React.useEffect(() => {
    setAyudanteText("Si usaste el link en línea, los datos llegarán solos. Si encuestaste en papel, ingresa los datos a la matriz manual.");
  }, []);

  const addEncuesta = () => {
    setEncuestas([...encuestas, { 
      id: Date.now(), 
      edad: '', genero: '', zona: '', est: '', ing: '', cant: '', gasto: '', frec: '', import: '', lugar: '', redes: '', dif: '', intent: '', act: '', uso: '', frecCompra: '', unidades: '', momento: '', pago: '', carac: '', mejora: '', info: '', cont: '' 
    }]);
  };

  const cols = [
    { key: 'edad', label: 'EDAD', options: ["10-13", "14-17", "18-21", "22-30", "31-45", "45-65", "Más de 65"] },
    { key: 'genero', label: 'GEN', options: ["Masculino", "Femenino"] },
    { key: 'zona', label: 'ZONA', options: ["Zona norte", "Zona sur", "Zona este", "Zona oeste", "Centro", "Otro"] },
    { key: 'est', label: 'EST', options: ["Primaria", "Secundaria", "Bachillerato", "Técnico Superior", "Licenciatura", "Posgrado", "Otro"] },
    { key: 'ing', label: 'ING', options: ["Mesada semanal", "Mesada mensual", "Trabajo medio tiempo", "Trabajo tiempo completo", "No recibo dinero"] },
    { key: 'cant', label: 'CANT', options: ["< Bs. 50", "Bs. 50 - 150", "Bs. 151 - 300", "Bs. 301 - 500", "> Bs. 500"] },
    { key: 'gasto', label: 'GASTO', options: ["Comida", "Transporte", "Ropa", "Entretenimiento", "Tecnología", "Ahorro", "Otro"] },
    { key: 'frec', label: 'FREC', options: ["Todos los días", "2-3 veces/sem", "1 vez/sem", "1 vez/mes", "Rara vez", "Nunca"] },
    { key: 'import', label: 'IMPORT', options: ["Precio", "Calidad", "Saludable", "Fácil", "Moda", "Atención"] },
    { key: 'lugar', label: 'LUGAR', options: ["Colegio/Trabajo", "Tiendas", "Supermercados", "En línea", "Lo preparo", "Otro"] },
    { key: 'redes', label: 'REDES', options: ["Instagram", "TikTok", "WhatsApp", "Facebook", "YouTube", "X", "Otra"] },
    { key: 'dif', label: 'DIF', options: ["1", "2", "3", "4", "5"] },
    { key: 'intent', label: 'INTENT', options: ["Buena solución", "Ninguna convence", "No intenté", "No sabía"] },
    { key: 'act', label: 'ACT', options: ["Ignoro", "Busco ayuda", "Casera", "Pago algo malo", "Internet", "Otro"] },
    { key: 'uso', label: 'USO', options: ["Sí", "Tal vez", "No"] },
    { key: 'frecCompra', label: 'FREC. USO', options: ["Todos los dias", "3-5 veces semana", "1-2 veces semana", "1 vez semana", "1 vez mes", "Rara vez", "Nunca"] },
    { key: 'unidades', label: 'UNIDADES', options: ["1", "2", "3", "4 o más"] },
    { key: 'momento', label: 'MOMENTO', options: ["Mañana", "Mediodía", "Tarde", "Noche", "Fines de semana", "Estrés/Prisa", "Otro"] },
    { key: 'pago', label: 'PAGO', options: ["< Bs. 50", "Bs. 50 - 150", "Bs. 151 - 300", "Bs. 301 - 500", "> Bs. 500", "Nada"] },
    { key: 'carac', label: 'CARAC', options: ["Económico", "Calidad", "Rápido", "Variedad", "Servicio", "Otro"] },
    { key: 'mejora', label: 'MEJORA' },
    { key: 'info', label: 'INFO', options: ["Sí", "No"] },
    { key: 'cont', label: 'CONT' }
  ];

  const removeEncuesta = (id) => {
    setEncuestas(encuestas.filter(e => e.id !== id));
  };

  const updateEncuesta = (id, field, value) => {
    setEncuestas(encuestas.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div style={{ padding: '2rem', color: '#0f172a', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Paso 5: Tabulación de Resultados</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
            <Database size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', color: '#059669' }}>Respuestas en Línea</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{encuestasEnLinea}</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Se tabulan automáticamente</p>
          </div>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'center' }}>
            <Database size={32} color="#60a5fa" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', color: '#60a5fa' }}>Respuestas en Papel</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{encuestas.length}</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Tabuladas manualmente</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#0f172a', marginBottom: '1rem' }}>Matriz Manual</h3>
        
        <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569', whiteSpace: 'nowrap' }}>
                <th style={{ padding: '0.75rem' }}>N°</th>
                {cols.map(c => <th key={c.key} style={{ padding: '0.75rem' }}>{c.label}</th>)}
                <th style={{ padding: '0.75rem' }}></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {encuestas.map((enc, i) => (
                  <motion.tr key={enc.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', color: '#60a5fa' }}>#{i + 1}</td>
                    {cols.map(c => (
                      <td key={c.key} style={{ padding: '0.75rem', minWidth: '120px' }}>
                        {c.options ? (
                          <select 
                            value={enc[c.key] || ''} 
                            onChange={(e) => updateEncuesta(enc.id, c.key, e.target.value)} 
                            style={{ width: '100%', padding: '0.5rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.85rem' }} 
                          >
                            <option value="">Selecciona...</option>
                            {c.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input 
                            type="text" 
                            value={enc[c.key] || ''} 
                            onChange={(e) => updateEncuesta(enc.id, c.key, e.target.value)} 
                            style={{ width: '100%', padding: '0.5rem', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.85rem' }} 
                            placeholder="..."
                          />
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button onClick={() => removeEncuesta(enc.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        <button onClick={addEncuesta} style={{ marginTop: '1rem', background: 'transparent', color: '#60a5fa', border: '1px dashed #60a5fa', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', fontWeight: 'bold' }}>
          <Plus size={18} /> Añadir fila manual
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={() => onComplete([...encuestasOnline, ...encuestas])}
          style={{ padding: '1rem 3rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
        >
          <CheckCircle2 size={20} /> Ver Resultados Finales
        </button>
      </div>
    </div>
  );
};

export default Paso5_ExplicacionLlenado;
