const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Fase10_PlanFinanciero.jsx');

const content = \`import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StepNavigation from '../components/ui/StepNavigation';
import { useFase10Controller } from '../controllers/useFase10Controller';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingUp, Plus, Trash2, Calculator, Info, Package, Play, Bot, Sparkles } from 'lucide-react';
import { generarPlanFinancieroIA } from '../services/api';

const cajaHerramientas = {
  activoFijo: {
    nombre: 'Activos Fijos',
    subgrupos: {
      maquinaria: { nombre: 'Maquinaria y Equipos', items: ['Máquina principal', 'Computadora', 'Herramientas'] },
      muebles: { nombre: 'Muebles y Enseres', items: ['Escritorio', 'Sillas', 'Estantes', 'Mostrador'] },
      vehiculos: { nombre: 'Vehículos', items: ['Motocicleta', 'Vehículo de reparto'] }
    }
  },
  activoDiferido: {
    nombre: 'Activos Diferidos',
    subgrupos: {
      legales: { nombre: 'Trámites y Licencias', items: ['Registro de comercio', 'Licencia de funcionamiento', 'Patente'] },
      marketing: { nombre: 'Marketing y Diseño', items: ['Diseño de marca', 'Campaña publicitaria inicial'] }
    }
  }
};

const Fase10_PlanFinanciero = () => {
  const {
    cargando, step, irAPaso, siguientePaso, pasoAnterior,
    globalData, setGlobalData,
    guardando, errorStr,
    toolboxCategory, setToolboxCategory,
    toolboxSubcategory, setToolboxSubcategory,
    rolesOrganigrama, fase8Cargada,
    presupuestoFase6,
    handleFinalizar,
    setPendingSave
  } = useFase10Controller();

  const data = {
    ...globalData,
    inversiones: Array.isArray(globalData?.inversiones) ? globalData.inversiones : [],
    costos: Array.isArray(globalData?.costos) ? globalData.costos : [],
    proyecciones: Array.isArray(globalData?.proyecciones) ? globalData.proyecciones : [],
    financiamiento: globalData?.financiamiento || {},
    precios: globalData?.precios || {}
  };
  
  const updateGlobalData = (newData) => {
    setGlobalData(newData);
  };

  const getCajaHerramientas = () => {
    return JSON.parse(JSON.stringify(cajaHerramientas));
  };

  const [isGeneratingIA, setIsGeneratingIA] = useState(false);

  if (cargando) return <LoadingSpinner text="Cargando Plan Financiero..." className="min-h-screen" />;

  const handleGenerarIA = async () => {
    setIsGeneratingIA(true);
    try {
      const dbDataStr = localStorage.getItem('datosFases');
      let ctx = "Plan de negocio genérico";
      if (dbDataStr) {
        try {
          const dbFases = JSON.parse(dbDataStr);
          const fbProblem = dbFases[2]?.problema || "";
          const fbIdea = dbFases[1]?.idea_ganadora || dbFases[4]?.nombreProducto || "";
          const fbSeg = dbFases[3]?.segmento || dbFases[3]?.publico_objetivo || "";
          ctx = \`Problema: \${fbProblem}. Idea: \${fbIdea}. Público: \${fbSeg}.\`;
        } catch (e) { }
      }

      const res = await generarPlanFinancieroIA(ctx);
      if (res) {
        updateGlobalData({
          ...data,
          inversiones: res.inversiones || [],
          precios: res.precios || {},
          proyecciones: res.proyecciones || [],
          puntoEquilibrio: res.puntoEquilibrio || 0
        });
        if (setPendingSave) setPendingSave(true);
      }
    } catch (e) {
      console.error(e);
      alert("Error al generar con IA: " + e.message);
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const getPasoContent = () => {
    const pFase6 = Array.isArray(presupuestoFase6) ? presupuestoFase6 : [];
    const totalPromoFase6 = pFase6.reduce((acc, p) => acc + ((parseFloat(p.costoUnitario) || 0) * (parseInt(p.cantidad) || 0)), 0);
    const inversionesLoc = Array.isArray(data?.inversiones) ? data.inversiones : [];
    const costosOpeGlobal = inversionesLoc.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));
    const cfTotal = costosOpeGlobal.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) + totalPromoFase6;
    const cvTotal = costosOpeGlobal.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
    const totalFijos = cfTotal;
    const numProdGlobal = parseInt(data?.produccionMensual) || 1;
    const costoVariableUnitario = cvTotal / numProdGlobal;

    const numProd = parseInt(data?.produccionMensual) || 1;
    const costoTotalOp = inversionesLoc.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo)).reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) + totalPromoFase6;
    const costoUnitario = costoTotalOp / numProd;
    const margen = parseFloat(data?.porcentajeGanancia || 30);
    const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
    const precioFacturado = precioSinFactura / 0.84;

    const margenContribucion = precioFacturado - costoVariableUnitario;
    const puntoEquilibrio = margenContribucion > 0 ? Math.ceil(totalFijos / margenContribucion) : 0;
    const ingresos = numProd * precioFacturado;
    const egresos = totalFijos + (numProd * costoVariableUnitario);
    const utilidadMensual = ingresos - egresos;

    const totalInversion = inversionesLoc.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);

    switch (step) {
      case 1: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto relative">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <Play size={24} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Cálculo de Inversiones</h2>
                <p className="text-slate-500 font-medium">Aprende qué necesitas para arrancar tu proyecto.</p>
              </div>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000" alt="Finanzas" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <Package size={20} /> Cálculo de Inversiones
              </h3>
              <p className="text-emerald-700 text-sm leading-relaxed mb-2">
                Antes de iniciar, debes conocer tu <strong>INVERSIÓN TOTAL</strong>, la cual se compone de:
              </p>
              <ul className="list-disc ml-6 text-emerald-700 text-sm mb-4 space-y-1">
                <li><strong>Activos Fijos:</strong> Bienes tangibles (máquinas, equipos, muebles y vehículos) necesarios para empezar.</li>
                <li><strong>Activos Diferidos / Intangibles:</strong> Gastos legales, constitución, patentes y licencias.</li>
                <li><strong>Capital de Trabajo:</strong> El dinero para cubrir materiales, insumos, sueldos y servicios durante los primeros meses.</li>
              </ul>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Caja de Herramientas</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Selecciona los activos que necesitas para tu negocio:</p>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-medium">
              <button onClick={() => { setToolboxCategory('activoFijo'); setToolboxSubcategory(Object.keys(cajaHerramientas.activoFijo.subgrupos)[0]); }} className={\`flex-1 p-2 rounded-lg \${toolboxCategory === 'activoFijo' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}\`}>Activos Fijos</button>
              <button onClick={() => { setToolboxCategory('activoDiferido'); setToolboxSubcategory(Object.keys(cajaHerramientas.activoDiferido.subgrupos)[0]); }} className={\`flex-1 p-2 rounded-lg \${toolboxCategory === 'activoDiferido' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}\`}>Diferidos</button>
            </div>

            {toolboxCategory && cajaHerramientas[toolboxCategory] && (
              <div className="space-y-3 mb-4 animate-fade-in">
                {Object.entries(getCajaHerramientas()[toolboxCategory].subgrupos).map(([key, sub]) => (
                  <div key={key} className="flex flex-col">
                    <button
                      onClick={() => setToolboxSubcategory(toolboxSubcategory === key ? null : key)}
                      className={\`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex justify-between items-center \${toolboxSubcategory === key ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-sm rounded-b-none' : 'border-slate-200 bg-white text-slate-600 hover:border-purple-300'}\`}
                    >
                      {sub.nombre}
                      <span className="text-xl leading-none text-purple-600">{toolboxSubcategory === key ? '−' : '+'}</span>
                    </button>
                    {toolboxSubcategory === key && (
                      <div className="bg-slate-50 p-4 border border-t-0 border-purple-200 rounded-b-xl animate-fade-in">
                        <div className="flex flex-wrap gap-2">
                          {sub.items.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                const tipo = toolboxCategory === 'activoFijo' ? 'fijo' : 'diferido';
                                updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now() + idx, concepto: item, cantidad: 1, precio: 0, monto: 0, tipo }] });
                              }}
                              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 hover:border-purple-400 hover:text-purple-600 shadow-sm transition-colors flex items-center gap-1"
                            >
                              <Plus size={12} /> {item}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              const tipo = toolboxCategory === 'activoFijo' ? 'fijo' : 'diferido';
                              updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now(), concepto: 'Nuevo Item', cantidad: 1, precio: 0, monto: 0, tipo }] });
                            }}
                            className="px-3 py-1.5 bg-purple-100 border border-purple-200 rounded-full text-xs font-bold text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-1"
                          >
                            <Plus size={12} /> Otro...
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">
             <h3 className="font-bold text-slate-800 text-lg mb-4">Inversiones Seleccionadas</h3>
             <div className="space-y-3">
               {(data.inversiones||[]).filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').map(inv => (
                 <div key={inv.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <input type="text" className="flex-1 bg-transparent font-medium outline-none" value={inv.concepto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].concepto = e.target.value;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <div className="flex items-center gap-2">
                       <span className="text-slate-400 font-bold">Bs.</span>
                       <input type="number" className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right font-bold text-purple-700" value={inv.monto} onChange={(e) => {
                         const newInv = [...data.inversiones];
                         const idx = newInv.findIndex(x => x.id === inv.id);
                         if (idx > -1) newInv[idx].monto = parseFloat(e.target.value)||0;
                         updateGlobalData({inversiones: newInv});
                       }} />
                    </div>
                    <button onClick={() => updateGlobalData({inversiones: data.inversiones.filter(x => x.id !== inv.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                 </div>
               ))}
               {(!data.inversiones || data.inversiones.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').length === 0) && (
                 <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                   <p className="text-slate-500 font-medium">No has añadido inversiones aún.</p>
                   <p className="text-sm text-slate-400 mt-1">Usa la caja de herramientas de la izquierda.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Capital de Trabajo</h2>
          <p className="text-slate-500 mb-6">Dinero necesario para operar los primeros meses.</p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <p className="text-center text-slate-500 py-4">Registra insumos, sueldos y servicios básicos.</p>
             <button onClick={() => updateGlobalData({inversiones: [...(data.inversiones||[]), {id: Date.now(), concepto: 'Gasto Operativo', tipo: 'materiales', monto: 0}]})} className="w-full py-3 bg-purple-100 text-purple-700 font-bold rounded-xl mt-4 hover:bg-purple-200 transition-colors shadow-sm">+ Añadir Gasto Operativo</button>
             
             <div className="mt-6 space-y-3">
               {(data.inversiones||[]).filter(i => ['materiales','infraestructura','personal'].includes(i.tipo)).map(inv => (
                 <div key={inv.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <input type="text" className="flex-1 bg-transparent font-medium outline-none" value={inv.concepto} onChange={(e) => {
                      const newInv = [...data.inversiones];
                      const idx = newInv.findIndex(x => x.id === inv.id);
                      if (idx > -1) newInv[idx].concepto = e.target.value;
                      updateGlobalData({inversiones: newInv});
                    }} />
                    <div className="flex items-center gap-2">
                       <span className="text-slate-400 font-bold">Bs.</span>
                       <input type="number" className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right font-bold text-purple-700" value={inv.monto} onChange={(e) => {
                         const newInv = [...data.inversiones];
                         const idx = newInv.findIndex(x => x.id === inv.id);
                         if (idx > -1) newInv[idx].monto = parseFloat(e.target.value)||0;
                         updateGlobalData({inversiones: newInv});
                       }} />
                    </div>
                    <button onClick={() => updateGlobalData({inversiones: data.inversiones.filter(x => x.id !== inv.id)})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Resumen de Inversión Inicial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col justify-center">
                <h3 className="text-indigo-800 font-bold mb-2 uppercase text-xs tracking-wider">Inversión Fija y Diferida</h3>
                <p className="text-4xl font-black text-indigo-600">Bs. {totalInversion.toFixed(2)}</p>
             </div>
             <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col justify-center">
                <h3 className="text-emerald-800 font-bold mb-2 uppercase text-xs tracking-wider">Capital de Trabajo</h3>
                <p className="text-4xl font-black text-emerald-600">Bs. {costoTotalOp.toFixed(2)}</p>
             </div>
          </div>
          <div className="mt-8 p-6 bg-purple-600 rounded-2xl text-white text-center shadow-lg">
             <p className="text-purple-200 font-bold uppercase tracking-widest text-sm mb-2">Inversión Total Requerida</p>
             <p className="text-5xl font-black">Bs. {(totalInversion + costoTotalOp).toFixed(2)}</p>
          </div>
        </div>
      );
      case 5: case 7: case 9: case 11: case 13: case 15: case 17: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto text-center py-20">
          <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <Play size={48} className="ml-2" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">Video Explicativo</h2>
          <p className="text-slate-500 font-medium text-lg">Aprende los conceptos clave antes de continuar.</p>
        </div>
      );
      case 6: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Análisis de Costos Operativos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                <h3 className="text-red-800 font-bold mb-2 uppercase text-xs tracking-wider">Costos Fijos Mensuales</h3>
                <p className="text-4xl font-black text-red-600">Bs. {totalFijos.toFixed(2)}</p>
             </div>
             <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl text-center">
                <h3 className="text-orange-800 font-bold mb-2 uppercase text-xs tracking-wider">Costos Variables Mensuales</h3>
                <p className="text-4xl font-black text-orange-600">Bs. {cvTotal.toFixed(2)}</p>
             </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-3">Producción Mensual Estimada (unidades)</label>
            <input type="number" className="w-full p-4 border border-slate-300 rounded-xl text-lg font-bold" value={data.produccionMensual || 1} onChange={e => updateGlobalData({produccionMensual: parseInt(e.target.value)||1})} />
            <p className="text-sm text-slate-500 mt-3">Tu costo variable unitario es de <strong>Bs. {costoVariableUnitario.toFixed(2)}</strong> por unidad.</p>
          </div>
        </div>
      );
      case 8: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Fijación de Precios</h2>
          <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200">
             <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
               <span className="text-slate-600 font-medium">Costo Unitario Total:</span>
               <span className="text-2xl font-black text-slate-800">Bs. {costoUnitario.toFixed(2)}</span>
             </div>
             <label className="block text-sm font-bold text-slate-700 mb-3">¿Qué margen de ganancia deseas? (%)</label>
             <input type="number" className="w-full p-4 border border-slate-300 rounded-xl text-xl font-bold text-purple-700" value={data.porcentajeGanancia || 30} onChange={e => updateGlobalData({porcentajeGanancia: parseFloat(e.target.value)||0})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                <h3 className="text-indigo-800 font-bold mb-2 uppercase text-xs tracking-wider">Precio de Venta Sugerido</h3>
                <p className="text-4xl font-black text-indigo-600">Bs. {precioSinFactura.toFixed(2)}</p>
                <p className="text-xs text-indigo-500 mt-2">Sin impuestos (mercado informal)</p>
             </div>
             <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center shadow-md border-b-4 border-emerald-500">
                <h3 className="text-emerald-800 font-bold mb-2 uppercase text-xs tracking-wider">Precio Final al Público</h3>
                <p className="text-5xl font-black text-emerald-600">Bs. {precioFacturado.toFixed(2)}</p>
                <p className="text-xs text-emerald-700 mt-2 font-bold">Incluye margen + impuestos de ley</p>
             </div>
          </div>
        </div>
      );
      case 10: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Proyección de Ingresos Mensuales</h2>
          <div className="p-10 bg-emerald-50 rounded-3xl text-center border border-emerald-100 shadow-inner">
            <h3 className="text-emerald-800 font-bold mb-4 uppercase tracking-widest text-sm">Ventas Estimadas</h3>
            <p className="text-6xl font-black text-emerald-600 drop-shadow-sm">Bs. {ingresos.toFixed(2)}</p>
            <div className="mt-6 flex items-center justify-center gap-4 text-emerald-700 font-medium">
               <span>{numProd} unidades/mes</span>
               <span className="text-emerald-300">×</span>
               <span>Bs. {precioFacturado.toFixed(2)} c/u</span>
            </div>
          </div>
        </div>
      );
      case 12: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Proyección de Egresos Mensuales</h2>
          <div className="p-10 bg-red-50 rounded-3xl text-center border border-red-100 shadow-inner">
            <h3 className="text-red-800 font-bold mb-4 uppercase tracking-widest text-sm">Costos Operativos Totales</h3>
            <p className="text-6xl font-black text-red-600 drop-shadow-sm">Bs. {egresos.toFixed(2)}</p>
            <div className="mt-6 flex items-center justify-center gap-4 text-red-700 font-medium">
               <span>Bs. {totalFijos.toFixed(2)} (Fijos)</span>
               <span className="text-red-300">+</span>
               <span>Bs. {(numProd * costoVariableUnitario).toFixed(2)} (Variables)</span>
            </div>
          </div>
        </div>
      );
      case 14: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Utilidad Mensual Esperada</h2>
          <div className={\`p-10 rounded-3xl text-center shadow-inner border \${utilidadMensual > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}\`}>
            <h3 className={\`font-bold mb-4 uppercase tracking-widest text-sm \${utilidadMensual > 0 ? 'text-emerald-800' : 'text-red-800'}\`}>Resultado Neto (Ingresos - Egresos)</h3>
            <p className={\`text-6xl font-black drop-shadow-sm \${utilidadMensual > 0 ? 'text-emerald-600' : 'text-red-600'}\`}>
               {utilidadMensual > 0 ? '+' : ''}Bs. {utilidadMensual.toFixed(2)}
            </p>
            {utilidadMensual <= 0 && <p className="text-red-600 font-bold mt-4">⚠️ Estás perdiendo dinero. Ajusta tu precio o reduce costos.</p>}
          </div>
        </div>
      );
      case 16: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Punto de Equilibrio</h2>
          <p className="text-slate-500 mb-8 font-medium">El mínimo que debes vender cada mes solo para cubrir tus costos (sin ganar ni perder).</p>
          <div className="p-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-center shadow-xl text-white">
            <p className="text-blue-200 font-bold uppercase tracking-widest text-sm mb-4">Meta de Supervivencia</p>
            <p className="text-8xl font-black drop-shadow-lg">{puntoEquilibrio}</p>
            <p className="text-white font-medium text-xl mt-4">Unidades al mes</p>
          </div>
        </div>
      );
      case 18: {
        const inversionInicial = totalInversion + costoTotalOp;
        
        const flujos = Array.from({length: data.mesesProyeccion || 6}, (_, i) => i + 1).map(mes => {
            const multiplicador = 1 + ((mes - 1) * 0.10);
            const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
            const ingresos = unidades * (precioFacturado || 0);
            const vars = unidades * costoVariableUnitario;
            const gastos = totalFijos + vars;
            const uBruta = ingresos - gastos;
            const impuestos = ingresos * 0.16;
            return uBruta - impuestos;
        });
        
        const tasaDescuentoMensual = (data.tasaDescuento || 0) / 100 / 12;
        
        let van = -inversionInicial;
        flujos.forEach((flujo, index) => {
            van += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
        });

        let tir = 0;
        let tir_anual = 0;
        if (inversionInicial > 0 && flujos.some(f => f > 0)) {
            let low = -0.5;
            let high = 1.0;
            for(let i=0; i<100; i++) {
                let mid = (low + high) / 2;
                let npv = -inversionInicial;
                flujos.forEach((flujo, index) => {
                    npv += flujo / Math.pow(1 + mid, index + 1);
                });
                if (npv > 0) low = mid;
                else high = mid;
            }
            tir = low;
            tir_anual = (Math.pow(1 + tir, 12) - 1) * 100;
        }

        return (
          <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR</h2>
                  <p className="text-slate-500 font-medium">Calcula si el proyecto genera valor por encima de lo esperado.</p>
                </div>
              </div>
              
              <button 
                onClick={handleGenerarIA}
                disabled={isGeneratingIA}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[200px]"
              >
                {isGeneratingIA ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Autocompletar con IA
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg text-center mb-8">
              <h3 className="text-2xl font-bold text-purple-100 mb-6">Tasa de Descuento (TMAR)</h3>
              <p className="text-sm text-purple-200 mb-4 max-w-xl mx-auto">¿Cuánto porcentaje de rentabilidad anual le exiges a este proyecto para que valga la pena el riesgo?</p>
              <div className="flex items-center justify-center gap-2">
                <input type="number" min="0" max="100" className="w-32 bg-white/10 p-4 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center" value={data.tasaDescuento === 0 ? 0 : (data.tasaDescuento || '')} onChange={e => updateGlobalData({ tasaDescuento: e.target.value === '' ? '' : (parseFloat(e.target.value) || 0) })} />
                <span className="text-4xl font-bold text-purple-200">% anual</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Actual Neto (VAN)</div>
                <div className="text-slate-400 text-sm mb-4">Mide cuánto dinero 'extra' generas en valor de hoy. Debe ser mayor a cero.</div>
                <div className={\`text-4xl font-black \${van >= 0 ? 'text-emerald-500' : 'text-red-500'}\`}>
                  Bs. {van.toFixed(2)}
                </div>
                <div className="mt-4 font-bold text-sm">
                  {van > 0
                    ? <span className="text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">¡El proyecto es Rentable! 🎉</span>
                    : <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">El proyecto destruye valor ⚠️</span>
                  }
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tasa Interna de Retorno (TIR)</div>
                <div className="text-slate-400 text-sm mb-4">Es la rentabilidad real anual que te da el proyecto. Debe ser mayor a la TMAR.</div>
                <div className={\`text-4xl font-black \${tir_anual >= (data.tasaDescuento || 0) ? 'text-emerald-500' : 'text-red-500'}\`}>
                  {tir_anual.toFixed(2)} %
                </div>
                <div className="mt-4 font-bold text-sm">
                  {tir_anual >= (data.tasaDescuento || 0)
                    ? <span className="text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Rinde más de lo exigido 🚀</span>
                    : <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">No alcanza la tasa exigida 📉</span>
                  }
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
      faseTitle="Fase 10: Viabilidad y Sostenibilidad"
      pasoActual={step}
      totalPasos={18}
      tabs={[
        { id: 1, icon: <Play size={16} />, label: 'V. Inversión' },
        { id: 2, icon: <Wallet size={16} />, label: 'Cap. Inversión' },
        { id: 3, icon: <Package size={16} />, label: 'Cap. Trabajo' },
        { id: 4, icon: <Wallet size={16} />, label: 'Resumen' },
        { id: 5, icon: <Play size={16} />, label: 'V. Costos' },
        { id: 6, icon: <Calculator size={16} />, label: 'Costos' },
        { id: 7, icon: <Play size={16} />, label: 'V. Precio Venta' },
        { id: 8, icon: <Calculator size={16} />, label: 'Precio Venta' },
        { id: 9, icon: <Play size={16} />, label: 'V. Proy. Gan' },
        { id: 10, icon: <TrendingUp size={16} />, label: 'Proy. Gan' },
        { id: 11, icon: <Play size={16} />, label: 'V. Gastos' },
        { id: 12, icon: <Wallet size={16} />, label: 'Proy. Gastos' },
        { id: 13, icon: <Play size={16} />, label: 'V. Utilidad' },
        { id: 14, icon: <TrendingUp size={16} />, label: 'Utilidad' },
        { id: 15, icon: <Play size={16} />, label: 'V. Equilibrio' },
        { id: 16, icon: <Calculator size={16} />, label: 'Equilibrio' },
        { id: 17, icon: <Play size={16} />, label: 'V. Evaluación' },
        { id: 18, icon: <TrendingUp size={16} />, label: 'VAN y TIR' }
      ]}
      onTabClick={(id) => {
        if (setPendingSave) setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => step < 18 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 ? "Comprender qué necesitas comprar antes de abrir es vital para no quedarte sin dinero a mitad del camino." :
        step === 2 ? "Usa la caja de herramientas para listar tus activos fijos y diferidos (Capital de Inversión)." :
        step === 3 ? "Ingresa aquí el capital de trabajo: materia prima, insumos, sueldos y gastos de arranque." :
        step === 4 ? "Aquí puedes ver el resumen total de todo lo que necesitas para arrancar tu negocio." :
        step === 5 ? "Fijar un precio correcto garantiza que cubras tus costos y generes ganancias." :
        step === 6 ? "Usa tu costo unitario y define el margen de ganancia ideal para fijar tu precio con y sin factura." :
        step === 7 ? "Diferenciar entre lo que pagas fijo cada mes y lo que varía según tus ventas es la clave para fijar precios." :
        step === 8 ? "Clasifica tus costos en fijos y variables para entender tu estructura." :
        step === 9 ? "Proyectar ganancias te permite ver el futuro financiero de tu negocio." :
        step === 10 ? "Mira cómo se acumulan tus ganancias proyectadas a lo largo del tiempo." :
        step === 11 ? "Así como hay ingresos, hay gastos. Proyectarlos es vital." :
        step === 12 ? "Estima tus gastos fijos y variables a lo largo de los meses." :
        step === 13 ? "La utilidad bruta son tus ingresos menos tus costos directos. Aún faltan los impuestos." :
        step === 14 ? "Aplica el porcentaje de impuestos de tu país para obtener la verdadera Utilidad Neta." :
        step === 15 ? "El punto de equilibrio es tu meta de supervivencia. Descubre qué es." :
        step === 16 ? "¡Descubre cuántas unidades necesitas vender al mes solo para no perder dinero!" :
        step === 17 ? "El VAN y la TIR son los jueces finales. Determinan si tu idea es un buen negocio." :
        "Juega con la tasa de descuento para ver si tu proyecto genera valor a futuro."
      }
      guardando={guardando}
    >
      <div onBlur={() => { if (typeof setPendingSave === 'function') setPendingSave(true); }}>
        {getPasoContent()}
      </div>
    </PasoLayout>
  );
};

export default Fase10_PlanFinanciero;
\`;

fs.writeFileSync(filePath, content);
console.log("Completely rebuilt the file from scratch!");
