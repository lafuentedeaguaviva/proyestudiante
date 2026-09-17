import { motion } from 'framer-motion';
import { Eye, Map, ArrowRight } from 'lucide-react';

export default function Paso2Observacion({ observacion, setObservacion, areaSeleccionada, onNext }) {
  const handleContinue = () => {
    if (observacion.trim().length > 10) {
      onNext();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Eye size={60} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Observaciones del Entorno</h2>
        
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'inline-block', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={24} /> Foco de búsqueda: {areaSeleccionada || 'Informática'}
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textAlign: 'left', lineHeight: '1.6', marginBottom: '2rem' }}>
          Todo emprendimiento nace al aprovechar una oportunidad o necesidad del entorno. Tu misión ahora es recorrer tu comunidad e identificar negocios existentes, detectar dificultades o necesidades insatisfechas relacionadas con tu área.
        </p>
      </div>

      <div style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>Validación de Aprendizaje</h3>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          ¿Identificaste algún problema inicial o necesidad en tu entorno? Descríbelo brevemente:
        </p>
        <textarea 
          value={observacion}
          onChange={e => setObservacion(e.target.value)}
          placeholder="Ej: En mi barrio hay muchos restaurantes pero ninguno ofrece servicio de mantenimiento rápido para sus cocinas industriales..."
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '1.5rem',
            fontSize: '1.1rem',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: '#0f172a',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button 
          className="btn-primary" 
          onClick={handleContinue}
          disabled={observacion.trim().length <= 10}
          style={{ opacity: observacion.trim().length > 10 ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
        >
          Siguiente <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
