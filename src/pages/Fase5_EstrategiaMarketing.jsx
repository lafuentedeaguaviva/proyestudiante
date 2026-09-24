import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaseModel } from '../models/FaseModel';
import PasoLayout from '../layouts/PasoLayout';
import { useFase5Controller } from '../controllers/useFase5Controller';
import { Play, CheckCircle, Trash2, Plus, Video, Search, ShieldAlert, Rocket, Globe, Megaphone, Truck, MapPin, Package, CreditCard, Wrench, ClipboardList, DollarSign, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Paso9_ResumenMarketingIA from '../components/modos/mentor/fases/CaminoA/Fase5/Paso9_ResumenMarketingIA';

const Fase5_EstrategiaMarketing = () => {
  const { 
    cargando, step, irAPaso, siguientePaso, pasoAnterior,
    globalData, setGlobalData,
    guardando, errorStr,
    showCompletionModal, setShowCompletionModal,
    handleFinalizar, setPendingSave
  } = useFase5Controller();

  const navigate = useNavigate();

  const data = {
    ...globalData,
    competencia: globalData?.competencia?.length > 0 ? globalData.competencia : [{ id: Date.now(), nombre: '', vende: '', precio: '', fortalezas: '', debilidades: '' }],
    soluciones: globalData?.soluciones?.length > 0 ? globalData.soluciones : [{ id: Date.now(), alternativa: 'Alternativa 1', porque: '', frustracion: '' }],
    promoCanales: globalData?.promoCanales || [],
  };
  const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };

  const [precioSugerido, setPrecioSugerido] = useState('');
  useEffect(() => {
    const fetchPrecio = async () => {
      try {
        const f2 = await FaseModel.obtenerDatosFase(2).catch(() => ({}));
        const f3 = await FaseModel.obtenerDatosFase(3).catch(() => ({}));
        const allData = { f2, f3 };
        
        const findPrecio = (obj) => {
          if (!obj) return null;
          if (typeof obj === 'string') {
            try {
              if (obj.trim().startsWith('{') || obj.trim().startsWith('[')) {
                obj = JSON.parse(obj);
              } else {
                return null;
              }
            } catch(e) { return null; }
          }
          if (typeof obj !== 'object') return null;
          if (obj.precio_sugerido) return obj.precio_sugerido;
          for (let key in obj) {
            const res = findPrecio(obj[key]);
            if (res) return res;
          }
          return null;
        };
        const precio = findPrecio(allData);
        if (precio) setPrecioSugerido(precio);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrecio();
  }, []);

  if (cargando) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos de la Fase 5...</div>;

  const renderVideoStep = (titulo) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{titulo}</h2>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <YoutubePlayer videoKey="video_fase_5" title={titulo} fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      </div>
    </div>
  );

  // Estilos compartidos para los formularios tipo Mentor
  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '2px solid #e2e8f0',
    background: '#f8fafc', color: '#0f172a', fontSize: '1rem', transition: 'all 0.2s', outline: 'none'
  };
  const labelStyle = { display: 'block', color: '#475569', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.95rem' };
  const groupStyle = { marginBottom: '1.5rem' };
  const cardStyle = { background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', width: '100%', maxWidth: '800px', margin: '0 auto' };
  const titleStyle = { fontSize: '1.8rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '0.5rem', textAlign: 'center' };
  const subtitleStyle = { color: '#64748b', marginBottom: '2rem', textAlign: 'center', fontSize: '1.1rem' };

  const getPasoContent = () => {
    switch(step) {
      case 1: return renderVideoStep("1. Análisis de competencia", "competencia", "Ir a la Matriz");
      case 2: return (
        <div className="animate-fade-in p-8 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto border border-slate-100">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">2. Análisis de Competencia</h2>
            <p className="text-lg text-slate-500">Identifica a 3 competidores (los "Villanos") y analiza qué hacen bien y qué les falta.</p>
          </div>
          <div className="flex flex-col gap-8">
            {data.competencia.map((c, i) => (
              <div key={c.id} className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 relative hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                  <h3 className="font-bold text-xl text-blue-800 flex items-center gap-3">
                    <span className="bg-blue-200 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">{i+1}</span>
                    Competidor {i+1}
                  </h3>
                  {data.competencia.length > 1 && (
                    <button onClick={() => updateGlobalData({ competencia: data.competencia.filter(comp => comp.id !== c.id) })} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Eliminar competidor">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre / Identidad</label>
                    <input className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-slate-800 placeholder:text-slate-400" value={c.nombre} onChange={(e) => {
                      const nueva = [...data.competencia]; nueva[i].nombre = e.target.value; updateGlobalData({ competencia: nueva });
                    }} placeholder="Ej: Burger King" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">¿Qué vende exactamente?</label>
                    <input className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-slate-800 placeholder:text-slate-400" value={c.vende} onChange={(e) => {
                      const nueva = [...data.competencia]; nueva[i].vende = e.target.value; updateGlobalData({ competencia: nueva });
                    }} placeholder="Ej: Hamburguesas rápidas" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">¿A qué precio?</label>
                    <input className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-slate-800 placeholder:text-slate-400" value={c.precio} onChange={(e) => {
                      const nueva = [...data.competencia]; nueva[i].precio = e.target.value; updateGlobalData({ competencia: nueva });
                    }} placeholder="Ej: $5 - $10" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Fortalezas (¿Qué hace bien?)</label>
                    <textarea className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-slate-800 placeholder:text-slate-400 resize-y min-h-[100px]" rows="3" value={c.fortalezas} onChange={(e) => {
                      const nueva = [...data.competencia]; nueva[i].fortalezas = e.target.value; updateGlobalData({ competencia: nueva });
                    }} placeholder="Ej: Rápido, económico..." />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Debilidades (¿Qué hace mal?)</label>
                    <textarea className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-slate-800 placeholder:text-slate-400 resize-y min-h-[100px]" rows="3" value={c.debilidades} onChange={(e) => {
                      const nueva = [...data.competencia]; nueva[i].debilidades = e.target.value; updateGlobalData({ competencia: nueva });
                    }} placeholder="Ej: Mala calidad de ingredientes..." />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => updateGlobalData({ competencia: [...data.competencia, { id: Date.now(), nombre: '', vende: '', precio: '', fortalezas: '', debilidades: '' }] })}
              className="mt-4 text-blue-600 font-bold hover:text-blue-800 hover:bg-blue-50 p-4 rounded-xl transition-colors border-2 border-dashed border-blue-300 flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Añadir otro competidor
            </button>
          </div>
        </div>
      );
      
      case 3: return (
        <div style={cardStyle}>
          <h2 style={titleStyle}>4. Tu Ventaja Competitiva</h2>
          <p style={subtitleStyle}>Define tu "Superpoder" único en el mercado.</p>
          
          <div>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Qué problema principal tienen las soluciones actuales que yo SÍ puedo resolver?</label>
              <textarea style={{...inputStyle, minHeight: '80px'}} rows="2" value={data.ventajaProblema} onChange={(e) => updateGlobalData({ ventajaProblema: e.target.value })} placeholder="Ej: Sus entregas siempre llegan frías." />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Qué ofrezco que es DIFERENTE, MEJOR y que NADIE más ofrece?</label>
              <textarea style={{...inputStyle, minHeight: '100px', borderColor: '#93c5fd', background: '#eff6ff'}} rows="3" value={data.ventajaDiferente} onChange={(e) => updateGlobalData({ ventajaDiferente: e.target.value })} placeholder="Ej: Mochilas térmicas con sistema de calefacción propio para garantizar comida hirviendo." />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>Frase Poderosa (Resume tu ventaja en 1 frase)</label>
              <input style={{...inputStyle, fontWeight: 'bold', color: '#1d4ed8'}} value={data.ventajaFrase} onChange={(e) => updateGlobalData({ ventajaFrase: e.target.value })} placeholder="Ej: Somos los únicos que entregamos comida casera caliente en 10 minutos." />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Pueden copiarme? (La Sostenibilidad)</label>
              <input style={inputStyle} value={data.ventajaCopian} onChange={(e) => updateGlobalData({ ventajaCopian: e.target.value })} placeholder="Ej: Sí, pero requeriría una fuerte inversión." />
            </div>
            <div style={{...groupStyle, marginBottom: 0}}>
              <label style={labelStyle}>Si me copian, ¿qué voy a hacer para seguir siendo diferente?</label>
              <textarea style={{...inputStyle, minHeight: '80px'}} rows="2" value={data.ventajaSostenibilidad} onChange={(e) => updateGlobalData({ ventajaSostenibilidad: e.target.value })} placeholder="Ej: Crear alianzas exclusivas con los mejores restaurantes locales." />
            </div>
          </div>
        </div>
      );
      
      case 4: return (
        <div style={cardStyle}>
          <h2 style={titleStyle}>6. Análisis del entorno (Factores externos)</h2>
          <p style={subtitleStyle}>¿Cómo te afectan las reglas del mundo exterior?</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>Político / Legal</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>¿Hay leyes o permisos que afecten tu negocio?</p>
              <textarea style={{...inputStyle, minHeight: '80px', background: 'white'}} rows="2" value={data.pestelPolitico} onChange={(e) => updateGlobalData({ pestelPolitico: e.target.value })} />
            </div>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>Económico {precioSugerido ? <span style={{fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal'}}>({precioSugerido})</span> : ''}</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>¿La situación económica de tu cliente le permite comprar?</p>
              <textarea style={{...inputStyle, minHeight: '80px', background: 'white'}} rows="2" value={data.pestelEconomico} onChange={(e) => updateGlobalData({ pestelEconomico: e.target.value })} />
            </div>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>Social</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>¿Hay tendencias (ecológico, fitness) que favorezcan tu producto?</p>
              <textarea style={{...inputStyle, minHeight: '80px', background: 'white'}} rows="2" value={data.pestelSocial} onChange={(e) => updateGlobalData({ pestelSocial: e.target.value })} />
            </div>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>Tecnológico</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>¿Puedes usar redes sociales o apps para vender más?</p>
              <textarea style={{...inputStyle, minHeight: '80px', background: 'white'}} rows="2" value={data.pestelTecnologico} onChange={(e) => updateGlobalData({ pestelTecnologico: e.target.value })} />
            </div>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>Ambiental</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>¿Tu producto cuida el medio ambiente? ¿Puedes ser más ecológico?</p>
              <textarea style={{...inputStyle, minHeight: '80px', background: 'white'}} rows="2" value={data.pestelAmbiental} onChange={(e) => updateGlobalData({ pestelAmbiental: e.target.value })} />
            </div>
          </div>
        </div>
      );
      
      case 5: return (
        <div className="animate-fade-in p-8 bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-auto border border-slate-100">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">8. Estrategia de promoción</h2>
            <p className="text-lg text-slate-500">¿Cómo vas a comunicar tu producto al mundo?</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <label className="block text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                ¿Qué canales vas a usar?
                <span className="text-sm font-normal text-slate-500 ml-auto">(Marca todos los que uses)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Afiches / Carteles', 'Redes sociales (Instagram, TikTok)', 'Boca a boca', 'Muestras gratis', 'Anuncios en el colegio', 'Volantes / Flyers', 'Promociones especiales'].map(canal => (
                  <label key={canal} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${data.promoCanales.includes(canal) ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'}`}>
                    <input type="checkbox" className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer transition-colors"
                      checked={data.promoCanales.includes(canal)}
                      onChange={(e) => {
                        let canales = [...data.promoCanales];
                        if (e.target.checked) canales.push(canal);
                        else canales = canales.filter(c => c !== canal);
                        updateGlobalData({ promoCanales: canales });
                      }}
                    />
                    <span className={`font-semibold ${data.promoCanales.includes(canal) ? 'text-blue-900' : 'text-slate-700'}`}>{canal}</span>
                  </label>
                ))}
                
                <div className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-200 ${data.promoCanales.includes('Otro') ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'}`}>
                  <label className="flex items-center gap-4 cursor-pointer whitespace-nowrap">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                      checked={data.promoCanales.includes('Otro')}
                      onChange={(e) => {
                        let canales = [...data.promoCanales];
                        if (e.target.checked) canales.push('Otro');
                        else canales = canales.filter(c => c !== 'Otro');
                        updateGlobalData({ promoCanales: canales });
                      }}
                    />
                    <span className={`font-semibold ${data.promoCanales.includes('Otro') ? 'text-blue-900' : 'text-slate-700'}`}>Otro:</span>
                  </label>
                  <input className="flex-1 p-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-slate-800 placeholder:text-slate-400" 
                    value={data.promoOtroCanal} 
                    onChange={(e) => updateGlobalData({ promoOtroCanal: e.target.value })}
                    disabled={!data.promoCanales.includes('Otro')}
                    placeholder="Escribe el canal..." />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <label className="block text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                ¿Qué mensaje vas a comunicar?
                <span className="text-sm font-normal text-slate-500 ml-auto">(¿Qué les dirás?)</span>
              </label>
              <textarea className="w-full p-5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-inner bg-white text-slate-800 placeholder:text-slate-400 resize-y min-h-[120px]" 
                rows="3" 
                value={data.promoMensaje} 
                onChange={(e) => updateGlobalData({ promoMensaje: e.target.value })} 
                placeholder="Ej: ¡Llegó la revolución de los postres a tu colegio! Prueba nuestro sabor único hoy." 
              />
            </div>
          </div>
        </div>
      );
      case 6: return <Paso9_ResumenMarketingIA setAyudanteText={() => {}} onComplete={handleFinalizar} globalData={data} updateGlobalData={updateGlobalData} guardando={guardando} />;
      default: return <div>Paso no definido</div>;
    }
  };

  return (
    <PasoLayout 
      faseTitle="Fase 5: La Estrategia de Marketing"
      pasoActual={step}
      totalPasos={9}
      tabs={[
        { id: 1, icon: <Video size={18} />, label: 'Video Competencia' },
        { id: 2, icon: <Search size={18} />, label: 'Análisis Competencia' },
        { id: 3, icon: <Video size={18} />, label: 'Video Ventaja' },
        { id: 4, icon: <Rocket size={18} />, label: 'Ventaja Competitiva' },
        { id: 5, icon: <Video size={18} />, label: 'Video Entorno' },
        { id: 6, icon: <Globe size={18} />, label: 'PESTEL' },
        { id: 7, icon: <Video size={18} />, label: 'Video Promoción' },
        { id: 8, icon: <Megaphone size={18} />, label: 'Promoción' },
        { id: 9, icon: <Bot size={18} />, label: 'Resumen IA' }
      ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => step < 9 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={`Estás en el paso ${step} de 9. Revisa que los datos estén correctos antes de continuar.`}
      guardando={guardando}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>
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
            <h2 style={{ color: '#16a34a', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>¡Fase 5 Completada!</h2>
            <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '1.1rem' }}>Tu Estrategia de Marketing está lista y guardada. El mapa ha sido actualizado.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/fase/6/intro');
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

export default Fase5_EstrategiaMarketing;
