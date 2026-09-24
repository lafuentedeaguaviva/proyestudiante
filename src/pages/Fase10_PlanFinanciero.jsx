import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasoLayout from '../layouts/PasoLayout';
import YoutubePlayer from '../components/ui/YoutubePlayer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StepNavigation from '../components/ui/StepNavigation';
import { useFase10Controller } from '../controllers/useFase10Controller';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingUp, Plus, Trash2, Calculator, Info, Package, Play, Bot, Sparkles, AlertTriangle, Lightbulb, Target, ArrowUpRight, CheckCircle2, Video } from 'lucide-react';
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
  const [toolboxTargetProd, setToolboxTargetProd] = useState('');

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
    if (!window.confirm("⚠️ ADVERTENCIA: La IA completará tus tablas basándose en lo que ya tienes, pudiendo modificar precios en cero, añadir nuevos ingredientes o inversiones para hacer tu negocio realista y certero. ¿Deseas continuar?")) {
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

      const productosActuales = data.productos || [];
      if (productosActuales.length > 0) {
        const resumenProductos = productosActuales.map(p => `- Producto: ${p.nombre || 'Sin nombre'} (Demanda: ${p.produccionMensual || 1}, Margen: ${p.margenGanancia || 30}%)\n  Ingredientes: ${(p.ingredientes || []).map(i => `${i.concepto || i.nombre} (Bs.${i.monto})`).join(', ')}`).join('\n');
        ctx += `\nEl usuario YA HA DEFINIDO estos productos y sus costos unitarios de ingredientes:\n${resumenProductos}\nPOR FAVOR, respeta EXCLUSIVAMENTE estos productos. NO INVENTES NI AGREGUES PRODUCTOS NUEVOS. Limítate a rellenar los costos (monto) de los ingredientes si están en 0, añade ingredientes si faltan para que la receta de estos productos sea real, y ajusta la demanda si es irreal.`;
      } else {
        ctx += `\nEl usuario no ha definido productos. Genera un par de productos estrella principales relacionados a la idea, con sus respectivas demandas mensuales, márgenes de ganancia y listas detalladas de ingredientes con costos unitarios reales.`;
      }

      const inversionesActuales = data.inversiones || [];
      if (inversionesActuales.length > 0) {
        const resumenInversiones = inversionesActuales.map(i => `- ${i.concepto || 'Sin nombre'} (tipo: ${i.tipo}, cant: ${i.cantidad || 1}, precio: ${i.precio || 0})`).join('\n');
        ctx += `\nEl usuario YA HA AÑADIDO estas inversiones/gastos fijos/variables globales:\n${resumenInversiones}\nPOR FAVOR, respeta EXCLUSIVAMENTE estos elementos. NO INVENTES NI AGREGUES NUEVAS INVERSIONES O COSTOS FIJOS. Limítate a rellenar o ajustar los campos de cantidad, precio y monto si están en 0 o son irreales para el mercado boliviano.`;
      } else {
        ctx += `\nEl usuario no ha añadido ninguna inversión aún. Genera todas las necesarias (fijas, diferidas, variables operativas).`;
      }

      const res = await generarPlanFinancieroIA(ctx);
      if (res) {
        let mergedProductos = data.productos || [];
        if (res.productos && res.productos.length > 0) {
          mergedProductos = (data.productos || []).map(prod => {
            const aiProd = res.productos.find(p => p.nombre?.toLowerCase() === prod.nombre?.toLowerCase() || p.id === prod.id);
            if (aiProd) {
              let mergedIngredientes = prod.ingredientes || [];
              if (aiProd.ingredientes && aiProd.ingredientes.length > 0) {
                if (mergedIngredientes.length === 0) {
                  mergedIngredientes = aiProd.ingredientes;
                } else {
                  mergedIngredientes = mergedIngredientes.map(ing => {
                    const aiIng = aiProd.ingredientes.find(i => i.concepto?.toLowerCase() === ing.concepto?.toLowerCase());
                    if (aiIng) {
                      return { ...ing, cantidad: aiIng.cantidad ?? ing.cantidad, precio: aiIng.precio ?? ing.precio, monto: aiIng.monto ?? ing.monto, unidad: aiIng.unidad ?? ing.unidad };
                    }
                    return ing;
                  });
                }
              }
              return {
                ...prod,
                produccionMensual: aiProd.produccionMensual ?? prod.produccionMensual,
                margenGanancia: aiProd.margenGanancia ?? prod.margenGanancia,
                ingredientes: mergedIngredientes
              };
            }
            return prod;
          });
        }

        let mergedInversiones = data.inversiones || [];
        if (res.inversiones && res.inversiones.length > 0) {
          if (mergedInversiones.length === 0) {
            mergedInversiones = res.inversiones;
          } else {
            mergedInversiones = mergedInversiones.map(inv => {
              const aiInv = res.inversiones.find(i => i.concepto?.toLowerCase() === inv.concepto?.toLowerCase() || i.id === inv.id);
              if (aiInv) {
                return { ...inv, cantidad: aiInv.cantidad ?? inv.cantidad, precio: aiInv.precio ?? inv.precio, monto: aiInv.monto ?? inv.monto, tipo: aiInv.tipo ?? inv.tipo };
              }
              return inv;
            });
          }
        }

        updateGlobalData({
          ...data,
          inversiones: mergedInversiones,
          productos: mergedProductos,
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
    // ---- MULTI-PRODUCT FINANCIAL CALCULATIONS ----
    
    // 1. Fixed and Global Variable Costs from 'inversiones'
    const totalFijos = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
    const totalVariablesGlo = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
    
    // 2. Compute aggregate monthly demand
    const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
    
    // 3. Apportion fixed and global variable costs per unit
    const fijoPorUnidad = totalFijos / totalProdMensual;
    const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

    // 4. Calculate total Revenues and Variable Costs for the month
    let ingresosTotalesMes = 0;
    let costosVariablesTotalesMes = 0;
    let egresosTotalesMes = totalFijos;

    (data.productos || []).forEach(prod => {
      // Unit costs for this product
      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
      
      // Price calculation
      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
      const precioFacturado = precioSinFactura / 0.84;
      
      const prodBase = prod.produccionMensual || 0;
      
      ingresosTotalesMes += (prodBase * precioFacturado);
      costosVariablesTotalesMes += (prodBase * cvUnitario);
      egresosTotalesMes += (prodBase * cvUnitario);
    });

    const utilidadMensual = ingresosTotalesMes - egresosTotalesMes;

    // 5. Break-Even Point (Multi-Product using Weighted Contribution Margin)
    // Formula: Break Even Sales (Bs) = Fixed Costs / Contribution Margin Ratio
    // Contribution Margin Ratio = (Total Sales - Total Variable Costs) / Total Sales
    let margenContribucionPonderado = 0;
    let puntoEquilibrioBs = 0;
    
    if (ingresosTotalesMes > 0) {
      margenContribucionPonderado = (ingresosTotalesMes - costosVariablesTotalesMes) / ingresosTotalesMes;
    }
    
    if (margenContribucionPonderado > 0) {
      puntoEquilibrioBs = totalFijos / margenContribucionPonderado;
    }

    const totalInversion = data?.inversiones?.filter(i => i.tipo === 'fijo' || i.tipo === 'diferido').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;

    switch (step) {
      case 1: return (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Viabilidad y Sostenibilidad</h2>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <YoutubePlayer videoKey="video_fase_10" title="Plan Financiero" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
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
        <div className="animate-fade-in w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 px-4">
          <div className="lg:w-[320px] shrink-0 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Materiales e Insumos</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Añade los materiales e insumos necesarios para un producto (receta base):</p>
            
            {data.productos && data.productos.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">Añadir a Producto:</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:border-purple-400 outline-none"
                  value={toolboxTargetProd || data.productos[0]?.id || ''}
                  onChange={(e) => setToolboxTargetProd(e.target.value)}
                >
                  {data.productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-3 mb-4 animate-fade-in">
              {Object.entries(getCajaHerramientas().materiales.subgrupos).map(([key, sub]) => (
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
                              if (!data.productos || data.productos.length === 0) return alert('Primero debes crear productos en la Fase 4');
                              const targetId = toolboxTargetProd || data.productos[0].id;
                              const pIdx = data.productos.findIndex(p => p.id === targetId || p.id === parseInt(targetId));
                              if (pIdx >= 0) {
                                const newProds = [...data.productos];
                                if (!newProds[pIdx].ingredientes) newProds[pIdx].ingredientes = [];
                                newProds[pIdx].ingredientes.push({ id: Date.now() + idx, concepto: item, cantidad: 1, unidad: 'kg', precio: 0, monto: 0 });
                                updateGlobalData({ productos: newProds });
                              }
                            }}
                            className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:border-purple-400 hover:text-purple-700 transition-colors flex items-center gap-1 shadow-sm"
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

          <div className="lg:flex-1 w-full bg-white p-6 rounded-3xl shadow-xl flex flex-col gap-6 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Costos por Producto</h2>
                <p className="text-slate-500 font-medium">Define la receta o estructura de costos para 1 unidad de cada producto.</p>
              </div>
            </div>

            {(data.productos || []).map((prod, pIdx) => (
              <div key={prod.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Producto: {prod.nombre}</h3>
                  <div className="flex items-center gap-2">
                    <div className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
                      Producción mensual: {prod.produccionMensual} unds
                    </div>
                    <button 
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar el producto "${prod.nombre}"? Esto afectará todo el plan financiero.`)) {
                          const newProds = data.productos.filter(p => p.id !== prod.id);
                          updateGlobalData({ productos: newProds });
                        }
                      }}
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                    <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                      <tr>
                        <th className="p-3 border-r border-slate-300 min-w-[150px]">Artículo</th>
                        <th className="p-3 border-r border-slate-300 text-center min-w-[100px]">Cantidad</th>
                        <th className="p-3 border-r border-slate-300 text-center min-w-[140px]">Unidad</th>
                        <th className="p-3 border-r border-slate-300 text-center min-w-[120px]">Precio Unit. (Bs)</th>
                        <th className="p-3 text-center min-w-[100px]">Subtotal</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(prod.ingredientes || []).map((ing, iIdx) => (
                        <tr key={ing.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="p-2 border-r border-slate-200">
                            <input type="text" value={ing.concepto || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].concepto = e.target.value; updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-purple-400 rounded" placeholder="Ej. Harina" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input type="number" min="0" step="any" value={ing.cantidad || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].cantidad = parseFloat(e.target.value) || 0; newProds[pIdx].ingredientes[iIdx].monto = (parseFloat(e.target.value) || 0) * (ing.precio || 0); updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded" />
                          </td>
                          <td className="p-2 border-r border-slate-200">
                             <div className="flex flex-col gap-1">
                               <select 
                                 value={['kg','gramos','litros','ml','Pzas','tazas','cuchara','cucharilla'].includes(ing.unidad) ? ing.unidad : (ing.unidad ? 'Otro' : 'kg')} 
                                 onChange={e => { 
                                   const newProds = [...data.productos]; 
                                   newProds[pIdx].ingredientes[iIdx].unidad = e.target.value === 'Otro' ? '' : e.target.value; 
                                   updateGlobalData({ productos: newProds }); 
                                 }} 
                                 className="w-full p-2 bg-transparent outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-purple-400 rounded"
                               >
                                  <option value="kg">kg</option>
                                  <option value="gramos">gramos</option>
                                  <option value="litros">litros</option>
                                  <option value="ml">ml</option>
                                  <option value="Pzas">Pzas / Unidades</option>
                                  <option value="tazas">tazas</option>
                                  <option value="cuchara">cuchara</option>
                                  <option value="cucharilla">cucharilla</option>
                                  <option value="Otro">Otra (Escribir)...</option>
                               </select>
                               {!['kg','gramos','litros','ml','Pzas','tazas','cuchara','cucharilla'].includes(ing.unidad) && (
                                 <input type="text" value={ing.unidad || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].unidad = e.target.value; updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-purple-50 text-purple-900 outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded border border-purple-200" placeholder="Escribe la unidad" autoFocus />
                               )}
                             </div>
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <input type="number" min="0" step="any" value={ing.precio || ''} onChange={e => { const newProds = [...data.productos]; newProds[pIdx].ingredientes[iIdx].precio = parseFloat(e.target.value) || 0; newProds[pIdx].ingredientes[iIdx].monto = (ing.cantidad || 0) * (parseFloat(e.target.value) || 0); updateGlobalData({ productos: newProds }); }} className="w-full p-2 bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-purple-400 rounded" />
                          </td>
                          <td className="p-2 text-center font-bold text-purple-700 bg-purple-50">{(ing.monto || 0).toFixed(2)}</td>
                          <td className="p-2 text-center"><button onClick={() => { const newProds = [...data.productos]; newProds[pIdx].ingredientes = newProds[pIdx].ingredientes.filter((_, idx) => idx !== iIdx); updateGlobalData({ productos: newProds }); }} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={18} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-purple-100/50 border-t-2 border-purple-200">
                        <td colSpan="4" className="p-3 text-right font-bold text-slate-700">Costo Materiales por Unidad (Bs):</td>
                        <td className="p-3 text-center font-black text-purple-800 text-lg">
                          {((prod.ingredientes || []).reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0)).toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <button onClick={() => { const newProds = [...data.productos]; if (!newProds[pIdx].ingredientes) newProds[pIdx].ingredientes = []; newProds[pIdx].ingredientes.push({ id: Date.now(), concepto: '', cantidad: 1, unidad: 'kg', precio: 0, monto: 0 }); updateGlobalData({ productos: newProds }); }} className="mt-3 flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-800 hover:underline transition-colors"><Plus size={16} /> Añadir Artículo</button>
              </div>
            ))}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-4">
               <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Tabla de Equivalencias</h3>
               <p className="text-xs text-slate-500 mb-3">Define cuánto equivale una unidad especial (ej. taza) en una unidad oficial (ej. kg, litros).</p>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse text-sm bg-slate-50 border border-slate-200">
                    <thead className="bg-slate-200 text-slate-700">
                      <tr>
                        <th className="p-3 border-r border-slate-200 min-w-[120px]">1 Unidad Especial</th>
                        <th className="p-3 border-r border-slate-200 text-center w-8">=</th>
                        <th className="p-3 border-r border-slate-200 min-w-[100px]">Factor</th>
                        <th className="p-3 border-r border-slate-200 min-w-[120px]">Unidad Oficial</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.equivalencias || []).map((eq, eIdx) => (
                        <tr key={eq.id} className="border-b border-slate-200">
                          <td className="p-2 border-r border-slate-200"><input type="text" value={eq.unidadOrigen || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].unidadOrigen = e.target.value; updateGlobalData({ equivalencias: newEqs }); }} className="w-full p-2 bg-white border border-slate-200 rounded focus:border-purple-400 outline-none" placeholder="Ej. taza" /></td>
                          <td className="p-2 border-r border-slate-200 text-center text-slate-400 font-bold">=</td>
                          <td className="p-2 border-r border-slate-200"><input type="number" min="0" step="any" value={eq.factor || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].factor = parseFloat(e.target.value) || 0; updateGlobalData({ equivalencias: newEqs }); }} className="w-full p-2 bg-white border border-slate-200 rounded focus:border-purple-400 outline-none" placeholder="Ej. 0.25" /></td>
                          <td className="p-2 border-r border-slate-200"><input type="text" value={eq.unidadDestino || ''} onChange={e => { const newEqs = [...(data.equivalencias || [])]; newEqs[eIdx].unidadDestino = e.target.value; updateGlobalData({ equivalencias: newEqs }); }} className="w-full p-2 bg-white border border-slate-200 rounded focus:border-purple-400 outline-none" placeholder="Ej. kg" /></td>
                          <td className="p-2 text-center"><button onClick={() => { const newEqs = [...(data.equivalencias || [])]; newEqs.splice(eIdx, 1); updateGlobalData({ equivalencias: newEqs }); }} className="text-red-400 hover:text-red-600 p-2 rounded"><Trash2 size={18} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
               <button onClick={() => { const newEqs = [...(data.equivalencias || [])]; newEqs.push({ id: Date.now(), unidadOrigen: '', factor: 1, unidadDestino: 'kg' }); updateGlobalData({ equivalencias: newEqs }); }} className="mt-3 flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"><Plus size={16} /> Añadir Equivalencia</button>
            </div>
          </div>
        </div>
      );
case 4: {
        const consolidados = [];
        let totalMaterialesMensual = 0;
        
        (data.productos || []).forEach(prod => {
          const prodMensual = prod.produccionMensual || 0;
          (prod.ingredientes || []).forEach(ing => {
            const reqTotal = (ing.cantidad || 0) * prodMensual;
            let unidadFinal = ing.unidad || 'unds';
            let reqConvertido = reqTotal;
            
            if (data.equivalencias && data.equivalencias.length > 0) {
              const eq = data.equivalencias.find(e => e.unidadOrigen?.toLowerCase() === ing.unidad?.toLowerCase());
              if (eq) {
                reqConvertido = reqTotal * (eq.factor || 1);
                unidadFinal = eq.unidadDestino || unidadFinal;
              }
            }
            
            const costoTotal = (ing.monto || 0) * prodMensual;
            
            consolidados.push({
              id: ing.id + '-' + prod.id,
              producto: prod.nombre,
              articulo: ing.concepto,
              cantidad: reqConvertido,
              unidad: unidadFinal,
              costoTotal
            });
            totalMaterialesMensual += costoTotal;
          });
        });

        return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 bg-white p-6 rounded-3xl shadow-xl h-fit border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Caja de Herramientas</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Añade los elementos de tu capital de operación (Infraestructura y Personal):</p>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-medium">
              <button onClick={() => { setToolboxCategory('infraestructura'); setToolboxSubcategory(Object.keys(cajaHerramientas.infraestructura.subgrupos)[0]); }} className={`flex-1 p-2 rounded-lg ${toolboxCategory === 'infraestructura' ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'}`}>Infraestructura</button>
              <button onClick={() => { setToolboxCategory('personal'); setToolboxSubcategory(Object.keys(cajaHerramientas.personal.subgrupos)[0]); }} className={`flex-1 p-2 rounded-lg ${toolboxCategory === 'personal' ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500'}`}>Personal</button>
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
                          <button key={idx} onClick={() => { const tipo = toolboxCategory; updateGlobalData({ inversiones: [...data.inversiones, { id: Date.now() + idx, concepto: item, cantidad: 1, precio: 0, monto: 0, tipo }] }); }} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm hover:border-amber-400 hover:text-amber-700 transition-colors flex items-center gap-1 shadow-sm"><Plus size={14} /> {item}</button>
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
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600"><Wallet size={24} /></div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Capital de Trabajo</h2>
                <p className="text-slate-500 font-medium">Gastos operativos mensuales para producción y funcionamiento.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col gap-6">

                {/* TABLA 1: MATERIALES E INSUMOS */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">a. Determinamos los costos de materiales e insumos mensuales.</h3>
                  <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm mb-4 border border-amber-200"><Info size={16} className="inline mr-2 -mt-0.5" />Esta tabla se calcula automáticamente en base a las recetas por producto y sus demandas.</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Producto Destino</th>
                          <th className="p-2 border-r border-slate-300">Artículos</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24">Cant. Mensual</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24">Unidad</th>
                          <th className="p-2 text-center w-32">Costo total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consolidados.length > 0 ? consolidados.map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200">
                            <td className="p-2 border-r border-slate-200 font-medium text-slate-600">{inv.producto}</td>
                            <td className="p-2 border-r border-slate-200 font-medium">{inv.articulo}</td>
                            <td className="p-2 border-r border-slate-200 text-center">{inv.cantidad.toFixed(2)}</td>
                            <td className="p-2 border-r border-slate-200 text-center text-slate-500">{inv.unidad}</td>
                            <td className="p-2 text-center text-amber-700 font-bold bg-amber-50">{(inv.costoTotal || 0).toFixed(2)}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan="5" className="p-4 text-center text-slate-400">No hay materiales definidos. Regresa a la pestaña anterior para añadir recetas.</td></tr>
                        )}
                      </tbody>
                      <tfoot className="bg-amber-100">
                        <tr>
                          <td colSpan="4" className="p-2 text-right font-bold text-slate-800">TOTAL MATERIALES:</td>
                          <td className="p-2 text-center font-black text-amber-700 text-lg">{totalMaterialesMensual.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* TABLA 2: INFRAESTRUCTURA */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">b. Detallemos los costos de infraestructura y servicios.</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr><th className="p-2 border-r border-slate-300">Concepto</th><th className="p-2 text-center w-32">Costo Mensual</th><th className="p-2 w-10"></th></tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'infraestructura').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="p-2 border-r border-slate-200 font-medium">{inv.concepto}</td>
                            <td className="p-2 border-r border-slate-200"><input type="number" min="0" step="any" value={inv.precio || ''} onChange={e => { const v = parseFloat(e.target.value) || 0; updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, precio: v, monto: v } : item) }); }} className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1 text-center" /></td>
                            <td className="p-2 text-center"><button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100">
                        <tr>
                          <td className="p-2 text-right font-bold text-slate-800 border-r border-slate-300">TOTAL INFRAESTRUCTURA:</td>
                          <td className="p-2 text-center font-bold text-slate-800" colSpan="2">{data.inversiones.filter(i => i.tipo === 'infraestructura').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* TABLA 3: PERSONAL */}
                <div>
                  <h3 className="text-md font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2 flex items-center justify-between"><span>c. ¿Cuánto nos cuesta el personal?</span></h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm bg-white border border-slate-300 shadow-sm">
                      <thead className="bg-slate-200 text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Cargo</th>
                          <th className="p-2 border-r border-slate-300 text-center w-24"># Personas</th>
                          <th className="p-2 border-r border-slate-300 text-center w-32">Sueldo / mes</th>
                          <th className="p-2 text-center w-32">Costo total</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.inversiones.filter(i => i.tipo === 'personal').map((inv) => (
                          <tr key={inv.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="p-2 border-r border-slate-200 font-medium"><input type="text" value={inv.concepto || ''} onChange={e => updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, concepto: e.target.value } : item) })} className="w-full bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1" placeholder="Ej. Vendedor" /></td>
                            <td className="p-2 border-r border-slate-200"><input type="number" min="1" value={inv.cantidad || ''} onChange={e => { const q = parseInt(e.target.value) || 0; updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, cantidad: q, monto: q * (item.precio || 0) } : item) }); }} className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1" /></td>
                            <td className="p-2 border-r border-slate-200"><input type="number" min="0" step="any" value={inv.precio || ''} onChange={e => { const p = parseFloat(e.target.value) || 0; updateGlobalData({ inversiones: data.inversiones.map(item => item.id === inv.id ? { ...item, precio: p, monto: (item.cantidad || 0) * p } : item) }); }} className="w-full bg-transparent outline-none text-center focus:bg-white focus:ring-2 focus:ring-amber-400 rounded px-1" /></td>
                            <td className="p-2 text-center font-bold text-slate-800 bg-slate-50 border-r border-slate-200">{(inv.monto || 0).toFixed(2)}</td>
                            <td className="p-2 text-center"><button onClick={() => updateGlobalData({ inversiones: data.inversiones.filter(x => x.id !== inv.id) })} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={16} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100">
                        <tr>
                          <td colSpan="3" className="p-2 text-right font-bold text-slate-800 border-r border-slate-300">TOTAL PERSONAL:</td>
                          <td className="p-2 text-center font-bold text-slate-800" colSpan="2">{data.inversiones.filter(i => i.tipo === 'personal').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="mt-8 bg-slate-800 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
                  <div><span className="block text-slate-300 font-medium">Subtotal Capital de Trabajo</span><span className="text-sm text-slate-400">Materiales + Infraestructura + Personal (Mensualizado)</span></div>
                  <div className="text-3xl md:text-4xl font-black text-amber-400">
                    Bs. {(totalMaterialesMensual + data.inversiones.filter(i => i.tipo === 'infraestructura' || i.tipo === 'personal').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      }
case 5: {
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

      case 6: return (
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
        const costosOpe = data.inversiones.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo));

        const cfTotal = totalFijos;
        const cvTotal = costosVariablesTotalesMes;

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
                  {/* Fila de Materiales Automática */}
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <td className="p-3 font-medium text-slate-700 border-r border-slate-100">
                      <span className="block">Materiales e Insumos (Totales según demanda)</span>
                      <span className="text-xs text-slate-400 uppercase">Automático (Paso 3 y 4)</span>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      <div className="px-3 py-1.5 rounded-xl text-sm font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">Costo Variable</div>
                    </td>
                    <td className="p-3 text-right font-bold text-indigo-600 bg-slate-50/50">
                      {(costosVariablesTotalesMes - totalVariablesGlo).toFixed(2)}
                    </td>
                  </tr>
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

      case 8: return (
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

      case 7: {
        const totalFijos = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
        const totalVariablesGlo = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
        const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
        const fijoPorUnidad = totalFijos / totalProdMensual;
        const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

        return (
          <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 hidden sm:block">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">Calculadora: Precio de Venta</h2>
                <p className="text-sm sm:text-base text-slate-500 font-medium">El sistema ha prorrateado tus costos operativos automáticamente.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-slate-200">
               <div className="flex flex-col">
                 <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Producción Global</span>
                 <span className="text-base sm:text-lg font-black text-slate-700">{totalProdMensual} unds/mes</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Fijos Totales</span>
                 <span className="text-base sm:text-lg font-black text-slate-700">Bs. {totalFijos.toFixed(2)}</span>
               </div>
               <div className="flex flex-col sm:text-right bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                 <span className="text-[10px] sm:text-xs font-bold text-indigo-500 uppercase tracking-wider">Fijo por Unidad</span>
                 <span className="text-lg sm:text-xl font-black text-indigo-700">Bs. {fijoPorUnidad.toFixed(2)}</span>
               </div>
            </div>

            <div className="flex flex-col gap-6">
              {(data.productos || []).map((prod, pIdx) => {
                const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                const costoUnitario = costoMaterialesUnitario + fijoPorUnidad + variableGlobalPorUnidad;
                const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
                const precioFacturado = precioSinFactura / 0.84;

                return (
                  <div key={prod.id} className="rounded-2xl p-4 sm:p-6 bg-white shadow-md border-t border-r border-b border-l-[6px] border-slate-200 border-l-indigo-500">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 border-b border-slate-100 pb-3 gap-2">
                      <h3 className="font-black text-xl text-slate-800 leading-tight">Producto: <span className="text-indigo-600">{prod.nombre || 'Sin nombre'}</span></h3>
                      <span className="text-xs sm:text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">Prod: {prod.produccionMensual || 0} u/mes</span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm sm:text-base"><div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">1</div> Costo Unitario</h4>
                        
                        <div className="flex justify-between text-xs sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                          <span>Materiales e Ingredientes</span>
                          <span className="font-bold text-emerald-600">Bs. {costoMaterialesUnitario.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                          <span>Porción de Costo Fijo</span>
                          <span className="font-bold">Bs. {fijoPorUnidad.toFixed(2)}</span>
                        </div>
                        {variableGlobalPorUnidad > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                            <span>Variables Globales</span>
                            <span className="font-bold">Bs. {variableGlobalPorUnidad.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center bg-indigo-50 p-3 sm:p-4 rounded-xl border border-indigo-100 mt-1">
                          <span className="text-indigo-900 font-bold text-sm sm:text-base">Costo Total (CU)</span>
                          <span className="font-black text-indigo-700 text-lg sm:text-xl">Bs. {costoUnitario.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm sm:text-base"><div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">2</div> Proyección de Precio</h4>
                        
                        <div className="flex justify-between items-center bg-white p-2 sm:p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-600 font-bold text-xs sm:text-sm">Margen de Ganancia</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number" min="0" max="99"
                              className="w-16 bg-slate-50 p-1.5 rounded-lg border border-slate-300 font-black text-sm focus:border-indigo-500 outline-none text-center text-indigo-700"
                              value={prod.margenGanancia ?? data.porcentajeGanancia ?? 30}
                              onChange={e => {
                                const newProds = [...data.productos];
                                newProds[pIdx].margenGanancia = parseFloat(e.target.value) || 0;
                                updateGlobalData({ productos: newProds });
                              }}
                            />
                            <span className="font-black text-slate-400 text-sm">%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 font-medium text-xs sm:text-sm">Precio (Sin factura)</span>
                          <span className="font-black text-slate-700 text-base sm:text-lg">Bs. {precioSinFactura.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center bg-indigo-600 p-3 sm:p-4 rounded-xl shadow-md text-white mt-1">
                          <span className="font-bold text-sm sm:text-base leading-tight">Precio Final<br/><span className="text-[10px] sm:text-xs text-indigo-200 font-normal">Facturado (13% IVA + 3% IT)</span></span>
                          <span className="font-black text-xl sm:text-2xl">Bs. {precioFacturado.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 10: return (
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
      case 8: {
        return (
          <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Cálculo de Proyección de ganancias</h2>
                <p className="text-slate-500 font-medium">Así se verán tus ingresos estimados en los próximos meses por producto.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg text-center mb-8">
              <h3 className="text-xl font-bold text-blue-100 mb-4">Configuración de Proyección</h3>
              <div className="flex justify-center items-center gap-8">
                <div>
                  <label className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2 block">Meses a Proyectar</label>
                  <input type="number" min="1" max="24" className="w-48 mx-auto bg-white/10 p-3 rounded-xl border border-white/20 font-bold text-white focus:border-white focus:bg-white/20 outline-none text-3xl text-center" value={data.mesesProyeccion || 6} onChange={e => updateGlobalData({ mesesProyeccion: e.target.value === '' ? '' : (parseInt(e.target.value) || 1) })} />
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-4">La demanda mensual de cada producto se mantendrá constante según la demanda inicial estimada.</p>
            </div>

            <div className="flex flex-col gap-6">
              {(data.productos || []).map(prod => {
                 const totalFijos = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                 const totalVariablesGlo = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                 const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
                 const fijoPorUnidad = totalFijos / totalProdMensual;
                 const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

                 const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                 const costoUnitario = costoMaterialesUnitario + fijoPorUnidad + variableGlobalPorUnidad;
                 const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                 const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
                 const precioFacturado = precioSinFactura / 0.84;
                 
                 const prodBase = prod.produccionMensual || 0;
                 const precio = precioFacturado;

                 return (
                   <div key={prod.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h4 className="font-black text-lg text-slate-800">Producto: <span className="text-indigo-600">{prod.nombre || 'Sin nombre'}</span></h4>
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold w-fit">Demanda Inicial: {prodBase} u/mes</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white min-w-[600px]">
                          <thead className="bg-slate-50/50">
                            <tr>
                              <th className="p-3 text-slate-500 font-bold border-b border-r border-slate-200 w-[160px] sticky left-0 z-10 bg-slate-50">Meses</th>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                                <th key={mes} className="p-3 text-slate-500 font-bold text-center border-b border-slate-200 min-w-[100px]">Mes {mes}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-bold text-slate-700 border-r border-slate-200 sticky left-0 z-10 bg-white">Unidades Vendidas</td>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                                const multiplicador = 1;
                                const unidades = Math.round(prodBase * multiplicador);
                                return <td key={mes} className="p-3 text-slate-600 text-center">{unidades}</td>;
                              })}
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-bold text-slate-700 border-r border-slate-200 sticky left-0 z-10 bg-white">Precio (Bs.)</td>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                                <td key={mes} className="p-3 text-slate-600 text-center">{precio.toFixed(2)}</td>
                              ))}
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/30">
                              <td className="p-3 font-bold text-emerald-800 border-r border-slate-200 sticky left-0 z-10 bg-emerald-50">Ingresos (Bs.)</td>
                              {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                                const multiplicador = 1;
                                const unidades = Math.round(prodBase * multiplicador);
                                const ingresos = unidades * precio;
                                return <td key={mes} className="p-3 font-bold text-emerald-600 text-center whitespace-nowrap">Bs. {ingresos.toFixed(2)}</td>;
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                   </div>
                 );
               })}
             </div>
             
             <div className="mt-8 bg-emerald-600 rounded-2xl overflow-hidden shadow-lg border border-emerald-500">
                <div className="bg-emerald-700 p-4 text-white">
                   <h3 className="font-black text-xl text-center">INGRESO TOTAL CONSOLIDADO (Todos los productos)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-emerald-600 text-white min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="p-4 font-bold border-b border-emerald-500 w-[160px] sticky left-0 z-10 bg-emerald-600">Meses</th>
                        {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                          <th key={mes} className="p-4 font-bold text-center border-b border-emerald-500 min-w-[120px]">Mes {mes}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 font-black border-r border-emerald-500 text-emerald-100 sticky left-0 z-10 bg-emerald-600">Total Ingresos (Bs.)</td>
                        {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                           let totalIngresos = 0;
                           (data.productos || []).forEach(prod => {
                             const totalFijos = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                             const totalVariablesGlo = data.inversiones?.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo) && (i.comportamiento || 'fijo') === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0) || 0;
                             const totalProdMensual = (data.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
                             const fijoPorUnidad = totalFijos / totalProdMensual;
                             const variableGlobalPorUnidad = totalVariablesGlo / totalProdMensual;

                             const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                             const costoUnitario = costoMaterialesUnitario + fijoPorUnidad + variableGlobalPorUnidad;
                             const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                             const precioSinFactura = margen < 100 ? costoUnitario / (1 - (margen / 100)) : costoUnitario;
                             const precioFacturado = precioSinFactura / 0.84;
                             
                             const prodBase = prod.produccionMensual || 0;
                             const multiplicador = 1;
                             const unidades = Math.round(prodBase * multiplicador);
                             totalIngresos += unidades * precioFacturado;
                           });
                           return <td key={mes} className="p-4 font-black text-white text-center text-lg whitespace-nowrap">Bs. {totalIngresos.toFixed(2)}</td>;
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        );
      }
case 9: return (
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
                    const multiplicador = 1;
                    const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
                    const vars = costosVariablesTotalesMes;
                    return <td key={mes} className="p-4 text-slate-600 text-center">{vars.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-red-50/30">
                  <td className="p-4 font-bold text-red-800 border-r border-slate-200 bg-red-100/30 sticky left-0 z-10">Gasto Total (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    const multiplicador = 1;
                    const unidades = Math.round((data.produccionMensual || 0) * multiplicador);
                    const vars = costosVariablesTotalesMes;
                    const total = totalFijos + vars;
                    return <td key={mes} className="p-4 font-bold text-red-600 text-center whitespace-nowrap">Bs. {total.toFixed(2)}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

      case 10: return (
        <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Cálculo de Utilidad Neta</h2>
              <p className="text-slate-500 font-medium">Restando impuestos a tus ganancias consolidadas.</p>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-w-[700px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 sm:p-5 text-slate-500 font-bold border-b border-r border-slate-200 bg-slate-100/50 min-w-[250px] sticky left-0 z-20">Meses</th>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => (
                    <th key={mes} className="p-4 sm:p-5 text-slate-500 font-bold text-center border-b border-slate-200">Mes {mes}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-base">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 border-r border-slate-200 bg-slate-50 sticky left-0 z-10">Utilidad Bruta Global (Bs.)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    let uBrutaMes = 0;
                    const multiplicador = 1;
                    (data.productos || []).forEach(prod => {
                      const prodBase = prod.produccionMensual || 0;
                      const unidades = Math.round(prodBase * multiplicador);
                      
                      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
                      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
                      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
                      const precioFacturado = precioSinFactura / 0.84;
                      
                      const ingresos = unidades * precioFacturado;
                      const gastosVars = unidades * cvUnitario;
                      uBrutaMes += (ingresos - gastosVars);
                    });
                    uBrutaMes -= totalFijos;
                    return <td key={mes} className={`p-4 sm:p-5 font-bold text-center ${uBrutaMes >= 0 ? 'text-slate-600' : 'text-red-500'}`}>{uBrutaMes.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 border-r border-slate-200 bg-slate-50 sticky left-0 z-10">Impuestos Totales (IVA 13% + IT 3%)</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    let ingresosMes = 0;
                    const multiplicador = 1;
                    (data.productos || []).forEach(prod => {
                      const prodBase = prod.produccionMensual || 0;
                      const unidades = Math.round(prodBase * multiplicador);
                      
                      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
                      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
                      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
                      const precioFacturado = precioSinFactura / 0.84;
                      
                      ingresosMes += (unidades * precioFacturado);
                    });
                    const impuestos = ingresosMes * 0.16;
                    return <td key={mes} className="p-4 sm:p-5 text-red-500 text-center font-medium">-{impuestos.toFixed(2)}</td>;
                  })}
                </tr>
                <tr className="hover:bg-amber-50 transition-colors bg-amber-50/40">
                  <td className="p-4 sm:p-5 font-black text-amber-800 border-r border-slate-200 bg-amber-100/50 sticky left-0 z-10 text-lg">Utilidad Neta Consolidada</td>
                  {Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
                    let ingresosMes = 0;
                    let gastosVarsMes = 0;
                    const multiplicador = 1;
                    (data.productos || []).forEach(prod => {
                      const prodBase = prod.produccionMensual || 0;
                      const unidades = Math.round(prodBase * multiplicador);
                      
                      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
                      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
                      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
                      const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
                      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
                      const precioFacturado = precioSinFactura / 0.84;
                      
                      ingresosMes += (unidades * precioFacturado);
                      gastosVarsMes += (unidades * cvUnitario);
                    });
                    const uBruta = ingresosMes - gastosVarsMes - totalFijos;
                    const impuestos = ingresosMes * 0.16;
                    const uNeta = uBruta - impuestos;
                    return <td key={mes} className={`p-4 sm:p-5 font-black text-center whitespace-nowrap text-xl ${uNeta >= 0 ? 'text-amber-600' : 'text-red-600'}`}>Bs. {uNeta.toFixed(2)}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
case 11: return (
        <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Punto de Equilibrio (Multiproducto)</h2>
              <p className="text-slate-500 font-medium">Descubre cuánto debes facturar al mes en total para no perder dinero.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={150} /></div>
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Punto de Equilibrio Global</label>
              <p className="text-sm text-slate-400 mb-4 relative z-10">Ingresos mínimos mensuales para cubrir costos</p>
              <div className="text-4xl sm:text-5xl font-black text-blue-600 relative z-10">
                {margenContribucionPonderado > 0 ? `Bs. ${puntoEquilibrioBs.toFixed(2)}` : '---'}
              </div>
              <span className="text-slate-500 font-bold mt-2 relative z-10">al mes</span>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-center border border-slate-700">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Estado Actual (Mes 1)</h3>

              <div className="mb-4 bg-slate-800/50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-sm">Ventas Totales Esperadas:</span>
                  <span className="font-bold text-white">Bs. {ingresosTotalesMes.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div className={`bg-blue-500 h-2.5 rounded-full`} style={{ width: `${Math.min(100, (ingresosTotalesMes / (puntoEquilibrioBs || 1)) * 100)}%` }}></div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border-2 ${utilidadMensual > 0 ? 'bg-emerald-900/40 border-emerald-500/50' : utilidadMensual < 0 ? 'bg-red-900/40 border-red-500/50' : 'bg-slate-800 border-slate-600'} transition-colors`}>
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-300">Utilidad Bruta (antes de IVA):</span>
                  <span className={`text-3xl font-black ${utilidadMensual > 0 ? 'text-emerald-400' : utilidadMensual < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    Bs. {utilidadMensual.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
case 18: return (
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
      case 12: {
        const inversionInicial = totalInversion;

        // Calculate consolidated Net Cash Flows for VAN and TIR
        const flujos = Array.from({ length: data.mesesProyeccion || 6 }, (_, i) => i + 1).map(mes => {
          let ingresosMes = 0;
          let gastosVarsMes = 0;
          const multiplicador = 1;
          
          (data.productos || []).forEach(prod => {
            const prodBase = prod.produccionMensual || 0;
            const unidades = Math.round(prodBase * multiplicador);
            
            const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
            const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
            const costoUnitarioTotal = cvUnitario + fijoPorUnidad;
            const margen = parseFloat(prod.margenGanancia ?? data.porcentajeGanancia ?? 30);
            const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
            const precioFacturado = precioSinFactura / 0.84;
            
            ingresosMes += (unidades * precioFacturado);
            gastosVarsMes += (unidades * cvUnitario);
          });
          
          const uBruta = ingresosMes - gastosVarsMes - totalFijos;
          const impuestos = ingresosMes * 0.16;
          return uBruta - impuestos;
        });

        const tasaTMAR = (data.tasaDescuento !== undefined && data.tasaDescuento !== '' && data.tasaDescuento !== null) ? parseFloat(data.tasaDescuento) : 13;
        const tasaDescuentoMensual = tasaTMAR / 100;

        let van = -inversionInicial;
        flujos.forEach((flujo, index) => {
          van += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
        });

        let tir = 0;
        let tir_mensual = 0;
        if (inversionInicial > 0 && flujos.some(f => f > 0)) {
          let low = -0.5; 
          let high = 1.0; 
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

        return (
          <div className="animate-fade-in p-4 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-5xl mx-auto mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Evaluación Financiera: VAN y TIR</h2>
                <p className="text-slate-500 font-medium">Calcula si el proyecto multiproducto genera valor real.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-8">
              <button 
                onClick={handleLimpiarTablas}
                className="px-6 py-3.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Trash2 size={20} /> Limpiar todas las tablas
              </button>

              <button 
                onClick={handleGenerarIA}
                disabled={isGeneratingIA}
                className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none w-full sm:w-auto"
              >
                {isGeneratingIA ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Autocompletar con IA
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl text-center mb-8 border border-purple-600">
              <h3 className="text-xl font-bold text-purple-100 mb-4">Tasa de Descuento (TMAR)</h3>
              <p className="text-sm text-purple-200 mb-6 max-w-xl mx-auto">¿Cuánto porcentaje de rentabilidad mensual le exiges a tu portafolio de productos?</p>
              <div className="flex items-center justify-center gap-2">
                <input type="number" min="0" max="100" className="w-32 bg-white/10 p-4 rounded-xl border border-white/20 font-black text-white focus:border-white focus:bg-white/20 outline-none text-4xl text-center shadow-inner" value={data.tasaDescuento === 0 ? 0 : (data.tasaDescuento || 13)} onChange={e => updateGlobalData({ tasaDescuento: e.target.value === '' ? '' : (parseFloat(e.target.value) || 0) })} />
                <span className="text-3xl font-bold text-purple-200">% / mes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden shadow-sm">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Actual Neto (VAN)</div>
                <div className="text-slate-400 text-sm mb-4">Mide cuánto dinero 'extra' generas en valor de hoy. Debe ser mayor a cero.</div>
                <div className={`text-4xl sm:text-5xl font-black ${van >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  Bs. {van.toFixed(2)}
                </div>
                <div className="mt-6 font-bold text-sm">
                  {van > 0
                    ? <span className="text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">¡El proyecto es Rentable! 🎉</span>
                    : <span className="text-red-700 bg-red-100 px-4 py-2 rounded-full border border-red-200">El proyecto destruye valor ⚠️</span>
                  }
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden shadow-sm">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tasa Interna de Retorno (TIR)</div>
                <div className="text-slate-400 text-sm mb-4">Es la rentabilidad real mensual que te da el proyecto. Debe ser mayor a la TMAR.</div>
                <div className={`text-4xl sm:text-5xl font-black ${tir_mensual >= tasaTMAR ? 'text-emerald-500' : 'text-red-500'}`}>
                  {tir_mensual.toFixed(2)} %
                </div>
                <div className="mt-6 font-bold text-sm">
                  {tir_mensual >= tasaTMAR
                    ? <span className="text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">Rinde más de lo exigido 🚀</span>
                    : <span className="text-red-700 bg-red-100 px-4 py-2 rounded-full border border-red-200">No alcanza la tasa exigida 📉</span>
                  }
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end pb-8">
              <button 
                onClick={handleFinalizar}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xl shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <CheckCircle2 size={28} /> Finalizar Plan Financiero
              </button>
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
      totalPasos={19}
      tabs={[
          { id: 1, icon: <Video size={16} />, label: 'Video' },
          { id: 2, icon: <Wallet size={16} />, label: 'Cap. Inversión' },
          { id: 3, icon: <Calculator size={16} />, label: 'Costos por Prod.' },
          { id: 4, icon: <Package size={16} />, label: 'Cap. Trabajo' },
          { id: 5, icon: <Wallet size={16} />, label: 'Resumen' },
          { id: 6, icon: <Calculator size={16} />, label: 'Costos' },
          { id: 7, icon: <Calculator size={16} />, label: 'Precio Venta' },
          { id: 8, icon: <TrendingUp size={16} />, label: 'Proy. Gan' },
          { id: 9, icon: <Wallet size={16} />, label: 'Proy. Gastos' },
          { id: 10, icon: <TrendingUp size={16} />, label: 'Utilidad' },
          { id: 11, icon: <Calculator size={16} />, label: 'Equilibrio' },
          { id: 12, icon: <TrendingUp size={16} />, label: 'VAN y TIR' }
        ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => step < 12 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 ? "Comprender qué necesitas comprar antes de abrir es vital para no quedarte sin dinero a mitad del camino." :
          step === 2 ? "Usa la caja de herramientas para listar tus activos fijos y diferidos (Capital de Inversión)." :
            step === 3 ? "Define la receta base o estructura de costos por unidad para cada producto." :
              step === 4 ? "Ingresa aquí el capital de trabajo: materia prima (automático), insumos, sueldos y gastos de arranque." :
                step === 5 ? "Aquí puedes ver el resumen total de todo lo que necesitas para arrancar tu negocio." :
                  step === 6 ? "Fijar un precio correcto garantiza que cubras tus costos y generes ganancias." :
                    step === 7 ? "Usa tu costo unitario y define el margen de ganancia ideal para fijar tu precio con y sin factura." :
                      step === 8 ? "Diferenciar entre lo que pagas fijo cada mes y lo que varía según tus ventas es la clave para fijar precios." :
                        step === 9 ? "Clasifica tus costos en fijos y variables para entender tu estructura." :
                          step === 10 ? "Proyectar ganancias te permite ver el futuro financiero de tu negocio." :
                            step === 11 ? "Mira cómo se acumulan tus ganancias proyectadas a lo largo del tiempo." :
                              step === 12 ? "Así como hay ingresos, hay gastos. Proyectarlos es vital." :
                                step === 13 ? "Estima tus gastos fijos y variables a lo largo de los meses." :
                                  step === 14 ? "La utilidad bruta son tus ingresos menos tus costos directos. Aún faltan los impuestos." :
                                    step === 15 ? "Aplica el porcentaje de impuestos de tu país para obtener la verdadera Utilidad Neta." :
                                      step === 16 ? "El punto de equilibrio es tu meta de supervivencia. Descubre qué es." :
                                        step === 17 ? "¡Descubre cuántas unidades necesitas vender al mes solo para no perder dinero!" :
                                          step === 18 ? "El VAN y la TIR son los jueces finales. Determinan si tu idea es un buen negocio." :
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
