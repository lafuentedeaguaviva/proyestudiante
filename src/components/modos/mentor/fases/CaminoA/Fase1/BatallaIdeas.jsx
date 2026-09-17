import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords } from 'lucide-react';

export default function BatallaIdeas({ ideas = [], setAyudanteText, onComplete, initialScores }) {
  const [ideaActualIdx, setIdeaActualIdx] = useState(0);
  const [puntajes, setPuntajes] = useState(() => {
    if (initialScores) return initialScores;
    const scores = {};
    ideas.forEach(i => {
      scores[i.id] = { costo: 0, tiempo: 0, pasion: 0, experiencia: 0, apoyo: 0, tecnica: 0 };
    });
    return scores;
  });

  const criterios = [
    { key: 'costo', label: 'Bajo Costo', desc: '¿Es barata de implementar?' },
    { key: 'tiempo', label: 'Tiempo Rápido', desc: '¿Puedes hacerla pronto?' },
    { key: 'pasion', label: 'Pasión', desc: '¿Te motiva mucho?' },
    { key: 'experiencia', label: 'Experiencia', desc: '¿Sabes cómo hacerlo?' },
    { key: 'apoyo', label: 'Red de Apoyo', desc: '¿Alguien te puede ayudar?' },
    { key: 'tecnica', label: 'Capacidad Técnica', desc: '¿Tienes las herramientas?' }
  ];

  useEffect(() => {
    setAyudanteText(`¡Que comience la <b>Batalla de Ideas</b>! ⚔️<br/><br/>Vamos a someter cada idea a la Matriz de Priorización. Dale una puntuación del 0 al 5 a cada criterio. La que sobreviva será tu Proyecto.`);
  }, [setAyudanteText]);

  const handleScoreChange = (criterioKey, value) => {
    const currentIdeaId = ideas[ideaActualIdx].id;
    setPuntajes(prev => ({
      ...prev,
      [currentIdeaId]: { ...prev[currentIdeaId], [criterioKey]: parseInt(value) }
    }));
  };

  const handleNextBattle = () => {
    if (ideaActualIdx < ideas.length - 1) {
      setIdeaActualIdx(ideaActualIdx + 1);
    } else {
      // Calcular ganador final
      let maxScore = -1;
      let winningIdea = null;
      let finalScores = {};
      
      ideas.forEach(idea => {
        const score = Object.values(puntajes[idea.id]).reduce((a, b) => a + b, 0);
        finalScores[idea.id] = score;
        if (score > maxScore) {
          maxScore = score;
          winningIdea = idea;
        }
      });
      
      const result = { ganadora: { ...winningIdea, total: maxScore }, allScores: puntajes };
      onComplete(result);
    }
  };

  if (!ideas || ideas.length === 0) {
    return <div style={{ color: '#0f172a', textAlign: 'center' }}>No hay ideas para evaluar. Regresa al paso anterior.</div>;
  }

  const currentIdea = ideas[ideaActualIdx];

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Swords size={60} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '2rem', color: 'var(--danger)' }}>Ronda {ideaActualIdx + 1} de {ideas.length}</h2>
          <h3 style={{ fontSize: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', color: 'var(--primary)' }}>
            "{currentIdea.texto}"
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {criterios.map(c => (
            <div key={c.key} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{c.label}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {puntajes[currentIdea.id]?.[c.key] || 0}/5
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{c.desc}</p>
              <input 
                type="range" min="0" max="5" 
                value={puntajes[currentIdea.id]?.[c.key] || 0}
                onChange={e => handleScoreChange(c.key, e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ marginTop: '3rem', width: '100%', fontSize: '1.3rem' }} onClick={handleNextBattle}>
          {ideaActualIdx < ideas.length - 1 ? 'Siguiente Idea' : 'Ver Resultados Finales'}
        </button>
      </motion.div>
    </div>
  );
}
