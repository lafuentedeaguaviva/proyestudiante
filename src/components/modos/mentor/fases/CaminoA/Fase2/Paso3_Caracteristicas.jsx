import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Settings, Star, Box, CheckSquare, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Paso3_Caracteristicas({ setAyudanteText, onComplete, initialData = {} }) {
  const [activeTab, setActiveTab] = useState('caracteristicas');

  const [caracteristicas, setCaracteristicas] = useState(initialData.caracteristicas || {
    c1: { partes: '', material: '', paraQueSirve: '', tamañoColor: '' },
    c2: { partes: '', material: '', paraQueSirve: '', tamañoColor: '' },
    c3: { partes: '', material: '', paraQueSirve: '', tamañoColor: '' },
    c4: { partes: '', material: '', paraQueSirve: '', tamañoColor: '' },
    c5: { partes: '', material: '', paraQueSirve: '', tamañoColor: '' }
  });

  const [servicios, setServicios] = useState(initialData.servicios || {
    s1: { ofrezco: '', beneficio: '', prestacion: '' },
    s2: { ofrezco: '', beneficio: '', prestacion: '' },
    s3: { ofrezco: '', beneficio: '', prestacion: '' }
  });

  const [beneficios, setBeneficios] = useState(initialData.beneficios || {
    b1: '', b2: '', b3: '', b4: '', b5: ''
  });

  const [empaque, setEmpaque] = useState(initialData.empaque || {
    entrega: '', materiales: '', atractivo: '', ecologico: '', incluyeLogo: ''
  });

  const [presServicio, setPresServicio] = useState(initialData.presServicio || {
    presentacion: '', tangibles: '', herramientas: '', atractiva: '', ecologico: '', logo: '', documentacion: '', experiencia: ''
  });

  const tabs = [
    { id: 'caracteristicas', label: '3.1 Características', icon: <Settings size={20} /> },
    { id: 'servicios', label: '3.2 Servicios', icon: <List size={20} /> },
    { id: 'beneficios', label: '3.3 Beneficios por Caract.', icon: <Star size={20} /> },
    { id: 'empaque', label: '3.4 Empaque', icon: <Box size={20} /> },
    { id: 'pres_servicio', label: '3.5 Pres. Servicio', icon: <CheckSquare size={20} /> }
  ];

  useEffect(() => {
    if (activeTab === 'caracteristicas') {
      setAyudanteText('¡Vamos al detalle técnico! 🛠️<br/><br/>Describe hasta 5 características clave de tu producto. ¿De qué está hecho? ¿Qué partes tiene?');
    } else if (activeTab === 'servicios') {
      setAyudanteText('Hablemos de Servicios (si aplica).<br/><br/>¿Qué servicios ofreces y cómo se entregan al cliente?');
    } else if (activeTab === 'beneficios') {
      setAyudanteText('¡Cruza la información! 🎯<br/><br/>Por cada característica que mencionaste, escribe qué beneficio real le da al cliente.');
    } else if (activeTab === 'empaque') {
      setAyudanteText('¿Cómo se ve tu producto? 🎁<br/><br/>El empaque también vende. Describe cómo presentarás físicamente lo que vendes.');
    } else if (activeTab === 'pres_servicio') {
      setAyudanteText('¿Y si vendes un servicio? 🤝<br/><br/>El servicio también tiene "empaque": uniformes, limpieza, facturas, amabilidad. ¡Detállalo!');
    }
  }, [activeTab, setAyudanteText]);

  const handleFinish = () => {
    onComplete({ caracteristicas, servicios, beneficios, empaque, presServicio });
  };

  const InputField = ({ label, desc, value, onChange, placeholder = "" }) => (
    <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
      <label style={{ display: 'block', color: '#0f172a', fontWeight: 'bold', marginBottom: '0.3rem', fontSize: '1.1rem' }}>{label}</label>
      {desc && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>{desc}</p>}
      <textarea 
        rows={2}
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
            
            {activeTab === 'caracteristicas' && (
              <motion.div key="caracteristicas" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>3.1 Características del Producto</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Detalla hasta 5 características clave de tu producto.</p>
                
                <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', minWidth: '800px' }}>
                    {['c1', 'c2', 'c3', 'c4', 'c5'].map((cKey, i) => (
                      <div key={cKey} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center' }}>Caract. {i+1}</h4>
                        <InputField label="Componentes" desc="¿Qué partes tiene?" value={caracteristicas[cKey].partes} onChange={(v) => setCaracteristicas({...caracteristicas, [cKey]: {...caracteristicas[cKey], partes: v}})} />
                        <InputField label="Material" desc="¿De qué material se hace?" value={caracteristicas[cKey].material} onChange={(v) => setCaracteristicas({...caracteristicas, [cKey]: {...caracteristicas[cKey], material: v}})} />
                        <InputField label="Función" desc="¿Para qué sirve?" value={caracteristicas[cKey].paraQueSirve} onChange={(v) => setCaracteristicas({...caracteristicas, [cKey]: {...caracteristicas[cKey], paraQueSirve: v}})} />
                        <InputField label="Apariencia" desc="¿Qué tamaño, color o forma tiene?" value={caracteristicas[cKey].tamañoColor} onChange={(v) => setCaracteristicas({...caracteristicas, [cKey]: {...caracteristicas[cKey], tamañoColor: v}})} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'servicios' && (
              <motion.div key="servicios" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>3.2 Servicios Ofrecidos</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Si aplica, describe los servicios que ofreces (hasta 3).</p>
                
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  {['s1', 's2', 's3'].map((sKey, i) => (
                    <div key={sKey} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Servicio {i+1}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <InputField label="¿Qué ofrezco?" desc="Nombre o acción del servicio" value={servicios[sKey].ofrezco} onChange={(v) => setServicios({...servicios, [sKey]: {...servicios[sKey], ofrezco: v}})} />
                        <InputField label="Beneficio" desc="¿Cómo beneficia al cliente?" value={servicios[sKey].beneficio} onChange={(v) => setServicios({...servicios, [sKey]: {...servicios[sKey], beneficio: v}})} />
                        <InputField label="Prestación" desc="¿Cuándo y cómo se presta?" value={servicios[sKey].prestacion} onChange={(v) => setServicios({...servicios, [sKey]: {...servicios[sKey], prestacion: v}})} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'beneficios' && (
              <motion.div key="beneficios" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--success)', marginBottom: '0.5rem' }}>3.3 Beneficios por Característica</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Escribe el beneficio que brinda cada una de las 5 características que definiste en el paso 3.1.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <InputField label="Beneficio Característica 1" value={beneficios.b1} onChange={(v) => setBeneficios({...beneficios, b1: v})} />
                  <InputField label="Beneficio Característica 2" value={beneficios.b2} onChange={(v) => setBeneficios({...beneficios, b2: v})} />
                  <InputField label="Beneficio Característica 3" value={beneficios.b3} onChange={(v) => setBeneficios({...beneficios, b3: v})} />
                  <InputField label="Beneficio Característica 4" value={beneficios.b4} onChange={(v) => setBeneficios({...beneficios, b4: v})} />
                  <InputField label="Beneficio Característica 5" value={beneficios.b5} onChange={(v) => setBeneficios({...beneficios, b5: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'empaque' && (
              <motion.div key="empaque" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: '#eab308', marginBottom: '0.5rem' }}>3.4 Empaque o Presentación</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>¿Cómo entregas tu producto físico?</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <InputField label="Entrega" desc="¿En qué voy a entregar mi producto?" value={empaque.entrega} onChange={(v) => setEmpaque({...empaque, entrega: v})} />
                  <InputField label="Materiales" desc="¿Qué materiales usa el empaque?" value={empaque.materiales} onChange={(v) => setEmpaque({...empaque, materiales: v})} />
                  <InputField label="Atractivo visual" desc="¿Es atractivo para mi cliente?" value={empaque.atractivo} onChange={(v) => setEmpaque({...empaque, atractivo: v})} />
                  <InputField label="Ecología" desc="¿Es amigable con el medio ambiente?" value={empaque.ecologico} onChange={(v) => setEmpaque({...empaque, ecologico: v})} />
                  <InputField label="Branding" desc="¿Incluye etiqueta, logo o información?" value={empaque.incluyeLogo} onChange={(v) => setEmpaque({...empaque, incluyeLogo: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'pres_servicio' && (
              <motion.div key="pres_servicio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: '#a855f7', marginBottom: '0.5rem' }}>3.5 Presentación del Servicio</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>¿Cómo se ve, siente y experimenta tu servicio?</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <InputField label="Presentación General" desc="¿Qué ve o siente el cliente al contratarme?" value={presServicio.presentacion} onChange={(v) => setPresServicio({...presServicio, presentacion: v})} />
                  <InputField label="Elementos Tangibles" desc="Documentos, uniformes, herramientas, etc." value={presServicio.tangibles} onChange={(v) => setPresServicio({...presServicio, tangibles: v})} />
                  <InputField label="Materiales Profesionales" desc="¿Se ven profesionales las herramientas que usas?" value={presServicio.herramientas} onChange={(v) => setPresServicio({...presServicio, herramientas: v})} />
                  <InputField label="Confianza" desc="¿La presentación genera confianza?" value={presServicio.atractiva} onChange={(v) => setPresServicio({...presServicio, atractiva: v})} />
                  <InputField label="Ecología" desc="¿Es amigable con el medio ambiente? ¿Evitas desperdicios?" value={presServicio.ecologico} onChange={(v) => setPresServicio({...presServicio, ecologico: v})} />
                  <InputField label="Identificación" desc="¿Cómo sabe el cliente quién soy? (Logo, Info de contacto)" value={presServicio.logo} onChange={(v) => setPresServicio({...presServicio, logo: v})} />
                  <InputField label="Documentación" desc="Facturas, garantías, informes, etc." value={presServicio.documentacion} onChange={(v) => setPresServicio({...presServicio, documentacion: v})} />
                  <InputField label="Experiencia" desc="¿Cómo se siente el cliente al recibir el servicio?" value={presServicio.experiencia} onChange={(v) => setPresServicio({...presServicio, experiencia: v})} />
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
            style={{ opacity: activeTab === 'caracteristicas' ? 0.5 : 1, pointerEvents: activeTab === 'caracteristicas' ? 'none' : 'auto' }}
          >
            <ArrowLeft style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }}/> Anterior
          </button>
          
          {activeTab !== 'pres_servicio' ? (
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
              Finalizar Paso 3 <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
