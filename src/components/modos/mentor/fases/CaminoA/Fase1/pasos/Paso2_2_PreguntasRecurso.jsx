import { motion } from 'framer-motion';
import { ArrowRight, HelpCircle } from 'lucide-react';

export default function Paso2_2_PreguntasRecurso({ respuestasRecurso, setRespuestasRecurso, onNext }) {
  const handleContinue = () => {
    if (respuestasRecurso.trim().length > 10) {
      onNext();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <HelpCircle size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Reflexión del Recurso</h2>
      </div>

      <h4 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1.2rem' }}>¿Qué aprendiste de este recurso? ¿Cómo lo aplicarías en tu comunidad?</h4>
      <textarea 
        value={respuestasRecurso}
        onChange={e => setRespuestasRecurso(e.target.value)}
        placeholder="Escribe aquí tu reflexión sobre el material..."
        style={{
          width: '100%',
          minHeight: '150px',
          padding: '1.5rem',
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 'var(--radius-md)',
          color: '#0f172a',
          fontSize: '1.1rem',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit'
        }}
      />

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button 
          className="btn-primary" 
          onClick={handleContinue}
          disabled={respuestasRecurso.trim().length <= 10}
          style={{ opacity: respuestasRecurso.trim().length > 10 ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
        >
          Siguiente <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
