import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, CheckCircle, AlertCircle } from 'lucide-react';

const ModalPagoQR = ({ isOpen, onClose, onConfirm, qrUrl }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 9999, padding: '1rem'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '450px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', background: 'rgba(30, 41, 59, 0.5)' }}>
            <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrCode size={24} color="#3b82f6" />
              Nuevo Proyecto
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: '0.25rem', borderRadius: '0.25rem', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
              Para iniciar una nueva aventura y crear un proyecto, escanea el código QR a continuación para realizar el pago correspondiente.
            </p>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', width: '220px', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              {qrUrl ? (
                <img src={qrUrl} alt="Código QR de Pago" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8', gap: '0.5rem' }}>
                  <AlertCircle size={32} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>QR no configurado</span>
                </div>
              )}
            </div>
            
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed rgba(59, 130, 246, 0.3)', padding: '1rem', borderRadius: '0.75rem', width: '100%' }}>
              <p style={{ color: '#60a5fa', margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>
                Una vez realizado el pago, envía tu comprobante al administrador.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem', borderTop: '1px solid #1e293b', background: 'rgba(30, 41, 59, 0.3)' }}>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.background = 'transparent'; }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.2)'; }}
            >
              <CheckCircle size={18} /> Ya pagué
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModalPagoQR;
