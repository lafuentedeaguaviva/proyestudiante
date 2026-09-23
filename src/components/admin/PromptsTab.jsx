import React from 'react';
import { motion } from 'framer-motion';
import { Code, RotateCcw, Save } from 'lucide-react';

const PromptsTab = ({ prompts, handlePromptChange, handleRestoreDefault, handleSave }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {prompts.map((prompt, index) => (
        <motion.div 
          key={`${prompt.fase_id}-${prompt.proposito}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{ 
            background: 'rgba(15, 23, 42, 0.7)', 
            backdropFilter: 'blur(12px)',
            padding: '2rem', 
            borderRadius: '1rem', 
            border: '1px solid rgba(255,255,255,0.05)', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          whileHover={{ translateY: -2, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.6)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Code size={24} color="#60a5fa" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Fase {prompt.fase_id}</span>
                  <span style={{ color: '#3b82f6' }}>/</span>
                  {prompt.proposito}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 0 0', fontFamily: 'monospace' }}>
                  Vars: {prompt.proposito === 'generar_pitch' ? '{protagonista}, {contexto}, {dolor}, {tarea}, {friccion}, {ideaGanadora}, {nombreElegido}' : '{area}, {frase_problema}, {solucionIdeal}...'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleRestoreDefault(index)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <RotateCcw size={18} /> Restaurar
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleSave(prompt)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)' }}
              >
                <Save size={18} /> Guardar
              </motion.button>
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <textarea
              value={prompt.prompt_texto}
              onChange={(e) => handlePromptChange(index, e.target.value)}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1.25rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: '#e2e8f0',
                fontSize: '1rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#60a5fa'; e.target.style.boxShadow = '0 0 0 2px rgba(96,165,250,0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PromptsTab;
