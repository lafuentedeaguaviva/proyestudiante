import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';

export default function Paso5CuadrosJTBD({ cuadros, setCuadros, onNext }) {
  const handleChange = (id, field, value) => {
    setCuadros(cuadros.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addFrustracion = () => {
    setCuadros([...cuadros, {
      id: Date.now(),
      frustracion: '',
      quienes: '',
      momento: '',
      alternativas: ''
    }]);
  };

  const removeFrustracion = (id) => {
    if (cuadros.length > 1) {
      setCuadros(cuadros.filter(c => c.id !== id));
    }
  };

  const isComplete = cuadros.every(c => 
    c.frustracion.length > 5 && 
    c.quienes.length > 3 && 
    c.momento.length > 3 && 
    c.alternativas.length > 3
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', textAlign: 'center' }}>Estructurando el Dolor</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center', marginBottom: '2.5rem' }}>
        Llena cada cuadro basándote en lo que observaste en tu entorno. Puedes añadir múltiples frustraciones.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '3rem' }}>
        <AnimatePresence>
          {cuadros.map((cuadro, index) => (
            <motion.div 
              key={cuadro.id}
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              style={{ position: 'relative', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#0f172a', margin: 0 }}>Frustración #{index + 1}</h3>
                {cuadros.length > 1 && (
                  <button 
                    onClick={() => removeFrustracion(cuadro.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Trash2 size={18} /> Eliminar
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#ef4444', fontWeight: 'bold' }}>1. Frustración o tarea odiada</label>
                  <textarea 
                    value={cuadro.frustracion}
                    onChange={(e) => handleChange(cuadro.id, 'frustracion', e.target.value)}
                    placeholder="Ej: Odian organizar las facturas a fin de mes..."
                    style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: '#0f172a', minHeight: '100px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#3b82f6', fontWeight: 'bold' }}>2. ¿Quiénes tienen esa frustración?</label>
                  <textarea 
                    value={cuadro.quienes}
                    onChange={(e) => handleChange(cuadro.id, 'quienes', e.target.value)}
                    placeholder="Ej: Dueños de pequeños negocios locales..."
                    style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-sm)', color: '#0f172a', minHeight: '100px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#10b981', fontWeight: 'bold' }}>3. ¿En qué momento de vida/día?</label>
                  <textarea 
                    value={cuadro.momento}
                    onChange={(e) => handleChange(cuadro.id, 'momento', e.target.value)}
                    placeholder="Ej: El último viernes del mes cuando deben pagar impuestos..."
                    style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)', color: '#0f172a', minHeight: '100px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#f59e0b', fontWeight: 'bold' }}>4. Alternativas actuales que usan</label>
                  <textarea 
                    value={cuadro.alternativas}
                    onChange={(e) => handleChange(cuadro.id, 'alternativas', e.target.value)}
                    placeholder="Ej: Usan excel manual o pagan a un contador externo caro..."
                    style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', color: '#0f172a', minHeight: '100px', resize: 'vertical' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={addFrustracion}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', color: '#0f172a', padding: '1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <Plus size={20} /> Añadir otra frustración
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn-primary" 
          onClick={onNext}
          disabled={!isComplete}
          style={{ opacity: isComplete ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
        >
          Mejorar con IA <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
