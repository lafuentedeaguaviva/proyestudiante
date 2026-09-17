import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Tag, Heart, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Paso2_DisenoProducto({ setAyudanteText, onComplete, initialData = {} }) {
  const [activeTab, setActiveTab] = useState('descripcion');

  const [descripcion, setDescripcion] = useState(initialData.descripcion || {
    queVendo: '',
    detalleExacto: ''
  });
  
  const [tipo, setTipo] = useState(initialData.tipo || {
    esFisicoServicio: '',
    materialesFisico: '',
    accionesServicio: ''
  });
  
  const [beneficios, setBeneficios] = useState(initialData.beneficios || {
    queGana: '',
    comoMejora: '',
    problemaQueSoluciono: '',
    porQueYo: ''
  });

  const tabs = [
    { id: 'descripcion', label: '2.1 Descripción', icon: <Package size={20} /> },
    { id: 'tipo', label: '2.2 Tipo', icon: <Tag size={20} /> },
    { id: 'beneficios', label: '2.3 Beneficios', icon: <Heart size={20} /> }
  ];

  useEffect(() => {
    if (activeTab === 'descripcion') {
      setAyudanteText('¡Pasemos al Diseño del Producto! 📦<br/><br/>Aquí defines exactamente qué es lo que vas a vender basándote en las necesidades de tu cliente.');
    } else if (activeTab === 'tipo') {
      setAyudanteText('¿Es un objeto físico o un servicio?<br/><br/>Detalla los materiales si es un producto, o las acciones específicas que realizarás si es un servicio.');
    } else if (activeTab === 'beneficios') {
      setAyudanteText('¡Lo más importante: Los Beneficios! ✨<br/><br/>Recuerda, la gente no compra productos, compra una mejor versión de sí mismos. ¿Cómo mejora su vida después de comprarte?');
    }
  }, [activeTab, setAyudanteText]);

  const handleFinish = () => {
    onComplete({ descripcion, tipo, beneficios });
  };

  const InputField = ({ label, desc, value, onChange, placeholder = "" }) => (
    <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
      <label style={{ display: 'block', color: '#0f172a', fontWeight: 'bold', marginBottom: '0.3rem', fontSize: '1.1rem' }}>{label}</label>
      {desc && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{desc}</p>}
      <textarea 
        rows={3}
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#0f172a', resize: 'vertical' }}
      />
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2rem' }}>
        
        {/* Navegación de Pestañas */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'black' : 'white',
                border: '1px solid ' + (activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.2)'),
                padding: '0.8rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de cada pestaña */}
        <div style={{ minHeight: '400px' }}>
          <AnimatePresence mode="wait">
            
            {activeTab === 'descripcion' && (
              <motion.div key="descripcion" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>2.1 Descripción</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Una descripción clara y sencilla de qué vas a vender.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <InputField label="Lo que ofrezco" desc="¿Qué voy a vender? (Producto físico / Servicio / Ambos)" value={descripcion.queVendo} onChange={(v) => setDescripcion({...descripcion, queVendo: v})} />
                  <InputField label="Detalle exacto" desc="¿De qué se trata exactamente? (Describe en 2-3 líneas)" value={descripcion.detalleExacto} onChange={(v) => setDescripcion({...descripcion, detalleExacto: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'tipo' && (
              <motion.div key="tipo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>2.2 Tipo de Producto/Servicio</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Detalla la naturaleza de tu oferta comercial.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <InputField label="Naturaleza" desc="¿Es un producto físico, un servicio o ambos?" value={tipo.esFisicoServicio} onChange={(v) => setTipo({...tipo, esFisicoServicio: v})} />
                  <InputField label="Materiales (Si es físico)" desc="Si es un producto físico, ¿qué materiales o partes tiene?" value={tipo.materialesFisico} onChange={(v) => setTipo({...tipo, materialesFisico: v})} />
                  <InputField label="Acciones (Si es servicio)" desc="Si es un servicio, ¿qué acciones realizo para mi cliente?" value={tipo.accionesServicio} onChange={(v) => setTipo({...tipo, accionesServicio: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'beneficios' && (
              <motion.div key="beneficios" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--success)', marginBottom: '0.5rem' }}>2.3 Beneficios que Ofrece</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Enfócate en el valor que el cliente obtiene al elegirte.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <InputField label="Ganancias del cliente" desc="¿Qué gana mi cliente al comprar mi producto? (Lista 3-5 beneficios)" value={beneficios.queGana} onChange={(v) => setBeneficios({...beneficios, queGana: v})} />
                  <InputField label="Impacto en su vida" desc="¿Cómo mejora su vida después de comprarme?" value={beneficios.comoMejora} onChange={(v) => setBeneficios({...beneficios, comoMejora: v})} />
                  <InputField label="Solución específica" desc="¿Qué problema concreto le soluciono?" value={beneficios.problemaQueSoluciono} onChange={(v) => setBeneficios({...beneficios, problemaQueSoluciono: v})} />
                  <InputField label="Ventaja competitiva" desc="¿Por qué deberían elegirme a mí y no a otro?" value={beneficios.porQueYo} onChange={(v) => setBeneficios({...beneficios, porQueYo: v})} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            className="btn-outline" 
            onClick={() => {
              const currentIdx = tabs.findIndex(t => t.id === activeTab);
              if(currentIdx > 0) setActiveTab(tabs[currentIdx - 1].id);
            }}
            style={{ opacity: activeTab === 'descripcion' ? 0.5 : 1, pointerEvents: activeTab === 'descripcion' ? 'none' : 'auto' }}
          >
            <ArrowLeft style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }}/> Anterior
          </button>
          
          {activeTab !== 'beneficios' ? (
            <button 
              className="btn-primary" 
              onClick={() => {
                const currentIdx = tabs.findIndex(t => t.id === activeTab);
                if(currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1].id);
              }}
            >
              Siguiente Sección <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
            </button>
          ) : (
            <button className="btn-primary" onClick={handleFinish} style={{ background: 'var(--success)' }}>
              Finalizar Paso 2 <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
