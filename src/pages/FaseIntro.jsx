import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Bot, Play } from 'lucide-react';

const FASES_INFO = {
  '1': {
    titulo: 'Encontrar la idea',
    descripcion: 'Observa tu entorno, detecta problemas y valida una idea de negocio viable.',
    path: '/fase/1?paso=1'
  },
  '2': {
    titulo: 'Validación de la Idea',
    descripcion: 'Aprende a diseñar encuestas, tabular resultados y validar si tu idea tiene demanda en el mercado real.',
    path: '/fase/2?paso=1'
  },
  '3': {
    titulo: 'Público Objetivo',
    descripcion: 'Es hora de definir exactamente a quién le vendes tu solución. Analizaremos tu segmento de clientes, sus dolores y cómo tu producto encaja en sus vidas.',
    path: '/fase/3?paso=1'
  },
  '4': {
    titulo: 'Diseño de producto o servicio',
    descripcion: 'Define las características, beneficios y empaque de tu solución. Estima la demanda potencial de tu mercado.',
    path: '/fase/4?paso=1'
  },
  '5': {
    titulo: 'Estrategia de Marketing',
    descripcion: 'Analiza a tus competidores, descubre tu ventaja competitiva y diseña tu plan de ataque para dominar el mercado.',
    path: '/fase/5?paso=1'
  },
  '6': {
    titulo: 'Localización y Distribución',
    descripcion: 'Elige el lugar estratégico para tu negocio y define cómo tu producto llegará a las manos de tus clientes.',
    path: '/fase/6?paso=1'
  },
  '7': {
    titulo: 'Planteamiento del Emprendimiento',
    descripcion: 'Realiza un diagnóstico del contexto productivo, define los objetivos, la misión, visión y justifica la viabilidad de tu emprendimiento.',
    path: '/fase/7?paso=1'
  },
  '8': {
    titulo: 'La Operación',
    descripcion: 'Diseña el flujo de trabajo, los procesos internos y el diagrama de tu negocio para operar como un reloj suizo.',
    path: '/fase/8?paso=1'
  },
  '9': {
    titulo: 'Estructura Organizacional',
    descripcion: 'Define los roles, responsabilidades y el organigrama de tu equipo de trabajo.',
    path: '/fase/9?paso=1'
  },
  '10': {
    titulo: 'Viabilidad y Sostenibilidad',
    descripcion: 'Analiza la inversión inicial, los costos fijos, costos variables y determina tu punto de equilibrio.',
    path: '/fase/10?paso=1'
  },
  '11': {
    titulo: 'Consolidación del Documento',
    descripcion: 'Recopila, revisa y da formato profesional a todas las partes de tu proyecto para tu documento definitivo.',
    path: '/fase/11?paso=1'
  },
  '12': {
    titulo: 'Proyecto de Vida',
    descripcion: 'Diseña el equilibrio perfecto entre tu emprendimiento y tu bienestar personal.',
    path: '/fase/12?paso=1'
  },
  '13': {
    titulo: 'Proyecto Final',
    descripcion: 'Genera el documento definitivo de tu proyecto integrando toda la información y descargándolo para su presentación.',
    path: '/fase/13'
  }
};

const FaseIntro = () => {
  const { faseId } = useParams();
  const navigate = useNavigate();

  const fase = FASES_INFO[faseId] || {
    titulo: 'Fase Desconocida',
    descripcion: 'Iniciando módulo de aprendizaje...',
    path: `/fase/${faseId}?paso=1`
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#334155', fontFamily: 'system-ui, sans-serif' }}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: '600px', background: 'white', padding: '4rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fefce8', border: '2px solid #fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
          <Bot size={40} color="#ca8a04" />
        </div>

        <h2 style={{ color: '#ca8a04', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem' }}>
          Fase {faseId}
        </h2>
        
        <h1 style={{ color: '#0f172a', fontSize: '2.5rem', marginTop: '0', marginBottom: '2rem', fontWeight: 800 }}>
          {fase.titulo}
        </h1>
        
        <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: '1.8', textAlign: 'center', marginBottom: '3rem' }}>
          {fase.descripcion}
        </p>

        <motion.button
          onClick={() => navigate(fase.path)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ padding: '1.25rem 3rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '3rem', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(202, 138, 4, 0.4)' }}
        >
          <Play size={24} /> Comenzar Fase {faseId}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FaseIntro;
