import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, School, BookOpen, Star, ArrowLeft } from 'lucide-react';

const AVATARES = [
  // Hombres
  { id: 'h1', img: 'https://randomuser.me/api/portraits/men/11.jpg', desc: 'El Analista: Lógico y directo.' },
  { id: 'h2', img: 'https://randomuser.me/api/portraits/men/22.jpg', desc: 'El Ejecutivo: Maestro de los negocios.' },
  { id: 'h3', img: 'https://randomuser.me/api/portraits/men/33.jpg', desc: 'El Constructor: Soluciona problemas reales.' },
  { id: 'h4', img: 'https://randomuser.me/api/portraits/men/44.jpg', desc: 'El Científico: Metódico y observador.' },
  { id: 'h5', img: 'https://randomuser.me/api/portraits/men/55.jpg', desc: 'El Creativo: Piensa fuera de la caja.' },
  // Mujeres
  { id: 'm1', img: 'https://randomuser.me/api/portraits/women/11.jpg', desc: 'La Analista: Lógica y precisa.' },
  { id: 'm2', img: 'https://randomuser.me/api/portraits/women/22.jpg', desc: 'La Ejecutiva: Líder de proyectos.' },
  { id: 'm3', img: 'https://randomuser.me/api/portraits/women/33.jpg', desc: 'La Inventora: Crea nuevas herramientas.' },
  { id: 'm4', img: 'https://randomuser.me/api/portraits/women/44.jpg', desc: 'La Científica: Detallista y curiosa.' },
  { id: 'm5', img: 'https://randomuser.me/api/portraits/women/55.jpg', desc: 'La Creadora: Innovadora por naturaleza.' }
];

export default function Onboarding({ onComplete, setAyudanteText }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    colegio: '',
    curso: '',
    caracteristica: '',
    avatar: ''
  });
  const [hoverAvatar, setHoverAvatar] = useState(null);

  useEffect(() => {
    switch(step) {
      case 1:
        setAyudanteText("¡Tu Identidad!<br/><br/>Para comenzar tu proyecto, necesitamos saber quién liderará la misión. Escribe tu nombre real.");
        break;
      case 2:
        setAyudanteText(`¡Excelente, ${formData.nombre}!<br/><br/>Ahora elige tu <b>Especialidad</b>. Pasa el cursor para ver el perfil de cada uno y selecciona el avatar que mejor te represente.`);
        break;
      case 3:
        setAyudanteText("¡Gran elección!<br/><br/>Necesitamos saber cuál es tu <b>Base de Operaciones</b>. ¿De qué colegio y curso nos visitas?");
        break;
      case 4:
        setAyudanteText("El paso final...<br/><br/>Descubre tu <b>Poder Oculto</b>. Cuéntanos qué te gusta hacer o en qué eres bueno. ¡Esto guiará tu destino!");
        break;
      default:
        break;
    }
  }, [step, formData.nombre]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(formData);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ padding: '3rem', maxWidth: '750px', width: '100%', margin: '0 auto', textAlign: 'center', position: 'relative' }}
    >
      {step > 1 && (
        <button 
          onClick={handlePrev} 
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
        >
          <ArrowLeft size={20} /> Atrás
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '0.5rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            style={{ 
              width: '40px', height: '8px', 
              borderRadius: 'var(--radius-full)', 
              background: i <= step ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s'
            }} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* PASO 1: NOMBRE */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem' }}>
                <User size={24} color="var(--primary)" style={{ marginRight: '1rem' }} />
                <input 
                  type="text" placeholder="Ingresa tu nombre real" 
                  value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})}
                  style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1.2rem' }}
                />
              </div>
            </div>
            
            <button className="btn-primary" style={{ marginTop: '2.5rem', width: '200px', fontSize: '1.2rem' }} onClick={handleNext} disabled={!formData.nombre.trim()}>
              Siguiente
            </button>
          </motion.div>
        )}

        {/* PASO 2: AVATAR */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem', marginTop: '2rem' }}>
              {AVATARES.map(av => (
                <button 
                  key={av.id}
                  onClick={() => setFormData({...formData, avatar: av.img})}
                  onMouseEnter={() => setHoverAvatar(av)}
                  onMouseLeave={() => setHoverAvatar(null)}
                  style={{
                    background: `url(${av.img}) center/cover`,
                    border: formData.avatar === av.img ? '4px solid var(--primary)' : '4px solid transparent',
                    borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s',
                    aspectRatio: '1', width: '100%', padding: 0,
                    boxShadow: formData.avatar === av.img ? '0 0 20px var(--primary-glow)' : 'none'
                  }}
                />
              ))}
            </div>

            <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
              {hoverAvatar ? (
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{hoverAvatar.desc}</span>
              ) : (
                <span style={{ color: 'var(--text-secondary)' }}>Selecciona el avatar realista que mejor te represente.</span>
              )}
            </div>
            
            <button className="btn-primary" style={{ marginTop: '2.5rem', width: '200px', fontSize: '1.2rem' }} onClick={handleNext} disabled={!formData.avatar}>
              Confirmar
            </button>
          </motion.div>
        )}

        {/* PASO 3: BASE */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px', margin: '0 auto', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem' }}>
                <School size={24} color="var(--primary)" style={{ marginRight: '1rem' }} />
                <input 
                  type="text" placeholder="Colegio / Institución" 
                  value={formData.colegio} onChange={e => setFormData({...formData, colegio: e.target.value})}
                  style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1.2rem' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem' }}>
                <BookOpen size={24} color="var(--primary)" style={{ marginRight: '1rem' }} />
                <input 
                  type="text" placeholder="Curso / Paralelo" 
                  value={formData.curso} onChange={e => setFormData({...formData, curso: e.target.value})}
                  style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1.2rem' }}
                />
              </div>
            </div>
            
            <button className="btn-primary" style={{ marginTop: '2.5rem', width: '200px', fontSize: '1.2rem' }} onClick={handleNext}>
              Siguiente
            </button>
          </motion.div>
        )}

        {/* PASO 4: PODER OCULTO */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '2rem' }}>
              <textarea 
                placeholder="Ejemplo: Me encanta desarmar cosas para ver cómo funcionan..." 
                value={formData.caracteristica} onChange={e => setFormData({...formData, caracteristica: e.target.value})}
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', height: '140px', outline: 'none', fontSize: '1.2rem', resize: 'none' }}
              />
            </div>
            
            <button className="btn-primary" style={{ marginTop: '2.5rem', width: '100%', maxWidth: '300px', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', margin: '2rem auto 0 auto' }} onClick={handleNext}>
              <Star size={24} /> Comenzar la Aventura
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
