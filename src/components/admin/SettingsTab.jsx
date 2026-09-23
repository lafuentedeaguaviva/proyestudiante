import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save } from 'lucide-react';

const SettingsTab = ({ qrUrl, setQrUrl, limiteIA, setLimiteIA, handleSaveQr }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'rgba(15, 23, 42, 0.7)', 
          backdropFilter: 'blur(12px)',
          padding: '2.5rem', 
          borderRadius: '1.5rem', 
          border: '1px solid rgba(255,255,255,0.05)', 
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Settings size={28} color="#10b981" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>
                Muro de Pago (QR) y Límites
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.5rem 0 0 0' }}>
                Configura la URL del código QR y el límite de usos de IA por proyecto.
              </p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleSaveQr}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
          >
            <Save size={18} /> Guardar Configuración
          </motion.button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>URL del Código QR</label>
              <input
                type="text"
                placeholder="https://ejemplo.com/mi-qr.png"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Límite de usos de IA por Proyecto</label>
              <input
                type="number"
                min="1"
                value={limiteIA}
                onChange={(e) => setLimiteIA(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', padding: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Vista Previa del QR</h3>
            {qrUrl ? (
              <img src={qrUrl} alt="Vista previa QR" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} onError={(e) => e.target.style.display = 'none'} />
            ) : (
              <div style={{ width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                Sin imagen
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsTab;
