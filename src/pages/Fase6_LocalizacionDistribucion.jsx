import React, { useState, useEffect } from 'react';
import YoutubePlayer from '../components/ui/YoutubePlayer';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import { useFase6Controller } from '../controllers/useFase6Controller';
import { Play, CheckCircle, Trash2, Plus, Video, Search, ShieldAlert, Rocket, Globe, Megaphone, Truck, MapPin, Package, CreditCard, Wrench, ClipboardList, DollarSign, ImagePlus, Image, Star, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { obtenerContenidoFaseCompleto, guardarContenidoFase } from '../services/api';
import Paso10_ResumenLocDistIA from '../components/modos/mentor/fases/CaminoA/Fase6/Paso10_ResumenLocDistIA';

const Fase6_LocalizacionDistribucion = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    globalData, setGlobalData,
    cargando, step, guardando, irAPaso, siguientePaso, pasoAnterior,
    showCompletionModal, setShowCompletionModal, handleFinalizar, isFinalizando,
    setPendingSave
  } = useFase6Controller();

  const updateGlobalData = (d) => {
    setGlobalData(d);
    setPendingSave(true);
  };

  const data = globalData || {};
  if (!data.lugares) data.lugares = [{ id: 1, nombre: '', cercania: 1, flujo: 1, visibilidad: 1, costo: 1, permisos: 1 }];
  if (!data.planDistribucion) data.planDistribucion = [];
  if (!data.presupuesto) data.presupuesto = [];

  const renderVideoStep = (titulo) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{titulo}</h2>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <YoutubePlayer videoKey="video_fase_6" title={titulo} fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      </div>
    </div>
  );

  const wrapperStyle = { padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' };
  const cardStyle = { background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' };
  const titleStyle = { fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' };
  const groupStyle = { marginBottom: '1.5rem' };
  const labelStyle = { display: 'block', color: '#475569', fontWeight: 'bold', marginBottom: '0.25rem' };
  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', marginTop: '0.5rem', fontSize: '1rem', outline: 'none' };
  const textStyle = { color: '#475569', marginBottom: '2rem', textAlign: 'center' };

  const getPasoContent = () => {
    switch(step) {
      case 1: return renderVideoStep("1. Distribución", "distribucion", "Planear Distribución");
      case 2: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>2. Identificación de la Localización</h2>
          <p style={textStyle}>¿Dónde se llevarán a cabo las actividades principales de tu negocio?</p>
          
          <div style={cardStyle}>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Dónde voy a producir o preparar mi producto?</label>
              <input style={inputStyle} value={data.dondeProducir} onChange={(e) => updateGlobalData({ dondeProducir: e.target.value })} placeholder="Ej: En la cocina de mi casa..." />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Dónde voy a almacenar mis materiales?</label>
              <input style={inputStyle} value={data.dondeAlmacenar} onChange={(e) => updateGlobalData({ dondeAlmacenar: e.target.value })} placeholder="Ej: En una bodega en mi cuarto..." />
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>3. Canales de Distribución</h2>
          <p style={textStyle}>¿Cómo va a llegar el producto al cliente?</p>
          <div style={cardStyle}>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Cómo voy a vender el producto?</label>
              <select style={inputStyle} value={data.distComoVender} onChange={(e) => updateGlobalData({ distComoVender: e.target.value })}>
                <option value="">Selecciona una opción...</option>
                <option value="punto de venta">En el punto de venta (Quiosco, local, feria)</option>
                <option value="encargo">Por encargo (Punto de recogida acordado)</option>
                <option value="delivery">Delivery (En la casa del cliente)</option>
                <option value="encuentro">Punto de encuentro (Lugar neutral acordado)</option>
                <option value="virtual">Virtual (En línea, Zoom, WhatsApp)</option>
              </select>
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div style={{ ...wrapperStyle, maxWidth: '1000px' }}>
          <h2 style={titleStyle}>4. Elección del Lugar (Ubicación)</h2>
          <p style={textStyle}>Compara y califica del 1 al 5 cada ubicación posible (1 es malo, 5 es excelente).</p>
          
          <div style={{ ...cardStyle, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#475569' }}>Criterio (1-5)</th>
                  {data.lugares.map((l, i) => (
                    <th key={l.id} style={{ padding: '1rem', minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <input 
                          style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 'bold', color: '#0f172a', textAlign: 'center', outline: 'none' }}
                          value={l.nombre} 
                          onChange={(e) => {
                            const n = [...data.lugares]; n[i].nombre = e.target.value; updateGlobalData({ lugares: n });
                          }} 
                          placeholder={`Ubicación ${i+1}`} 
                        />
                        {data.lugares.length > 1 && (
                          <button onClick={() => updateGlobalData({ lugares: data.lugares.filter(loc => loc.id !== l.id) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => updateGlobalData({ lugares: [...data.lugares, { id: Date.now(), nombre: '', cercania: 1, flujo: 1, visibilidad: 1, costo: 1, permisos: 1 }] })} 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      <Plus size={16} /> Añadir
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'cercania', label: 'Cercanía al cliente' },
                  { key: 'flujo', label: 'Flujo de personas' },
                  { key: 'visibilidad', label: 'Visibilidad' },
                  { key: 'costo', label: 'Costo bajo' },
                  { key: 'permisos', label: 'Facilidad de permisos' }
                ].map(crit => (
                  <tr key={crit.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#475569' }}>{crit.label}</td>
                    {data.lugares.map((l, i) => (
                      <td key={`${crit.key}-${l.id}`} style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                          {[1, 2, 3, 4, 5].map(v => (
                            <Star 
                              key={v}
                              size={24}
                              fill={v <= l[crit.key] ? '#eab308' : 'transparent'}
                              color={v <= l[crit.key] ? '#eab308' : '#cbd5e1'}
                              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                              onClick={() => {
                                const n = [...data.lugares]; n[i][crit.key] = v; updateGlobalData({ lugares: n });
                              }}
                            />
                          ))}
                        </div>
                      </td>
                    ))}
                    <td></td>
                  </tr>
                ))}
                <tr style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe' }}>
                  <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1e40af' }}>PUNTAJE TOTAL</td>
                  {data.lugares.map((l) => (
                    <td key={`total-${l.id}`} style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '900', color: '#2563eb', fontSize: '1.5rem' }}>
                        {l.cercania + l.flujo + l.visibilidad + l.costo + l.permisos}
                      </span>
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
      case 5: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>5. Croquis o Mapa</h2>
          <p style={textStyle}>Dibuja o describe cómo llegar a tu ubicación y sus puntos de referencia.</p>
          
          <div style={cardStyle}>
            <label style={{ border: '3px dashed #cbd5e1', borderRadius: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', cursor: 'pointer', background: '#f8fafc', overflow: 'hidden' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const img = new window.Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      const MAX_WIDTH = 800;
                      const MAX_HEIGHT = 800;
                      let width = img.width;
                      let height = img.height;
                      
                      if (width > height) {
                        if (width > MAX_WIDTH) {
                          height *= MAX_WIDTH / width;
                          width = MAX_WIDTH;
                        }
                      } else {
                        if (height > MAX_HEIGHT) {
                          width *= MAX_HEIGHT / height;
                          height = MAX_HEIGHT;
                        }
                      }
                      
                      canvas.width = width;
                      canvas.height = height;
                      const ctx = canvas.getContext('2d');
                      ctx.drawImage(img, 0, 0, width, height);
                      const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                      updateGlobalData({ croquisImagen: dataUrl });
                    };
                    img.src = reader.result;
                  };
                  reader.readAsDataURL(file);
                }
              }} />
              {data.croquisImagen ? (
                <img src={data.croquisImagen} alt="Croquis" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem', objectFit: 'contain' }} />
              ) : (
                <>
                  <ImagePlus size={64} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                  <span style={{ fontWeight: 'bold', color: '#64748b', textAlign: 'center' }}>Haz clic aquí para subir una imagen de tu croquis</span>
                </>
              )}
            </label>
            {data.croquisImagen && (
              <button onClick={() => updateGlobalData({ croquisImagen: '' })} style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Eliminar Imagen</button>
            )}
            
            <div>
              <label style={labelStyle}>Descripción del Croquis (Ubicación, accesos, puntos de referencia):</label>
              <textarea style={{ ...inputStyle, minHeight: '150px' }} 
                value={data.croquisDescripcion} 
                onChange={(e) => updateGlobalData({ croquisDescripcion: e.target.value })} 
                placeholder="Ej: Mi quiosco estará ubicado justo al lado de la cancha de fútbol, frente a las escaleras principales..."
              />
            </div>
          </div>
        </div>
      );
      case 6: 
        const pagosOptions = ['Efectivo', 'Transferencia Bancaria', 'Pago con QR', 'Tigo Money', 'Tarjeta de Débito/Crédito'];
        const pagosActuales = data.comoRecibirPago ? data.comoRecibirPago.split(', ') : [];
        return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>6. Métodos de Pago</h2>
          <p style={textStyle}>¿Cómo vas a recibir el dinero? (Puedes seleccionar varios)</p>
          <div style={cardStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {pagosOptions.map(opcion => (
                <label key={opcion} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: pagosActuales.includes(opcion) ? '#eff6ff' : '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: `1px solid ${pagosActuales.includes(opcion) ? '#3b82f6' : '#cbd5e1'}`, transition: 'all 0.2s' }}>
                  <input 
                    type="checkbox" 
                    checked={pagosActuales.includes(opcion)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateGlobalData({ comoRecibirPago: [...pagosActuales, opcion].join(', ') });
                      } else {
                        updateGlobalData({ comoRecibirPago: pagosActuales.filter(p => p !== opcion).join(', ') });
                      }
                    }}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: '#3b82f6' }}
                  />
                  <span style={{ fontWeight: 'bold', color: pagosActuales.includes(opcion) ? '#1e40af' : '#475569' }}>{opcion}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
      
      case 7: 
        return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">8. Plan de Acción de Distribución</h2>
          <p className="text-slate-500 mb-6">Define los pasos para que tu producto llegue al cliente.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {data.planDistribucion.map((plan, i) => (
              <div key={plan.id} style={{ ...cardStyle, position: 'relative' }}>
                <button onClick={() => updateGlobalData({ planDistribucion: data.planDistribucion.filter(p => p.id !== plan.id) })} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Eliminar paso">
                  <Trash2 size={20} />
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingRight: '2rem' }}>
                  <div>
                    <label style={labelStyle}>Acción</label>
                    <input style={inputStyle} value={plan.accion} placeholder="¿Qué hacer?" onChange={(e) => { const n = [...data.planDistribucion]; n[i].accion = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Cuándo?</label>
                    <input style={inputStyle} value={plan.cuando} placeholder="Fecha o momento" onChange={(e) => { const n = [...data.planDistribucion]; n[i].cuando = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Quién lo hace?</label>
                    <input style={inputStyle} value={plan.quien} placeholder="Responsable" onChange={(e) => { const n = [...data.planDistribucion]; n[i].quien = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Qué necesito?</label>
                    <input style={inputStyle} value={plan.necesito} placeholder="Recursos" onChange={(e) => { const n = [...data.planDistribucion]; n[i].necesito = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => updateGlobalData({ planDistribucion: [...data.planDistribucion, { id: Date.now(), accion: '', cuando: '', quien: '', necesito: '' }] })} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>+ Añadir Acción</button>
        </div>
      );
      case 8: 
        return <Paso10_ResumenLocDistIA setAyudanteText={()=>{}} onComplete={handleFinalizar} globalData={globalData} updateGlobalData={updateGlobalData} guardando={guardando || isFinalizando} />;
      default: return <div>Paso no definido</div>;
    }
  };
  return (
    <PasoLayout 
      faseTitle="Fase 6: Localización y Distribución"
      pasoActual={step}
      totalPasos={8}
      tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <MapPin size={18} />, label: 'Identificación Loc.' },
          { id: 3, icon: <Truck size={18} />, label: 'Canales Distribución' },
          { id: 4, icon: <MapPin size={18} />, label: 'Elección Lugar' },
          { id: 5, icon: <Image size={18} />, label: 'Croquis' },
          { id: 6, icon: <CreditCard size={18} />, label: 'Pagos' },
          { id: 7, icon: <ClipboardList size={18} />, label: 'Plan Acción' },
          { id: 8, icon: <Bot size={18} />, label: 'Resumen IA' }
        ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => {
        if (step < 9) {
          siguientePaso();
        } else {
          handleFinalizar();
        }
      }}
      onAnterior={step > 1 ? () => pasoAnterior() : null}
      mentorText={`Estás en el paso ${step} de 9. Revisa que los datos estén correctos antes de continuar.`}
      guardando={guardando}
    >
      <div>
        {getPasoContent()}
      </div>

      {showCompletionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
                <CheckCircle size={48} color="#16a34a" />
              </div>
            </div>
            <h2 style={{ color: '#16a34a', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>¡Fase 6 Completada!</h2>
            <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '1.1rem' }}>Tu Estrategia de Logística está lista y guardada. El mapa ha sido actualizado.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/fase/7/intro');
                }}
                style={{ padding: '1rem 2rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Siguiente Fase
              </button>
              <button 
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/dashboard');
                }}
                style={{ padding: '0.75rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '1rem' }}
              >
                Volver al Mapa
              </button>
            </div>
          </div>
        </div>
      )}
    </PasoLayout>
  );
};

export default Fase6_LocalizacionDistribucion;
