import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PanelRecursos from './PanelRecursos';

export default function PasoLayout({ children, onBack, tituloPaso, recursos }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem 1rem',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        {onBack && (
          <button
            onClick={onBack}
            className="btn-outline"
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              marginRight: '1.5rem',
              color: 'var(--text-secondary)'
            }}
          >
            <ArrowLeft size={20} /> Atrás
          </button>
        )}
        
        {tituloPaso && (
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: 0 }}>
            {tituloPaso}
          </h2>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {children}
      </div>

      {/* Panel Dinámico de Recursos */}
      {recursos && recursos.length > 0 && <PanelRecursos recursos={recursos} />}
    </motion.div>
  );
}
