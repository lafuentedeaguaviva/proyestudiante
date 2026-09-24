import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowRight, Sparkles, Lightbulb, BarChart3, CircleDollarSign, Printer, GraduationCap, Bot, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeUp = {
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

  const fases = [
    {
      id: 'fase1',
      icon: <Lightbulb size={32} color="#fff" />,
      title: 'Fase 1: Ideación con IA',
      desc: 'Desarrolla el núcleo de tu emprendimiento. Tu Mentor virtual te ayudará a aterrizar tu problema, encontrar tu público objetivo y validar tu propuesta.',
      colorStart: '#3b82f6',
      colorEnd: '#1d4ed8'
    },
    {
      id: 'fase2',
      icon: <BarChart3 size={32} color="#fff" />,
      title: 'Fase 2: Mercado y Encuestas',
      desc: '¿Matemáticas difíciles? Deja que la IA procese tus encuestas, analice a tu competencia y genere los gráficos automáticamente.',
      colorStart: '#8b5cf6',
      colorEnd: '#6d28d9'
    },
    {
      id: 'fase3',
      icon: <CircleDollarSign size={32} color="#fff" />,
      title: 'Fase 3: Viabilidad Financiera',
      desc: 'Calcula costos, ingresos y márgenes de ganancia con herramientas interactivas diseñadas para que los números tengan sentido.',
      colorStart: '#ec4899',
      colorEnd: '#be185d'
    },
    {
      id: 'fase4',
      icon: <Printer size={32} color="#fff" />,
      title: 'Fase 4: Documento Listo para Imprimir',
      desc: 'Al terminar, la IA consolida todo tu trabajo, le da formato académico y te entrega un archivo Word perfecto para presentar en tu colegio.',
      colorStart: '#10b981',
      colorEnd: '#047857'
    }
  ];

  const features = [
    {
      icon: <GraduationCap size={28} color="#3b82f6" />,
      title: 'Diseñado para Colegios',
      desc: 'Estructura pensada específicamente para cumplir con los requisitos académicos de investigación y proyectos de grado.'
    },
    {
      icon: <Bot size={28} color="#8b5cf6" />,
      title: 'Tu Propio Mentor 24/7',
      desc: 'No estás solo. Un asistente especializado revisará tus respuestas y mejorará tu redacción académica al instante.'
    },
    {
      icon: <Zap size={28} color="#ec4899" />,
      title: 'Cero Bloqueos Mentales',
      desc: 'Avanza a tu propio ritmo a través de misiones cortas y gamificadas en lugar de enfrentarte a un documento de Word en blanco.'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#1e293b',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        padding: '1.25rem 2rem',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ 
          fontWeight: 900, 
          fontSize: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem'
        }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Cloud size={24} color="#ffffff" />
          </div>
          <span style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
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
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1e293b'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#0f172a'; }}
        >
          Iniciar Sesión <ArrowRight size={16} />
        </button>
      </header>

      <main style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        
        {/* Hero Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} style={{ marginBottom: '6rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem', 
            background: 'rgba(59, 130, 246, 0.1)', 
            color: '#2563eb', 
            borderRadius: '2rem', 
            fontWeight: 700, 
            fontSize: '0.875rem', 
            marginBottom: '2rem',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <Sparkles size={16} /> EL FUTURO DE LA INVESTIGACIÓN ESCOLAR
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 900, 
            color: '#0f172a', 
            marginBottom: '1.5rem', 
            letterSpacing: '-0.03em', 
            lineHeight: 1.1 
          }}>
            Tu Proyecto de Emprendimiento, <br/>
            <span style={{ color: '#3b82f6' }}>
              de la Idea al Papel
            </span>
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)', 
            color: '#475569', 
            maxWidth: '800px', 
            margin: '0 auto 3rem auto', 
            lineHeight: 1.6
          }}>
            Olvídate del estrés de la página en blanco. <b>ProyectoEdu.cloud</b> guía a estudiantes de colegio paso a paso para investigar, estructurar y redactar proyectos de grado listos para presentar e imprimir, todo con la ayuda de Inteligencia Artificial.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{
                padding: '1.25rem 2.5rem',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '3rem',
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Sellar mi Expediente Oficial 🚀
            </button>
            <button 
              onClick={() => {
                document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: '1.25rem 2.5rem',
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '3rem',
                color: '#0f172a',
                fontSize: '1.125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; }}
            >
              Ver cómo funciona
            </button>
          </div>
        </motion.div>

        {/* Las Fases Section */}
        <div id="como-funciona" style={{ paddingTop: '4rem', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>El Viaje del Emprendedor</h2>
          <p style={{ color: '#64748b', marginBottom: '4rem', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
            Sigue este camino estructurado y convierte una simple idea en un documento académico profesional.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {fases.map((fase, idx) => (
              <motion.div 
                key={fase.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={idx}
                style={{
                  background: '#ffffff',
                  padding: '2.5rem 2rem',
                  borderRadius: '1.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ 
                  display: 'inline-flex', padding: '1rem', borderRadius: '1rem', 
                  background: `linear-gradient(135deg, ${fase.colorStart}, ${fase.colorEnd})`,
                  marginBottom: '1.5rem',
                  boxShadow: `0 10px 15px -3px ${fase.colorStart}40`
                }}>
                  {fase.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#0f172a' }}>
                  {fase.title}
                </h3>
                <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
                  {fase.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features / Benefits */}
        <div style={{ background: '#0f172a', borderRadius: '2rem', padding: '4rem 2rem', color: '#ffffff' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem' }}>¿Por qué usar ProyectoEdu.cloud?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', textAlign: 'left' }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{feat.title}</h3>
                <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default LandingPage;
