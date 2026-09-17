import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Bot, ArrowRight, Save, UserCheck } from 'lucide-react';

export default function PublicoObjetivo({ projectName, ideaGanadora, setAyudanteText, onComplete }) {
  const [fase, setFase] = useState('input'); // 'input' | 'loading_ai' | 'result'
  
  const [datos, setDatos] = useState({
    rangoEdad: '',
    ubicacion: '',
    nivelIngresos: '',
    intereses: ''
  });

  const [perfilIA, setPerfilIA] = useState(null);

  useEffect(() => {
    if (fase === 'input') {
      setAyudanteText(`¡Bienvenido a la Fase 2!<br/><br/>Antes de vender o crear, debes saber a <b>quién</b> le vas a vender. Completa estos datos básicos sobre tus futuros clientes.`);
    } else if (fase === 'loading_ai') {
      setAyudanteText(`Interesante perfil...<br/><br/>La IA está analizando a estas personas cruzándolas con tu idea de negocio "${projectName}" para generar a tu Cliente Ideal.`);
    } else if (fase === 'result') {
      setAyudanteText(`¡Aquí tienes a tu Buyer Persona! 🎯<br/><br/>Lee este perfil. Si estás de acuerdo, guárdalo; te servirá de base para las encuestas que haremos a continuación.`);
    }
  }, [fase, setAyudanteText, projectName]);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const allFilled = datos.rangoEdad && datos.ubicacion && datos.nivelIngresos && datos.intereses;

  const generarPerfil = () => {
    setFase('loading_ai');
    setTimeout(() => {
      setPerfilIA({
        nombre: "Alex (El Cliente Ideal)",
        descripcion: `Alex es una persona de ${datos.rangoEdad} años que vive en ${datos.ubicacion}. Con unos ingresos ${datos.nivelIngresos}, siempre está buscando mejorar su calidad de vida. Le interesa profundamente ${datos.intereses}.`,
        dolor: `Su mayor frustración actual está relacionada con el problema que busca resolver "${projectName}". No encuentra opciones confiables o accesibles.`,
        motivacion: `Estaría dispuesto a pagar por una solución como la tuya porque valora la innovación, el ahorro de tiempo y la confiabilidad.`,
      });
      setFase('result');
    }, 3500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        
        {/* FASE 1: INGRESAR DATOS */}
        {fase === 'input' && (
          <motion.div key="input-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Users size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Define tu Público Objetivo</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>¿Quiénes serán las personas que comprarán tu producto o servicio?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Rango de Edad</label>
                <select name="rangoEdad" value={datos.rangoEdad} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecciona una opción...</option>
                  <option value="15-20">15 a 20 años (Adolescentes)</option>
                  <option value="20-30">20 a 30 años (Jóvenes)</option>
                  <option value="30-45">30 a 45 años (Adultos)</option>
                  <option value="45-60">45 a 60 años (Adultos Mayores)</option>
                  <option value="Todas las edades">Todas las edades</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Ubicación</label>
                <input 
                  type="text" 
                  name="ubicacion" 
                  value={datos.ubicacion} 
                  onChange={handleChange} 
                  placeholder="Ej: Mi barrio, Zona Sur, Ciudad..." 
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Nivel de Ingresos</label>
                <select name="nivelIngresos" value={datos.nivelIngresos} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecciona una opción...</option>
                  <option value="Bajos/Estudiantes">Bajos / Dependientes</option>
                  <option value="Medios">Medios (Clase trabajadora)</option>
                  <option value="Altos">Altos (Profesionales/Empresarios)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Principal Interés</label>
                <input 
                  type="text" 
                  name="intereses" 
                  value={datos.intereses} 
                  onChange={handleChange} 
                  placeholder="Ej: Cuidar su salud, Ahorrar tiempo, Tecnología..." 
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn-primary" 
                disabled={!allFilled}
                onClick={generarPerfil}
                style={{ opacity: allFilled ? 1 : 0.5, fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Bot /> Generar Perfil Ideal con IA
              </button>
            </div>
          </motion.div>
        )}

        {/* FASE 2: LOADING IA */}
        {fase === 'loading_ai' && (
          <motion.div key="loading-ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '2rem' }}>
              <Bot size={80} color="var(--accent)" />
            </motion.div>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>IA Construyendo Perfil...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Analizando comportamiento y empatía para tu público objetivo.</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '3rem', overflow: 'hidden' }}>
              <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3.5 }} style={{ height: '100%', background: 'var(--accent)' }} />
            </div>
          </motion.div>
        )}

        {/* FASE 3: RESULTADO PERFIL IA */}
        {fase === 'result' && perfilIA && (
          <motion.div key="result-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <UserCheck size={50} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
              <h2 style={{ fontSize: '2.5rem', color: '#0f172a' }}>Tu Buyer Persona</h2>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '1rem' }}>{perfilIA.nombre}</h3>
              <p style={{ color: '#0f172a', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{perfilIA.descripcion}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <h4 style={{ color: '#EF4444', marginBottom: '0.5rem' }}>Punto de Dolor</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>{perfilIA.dolor}</p>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Motivación de Compra</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>{perfilIA.motivacion}</p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn-primary" 
                onClick={() => onComplete(datos, perfilIA)}
                style={{ fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save /> Guardar y Continuar a Encuestas <ArrowRight />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '1rem',
  fontSize: '1.1rem',
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 'var(--radius-md)',
  color: '#0f172a',
  outline: 'none',
  transition: 'border-color 0.2s'
};
