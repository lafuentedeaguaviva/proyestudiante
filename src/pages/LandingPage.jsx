import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cloud, ArrowRight, Sparkles, CheckCircle2, GraduationCap, Bot, Zap, Rocket } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      },
    }),
  };

  const fasesReales = [
    { id: 1, title: 'Encontrar la Idea', desc: 'Lluvia de ideas y selección de tu propuesta ganadora.' },
    { id: 2, title: 'Validación de la Idea', desc: 'Diseño de encuestas, tabulación y análisis de resultados en el mercado.' },
    { id: 3, title: 'Público Objetivo', desc: 'Definición exacta de a quién va dirigido tu emprendimiento.' },
    { id: 4, title: 'Diseño del Producto', desc: 'Características, beneficios, empaque y demanda potencial.' },
    { id: 5, title: 'Estrategia de Marketing', desc: 'Análisis de competencia, entorno y tu ventaja competitiva.' },
    { id: 6, title: 'Distribución', desc: 'Elección de canales, localización física y métodos de pago.' },
    { id: 7, title: 'Planteamiento', desc: 'Misión, visión, objetivos generales y justificación del proyecto.' },
    { id: 8, title: 'La Operación', desc: 'Definición paso a paso de los procesos para crear tu producto/servicio.' },
    { id: 9, title: 'Organigrama', desc: 'Estructura organizacional y roles de tu futuro equipo de trabajo.' },
    { id: 10, title: 'Finanzas (Viabilidad)', desc: 'Costos, precio de venta, punto de equilibrio, VAN y TIR.' },
    { id: 11, title: 'Consolidación', desc: 'Redacción de introducción, conclusiones y dedicatorias.' },
    { id: 12, title: 'Proyecto de Vida', desc: 'Alineación de tu emprendimiento con tus metas personales a futuro.' },
    { id: 13, title: 'Documento Final IA', desc: 'La Inteligencia Artificial genera y formatea tu documento en Word, ¡listo para imprimir!' }
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
              Comenzar mi Proyecto 🚀
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
              Ver las 13 Fases
            </button>
          </div>
        </motion.div>

        {/* Las Fases Section - Roadmap Completo */}
        <div id="como-funciona" style={{ paddingTop: '4rem', marginBottom: '8rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>El Mapa hacia tu Éxito</h2>
          <p style={{ color: '#64748b', marginBottom: '4rem', fontSize: '1.125rem', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
            Sigue este camino estructurado de 13 misiones y convierte una simple idea en un documento académico profesional listo para ser defendido e impreso.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem', 
            textAlign: 'left' 
          }}>
            {fasesReales.map((fase, idx) => (
              <motion.div 
                key={fase.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={idx % 4}
                style={{
                  background: fase.id === 13 ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: fase.id === 13 ? 'none' : '1px solid #e2e8f0',
                  boxShadow: fase.id === 13 ? '0 10px 25px -5px rgba(59, 130, 246, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Number Watermark */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '5px',
                  fontSize: '5rem',
                  fontWeight: 900,
                  color: fase.id === 13 ? 'rgba(255,255,255,0.1)' : 'rgba(226, 232, 240, 0.5)',
                  zIndex: 0,
                  userSelect: 'none'
                }}>
                  {fase.id}
                </div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {fase.id === 13 ? <Rocket size={20} color="#fff" /> : <CheckCircle2 size={20} color="#3b82f6" />}
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: fase.id === 13 ? '#fff' : '#0f172a' }}>
                      {fase.title}
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: fase.id === 13 ? 'rgba(255,255,255,0.9)' : '#475569', lineHeight: 1.5 }}>
                    {fase.desc}
                  </p>
                </div>
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
