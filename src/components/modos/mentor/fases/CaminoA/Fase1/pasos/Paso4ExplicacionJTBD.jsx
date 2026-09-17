import { motion } from 'framer-motion';
import { Target, Users, Clock, ArrowRight, Shuffle } from 'lucide-react';

export default function Paso4ExplicacionJTBD({ onNext }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-panel" style={{ padding: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Enfoque Job to be Done + Dolor</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          La gente no compra productos, "contrata" soluciones para realizar un trabajo (*Job to be Done*) y aliviar un dolor o frustración. Entendamos cómo estructurar este problema.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Target color="#ef4444" size={28} />
            <h3 style={{ color: '#0f172a', fontSize: '1.2rem' }}>1. Frustraciones</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            "Tareas que odian hacer" en su día a día. ¿Qué les molesta? ¿Qué les quita tiempo o dinero injustamente?
          </p>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users color="#3b82f6" size={28} />
            <h3 style={{ color: '#0f172a', fontSize: '1.2rem' }}>2. Quiénes lo sufren</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Define exactamente a tu público objetivo. No digas "todos". Di "madres solteras", "estudiantes de informática", "dueños de pymes".
          </p>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock color="#10b981" size={28} />
            <h3 style={{ color: '#0f172a', fontSize: '1.2rem' }}>3. Momento de vida</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            ¿Cuándo ocurre el problema? "Al volver del trabajo", "justo antes de exámenes", "a fin de mes". El contexto es clave.
          </p>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Shuffle color="#f59e0b" size={28} />
            <h3 style={{ color: '#0f172a', fontSize: '1.2rem' }}>4. Alternativas actuales</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            ¿Cómo lo solucionan hoy? (Ej: "Usan un excel muy malo", "Llaman a un conocido", "Simplemente no lo hacen").
          </p>
        </div>

      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn-primary" onClick={onNext} style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
          ¡Entendido! Llenar mi cuadro <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </div>
    </motion.div>
  );
}
