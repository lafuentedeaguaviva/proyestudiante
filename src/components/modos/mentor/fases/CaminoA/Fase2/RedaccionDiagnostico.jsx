import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function RedaccionDiagnostico({ setAyudanteText, onComplete }) {
  const [texto, setTexto] = useState("");

  React.useEffect(() => {
    setAyudanteText("Con todos los datos que reunimos, es momento de que redactemos el Diagnóstico. ¡Yo te ayudaré a estructurarlo!");
  }, [setAyudanteText]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>Redacción del Diagnóstico</h2>
      <p style={{ marginBottom: '1rem', textAlign: 'center' }}>Escribe un resumen sobre el problema principal (Cuello de Botella) de tu entorno.</p>
      
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <Bot size={24} color="var(--accent)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          <strong>Tip de la IA:</strong> Menciona cómo la necesidad que encontramos afecta a tu Público Objetivo y cómo tu idea lo va a resolver.
        </p>
      </div>

      <textarea 
        className="input-field" 
        rows={6}
        placeholder="Empieza a escribir aquí..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        style={{ width: '100%', marginBottom: '2rem', resize: 'vertical' }}
      />

      <div style={{ textAlign: 'center' }}>
        <button className="btn-primary" onClick={() => onComplete({ diagnostico: texto })}>
          Guardar Diagnóstico y Continuar
        </button>
      </div>
    </motion.div>
  );
}
