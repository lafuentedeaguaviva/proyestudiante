import React, { useState, useEffect } from 'react';
import YoutubePlayer from '../components/ui/YoutubePlayer';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaseModel } from '../models/FaseModel';
import PasoLayout from '../layouts/PasoLayout';
import SplashScreenMentor from '../components/ui/SplashScreenMentor';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StepNavigation from '../components/ui/StepNavigation';
import { useFase8Controller } from '../controllers/useFase8Controller';
import { generarPasosPersonalizadoIA } from '../services/api';
import { Play, CheckCircle, GripVertical, Settings, Sparkles, Box, Truck, Search, Eye, X, HelpCircle, Activity, Download, ArrowDownSquare, ArrowUpSquare, ArrowRight, Briefcase, Eraser, Video, List, CheckSquare, Network, Map, CreditCard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import * as htmlToImage from 'html-to-image';

const Fase8_Operacion = () => {
  const { 
    cargando, step, irAPaso, siguientePaso, pasoAnterior,
    globalData, setGlobalData, guardando,
    showSplash, setShowSplash,
    selectedTool, setSelectedTool,
    draggedItem, setDraggedItem,
    showIAPrompt, setShowIAPrompt,
    promptIA, setPromptIA,
    cargandoIA, setCargandoIA,
    verificando, setVerificando,
    resultadoVerificacion, setResultadoVerificacion,
    mostrarDiagrama, setMostrarDiagrama,
    handleGenerarIA, handleVerificarDiagrama
  , setPendingSave } = useFase8Controller();

  const data = globalData;
  const updateGlobalData = (newData) => {
    setGlobalData(newData);
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };
  const [confirmDialog, setConfirmDialog] = useState(null);

  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);

  
  const finishPhase = async () => {
    setIsFinishing(true);
    try {
      if(typeof setPendingSave === 'function') setPendingSave(true);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
      await Promise.race([
        FaseModel.guardarDatos(8, 'operacion', data),
        timeoutPromise
      ]);
      await FaseModel.actualizarProgreso(9, 1);
      navigate('/fase/9/intro');
    } catch (err) {
      console.error(err);
      navigate('/fase/9/intro');
    }
  };

  const handleSiguienteClick = async () => {
    if (step === 3 && data.pasosProduccion?.filter(p => !p.categoria).length > 0) {
      setConfirmDialog({
        title: "Pasos sin clasificar",
        message: "Aún tienes pasos sin categoría. ¿Seguro que quieres avanzar sin jugar el desafío?",
        confirmText: "Avanzar",
        cancelText: "Corregir",
        onConfirm: () => {
          setConfirmDialog(null);
          siguientePaso();
        },
        onCancel: () => setConfirmDialog(null)
      });
      return;
    }
    
    if (step === 5) {
      if (!mostrarDiagrama) {
        const pasosClasificados = data.pasosProduccion?.filter(p => p.categoria) || [];
        if (pasosClasificados.length < (data.pasosProduccion?.length || 0)) {
          alert("Debes clasificar todos los pasos antes de continuar.");
          return;
        }

        const resultado = evaluarClasificacionProcesosLocal(pasosClasificados);
        setResultadoVerificacion(resultado);
        
        const todosCorrectos = data.pasosProduccion?.every(p => resultado[p.id]?.correcto);
        if (todosCorrectos) {
          setMostrarDiagrama(true);
        } else {
          setConfirmDialog({
            title: "Revisar Clasificación",
            message: "Se han detectado sugerencias en tu clasificación. ¿Deseas revisarlas o continuar al diagrama de todas formas?",
            confirmText: "Continuar",
            cancelText: "Corregir",
            onConfirm: () => {
              setConfirmDialog(null);
              setMostrarDiagrama(true);
            },
            onCancel: () => setConfirmDialog(null)
          });
        }
        return;
      } else if (!data.diagramaVerificado) {
        setConfirmDialog({
          title: "Diagrama Incompleto",
          message: "Tu diagrama no tiene 100% de precisión aún. ¿Seguro que quieres avanzar?",
          confirmText: "Avanzar",
          cancelText: "Corregir",
          onConfirm: () => {
            setConfirmDialog(null);
            finishPhase();
          },
          onCancel: () => setConfirmDialog(null)
        });
        return;
      } else {
        finishPhase();
        return;
      }
    }
    
    if (step < 5) {
      siguientePaso();
    } else {
      finishPhase();
    }
  };

  if (cargando) return <LoadingSpinner text="Cargando datos..." className="min-h-screen" />;



  const renderVideoStep = (titulo) => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{titulo}</h2>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <YoutubePlayer videoKey="video_fase_8" title={titulo} fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      </div>
    </div>
  );

  // Drag and drop para categorías (Paso 5)
  const handleDragStart = (item) => setDraggedItem(item);
  const handleDropToCategory = (categoria) => {
    if (draggedItem) {
      const n = data.pasosProduccion.map(p => p.id === draggedItem.id ? { ...p, categoria } : p);
      updateGlobalData({ pasosProduccion: n });
      // Limpiar validación si lo mueve de nuevo
      setResultadoVerificacion(prev => {
        const newRes = { ...prev };
        delete newRes[draggedItem.id];
        return newRes;
      });
      setDraggedItem(null);
    }
  };

  const evaluarClasificacionProcesosLocal = (pasos) => {
    const resultado = {};
    pasos.forEach(p => {
      let category = p.categoriaCorrecta;
      
      // Fallback a palabras clave si no está predefinida por la IA (p.ej. pasos manuales)
      if (!category) {
        const text = (p.texto || '').toLowerCase();
        category = 'operacion'; // default
        
        if (text.includes('almacen') || text.includes('guardar') || text.includes('bodega') || text.includes('stock') || text.includes('comprar') || text.includes('adquirir') || text.includes('insumo') || text.includes('materia') || text.includes('proveedor')) {
          category = 'almacenamiento';
        } else if (text.includes('transport') || text.includes('enviar') || text.includes('llevar') || text.includes('mover') || text.includes('distrib') || text.includes('entregar') || text.includes('delivery') || text.includes('traslad') || text.includes('viaje')) {
          category = 'transporte';
        } else if (text.includes('revisar') || text.includes('verificar') || text.includes('inspecciona') || text.includes('calidad') || text.includes('medir') || text.includes('probar') || text.includes('inventar') || text.includes('chequear')) {
          category = 'inspeccion';
        }
      }
      
      const correcto = p.categoria === category;
      let sugerencia = "";
      if (!correcto) {
        if (category === 'almacenamiento') sugerencia = "Sugerencia: Almacenamiento (guardar, comprar, insumos)";
        else if (category === 'transporte') sugerencia = "Sugerencia: Transporte (mover, enviar, entregar)";
        else if (category === 'inspeccion') sugerencia = "Sugerencia: Inspección (revisar, medir, verificar)";
        else sugerencia = "Sugerencia: Operación (fabricar, preparar, hacer)";
      }
      resultado[p.id] = { correcto, sugerencia };
    });
    return resultado;
  };

  const renderDiagramaFlujo = () => {
    const handleDownload = async () => {
      const node = document.getElementById('diagrama-procesos-export');
      if (!node) return;
      try {
        const dataUrl = await htmlToImage.toPng(node, { 
          backgroundColor: '#f8fafc',
          pixelRatio: 2
        });
        const link = document.createElement('a');
        link.download = 'diagrama_de_procesos.png';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.error(e);
      }
    };

    const getSymbol = (type, isActive) => {
      const baseSize = "w-8 h-8 mx-auto transition-all duration-300 ";
      const activeScale = isActive ? "scale-125 shadow-md " : "scale-100 opacity-40 ";

      if (type === 'operacion') {
        // Círculo
        return (
          <div className={baseSize + activeScale + (isActive ? "bg-green-600" : "border-4 border-slate-400 bg-transparent")} style={{ borderRadius: '50%' }}></div>
        );
      }
      if (type === 'inspeccion') {
        // Cuadrado
        return (
          <div className={baseSize + activeScale + (isActive ? "bg-purple-600" : "border-4 border-slate-400 bg-transparent")}></div>
        );
      }
      if (type === 'transporte') {
        // Flecha derecha (SVG)
        return (
          <div className={baseSize + activeScale + " flex items-center justify-center"}>
            <svg viewBox="0 0 24 24" fill="none" stroke={isActive ? "#2563eb" : "#94a3b8"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        );
      }
      if (type === 'almacenamiento') {
        // Triángulo invertido (usando SVG para que soporte fill/stroke limpio)
        return (
          <div className={baseSize + activeScale + " flex items-center justify-center"}>
            <svg viewBox="0 0 24 24" fill={isActive ? "#ea580c" : "none"} stroke={isActive ? "#ea580c" : "#94a3b8"} strokeWidth="3" strokeLinejoin="round" className="w-full h-full">
              <polygon points="22 3 2 3 12 21 22 3" />
            </svg>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="animate-fade-in mt-4 w-full flex flex-col items-center">
        <div 
          id="diagrama-procesos-export" 
          className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm w-full max-w-4xl"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center flex items-center justify-center gap-3"><Activity className="text-blue-600" /> Diagrama de Procesos ASME</h3>
          
          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b border-slate-200 font-bold w-1/2">Descripción de la Operación</th>
                  <th className="p-4 border-b border-slate-200 font-bold text-center w-1/8">Operación</th>
                  <th className="p-4 border-b border-slate-200 font-bold text-center w-1/8">Inspección</th>
                  <th className="p-4 border-b border-slate-200 font-bold text-center w-1/8">Transporte</th>
                  <th className="p-4 border-b border-slate-200 font-bold text-center w-1/8">Almacenaje</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {data.pasosProduccion.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 align-middle">
                      <div className="flex gap-3">
                        <span className="font-bold text-slate-400 mt-0.5">{i+1}.</span>
                        <span className="text-slate-800 font-medium">{p.texto}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-center">
                      {getSymbol('operacion', p.categoria === 'operacion')}
                    </td>
                    <td className="p-4 align-middle text-center">
                      {getSymbol('inspeccion', p.categoria === 'inspeccion')}
                    </td>
                    <td className="p-4 align-middle text-center">
                      {getSymbol('transporte', p.categoria === 'transporte')}
                    </td>
                    <td className="p-4 align-middle text-center">
                      {getSymbol('almacenamiento', p.categoria === 'almacenamiento')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-10 mb-6">
          <button onClick={handleDownload} className="bg-white border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 font-bold rounded-xl px-8 py-4 text-lg transition-all flex items-center gap-3 shadow-md hover:shadow-lg">
            <Download size={26} className="text-blue-600" /> Descargar como PNG
          </button>
        </div>
      </div>
    );
  };

  // Constructor de Layout (Paso 7)
  const layoutTools = [
    // Puertas direccionales (en los 4 lados)
    { 
      id: 'puerta_arr', type: 'structure', nombre: 'Puerta Arriba (↑)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-amber-800 fill-transparent stroke-[8] -rotate-180">
          <line x1="10" y1="90" x2="90" y2="90" strokeWidth="10" />
          <line x1="10" y1="90" x2="10" y2="10" />
          <path d="M 10 10 A 80 80 0 0 1 90 90" strokeDasharray="6,6" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-white', border: 'border-slate-200'
    },
    { 
      id: 'puerta_aba', type: 'structure', nombre: 'Puerta Abajo (↓)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-amber-800 fill-transparent stroke-[8]">
          <line x1="10" y1="90" x2="90" y2="90" strokeWidth="10" />
          <line x1="10" y1="90" x2="10" y2="10" />
          <path d="M 10 10 A 80 80 0 0 1 90 90" strokeDasharray="6,6" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-white', border: 'border-slate-200'
    },
    { 
      id: 'puerta_izq', type: 'structure', nombre: 'Puerta Izquierda (←)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-amber-800 fill-transparent stroke-[8] -rotate-90">
          <line x1="10" y1="90" x2="90" y2="90" strokeWidth="10" />
          <line x1="10" y1="90" x2="10" y2="10" />
          <path d="M 10 10 A 80 80 0 0 1 90 90" strokeDasharray="6,6" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-white', border: 'border-slate-200'
    },
    { 
      id: 'puerta_der', type: 'structure', nombre: 'Puerta Derecha (→)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-amber-800 fill-transparent stroke-[8] rotate-90">
          <line x1="10" y1="90" x2="90" y2="90" strokeWidth="10" />
          <line x1="10" y1="90" x2="10" y2="10" />
          <path d="M 10 10 A 80 80 0 0 1 90 90" strokeDasharray="6,6" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-white', border: 'border-slate-200'
    },
    // Ventanas direccionales (en los 4 lados)
    { 
      id: 'ventana_arr', type: 'structure', nombre: 'Ventana Arriba (↑)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-sky-600 stroke-[8]">
          <rect x="5" y="10" width="90" height="25" fill="#bae6fd" />
          <line x1="5" y1="22" x2="95" y2="22" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-sky-50', border: 'border-slate-200'
    },
    { 
      id: 'ventana_aba', type: 'structure', nombre: 'Ventana Abajo (↓)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-sky-600 stroke-[8]">
          <rect x="5" y="65" width="90" height="25" fill="#bae6fd" />
          <line x1="5" y1="77" x2="95" y2="77" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-sky-50', border: 'border-slate-200'
    },
    { 
      id: 'ventana_izq', type: 'structure', nombre: 'Ventana Izquierda (←)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-sky-600 stroke-[8]">
          <rect x="10" y="5" width="25" height="90" fill="#bae6fd" />
          <line x1="22" y1="5" x2="22" y2="95" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-sky-50', border: 'border-slate-200'
    },
    { 
      id: 'ventana_der', type: 'structure', nombre: 'Ventana Derecha (→)', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-sky-600 stroke-[8]">
          <rect x="65" y="5" width="25" height="90" fill="#bae6fd" />
          <line x1="77" y1="5" x2="77" y2="95" strokeWidth="4" />
        </svg>
      ),
      bgColor: 'bg-sky-50', border: 'border-slate-200'
    },
    // Direcciones del flujo de procesos
    { 
      id: 'flujo_der', type: 'flow', nombre: 'Flujo →', 
      icon: <ArrowRight size={20} className="text-blue-600" />, 
      bgColor: 'bg-blue-50/50', border: 'border-blue-300',
      customRender: (
        <div className="w-full h-full flex items-center justify-center bg-blue-50/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 animate-pulse">
            <line x1="4" y1="12" x2="20" y2="12" />
            <polyline points="14 6 20 12 14 18" />
          </svg>
        </div>
      )
    },
    { 
      id: 'flujo_izq', type: 'flow', nombre: 'Flujo ←', 
      icon: <ArrowRight size={20} className="text-blue-600 rotate-180" />, 
      bgColor: 'bg-blue-50/50', border: 'border-blue-300',
      customRender: (
        <div className="w-full h-full flex items-center justify-center bg-blue-50/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 animate-pulse">
            <line x1="20" y1="12" x2="4" y2="12" />
            <polyline points="10 6 4 12 10 18" />
          </svg>
        </div>
      )
    },
    { 
      id: 'flujo_arr', type: 'flow', nombre: 'Flujo ↑', 
      icon: <ArrowRight size={20} className="text-blue-600 -rotate-90" />, 
      bgColor: 'bg-blue-50/50', border: 'border-blue-300',
      customRender: (
        <div className="w-full h-full flex items-center justify-center bg-blue-50/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 animate-pulse">
            <line x1="12" y1="20" x2="12" y2="4" />
            <polyline points="6 10 12 4 18 10" />
          </svg>
        </div>
      )
    },
    { 
      id: 'flujo_aba', type: 'flow', nombre: 'Flujo ↓', 
      icon: <ArrowRight size={20} className="text-blue-600 rotate-90" />, 
      bgColor: 'bg-blue-50/50', border: 'border-blue-300',
      customRender: (
        <div className="w-full h-full flex items-center justify-center bg-blue-50/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 animate-pulse">
            <line x1="12" y1="4" x2="12" y2="20" />
            <polyline points="6 14 12 20 18 14" />
          </svg>
        </div>
      )
    },
    // Áreas de Negocios
    { 
      id: 'area_admin', type: 'area', nombre: 'Admin / Caja', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-emerald-700 fill-emerald-50 stroke-[6]">
          <rect x="15" y="30" width="70" height="40" rx="4" />
          <rect x="35" y="75" width="30" height="10" rx="2" />
          <line x1="50" y1="70" x2="50" y2="75" />
          <rect x="30" y="40" width="40" height="20" rx="2" />
          <line x1="30" y1="60" x2="70" y2="60" />
        </svg>
      ), 
      bgColor: 'bg-emerald-100/60', border: 'border-emerald-400 border-2 text-emerald-800 font-bold',
      customRender: (
        <div className="w-full h-full bg-emerald-100/80 border-2 border-emerald-400 flex flex-col items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-7 h-7 stroke-emerald-800 fill-emerald-50/50 stroke-[6] mb-0.5">
            <rect x="15" y="30" width="70" height="40" rx="4" />
            <rect x="35" y="75" width="30" height="10" rx="2" />
            <line x1="50" y1="70" x2="50" y2="75" />
            <rect x="30" y="40" width="40" height="20" rx="2" />
          </svg>
          <span className="text-[7.5px] font-black text-emerald-900 uppercase tracking-tight text-center leading-none">Admin / Caja</span>
        </div>
      )
    },
    { 
      id: 'area_prod', type: 'area', nombre: 'Producción / Taller', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-orange-700 fill-orange-50 stroke-[6]">
          <rect x="10" y="20" width="80" height="30" rx="3" />
          <line x1="35" y1="20" x2="35" y2="50" />
          <line x1="65" y1="20" x2="65" y2="50" />
          <circle cx="30" cy="70" r="12" />
          <circle cx="70" cy="70" r="12" />
          <line x1="30" y1="70" x2="70" y2="70" />
        </svg>
      ), 
      bgColor: 'bg-orange-100/60', border: 'border-orange-400 border-2 text-orange-800 font-bold',
      customRender: (
        <div className="w-full h-full bg-orange-100/80 border-2 border-orange-400 flex flex-col items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-7 h-7 stroke-orange-800 fill-orange-50/50 stroke-[6] mb-0.5">
            <rect x="10" y="20" width="80" height="30" rx="3" />
            <line x1="35" y1="20" x2="35" y2="50" />
            <circle cx="30" cy="70" r="10" />
            <circle cx="70" cy="70" r="10" />
          </svg>
          <span className="text-[7.5px] font-black text-orange-900 uppercase tracking-tight text-center leading-none">Producción</span>
        </div>
      )
    },
    { 
      id: 'area_almacen', type: 'area', nombre: 'Almacén', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-amber-800 fill-amber-50 stroke-[6]">
          <rect x="10" y="10" width="80" height="80" rx="5" />
          <line x1="10" y1="36" x2="90" y2="36" />
          <line x1="10" y1="63" x2="90" y2="63" />
          <rect x="20" y="18" width="20" height="12" />
          <rect x="50" y="18" width="30" height="12" />
        </svg>
      ), 
      bgColor: 'bg-amber-100/60', border: 'border-amber-400 border-2 text-amber-900 font-bold',
      customRender: (
        <div className="w-full h-full bg-amber-100/80 border-2 border-amber-400 flex flex-col items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-7 h-7 stroke-amber-900 fill-amber-50/50 stroke-[6] mb-0.5">
            <rect x="10" y="10" width="80" height="80" rx="5" />
            <line x1="10" y1="36" x2="90" y2="36" />
            <line x1="10" y1="63" x2="90" y2="63" />
          </svg>
          <span className="text-[7.5px] font-black text-amber-900 uppercase tracking-tight text-center leading-none">Almacén</span>
        </div>
      )
    },
    { 
      id: 'area_ventas', type: 'area', nombre: 'Ventas / Showroom', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-indigo-700 fill-indigo-50 stroke-[6]">
          <circle cx="30" cy="35" r="18" />
          <circle cx="70" cy="35" r="18" />
          <rect x="15" y="70" width="70" height="20" rx="4" />
        </svg>
      ), 
      bgColor: 'bg-indigo-100/60', border: 'border-indigo-400 border-2 text-indigo-800 font-bold',
      customRender: (
        <div className="w-full h-full bg-indigo-100/80 border-2 border-indigo-400 flex flex-col items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-7 h-7 stroke-indigo-800 fill-indigo-50/50 stroke-[6] mb-0.5">
            <circle cx="30" cy="35" r="15" />
            <circle cx="70" cy="35" r="15" />
            <rect x="15" y="70" width="70" height="20" rx="4" />
          </svg>
          <span className="text-[7.5px] font-black text-indigo-900 uppercase tracking-tight text-center leading-none">Ventas</span>
        </div>
      )
    },
    { 
      id: 'area_espera', type: 'area', nombre: 'Recepción / Espera', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-teal-700 fill-teal-50 stroke-[6]">
          <circle cx="50" cy="50" r="12" />
          <rect x="10" y="40" width="16" height="20" rx="3" />
          <rect x="74" y="40" width="16" height="20" rx="3" />
          <rect x="35" y="10" width="30" height="16" rx="3" />
        </svg>
      ), 
      bgColor: 'bg-teal-100/60', border: 'border-teal-400 border-2 text-teal-800 font-bold',
      customRender: (
        <div className="w-full h-full bg-teal-100/80 border-2 border-teal-400 flex flex-col items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-7 h-7 stroke-teal-800 fill-teal-50/50 stroke-[6] mb-0.5">
            <circle cx="50" cy="50" r="10" />
            <rect x="10" y="38" width="16" height="24" rx="3" />
            <rect x="74" y="38" width="16" height="24" rx="3" />
          </svg>
          <span className="text-[7.5px] font-black text-teal-900 uppercase tracking-tight text-center leading-none">Recepción</span>
        </div>
      )
    },
    { 
      id: 'area_banos', type: 'area', nombre: 'Servicios / Baños', 
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-purple-700 fill-purple-50 stroke-[6]">
          <ellipse cx="50" cy="65" rx="15" ry="20" />
          <rect x="32" y="32" width="36" height="15" rx="3" />
          <circle cx="50" cy="18" r="10" />
        </svg>
      ), 
      bgColor: 'bg-purple-100/60', border: 'border-purple-400 border-2 text-purple-800 font-bold',
      customRender: (
        <div className="w-full h-full bg-purple-100/80 border-2 border-purple-400 flex flex-col items-center justify-center p-0.5">
          <svg viewBox="0 0 100 100" className="w-7 h-7 stroke-purple-800 fill-purple-50/50 stroke-[6] mb-0.5">
            <ellipse cx="50" cy="65" rx="12" ry="18" />
            <rect x="32" y="32" width="36" height="15" rx="3" />
          </svg>
          <span className="text-[7.5px] font-black text-purple-900 uppercase tracking-tight text-center leading-none">Servicios</span>
        </div>
      )
    },
    { 
      id: 'borrador', nombre: 'Borrador', 
      icon: <Eraser size={20} className="text-slate-500" />, 
      bgColor: 'bg-white', border: 'border-slate-200 border border-dashed',
      customRender: null
    }
  ];

  const handleCellClick = (idx) => {
    let newGrid = [...data.cuadriculaLayout];
    // Asegurar tamaño si viene de una versión anterior
    if (newGrid.length < 36) {
      newGrid = Array(36).fill(null);
    }
    
    // Si la celda está vacía o es un string antiguo (de versiones anteriores), inicializar como objeto
    let cellObj = newGrid[idx];
    if (!cellObj || typeof cellObj !== 'object') {
      cellObj = { areaId: null, flowId: null, structureId: null };
    }
    
    if (selectedTool === 'borrador') {
      newGrid[idx] = null;
    } else {
      const tool = layoutTools.find(t => t.id === selectedTool);
      if (tool) {
        if (tool.type === 'area') {
          cellObj = { ...cellObj, areaId: tool.id };
        } else if (tool.type === 'flow') {
          cellObj = { ...cellObj, flowId: tool.id };
        } else if (tool.type === 'structure') {
          cellObj = { ...cellObj, structureId: tool.id };
        }
        newGrid[idx] = cellObj;
      }
    }
    updateGlobalData({ cuadriculaLayout: newGrid });
  };


  // IA Methods
  const prepararPromptIA = async () => {
    setCargandoIA(true);
    setShowIAPrompt(true);
    try {
      const tryParse = (raw) => {
        if (!raw) return {};
        if (typeof raw === 'object') return raw;
        try { return JSON.parse(raw); } catch { return {}; }
      };

      const [f1Raw, f4Raw] = await Promise.all([
        FaseModel.obtenerDatosFase(1),
        FaseModel.obtenerDatosFase(4)
      ]);

      const f1 = tryParse(f1Raw?.idea_ganadora);
      const f4 = tryParse(f4Raw?.diseno_producto);

      const idea = f1?.idea || f4?.nombreProducto || 'Mi emprendimiento';
      const publico = f1?.protagonista || 'mis clientes';
      const detalles = f4?.descripcion || f4?.paraQueSirve || 'sin diseño previo';

      const defaultPrompt = `Tengo un negocio enfocado en: "${idea}". 
Ayudo a: "${publico}". 
Detalles adicionales de mi producto/servicio: "${detalles}".

Por favor, enumera los pasos lógicos, ordenados y secuenciales que debo seguir en el día a día para producir este bien o entregar este servicio. 

IMPORTANTE: Asegúrate de incluir pasos variados que más adelante se puedan clasificar en los 4 tipos de procesos (NO los clasifiques tú, solo redacta la acción natural):
- Almacenamiento (ej. guardar, inventariar, almacenar insumos)
- Operación (ej. fabricar, procesar, crear, preparar)
- Transporte (ej. llevar, enviar, distribuir, mover)
- Inspección (ej. revisar calidad, verificar, medir)

Enumera los pasos desde la preparación inicial hasta la entrega final al cliente. Sé específico y conciso.`;

      setPromptIA(defaultPrompt);
    } catch (error) {
      console.error(error);
      setPromptIA("Por favor, enumera los pasos lógicos y secuenciales que debo seguir para producir mi producto o servicio. Asegúrate de incluir tareas que impliquen Almacenamiento, Operación, Transporte e Inspección (pero no las clasifiques).");
    } finally {
      setCargandoIA(false);
    }
  };

  const ejecutarIA = async () => {
    setCargandoIA(true);
    try {
      const pasosGenerados = await generarPasosPersonalizadoIA(promptIA);
      if (pasosGenerados && Array.isArray(pasosGenerados)) {
        const nuevosObjetos = pasosGenerados.map(item => {
          if (typeof item === 'object' && item !== null) {
            return {
              id: Date.now() + Math.random(),
              texto: item.texto || '',
              categoria: null,
              categoriaCorrecta: item.categoriaCorrecta || 'operacion'
            };
          }
          return {
            id: Date.now() + Math.random(),
            texto: item,
            categoria: null,
            categoriaCorrecta: null
          };
        });
        
        let n = [...nuevosObjetos].slice(0, 10); // LIMITAMOS A 10 PASOS MÁXIMO
        // Quitar el primer paso si estaba vacío
        if (n.length > 0 && (!n[0].texto || n[0].texto.trim() === '')) n.shift();
        
        updateGlobalData({ pasosProduccion: n });
        setShowIAPrompt(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoIA(false);
    }
  };

  const getPasoContent = () => {
    switch(step) {
      case 1: return renderVideoStep("1. Listado de Procesos", "procesos", "Ir al Listado");
      
      case 2: return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">2. Define tus Pasos de Producción</h2>
          <p className="text-slate-500 mb-6">¿Cuáles son los pasos exactos para crear tu producto o dar tu servicio?</p>
          
          

          <div className="space-y-3 mb-4">
            {data.pasosProduccion.map((p, i) => (
              <div key={p.id} className="flex gap-3 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold shrink-0">{i+1}</div>
                <input className="flex-1 p-2 bg-transparent border-none outline-none focus:ring-0 text-slate-700" value={p.texto} onChange={(e) => {
                  const n = [...data.pasosProduccion]; n[i].texto = e.target.value; updateGlobalData({ pasosProduccion: n });
                }} placeholder="Ej: Comprar los ingredientes..." />
                <button onClick={() => updateGlobalData({ pasosProduccion: data.pasosProduccion.filter(x => x.id !== p.id) })} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">X</button>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              onClick={() => updateGlobalData({ pasosProduccion: [] })}
              className="py-3 px-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              title="Borrar Todos los Pasos"
            >
              <Eraser size={20} /> Borrar Todos
            </button>
            <button 
              onClick={() => updateGlobalData({ pasosProduccion: [...data.pasosProduccion, { id: Date.now(), texto: '', categoria: null }] })} 
              className="flex-1 py-3 px-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors"
            >
              + Añadir Paso Manualmente
            </button>
            <button 
              onClick={prepararPromptIA}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-purple-300 bg-purple-50 text-purple-700 font-bold flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
            >
              <Sparkles size={20} /> Generar con ayuda de IA
            </button>
          </div>

          {showIAPrompt && (
            <div className="mt-6 bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 animate-fade-in shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-purple-800 flex items-center gap-2"><Sparkles size={20}/> Instrucciones para la IA</h3>
                <button onClick={() => setShowIAPrompt(false)} className="text-purple-400 hover:text-purple-600 bg-purple-100 rounded-full p-1"><X size={20}/></button>
              </div>
              <p className="text-sm text-purple-700 mb-3 font-medium">Revisa y modifica las instrucciones antes de enviarlas a la Inteligencia Artificial. ¡Hemos reunido automáticamente la información de tus fases anteriores!</p>
              
              <textarea 
                className="w-full h-48 p-4 border-2 border-purple-200 rounded-xl bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none text-slate-700 resize-none"
                value={promptIA}
                onChange={(e) => setPromptIA(e.target.value)}
                disabled={cargandoIA}
                placeholder="Cargando información..."
              ></textarea>
              
              <div className="flex justify-end mt-4">
                <button 
                  onClick={ejecutarIA}
                  disabled={cargandoIA || !promptIA}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {cargandoIA ? "Generando..." : "Generar Pasos Ahora"}
                </button>
              </div>
            </div>
          )}
        </div>
      );
      
      case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">3. Revisión del Listado</h2>
          <p className="text-slate-500 mb-6">Estos son tus pasos confirmados.</p>
          <div className="text-left bg-slate-50 p-6 rounded-xl border space-y-2">
            {data.pasosProduccion.map((p, i) => (
              <div key={p.id} className="flex gap-3 items-center">
                <span className="font-bold text-slate-400">{i+1}.</span>
                <span className="text-slate-700 font-medium">{p.texto || '(Vacío)'}</span>
              </div>
            ))}
          </div>
        </div>
      );

      

      case 4: 
        const categorias = [
          { id: 'almacenamiento', icon: <Box size={24} />, color: 'bg-orange-100 text-orange-700 border-orange-300', title: 'Almacenamiento' },
          { id: 'operacion', icon: <Settings size={24} />, color: 'bg-green-100 text-green-700 border-green-300', title: 'Operación' },
          { id: 'transporte', icon: <Truck size={24} />, color: 'bg-blue-100 text-blue-700 border-blue-300', title: 'Transporte' },
          { id: 'inspeccion', icon: <Search size={24} />, color: 'bg-purple-100 text-purple-700 border-purple-300', title: 'Inspección' }
        ];
        
        const todosClasificados = data.pasosProduccion.length > 0 && data.pasosProduccion.filter(p => !p.categoria).length === 0;
        const totalVerificados = Object.keys(resultadoVerificacion).length;
        const todosCorrectos = todosClasificados; // Permitir avanzar siempre que todo esté clasificado

        return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-6xl mx-auto overflow-hidden">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">5. Diagrama de Procesos (Clasificación)</h2>
          <p className="text-slate-500 mb-6">Arrastra cada paso a la categoría que le corresponda y verifica si tu lógica es correcta.</p>
          
          {!mostrarDiagrama ? (
            <>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-2xl border border-slate-200 h-[600px] flex flex-col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedItem) {
                      const n = data.pasosProduccion.map(p => p.id === draggedItem.id ? { ...p, categoria: null } : p);
                      updateGlobalData({ pasosProduccion: n });
                      setResultadoVerificacion(prev => {
                        const newRes = { ...prev };
                        delete newRes[draggedItem.id];
                        return newRes;
                      });
                      setDraggedItem(null);
                    }
                  }}
                >
                  <h3 className="font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200">Pasos sin clasificar:</h3>
                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 custom-scrollbar">
                    {data.pasosProduccion.filter(p => !p.categoria).map(p => (
                      <div key={p.id} draggable onDragStart={() => handleDragStart(p)} className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl cursor-grab active:cursor-grabbing flex gap-3 items-start hover:border-blue-300 hover:shadow-md transition-all group">
                        <GripVertical size={20} className="text-slate-300 group-hover:text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-slate-700 leading-snug">{p.texto || '(Sin texto)'}</span>
                      </div>
                    ))}
                    {data.pasosProduccion.filter(p => !p.categoria).length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-green-500 opacity-60">
                        <CheckCircle size={48} className="mb-2" />
                        <p className="font-bold text-center">¡Todo clasificado!<br/><span className="text-sm font-normal">Ahora verifica tu respuesta</span></p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {categorias.map(cat => (
                    <div key={cat.id} 
                      onDragOver={(e) => e.preventDefault()} 
                      onDrop={() => handleDropToCategory(cat.id)}
                      className={`p-5 rounded-2xl border-2 ${cat.color} flex flex-col h-[290px] transition-all bg-opacity-30`}
                    >
                      <div className="flex items-center gap-2 mb-4 font-bold pb-2 border-b border-current border-opacity-20">
                        {cat.icon} {cat.title}
                      </div>
                      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 custom-scrollbar">
                        {data.pasosProduccion.filter(p => p.categoria === cat.id).map(p => {
                          const val = resultadoVerificacion[p.id];
                          let borderClass = "border-slate-100 bg-white";
                          if (val) {
                            borderClass = val.correcto ? "border-green-400 bg-green-50 shadow-green-100" : "border-red-400 bg-red-50 shadow-red-100";
                          }
                          return (
                            <div key={p.id} 
                              draggable 
                              onDragStart={() => handleDragStart(p)}
                              className={`p-3 rounded-xl shadow-sm border-2 ${borderClass} text-sm flex flex-col gap-2 group transition-all cursor-grab active:cursor-grabbing`}>
                              <div className="flex items-start gap-2">
                                <span className="flex-1 text-slate-700 leading-snug">{p.texto}</span>
                                <button onClick={() => { const n = data.pasosProduccion.map(x => x.id === p.id ? {...x, categoria: null} : x); updateGlobalData({ pasosProduccion: n }); setResultadoVerificacion(prev => { const newRes = {...prev}; delete newRes[p.id]; return newRes; }); }} className="text-slate-300 hover:text-red-500 hover:bg-red-100 p-1 rounded-md transition-colors shrink-0">
                                  <X size={16} />
                                </button>
                              </div>
                              {val && (
                                <div className={`text-xs font-bold flex items-start gap-1 mt-1 p-2 rounded ${val.correcto ? 'text-green-700 bg-green-100/50' : 'text-red-700 bg-white border border-red-200 shadow-sm'}`}>
                                  {val.correcto ? <CheckCircle size={14} className="shrink-0" /> : <HelpCircle size={14} className="shrink-0 mt-0.5" />}
                                  <span>{val.correcto ? "¡Correcto!" : val.sugerencia}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {verificando && (
                <div className="mt-8 flex justify-center animate-fade-in">
                  <div className="bg-indigo-100 text-indigo-700 font-bold text-lg px-8 py-4 rounded-full shadow-sm flex items-center gap-3">
                    <Activity className="animate-spin" size={24} />
                    Analizando con IA...
                  </div>
                </div>
              )}
            </>
          ) : (
            renderDiagramaFlujo()
          )}
        </div>
      );

      case 6: return renderVideoStep("6. Layout del Negocio", "layout", "Crear Layout");

      case 7: {
        const handleDownloadLayout = async () => {
          const node = document.getElementById('layout-export');
          if (!node) return;
          try {
            const dataUrl = await htmlToImage.toPng(node, { 
              backgroundColor: '#f8fafc',
              pixelRatio: 2
            });
            const link = document.createElement('a');
            link.download = 'layout_plano.png';
            link.href = dataUrl;
            link.click();
          } catch (e) {
            console.error(e);
          }
        };

        return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-5xl mx-auto flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">7. Constructor de Layout (Plano)</h2>
              <p className="text-slate-500">Selecciona una herramienta y haz clic en la cuadrícula para diseñar tu local paso a paso.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleDownloadLayout} className="bg-white hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-blue-200">
                <Download size={18} /> Descargar
              </button>
              <button onClick={() => updateGlobalData({ cuadriculaLayout: Array(36).fill(null) })} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors border border-red-200">
                <Eraser size={18} /> Limpiar Todo
              </button>
            </div>
          </div>
          
          <div className="flex gap-6 items-stretch">
            {/* Paleta de Herramientas */}
            <div className="w-1/4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
              <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Herramientas</h3>
              <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                {layoutTools.map(tool => (
                  <button 
                    key={tool.id} 
                    onClick={() => setSelectedTool(tool.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left w-full ${selectedTool === tool.id ? 'border-blue-500 bg-blue-50 shadow-md scale-105 z-10' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                  >
                    <div className="shrink-0">{tool.icon}</div>
                    <span className={`font-semibold text-sm ${selectedTool === tool.id ? 'text-blue-700' : 'text-slate-600'}`}>{tool.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Lienzo (Grid 6x6) */}
            <div id="layout-export" className="w-3/4 flex flex-col items-center justify-center bg-slate-100 rounded-xl border-4 border-slate-300 p-8 shadow-inner relative">
              {/* Marcas cardinales */}
              <div className="absolute top-2 text-slate-400 font-bold tracking-widest text-sm">NORTE / FONDO</div>
              <div className="absolute bottom-2 text-slate-400 font-bold tracking-widest text-sm">SUR / FRENTE</div>

              <div className="grid grid-cols-6 gap-0 w-[500px] h-[500px] bg-slate-300 border-4 border-slate-400 shadow-xl select-none">
                {(data.cuadriculaLayout.length === 36 ? data.cuadriculaLayout : Array(36).fill(null)).map((cellData, idx) => {
                  let cellObj = cellData;
                  if (cellObj && typeof cellObj !== 'object') {
                    cellObj = { areaId: cellObj.id || cellObj };
                  }
                  
                  const area = cellObj?.areaId ? layoutTools.find(t => t.id === cellObj.areaId) : null;
                  const flow = cellObj?.flowId ? layoutTools.find(t => t.id === cellObj.flowId) : null;
                  const structure = cellObj?.structureId ? layoutTools.find(t => t.id === cellObj.structureId) : null;
                  
                  const areaBgClass = area ? area.bgColor + ' ' + area.border : 'bg-white hover:bg-slate-50';
                  
                  return (
                    <div 
                      key={idx} 
                      onMouseDown={(e) => { e.preventDefault(); handleCellClick(idx); }}
                      onMouseEnter={(e) => { if (e.buttons === 1) handleCellClick(idx); }}
                      className={`border border-slate-300 relative group flex flex-col items-center justify-center transition-all cursor-crosshair overflow-hidden aspect-square ${areaBgClass}`}
                      style={{
                        boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.15)',
                      }}
                    >
                      {/* 1. Capa de Área */}
                      {area && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 pointer-events-none">
                          <div className="scale-90 flex flex-col items-center justify-center text-center">
                            {area.icon}
                            <span className="text-[8px] leading-tight font-black uppercase tracking-tight text-slate-800 mt-0.5 bg-white/60 px-1 rounded truncate max-w-full">
                              {area.nombre.split('/')[0]}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* 2. Capa de Flujo (Superpuesto encima del área) */}
                      {flow && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-transparent">
                          {flow.customRender || flow.icon}
                        </div>
                      )}
                      
                      {/* 3. Capas de Puertas (En los 4 lados de la celda) */}
                      {structure?.id === 'puerta_arr' && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 p-0.5 pointer-events-none z-20 bg-white border border-slate-300 rounded shadow-sm">
                          <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-800 fill-amber-50 stroke-[8]">
                            <rect x="5" y="5" width="90" height="90" rx="10" strokeWidth="6" />
                            <line x1="5" y1="95" x2="95" y2="95" strokeWidth="12" />
                            <line x1="15" y1="95" x2="15" y2="15" />
                            <path d="M 15 15 A 80 80 0 0 1 95 95" strokeDasharray="8,8" strokeWidth="4" />
                          </svg>
                        </div>
                      )}
                      {structure?.id === 'puerta_aba' && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 p-0.5 pointer-events-none z-20 bg-white border border-slate-300 rounded shadow-sm rotate-180">
                          <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-800 fill-amber-50 stroke-[8]">
                            <rect x="5" y="5" width="90" height="90" rx="10" strokeWidth="6" />
                            <line x1="5" y1="95" x2="95" y2="95" strokeWidth="12" />
                            <line x1="15" y1="95" x2="15" y2="15" />
                            <path d="M 15 15 A 80 80 0 0 1 95 95" strokeDasharray="8,8" strokeWidth="4" />
                          </svg>
                        </div>
                      )}
                      {structure?.id === 'puerta_izq' && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 p-0.5 pointer-events-none z-20 bg-white border border-slate-300 rounded shadow-sm -rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-800 fill-amber-50 stroke-[8]">
                            <rect x="5" y="5" width="90" height="90" rx="10" strokeWidth="6" />
                            <line x1="5" y1="95" x2="95" y2="95" strokeWidth="12" />
                            <line x1="15" y1="95" x2="15" y2="15" />
                            <path d="M 15 15 A 80 80 0 0 1 95 95" strokeDasharray="8,8" strokeWidth="4" />
                          </svg>
                        </div>
                      )}
                      {structure?.id === 'puerta_der' && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 p-0.5 pointer-events-none z-20 bg-white border border-slate-300 rounded shadow-sm rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-800 fill-amber-50 stroke-[8]">
                            <rect x="5" y="5" width="90" height="90" rx="10" strokeWidth="6" />
                            <line x1="5" y1="95" x2="95" y2="95" strokeWidth="12" />
                            <line x1="15" y1="95" x2="15" y2="15" />
                            <path d="M 15 15 A 80 80 0 0 1 95 95" strokeDasharray="8,8" strokeWidth="4" />
                          </svg>
                        </div>
                      )}
                      
                      {/* 4. Capas de Ventanas (En los 4 lados de la celda) */}
                      {structure?.id === 'ventana_arr' && (
                        <div className="absolute top-0 left-0 right-0 h-3 bg-sky-200 border-b-2 border-sky-500 z-20 flex items-center justify-center shadow-sm">
                          <div className="w-full h-1 bg-white border-y border-sky-300"></div>
                        </div>
                      )}
                      {structure?.id === 'ventana_aba' && (
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-sky-200 border-t-2 border-sky-500 z-20 flex items-center justify-center shadow-sm">
                          <div className="w-full h-1 bg-white border-y border-sky-300"></div>
                        </div>
                      )}
                      {structure?.id === 'ventana_izq' && (
                        <div className="absolute top-0 bottom-0 left-0 w-3 bg-sky-200 border-r-2 border-sky-500 z-20 flex flex-col items-center justify-center shadow-sm">
                          <div className="h-full w-1 bg-white border-x border-sky-300"></div>
                        </div>
                      )}
                      {structure?.id === 'ventana_der' && (
                        <div className="absolute top-0 bottom-0 right-0 w-3 bg-sky-200 border-l-2 border-sky-500 z-20 flex flex-col items-center justify-center shadow-sm">
                          <div className="h-full w-1 bg-white border-x border-sky-300"></div>
                        </div>
                      )}
                      
                      {/* Tooltip hover en celdas vacías para guiar */}
                      {!area && !flow && !structure && selectedTool !== 'borrador' && (
                        <div className="opacity-0 group-hover:opacity-30 absolute inset-0 flex items-center justify-center pointer-events-none scale-75">
                           {layoutTools.find(t => t.id === selectedTool)?.icon}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          

        </div>
      );
    }

      default: return <div>Paso no definido</div>;
    }
  };

  return (
    <PasoLayout 
      faseTitle="Fase 8: La Operación"
      pasoActual={step}
      totalPasos={5}
      tabs={[
          { id: 1, icon: <Video size={18} />, label: 'Video' },
          { id: 2, icon: <List size={18} />, label: 'Listado Pasos' },
          { id: 3, icon: <CheckSquare size={18} />, label: 'Revisión' },
          { id: 4, icon: <Network size={18} />, label: 'Diagrama' }
        ]}
      onTabClick={(id) => {
        irAPaso(id);
      }}
      onSiguiente={handleSiguienteClick}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={step === 1 ? "La operación es el corazón de tu negocio. Si falla, el cliente no recibe valor. Presta atención." : "Define cada paso con precisión. Un proceso bien diseñado ahorra tiempo, dinero y muchos dolores de cabeza."}
      guardando={guardando || isFinishing}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>
        {getPasoContent()}
      </div>

      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-indigo-50 border-b border-indigo-100 p-6">
              <h3 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                <HelpCircle size={24} className="text-indigo-600" />
                {confirmDialog.title}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 font-medium text-lg leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={confirmDialog.onCancel}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {confirmDialog.cancelText}
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </PasoLayout>
  );
};

export default Fase8_Operacion;
