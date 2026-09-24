import React, { useState } from 'react';
import { Database, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Paso5_ExplicacionLlenado = ({ setAyudanteText, onComplete, initialData = [] }) => {
  const encuestasOnline = initialData.filter(e => e.fuente === 'online');
  const encuestasManuales = initialData.filter(e => e.fuente !== 'online');

  const [encuestasEnLinea] = useState(encuestasOnline.length); 
  const [encuestas, setEncuestas] = useState(encuestasManuales);

  React.useEffect(() => {
    setAyudanteText("Si encuestaste en papel, ingresa los datos a la matriz manual. Hemos invertido la tabla (preguntas en filas y encuestas en columnas) para que te sea más fácil llenar las 23 preguntas.");
  }, []);

  const addEncuesta = () => {
    setEncuestas([...encuestas, { 
      id: Date.now(), 
      edad: '', genero: '', zona: '', est: '', ing: '', cant: '', gasto: '', frec: '', import: '', lugar: '', redes: '', dif: '', intent: '', act: '', uso: '', frecCompra: '', unidades: '', momento: '', pago: '', carac: '', mejora: '', info: '', cont: '' 
    }]);
  };

  const removeEncuesta = (id) => {
    setEncuestas(encuestas.filter(e => e.id !== id));
  };

  const updateEncuesta = (id, field, value) => {
    setEncuestas(encuestas.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const cols = [
    { key: 'edad', label: 'EDAD', q: '¿Qué edad tienes?', options: ["10-13", "14-17", "18-21", "22-30", "31-45", "45-65", "Más de 65"] },
    { key: 'genero', label: 'GEN', q: '¿Cuál es tu género?', options: ["Masculino", "Femenino"] },
    { key: 'zona', label: 'ZONA', q: '¿En qué zona o barrio vives?', options: ["Zona norte", "Zona sur", "Zona este", "Zona oeste", "Centro", "Otro"] },
    { key: 'est', label: 'EST', q: 'Nivel de estudios', options: ["Primaria", "Secundaria", "Bachillerato", "Técnico Superior", "Licenciatura", "Posgrado", "Otro"] },
    { key: 'ing', label: 'ING', q: '¿Cuál es tu fuente de ingresos?', options: ["Mesada semanal", "Mesada mensual", "Trabajo medio tiempo", "Trabajo tiempo completo", "No recibo dinero"] },
    { key: 'cant', label: 'CANT', q: 'Cantidad de dinero disponible', options: ["< Bs. 50", "Bs. 50 - 150", "Bs. 151 - 300", "Bs. 301 - 500", "> Bs. 500"] },
    { key: 'gasto', label: 'GASTO', q: '¿En qué gastas más dinero?', options: ["Comida", "Transporte", "Ropa", "Entretenimiento", "Tecnología", "Ahorro", "Otro"] },
    { key: 'frec', label: 'FREC', q: 'Frecuencia de compra de productos similares', options: ["Todos los días", "2-3 veces/sem", "1 vez/sem", "1 vez/mes", "Rara vez", "Nunca"] },
    { key: 'import', label: 'IMPORT', q: '¿Qué valoras más al comprar?', options: ["Precio", "Calidad", "Saludable", "Fácil", "Moda", "Atención"] },
    { key: 'lugar', label: 'LUGAR', q: '¿Dónde sueles comprar/almorzar?', options: ["Colegio/Trabajo", "Tiendas", "Supermercados", "En línea", "Lo preparo", "Otro"] },
    { key: 'redes', label: 'REDES', q: 'Redes sociales que más utilizas', options: ["Instagram", "TikTok", "WhatsApp", "Facebook", "YouTube", "X", "Otra"] },
    { key: 'dif', label: 'DIF', q: 'Nivel de dificultad del problema (1-5)', options: ["1", "2", "3", "4", "5"] },
    { key: 'intent', label: 'INTENT', q: '¿Qué intentaste antes para solucionar el problema?', options: ["Buena solución", "Ninguna convence", "No intenté", "No sabía"] },
    { key: 'act', label: 'ACT', q: '¿Qué haces actualmente ante el problema?', options: ["Ignoro", "Busco ayuda", "Casera", "Pago algo malo", "Internet", "Otro"] },
    { key: 'uso', label: 'USO', q: '¿Usarías nuestro producto o servicio?', options: ["Sí", "Tal vez", "No"] },
    { key: 'frecCompra', label: 'FREC. USO', q: '¿Con qué frecuencia lo usarías/comprarías?', options: ["Todos los dias", "3-5 veces semana", "1-2 veces semana", "1 vez semana", "1 vez mes", "Rara vez", "Nunca"] },
    { key: 'unidades', label: 'UNIDADES', q: '¿Cuántas unidades comprarías?', options: ["1", "2", "3", "4 o más"] },
    { key: 'momento', label: 'MOMENTO', q: '¿En qué momento preferirías usarlo?', options: ["Mañana", "Mediodía", "Tarde", "Noche", "Fines de semana", "Estrés/Prisa", "Otro"] },
    { key: 'pago', label: 'PAGO', q: '¿Cuánto estarías dispuesto a pagar?', options: ["< Bs. 50", "Bs. 50 - 150", "Bs. 151 - 300", "Bs. 301 - 500", "> Bs. 500", "Nada"] },
    { key: 'carac', label: 'CARAC', q: '¿Qué característica te importa más?', options: ["Económico", "Calidad", "Rápido", "Variedad", "Servicio", "Otro"] },
    { key: 'mejora', label: 'MEJORA', q: '¿Qué mejorarías de las opciones actuales (texto)?' },
    { key: 'info', label: 'INFO', q: '¿Te gustaría recibir más información?', options: ["Sí", "No"] },
    { key: 'cont', label: 'CONT', q: 'Número de contacto (Opcional)' }
  ];

  return (
    <div style={{ padding: '2rem', color: '#0f172a', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Paso 4: Tabulación de Resultados</h2>

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

      {/* Matriz Transpuesta */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#0f172a' }}>Matriz Manual</h3>
          <button onClick={addEncuesta} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <Plus size={18} /> Añadir Encuesta (Columna)
          </button>
        </div>
        
        <div style={{ overflowX: 'auto', paddingBottom: '1rem', maxWidth: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '0.75rem', width: '250px', background: '#f8fafc', position: 'sticky', left: 0, zIndex: 10, borderRight: '1px solid #e2e8f0' }}>Pregunta</th>
                {encuestas.map((enc, i) => (
                  <th key={enc.id} style={{ padding: '0.75rem', minWidth: '160px', textAlign: 'center', color: '#3b82f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Encuesta #{i + 1}</span>
                      <button onClick={() => removeEncuesta(enc.id)} title="Eliminar Encuesta" style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cols.map((c, colIndex) => (
                <tr key={c.key} style={{ borderBottom: '1px solid #e2e8f0', background: colIndex % 2 === 0 ? 'white' : '#f8fafc' }}>
                  {/* Celda de la pregunta (Sticky a la izquierda) */}
                  <td 
                    title={c.q}
                    style={{ 
                      padding: '0.75rem', 
                      fontWeight: 600, 
                      color: '#475569', 
                      background: colIndex % 2 === 0 ? 'white' : '#f8fafc',
                      position: 'sticky', 
                      left: 0, 
                      zIndex: 10, 
                      borderRight: '1px solid #e2e8f0',
                      cursor: 'help'
                    }}
                  >
                    {c.label}
                    <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '230px' }}>
                      {c.q}
                    </div>
                  </td>
                  
                  {/* Celdas de las encuestas (Columnas) */}
                  {encuestas.map(enc => (
                    <td key={enc.id} style={{ padding: '0.5rem 0.75rem' }}>
                      {c.options ? (
                        <select 
                          value={enc[c.key] || ''} 
                          onChange={(e) => updateEncuesta(enc.id, c.key, e.target.value)} 
                          style={{ width: '100%', padding: '0.5rem', background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem' }} 
                        >
                          <option value="">Selecciona...</option>
                          {c.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          value={enc[c.key] || ''} 
                          onChange={(e) => updateEncuesta(enc.id, c.key, e.target.value)} 
                          style={{ width: '100%', padding: '0.5rem', background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '0.375rem', fontSize: '0.85rem' }} 
                          placeholder="Escribe aquí..."
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {encuestas.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <p>No has añadido ninguna encuesta manual aún.</p>
              <button onClick={addEncuesta} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' }}>
                + Añadir mi primera encuesta
              </button>
            </div>
          )}
        </div>
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
