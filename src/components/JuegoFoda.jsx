import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowRight, Shield, TrendingUp, AlertTriangle, CloudLightning } from 'lucide-react';

export default function JuegoFoda({ onComplete }) {
  const [foda, setFoda] = useState({
    fortalezas: [],
    oportunidades: [],
    debilidades: [],
    amenazas: []
  });
  
  const [newItem, setNewItem] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { id: 'fortalezas', title: 'Fortalezas (Internas)', icon: <Shield color="var(--success)" />, color: 'var(--success)', desc: '¿En qué eres mejor que los demás?' },
    { id: 'oportunidades', title: 'Oportunidades (Externas)', icon: <TrendingUp color="var(--primary)" />, color: 'var(--primary)', desc: '¿Qué tendencias del mercado te favorecen?' },
    { id: 'debilidades', title: 'Debilidades (Internas)', icon: <AlertTriangle color="var(--accent)" />, color: 'var(--accent)', desc: '¿Qué te falta o en qué fallas?' },
    { id: 'amenazas', title: 'Amenazas (Externas)', icon: <CloudLightning color="var(--danger)" />, color: 'var(--danger)', desc: '¿Qué peligros hay afuera (competencia, crisis)?' }
  ];

  const handleAddItem = (category) => {
    if (!newItem.trim()) return;
    setFoda(prev => ({
      ...prev,
      [category]: [...prev[category], newItem]
    }));
    setNewItem('');
    setActiveCategory(null);
  };

  const handleRemoveItem = (category, index) => {
    setFoda(prev => {
      const newArr = [...prev[category]];
      newArr.splice(index, 1);
      return { ...prev, [category]: newArr };
    });
  };

  const isComplete = Object.values(foda).every(arr => arr.length > 0);

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        Matriz FODA Estratégica
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
        Para dominar el mercado, debes conocer tus fuerzas y peligros. Añade al menos un elemento en cada cuadrante.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: `2px solid ${cat.color}40`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: `1px solid ${cat.color}40`, paddingBottom: '0.5rem' }}>
              {cat.icon}
              <h3 style={{ margin: 0, color: cat.color, fontSize: '1.2rem' }}>{cat.title}</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'left' }}>{cat.desc}</p>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <AnimatePresence>
                {foda[cat.id].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ background: 'rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}
                  >
                    <span>{item}</span>
                    <button onClick={() => handleRemoveItem(cat.id, idx)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><X size={16}/></button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {activeCategory === cat.id ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  autoFocus
                  value={newItem} 
                  onChange={e => setNewItem(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleAddItem(cat.id)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius)', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white' }}
                />
                <button onClick={() => handleAddItem(cat.id)} style={{ background: cat.color, border: 'none', borderRadius: 'var(--radius)', color: '#000', cursor: 'pointer', padding: '0.5rem' }}>
                  <Plus size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setActiveCategory(cat.id); setNewItem(''); }} 
                style={{ background: 'transparent', border: `1px dashed ${cat.color}`, color: cat.color, padding: '0.8rem', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} /> Añadir Elemento
              </button>
            )}
          </div>
        ))}
      </div>

      <button 
        className="btn-primary" 
        onClick={() => onComplete(foda)} 
        disabled={!isComplete}
        style={{ opacity: isComplete ? 1 : 0.5, fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        Finalizar Análisis FODA <ArrowRight />
      </button>
      
      {!isComplete && (
        <p style={{ color: 'var(--accent)', marginTop: '1rem' }}>Faltan cuadrantes por llenar.</p>
      )}

    </div>
  );
}
