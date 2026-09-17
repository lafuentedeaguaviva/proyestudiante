import { motion, AnimatePresence } from 'framer-motion';

export default function AyudanteComic({ texto }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', maxWidth: '850px', width: '100%', margin: '0 auto 3rem auto' }}>
      
      {/* Avatar del Ayudante animado */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }} 
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ 
          width: '120px', height: '120px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          flexShrink: 0, border: '4px solid white', 
          boxShadow: '0 0 30px rgba(59,130,246,0.6)',
          zIndex: 2
        }}
      >
        <span style={{ fontSize: '4rem' }}>🤖</span>
      </motion.div>

      {/* Globo de texto Estilo Cómic más orgánico */}
      <AnimatePresence mode="wait">
        <motion.div
          key={texto}
          initial={{ opacity: 0, scale: 0.8, x: -30, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 30, rotate: 5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{
            position: 'relative',
            background: 'white',
            color: '#0F172A',
            padding: '2rem',
            // Forma asimétrica para que parezca dibujado a mano/orgánico
            borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
            border: '3px solid #0F172A',
            fontSize: '1.25rem',
            fontWeight: '600',
            lineHeight: '1.6',
            boxShadow: '8px 8px 0px rgba(59,130,246,0.8)',
            flex: 1
          }}
        >
          {/* Triángulo del globo */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '-25px',
            transform: 'translateY(-50%)',
            width: '0',
            height: '0',
            borderTop: '15px solid transparent',
            borderBottom: '15px solid transparent',
            borderRight: '25px solid #0F172A'
          }}>
            <div style={{
              position: 'absolute',
              top: '-11px',
              left: '4px',
              width: '0',
              height: '0',
              borderTop: '11px solid transparent',
              borderBottom: '11px solid transparent',
              borderRight: '20px solid white'
            }} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: texto }} />
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
