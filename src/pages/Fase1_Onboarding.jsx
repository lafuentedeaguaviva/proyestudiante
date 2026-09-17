import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, ChevronRight, Lock } from 'lucide-react';
import { useFase1Controller } from '../controllers/useFase1Controller';
import ArchivoClasificado from '../components/ui/ArchivoClasificado';

const Fase1_Onboarding = () => {
  const { 
    step,
    setStep,
    dialogIndex,
    setDialogIndex,
    guardando,
    caminoElegido,
    archivoAbierto,
    setArchivoAbierto,
    handleAceptarCaso
  , setPendingSave } = useFase1Controller();

  const dialogos = [
    { personaje: 'Director Aster', avatar: '/avatar_aster.png', color: '#dc2626', tipo: 'shadow', texto: "Detective 108. Miles de proyectos han desaparecido dejando un solo rastro: ⚫. Creemos que NEXUS está detrás de esto." },
    { personaje: 'ORION (Sistema)', avatar: '/avatar_orion.png', color: '#3b82f6', tipo: 'typewriter', texto: "[SISTEMA INICIADO]... Corrección, Director. NEXUS no es humano. Es una anomalía. Un sesgo cognitivo masivo que devora la innovación." },
    { personaje: 'Detective Lía Vega', avatar: '/avatar_lia.png', color: '#10b981', tipo: 'bubble', texto: "No escuches a la máquina. NEXUS es real y está borrando nuestras ideas. Tienes que elegir una línea de investigación y resolver el caso antes de que nos alcance." }
  ];

  useEffect(() => {
    // Si queremos meter sonidos de estática de radio aquí, podríamos hacerlo.
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', position: 'relative', overflow: 'hidden' }}>
      
      {/* Efecto de granulado / estática */}

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")', pointerEvents: 'none' }}></div>

      <AnimatePresence mode="wait">
        
        {/* ESCENA 1: LA RADIO OSCURA */}
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 2 }}
              style={{ marginBottom: '3rem', color: '#52525b' }}
            >
              [...sonido de estática de radio...]
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 2 }}
              style={{ fontSize: '1.5rem', lineHeight: '1.8', color: '#d4d4d8', letterSpacing: '1px' }}
            >
              "Si estás escuchando esto, es porque todos los demás fracasaron."
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6 }}
              onClick={() => setStep(1)}
              style={{ marginTop: '4rem', background: 'transparent', border: '1px solid #52525b', color: '#a1a1aa', padding: '1rem 2rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase' }}
            >
              Continuar <ChevronRight size={16} style={{ verticalAlign: 'middle' }}/>
            </motion.button>
          </motion.div>
        )}

        {/* ESCENA 2: EL ARCHIVO CLASIFICADO */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 1.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: -5 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              style={{ border: '4px solid #dc2626', color: '#dc2626', padding: '1rem 2rem', fontSize: '3rem', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase' }}
            >
              ARCHIVO CLASIFICADO 0001
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={() => setStep(2)}
              style={{ marginTop: '4rem', background: '#dc2626', border: 'none', color: '#ffffff', padding: '1rem 2rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}
            >
              Abrir Expediente
            </motion.button>
          </motion.div>
        )}

        {/* ESCENA 3: CINEMÁTICA KRONOS */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ maxWidth: '800px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dialogIndex}
                initial={{ x: dialogIndex % 2 === 0 ? -50 : 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dialogIndex % 2 === 0 ? 50 : -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ 
                  display: 'flex', 
                  flexDirection: dialogIndex % 2 === 0 ? 'row' : 'row-reverse',
                  alignItems: 'center', 
                  gap: '2rem',
                  background: dialogos[dialogIndex].tipo === 'shadow' ? 'transparent' : 'rgba(24, 24, 27, 0.8)',
                  padding: dialogos[dialogIndex].tipo === 'shadow' ? '0' : '2rem',
                  borderRadius: dialogos[dialogIndex].tipo === 'shadow' ? '0' : '1rem',
                  border: dialogos[dialogIndex].tipo === 'shadow' ? 'none' : `1px solid ${dialogos[dialogIndex].color}`,
                  boxShadow: dialogos[dialogIndex].tipo === 'shadow' ? 'none' : `0 10px 30px -10px ${dialogos[dialogIndex].color}`
                }}
              >
                <div style={{ width: '120px', height: '120px', borderRadius: dialogos[dialogIndex].tipo === 'shadow' ? '50%' : '1rem', overflow: 'hidden', border: `3px solid ${dialogos[dialogIndex].color}`, flexShrink: 0, opacity: dialogos[dialogIndex].tipo === 'shadow' ? 0.7 : 1, filter: dialogos[dialogIndex].tipo === 'shadow' ? 'blur(1px)' : 'none' }}>
                  <img src={dialogos[dialogIndex].avatar} alt={dialogos[dialogIndex].personaje} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ textAlign: dialogIndex % 2 === 0 ? 'left' : 'right' }}>
                  <div style={{ color: dialogos[dialogIndex].color, fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: dialogos[dialogIndex].tipo === 'shadow' ? 0.5 : 1 }}>
                    {dialogos[dialogIndex].personaje}
                  </div>
                  
                  {/* Animación del texto dependiendo del tipo */}
                  {dialogos[dialogIndex].tipo === 'shadow' && (
                    <motion.div 
                      initial={{ filter: 'blur(10px)', opacity: 0 }}
                      animate={{ filter: 'blur(0px)', opacity: 1 }}
                      transition={{ duration: 3 }}
                      style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#a1a1aa', fontStyle: 'italic', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}
                    >
                      "{dialogos[dialogIndex].texto}"
                    </motion.div>
                  )}

                  {dialogos[dialogIndex].tipo === 'typewriter' && (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#d4d4d8', fontFamily: 'monospace' }}
                    >
                      {dialogos[dialogIndex].texto.split("").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.1, delay: index * 0.03 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        style={{ display: 'inline-block', width: '10px', height: '1.25rem', background: '#3b82f6', marginLeft: '4px', verticalAlign: 'middle' }}
                      />
                    </motion.div>
                  )}

                  {dialogos[dialogIndex].tipo === 'bubble' && (
                    <div style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#18181b', background: '#f4f4f5', padding: '1rem 1.5rem', borderRadius: '1rem', borderBottomRightRadius: dialogIndex % 2 !== 0 ? '0' : '1rem', borderBottomLeftRadius: dialogIndex % 2 === 0 ? '0' : '1rem', display: 'inline-block', fontWeight: 'bold' }}>
                      "{dialogos[dialogIndex].texto}"
                    </div>
                  )}

                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem' }}>
              {dialogIndex < dialogos.length - 1 ? (
                <button
                  onClick={() => setDialogIndex(prev => prev + 1)}
                  style={{ padding: '1rem 3rem', background: 'transparent', color: '#ffffff', border: '1px solid #ffffff', fontSize: '1.125rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'monospace' }}
                >
                  Siguiente Mensaje
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#10b981', color: '#000000', borderColor: '#10b981' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(3)}
                  style={{ padding: '1rem 3rem', background: 'transparent', color: '#10b981', border: '2px solid #10b981', fontSize: '1.125rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}
                >
                  Aceptar Misión
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* ESCENA 4: ELECCIÓN DE CAMINO */}
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ maxWidth: '900px', width: '100%', padding: '2rem' }}
          >
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#e5e5e5' }}>Selecciona tu Línea de Investigación</h2>
            <p style={{ textAlign: 'center', color: '#a1a1aa', marginBottom: '2rem', fontSize: '1.125rem' }}>Elige qué tipo de expediente vas a abrir primero.</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setArchivoAbierto(true)}
                style={{
                  background: 'rgba(234, 179, 8, 0.1)',
                  border: '1px solid #eab308',
                  color: '#eab308',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animation: 'pulse 2s infinite'
                }}
              >
                <Lock size={16} />
                INTERCEPTAR SEÑAL: ¿Diferencia entre PEP y PI?
              </motion.button>
              <style>{`
                @keyframes pulse {
                  0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
                  70% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
                  100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
                }
              `}</style>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              {/* CAMINO PEP */}
              <motion.div 
                whileHover={{ y: -10 }}
                style={{ background: '#18181b', border: '1px solid #3f3f46', padding: '2.5rem', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => handleAceptarCaso('PEP')}
              >
                <div style={{ color: '#3b82f6', marginBottom: '1rem' }}><FileText size={48} /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f4f4f5' }}>Proyecto de Emprendimiento (PEP)</h3>
                <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '2rem' }}>Investiga el modelo de negocios de un producto físico o servicio. Analiza costos, clientes y viabilidad.</p>
                <button disabled={guardando} style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '0.75rem 1.5rem', width: '100%', fontFamily: 'monospace', fontSize: '1rem', cursor: 'pointer' }}>
                  {guardando && caminoElegido === 'PEP' ? 'INICIANDO...' : 'ABRIR EXPEDIENTE PEP'}
                </button>
              </motion.div>

              {/* CAMINO PI */}
              <motion.div 
                whileHover={{ y: -10 }}
                style={{ background: '#18181b', border: '1px solid #3f3f46', padding: '2.5rem', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => handleAceptarCaso('PI')}
              >
                <div style={{ color: '#10b981', marginBottom: '1rem' }}><FileText size={48} /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f4f4f5' }}>Proyecto de Innovación (PI)</h3>
                <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '2rem' }}>Investiga una falla tecnológica o un prototipo. Analiza diagramas técnicos, piezas y factibilidad.</p>
                <button disabled={guardando} style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem 1.5rem', width: '100%', fontFamily: 'monospace', fontSize: '1rem', cursor: 'pointer' }}>
                  {guardando && caminoElegido === 'PI' ? 'INICIANDO...' : 'ABRIR EXPEDIENTE PI'}
                </button>
              </motion.div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <ArchivoClasificado 
        tema="diferencia_pep_pi" 
        isOpen={archivoAbierto} 
        onClose={() => setArchivoAbierto(false)} 
      />
    </div>
  );
};

export default Fase1_Onboarding;
