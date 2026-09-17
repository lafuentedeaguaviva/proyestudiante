import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight } from 'lucide-react';

export default function Paso2_1_VideoRecurso({ onNext }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', textAlign: 'center' }}>Aprende del Entorno</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center', marginBottom: '2rem' }}>
        Mira este video para entender cómo identificar problemas reales antes de intentar solucionarlos.
      </p>

      <div style={{ background: '#000', height: '300px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
        <PlayCircle size={60} color="var(--primary)" style={{ opacity: 0.5 }} />
        <span style={{ color: 'var(--text-secondary)', marginLeft: '1rem' }}>[Video: Cómo observar tu entorno - 3 min]</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn-primary" onClick={onNext} style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
          Continuar <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
