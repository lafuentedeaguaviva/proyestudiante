import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StepNavigation from '../components/ui/StepNavigation';
import { useFase10Controller } from '../controllers/useFase10Controller';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingUp, Plus, Trash2, Calculator, Info, Package, Play, Bot, Sparkles, AlertTriangle, Lightbulb, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { generarPlanFinancieroIA, generarConsejosDemandaIA } from '../services/api';

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
      constitucion: { nombre: 'Gastos de Constitución', items: ['Licencia de funcionamiento', 'NIT', 'Permisos'] },
      intangibles: { nombre: 'Intangibles', items: ['Software / Sistemas', 'Registro de marca', 'Capacitación'] },
      otros: { nombre: 'Otros', items: ['Garantías de alquiler', 'Publicidad inicial'] }
    }
  },
  materiales: {
    nombre: 'Materiales e Insumos',
    subgrupos: {
      materiales: { nombre: 'Materiales', items: ['Materia prima principal', 'Componentes'] },
      insumos: { nombre: 'Insumos', items: ['Empaques y embalajes', 'Etiquetas', 'Pegamento', 'Insumos varios'] }
    }
  },
  infraestructura: {
    nombre: 'Infraestructura y Servicios',
    subgrupos: {
      servicios: { nombre: 'Servicios', items: ['Luz / Energía eléctrica', 'Agua', 'Internet', 'Gas'] },
      alquileres: { nombre: 'Alquileres', items: ['Alquiler del local', 'Alquiler de maquinaria'] },
      otros: { nombre: 'Otros', items: ['Mantenimiento', 'Limpieza', 'Seguros'] }
    }
  },
  personal: {
    nombre: 'Personal / Mano de Obra',
    subgrupos: {
      operativo: { nombre: 'Operativo', items: ['Operario de producción', 'Ayudante'] },
      administrativo: { nombre: 'Administrativo', items: ['Gerente', 'Vendedor', 'Asesor Legal'] }
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
    demandaPotencialFase4,
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
    if (typeof setPendingSave === 'function') setPendingSave(true);
  };

  const getCajaHerramientas = () => {
    const base = JSON.parse(JSON.stringify(cajaHerramientas));
    return base;
  };

  const [isGeneratingIA, setIsGeneratingIA] = useState(false);
  const [consejosIA, setConsejosIA] = useState(null);
  const [cargandoConsejosIA, setCargandoConsejosIA] = useState(false);

  const handleObtenerConsejosIA = async (datosFin) => {
    setCargandoConsejosIA(true);
    try {
      const dbDataStr = localStorage.getItem('datosFases');
      let ctx = "Proyecto de emprendimiento.";
      if (dbDataStr) {
        try {
          const dbFases = JSON.parse(dbDataStr);
          const fbProblem = dbFases[2]?.problema || "";
          const fbIdea = dbFases[1]?.idea_ganadora || dbFases[4]?.nombreProducto || "";
          const fbSeg = dbFases[3]?.segmento || dbFases[3]?.publico_objetivo || "";
          ctx = `Problema: ${fbProblem}. Idea: ${fbIdea}. Público: ${fbSeg}.`;
        } catch (e) {}
      }
      const res = await generarConsejosDemandaIA(ctx, datosFin);
      setConsejosIA(res);
    } catch (e) {
      console.error(e);
      alert("No se pudo obtener las recomendaciones de la IA: " + e.message);
    } finally {
      setCargandoConsejosIA(false);
    }
  };

  const handleLimpiarTablas = () => {
    if (window.confirm("⚠️ ADVERTENCIA: Esta acción borrará TODO el plan financiero actual (inversiones, precios, proyecciones, etc.). Perderás todos tus datos. ¿Estás completamente seguro de continuar?")) {
      updateGlobalData({
        ...data,
        inversiones: [],
        precios: { precioSinFactura: 0, precioFacturado: 0, porcentajeGanancia: 0 },
        proyecciones: [],
        puntoEquilibrio: 0,
        produccionMensual: 1,
        porcentajeGanancia: 30
      });
      if (typeof setPendingSave === 'function') setPendingSave(true);
    }
  };

  const handleGenerarIA = async () => {
    if (!window.confirm("⚠️ ADVERTENCIA: La IA completará tus tablas basándose en lo que ya tienes, pudiendo modificar precios en cero y agregar nuevos ítems. ¿Deseas continuar?")) {
      return;
    }
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
          
          const fase7 = dbFases[7] || {};
          const fbObjGeneral = fase7.objGeneral || `${fase7.obj_verbo || ''} ${fase7.obj_producto || ''} para ${fase7.obj_publico || ''} ${fase7.obj_ubicacion || ''} ${fase7.obj_plazo || ''}`.trim();

          ctx = `Problema: ${fbProblem}. Idea: ${fbIdea}. Público: ${fbSeg}. Objetivo General: ${fbObjGeneral}`;
        } catch (e) { }
      }

      const inversionesActuales = data.inversiones || [];
      if (inversionesActuales.length > 0) {
        const resumenInversiones = inversionesActuales.map(i => `- ${i.concepto} (tipo: ${i.tipo}, cant: ${i.cantidad || 1}, precio: ${i.precio || 0})`).join('\n');
        ctx += `\nEl usuario YA HA AÑADIDO estas inversiones/costos:\n${resumenInversiones}\nPOR FAVOR INCLUYE ESTOS MISMOS ELEMENTOS EN TU RESPUESTA FINAL (puedes ajustarles el precio si era 0 para que sean realistas) Y COMPLÉTALOS agregando MÁS cosas necesarias alineadas al proyecto.`;
      } else {
        ctx += `\nEl usuario no ha añadido ninguna inversión aún. Genera todas las necesarias.`;
      }

      const res = await generarPlanFinancieroIA(ctx);
      if (res) {
        updateGlobalData({
          ...data,
          inversiones: res.inversiones || [],
          precios: res.precios || {},
          proyecciones: res.proyecciones || [],
          puntoEquilibrio: res.puntoEquilibrio || 0,
          produccionMensual: res.produccionMensual || demandaPotencialFase4 || data.produccionMensual || 1,
          porcentajeGanancia: res.porcentajeGanancia || data.porcentajeGanancia || 30,
          tasaDescuento: 13
        });
        if (typeof setPendingSave === 'function') setPendingSave(true);
      }
    } catch (e) {
      console.error(e);
      alert("Error al generar con IA: " + e.message);
    } finally {
      setIsGeneratingIA(false);
    }
  };

  if (cargando) return <LoadingSpinner text="Cargando Plan Financiero..." className="min-h-screen" />;

  const getPasoContent = () => {
    const inversionesLoc = data?.inversiones || [];
    const costosOpeGlobal = inversionesLoc.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));
    const cfTotal = costosOpeGlobal.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
    const cvTotal = costosOpeGlobal.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
    const totalFijos = cfTotal;
    const numProdGlobal = parseInt(data?.produccionMensual) || 1;
    const costoVariableUnitario = cvTotal / numProdGlobal;

    // Financial calculations needed for step 8, 12, 16...
    const numProd = parseInt(data?.produccionMensual) || 1;
    const costoTotalOp = data?.inversiones?.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo)).reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
    const costoUnitario = costoTotalOp / numProd;
    const margen = parseFloat(data?.porcentajeGanancia || 30);
    const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
    const precioFacturado = precioSinFactura / 0.84;

    const precioVentaEfectivo = (data?.precios?.precioFacturado && parseFloat(data.precios.precioFacturado) > 0)
      ? parseFloat(data.precios.precioFacturado)
      : (data?.precioVenta && parseFloat(data.precioVenta) > 0)
        ? parseFloat(data.precioVenta)
        : precioFacturado;

    const margenContribucion = precioVentaEfectivo - costoVariableUnitario;
    const puntoEquilibrio = margenContribucion > 0 ? Math.ceil(totalFijos / margenContribucion) : 0;
    const ingresos = numProd * precioVentaEfectivo;
    const egresos = totalFijos + (numProd * costoVariableUnitario);
    const utilidadMensual = ingresos - egresos;

    const totalInversion = data?.inversiones?.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;

    switch (step) {
      case 1: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Inversiones</h2>
              <p className="text-slate-500 font-medium">Aprende qué necesitas para arrancar tu proyecto.</p>
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
          {/* Columna Izquierda: Caja de herramientas */}
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Caja de Herramientas</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Selecciona los activos que necesitas para tu negocio:</p>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-medium">
              <button onClick={() => { setToolboxCategory('activoFijo'); setToolboxSubcategory(Object.keys(cajaHerramientas.activoFijo.subgrupos)[0]); }} className={`flex-1 p-2 rounded-lg ${toolboxCategory === 'activoFijo' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>Activos Fijos</button>
              <button onClick={() => { setToolboxCategory('activoDiferido'); setToolboxSubcategory(Object.keys(cajaHerramientas.activoDiferido.subgrupos)[0]); }} className={`flex-1 p-2 rounded-lg ${toolboxCategory === 'activoDiferido' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500'}`}>Diferidos</button>
            </div>

            {toolboxCategory && cajaHerramientas[toolboxCategory] && (
              <div className="space-y-3 mb-4 animate-fade-in">
                {Object.entries(getCajaHerramientas()[toolboxCategory].subgrupos).map(([key, sub]) => (
                  <div key={key} className="flex flex-col">
                    <button
                      onClick={() => setToolboxSubcategory(toolboxSubcategory === key ? null : key)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex justify-between items-center ${toolboxSubcategory === key ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-sm rounded-b-none' : 'border-slate-200 bg-white text-slate-600 hover:border-purple-300'}`}
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

          {/* Columna Derecha: Lista de Inversiones */}
          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Capital de Inversión</h2>
                <p className="text-slate-500 font-medium">Usa la caja de herramientas para añadir tus activos.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">

              <div className="flex flex-col gap-6">

                {/* Activos Fijos */}
                <div>
                  <h3 className="text-lg font-bold text-emerald-700 mb-3 border-b border-emerald-100 pb-2">Activos Fijos</h3>
                  {data.inversiones.filter(i => i.tipo === 'fijo').length === 0 ? (
                    <div className="text-center py-4 text-slate-400 font-medium text-sm">Sin items de activos fijos.</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="hidden sm:flex flex-row gap-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="flex-1">Concepto</div>
                        <div className="flex gap-2">
                          <div className="w-16 text-center">Cant.</div>
                          <div className="w-24 text-center">Precio Unit.</div>
                          <div className="w-24 text-right">Subtotal</div>
                          <div className="w-7"></div>
                        </div>
                      </div>
                      {data.inversiones.map((inv, i) => inv.tipo === 'fijo' && (
                        <div key={inv.id} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                          <input className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold text-sm focus:border-emerald-400 outline-none" placeholder="Concepto" value={inv.concepto} onChange={e => { const n = [...data.inversiones]; n[i].concepto = e.target.value; updateGlobalData({ inversiones: n }); }} />
                          <div className="flex gap-2">
                            <input type="number" min="1" placeholder="Cant." className="w-16 bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold text-sm focus:border-emerald-400 outline-none" value={inv.cantidad ?? 1} onChange={e => { const n = [...data.inversiones]; n[i].cantidad = e.target.value === '' ? '' : (parseInt(e.target.value) || 1); n[i].precio = n[i].precio ?? n[i].monto ?? 0; n[i].monto = n[i].cantidad * n[i].precio; updateGlobalData({ inversiones: n }); }} />
                            <input type="number" min="0" placeholder="Precio Bs." className="w-24 bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold text-sm focus:border-emerald-400 outline-none" value={inv.precio ?? inv.monto ?? ''} onChange={e => { const n = [...data.inversiones]; n[i].precio = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0); n[i].cantidad = n[i].cantidad ?? 1; n[i].monto = n[i].cantidad * n[i].precio; updateGlobalData({ inversiones: n }); }} />
                            <div className="w-24 bg-slate-100 p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-500 text-right shrink-0">{(inv.monto || 0).toFixed(2)}</div>
                            <button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now(), concepto: '', cantidad: 1, precio: 0, monto: 0, tipo: 'fijo' }] })} className="mt-2 text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1"><Plus size={14} /> Añadir Activo Fijo</button>
                </div>

                {/* Activos Diferidos */}
                <div>
                  <h3 className="text-lg font-bold text-purple-700 mb-3 border-b border-purple-100 pb-2 mt-4">Activos Diferidos / Intangibles</h3>
                  {data.inversiones.filter(i => i.tipo === 'diferido').length === 0 ? (
                    <div className="text-center py-4 text-slate-400 font-medium text-sm">Sin items de activos diferidos.</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="hidden sm:flex flex-row gap-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="flex-1">Concepto</div>
                        <div className="flex gap-2">
                          <div className="w-16 text-center">Cant.</div>
                          <div className="w-24 text-center">Precio Unit.</div>
                          <div className="w-24 text-right">Subtotal</div>
                          <div className="w-7"></div>
                        </div>
                      </div>
                      {data.inversiones.map((inv, i) => inv.tipo === 'diferido' && (
                        <div key={inv.id} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                          <input className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold text-sm focus:border-purple-400 outline-none" placeholder="Concepto" value={inv.concepto} onChange={e => { const n = [...data.inversiones]; n[i].concepto = e.target.value; updateGlobalData({ inversiones: n }); }} />
                          <div className="flex gap-2">
                            <input type="number" min="1" placeholder="Cant." className="w-16 bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold text-sm focus:border-purple-400 outline-none" value={inv.cantidad ?? 1} onChange={e => { const n = [...data.inversiones]; n[i].cantidad = e.target.value === '' ? '' : (parseInt(e.target.value) || 1); n[i].precio = n[i].precio ?? n[i].monto ?? 0; n[i].monto = n[i].cantidad * n[i].precio; updateGlobalData({ inversiones: n }); }} />
                            <input type="number" min="0" placeholder="Precio Bs." className="w-24 bg-slate-50 p-2 rounded-lg border border-slate-200 font-bold text-sm focus:border-purple-400 outline-none" value={inv.precio ?? inv.monto ?? ''} onChange={e => { const n = [...data.inversiones]; n[i].precio = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0); n[i].cantidad = n[i].cantidad ?? 1; n[i].monto = n[i].cantidad * n[i].precio; updateGlobalData({ inversiones: n }); }} />
                            <div className="w-24 bg-slate-100 p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-500 text-right shrink-0">{(inv.monto || 0).toFixed(2)}</div>
                            <button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now(), concepto: '', cantidad: 1, precio: 0, monto: 0, tipo: 'diferido' }] })} className="mt-2 text-purple-600 font-bold text-sm hover:underline flex items-center gap-1"><Plus size={14} /> Añadir Activo Diferido</button>
                </div>

              </div>

              <div className="mt-8 bg-emerald-600 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
                <div>
                  <span className="block text-emerald-100 font-medium">Subtotal Capital de Inversión</span>
                </div>
                <div className="text-3xl md:text-4xl font-black">Bs. {(data.inversiones.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0)).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Caja de Herramientas</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Añade los elementos de tu capital de operación:</p>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-medium">
              <button onClick={() => { setToolboxCategory('materiales'); setToolboxSubcategory(Object.keys(cajaHerramientas.materiales.subgrupos)[0]); }} className={`flex-1 p-2 rounded-lg ${toolboxCategory === 'materiales' ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'}`}>Materiales</button>
              <button onClick={() => { setToolboxCategory('infraestructura'); setToolboxSubcategory(Object.keys(cajaHerramientas.infraestructura.subgrupos)[0]); }} className={`flex-1 p-2 rounded-lg ${toolboxCategory === 'infraestructura' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500'}`}>Infraestructura</button>
              <button onClick={() => { setToolboxCategory('personal'); setToolboxSubcategory(Object.keys(cajaHerramientas.personal.subgrupos)[0]); }} className={`flex-1 p-2 rounded-lg ${toolboxCategory === 'personal' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500'}`}>Personal</button>
            </div>

            <div className="space-y-3 mb-4 animate-fade-in">
              {toolboxCategory && cajaHerramientas[toolboxCategory] && Object.entries(getCajaHerramientas()[toolboxCategory].subgrupos).map(([key, sub]) => (
                <div key={key} className="flex flex-col">
                  <button
                    onClick={() => setToolboxSubcategory(toolboxSubcategory === key ? null : key)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex justify-between items-center ${toolboxSubcategory === key ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm rounded-b-none' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'}`}
                  >
                    {sub.nombre}
                    <span className="text-xl leading-none text-amber-600">{toolboxSubcategory === key ? '−' : '+'}</span>
                  </button>
                  {toolboxSubcategory === key && (
                    <div className="bg-slate-50 p-4 border border-t-0 border-amber-200 rounded-b-xl animate-fade-in">
                      <div className="flex flex-wrap gap-2">
                        {sub.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const tipo = toolboxCategory;
                              updateGlobalData({
                                inversiones: [...data.inversiones, { id: Date.now() + idx, concepto: item, cantidad: 1, precio: 0, monto: 0, tipo }]
                              });
                            }}
                            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:border-amber-400 hover:text-amber-700 transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Plus size={14} /> {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 bg-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>
                <p className="text-slate-500 font-medium">Gastos operativos iniciales.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">

              <div className="flex justify-end mb-6">
                <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm max-w-full">
                  <span className="text-sm font-bold text-slate-600 truncate">Producción o Servicios / mes:</span>
                  <input
                    type="number"
                    min="0"
                    className="w-24 bg-slate-50 p-1.5 rounded-lg border border-slate-200 font-bold text-md focus:border-amber-400 outline-none text-center text-amber-700 shrink-0"
                    placeholder="0"
                    value={data.produccionMensual || ''}
                    onChange={e => updateGlobalData({ produccionMensual: e.target.value === '' ? '' : (parseInt(e.target.value) || 0) })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">

                {/* TABLA 1: MATERIALES E INSUMOS */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
                    a. Determinamos los costos de materiales e insumos necesarios para producción.
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Artículos</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24">Cantidad</th>
                          <th className="p-2 border-r border-slate-300 text-center w-32">Costo por Unidad</th>
                          <th className="p-2 text-center w-32">Costo total</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'materiales').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200">
                            <td className="p-1 border-r border-slate-300">
                              <input className="w-full p-2 outline-none focus:bg-amber-50" placeholder="Ej. Harina" value={inv.concepto} onChange={e => { updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, concepto: e.target.value } : x) }); }} />
                            </td>
                            <td className="p-1 border-r border-slate-300">
                              <input type="number" min="1" className="w-full p-2 outline-none text-center focus:bg-amber-50" value={inv.cantidad ?? 1} onChange={e => { const cant = e.target.value === '' ? '' : (parseInt(e.target.value) || 1); updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, cantidad: cant, monto: cant * (x.precio || 0) } : x) }); }} />
                            </td>
                            <td className="p-1 border-r border-slate-300">
                              <input type="number" min="0" className="w-full p-2 outline-none text-center focus:bg-amber-50" value={inv.precio ?? inv.monto ?? ''} onChange={e => { const prec = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0); updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, precio: prec, monto: (x.cantidad || 1) * prec } : x) }); }} />
                            </td>
                            <td className="p-2 text-center font-bold text-slate-600">
                              {(inv.monto || 0).toFixed(2)}
                            </td>
                            <td className="p-1 text-center">
                              <button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                        {data.inversiones.filter(i => i.tipo === 'materiales').length === 0 && (
                          <tr><td colSpan="5" className="p-4 text-center text-slate-400">Sin artículos. Usa la caja de herramientas o añade uno manual.</td></tr>
                        )}
                        <tr className="bg-slate-50 border-t-2 border-slate-300">
                          <td colSpan="3" className="p-2 text-right font-medium text-slate-700">Total, costo materiales e insumos de producción</td>
                          <td className="p-2 text-center font-bold text-amber-700">
                            {data.inversiones.filter(i => i.tipo === 'materiales').reduce((acc, curr) => acc + (curr.monto || 0), 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now(), concepto: '', cantidad: 1, precio: 0, monto: 0, tipo: 'materiales' }] })} className="mt-2 text-amber-600 font-bold text-sm hover:underline flex items-center gap-1"><Plus size={14} /> Añadir Artículo</button>
                </div>

                {/* TABLA 2: INFRAESTRUCTURA Y SERVICIOS */}
                <div className="mt-4">
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
                    b. Determinamos los costos por infraestructura y servicios.
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Detalle</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24">Cantidad</th>
                          <th className="p-2 border-r border-slate-300 text-center w-32">Costo Mensual (Bs.)</th>
                          <th className="p-2 text-center w-32">Total, Anual (Bs.)</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'infraestructura').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200">
                            <td className="p-1 border-r border-slate-300">
                              <input className="w-full p-2 outline-none focus:bg-emerald-50" placeholder="Ej. Alquiler" value={inv.concepto} onChange={e => { updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, concepto: e.target.value } : x) }); }} />
                            </td>
                            <td className="p-1 border-r border-slate-300">
                              <input type="number" min="1" className="w-full p-2 outline-none text-center focus:bg-emerald-50" value={inv.cantidad ?? 1} onChange={e => { const cant = e.target.value === '' ? '' : (parseInt(e.target.value) || 1); updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, cantidad: cant, monto: cant * (x.precio || 0) } : x) }); }} />
                            </td>
                            <td className="p-1 border-r border-slate-300">
                              <input type="number" min="0" className="w-full p-2 outline-none text-center focus:bg-emerald-50" value={inv.precio ?? inv.monto ?? ''} onChange={e => { const prec = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0); updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, precio: prec, monto: (x.cantidad || 1) * prec } : x) }); }} />
                            </td>
                            <td className="p-2 text-center font-bold text-slate-600">
                              {((inv.monto || 0) * 12).toFixed(2)}
                            </td>
                            <td className="p-1 text-center">
                              <button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                        {data.inversiones.filter(i => i.tipo === 'infraestructura').length === 0 && (
                          <tr><td colSpan="5" className="p-4 text-center text-slate-400">Sin detalles. Usa la caja de herramientas o añade uno manual.</td></tr>
                        )}
                        <tr className="bg-slate-50 border-t-2 border-slate-300">
                          <td colSpan="3" className="p-2 text-right font-medium text-slate-700">Total, costo infraestructura y servicio</td>
                          <td className="p-2 text-center font-bold text-emerald-700">
                            {data.inversiones.filter(i => i.tipo === 'infraestructura').reduce((acc, curr) => acc + ((curr.monto || 0) * 12), 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now(), concepto: '', cantidad: 1, precio: 0, monto: 0, tipo: 'infraestructura' }] })} className="mt-2 text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1"><Plus size={14} /> Añadir Detalle</button>
                </div>

                {/* TABLA 3: PERSONAL O MANO DE OBRA */}
                <div className="mt-4">
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
                    c. Determinamos los costos de personal o mano de obra.
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Personal/Cargo</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24">Cantidad</th>
                          <th className="p-2 border-r border-slate-300 text-center w-36">Costo O Sueldo Mensual (Bs.)</th>
                          <th className="p-2 text-center w-32">Total, Anual (Bs.)</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'personal').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200">
                            <td className="p-1 border-r border-slate-300">
                              <input className="w-full p-2 outline-none focus:bg-indigo-50" placeholder="Ej. Vendedor" value={inv.concepto} onChange={e => { updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, concepto: e.target.value } : x) }); }} />
                            </td>
                            <td className="p-1 border-r border-slate-300">
                              <input type="number" min="1" className="w-full p-2 outline-none text-center focus:bg-indigo-50" value={inv.cantidad ?? 1} onChange={e => { const cant = e.target.value === '' ? '' : (parseInt(e.target.value) || 1); updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, cantidad: cant, monto: cant * (x.precio || 0) } : x) }); }} />
                            </td>
                            <td className="p-1 border-r border-slate-300">
                              <input type="number" min="0" className="w-full p-2 outline-none text-center focus:bg-indigo-50" value={inv.precio ?? inv.monto ?? ''} onChange={e => { const prec = e.target.value === '' ? '' : (parseFloat(e.target.value) || 0); updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, precio: prec, monto: (x.cantidad || 1) * prec } : x) }); }} />
                            </td>
                            <td className="p-2 text-center font-bold text-slate-600">
                              {((inv.monto || 0) * 12).toFixed(2)}
                            </td>
                            <td className="p-1 text-center">
                              <button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                        {data.inversiones.filter(i => i.tipo === 'personal').length === 0 && (
                          <tr><td colSpan="5" className="p-4 text-center text-slate-400">Sin personal. Usa la caja de herramientas o añade uno manual.</td></tr>
                        )}
                        <tr className="bg-slate-50 border-t-2 border-slate-300">
                          <td colSpan="3" className="p-2 text-right font-medium text-slate-700">Total, costo de personal</td>
                          <td className="p-2 text-center font-bold text-indigo-700">
                            {data.inversiones.filter(i => i.tipo === 'personal').reduce((acc, curr) => acc + ((curr.monto || 0) * 12), 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now(), concepto: '', cantidad: 1, precio: 0, monto: 0, tipo: 'personal' }] })} className="mt-2 text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"><Plus size={14} /> Añadir Cargo</button>
                </div>

                <div className="mt-8 bg-slate-800 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
                  <div>
                    <span className="block text-slate-300 font-medium">Subtotal Capital de Trabajo</span>
                    <span className="text-sm text-slate-400">Materiales + Infraestructura + Personal (Mensualizado)</span>
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-amber-400">
                    Bs. {data.inversiones.filter(i => i.tipo === 'materiales' || i.tipo === 'infraestructura' || i.tipo === 'personal').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 4: {
        const invFija = data.inversiones.filter(i => i.tipo === 'fijo').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const invDiferida = data.inversiones.filter(i => i.tipo === 'diferido').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const capOperacion = data.inversiones.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo)).reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);

        const invTotal = invFija + invDiferida + capOperacion;

        return (
          <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Resumen de Inversión</h2>
                <p className="text-slate-500 font-medium">Desglose total de lo que necesitas para iniciar.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-center shadow-sm">
              <div>
                <span className="text-slate-500 font-bold block uppercase tracking-wider text-sm">Inversión Total Requerida</span>
                <span className="text-xs text-slate-400 block mt-1">(Capital de Inversión + Capital de Trabajo)</span>
              </div>
              <div className="text-3xl font-black text-slate-800 mt-2 sm:mt-0">
                Bs. {invTotal.toFixed(2)}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-emerald-800">Activos Fijos</h3>
                  <p className="text-xs text-emerald-600">Maquinaria, muebles, vehículos, etc.</p>
                </div>
                <div className="text-xl font-black text-emerald-700">Bs. {invFija.toFixed(2)}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-purple-800">Activos Diferidos</h3>
                  <p className="text-xs text-purple-600">Gastos legales, patentes, software, etc.</p>
                </div>
                <div className="text-xl font-black text-purple-700">Bs. {invDiferida.toFixed(2)}</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-amber-800">Capital de Trabajo</h3>
                  <p className="text-xs text-amber-600">Materiales, servicios y personal.</p>
                </div>
                <div className="text-xl font-black text-amber-700">Bs. {capOperacion.toFixed(2)}</div>
              </div>
            </div>

          </div>
        );
      }

      case 5: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Costos Fijos y Variables</h2>
              <p className="text-slate-500 font-medium">La clave para fijar precios y calcular ganancias.</p>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1000" alt="Costos" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-indigo-800 mb-3 flex items-center gap-2">
                Costos Variables (Paso 6.1)
              </h3>
              <p className="text-indigo-700 text-sm leading-relaxed mb-4">
                Gastos que cambian dependiendo de cuánto produzcas o vendas (ej. materia prima por unidad).
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-2">
                Costos Fijos (Paso 6.2)
              </h3>
              <p className="text-amber-700 text-sm leading-relaxed mb-4">
                Gastos que debes pagar cada mes sin importar si vendes mucho o no vendes nada (ej. alquiler, internet).
              </p>
            </div>
          </div>
        </div>
      );

      case 6: {
        const costosOpe = data.inversiones.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));

        const cfTotal = costosOpe.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const cvTotal = costosOpe.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);

        const renderAutoCostRow = (inv) => {
          const isVariable = (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable';
          const monto = parseFloat(inv.monto) || 0;

          return (
            <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-3 font-medium text-slate-700 border-r border-slate-100">
                <span className="block">{inv.concepto}</span>
                <span className="text-xs text-slate-400 uppercase">{inv.tipo}</span>
              </td>
              <td className="p-3 border-r border-slate-100 text-center">
                <select
                  value={isVariable ? 'variable' : 'fijo'}
                  onChange={(e) => updateGlobalData({ inversiones: data.inversiones.map(x => x.id === inv.id ? { ...x, comportamiento: e.target.value } : x) })}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold border outline-none cursor-pointer text-center ${!isVariable ? 'bg-amber-50 text-amber-700 border-amber-200 focus:border-amber-400' : 'bg-indigo-50 text-indigo-700 border-indigo-200 focus:border-indigo-400'}`}
                >
                  <option value="fijo">Costo Fijo</option>
                  <option value="variable">Costo Variable</option>
                </select>
              </td>
              <td className={`p-3 text-right font-bold ${isVariable ? 'text-indigo-600' : 'text-amber-600'} bg-slate-50/50`}>
                {monto.toFixed(2)}
              </td>
            </tr>
          );
        };

        return (
          <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Estructura de Costos</h2>
                <p className="text-slate-500 font-medium">Clasifica tus costos operativos entre Fijos o Variables.</p>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-bold text-slate-500">
                    <th className="p-3 border-r border-slate-200 w-1/2">Descripción (Desde Capital Trabajo)</th>
                    <th className="p-3 text-center border-r border-slate-200 w-1/4">Tipo de Costo</th>
                    <th className="p-3 text-right bg-slate-50/50">Costo (Bs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {costosOpe.length === 0 && (
                    <tr><td colSpan="3" className="p-8 text-center text-slate-400 font-medium">No hay costos operativos registrados. Llena primero el Capital de Trabajo.</td></tr>
                  )}
                  {costosOpe.map(renderAutoCostRow)}
                </tbody>
                <tfoot className="bg-purple-600 text-white font-black text-lg">
                  <tr>
                    <td className="p-4 border-r border-purple-500" colSpan="2">TOTALES (FIJO | VARIABLE | GLOBAL)</td>
                    <td className="p-4 text-right bg-purple-700">
                      <div className="flex flex-col text-sm items-end gap-1">
                        <span className="text-amber-300">CF: {cfTotal.toFixed(2)}</span>
                        <span className="text-indigo-300">CV: {cvTotal.toFixed(2)}</span>
                        <span className="text-white text-xl mt-1 pt-1 border-t border-purple-500">{(cfTotal + cvTotal).toFixed(2)}</span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      }

      case 7: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo del Precio de Venta</h2>
              <p className="text-slate-500 font-medium">Aprende a fijar un precio justo, competitivo y rentable.</p>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000" alt="Precio de Venta" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );

      case 8: {
        const costoTotalOp = data.inversiones.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo)).reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const numProd = parseInt(data.produccionMensual) || 1;
        const costoUnitario = costoTotalOp / numProd;
        const margen = parseFloat(data.porcentajeGanancia || 30);
        const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
        const precioFacturado = precioSinFactura / 0.84;

        return (
          <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Calculadora: Precio de Venta</h2>
                <p className="text-slate-500 font-medium">Calcula tu costo unitario y define tu margen de ganancia.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
                <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2">1. Cálculo de Costo Unitario</h3>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-600 font-medium">Costo Operativo Mensual</span>
                  <span className="font-bold text-slate-800">Bs. {costoTotalOp.toFixed(2)}</span>
                </div>

                <div className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Productos por mes</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        className="w-20 bg-slate-50 p-1.5 rounded-lg border border-slate-200 font-bold text-md focus:border-indigo-400 outline-none text-center text-indigo-700"
                        value={data.produccionMensual || ''}
                        onChange={e => updateGlobalData({ produccionMensual: e.target.value === '' ? '' : (parseInt(e.target.value) || 0) })}
                      />
                      <span className="font-bold text-slate-500">u.</span>
                    </div>
                  </div>
                  {demandaPotencialFase4 > 0 && (
                    <button
                      type="button"
                      onClick={() => updateGlobalData({ produccionMensual: demandaPotencialFase4 })}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold text-right flex items-center justify-end gap-1 cursor-pointer transition-colors"
                      title="Usar la Demanda Potencial calculada en Fase 4"
                    >
                      ✨ Demanda Potencial Fase 4: {demandaPotencialFase4} u. (Usar)
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm mt-2">
                  <span className="text-indigo-800 font-bold">Costo Unitario (CU)</span>
                  <span className="font-black text-indigo-700 text-xl">Bs. {costoUnitario.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
                <h3 className="font-bold text-slate-700 border-b border-slate-200 pb-2">2. Proyección de Precio</h3>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-600 font-medium">Margen de Ganancia (%)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0" max="99"
                      className="w-20 bg-slate-50 p-1.5 rounded-lg border border-slate-200 font-bold text-md focus:border-indigo-400 outline-none text-center text-indigo-700"
                      value={data.porcentajeGanancia ?? 30}
                      onChange={e => updateGlobalData({ porcentajeGanancia: e.target.value === '' ? '' : (parseFloat(e.target.value) || 0) })}
                    />
                    <span className="font-bold text-slate-500">%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-slate-600 font-medium">Precio (Sin factura)</span>
                  <span className="font-bold text-slate-800">Bs. {precioSinFactura.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center bg-indigo-600 p-4 rounded-xl shadow-md mt-2 text-white">
                  <span className="font-bold">Precio Facturado (Bolivia)</span>
                  <div className="text-right">
                    <span className="font-black text-2xl block">Bs. {precioFacturado.toFixed(2)}</span>
                    <span className="text-xs text-indigo-200 block">Incluye 13% IVA + 3% IT (÷ 0.84)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 9: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Proyección de ganancias</h2>
              <p className="text-slate-500 font-medium">Cómo proyectar tus ingresos a futuro.</p>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" alt="Proyeccion Ganancias" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 10: {
        const valActual = parseInt(data.produccionMensual);
        const prodBase = (!isNaN(valActual) && valActual !== 100 && valActual > 0)
          ? valActual
          : (demandaPotencialFase4 || 50);

        return (
          <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Cálculo de Proyección de ganancias</h2>
                <p className="text-slate-500 font-medium">Así se verán tus ingresos estimados en los primeros 6 meses.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg text-center mb-8">
              <h3 className="text-2xl font-bold text-blue-100 mb-6">Proyección de Unidades</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-4">
                <div>
                  <label className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 block">Ventas Estimadas por Mes (Unidades)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-48 mx-auto bg-white/10 p-4 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center"
                    value={data.produccionMensual && data.produccionMensual !== 100 ? data.produccionMensual : prodBase}
                    onChange={e => updateGlobalData({ produccionMensual: e.target.value === '' ? '' : (parseInt(e.target.value) || 0) })}
                  />
                  <div className="mt-2.5 text-xs text-amber-200 font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 inline-flex items-center gap-1.5">
                    <span>✨ Demanda Potencial estimada: <strong className="text-amber-300 font-black">{prodBase} u./mes</strong></span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 block">Meses a Proyectar</label>
                  <input type="number" min="1" max="24" className="w-48 mx-auto bg-white/10 p-4 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center" value={data.mesesProyeccion || 6} onChange={e => updateGlobalData({ mesesProyeccion: e.target.value === '' ? '' : (parseInt(e.target.value) || 1) })} />
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-4">Sé realista, considera tu capacidad de producción y tu mercado.</p>
            </div>

            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm min-w-[700px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-slate-500 font-bold border-b border-r border-slate-200 bg-slate-100/50 min-w-[250px] sticky left-0 z-10">Meses</th>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                      <th key={mes} className="p-4 text-slate-500 font-bold text-center border-b border-slate-200">Mes {mes}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Nº de productos o servicios</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                      const multiplicador = 1 + ((mes - 1) * 0.13);
                      const unidades = Math.round(prodBase * multiplicador);
                      return <td key={mes} className="p-4 text-slate-600 text-center">{unidades}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Precio (Bs.)</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                      <td key={mes} className="p-4 text-slate-600 text-center">{parseFloat(precioVentaEfectivo || 0).toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/30">
                    <td className="p-4 font-bold text-emerald-800 border-r border-slate-200 bg-emerald-100/30 sticky left-0 z-10">Ingresos (Bs.)</td>
                    {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                      const multiplicador = 1 + ((mes - 1) * 0.13);
                      const unidades = Math.round(prodBase * multiplicador);
                      const ingresos = unidades * (precioVentaEfectivo || 0);
                      return <td key={mes} className="p-4 font-bold text-emerald-600 text-center whitespace-nowrap">Bs. {ingresos.toFixed(2)}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case 11: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Proyección de gastos</h2>
              <p className="text-slate-500 font-medium">Anticipa cuánto te costará mantener el negocio funcionando.</p>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" alt="Proyeccion Gastos" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 12: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <Wallet size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Proyección de gastos</h2>
              <p className="text-slate-500 font-medium">Así se verán tus gastos estimados en los primeros 6 meses.</p>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-slate-500 font-bold border-b border-r border-slate-200 bg-slate-100/50 min-w-[250px] sticky left-0 z-10">Meses</th>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <th key={mes} className="p-4 text-slate-500 font-bold text-center border-b border-slate-200">Mes {mes}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Costos Fijos (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <td key={mes} className="p-4 text-slate-600 text-center">{totalFijos.toFixed(2)}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Costos Variables (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
                    const vars = unidades * costoVariableUnitario;
                    return <td key={mes} className="p-4 text-slate-600 text-center">{vars.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-red-50/30">
                  <td className="p-4 font-bold text-red-800 border-r border-slate-200 bg-red-100/30 sticky left-0 z-10">Gasto Total (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
                    const vars = unidades * costoVariableUnitario;
                    const total = totalFijos + vars;
                    return <td key={mes} className="p-4 font-bold text-red-600 text-center whitespace-nowrap">Bs. {total.toFixed(2)}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

      case 13: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Utilidad Bruta y Neta</h2>
              <p className="text-slate-500 font-medium">Conoce la diferencia antes y después de pagar impuestos.</p>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=1000" alt="Utilidad" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-amber-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 14: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Utilidad Neta</h2>
              <p className="text-slate-500 font-medium">Restando impuestos a tus ganancias.</p>
            </div>
          </div>


          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-slate-500 font-bold border-b border-r border-slate-200 bg-slate-100/50 min-w-[250px] sticky left-0 z-10">Meses</th>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <th key={mes} className="p-4 text-slate-500 font-bold text-center border-b border-slate-200">Mes {mes}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Utilidad Bruta (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
                    const ingresos = unidades * (precioVentaEfectivo || 0);
                    const vars = unidades * costoVariableUnitario;
                    const gastos = totalFijos + vars;
                    const uBruta = ingresos - gastos;
                    return <td key={mes} className={`p-4 font-bold text-center ${uBruta >= 0 ? 'text-slate-600' : 'text-red-500'}`}>{uBruta.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700 border-r border-slate-200 bg-slate-50/30 sticky left-0 z-10">Impuestos (IVA 13% + IT 3%)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
                    const ingresos = unidades * (precioVentaEfectivo || 0);
                    const vars = unidades * costoVariableUnitario;
                    const gastos = totalFijos + vars;
                    const uBruta = ingresos - gastos;
                    const impuestos = ingresos * 0.16;
                    return <td key={mes} className="p-4 text-red-500 text-center">-{impuestos.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-amber-50/30">
                  <td className="p-4 font-bold text-amber-800 border-r border-slate-200 bg-amber-100/30 sticky left-0 z-10">Utilidad Neta (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    const multiplicador = 1 + ((mes - 1) * 0.13);
                    const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
                    const ingresos = unidades * (precioVentaEfectivo || 0);
                    const vars = unidades * costoVariableUnitario;
                    const gastos = totalFijos + vars;
                    const uBruta = ingresos - gastos;
                    const impuestos = ingresos * 0.16;
                    const uNeta = uBruta - impuestos;
                    return <td key={mes} className={`p-4 font-black text-center whitespace-nowrap ${uNeta >= 0 ? 'text-amber-600' : 'text-red-600'}`}>Bs. {uNeta.toFixed(2)}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

      case 15: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Punto de equilibrio</h2>
              <p className="text-slate-500 font-medium">La meta principal de todo negocio en sus inicios.</p>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" alt="Equilibrio" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 16: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Punto de equilibrio</h2>
              <p className="text-slate-500 font-medium">Descubre cuántas unidades necesitas vender al mes para no perder dinero.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={100} /></div>
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Punto de Equilibrio Mensual</label>
              <p className="text-sm text-slate-400 mb-4 relative z-10">Unidades a vender para no perder dinero</p>
              <div className="text-5xl font-black text-blue-600 relative z-10">
                {margenContribucion > 0 ? puntoEquilibrio : '---'}
              </div>
              <span className="text-slate-500 font-bold mt-2 relative z-10">unidades / mes</span>
            </div>

            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Proyección de Utilidad Neta</h3>

              <div className="mb-4">
                <span className="text-slate-400 text-sm">Ventas Estimadas:</span>
                <span className="ml-2 font-bold text-white">{data.produccionMensual || 0} unidades/mes</span>
              </div>

              <div className={`p-4 rounded-xl border-2 ${utilidadMensual > 0 ? 'bg-emerald-900/50 border-emerald-500/50' : utilidadMensual < 0 ? 'bg-red-900/50 border-red-500/50' : 'bg-slate-800 border-slate-600'} transition-colors`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-300">Utilidad Neta del Mes 1:</span>
                  <span className={`text-2xl font-black ${utilidadMensual > 0 ? 'text-emerald-400' : utilidadMensual < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    Bs. {utilidadMensual.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      case 17: return (
        <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <Play size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">¿Qué son el VAN y la TIR?</h2>
              <p className="text-slate-500 font-medium">Aprende los indicadores clave para saber si un inversor aceptará tu proyecto.</p>
            </div>
          </div>

          <div className="aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden mb-6 relative group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000" alt="VAN y TIR" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-white font-bold text-lg drop-shadow-md">Ver Video Explicativo</p>
            </div>
          </div>
        </div>
      );
      case 18: {
        // Cálculo del VAN y TIR
        const inversionInicial = totalInversion;

        // Calcular flujos netos proyectados mensuales
        const flujos = Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
          const multiplicador = 1 + ((mes - 1) * 0.13);
          const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
          const ingresos = unidades * (precioVentaEfectivo || 0);
          const vars = unidades * costoVariableUnitario;
          const gastos = totalFijos + vars;
          const uBruta = ingresos - gastos;
          const impuestos = ingresos * 0.16;
          return uBruta - impuestos;
        });

        const tasaTMAR = (data.tasaDescuento !== undefined && data.tasaDescuento !== '' && data.tasaDescuento !== null) ? parseFloat(data.tasaDescuento) : 13;
        const tasaDescuentoMensual = tasaTMAR / 100; // 13% mensual (0.13)

        // VAN = -Inversion + Sumatoria(Flujo_n / (1+r)^n)
        let van = -inversionInicial;
        flujos.forEach((flujo, index) => {
          van += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
        });

        // TIR aproximada (bisección simple)
        let tir = 0;
        let tir_mensual = 0;
        if (inversionInicial > 0 && flujos.some(f => f > 0)) {
          let low = -0.5; // -50%
          let high = 1.0; // 100%
          for (let i = 0; i < 100; i++) {
            let mid = (low + high) / 2;
            let npv = -inversionInicial;
            flujos.forEach((flujo, index) => {
              npv += flujo / Math.pow(1 + mid, index + 1);
            });
            if (npv > 0) low = mid;
            else high = mid;
          }
          tir = low;
          tir_mensual = tir * 100;
        }

        let uMinVAN = (data.produccionMensual || prodBase);
        const r = tasaDescuentoMensual;
        const mUnitarioNeto = (precioVentaEfectivo * 0.84) - costoVariableUnitario;

        if (mUnitarioNeto > 0) {
          let sumaMultiplicadores = 0;
          let sumaFijosDescontados = 0;
          for (let i = 1; i <= (data.mesesProyeccion || 6); i++) {
            const mult = 1 + ((i - 1) * 0.13);
            const df = Math.pow(1 + r, i);
            sumaMultiplicadores += mult / df;
            sumaFijosDescontados += totalFijos / df;
          }
          const factorInversionYFijos = inversionInicial + sumaFijosDescontados;
          uMinVAN = Math.ceil(factorInversionYFijos / (mUnitarioNeto * sumaMultiplicadores));
        }

        return (
          <div className="animate-fade-in p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR</h2>
                <p className="text-slate-500 font-medium">Calcula si el proyecto genera valor por encima de lo esperado.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-8">
              <button 
                onClick={handleLimpiarTablas}
                className="px-6 py-4 bg-red-100 text-red-700 hover:bg-red-200 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Trash2 size={24} /> Limpiar todas las tablas
              </button>

              <button 
                onClick={handleGenerarIA}
                disabled={isGeneratingIA}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none w-full sm:w-auto"
              >
                {isGeneratingIA ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} /> Autocompletar con IA
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg text-center mb-8">
              <h3 className="text-2xl font-bold text-purple-100 mb-6">Tasa de Descuento (TMAR)</h3>
              <p className="text-sm text-purple-200 mb-4 max-w-xl mx-auto">¿Cuánto porcentaje de rentabilidad mensual le exiges a este proyecto para que valga la pena el riesgo?</p>
              <div className="flex items-center justify-center gap-2">
                <input type="number" min="0" max="100" className="w-32 bg-white/10 p-4 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center" value={data.tasaDescuento === 0 ? 0 : (data.tasaDescuento || 13)} onChange={e => updateGlobalData({ tasaDescuento: e.target.value === '' ? '' : (parseFloat(e.target.value) || 0) })} />
                <span className="text-4xl font-bold text-purple-200">% mensual</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Actual Neto (VAN)</div>
                <div className="text-slate-400 text-sm mb-4">Mide cuánto dinero 'extra' generas en valor de hoy. Debe ser mayor a cero.</div>
                <div className={`text-4xl font-black ${van >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
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
                <div className="text-slate-400 text-sm mb-4">Es la rentabilidad real mensual que te da el proyecto. Debe ser mayor a la TMAR.</div>
                <div className={`text-4xl font-black ${tir_mensual >= tasaTMAR ? 'text-emerald-500' : 'text-red-500'}`}>
                  {tir_mensual.toFixed(2)} % mensual
                </div>
                <div className="mt-4 font-bold text-sm">
                  {tir_mensual >= tasaTMAR
                    ? <span className="text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Rinde más de lo exigido 🚀</span>
                    : <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">No alcanza la tasa exigida 📉</span>
                  }
                </div>
              </div>
            </div>

            {(van < 0 || tir_mensual < tasaTMAR) && (
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 transition-all animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/30">
                      <AlertTriangle size={28} />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-200/70 px-3 py-1 rounded-full">
                        Diagnóstico Financiero
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-amber-950 mt-1">
                        Recomendaciones para rentabilizar tu proyecto
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleObtenerConsejosIA({
                      demandaActual: data.produccionMensual || prodBase,
                      unidadesNecesarias: uMinVAN,
                      precioVenta: precioVentaEfectivo.toFixed(2),
                      van: van.toFixed(2),
                      tir: tir_mensual.toFixed(2),
                      tmar: tasaTMAR
                    })}
                    disabled={cargandoConsejosIA}
                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {cargandoConsejosIA ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generando Estrategia...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} /> Generar Ideas con IA
                      </>
                    )}
                  </button>
                </div>

                {/* Tarjetas de Metas de Demanda */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>VENTAS ACTUALES</span>
                      <Target size={16} className="text-amber-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-800">
                      {data.produccionMensual || prodBase} <span className="text-sm font-semibold text-slate-500">u./mes</span>
                    </div>
                    <p className="text-xs text-amber-700 font-medium mt-1">Demanda estimada actual</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-100 mb-2">
                        <span>DEMANDA REQUERIDA (VAN &gt; 0)</span>
                        <TrendingUp size={16} className="text-emerald-200" />
                      </div>
                      <div className="text-3xl font-black text-white">
                        {uMinVAN} <span className="text-sm font-semibold text-emerald-200">u./mes</span>
                      </div>
                      <p className="text-xs text-emerald-100 font-medium mt-1">Ventas necesarias para VAN positivo</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateGlobalData({ produccionMensual: uMinVAN })}
                      className="mt-3 py-2 px-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} /> Aplicar {uMinVAN} u./mes como meta
                    </button>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>INCREMENTO REQUERIDO</span>
                      <ArrowUpRight size={16} className="text-orange-600" />
                    </div>
                    <div className="text-3xl font-black text-orange-600">
                      +{Math.max(0, uMinVAN - (data.produccionMensual || prodBase))} <span className="text-sm font-semibold text-slate-500">u.</span>
                    </div>
                    <p className="text-xs text-amber-700 font-medium mt-1">
                      {(data.produccionMensual || prodBase) > 0 
                        ? `+${Math.round(((uMinVAN - (data.produccionMensual || prodBase)) / (data.produccionMensual || prodBase)) * 100)}% de incremento en clientes`
                        : 'Definir meta de demanda'}
                    </p>
                  </div>
                </div>

                {/* Estrategias Sugeridas Generadas por IA */}
                {consejosIA ? (
                  <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-md animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="text-amber-500" size={22} />
                      <h4 className="font-black text-lg text-slate-900">Plan Estratégico sugerido por IA</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                      {consejosIA.diagnostico}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {consejosIA.estrategiasDemanda?.map((est, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mb-1">Estrategia {idx + 1}</span>
                            <h5 className="font-bold text-slate-800 text-sm mb-2">{est.titulo}</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">{est.descripcion}</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-bold text-emerald-600">
                            🚀 {est.impacto}
                          </div>
                        </div>
                      ))}
                    </div>

                    {consejosIA.consejoEstructuraCostos && (
                      <div className="text-xs text-slate-700 bg-indigo-50 border border-indigo-100 p-3 rounded-xl font-medium flex items-center gap-2">
                        <span className="font-bold text-indigo-700">💡 Optimización de Costos:</span> {consejosIA.consejoEstructuraCostos}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-amber-200/80">
                    <h4 className="font-bold text-amber-950 text-sm mb-2 flex items-center gap-2">
                      <Lightbulb size={18} className="text-amber-600" /> Estrategias clave para aumentar tu demanda potencial:
                    </h4>
                    <ul className="text-xs text-amber-900/90 space-y-2 list-disc list-inside">
                      <li><strong>Ampliar Canales de Venta</strong>: Implementar venta directa en redes sociales, delivery o alianzas B2B.</li>
                      <li><strong>Combos y Suscripciones</strong>: Crear paquetes o programas de fidelización para compras recurrentes.</li>
                      <li><strong>Optimización de Valor y Precio</strong>: Elevar el valor percibido del producto para aumentar la conversión.</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

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
        setPendingSave(true);
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
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          {getPasoContent()}
        </motion.div>
      </AnimatePresence>
    </PasoLayout>
  );
};

export default Fase10_PlanFinanciero;
