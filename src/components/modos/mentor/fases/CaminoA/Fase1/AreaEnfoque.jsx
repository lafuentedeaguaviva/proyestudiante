import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, ChefHat, Laptop, Wrench, Zap, Scissors, Calculator, PenTool, ArrowRight, Plus } from 'lucide-react';

export default function AreaEnfoque({ setAyudanteText, initialArea, onComplete }) {
  const [selectedArea, setSelectedArea] = useState(initialArea || '');
  const [customArea, setCustomArea] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const areas = [
    { id: 'Gastronomía', icon: <ChefHat size={40} />, label: 'Gastronomía' },
    { id: 'Informática', icon: <Laptop size={40} />, label: 'Informática' },
    { id: 'Mecánica', icon: <Wrench size={40} />, label: 'Mecánica' },
    { id: 'Electricidad', icon: <Zap size={40} />, label: 'Electricidad' },
    { id: 'Belleza', icon: <Scissors size={40} />, label: 'Belleza y Estética' },
    { id: 'Contabilidad', icon: <Calculator size={40} />, label: 'Contabilidad' },
    { id: 'Diseño', icon: <PenTool size={40} />, label: 'Diseño Gráfico' }
  ];

  useEffect(() => {
    setAyudanteText(`¡Comencemos!<br/><br/>Para crear un emprendimiento exitoso, primero debes enfocarte en lo que sabes. ¿Cuál es tu carrera técnica o área de especialidad?`);
    if (initialArea && !areas.find(a => a.id === initialArea)) {
      setIsCustom(true);
      setCustomArea(initialArea);
    }
  }, [setAyudanteText, initialArea]);

  const handleSelect = (areaId) => {
    setIsCustom(false);
    setSelectedArea(areaId);
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setSelectedArea('');
  };

  const handleContinue = () => {
    if (isCustom && customArea.trim()) {
      onComplete(customArea.trim());
    } else if (!isCustom && selectedArea) {
      onComplete(selectedArea);
    }
  };

  const isValid = (isCustom && customArea.trim().length > 0) || (!isCustom && selectedArea);

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '3rem' }}>
        <Target size={60} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Área de Enfoque</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          Selecciona tu carrera técnica o el área principal en la que quieres emprender.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {areas.map(area => (
            <motion.div
              key={area.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(area.id)}
              style={{
                background: selectedArea === area.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${selectedArea === area.id ? 'var(--primary)' : 'transparent'}`,
                padding: '2rem 1rem',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                color: selectedArea === area.id ? 'var(--primary)' : 'white',
                transition: 'all 0.2s'
              }}
            >
              {area.icon}
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{area.label}</span>
            </motion.div>
          ))}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCustomSelect}
            style={{
              background: isCustom ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${isCustom ? 'var(--primary)' : 'transparent'}`,
              padding: '2rem 1rem',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: isCustom ? 'var(--primary)' : 'white',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={40} />
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Otra área...</span>
          </motion.div>
        </div>

        {isCustom && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '3rem' }}>
            <input 
              type="text" 
              placeholder="Ej: Carpintería, Robótica, Textil..." 
              value={customArea}
              onChange={e => setCustomArea(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '1rem',
                fontSize: '1.2rem',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--primary)',
                borderRadius: 'var(--radius-md)',
                color: '#0f172a',
                outline: 'none'
              }}
            />
          </motion.div>
        )}

        <button 
          className="btn-primary" 
          onClick={handleContinue}
          disabled={!isValid}
          style={{ opacity: isValid ? 1 : 0.5, fontSize: '1.3rem', padding: '1rem 3rem' }}
        >
          Confirmar Área <ArrowRight style={{ display: 'inline', marginLeft: '0.5rem' }} />
        </button>
      </motion.div>
    </div>
  );
}
