import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Rocket, Target, Cloud, ArrowRight, Sparkles } from 'lucide-react';

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
      background: 'radial-gradient(ellipse at top, #f8fafc, #e2e8f0)',
      color: '#1e293b',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* Header Glassmorphism */}
      <header style={{
        padding: '1.25rem 2rem',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ 
          fontWeight: 900, 
          fontSize: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          color: '#1e293b'
        }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Cloud size={24} color="#ffffff" />
          </div>
          <span style={{ background: 'linear-gradient(to right, #1e293b, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            ProyectoEdu.cloud
          </span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#0f172a',
            border: 'none',
            borderRadius: '2rem',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(15, 23, 42, 0.39)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => { 
            e.currentTarget.style.transform = 'translateY(-2px)'; 
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.5)'; 
          }}
          onMouseOut={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)'; 
            e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(15, 23, 42, 0.39)'; 
          }}
        >
          Iniciar Sesión <ArrowRight size={16} />
        </button>
      </header>

      <main style={{ paddingTop: '8rem', paddingBottom: '6rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingX: '2rem' }}>
        
        {/* Hero Section */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} custom={0} style={{ padding: '0 1rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem', 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))', 
            color: '#4f46e5', 
            borderRadius: '2rem', 
            fontWeight: 700, 
            fontSize: '0.875rem', 
            marginBottom: '2rem', 
            border: '1px solid rgba(99, 102, 241, 0.2)' 
          }}>
            <Sparkles size={16} /> PLATAFORMA GAMIFICADA Y AI
          </div>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 5rem)', 
            fontWeight: 900, 
            color: '#0f172a', 
            marginBottom: '1.5rem', 
            letterSpacing: '-0.04em', 
            lineHeight: 1.05 
          }}>
            Desarrolla tu Proyecto <br/>
            <span style={{ 
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              display: 'inline-block'
            }}>
              en una Aventura Épica
            </span>
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 2vw, 1.35rem)', 
            color: '#475569', 
            maxWidth: '750px', 
            margin: '0 auto 3.5rem auto', 
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Olvídate del aburrimiento y la frustración. <b>ProyectoEdu.cloud</b> transforma la creación de tu proyecto de grado en un videojuego asistido por Inteligencia Artificial.
          </p>
          
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              border: 'none',
              borderRadius: '3rem',
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
          >
            Sellar mi Expediente Oficial <Rocket size={20} />
          </button>
        </motion.div>

        {/* Separador Visual */}
        <div style={{ marginTop: '7rem', marginBottom: '5rem', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent)' }} />

        {/* Mundos Section */}
        <div style={{ padding: '0 1rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', letterSpacing: '-0.025em' }}>Elige tu Arquetipo</h2>
          <p style={{ color: '#64748b', marginBottom: '4rem', fontSize: '1.15rem' }}>Cada perfil psicológico desata una narrativa única guiada por IA. ¿Qué camino dominarás?</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
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
                  color: '#ffffff',
                  textAlign: 'left',
                  boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 2px ${mundo.accent}33`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Decorative background circle */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: mundo.accent, opacity: 0.15, filter: 'blur(20px)' }} />
                
                <div style={{ 
                  display: 'inline-flex', padding: '1rem', borderRadius: '1rem', 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  marginBottom: '1.5rem',
                  backdropFilter: 'blur(8px)',
                  alignSelf: 'flex-start'
                }}>
                  {mundo.icon}
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.025em' }}>
                  {mundo.title}
                </h3>
                <p style={{ margin: 0, fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                  {mundo.desc}
                </p>
                
                {/* Aesthetic bottom bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', background: mundo.accent }} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
