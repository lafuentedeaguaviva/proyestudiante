import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SplashScreen from '../components/ui/SplashScreen';
import DetectiveLayout from '../layouts/DetectiveLayout';
import RetoValidacion from '../components/modos/mentor/retos/RetoValidacion';
import { obtenerRetoValidacion, guardarContenidoFase } from '../services/api';
import { Users, Clock, Wrench } from 'lucide-react';
import { NexusContext } from '../context/NexusContext';

const Fase5_Reconstruccion = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pasoQuery = searchParams.get('paso');
  const { increaseNexus } = useContext(NexusContext) || { increaseNexus: () => {} };
  
  const [showSplash, setShowSplash] = useState(pasoQuery ? false : true);
  const [step, setStep] = useState(pasoQuery ? parseInt(pasoQuery) : 1);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (pasoQuery) {
      const p = parseInt(pasoQuery);
      if (p >= 1 && p <= 3) {
        setStep(p);
        setShowSplash(false);
      }
    }
  }, [pasoQuery]);
  const [errorStr, setErrorStr] = useState(null);

  // Paso 1: Roles
  const [equipo, setEquipo] = useState([{ rol: '', funcion: '' }]);

  // Paso 2: Procesos
  const [pasosProceso, setPasosProceso] = useState([{ descripcion: '', tiempo: '' }]);

  // Paso 3: Producción
  const [recursos, setRecursos] = useState([{ tipo: 'Material', descripcion: '', cantidad: '' }]);

  // Reto DB
  const [retoDB, setRetoDB] = useState(null);
  const [mostrarReto, setMostrarReto] = useState(false);

  useEffect(() => {
    const fetchReto = async () => {
      const data = await obtenerRetoValidacion(5);
      if (data) setRetoDB(data);
    };
    fetchReto();
  }, []);

  const getOrionDialog = () => {
    switch (step) {
      case 1: return "Analizando a los sospechosos... digo, al equipo. ¿Quiénes son tus cómplices y qué papel juegan en la reconstrucción?";
      case 2: return "El tiempo es una ilusión... pero tú tienes plazos. ¿Cuál es la secuencia exacta de eventos para crear tu producto?";
      case 3: return "Inventario. ¿Con qué armas materiales cuentas? NEXUS te quiere desarmado. Haz una lista detallada.";
      default: return "";
    }
  };

  const handleFinalizar = async () => {
    // Basic validation
    if (!equipo[0].rol || !pasosProceso[0].descripcion || !recursos[0].descripcion) {
      increaseNexus(15, "Reconstrucción defectuosa. Faltan pruebas clave.");
      setErrorStr("Debes completar al menos el primer ítem en todas las secciones.");
      return;
    }
    
    setGuardando(true);
    setErrorStr(null);
    try {
      const datosFase5 = { equipo, pasosProceso, recursos };
      await guardarContenidoFase(5, 'operacion', datosFase5);
      setGuardando(false);

      if (retoDB) {
        setMostrarReto(true);
      } else {
        alert("¡Expediente 05 Completado! Pasando a la Fase 6.");
        navigate('/fase/6/intro');
      }
    } catch (err) {
      console.error(err);
      setErrorStr(err.message);
      setGuardando(false);
    }
  };

  const handleNextStep = () => {
    // NEXUS Traps
    if (step === 1 && (!equipo[0].rol || equipo[0].rol.length < 3)) {
      increaseNexus(10, "Rol fantasma detectado. NEXUS se infiltra en tu equipo.");
    }
    if (step === 2 && pasosProceso.length < 2) {
      increaseNexus(15, "Proceso demasiado simple. NEXUS ama la incompetencia.");
    }
    setStep(step + 1);
  };

  if (showSplash) {
    return (
      <SplashScreen 
        faseNumero="5"
        titulo="La Reconstrucción"
        descripcion="Es momento de recrear la escena. Define a tus cómplices, traza la línea de tiempo y asegura tu armamento."
        avatarSrc="/avatar_aster.png"
        onComenzar={() => setShowSplash(false)}
      />
    );
  }

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'rgba(15, 23, 42, 0.5)', color: '#0f172a', outline: 'none', marginBottom: '1rem' };
  const labelStyle = { display: 'block', color: '#60a5fa', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 };
  const sectionStyle = { background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' };

  return (
    <DetectiveLayout canGoBack={true} personajeHablando={{ nombre: 'ORION (Sistema CRONOS)', rol: 'ayudante', avatarSrc: '/avatar_orion.png', dialogo: getOrionDialog() }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
        
        {/* Progress Bar & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          {[
            { id: 1, icon: <Users size={18} />, label: 'Roles' },
            { id: 2, icon: <Clock size={18} />, label: 'Procesos' },
            { id: 3, icon: <Wrench size={18} />, label: 'Producción' }
          ].map(t => (
            <button key={t.id} onClick={() => setStep(t.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: step === t.id ? '#3b82f6' : 'transparent', color: step === t.id ? 'white' : '#64748b', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
              {t.icon} <span style={{ display: step === t.id ? 'inline' : 'none' }}>{t.label}</span>
            </button>
          ))}
        </div>

        {errorStr && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.4)', textAlign: 'center' }}>
            {errorStr}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* PASO 1: ROLES */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>Los Cómplices</h2>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>Define quiénes participan en la operación y qué hace cada uno.</p>

              <div style={sectionStyle}>
                {equipo.map((eq, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Rol / Puesto</label>
                      <input 
                        type="text" 
                        value={eq.rol} 
                        onChange={(e) => { const n = [...equipo]; n[i].rol = e.target.value; setEquipo(n); }} 
                        style={inputStyle} 
                        placeholder="Ej. Desarrollador Principal"
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={labelStyle}>Misión Asignada (Función)</label>
                      <input 
                        type="text" 
                        value={eq.funcion} 
                        onChange={(e) => { const n = [...equipo]; n[i].funcion = e.target.value; setEquipo(n); }} 
                        style={inputStyle} 
                        placeholder="Ej. Programar la lógica del negocio"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={() => setEquipo([...equipo, { rol: '', funcion: '' }])} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px dashed #3b82f6', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>
                  + Añadir Cómplice
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: PROCESOS */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>Línea de Tiempo (Procesos)</h2>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>Paso a paso, ¿cómo se reconstruye el producto desde cero hasta el cliente?</p>

              <div style={sectionStyle}>
                {pasosProceso.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                    <div style={{ background: '#3b82f6', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 3 }}>
                      <label style={labelStyle}>Descripción del Paso</label>
                      <input 
                        type="text" 
                        value={p.descripcion} 
                        onChange={(e) => { const n = [...pasosProceso]; n[i].descripcion = e.target.value; setPasosProceso(n); }} 
                        style={inputStyle} 
                        placeholder="Ej. Compra de materia prima"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Tiempo estimado</label>
                      <input 
                        type="text" 
                        value={p.tiempo} 
                        onChange={(e) => { const n = [...pasosProceso]; n[i].tiempo = e.target.value; setPasosProceso(n); }} 
                        style={inputStyle} 
                        placeholder="Ej. 2 días"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={() => setPasosProceso([...pasosProceso, { descripcion: '', tiempo: '' }])} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px dashed #3b82f6', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>
                  + Añadir Paso
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: PRODUCCIÓN */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>El Arsenal (Producción)</h2>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>Lista los recursos materiales, herramientas o software necesarios.</p>

              <div style={sectionStyle}>
                {recursos.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Tipo</label>
                      <select 
                        value={r.tipo} 
                        onChange={(e) => { const n = [...recursos]; n[i].tipo = e.target.value; setRecursos(n); }} 
                        style={{...inputStyle, WebkitAppearance: 'none'}}
                      >
                        <option>Material</option>
                        <option>Herramienta</option>
                        <option>Software</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={labelStyle}>Descripción</label>
                      <input 
                        type="text" 
                        value={r.descripcion} 
                        onChange={(e) => { const n = [...recursos]; n[i].descripcion = e.target.value; setRecursos(n); }} 
                        style={inputStyle} 
                        placeholder="Ej. Servidor AWS"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Cantidad</label>
                      <input 
                        type="text" 
                        value={r.cantidad} 
                        onChange={(e) => { const n = [...recursos]; n[i].cantidad = e.target.value; setRecursos(n); }} 
                        style={inputStyle} 
                        placeholder="Ej. 1"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={() => setRecursos([...recursos, { tipo: 'Material', descripcion: '', cantidad: '' }])} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px dashed #3b82f6', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>
                  + Añadir Recurso
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <button 
                  onClick={handleFinalizar}
                  disabled={guardando}
                  className="btn-detective-primary"
                  style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
                >
                  {guardando ? 'Firmando Expediente...' : 'Sellar Expediente'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Controles Generales */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer' }}>Anterior</button>
          ) : <div></div>}
          {step < 3 && (
            <button onClick={handleNextStep} style={{ padding: '0.75rem 2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>Siguiente Paso</button>
          )}
        </div>

      </div>

      {/* GATEKEEPER */}
      <div className="animate-presence-removed">
        {mostrarReto && retoDB && (
          <RetoValidacion 
            retoInfo={retoDB}
            onSuperado={() => {
              setMostrarReto(false);
              navigate('/fase/6/intro');
            }}
            onFalladoCompleto={() => {
              setMostrarReto(false);
            }}
          />
        )}
      </div>
    </DetectiveLayout>
  );
};

export default Fase5_Reconstruccion;
