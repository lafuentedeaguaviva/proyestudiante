import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Video, Image as ImageIcon, Headphones, FileText } from 'lucide-react';

export default function PanelRecursos({ recursos }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(recursos[0]?.id || 0);

  if (!recursos || recursos.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={20} />;
      case 'audio': return <Headphones size={20} />;
      case 'foto': return <ImageIcon size={20} />;
      case 'pista': return <FileText size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  const activeRecurso = recursos.find((r, idx) => (r.id || idx) === activeTab) || recursos[0];

  return (
    <>
      {/* Botón Flotante */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--accent)',
          color: '#0F172A',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
          zIndex: 40
        }}
      >
        <BookOpen size={24} /> Recursos Disponibles
      </motion.button>

      {/* Modal de Recursos */}
      <AnimatePresence>
        {isOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '900px',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Cabecera */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={24} /> Biblioteca de Recursos
                </h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar de Navegación */}
                <div style={{ width: '250px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto' }}>
                  {recursos.map((rec, idx) => {
                    const id = rec.id || idx;
                    const isActive = activeTab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        style={{
                          width: '100%', padding: '1rem', textAlign: 'left',
                          background: isActive ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                          border: 'none', borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                          color: isActive ? 'white' : 'var(--text-secondary)',
                          display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {getIcon(rec.type)}
                        <span style={{ fontWeight: isActive ? 'bold' : 'normal', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {rec.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Contenido Principal */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white' }}>{activeRecurso.title}</h2>
                  
                  {activeRecurso.type === 'pista' && (
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2rem', borderRadius: 'var(--radius-md)', fontSize: '1.2rem', lineHeight: 1.6, color: '#E2E8F0' }}>
                      {activeRecurso.content}
                    </div>
                  )}

                  {activeRecurso.type === 'video' && (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: 'black', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <iframe 
                        width="100%" height="100%" 
                        src={activeRecurso.url} 
                        title={activeRecurso.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  )}

                  {activeRecurso.type === 'foto' && (
                    <div style={{ textAlign: 'center' }}>
                      <img 
                        src={activeRecurso.url} 
                        alt={activeRecurso.title} 
                        style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: 'var(--radius-md)', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.1)' }} 
                      />
                    </div>
                  )}

                  {activeRecurso.type === 'audio' && (
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                      <Headphones size={60} color="var(--primary)" />
                      <audio controls style={{ width: '100%', maxWidth: '400px' }}>
                        <source src={activeRecurso.url} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                    </div>
                  )}
                  
                  {activeRecurso.description && (
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {activeRecurso.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
