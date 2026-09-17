import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb } from 'lucide-react';

export default function Paso5_5IdeandoSoluciones({ cuadros, setCuadros, onNext }) {
  const handleChange = (id, value) => {
    setCuadros(cuadros.map(c => c.id === id ? { ...c, solucionUsuario: value } : c));
  };

  const isComplete = cuadros.every(c => c.solucionUsuario && c.solucionUsuario.trim().length > 5);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', textAlign: 'center' }}>Ideando Soluciones</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center', marginBottom: '3rem' }}>
        Para cada frustración que encontraste, propón una idea de cómo podrías solucionarla.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        {cuadros.map((cuadro, index) => (
          <div key={cuadro.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.2rem' }}>Frustración #{index + 1}: {cuadro.frustracion || 'Sin definir'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              <strong>Sufren:</strong> {cuadro.quienes} | <strong>Cuándo:</strong> {cuadro.momento}
            </p>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              <Lightbulb size={18} /> ¿Cómo lo solucionarías?
            </label>
            <textarea 
              value={cuadro.solucionUsuario || ''}
              onChange={(e) => handleChange(cuadro.id, e.target.value)}
              placeholder="Ej: Una app móvil que se conecte directamente con el contador..."
              style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', color: '#0f172a', minHeight: '100px', resize: 'vertical' }}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn-primary" 
          onClick={onNext}
          disabled={!isComplete}
          style={{ opacity: isComplete ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
        >
          Estructurar con IA <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
