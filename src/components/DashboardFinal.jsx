import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Download, Share2, Star } from 'lucide-react';

export default function DashboardFinal({ projectName, caminoElegido }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Retraso para que la animación de entrada se complete antes del "confeti"
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Generamos algunas estrellitas "confeti" con framer-motion
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth - window.innerWidth / 2,
    y: Math.random() * window.innerHeight - window.innerHeight / 2,
    scale: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 0.5
  }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Animación de Estrellas/Confeti */}
      {showConfetti && stars.map(star => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: star.scale, x: star.x, y: star.y }}
          transition={{ duration: 2, delay: star.delay, repeat: Infinity, repeatDelay: 3 }}
          style={{ position: 'absolute', zIndex: 0, color: 'gold' }}
        >
          <Star size={24} fill="gold" />
        </motion.div>
      ))}

      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ zIndex: 10, background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,140,0,0.2) 100%)', padding: '4rem', borderRadius: '50%', border: '4px solid gold', marginBottom: '2rem' }}
      >
        <Trophy size={120} color="gold" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel" 
        style={{ zIndex: 10, padding: '4rem', textAlign: 'center', maxWidth: '800px', width: '100%' }}
      >
        <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '1rem', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
          ¡Felicidades, Graduado!
        </h1>
        
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Has completado con éxito todas las fases de tu 
          <strong style={{ color: caminoElegido === 'A' ? 'var(--primary)' : 'var(--accent)' }}>
            {caminoElegido === 'A' ? ' Emprendimiento Productivo' : ' Proyecto de Innovación'}
          </strong>.
        </p>
        
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
          <h2 style={{ color: 'gold', fontSize: '2rem', marginBottom: '0.5rem' }}>{projectName || 'Tu Proyecto'}</h2>
          <p style={{ color: '#e2e8f0' }}>Está listo para cambiar el mundo.</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', padding: '1rem 2rem' }}>
            <Download size={24} /> Descargar Proyecto Completo
          </button>
          
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', padding: '1rem 2rem' }}>
            <Share2 size={24} /> Compartir Logro
          </button>
        </div>
      </motion.div>
      
    </div>
  );
}
