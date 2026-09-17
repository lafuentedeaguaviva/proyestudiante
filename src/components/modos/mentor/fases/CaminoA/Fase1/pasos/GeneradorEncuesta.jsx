import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCopy, Link2, Download, FastForward, CheckCircle2, ArrowRight, ArrowLeft, Users, FileText } from 'lucide-react';

export default function GeneradorEncuesta({ ideaSeleccionada, onNext, onSkip }) {
  const [copied, setCopied] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  
  // Nuevo estado para la fase de ingreso de datos
  const [isEnteringData, setIsEnteringData] = useState(false);
  const [dataMode, setDataMode] = useState('manual'); // 'manual' | 'web'
  const [cantidadManual, setCantidadManual] = useState(3);
  const [respuestasWeb, setRespuestasWeb] = useState(0);

  const cuestionarioText = `
Cuestionario de Validación: ${ideaSeleccionada?.titulo}

BLOQUE 1: CONTEXTO Y COMPORTAMIENTO (Hechos)
1. ¿Con qué frecuencia te encuentras en la situación de [describir tarea frustrante]?
   ( ) Varias veces al día
   ( ) A diario
   ( ) 2-3 veces por semana
   ( ) Rara vez
2. Actualmente, cuando enfrentas ese problema, ¿qué es lo primero que haces para resolverlo?
   _________________________________________________
3. En una escala del 1 al 10, ¿cuánto tiempo pierdes a la semana lidiando con esto?
   _________________________________________________

BLOQUE 2: EL DOLOR (Emocional y Económico)
4. Cuando te ocurre esto, ¿cómo te hace sentir?
   ( ) Ansiedad / Estrés
   ( ) Impotencia
   ( ) Culpa
   ( ) Rabia
   ( ) Indiferencia
5. ¿Has intentado pagar por una solución para esto en el último año?
   ( ) Sí, contraté a alguien/compré producto
   ( ) No, pero estuve a punto
   ( ) No, ni se me ocurrió
6. (Si dijo no) ¿Por qué no lo hiciste?
   ( ) Era muy caro
   ( ) No encontré nada
   ( ) Podía hacerlo yo
   ( ) No confiaba

BLOQUE 3: LA SOLUCIÓN IDEAL
7. Si pudieras resolver esto con una herramienta, ¿qué requisito indispensable tendría?
   _________________________________________________
8. ¿Cuánto gastas actualmente en "parches" para solucionar esto?
   _________________________________________________

BLOQUE 4: CIERRE
9. ¿Te gustaría recibir un avance gratuito de la solución cuando esté lista?
   ( ) Sí (Dejar Email: ______________)
   ( ) No
  `;

  const handleCopy = () => {
    navigator.clipboard.writeText(cuestionarioText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleGenerateLink = () => {
    setLinkGenerated(true);
    setDataMode('web'); // Automáticamente sugerir modo web si crea enlace
  };

  useEffect(() => {
    if (isEnteringData && dataMode === 'web') {
      // Simular respuestas llegando
      const interval = setInterval(() => {
        setRespuestasWeb(prev => prev >= 15 ? 15 : prev + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isEnteringData, dataMode]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      
      {!isEnteringData ? (
        <AnimatePresence>
          <motion.div key="export" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#0f172a' }}>Tu Encuesta está Lista</h2>
              <button 
                onClick={onSkip}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FastForward size={16} /> Saltar y solo poner ideas
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
              {/* Vista previa del Cuestionario */}
              <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-sm)', color: '#333', maxHeight: '500px', overflowY: 'auto', fontFamily: 'serif', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.6' }}>
                  {cuestionarioText.trim()}
                </pre>
              </div>

              {/* Panel de Acciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ color: '#0f172a', fontSize: '1.2rem', marginBottom: '1rem' }}>Opciones de Exportación</h3>
                
                <button 
                  onClick={handleCopy}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', color: '#0f172a', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                  {copied ? <CheckCircle2 color="var(--primary)" /> : <ClipboardCopy color="var(--primary)" />}
                  <div>
                    <strong style={{ display: 'block' }}>Copiar Texto</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Para pegar en Google Forms.</span>
                  </div>
                </button>

                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', color: '#0f172a', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                  <Download color="#10b981" />
                  <div>
                    <strong style={{ display: 'block' }}>Descargar Word</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Listo para imprimir.</span>
                  </div>
                </button>

                <button 
                  onClick={handleGenerateLink}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: 'var(--radius-sm)', color: '#0f172a', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                >
                  <Link2 color="#f59e0b" />
                  <div>
                    <strong style={{ display: 'block' }}>Crear Enlace Web</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>GRATIS. Enviar por WhatsApp.</span>
                  </div>
                </button>

                {linkGenerated && (
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', marginTop: '1rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tu enlace provisional:</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" readOnly value="app.com/enc/123xyz" style={{ width: '100%', padding: '0.5rem', background: 'black', color: 'var(--primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                  <button className="btn-primary" onClick={() => setIsEnteringData(true)} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    Ya recopilé datos <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          <motion.div key="input-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                onClick={() => setIsEnteringData(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <ArrowLeft size={24} />
              </button>
              <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>Ingreso de Datos Recopilados</h2>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                onClick={() => setDataMode('manual')}
                style={{ flex: 1, padding: '1rem', background: dataMode === 'manual' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)', border: dataMode === 'manual' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <FileText /> Carga Manual (Físico/Word)
              </button>
              <button 
                onClick={() => setDataMode('web')}
                style={{ flex: 1, padding: '1rem', background: dataMode === 'web' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', border: dataMode === 'web' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <Users /> Estado Enlace Web
              </button>
            </div>

            {dataMode === 'manual' ? (
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <label style={{ color: '#0f172a', fontSize: '1.1rem' }}>¿Cuántos cuestionarios físicos realizaste?</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="50" 
                    value={cantidadManual} 
                    onChange={(e) => setCantidadManual(parseInt(e.target.value) || 1)}
                    style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--primary)', background: 'black', color: '#0f172a', fontSize: '1.2rem', textAlign: 'center' }}
                  />
                </div>
                
                <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {Array.from({ length: cantidadManual }).map((_, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ color: 'var(--primary)', margin: '0 0 1.5rem 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        Encuestado #{i + 1}
                      </h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Pregunta 1 */}
                        <div>
                          <label style={{ display: 'block', color: '#0f172a', marginBottom: '0.5rem' }}>1. Frecuencia del problema:</label>
                          <select style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#0f172a' }}>
                            <option value="">Selecciona...</option>
                            <option value="Varias veces al día">Varias veces al día</option>
                            <option value="A diario">A diario</option>
                            <option value="2-3 veces por semana">2-3 veces por semana</option>
                            <option value="Rara vez">Rara vez</option>
                          </select>
                        </div>

                        {/* Pregunta 2 */}
                        <div>
                          <label style={{ display: 'block', color: '#0f172a', marginBottom: '0.5rem' }}>2. ¿Qué es lo primero que hace para resolverlo?</label>
                          <input type="text" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#0f172a' }} />
                        </div>

                        {/* Pregunta 3 */}
                        <div>
                          <label style={{ display: 'block', color: '#0f172a', marginBottom: '0.5rem' }}>3. Tiempo perdido a la semana (1-10):</label>
                          <input type="number" min="1" max="10" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#0f172a' }} />
                        </div>

                        {/* Pregunta 4 */}
                        <div>
                          <label style={{ display: 'block', color: '#0f172a', marginBottom: '0.5rem' }}>4. ¿Cómo le hace sentir?</label>
                          <select style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#0f172a' }}>
                            <option value="">Selecciona...</option>
                            <option value="Ansiedad / Estrés">Ansiedad / Estrés</option>
                            <option value="Impotencia">Impotencia</option>
                            <option value="Culpa">Culpa</option>
                            <option value="Rabia">Rabia</option>
                            <option value="Indiferencia">Indiferencia</option>
                          </select>
                        </div>

                        {/* Pregunta 5 */}
                        <div>
                          <label style={{ display: 'block', color: '#0f172a', marginBottom: '0.5rem' }}>5. ¿Ha intentado pagar por una solución?</label>
                          <select style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#0f172a' }}>
                            <option value="">Selecciona...</option>
                            <option value="Sí">Sí, contraté a alguien/compré producto</option>
                            <option value="Casi">No, pero estuve a punto</option>
                            <option value="No">No, ni se me ocurrió</option>
                          </select>
                        </div>

                        {/* Pregunta 7 (Reducida) */}
                        <div>
                          <label style={{ display: 'block', color: '#0f172a', marginBottom: '0.5rem' }}>7. Requisito indispensable de la solución ideal:</label>
                          <input type="text" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#0f172a' }} />
                        </div>

                        {/* Pregunta 8 */}
                        <div>
                          <label style={{ display: 'block', color: '#0f172a', marginBottom: '0.5rem' }}>8. Gasto actual en "parches":</label>
                          <input type="text" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#0f172a' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '4rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Users size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>{respuestasWeb} Respuestas Recibidas</h3>
                <p style={{ color: 'var(--text-secondary)' }}>A través de tu enlace web (app.com/enc/123xyz)</p>
                {respuestasWeb >= 15 && (
                  <p style={{ color: '#10b981', marginTop: '1rem', fontWeight: 'bold' }}>¡Excelente cantidad para analizar patrones!</p>
                )}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn-primary" onClick={onNext} style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
                Analizar Resultados con IA <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

    </motion.div>
  );
}
