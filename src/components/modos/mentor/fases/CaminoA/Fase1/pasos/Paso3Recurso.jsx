import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Paso3Recurso({ respuestasRecurso, setRespuestasRecurso, onNext }) {
  const [selectedRecurso, setSelectedRecurso] = useState(null);

  const recursos = [
    { id: 'video_observacion', type: 'video', title: 'Cómo observar tu entorno', icon: PlayCircle, duration: '3 min' },
    { id: 'articulo_necesidades', type: 'article', title: 'Detectando necesidades ocultas', icon: FileText, duration: '5 min' }
  ];

  const handleSelect = (rec) => {
    setSelectedRecurso(rec);
  };

  const handleRespuesta = (val) => {
    setRespuestasRecurso(val);
  };

  const handleContinue = () => {
    if (respuestasRecurso.trim().length > 10) {
      onNext();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', textAlign: 'center' }}>Aprende del Entorno</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center', marginBottom: '2rem' }}>
        Selecciona un recurso para entender cómo identificar problemas reales antes de intentar solucionarlos.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {recursos.map((rec) => {
          const Icon = rec.icon;
          const isSelected = selectedRecurso?.id === rec.id;
          return (
            <div 
              key={rec.id} 
              onClick={() => handleSelect(rec)}
              style={{
                background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                width: '200px'
              }}
            >
              <Icon size={40} color={isSelected ? 'var(--primary)' : 'var(--text-secondary)'} />
              <h4 style={{ color: '#0f172a', textAlign: 'center', fontSize: '1rem' }}>{rec.title}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rec.duration}</span>
              {isSelected && <CheckCircle2 size={20} color="var(--primary)" style={{ position: 'absolute', top: '10px', right: '10px' }} />}
            </div>
          );
        })}
      </div>

      {selectedRecurso && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <selectedRecurso.icon size={24} color="var(--primary)" />
            <h3 style={{ color: '#0f172a', fontSize: '1.3rem' }}>{selectedRecurso.title}</h3>
          </div>
          <div style={{ background: '#000', height: '200px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
            <span style={{ color: 'var(--text-secondary)' }}>[Simulación de {selectedRecurso.type === 'video' ? 'Reproductor de Video' : 'Contenido del Artículo'}]</span>
          </div>
          
          <h4 style={{ color: '#0f172a', marginBottom: '1rem' }}>¿Qué aprendiste de este recurso?</h4>
          <textarea 
            value={respuestasRecurso}
            onChange={e => handleRespuesta(e.target.value)}
            placeholder="Escribe aquí tu reflexión sobre el material..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-sm)',
              color: '#0f172a',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </motion.div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
