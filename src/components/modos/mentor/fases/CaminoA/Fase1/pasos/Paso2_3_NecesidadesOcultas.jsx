import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

export default function Paso2_3_NecesidadesOcultas({ onNext }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <FileText size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Detectando Necesidades Ocultas</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          No todas las necesidades son evidentes a simple vista. Lee este artículo para afinar tu intuición.
        </p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '1rem' }}><strong>1. Observa lo que la gente improvisa:</strong> Cuando alguien usa un objeto para un fin distinto al original, hay una necesidad insatisfecha.</p>
        <p style={{ marginBottom: '1rem' }}><strong>2. Escucha las quejas recurrentes:</strong> "Ojalá existiera algo que..." es el inicio de muchos grandes negocios.</p>
        <p><strong>3. Analiza los "procesos dolorosos":</strong> Cualquier tarea que sea aburrida, lenta o frustrante es una oportunidad de innovación.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button className="btn-primary" onClick={onNext} style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
          Continuar <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
