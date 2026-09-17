import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              maxWidth: '450px',
              width: '90%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '2px solid #ca8a04',
              position: 'relative'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8'
              }}
            >
              <X size={24} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#ca8a04' }}>
              <AlertTriangle size={40} />
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>¿Estás seguro?</h3>
            </div>
            
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '2rem' }}>
              {message || "Si cambias esta selección, podrías perder datos asociados a tu elección anterior. ¿Deseas continuar?"}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1',
                  background: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                style={{
                  padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none',
                  background: '#ca8a04', color: 'white', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                Sí, cambiar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
