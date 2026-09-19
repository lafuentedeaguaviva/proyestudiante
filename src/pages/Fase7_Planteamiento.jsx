import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import { useFase7Controller } from '../controllers/useFase7Controller';
import { Bot, MapPin, Target, Lightbulb, Compass, Search, CheckCircle, Video, Wand2, Sparkles, RefreshCw } from 'lucide-react';
import SelectorVerbo from '../components/ui/SelectorVerbo';

const VideoPlaceholder = ({ id, title }) => (
  <div className="w-full bg-slate-900 rounded-xl overflow-hidden aspect-video relative border-4 border-slate-800 shadow-lg">
    {id ? (
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    ) : (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <p className="font-bold text-lg">Espacio para Video Instructivo</p>
        <p className="text-sm">Configura el ID de YouTube en el código</p>
      </div>
    )}
  </div>
);

const opcionesDiagnostico = [
  {
    id: 1,
    titulo: "Opción 1: De lo general a lo particular",
    descripcion: "Estructura académica, recomendable para trabajo educativo.",
    parrafos: [
      { id: "diag_p1", label: "Párrafo 1 – Contexto general", placeholder: "Describe brevemente la situación económica, social, productiva o comercial..." },
      { id: "diag_p2", label: "Párrafo 2 – Situación específica", placeholder: "Explica qué ocurre en el sector relacionado con el producto o servicio..." },
      { id: "diag_p3", label: "Párrafo 3 – Problema o necesidad", placeholder: "Señala concretamente qué necesidad se ha observado y quiénes son afectados." },
      { id: "diag_p4", label: "Párrafo 4 – Oportunidad productiva", placeholder: "Explica cómo esa necesidad puede convertirse en una oportunidad..." },
      { id: "diag_p5", label: "Párrafo 5 – Conclusión del diagnóstico", placeholder: "Resume por qué resulta pertinente plantear el emprendimiento." }
    ]
  },
  {
    id: 2,
    titulo: "Opción 2: Problema → causas → consecuencias → solución",
    descripcion: "Funciona muy bien cuando el emprendimiento nace para resolver un problema concreto.",
    parrafos: [
      { id: "diag_p1", label: "Párrafo 1 – Problema", placeholder: "Presenta la situación problemática que se ha identificado." },
      { id: "diag_p2", label: "Párrafo 2 – Causas", placeholder: "Explica cuáles son los factores que podrían originar o agravar esa situación." },
      { id: "diag_p3", label: "Párrafo 3 – Consecuencias", placeholder: "Describe cómo afecta el problema a los beneficiarios." },
      { id: "diag_p4", label: "Párrafo 4 – Necesidad", placeholder: "Explica qué hace falta para mejorar la situación." },
      { id: "diag_p5", label: "Párrafo 5 – Alternativa productiva", placeholder: "Presenta el emprendimiento como una alternativa viable." }
    ]
  },
  {
    id: 3,
    titulo: "Opción 3: Observación del entorno",
    descripcion: "Buena para proyectos escolares, parte de una observación directa.",
    parrafos: [
      { id: "diag_p1", label: "Párrafo 1 – Lugar y población", placeholder: "Indica dónde se realizó la observación y qué población se tomó en cuenta." },
      { id: "diag_p2", label: "Párrafo 2 – Lo observado", placeholder: "Describe qué productos, servicios o comportamientos se identificaron." },
      { id: "diag_p3", label: "Párrafo 3 – Necesidades y preferencias", placeholder: "Explica qué necesidades o demandas se pudieron identificar." },
      { id: "diag_p4", label: "Párrafo 4 – Recursos disponibles", placeholder: "Menciona los recursos humanos, materiales o conocimientos disponibles." },
      { id: "diag_p5", label: "Párrafo 5 – Potencial productivo", placeholder: "Relaciona lo observado con la posibilidad de desarrollar un emprendimiento." }
    ]
  }
];

const Fase7_Planteamiento = () => {
  const {  
    data, 
    step, 
    cargando, 
    guardando, 
    updateData, 
    irAPaso,
    siguientePaso, 
    pasoAnterior,
    generateAI,
    isGenerating,
    activeGeneration,
    isGeneratingResumen,
    generarResumenFase7
  , setPendingSave } = useFase7Controller();

  // Auto-generar resumen al entrar al paso 11 si está vacío
  useEffect(() => {
    if (step === 11 && !data.resumen_ia && !isGeneratingResumen) {
      generarResumenFase7();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (cargando) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const pasoActual = step;

  const renderContent = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6 text-slate-800">
              <Video size={28} className="text-red-500" />
              <h2 className="text-2xl font-bold">Introducción al Diagnóstico</h2>
            </div>
            <p className="text-center text-slate-600 mb-6">Antes de comenzar, observa este video para entender cómo diagnosticar un problema.</p>
            <VideoPlaceholder id="" title="Video sobre Diagnóstico del Problema" />
          </div>
        );

      case 2:
        const optActual = opcionesDiagnostico.find(o => o.id === parseInt(data.opcion_diagnostico || 1)) || opcionesDiagnostico[0];
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl text-white">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><MapPin /> Diagnóstico e Identificación</h3>
                <p className="text-sm text-slate-300">Selecciona una estructura para redactar tu diagnóstico.</p>
              </div>
              <button 
                onClick={() => generateAI('diagnostico')}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors font-medium text-white disabled:opacity-50"
              >
                <Bot size={18} /> {isGenerating && activeGeneration === 'diagnostico' ? 'Analizando...' : 'Sugerencia IA'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="mb-6">
                <h4 className="font-bold text-slate-700 mb-2">Describe tu Producto o Servicio (Opcional, ayuda a la IA a redactar el diagnóstico)</h4>
                <textarea 
                  value={data.desc_producto || ''} 
                  onChange={(e) => updateData({ desc_producto: e.target.value })} 
                  className="w-full h-24 p-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:outline-none resize-none" 
                  placeholder="Describe brevemente qué es tu producto o servicio para que la Inteligencia Artificial lo tome en cuenta al generar el resumen..." 
                />
              </div>

              <h4 className="font-bold text-slate-700 mb-4">Elige la estructura de tu diagnóstico:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {opcionesDiagnostico.map(opt => (
                  <div 
                    key={opt.id} 
                    onClick={() => updateData({ opcion_diagnostico: opt.id })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${parseInt(data.opcion_diagnostico || 1, 10) === opt.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
                  >
                    <div className="font-bold text-sm mb-1">{opt.titulo}</div>
                    <div className="text-xs text-slate-500">{opt.descripcion}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {optActual.parrafos.map(p => (
                  <div key={p.id}>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{p.label}</label>
                    <textarea 
                      value={data[p.id] || ''} 
                      onChange={(e) => updateData({ [p.id]: e.target.value })} 
                      className="w-full h-24 p-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:outline-none resize-none" 
                      placeholder={p.placeholder} 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-indigo-800">Diagnóstico Final Consolidado:</h4>
                <button
                  onClick={() => {
                    const partes = optActual.parrafos.map(p => data[p.id]).filter(Boolean).join('\n\n');
                    updateData({ diagnostico: partes });
                  }}
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors font-medium text-white text-sm"
                  title="Unir los párrafos"
                >
                  <Wand2 size={16} /> Unir párrafos
                </button>
              </div>
              <textarea 
                value={data.diagnostico || ""} 
                onChange={(e) => updateData({ diagnostico: e.target.value })} 
                className="w-full h-48 p-4 bg-white border-2 border-indigo-100 rounded-xl focus:border-indigo-400 outline-none resize-none text-slate-700" 
                placeholder="Haz clic en 'Unir párrafos' para ver el resultado final..." 
              />
            </div>

          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6 text-slate-800">
              <Video size={28} className="text-red-500" />
              <h2 className="text-2xl font-bold">Introducción a los Objetivos SMART</h2>
            </div>
            <p className="text-center text-slate-600 mb-6">Aprende a redactar objetivos claros y alcanzables para tu emprendimiento.</p>
            <VideoPlaceholder id="" title="Video sobre Objetivos SMART" />
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            <div className="bg-slate-800 p-4 rounded-xl text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><Target /> Objetivos del Emprendimiento</h3>
              <p className="text-sm text-slate-300">El norte de tu proyecto: General y Específicos.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-black text-slate-800 text-lg mb-4">1. Objetivo General</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="relative z-50">
                  <SelectorVerbo 
                    value={data.obj_verbo} 
                    onChange={(val) => updateData({obj_verbo: val})} 
                  />
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Producto/Servicio</label>
                  <input type="text" value={data.obj_producto || ''} onChange={(e) => updateData({obj_producto: e.target.value})} className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ej: Sistema de riego" />
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Público Objetivo</label>
                  <input type="text" value={data.obj_publico || ''} onChange={(e) => updateData({obj_publico: e.target.value})} className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ej: Agricultores locales" />
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Ubicación</label>
                  <input type="text" value={data.obj_ubicacion || ''} onChange={(e) => updateData({obj_ubicacion: e.target.value})} className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ej: en Cochabamba" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Plazo</label>
                  <input type="text" value={data.obj_plazo || ''} onChange={(e) => updateData({obj_plazo: e.target.value})} className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ej: en 6 meses" />
                </div>
              </div>
              <p className="bg-indigo-50 p-4 rounded-xl text-indigo-900 font-medium text-center shadow-inner border border-indigo-100">
                "{data.obj_verbo || '[Verbo]'} {data.obj_producto || '[Producto]'} para {data.obj_publico || '[Público]'} {data.obj_ubicacion || '[Ubicación]'} {data.obj_plazo || '[Plazo]'}"
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-black text-slate-800 text-lg mb-2">2. Objetivos Específicos</h4>
              <p className="text-sm text-slate-500 mb-4">Pasos medibles y secuenciales para alcanzar el Objetivo General.</p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800 flex items-start gap-3">
                <Lightbulb size={20} className="shrink-0 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Ideas y Tips para tus Objetivos Específicos:</p>
                  <ul className="list-disc pl-4 space-y-1 text-blue-700">
                    <li>Piensa en ellos como el <strong>"paso a paso"</strong> lógico para lograr tu Objetivo General.</li>
                    <li>Procura que sean <strong>cuantificables</strong> (ej: "Conseguir 50 clientes", no solo "Conseguir clientes").</li>
                    <li>Verbos recomendados: <em>Cuantificar, Adquirir, Diseñar, Capacitar, Ensamblar, Evaluar</em>.</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 text-slate-500 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">1</div>
                  <input type="text" value={data.obj_especifico_1} onChange={(e) => updateData({obj_especifico_1: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition-all" placeholder="Ej: Adquirir insumos con inversión de Bs. 200..." />
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 text-slate-500 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">2</div>
                  <input type="text" value={data.obj_especifico_2} onChange={(e) => updateData({obj_especifico_2: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition-all" placeholder="Ej: Preparar y vender 40 loncheras diarias..." />
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 text-slate-500 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">3</div>
                  <input type="text" value={data.obj_especifico_3} onChange={(e) => updateData({obj_especifico_3: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition-all" placeholder="Ej: Obtener una ganancia mínima de..." />
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 text-slate-500 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1">4</div>
                  <input type="text" value={data.obj_especifico_4} onChange={(e) => updateData({obj_especifico_4: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 outline-none transition-all" placeholder="Ej: Realizar encuestas de satisfacción..." />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6 text-slate-800">
              <Video size={28} className="text-red-500" />
              <h2 className="text-2xl font-bold">Introducción a la Misión</h2>
            </div>
            <p className="text-center text-slate-600 mb-6">Descubre cómo definir la razón de ser de tu negocio hoy.</p>
            <VideoPlaceholder id="" title="Video sobre la Misión" />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl text-white">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><Compass className="text-sky-400" /> Misión del Emprendimiento</h3>
                <p className="text-sm text-slate-300">¿Qué hacemos hoy y por qué existimos?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1. ¿Quiénes somos?</label>
                <input type="text" value={data.mision_quienes_somos} onChange={(e) => updateData({ mision_quienes_somos: e.target.value })} className="w-full p-3 rounded-lg border-2 border-slate-200" placeholder="Ej: Somos un emprendimiento estudiantil..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿Qué hacemos?</label>
                <input type="text" value={data.mision_que_hacemos} onChange={(e) => updateData({ mision_que_hacemos: e.target.value })} className="w-full p-3 rounded-lg border-2 border-slate-200" placeholder="Ej: Elaboramos loncheras saludables..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">3. ¿Para quién lo hacemos?</label>
                <input type="text" value={data.mision_para_quien} onChange={(e) => updateData({ mision_para_quien: e.target.value })} className="w-full p-3 rounded-lg border-2 border-slate-200" placeholder="Ej: Para los estudiantes del colegio San José..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">4. ¿Por qué lo hacemos? (El valor)</label>
                <input type="text" value={data.mision_por_que} onChange={(e) => updateData({ mision_por_que: e.target.value })} className="w-full p-3 rounded-lg border-2 border-slate-200" placeholder="Ej: Para mejorar su nutrición diaria..." />
              </div>
            </div>

            <div className="bg-sky-50 p-6 rounded-2xl border border-sky-200 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sky-900">Redacción Final de la Misión:</h4>
                <button
                  onClick={() => {
                    const partes = [
                      data.mision_quienes_somos,
                      data.mision_que_hacemos,
                      data.mision_para_quien,
                      data.mision_por_que
                    ].filter(Boolean).join(' ');
                    updateData({ mision_redaccion_final: partes });
                  }}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-3 py-1.5 rounded-lg transition-colors font-medium text-white text-sm"
                  title="Unir las 4 respuestas de arriba"
                >
                  <Wand2 size={16} /> Unir respuestas
                </button>
              </div>
              <textarea 
                value={data.mision_redaccion_final} 
                onChange={(e) => updateData({ mision_redaccion_final: e.target.value })} 
                className="w-full h-32 p-4 bg-white border-2 border-sky-100 rounded-xl focus:border-sky-400 outline-none resize-none text-slate-700" 
                placeholder="Une tus respuestas aquí para formar el párrafo final de tu Misión..." 
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6 text-slate-800">
              <Video size={28} className="text-red-500" />
              <h2 className="text-2xl font-bold">Introducción a la Visión</h2>
            </div>
            <p className="text-center text-slate-600 mb-6">Aprende a proyectar tu emprendimiento hacia el futuro.</p>
            <VideoPlaceholder id="" title="Video sobre la Visión" />
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl text-white">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2"><Lightbulb className="text-amber-400" /> Visión del Emprendimiento</h3>
                <p className="text-sm text-slate-300">¿Cómo nos vemos en el futuro?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                <label className="text-xs font-bold text-slate-500 mb-1 block">1. ¿Cómo te ves en 3/5 años?</label>
                <input type="text" value={data.vision_como_vemos} onChange={(e) => updateData({ vision_como_vemos: e.target.value })} className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ej: Seremos la principal opción..." />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                <label className="text-xs font-bold text-slate-500 mb-1 block">2. ¿Cuál es la meta más grande?</label>
                <input type="text" value={data.vision_meta_grande} onChange={(e) => updateData({ vision_meta_grande: e.target.value })} className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ej: Tener 3 puntos de venta..." />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
                <label className="text-xs font-bold text-slate-500 mb-1 block">3. ¿Qué impacto lograrás?</label>
                <input type="text" value={data.vision_impacto} onChange={(e) => updateData({ vision_impacto: e.target.value })} className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-medium placeholder:text-slate-400" placeholder="Ej: Reducir el consumo de chatarra..." />
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-amber-900">Redacción Final de la Visión:</h4>
                <button
                  onClick={() => {
                    const partes = [
                      data.vision_como_vemos,
                      data.vision_meta_grande,
                      data.vision_impacto
                    ].filter(Boolean).join(' ');
                    updateData({ vision_redaccion_final: partes });
                  }}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors font-medium text-white text-sm"
                  title="Unir las 3 respuestas de arriba"
                >
                  <Wand2 size={16} /> Unir respuestas
                </button>
              </div>
              <textarea 
                value={data.vision_redaccion_final} 
                onChange={(e) => updateData({ vision_redaccion_final: e.target.value })} 
                className="w-full h-32 p-4 bg-white border-2 border-amber-100 rounded-xl focus:border-amber-400 outline-none resize-none text-slate-700" 
                placeholder="Une tus respuestas aquí para formar el párrafo final de tu Visión..." 
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6 text-slate-800">
              <Video size={28} className="text-red-500" />
              <h2 className="text-2xl font-bold">Introducción a la Justificación</h2>
            </div>
            <p className="text-center text-slate-600 mb-6">Entiende por qué y para qué es importante tu proyecto.</p>
            <VideoPlaceholder id="" title="Video sobre la Justificación" />
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-xl text-white">
              <h3 className="font-bold text-lg flex items-center gap-2"><CheckCircle /> Justificación del Proyecto</h3>
              <p className="text-sm text-slate-300">La "razón de ser" y viabilidad de tu emprendimiento.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200 border-l-4 border-l-emerald-500">
                <h4 className="font-black text-emerald-800 text-lg mb-2">Justificación Social</h4>
                <p className="text-sm text-slate-500 mb-3">¿Qué problema resuelve y a quién beneficia?</p>
                <textarea 
                  value={data.justificacion_social} 
                  onChange={(e) => updateData({ justificacion_social: e.target.value })} 
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-400 outline-none resize-none" 
                  placeholder="El presente emprendimiento se justifica socialmente porque..." 
                />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200 border-l-4 border-l-blue-500">
                <h4 className="font-black text-blue-800 text-lg mb-2">Justificación Económica</h4>
                <p className="text-sm text-slate-500 mb-3">¿Es rentable? ¿Hay mercado?</p>
                <textarea 
                  value={data.justificacion_economica} 
                  onChange={(e) => updateData({ justificacion_economica: e.target.value })} 
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-400 outline-none resize-none" 
                  placeholder="Económicamente, el proyecto es viable porque..." 
                />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-200 border-l-4 border-l-purple-500">
                <h4 className="font-black text-purple-800 text-lg mb-2">Justificación Personal</h4>
                <p className="text-sm text-slate-500 mb-3">¿Por qué lo haces? ¿Qué aprendes?</p>
                <textarea 
                  value={data.justificacion_personal} 
                  onChange={(e) => updateData({ justificacion_personal: e.target.value })} 
                  className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-400 outline-none resize-none" 
                  placeholder="Personalmente, este proyecto nos permite..." 
                />
              </div>
            </div>
          </div>
        );

      case 11: {
        const seccionesResumen = [
          {
            key: 'resumen_diagnostico',
            fallbackKey: 'diagnostico',
            titulo: '📋 Diagnóstico del Contexto',
            descripcion: 'Análisis del problema y entorno del emprendimiento.',
            color: 'border-blue-400',
            bg: 'bg-blue-50',
            textColor: 'text-blue-800',
            rows: 8,
            placeholder: 'La IA generará el diagnóstico basado en tu investigación y observaciones...'
          },
          {
            key: 'resumen_objetivo_general',
            fallbackKey: 'objGeneral',
            titulo: '🎯 Objetivo General',
            descripcion: 'El propósito principal del proyecto, en una sola oración.',
            color: 'border-indigo-400',
            bg: 'bg-indigo-50',
            textColor: 'text-indigo-800',
            rows: 3,
            placeholder: 'La IA generará el objetivo general mejorado...'
          },
          {
            key: 'resumen_objetivos_especificos',
            fallbackKey: 'objEspecificos',
            titulo: '📌 Objetivos Específicos',
            descripcion: 'Los 4 pasos medibles para alcanzar el objetivo general.',
            color: 'border-violet-400',
            bg: 'bg-violet-50',
            textColor: 'text-violet-800',
            rows: 6,
            placeholder: 'La IA generará 4 objetivos específicos mejorados...'
          },
          {
            key: 'resumen_mision',
            fallbackKey: 'mision_redaccion_final',
            titulo: '🧭 Misión',
            descripcion: '¿Quiénes somos? ¿Qué hacemos? ¿Para quién? ¿Por qué?',
            color: 'border-emerald-400',
            bg: 'bg-emerald-50',
            textColor: 'text-emerald-800',
            rows: 4,
            placeholder: 'La IA generará la misión mejorada del emprendimiento...'
          },
          {
            key: 'resumen_vision',
            fallbackKey: 'vision_redaccion_final',
            titulo: '🔭 Visión',
            descripcion: '¿Cómo nos vemos en 3 a 5 años?',
            color: 'border-amber-400',
            bg: 'bg-amber-50',
            textColor: 'text-amber-800',
            rows: 4,
            placeholder: 'La IA generará la visión mejorada del emprendimiento...'
          },
          {
            key: 'resumen_justificacion_social',
            fallbackKey: 'justificacion_social',
            titulo: '🌱 Justificación Social',
            descripcion: '¿Qué problema resuelve y a quién beneficia en la comunidad?',
            color: 'border-teal-400',
            bg: 'bg-teal-50',
            textColor: 'text-teal-800',
            rows: 4,
            placeholder: 'La IA generará la justificación social basada en tu proyecto...'
          },
          {
            key: 'resumen_justificacion_economica',
            fallbackKey: 'justificacion_economica',
            titulo: '💰 Justificación Económica',
            descripcion: 'Rentabilidad, viabilidad financiera y oportunidad de mercado.',
            color: 'border-sky-400',
            bg: 'bg-sky-50',
            textColor: 'text-sky-800',
            rows: 4,
            placeholder: 'La IA generará la justificación económica basada en tu proyecto...'
          },
          {
            key: 'resumen_justificacion_personal',
            fallbackKey: 'justificacion_personal',
            titulo: '👤 Justificación Personal',
            descripcion: 'Motivación personal, aprendizaje y desarrollo profesional.',
            color: 'border-purple-400',
            bg: 'bg-purple-50',
            textColor: 'text-purple-800',
            rows: 4,
            placeholder: 'La IA generará la justificación personal basada en tu proyecto...'
          }
        ];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Resumen del Planteamiento con IA</h2>
                    <p className="text-indigo-200 text-sm mt-1">
                      La IA mejora y completa cada sección usando toda la información de tu proyecto.
                      Los campos también se guardan en los pasos anteriores.
                    </p>
                  </div>
                </div>
                <button
                  onClick={generarResumenFase7}
                  disabled={isGeneratingResumen}
                  className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-colors disabled:opacity-50 border border-white/30"
                >
                  {isGeneratingResumen
                    ? <><RefreshCw size={16} className="animate-spin" /> Generando...</>
                    : <><Sparkles size={16} /> Generar / Regenerar Todo</>}
                </button>
              </div>
            </div>

            {/* Loading state */}
            {isGeneratingResumen ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-14 flex flex-col items-center justify-center gap-4 text-slate-500">
                <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <p className="font-bold text-lg text-slate-700">La IA está trabajando...</p>
                <p className="text-sm text-slate-400 text-center max-w-sm">
                  Está leyendo todos tus datos de las fases anteriores y redactando cada sección en primera persona.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {seccionesResumen.map((seccion) => (
                  <div
                    key={seccion.key}
                    className={`bg-white rounded-2xl shadow-sm border-2 ${seccion.color} overflow-hidden`}
                  >
                    <div className={`${seccion.bg} px-6 py-4 border-b border-slate-100`}>
                      <h3 className={`font-black text-lg ${seccion.textColor}`}>{seccion.titulo}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{seccion.descripcion}</p>
                    </div>
                    <div className="p-5">
                      <textarea
                        value={data[seccion.key] || (seccion.fallbackKey ? data[seccion.fallbackKey] : '') || ''}
                        onChange={(e) => updateData({ 
                          [seccion.key]: e.target.value,
                          ...(seccion.fallbackKey ? { [seccion.fallbackKey]: e.target.value } : {})
                        })}
                        onBlur={() => { if (typeof setPendingSave === 'function') setPendingSave(true); }}
                        rows={seccion.rows}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none text-slate-800 leading-relaxed transition-all font-normal text-[15px]"
                        placeholder={seccion.placeholder}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
              <Lightbulb size={22} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 mb-1">Consejo</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Puedes editar cada sección directamente. Al hacer clic en <strong>"Generar / Regenerar Todo"</strong>, 
                  la IA mejorará lo que ya escribiste o creará el contenido si los campos están vacíos.
                  Todo se guarda automáticamente y también actualiza los pasos anteriores.
                </p>
              </div>
            </div>
          </motion.div>
        );
      }


      default: return <div>Paso no encontrado</div>;
    }
  };

  return (
    <PasoLayout
      faseTitle="Fase 7: Planteamiento del Emprendimiento Productivo"
      pasoActual={pasoActual}
      totalPasos={11}
      tabs={[
        { id: 1, icon: <Video size={18} />, label: 'Video Diagnóstico' },
        { id: 2, icon: <MapPin size={18} />, label: 'Diagnóstico' },
        { id: 3, icon: <Video size={18} />, label: 'Video Objetivos' },
        { id: 4, icon: <Target size={18} />, label: 'Objetivos' },
        { id: 5, icon: <Video size={18} />, label: 'Video Misión' },
        { id: 6, icon: <Compass size={18} />, label: 'Misión' },
        { id: 7, icon: <Video size={18} />, label: 'Video Visión' },
        { id: 8, icon: <Lightbulb size={18} />, label: 'Visión' },
        { id: 9, icon: <Video size={18} />, label: 'Video Justificación' },
        { id: 10, icon: <CheckCircle size={18} />, label: 'Justificación' },
        { id: 11, icon: <Sparkles size={18} />, label: 'Resumen IA' }
      ]}
      onTabClick={(id) => {
        if (typeof setPendingSave === 'function') setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={siguientePaso}
      onAnterior={pasoActual > 1 ? pasoAnterior : null}
      guardando={guardando}
    >
      <div onBlur={() => { if(typeof setPendingSave === 'function') setPendingSave(true); }}>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto pb-12">
        {renderContent()}
      </motion.div>
    
      </div>
</PasoLayout>
  );
};

export default Fase7_Planteamiento;
