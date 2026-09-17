import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, AlertTriangle } from 'lucide-react';
import { obtenerArchivoClasificado } from '../../services/api';

const ArchivoClasificado = ({ tema, isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && tema) {
      setLoading(true);
      obtenerArchivoClasificado(tema).then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [isOpen, tema]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, rotateX: 20 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, y: 50, rotateX: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{
              background: '#09090b', border: '1px solid #3f3f46',
              maxWidth: '800px', width: '100%', maxHeight: '90vh',
              overflowY: 'auto', borderRadius: '8px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Header / Tape */}
            <div style={{ background: '#eab308', color: '#000', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} />
                ARCHIVO CLASIFICADO - ACCESO CONCEDIDO
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#000' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '3rem' }}>
              {loading ? (
                <div style={{ color: '#a1a1aa', textAlign: 'center', fontFamily: 'monospace', padding: '2rem' }}>
                  Desencriptando base de datos...
                </div>
              ) : data ? (
                <div style={{ color: '#e4e4e7', fontFamily: 'monospace' }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#f4f4f5', borderBottom: '1px dashed #3f3f46', paddingBottom: '1rem' }}>
                    {data.titulo}
                  </h2>
                  
                  {data.contenido.map((seccion, index) => (
                    <div key={index} style={{ marginBottom: '2rem' }}>
                      <h3 style={{ color: '#3b82f6', fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                        &gt; {seccion.subtitulo}
                      </h3>
                      {seccion.texto && (
                        <p style={{ lineHeight: '1.8', color: '#a1a1aa', fontSize: '1.1rem', textAlign: 'justify' }}>
                          {seccion.texto}
                        </p>
                      )}
                      {seccion.lista && (
                        <ul style={{ lineHeight: '1.8', color: '#a1a1aa', fontSize: '1.1rem', paddingLeft: '1.5rem', textAlign: 'justify' }}>
                          {seccion.lista.map((item, i) => (
                            <li key={i} style={{ marginBottom: '1rem' }}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  <div style={{ marginTop: '4rem', padding: '2rem', background: '#18181b', borderLeft: '4px solid #10b981' }}>
                    <h3 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem', textTransform: 'uppercase' }}>
                      <BookOpen size={18} />
                      Referencias (Formato APA)
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: '#71717a' }}>
                      {data.bibliografia.map((ref, i) => (
                        <li key={i} style={{ marginBottom: '0.75rem', paddingLeft: '1rem', textIndent: '-1rem' }}>
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#ef4444', textAlign: 'center' }}>
                  Error al cargar el archivo.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArchivoClasificado;
