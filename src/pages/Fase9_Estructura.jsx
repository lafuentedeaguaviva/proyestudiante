import React, { useState, useEffect } from 'react';
import YoutubePlayer from '../components/ui/YoutubePlayer';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import SplashScreenMentor from '../components/ui/SplashScreenMentor';
import { useFase9Controller } from '../controllers/useFase9Controller';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { Plus, Trash2, Users, FileText, ChevronRight, TrendingUp, Settings, Megaphone, Monitor, X, Network, Briefcase, Download, Sparkles, RefreshCw, Video } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const InlineInput = ({ value, onChange, className, placeholder }) => {
  const [val, setVal] = useState(value || '');
  useEffect(() => { setVal(value || ''); }, [value]);
  return (
    <input
      className={className}
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => { if (val !== value) onChange(val); }}
      placeholder={placeholder}
    />
  );
};

const InlineTextarea = ({ value, onChange, className, placeholder }) => {
  const [val, setVal] = useState(value || '');
  useEffect(() => { setVal(value || ''); }, [value]);
  return (
    <textarea
      className={className}
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={() => { if (val !== value) onChange(val); }}
      placeholder={placeholder}
    />
  );
};

const Fase9_Estructura = () => {
  const { 
    cargando, guardando, step, irAPaso, siguientePaso, pasoAnterior,
    showSplash, setShowSplash,
    showExpandModal, setShowExpandModal,
    modoVista, setModoVista,
    data, updateData, organigrama, roles,
    handleFinalizar,
    isGeneratingResumen,
    generarResumenFase9,
    setPendingSave 
  } = useFase9Controller();

  useEffect(() => {
    if (step === 4 && !data.resumen_estructura && !isGeneratingResumen) {
      generarResumenFase9();
    }
  }, [step]);

  const getDefaultFunciones = (areaNombre) => {
    const l = areaNombre.toLowerCase();
    if (l.includes('finanz')) return 'Controlar los ingresos y egresos, pagar impuestos y asegurar rentabilidad.';
    if (l.includes('ventas') || l.includes('marketing')) return 'Diseñar estrategias de atracción, manejar redes sociales y cerrar ventas.';
    if (l.includes('produ') || l.includes('opera')) return 'Fabricar el producto o entregar el servicio manteniendo altos estándares de calidad.';
    if (l.includes('recurso') || l.includes('rrhh')) return 'Contratar, capacitar y asegurar un buen clima laboral.';
    if (l.includes('tecnolo') || l.includes('ti')) return 'Mantener sistemas, plataformas y equipos funcionando.';
    if (l.includes('logíst')) return 'Gestionar el almacén, inventarios y entregar pedidos a tiempo.';
    return 'Asegurar el cumplimiento de los objetivos de su área, reportar resultados y coordinar con el resto del equipo.';
  };

  const opcionesExpansion = [
    { id: 'marketing', nombre: 'Marketing y Ventas', tipo: 'area', icon: <Megaphone size={24} />, desc: 'No estoy vendiendo lo suficiente.', color: 'bg-orange-100 text-orange-600' },
    { id: 'operaciones', nombre: 'Operaciones', tipo: 'area', icon: <Settings size={24} />, desc: 'No logro entregar a tiempo.', color: 'bg-blue-100 text-blue-600' },
    { id: 'finanzas', nombre: 'Finanzas', tipo: 'area', icon: <TrendingUp size={24} />, desc: 'El dinero no alcanza o es un caos.', color: 'bg-emerald-100 text-emerald-600' },
    { id: 'tecnologia', nombre: 'Tecnología', tipo: 'area', icon: <Monitor size={24} />, desc: 'Necesito automatizar sistemas.', color: 'bg-indigo-100 text-indigo-600' }
  ];

  const handleUpdateData = (newData) => {
    updateData(newData);
  };

  if (cargando) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );



  
  // Robust fallbacks to prevent crashes
  // Robust fallbacks to prevent crashes
  const safeOrganigrama = Array.isArray(data?.organigrama) ? data.organigrama : (Array.isArray(organigrama) ? organigrama : [{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null }]);
  const safeRoles = Array.isArray(data?.roles) ? data.roles : (Array.isArray(roles) ? roles : []);

  const nodosConsejo = safeOrganigrama.filter(n => n.tipo === 'consejo');
  const lider = safeOrganigrama.find(n => n.tipo === 'lider');
  const nodosStaff = safeOrganigrama.filter(n => n.tipo === 'staff');
  const areas = safeOrganigrama.filter(n => n.tipo === 'area');
  const funcionarios = safeOrganigrama.filter(n => n.tipo === 'funcionario');

  const updateNodeName = (id, newName) => {
    updateData(prev => ({
      organigrama: (prev.organigrama || safeOrganigrama).map(x => x.id === id ? { ...x, nombre: newName } : x)
    }));
  };
  const exportarImagen = async () => {
    const node = document.getElementById('organigrama-export');
    if (!node) return;
    try {
      const dataUrl = await htmlToImage.toPng(node, { 
        backgroundColor: '#f8fafc',
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = 'organigrama.png';
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert('Error al exportar la imagen');
    }
  };

  const deleteNode = (id) => {
    updateData({ organigrama: safeOrganigrama.filter(x => x.id !== id && x.parentId !== id) });
  };


  const getPasoContent = () => {
    switch(step) {
      case 1: return (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Estructura</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_9" title="Estructura Organizacional" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
            </div>
          </div>
        );
        case 2: return (
        <div className="animate-fade-in p-6 bg-white/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-5xl mx-auto border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Organigrama Estructural</h2>
                <p className="text-slate-500 font-medium font-sans">Diseña tu equipo de trabajo. Define áreas, jerarquías y dependencias.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto justify-center md:justify-start">
              <button 
                onClick={() => setModoVista('lista')} 
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-1 md:flex-none text-center ${modoVista === 'lista' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                📋 Modo Lista (Edición)
              </button>
              <button 
                onClick={() => setModoVista('arbol')} 
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex-1 md:flex-none text-center ${modoVista === 'arbol' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                🌳 Modo Visual (Árbol)
              </button>
            </div>
          </div>

          {modoVista === 'lista' ? (
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col gap-4 w-full">
               <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-2 gap-4 text-center md:text-left">
                 <div>
                   <h3 className="font-bold text-slate-800 text-lg mb-1">Configuración Rápida</h3>
                   <p className="text-slate-500 font-medium text-sm">Agrega, edita y organiza los roles de tu empresa sin problemas de rendimiento. Una vez listos, ve a la vista Árbol.</p>
                 </div>
                 <button onClick={() => setModoVista('arbol')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex gap-2 items-center whitespace-nowrap w-full md:w-auto justify-center">
                    Ver Organigrama <ChevronRight size={18}/>
                 </button>
               </div>

               <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-4 relative">
                   {/* Línea conectora visual opcional */}
                   <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-200 -z-10 hidden md:block"></div>
                   
                   {safeOrganigrama.map((nodo) => {
                     const isCeo = nodo.tipo === 'lider';
                     const isArea = nodo.tipo === 'area';
                     const badgeColor = isCeo ? 'bg-amber-100 text-amber-700 border-amber-200' : isArea ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
                     const icon = isCeo ? <Briefcase size={16} /> : isArea ? <Network size={16} /> : <Users size={16} />;
                     
                     return (
                       <div key={nodo.id} className="flex flex-wrap gap-4 items-center p-4 md:p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all relative z-10 group ml-0 md:ml-2">
                         
                         {/* Indicador de Tipo Visual */}
                         <div className={`p-3 rounded-xl border ${badgeColor} shadow-inner shrink-0 hidden md:flex`}>
                           {icon}
                         </div>

                         <div className="flex flex-col gap-1.5 flex-grow min-w-[200px]">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Nombre / Cargo</label>
                           <input 
                             className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                             value={nodo.nombre || ''}
                             onChange={e => updateNodeName(nodo.id, e.target.value)}
                             placeholder={isCeo ? "Ej: Director General / CEO" : "Ej: Finanzas / Ejecutivo de Ventas"}
                           />
                         </div>

                         <div className="flex flex-col gap-1.5 min-w-[180px]">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Rol en la empresa</label>
                           <select 
                             className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                             value={nodo.tipo}
                             onChange={e => {
                                const nuevoTipo = e.target.value;
                                const parentId = nuevoTipo === 'funcionario' ? (areas[0]?.id || lider?.id || 'ceo') : (nuevoTipo === 'lider' ? null : (lider?.id || 'ceo'));
                                updateData({
                                  organigrama: safeOrganigrama.map(x => x.id === nodo.id ? { ...x, tipo: nuevoTipo, parentId } : x)
                                });
                             }}
                           >
                             <option value="lider">🌟 Dirección (Líder)</option>
                             <option value="area">🏢 Línea (Área/Dpto)</option>
                             <option value="staff">💼 Staff (Asesor/Apoyo)</option>
                             <option value="consejo">⚖️ Consejo Directivo</option>
                             <option value="funcionario">👤 Funcionario/Empleado</option>
                           </select>
                         </div>

                         {!isCeo && (
                           <div className="flex flex-col gap-1.5 min-w-[200px]">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1">Depende de (Jefe directo)</label>
                             <select 
                               className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                               value={nodo.parentId || ''}
                               onChange={e => updateData({
                                 organigrama: safeOrganigrama.map(x => x.id === nodo.id ? { ...x, parentId: e.target.value } : x)
                               })}
                             >
                               <option value="">-- Selecciona --</option>
                               {safeOrganigrama.filter(x => x.id !== nodo.id && (x.tipo === 'lider' || x.tipo === 'area')).map(op => (
                                 <option key={op.id} value={op.id}>{op.nombre || 'Sin nombre'} ({op.tipo === 'lider' ? 'Líder' : 'Área'})</option>
                               ))}
                             </select>
                           </div>
                         )}

                         {!isCeo && (
                           <div className="flex items-center pt-5">
                              <button onClick={() => deleteNode(nodo.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 opacity-50 hover:opacity-100 group-hover:opacity-100" title="Eliminar nodo">
                                <Trash2 size={20} />
                              </button>
                           </div>
                         )}
                       </div>
                     );
                   })}
                 </div>
               </div>
               
               <div className="flex flex-wrap gap-4 mt-6 border-t border-slate-200 pt-6">
                 <button 
                   onClick={() => {
                     const nombresAreas = ["Marketing", "Ventas", "Operaciones", "Finanzas", "RRHH", "Logística"];
                     const randomArea = nombresAreas[Math.floor(Math.random() * nombresAreas.length)];
                     updateData({ organigrama: [...safeOrganigrama, { id: Date.now().toString(), nombre: randomArea, tipo: 'area', parentId: lider?.id || 'ceo' }] });
                   }} 
                   className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-indigo-100 hover:border-indigo-400 hover:shadow-md text-indigo-700 font-black rounded-xl transition-all"
                 >
                   <Network size={18} /> Añadir Área
                 </button>
                 
                 <button 
                   onClick={() => {
                     const nombresFunc = ["Especialista", "Analista", "Coordinador", "Ejecutivo", "Asistente", "Técnico"];
                     const randomFunc = nombresFunc[Math.floor(Math.random() * nombresFunc.length)];
                     updateData({ organigrama: [...safeOrganigrama, { id: Date.now().toString(), nombre: randomFunc, tipo: 'funcionario', parentId: areas[0]?.id || lider?.id || 'ceo' }] });
                   }} 
                   className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-md text-emerald-700 font-black rounded-xl transition-all"
                 >
                   <Users size={18} /> Añadir Funcionario
                 </button>

                 <button onClick={() => setShowExpandModal(true)} className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-xl shadow-md transition-all ml-auto">
                   <TrendingUp size={18} /> Asistente de Crecimiento
                 </button>
               </div>
            </div>
          ) : (
            <div id="organigrama-export" className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center min-h-[750px] relative overflow-x-auto overflow-y-hidden gap-12 w-full">
                <button onClick={exportarImagen} className="absolute right-8 top-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all border-2 border-indigo-400/50">
                  <Download size={18} /> Descargar Imagen
                </button>
              
            {/* Nivel 0: Consejo */}
            {nodosConsejo.length > 0 && (
              <div className="w-full flex justify-center gap-12 relative z-20">
                {nodosConsejo.map(c => (
                  <div key={c.id} className="relative bg-white border-2 border-indigo-100 px-6 py-4 rounded-2xl shadow-sm w-64 text-center">
                    <div className="text-[9px] uppercase font-black tracking-wider text-indigo-500 mb-1 flex items-center justify-center gap-1"><Users size={10} /> Consejo / Asesoría</div>
                    <div className="font-bold text-slate-800 text-sm">{c.nombre || 'Sin Nombre'}</div>
                    {/* Conector hacia abajo */}
                    <div className="absolute left-1/2 -bottom-12 w-px h-12 bg-transparent border-l-2 border-dashed border-slate-300 -z-10"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Nivel 1: Lider y Staff */}
            <div className="relative z-10 w-full flex justify-center items-center gap-16">
              {/* Staff Izquierda */}
              {nodosStaff.slice(0, Math.ceil(nodosStaff.length / 2)).map(s => (
                <div key={s.id} className="relative bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl shadow-sm w-52 text-center">
                    <div className="text-[9px] uppercase font-black tracking-wider text-amber-600 mb-1 flex items-center justify-center gap-1"><FileText size={10} /> Staff / Asistente</div>
                    <div className="font-bold text-amber-800 text-sm text-center">{s.nombre || 'Sin Nombre'}</div>
                    {/* Conector */}
                    <div className="absolute top-1/2 -right-16 w-16 h-px bg-slate-300"></div>
                </div>
              ))}

              {/* Lider */}
              {lider && (
                <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 border border-indigo-800 text-white px-8 py-5 rounded-2xl shadow-xl w-80 text-center z-30">
                  <div className="text-[9px] uppercase font-black text-indigo-200 mb-1 tracking-wider">Dirección General (CEO)</div>
                  <div className="font-black text-xl">{lider.nombre || 'Sin Nombre'}</div>
                  {/* Conector Vertical hacia areas */}
                  <div className="absolute left-1/2 -bottom-12 w-px h-12 bg-indigo-200 -z-10"></div>
                </div>
              )}

              {/* Staff Derecha */}
              {nodosStaff.slice(Math.ceil(nodosStaff.length / 2)).map(s => (
                <div key={s.id} className="relative bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl shadow-sm w-52 text-center">
                    <div className="text-[9px] uppercase font-black tracking-wider text-amber-600 mb-1 flex items-center justify-center gap-1"><FileText size={10} /> Staff / Asistente</div>
                    <div className="font-bold text-amber-800 text-sm text-center">{s.nombre || 'Sin Nombre'}</div>
                    {/* Conector */}
                    <div className="absolute top-1/2 -left-16 w-16 h-px bg-slate-300"></div>
                </div>
              ))}
            </div>

            {/* Nivel 2: Areas y Funcionarios */}
            <div className="relative z-10 w-full flex justify-center overflow-visible">
              <div className="flex justify-center items-start min-w-max pb-32 px-12">
                  {areas.map((area, index) => {
                    const areaFuncionarios = funcionarios.filter(f => f.parentId === area.id);
                    return (
                    <div 
                      key={area.id}
                      className="relative flex flex-col items-center px-4 shrink-0 pt-8"
                    >
                      {/* Conectores horizontales Areas */}
                      {areas.length > 1 && (
                        <>
                          <div className={`absolute top-0 left-0 w-1/2 h-px bg-slate-300 ${index === 0 ? 'hidden' : ''}`}></div>
                          <div className={`absolute top-0 right-0 w-1/2 h-px bg-slate-300 ${index === areas.length - 1 ? 'hidden' : ''}`}></div>
                        </>
                      )}
                      {/* Conector vertical hacia la caja */}
                      <div className="absolute left-1/2 top-0 w-px h-8 bg-slate-300 -translate-x-1/2"></div>
                      
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm w-56">
                        <div className="bg-slate-100/80 px-4 py-3 rounded-2xl relative">
                          <div className="font-bold text-slate-700 text-sm text-center">{area.nombre || 'Sin Nombre'}</div>
                          <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-400 text-center">Área</div>
                        </div>
                      </div>
                      
                      {areaFuncionarios.length > 0 && (
                        <div className="flex flex-col items-center mt-2 relative w-full">
                          <div className="w-px h-6 bg-slate-300"></div>
                          <div className="flex justify-center w-full">
                            {areaFuncionarios.map((f, i) => (
                              <div key={f.id} className="relative flex flex-col items-center w-[100px] px-1 pt-6">
                                {/* Conectores horizontales Funcionarios */}
                                {areaFuncionarios.length > 1 && (
                                  <>
                                    <div className={`absolute top-0 left-0 w-1/2 h-px bg-slate-300 ${i === 0 ? 'hidden' : ''}`}></div>
                                    <div className={`absolute top-0 right-0 w-1/2 h-px bg-slate-300 ${i === areaFuncionarios.length - 1 ? 'hidden' : ''}`}></div>
                                  </>
                                )}
                                {/* Conector vertical hacia la caja del funcionario */}
                                <div className="absolute top-0 left-1/2 w-px h-6 bg-slate-300 -translate-x-1/2"></div>
                                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-2 flex flex-col gap-1.5 w-full z-10">
                                  <div className="flex items-center justify-center relative">
                                    <Users size={10} className="text-indigo-400 absolute left-0" />
                                    <div className="text-center text-xs font-bold text-slate-700 pl-3 break-words w-full">{f.nombre || 'Sin Nombre'}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    )
                  })}
              </div>
            </div>
            
            {/* Fondo decorativo (removido por rendimiento en Firefox) */}
            <div className="absolute inset-0 bg-slate-50 opacity-40"></div>
          </div>
          )}
          
        <div className="flex flex-wrap gap-4 mt-8 w-full justify-center">
          <button onClick={() => {
            if(window.confirm('¿Estás seguro de resetear todo el organigrama?')) {
              updateData({ organigrama: [{ id: 'ceo', nombre: 'Gerente General', tipo: 'lider', parentId: null }] });
            }
          }} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-red-100 hover:bg-red-50 text-red-500 font-bold rounded-2xl shadow-sm transition-all active:scale-95">
            <Trash2 size={20} />
            Limpiar Todo
          </button>
        </div>
          
          {/* Modal de Expansión Estratégica */}
          <div className="animate-presence-removed">
            {showExpandModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
                <div>
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-3xl font-black text-slate-800">Crecimiento Estratégico</h3>
                      <p className="text-slate-500 font-medium mt-1">¿Qué problema urgente necesitas delegar para que la empresa crezca?</p>
                    </div>
                    <button onClick={() => setShowExpandModal(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opcionesExpansion.map((opcion) => {
                      const yaExiste = safeOrganigrama.some(a => (a.nombre || '').toLowerCase().includes(opcion.nombre.split(' ')[0].toLowerCase()));
                      
                      return (
                        <button
                          key={opcion.id}
                          disabled={yaExiste}
                          onClick={() => {
                            updateData({ organigrama: [...safeOrganigrama, { id: Date.now().toString() + opcion.id, nombre: opcion.nombre, tipo: opcion.tipo, parentId: lider?.id }] });
                            setShowExpandModal(false);
                          }}
                          className={`text-left p-6 rounded-2xl border-2 transition-all flex gap-5 items-start ${
                            yaExiste 
                              ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed' 
                              : `bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 group`
                          }`}
                        >
                          <div className={`p-4 rounded-xl ${opcion.color} ${yaExiste ? 'grayscale' : 'group-hover:scale-110 transition-transform'}`}>
                            {opcion.icon}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1">{opcion.nombre}</h4>
                            <p className="text-sm text-slate-500 font-medium">"{opcion.desc}"</p>
                            {yaExiste && <span className="inline-block mt-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">Ya tienes este nodo</span>}
                          </div>
                        </button>
                      );
                    })}
                    
                    {/* Opción Personalizada */}
                    <button
                      onClick={() => {
                        updateData({ organigrama: [...safeOrganigrama, { id: Date.now().toString(), nombre: '', tipo: 'area', parentId: lider?.id }] });
                        setShowExpandModal(false);
                      }}
                      className="text-left p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md transition-all flex items-center justify-center col-span-1 md:col-span-2 group"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-3 bg-white rounded-full text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-100 transition-colors shadow-sm">
                          <Plus size={24} />
                        </div>
                        <span className="font-bold text-slate-600 group-hover:text-indigo-600">Crear Área Personalizada</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in p-6 bg-white/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-5xl mx-auto border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Roles y Responsabilidades</h2>
              <p className="text-slate-500 font-medium">Describe las funciones de cada miembro de tu equipo.</p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeOrganigrama.map((nodo) => {
              const rol = safeRoles.find(r => r.id === nodo.id || r.areaId === nodo.id) || { id: nodo.id, cargo: nodo.nombre, responsabilidades: '' };
              const respText = Array.isArray(rol.responsabilidades) ? rol.responsabilidades.join(', ') : (rol.responsabilidades || '');

              return (
                <div key={nodo.id} className="relative flex flex-col gap-4 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all">
                  {/* Botón Eliminar solo para los que no son líder principal */}
                  {nodo.tipo !== 'lider' && (
                    <button 
                      onClick={() => {
                        updateData(prev => ({ 
                          roles: (prev.roles || safeRoles).filter(r => r.id !== nodo.id && r.areaId !== nodo.id),
                          organigrama: (prev.organigrama || safeOrganigrama).filter(org => org.id !== nodo.id && org.parentId !== nodo.id)
                        }));
                      }} 
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                      title="Eliminar rol"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Cargo / Puesto</label>
                    <input 
                      className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder-slate-300" 
                      value={nodo.nombre || ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData(prev => {
                          const prevOrg = prev.organigrama || safeOrganigrama;
                          const prevRoles = prev.roles || safeRoles;
                          
                          const newOrg = prevOrg.map(org => org.id === nodo.id ? { ...org, nombre: val } : org);
                          const exists = prevRoles.find(r => r.id === nodo.id || r.areaId === nodo.id);
                          const newRoles = exists 
                            ? prevRoles.map(r => (r.id === nodo.id || r.areaId === nodo.id) ? { ...r, cargo: val } : r)
                            : [...prevRoles, { id: nodo.id, cargo: val, responsabilidades: respText }];
                            
                          return { organigrama: newOrg, roles: newRoles };
                        });
                      }} 
                      placeholder="Ej: Encargado de Ventas" 
                    />
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Responsabilidades Principales</label>
                    <InlineTextarea 
                      className="w-full flex-grow bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none placeholder-slate-300 min-h-[100px]" 
                      value={respText} 
                      onChange={(val) => {
                        updateData(prev => {
                          const prevRoles = prev.roles || safeRoles;
                          const exists = prevRoles.find(r => r.id === nodo.id || r.areaId === nodo.id);
                          const newRoles = exists 
                            ? prevRoles.map(r => (r.id === nodo.id || r.areaId === nodo.id) ? { ...r, responsabilidades: val } : r)
                            : [...prevRoles, { id: nodo.id, cargo: nodo.nombre, responsabilidades: val }];
                          return { roles: newRoles };
                        });
                      }} 
                      placeholder={getDefaultFunciones(nodo.nombre || '')} 
                    />
                  </div>
                </div>
              );
            })}
            
            <div onClick={() => {
                const newId = Date.now().toString();
                const ceoId = safeOrganigrama.find(n => n.tipo === 'lider')?.id || null;
                updateData({ 
                  organigrama: [...safeOrganigrama, { id: newId, nombre: '', tipo: 'funcionario', parentId: ceoId }],
                  roles: [...safeRoles, { id: newId, cargo: '', responsabilidades: '' }] 
                });
              }}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600 transition-all cursor-pointer min-h-[160px] opacity-70 hover:opacity-100"
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                <Plus size={24} />
              </div>
              <span className="font-bold text-base">Añadir Nuevo Rol</span>
              <span className="text-xs opacity-70 mt-1">Define un nuevo cargo para tu empresa</span>
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="animate-fade-in p-6 bg-white/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-5xl mx-auto border border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                <Sparkles size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Resumen y Diagnóstico IA</h2>
                <p className="text-slate-500 font-medium">Síntesis inteligente de la estructura de tu empresa, roles detallados y clima organizacional.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => generarResumenFase9(true)}
                disabled={isGeneratingResumen}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-2xl shadow-md transition-all text-sm active:scale-95"
                title="Generar un organigrama completo de 7 puestos e importar todos sus roles"
              >
                <Network size={18} />
                Reconstruir Organigrama Completo con IA
              </button>
              <button
                onClick={() => generarResumenFase9(false)}
                disabled={isGeneratingResumen}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-2xl shadow-md transition-all text-sm active:scale-95"
              >
                <RefreshCw size={18} className={isGeneratingResumen ? "animate-spin" : ""} />
                {isGeneratingResumen ? "Generando con IA..." : "Regenerar Diagnóstico con IA"}
              </button>
            </div>
          </div>

          {isGeneratingResumen && (
            <div className="flex flex-col items-center justify-center p-12 bg-indigo-50/50 rounded-3xl border border-indigo-100 mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
              <p className="font-bold text-indigo-900 text-lg">Analizando las necesidades de tu empresa...</p>
              <p className="text-indigo-600 text-sm mt-1">Diseñando un organigrama completo y el desglose detallado de roles y funciones.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Card 1: Estructura Organizacional */}
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-3xl shadow-sm hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl font-bold">🏢</div>
                <h3 className="font-black text-slate-800 text-lg">Resumen de Estructura Organizacional</h3>
              </div>
              <InlineTextarea
                className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-h-[160px]"
                value={data.resumen_estructura || ''}
                onChange={(val) => updateData({ resumen_estructura: val })}
                placeholder="Diagnóstico de la estructura de la empresa..."
              />
            </div>

            {/* Card 2: Roles y Responsabilidades */}
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-3xl shadow-sm hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl font-bold">👥</div>
                <h3 className="font-black text-slate-800 text-lg">Desglose Detallado de Roles y Funciones</h3>
              </div>
              <InlineTextarea
                className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-h-[260px] whitespace-pre-line font-sans"
                value={data.resumen_roles || ''}
                onChange={(val) => updateData({ resumen_roles: val })}
                placeholder="Evaluación de cargos y distribución de tareas detallada..."
              />
            </div>

            {/* Card 3: Clima Organizacional y Cultura */}
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-3xl shadow-sm hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold">🌟</div>
                <h3 className="font-black text-slate-800 text-lg">Clima Organizacional y Propuesta de Valor al Colaborador</h3>
              </div>
              <InlineTextarea
                className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-h-[140px]"
                value={data.resumen_clima_cultura || ''}
                onChange={(val) => updateData({ resumen_clima_cultura: val })}
                placeholder="Estrategias de clima laboral y motivación de equipo..."
              />
            </div>
          </div>
        </div>
      );
      default: return <div>Paso no definido</div>;
    }
  };

  return (
    <PasoLayout 
      faseTitle="Fase 9: Estructura Organizacional"
      pasoActual={step}
      totalPasos={3}
      tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <Network size={18} />, label: 'Organigrama' },
          { id: 3, icon: <Briefcase size={18} />, label: 'Roles y Funciones' },
          { id: 4, icon: <Sparkles size={18} />, label: 'Resumen IA' }
        ]}
      onTabClick={(id) => {
        irAPaso(id);
      }}
      onSiguiente={() => step < 4 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 
          ? "La organización es la base del éxito. Empieza definiendo los pilares y áreas principales de tu empresa." 
          : step === 2 
            ? "Ahora, dale claridad a cada área definiendo las responsabilidades. ¡Un equipo que sabe qué hacer es imparable!" 
            : "¡Excelente! Aquí tienes la síntesis IA de la estructura y roles de tu negocio. Revisa los detalles antes de continuar."
      }
      guardando={guardando}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>
          {getPasoContent()}
        </div>
    </PasoLayout>
  );
  

};

export default Fase9_Estructura;
