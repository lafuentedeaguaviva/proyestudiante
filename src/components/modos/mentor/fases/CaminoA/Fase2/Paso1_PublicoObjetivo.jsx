import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCircle, Target, Briefcase, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Paso1_PublicoObjetivo({ setAyudanteText, onComplete, initialData = {} }) {
  const [activeTab, setActiveTab] = useState('cliente');

  const [cliente, setCliente] = useState(initialData.cliente || {
    edad: '', genero: '', educacion: '', ocupacion: '', ubicacion: '', ingresos: '', intereses: '', dolor: '', motivacion: ''
  });
  const [usuario, setUsuario] = useState(initialData.usuario || {
    perfil: '', edad: '', relacion: '', conocimientos: '', comportamiento: '', dolor: ''
  });
  const [buyerPersona, setBuyerPersona] = useState(initialData.buyerPersona || {
    nombre: '', edad: '', ubicacion: '', ocupacion: '', intereses: '', frustracion: '', sueno: '', dispuestoAPagar: '', fuente: ''
  });
  const [userPersona, setUserPersona] = useState(initialData.userPersona || {
    nombre: '', edad: '', relacion: '', diaADia: '', necesidades: '', frustracion: '', fuente: ''
  });
  const [mercado, setMercado] = useState(initialData.mercado || {
    mercadoTotal: '', porcentajeCompraria: '', clientesPotenciales: '', otrosGrupos: '', mercadoEstimado: ''
  });

  const tabs = [
    { id: 'cliente', label: '1.1 Cliente', icon: <Briefcase size={20} /> },
    { id: 'usuario', label: '1.2 Usuario', icon: <Users size={20} /> },
    { id: 'buyer', label: '1.3 Buyer Persona', icon: <UserCircle size={20} /> },
    { id: 'user', label: '1.4 User Persona', icon: <UserCircle size={20} /> },
    { id: 'mercado', label: '1.5 Mercado', icon: <Target size={20} /> }
  ];

  useEffect(() => {
    if (activeTab === 'cliente') {
      setAyudanteText('¡Bienvenido al Corazón del Negocio! ❤️<br/><br/>Primero vamos a definir quién es tu <b>Cliente</b>, es decir, la persona que <b>va a pagar</b> por tu producto o servicio. Sé muy específico.');
    } else if (activeTab === 'usuario') {
      setAyudanteText('¡Excelente! Ahora veamos al <b>Usuario</b>.<br/><br/>¿Quién es la persona que realmente <b>usa</b> tu producto todos los días? A veces el cliente (el que paga) es distinto al usuario (el que lo usa).');
    } else if (activeTab === 'buyer') {
      setAyudanteText('¡Hora de crear a tu <b>Buyer Persona</b>! 👤<br/><br/>Ponle nombre, rostro y personalidad a tu cliente ideal. Imagina que es una persona real que acabas de conocer.');
    } else if (activeTab === 'user') {
      setAyudanteText('¡Muy bien! Ahora hagamos lo mismo para tu <b>User Persona</b>.<br/><br/>¿Cómo es el día a día de esta persona usando tu producto?');
    } else if (activeTab === 'mercado') {
      setAyudanteText('Por último, calculemos el <b>Tamaño de tu Mercado</b>. 📊<br/><br/>Necesitamos saber cuántas personas reales podrían comprarte. Usa matemáticas sencillas.');
    }
  }, [activeTab, setAyudanteText]);

  const handleFinish = () => {
    onComplete({ cliente, usuario, buyerPersona, userPersona, mercado });
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
            
            {activeTab === 'cliente' && (
              <motion.div key="cliente" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>1.1 Cliente (Quien paga)</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Define las características exactas de las personas que abrirán su billetera por ti.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <InputField label="Edad" desc="¿Qué edad tienen mis clientes? (Rango)" value={cliente.edad} onChange={(v) => setCliente({...cliente, edad: v})} />
                  <InputField label="Género" desc="¿Hombres, mujeres o ambos?" value={cliente.genero} onChange={(v) => setCliente({...cliente, genero: v})} />
                  <InputField label="Nivel educativo" desc="¿Qué estudios tienen? (Ej: secundaria, universidad)" value={cliente.educacion} onChange={(v) => setCliente({...cliente, educacion: v})} />
                  <InputField label="Ocupación" desc="¿A qué se dedican? (Ej: estudiantes, profesionales)" value={cliente.ocupacion} onChange={(v) => setCliente({...cliente, ocupacion: v})} />
                  <InputField label="Ubicación" desc="¿Dónde viven, estudian o trabajan?" value={cliente.ubicacion} onChange={(v) => setCliente({...cliente, ubicacion: v})} />
                  <InputField label="Ingresos" desc="¿Cuánto dinero tienen disponible para gastar?" value={cliente.ingresos} onChange={(v) => setCliente({...cliente, ingresos: v})} />
                  <InputField label="Intereses" desc="¿Qué les gusta hacer en su tiempo libre?" value={cliente.intereses} onChange={(v) => setCliente({...cliente, intereses: v})} />
                  <InputField label="Dolor principal" desc="¿Qué problema tienen que yo puedo resolver?" value={cliente.dolor} onChange={(v) => setCliente({...cliente, dolor: v})} />
                  <InputField label="Motivación de compra" desc="¿Por qué me comprarían a mí?" value={cliente.motivacion} onChange={(v) => setCliente({...cliente, motivacion: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'usuario' && (
              <motion.div key="usuario" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>1.2 Usuario (Quien lo usa)</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Define a la persona que va a interactuar o consumir directamente tu producto.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <InputField label="Perfil" desc="¿Quién usa mi producto en el día a día?" value={usuario.perfil} onChange={(v) => setUsuario({...usuario, perfil: v})} />
                  <InputField label="Edad" desc="¿Qué edad tiene?" value={usuario.edad} onChange={(v) => setUsuario({...usuario, edad: v})} />
                  <InputField label="Relación con el cliente" desc="¿Es la misma persona que paga o es diferente?" value={usuario.relacion} onChange={(v) => setUsuario({...usuario, relacion: v})} />
                  <InputField label="Conocimientos técnicos" desc="¿Necesita saber algo especial para usar mi producto?" value={usuario.conocimientos} onChange={(v) => setUsuario({...usuario, conocimientos: v})} />
                  <InputField label="Comportamiento" desc="¿Cómo se comporta cuando usa mi producto?" value={usuario.comportamiento} onChange={(v) => setUsuario({...usuario, comportamiento: v})} />
                  <InputField label="Dolor principal" desc="¿Qué le molesta o frustra de su situación actual?" value={usuario.dolor} onChange={(v) => setUsuario({...usuario, dolor: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'buyer' && (
              <motion.div key="buyer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--success)', marginBottom: '0.5rem' }}>1.3 Buyer Persona (Cliente Ideal)</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Ponle un nombre y rostro imaginario a ese cliente perfecto.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <InputField label="Nombre de tu cliente ideal" desc="¿Cómo se llama?" value={buyerPersona.nombre} onChange={(v) => setBuyerPersona({...buyerPersona, nombre: v})} />
                  <InputField label="Edad" desc="¿Qué edad tiene?" value={buyerPersona.edad} onChange={(v) => setBuyerPersona({...buyerPersona, edad: v})} />
                  <InputField label="Ubicación" desc="¿Dónde vive?" value={buyerPersona.ubicacion} onChange={(v) => setBuyerPersona({...buyerPersona, ubicacion: v})} />
                  <InputField label="Ocupación" desc="¿A qué se dedica?" value={buyerPersona.ocupacion} onChange={(v) => setBuyerPersona({...buyerPersona, ocupacion: v})} />
                  <InputField label="Intereses" desc="¿Qué le gusta hacer?" value={buyerPersona.intereses} onChange={(v) => setBuyerPersona({...buyerPersona, intereses: v})} />
                  <InputField label="Frustración" desc="¿Qué le frustra?" value={buyerPersona.frustracion} onChange={(v) => setBuyerPersona({...buyerPersona, frustracion: v})} />
                  <InputField label="Sueño" desc="¿Qué sueña con lograr?" value={buyerPersona.sueno} onChange={(v) => setBuyerPersona({...buyerPersona, sueno: v})} />
                  <InputField label="Disposición a pagar" desc="¿Cuánto estaría dispuesto a pagar?" value={buyerPersona.dispuestoAPagar} onChange={(v) => setBuyerPersona({...buyerPersona, dispuestoAPagar: v})} />
                  <InputField label="Fuente" desc="¿De dónde sacaste esta información?" value={buyerPersona.fuente} onChange={(v) => setBuyerPersona({...buyerPersona, fuente: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'user' && (
              <motion.div key="user" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>1.4 User Persona (Usuario Ideal)</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Define al personaje que usará el producto (si es diferente al Buyer Persona, detállalo).</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <InputField label="Nombre de tu usuario ideal" desc="¿Cómo se llama?" value={userPersona.nombre} onChange={(v) => setUserPersona({...userPersona, nombre: v})} />
                  <InputField label="Edad" desc="¿Qué edad tiene?" value={userPersona.edad} onChange={(v) => setUserPersona({...userPersona, edad: v})} />
                  <InputField label="Relación" desc="¿Qué relación tiene con mi cliente?" value={userPersona.relacion} onChange={(v) => setUserPersona({...userPersona, relacion: v})} />
                  <InputField label="Día a día" desc="¿Qué hace en su día a día?" value={userPersona.diaADia} onChange={(v) => setUserPersona({...userPersona, diaADia: v})} />
                  <InputField label="Necesidades" desc="¿Qué necesita para hacer mejor su trabajo?" value={userPersona.necesidades} onChange={(v) => setUserPersona({...userPersona, necesidades: v})} />
                  <InputField label="Frustración" desc="¿Qué le frustra de su situación actual?" value={userPersona.frustracion} onChange={(v) => setUserPersona({...userPersona, frustracion: v})} />
                  <InputField label="Fuente" desc="¿De dónde sacaste esta información?" value={userPersona.fuente} onChange={(v) => setUserPersona({...userPersona, fuente: v})} />
                </div>
              </motion.div>
            )}

            {activeTab === 'mercado' && (
              <motion.div key="mercado" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.8rem', color: '#eab308', marginBottom: '0.5rem' }}>1.5 Tamaño del Mercado</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Calculemos cuántas personas componen tu mercado en números reales.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <InputField label="Mercado total" desc="¿Cuántas personas hay en mi mercado total? (Ej: estudiantes del colegio)" value={mercado.mercadoTotal} onChange={(v) => setMercado({...mercado, mercadoTotal: v})} />
                  <InputField label="Conversión (%)" desc="Según mi encuesta, ¿qué porcentaje compraría mi producto?" value={mercado.porcentajeCompraria} onChange={(v) => setMercado({...mercado, porcentajeCompraria: v})} />
                  <InputField label="Clientes Potenciales" desc="Total × % que compraría" value={mercado.clientesPotenciales} onChange={(v) => setMercado({...mercado, clientesPotenciales: v})} />
                  <InputField label="Mercados secundarios" desc="¿Hay otros grupos que también podrían comprar? (Ej: profesores, padres)" value={mercado.otrosGrupos} onChange={(v) => setMercado({...mercado, otrosGrupos: v})} />
                  <InputField label="Mercado total estimado" desc="Suma de clientes potenciales y secundarios" value={mercado.mercadoEstimado} onChange={(v) => setMercado({...mercado, mercadoEstimado: v})} />
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
            style={{ opacity: activeTab === 'cliente' ? 0.5 : 1, pointerEvents: activeTab === 'cliente' ? 'none' : 'auto' }}
          >
            <ArrowLeft style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }}/> Anterior
          </button>
          
          {activeTab !== 'mercado' ? (
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
              Finalizar Paso 1 <ArrowRight style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.5rem' }}/>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
