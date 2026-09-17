import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Rocket, Target } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut"
      },
    }),
  };

  const mundos = [
    { 
      id: 'detective',
      icon: <Target size={36} color="#fff" />, 
      title: 'El Detective', 
      desc: 'Misterio, análisis de pistas y estrategia profunda.',
      colorStart: '#0f172a', // Slate 900
      colorEnd: '#334155', // Slate 700
      accent: '#3b82f6' // Blue
    },
    { 
      id: 'heroe',
      icon: <Shield size={36} color="#fff" />, 
      title: 'El Héroe', 
      desc: 'Valor, batallas épicas y disrupción del mercado.',
      colorStart: '#991b1b', // Red 800
      colorEnd: '#ea580c', // Orange 600
      accent: '#facc15' // Yellow
    },
    { 
      id: 'visionario',
      icon: <Rocket size={36} color="#fff" />, 
      title: 'El Visionario', 
      desc: 'Tecnología, cyberpunk y construcción del futuro.',
      colorStart: '#4c1d95', // Violet 900
      colorEnd: '#9333ea', // Purple 600
      accent: '#2dd4bf' // Teal
    },
    { 
      id: 'redentor',
      icon: <BookOpen size={36} color="#fff" />, 
      title: 'El Redentor', 
      desc: 'Impacto social, paz y legado trascendental.',
      colorStart: '#064e3b', // Emerald 900
      colorEnd: '#059669', // Emerald 600
      accent: '#d9f99d' // Lime
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      color: '#1e293b',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* Header Glassmorphism */}
      <header style={{
        padding: '1.25rem 2rem',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
      }}>
        <div style={{ fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Rocket size={24} color="#8b5cf6" />
          <span>EduGamify</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '0.6rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none',
            borderRadius: '2rem',
            color: '#0f172a',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.39)'; }}
        >
          Iniciar Sesión
        </button>
      </header>

      <main style={{ padding: '6rem 2rem 4rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Hero Section */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} custom={0}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed', borderRadius: '2rem', fontWeight: 700, fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            NUEVA FORMA DE APRENDER 🚀
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Convierte tu Proyecto en <br/>
            <span style={{ background: 'linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Una Aventura Épica
            </span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: 1.7 }}>
            Olvídate de los aburridos documentos de Word. Defiende tus ideas ante villanos, descubre pistas en el mercado y sube de nivel mientras construyes tu futuro.
          </p>
          
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: '3rem',
              color: '#0f172a',
              fontSize: '1.25rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
          >
            Sellar mi Expediente Oficial
          </button>
        </motion.div>

        {/* Separador Visual */}
        <div style={{ marginTop: '7rem', marginBottom: '4rem', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent)' }} />

        {/* Mundos Section */}
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Elige tu Universo</h2>
          <p style={{ color: '#64748b', marginBottom: '3rem', fontSize: '1.1rem' }}>Cada perfil psicológico desata una narrativa única. ¿Qué camino te tocará?</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {mundos.map((mundo, idx) => (
              <motion.div 
                key={mundo.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={idx + 1}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{
                  background: `linear-gradient(145deg, ${mundo.colorStart}, ${mundo.colorEnd})`,
                  padding: '2.5rem 2rem',
                  borderRadius: '1.5rem',
                  color: '#0f172a',
                  textAlign: 'left',
                  boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 2px ${mundo.accent}33`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative background circle */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: mundo.accent, opacity: 0.1, filter: 'blur(20px)' }} />
                
                <div style={{ 
                  display: 'inline-flex', padding: '1rem', borderRadius: '1rem', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '1.5rem',
                  backdropFilter: 'blur(4px)'
                }}>
                  {mundo.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.025em' }}>
                  {mundo.title}
                </h3>
                <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5 }}>
                  {mundo.desc}
                </p>
                
                {/* Aesthetic bottom bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: mundo.accent }} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
