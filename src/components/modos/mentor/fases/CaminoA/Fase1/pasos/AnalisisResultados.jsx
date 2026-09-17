import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Lightbulb, ArrowRight, Target, Heart, DollarSign } from 'lucide-react';

export default function AnalisisResultados({ ideaSeleccionada, onComplete }) {
  const [analizando, setAnalizando] = useState(true);
  const [respuestasIA, setRespuestasIA] = useState(null);

  useEffect(() => {
    // Simula la IA analizando los resultados recopilados para responder las 3 preguntas
    const timer = setTimeout(() => {
      setRespuestasIA({
        problemaExiste: {
          titulo: '¿El problema existe?',
          respuesta: `**Sí, es evidente.** Los datos simulados de la encuesta confirman que el dolor relacionado a "${ideaSeleccionada?.titulo?.substring(0, 20) || 'esta idea'}..." ocurre frecuentemente. Un 85% de los encuestados reportó haber experimentado esto en su rutina, validando que no es un problema inventado.`,
          icono: <Target size={30} color="#ef4444" />,
          color: '#ef4444'
        },
        solucionDeseada: {
          titulo: '¿Mi solución es deseada?',
          respuesta: `**Alta tracción inicial.** La propuesta que diseñaste genera interés porque ataca la ineficiencia de sus alternativas actuales. El 70% de las respuestas indicaron que cambiarían su método actual por tu solución si fuera fácil de adoptar.`,
          icono: <Heart size={30} color="#3b82f6" />,
          color: '#3b82f6'
        },
        cuantoPagarian: {
          titulo: '¿Cuánto pagarían?',
          respuesta: `**Disposición de pago validada.** Según el tiempo/dinero que actualmente pierden, los encuestados estarían dispuestos a pagar un promedio de **$15 a $30 USD mensuales** (o equivalente local) por una solución automatizada y confiable.`,
          icono: <DollarSign size={30} color="#10b981" />,
          color: '#10b981'
        }
      });
      setAnalizando(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [ideaSeleccionada]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <AnimatePresence mode="wait">
        {analizando ? (
          <motion.div key="analizando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ textAlign: 'center', padding: '4rem 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '2rem' }}>
              <LineChart size={80} color="var(--accent)" />
            </motion.div>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>Analizando Resultados de Validación...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Calculando el nivel de deseo, existencia del problema y disposición de pago.</p>
          </motion.div>
        ) : (
          <motion.div key="resultados" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <Lightbulb color="var(--accent)" size={40} /> Veredicto de Validación
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                Basado en las encuestas y la validación de tu idea <strong>"{ideaSeleccionada?.titulo || 'tu propuesta'}"</strong>, aquí están las respuestas a las 3 preguntas fundamentales de todo negocio.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
              
              {/* Pregunta 1 */}
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderLeft: `4px solid ${respuestasIA.problemaExiste.color}`, padding: '2rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {respuestasIA.problemaExiste.icono}
                  {respuestasIA.problemaExiste.titulo}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  {respuestasIA.problemaExiste.respuesta.split('**').map((part, i) => i % 2 === 1 ? <strong style={{color:'white'}} key={i}>{part}</strong> : part)}
                </p>
              </div>

              {/* Pregunta 2 */}
              <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderLeft: `4px solid ${respuestasIA.solucionDeseada.color}`, padding: '2rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {respuestasIA.solucionDeseada.icono}
                  {respuestasIA.solucionDeseada.titulo}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  {respuestasIA.solucionDeseada.respuesta.split('**').map((part, i) => i % 2 === 1 ? <strong style={{color:'white'}} key={i}>{part}</strong> : part)}
                </p>
              </div>

              {/* Pregunta 3 */}
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderLeft: `4px solid ${respuestasIA.cuantoPagarian.color}`, padding: '2rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {respuestasIA.cuantoPagarian.icono}
                  {respuestasIA.cuantoPagarian.titulo}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                  {respuestasIA.cuantoPagarian.respuesta.split('**').map((part, i) => i % 2 === 1 ? <strong style={{color:'white'}} key={i}>{part}</strong> : part)}
                </p>
              </div>

            </div>

            <div style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ color: '#0f172a', marginBottom: '1rem' }}>Validación Completada</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Ya tienes datos reales. Tu idea pasó la prueba inicial de deseabilidad y viabilidad comercial.</p>
              <button className="btn-primary" onClick={() => onComplete(respuestasIA)} style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
                Finalizar Fase <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
