import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SplashScreenMentor from '../components/ui/SplashScreenMentor';
import PasoLayout from '../layouts/PasoLayout';
import { Bot, Settings, Download, CheckCircle, Sparkles } from 'lucide-react';
import { obtenerTodoElContenidoProyecto, generarDocumentoConsolidadoIA, guardarContenidoFase, obtenerPerfilActivo } from '../services/api';
import { generarYDescargarWord } from '../lib/docxGenerator';
import html2canvas from 'html2canvas';

const Fase13_DocumentoIA = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);
  const [step, setStep] = useState(1);
  const [configIA, setConfigIA] = useState({ tono: 'Académico y Formal', instrucciones: '' });
  const [generando, setGenerando] = useState(false);
  const [estadoIA, setEstadoIA] = useState('');
  const [datosListos, setDatosListos] = useState(null);
  const [mejoradosListos, setMejoradosListos] = useState({});
  const [perfilListo, setPerfilListo] = useState(null);
  const [errorStr, setErrorStr] = useState(null);

  const handleUpdateConfig = (field, value) => {
    setConfigIA(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerarDocumento = async () => {
    setGenerando(true);
    setErrorStr(null);
    setEstadoIA('Recopilando información de todas las fases...');
    
    try {
      const datosTotales = await obtenerTodoElContenidoProyecto();
      const perfilResponse = await obtenerPerfilActivo();
      const perfilUsuario = perfilResponse?.perfil || {};
      
      setEstadoIA('Generando capturas visuales (Organigrama y Layout)...');
      
      let organigramaBase64 = null;
      let layoutBase64 = null;
      let croquisBase64 = datosTotales[6]?.croquisImagen || null;

      const captureContainer = document.createElement('div');
      captureContainer.style.position = 'absolute';
      captureContainer.style.top = '-9999px';
      captureContainer.style.left = '-9999px';
      captureContainer.style.width = '1024px';
      captureContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(captureContainer);

      try {
        const layoutData = datosTotales[8]?.cuadriculaLayout;
        if (Array.isArray(layoutData)) {
          const layoutDiv = document.createElement('div');
          layoutDiv.style.padding = '20px';
          layoutDiv.style.border = '2px solid #e2e8f0';
          layoutDiv.style.borderRadius = '12px';
          
          const h3 = document.createElement('h3');
          h3.innerText = 'Layout del Proyecto';
          h3.style.textAlign = 'center';
          h3.style.fontSize = '24px';
          h3.style.fontWeight = 'bold';
          h3.style.marginBottom = '20px';
          h3.style.color = '#1e293b';
          layoutDiv.appendChild(h3);

          const grid = document.createElement('div');
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
          grid.style.gap = '10px';
          
          layoutData.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.style.aspectRatio = '1';
            cellDiv.style.border = cell ? '2px solid #818cf8' : '2px dashed #cbd5e1';
            cellDiv.style.backgroundColor = cell ? '#e0e7ff' : '#f8fafc';
            cellDiv.style.display = 'flex';
            cellDiv.style.alignItems = 'center';
            cellDiv.style.justifyContent = 'center';
            cellDiv.style.fontWeight = 'bold';
            cellDiv.style.fontSize = '14px';
            cellDiv.style.textAlign = 'center';
            cellDiv.style.padding = '5px';
            cellDiv.style.borderRadius = '8px';
            cellDiv.style.color = cell ? '#4338ca' : '#94a3b8';
            cellDiv.innerText = cell || '';
            grid.appendChild(cellDiv);
          });
          layoutDiv.appendChild(grid);
          captureContainer.appendChild(layoutDiv);

          const canvas = await html2canvas(layoutDiv);
          layoutBase64 = canvas.toDataURL('image/png');
          captureContainer.removeChild(layoutDiv);
        }

        const orgData = datosTotales[9]?.estructura?.organigrama;
        if (Array.isArray(orgData) && orgData.length > 0) {
          const orgDiv = document.createElement('div');
          orgDiv.style.padding = '40px';
          orgDiv.style.border = '2px solid #e2e8f0';
          orgDiv.style.borderRadius = '12px';
          
          const h3 = document.createElement('h3');
          h3.innerText = 'Estructura Organizacional';
          h3.style.textAlign = 'center';
          h3.style.fontSize = '24px';
          h3.style.fontWeight = 'bold';
          h3.style.marginBottom = '40px';
          h3.style.color = '#1e293b';
          orgDiv.appendChild(h3);

          const flex = document.createElement('div');
          flex.style.display = 'flex';
          flex.style.flexDirection = 'column';
          flex.style.alignItems = 'center';
          flex.style.gap = '30px';

          const ceo = orgData.find(n => !n.parentId || n.tipo === 'lider' || n.id === 'ceo');
          if (ceo) {
            const ceoDiv = document.createElement('div');
            ceoDiv.innerText = ceo.nombre || 'Dirección';
            ceoDiv.style.padding = '15px 30px';
            ceoDiv.style.background = '#3b82f6';
            ceoDiv.style.color = '#fff';
            ceoDiv.style.borderRadius = '12px';
            ceoDiv.style.fontWeight = 'bold';
            ceoDiv.style.fontSize = '20px';
            flex.appendChild(ceoDiv);

            const areas = orgData.filter(n => n.parentId === ceo.id && n.tipo === 'area');
            if (areas.length > 0) {
              const line = document.createElement('div');
              line.style.width = '2px';
              line.style.height = '30px';
              line.style.background = '#94a3b8';
              flex.appendChild(line);
            }

            const areasContainer = document.createElement('div');
            areasContainer.style.display = 'flex';
            areasContainer.style.gap = '20px';
            areasContainer.style.justifyContent = 'center';
            areasContainer.style.flexWrap = 'wrap';
            
            areas.forEach(area => {
              const areaCol = document.createElement('div');
              areaCol.style.display = 'flex';
              areaCol.style.flexDirection = 'column';
              areaCol.style.alignItems = 'center';

              const areaLine = document.createElement('div');
              areaLine.style.borderTop = '2px solid #94a3b8';
              areaLine.style.width = '100%';
              areaLine.style.marginBottom = '15px';
              areaCol.appendChild(areaLine);

              const areaDiv = document.createElement('div');
              areaDiv.innerText = area.nombre || 'Área';
              areaDiv.style.padding = '10px 20px';
              areaDiv.style.background = '#8b5cf6';
              areaDiv.style.color = '#fff';
              areaDiv.style.borderRadius = '8px';
              areaDiv.style.fontWeight = 'bold';
              areaDiv.style.fontSize = '16px';
              areaDiv.style.marginBottom = '15px';
              areaCol.appendChild(areaDiv);

              const subs = orgData.filter(n => n.parentId === area.id);
              subs.forEach(sub => {
                const subDiv = document.createElement('div');
                subDiv.innerText = sub.nombre || 'Cargo';
                subDiv.style.padding = '8px 15px';
                subDiv.style.background = '#f1f5f9';
                subDiv.style.color = '#334155';
                subDiv.style.border = '1px solid #cbd5e1';
                subDiv.style.borderRadius = '6px';
                subDiv.style.fontSize = '14px';
                subDiv.style.marginBottom = '8px';
                areaCol.appendChild(subDiv);
              });

              areasContainer.appendChild(areaCol);
            });

            flex.appendChild(areasContainer);
          }
          orgDiv.appendChild(flex);
          captureContainer.appendChild(orgDiv);

          const canvas = await html2canvas(orgDiv);
          organigramaBase64 = canvas.toDataURL('image/png');
        }
      } catch (e) {
        console.error("Error capturando graficos:", e);
      } finally {
        if (document.body.contains(captureContainer)) {
          document.body.removeChild(captureContainer);
        }
      }

      const imagenesBase64 = {
        croquis: croquisBase64,
        layout: layoutBase64,
        organigrama: organigramaBase64
      };

      setEstadoIA('Estructurando tu documento final...');
      
      let mejorados = {};
      
      if (configIA.tono !== 'No usar IA (Original)') {
        setEstadoIA('Consolidando textos para análisis general (Mega-Prompt)...');
        
        const textosBrutos = {};
        
        const s = (val) => {
          if (!val) return '';
          if (typeof val === 'string') {
            try {
              const parsed = JSON.parse(val);
              if (typeof parsed === 'object') return s(parsed);
            } catch (e) {}
          }
          if (Array.isArray(val)) {
            return val.map(v => s(v)).filter(Boolean).join(', ');
          }
          if (typeof val === 'object') {
            return val.text || val.texto || val.nombre || val.desc || val.descripcion || val.title || val.name || val.problema || val.segmento || val.beneficio || val.caracteristica || '';
          }
          return String(val);
        };
        const ds = (fase, key) => s(datosTotales[fase]?.[key]);

        const pushIA = (key, promptText) => {
          if (promptText && promptText.trim().length > 5) {
            textosBrutos[key] = promptText;
          }
        };

        const reqGen = (nombre) => `[SECCIÓN VACÍA] Redacta la sección '${nombre}' desde cero, creando contenido coherente basado estrictamente en el contexto global del proyecto. Escribe en párrafos, no dejes instrucciones.`;

        // Fase 11
        pushIA('agradecimientos', ds(11, 'agradecimientos') ? `Agradecimientos: ${ds(11, 'agradecimientos')}.` : reqGen('Agradecimientos'));
        pushIA('dedicatoria', ds(11, 'dedicatoria') ? `Dedicatoria: ${ds(11, 'dedicatoria')}.` : reqGen('Dedicatoria'));
        const instructionResumen = ds(11, 'resumen') 
            ? `Mejora este Resumen Ejecutivo del proyecto: ${ds(11, 'resumen')}.` 
            : `Genera un Resumen Ejecutivo automático y muy profesional del proyecto estructurando toda la información que te he pasado en este JSON (el título, problema, mercado, producto y viabilidad financiera). Redáctalo en 2 o 3 párrafos de forma que enganche a un inversor.`;
        pushIA('resumen', instructionResumen);
        pushIA('intro_contexto', ds(11, 'intro_contexto') ? `Contexto: ${ds(11, 'intro_contexto')}.` : reqGen('Contexto General'));
        pushIA('intro_problema', ds(11, 'intro_problema') ? `Problema: ${ds(11, 'intro_problema')}.` : reqGen('Problema a Resolver'));
        pushIA('intro_objetivos', ds(11, 'intro_objetivos') ? `Objetivos en la introducción: ${ds(11, 'intro_objetivos')}.` : reqGen('Objetivos (General y Específicos)'));
        pushIA('intro_estructura', ds(11, 'intro_estructura') ? `Estructura en la introducción: ${ds(11, 'intro_estructura')}.` : reqGen('Estructura del Documento'));
        pushIA('conclusiones', ds(11, 'conclusiones') ? `Conclusiones: ${ds(11, 'conclusiones')}.` : reqGen('Conclusiones Generales'));
        pushIA('resultados', datosTotales[11] && (ds(11, 'resultados_mercado') || ds(11, 'resultados_tecnico') || ds(11, 'resultados_financiero')) ? `Resultados. Mercado: ${ds(11, 'resultados_mercado')}. Técnico: ${ds(11, 'resultados_tecnico')}. Financiero: ${ds(11, 'resultados_financiero')}.` : reqGen('Resultados del Proyecto'));

        // Fase 7
        pushIA('diagnostico', ds(7, 'diagnostico') ? `Diagnóstico del contexto productivo: ${ds(7, 'diagnostico')}.` : reqGen('Diagnóstico del Contexto Productivo'));
        const objG = ds(7, 'obj_producto') ? `Producto: ${ds(7, 'obj_producto')}. Público: ${ds(7, 'obj_publico')}. Plazo: ${ds(7, 'obj_plazo')}` : null;
        pushIA('objGeneral', objG ? `Objetivo General: ${objG}. Empezar con verbo en infinitivo.` : reqGen('Objetivo General'));
        const objEsp = datosTotales[7] ? [ds(7, 'obj_especifico_1'), ds(7, 'obj_especifico_2'), ds(7, 'obj_especifico_3'), ds(7, 'obj_especifico_4')].filter(Boolean).join('\n') : null;
        pushIA('objEspecificos', objEsp ? `Objetivos Específicos:\n${objEsp}` : reqGen('Objetivos Específicos'));
        pushIA('mision', ds(7, 'mision_redaccion_final') ? `Misión: ${ds(7, 'mision_redaccion_final')}.` : reqGen('Misión de la Empresa'));
        pushIA('vision', ds(7, 'vision_redaccion_final') ? `Visión: ${ds(7, 'vision_redaccion_final')}.` : reqGen('Visión de la Empresa'));
        const justif = ds(7, 'justificacion_social') ? `Social: ${ds(7, 'justificacion_social')}. Económica: ${ds(7, 'justificacion_economica')}. Personal: ${ds(7, 'justificacion_personal')}.` : null;
        pushIA('justificacion', justif ? `Justificación:\n${justif}` : reqGen('Justificación Social, Económica y Personal'));

        // Fase 6
        pushIA('localizacion', ds(6, 'dondeProducir') ? `Localización Macro: ${ds(6, 'dondeProducir')}. Localización Micro: ${ds(6, 'dondeVender')}.` : reqGen('Localización y Distribución'));
        pushIA('logistica_entrega', ds(6, 'comoEntregar') ? `Logística de entrega actual: ${ds(6, 'comoEntregar')}.` : reqGen('Logística de Entrega'));
        pushIA('metodos_pago', ds(6, 'comoRecibirPago') ? `Métodos de pago aceptados: ${ds(6, 'comoRecibirPago')}.` : reqGen('Métodos de Pago'));
        pushIA('necesidades_distribucion', ds(6, 'necesidadesDistribucion') ? `Necesidades de distribución (recursos): ${ds(6, 'necesidadesDistribucion')}.` : reqGen('Necesidades de Distribución'));
        const planDist = datosTotales[6]?.planDistribucion;
        if (Array.isArray(planDist) && planDist.length > 0) {
          const textoPlan = planDist.map(p => `- Acción: ${s(p.accion)} | Cuándo: ${s(p.cuando)} | Responsable: ${s(p.quien)} | Recursos: ${s(p.necesito)}`).join('\n');
          pushIA('plan_distribucion', `Plan de Acción de Distribución:\n${textoPlan}`);
        } else {
          pushIA('plan_distribucion', reqGen('Plan de Acción de Distribución'));
        }
        const presupuesto = datosTotales[6]?.presupuesto;
        if (Array.isArray(presupuesto) && presupuesto.length > 0) {
          const textoPres = presupuesto.map(p => `- ${s(p.concepto)}: Costo $${s(p.costoUnitario)} x Cantidad ${s(p.cantidad)}`).join('\n');
          pushIA('presupuesto', `Presupuesto estimado:\n${textoPres}`);
        } else {
          pushIA('presupuesto', reqGen('Presupuesto de Distribución'));
        }

        // Fase 5
        let textoOferta = "Análisis de Oferta (Competidores y Soluciones actuales):\n";
        let tieneOferta = false;
        if (Array.isArray(datosTotales[5]?.competencia)) { textoOferta += datosTotales[5].competencia.map(c => `- Competidor: ${s(c.nombre)} | Vende: ${s(c.vende)} | Fortalezas: ${s(c.fortalezas)} | Debilidades: ${s(c.debilidades)}`).join('\n'); tieneOferta = true; }
        if (Array.isArray(datosTotales[5]?.soluciones)) { textoOferta += "\n" + datosTotales[5].soluciones.map(sItem => `- Solución actual usada: Porque ${s(sItem.porque)} | Problema o frustración: ${s(sItem.frustracion)}`).join('\n'); tieneOferta = true; }
        pushIA('oferta', tieneOferta ? textoOferta : reqGen('Análisis de Oferta y Competencia'));
        
        let textoPestel = "Análisis PESTEL:\n";
        let tienePestel = false;
        ['pestelPolitico', 'pestelEconomico', 'pestelSocial', 'pestelTecnologico', 'pestelAmbiental'].forEach(p => { if (datosTotales[5]?.[p]) { textoPestel += `- ${p}: ${ds(5, p)}\n`; tienePestel = true; } });
        pushIA('entorno', tienePestel ? textoPestel : reqGen('Análisis del Entorno PESTEL'));

        const ventaja = ds(5, 'ventajaFrase');
        pushIA('ventaja_competitiva', ventaja ? `Ventaja Competitiva: ${ventaja}.` : reqGen('Ventaja Competitiva'));
        const promo = ds(5, 'promoCanales') ? `Canales Promoción: ${ds(5, 'promoCanales')}. Distribución: ${ds(6, 'distDondeVender')}` : null;
        pushIA('promocion', promo ? `Estrategia de promoción: ${promo}.` : reqGen('Estrategia de Promoción'));

        // Fase 3
        pushIA('demanda', ds(3, 'tamano_mercado') ? `Demanda potencial: ${ds(3, 'tamano_mercado')}.` : reqGen('Análisis de Demanda'));
        pushIA('publico_objetivo', ds(3, 'perfil_cliente') ? `Público objetivo: ${ds(3, 'perfil_cliente')}.` : reqGen('Público Objetivo'));

        // Fase 4
        const caracteristicasProd = datosTotales[4]?.caracteristicasProducto || datosTotales[4]?.caracteristicasServicio;
        if (Array.isArray(caracteristicasProd) && caracteristicasProd.length > 0) {
          const textoCarac = caracteristicasProd.map(c => `- Característica: ${s(c.caracteristica)} | Beneficio: ${s(c.beneficio)}`).join('\n');
          pushIA('caracteristicas_producto', `Características y beneficios:\n${textoCarac}`);
        } else {
          pushIA('caracteristicas_producto', reqGen('Características del Producto o Servicio'));
        }
        pushIA('empaque', ds(4, 'empaqueProducto') ? `Empaque del producto: ${ds(4, 'empaqueProducto')}.` : reqGen('Empaque y Etiquetado'));

        // Fase 8
        const procesos = datosTotales[8]?.pasosProduccion;
        if (Array.isArray(procesos) && procesos.length > 0) {
          const textoProc = procesos.map(p => `- ${s(p.texto)} (${s(p.categoria) || 'General'})`).join('\n');
          pushIA('procesos', `Procesos de producción:\n${textoProc}`);
        } else {
          pushIA('procesos', reqGen('Ciclo de Producción o Servicio'));
        }
        pushIA('layout', datosTotales[8]?.cuadriculaLayout ? `Layout elementos: ${datosTotales[8].cuadriculaLayout.filter(x => x).map(x => s(x)).join(', ')}.` : reqGen('Layout y Distribución de Planta'));

        // Fase 9
        const roles = datosTotales[9]?.estructura?.roles;
        if (Array.isArray(roles) && roles.length > 0) {
          const textRoles = roles.map(r => `- ${s(r.nombreRol)}: ${s(r.objetivo)}. Tareas: ${(r.tareas || []).map(t=>s(t.tarea)).join(', ')}`).join('\n');
          pushIA('estructura_org', `Estructura organizacional:\n${textRoles}`);
        } else {
          pushIA('estructura_org', reqGen('Estructura Organizacional y Roles'));
        }

        // Fase 10 (Viabilidad - Tablas)
        const van = datosTotales[10]?.van;
        const tir = datosTotales[10]?.tir;
        if (van !== undefined && tir !== undefined) {
           pushIA('viabilidad', `Indicadores Financieros: VAN = ${van}, TIR = ${tir}%.`);
        } else {
           pushIA('viabilidad', reqGen('Viabilidad Financiera y Sostenibilidad'));
        }
        
        // Ya no pedimos a la IA que invente las tablas en Fase 13,
        // porque ahora se generan explícitamente en la propia Fase 10.

        // Fase 12 (Proyecto de Vida)
        const proposito = ds(12, 'proposito_valor');
        if (proposito) {
           pushIA('proyecto_vida', `Propósito de vida y visión: ${proposito}.`);
        } else {
           pushIA('proyecto_vida', reqGen('Proyecto de Vida (Impacto Personal)'));
        }

        // Obtener contexto global
        const titulo = ds(1, 'titulo_proyecto') || ds(2, 'nombreIdea') || "Proyecto Emprendedor";
        const problema = ds(2, 'problema') || "";
        const contextoGlobal = `Título: ${titulo}\nProblema que resuelve: ${problema}`;

        // Ejecución en Lotes (Batching) para evitar colapsos
        try {
          const keys = Object.keys(textosBrutos);
          const chunkSize = 6; // Procesar de 6 en 6
          mejorados = {};
          
          for (let i = 0; i < keys.length; i += chunkSize) {
            const chunkKeys = keys.slice(i, i + chunkSize);
            const chunkObj = {};
            chunkKeys.forEach(k => chunkObj[k] = textosBrutos[k]);
            
            setEstadoIA(`Redactando secciones ${i + 1} a ${Math.min(i + chunkSize, keys.length)} de ${keys.length}...`);
            const chunkResult = await generarDocumentoConsolidadoIA(chunkObj, contextoGlobal, configIA);
            mejorados = { ...mejorados, ...chunkResult };
          }
        } catch (megaError) {
          console.error("Fallo la generación por lotes", megaError);
          throw megaError; 
        }
      }

      setEstadoIA('Formateando el documento Word...');
      await generarYDescargarWord(datosTotales, mejorados, imagenesBase64, perfilUsuario);
      
      try {
        await guardarContenidoFase(13, 'paso_actual', 2);
      } catch(e) {
        console.error("Error al guardar estado de fase 13", e);
      }
      
      setDatosListos(datosTotales);
      setMejoradosListos(mejorados);
      setPerfilListo(perfilUsuario);
      setStep(2);
      
    } catch (err) {
      console.error(err);
      setErrorStr(err.message || 'Error al generar el documento. Inténtalo de nuevo.');
    } finally {
      setGenerando(false);
    }
  };

  if (showSplash) {
    return (
      <SplashScreenMentor 
        faseNumero="13"
        titulo="Generador de Proyecto Final"
        descripcion="Es el momento de recopilar todo el trabajo que has hecho. Usa nuestra IA para compilar, estructurar y formatear toda tu investigación en un documento profesional listo para presentar."
        onComenzar={() => setShowSplash(false)}
      />
    );
  }

  const sectionClass = "animate-fade-in p-8 bg-white rounded-3xl shadow-xl border-2 border-slate-100 mb-8 max-w-3xl mx-auto w-full";

  const getPasoContent = () => {
    if (generando) {
      return (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 w-full max-w-3xl mx-auto">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600">
              <Bot size={32} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Procesando Documento</h3>
          <p className="text-slate-500 font-medium text-lg animate-pulse">{estadoIA}</p>
        </motion.div>
      );
    }

    if (step === 1) {
      return (
        <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
          <div className={sectionClass}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Bot size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 m-0">Configuración de Redacción</h2>
                <p className="text-slate-500 m-0">Ajusta cómo quieres que la IA redacte tu documento final.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Settings size={18} /> Tono de Redacción
              </label>
              <select 
                value={configIA.tono} 
                onChange={e => handleUpdateConfig('tono', e.target.value)} 
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-lg cursor-pointer"
              >
                <option value="Académico y Formal">Académico y Formal (Recomendado para tesis)</option>
                <option value="Persuasivo y Comercial">Persuasivo y Comercial (Recomendado para inversores)</option>
                <option value="Directo y Ejecutivo">Directo y Ejecutivo (Conciso, al grano)</option>
                <option value="No usar IA (Original)">No usar IA (Insertar mis textos tal cual)</option>
              </select>
            </div>
            
            {configIA.tono !== 'No usar IA (Original)' && (
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">Instrucciones Adicionales (Opcional)</label>
                <textarea 
                  value={configIA.instrucciones} 
                  onChange={e => handleUpdateConfig('instrucciones', e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none h-32"
                  placeholder="Ej: Asegúrate de usar vocabulario técnico empresarial. Corrige cualquier falta de ortografía."
                />
              </div>
            )}

            {errorStr && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-200">
                {errorStr}
              </div>
            )}

            <button 
              onClick={handleGenerarDocumento}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl flex items-center justify-center gap-3 text-lg px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              <Sparkles size={24} /> Generar Documento (Word)
            </button>
          </div>
        </motion.div>
      );
    }

    if (step === 2) {
      return (
        <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={sectionClass + " text-center border-emerald-300 relative overflow-hidden w-full"}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 opacity-50 z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
              <CheckCircle size={48} className="text-emerald-600" />
            </div>
            
            <h2 className="text-3xl font-black text-emerald-700 mb-4">¡Documento Generado!</h2>
            <p className="text-lg text-slate-700 mb-8 font-medium">El archivo Word se ha descargado automáticamente. Puedes encontrarlo en tu carpeta de Descargas.</p>

            <div className="space-y-4">
              <button 
                onClick={() => generarYDescargarWord(datosListos, mejoradosListos, {}, perfilListo)}
                className="w-full bg-white text-emerald-600 border-2 border-emerald-200 hover:bg-emerald-50 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
              >
                <Download size={24} /> Volver a Descargar
              </button>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-lg py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md"
              >
                Finalizar Proyecto
              </button>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <PasoLayout 
      faseTitle="Fase 13: Proyecto Final"
      pasoActual={step}
      totalPasos={2}
      tabs={[
        { id: 1, icon: <Settings size={16} />, label: 'Configuración' },
        { id: 2, icon: <CheckCircle size={16} />, label: 'Documento' }
      ]}
      onTabClick={() => {}}
      onSiguiente={null}
      onAnterior={step > 1 ? () => setStep(step - 1) : null}
      mentorText={
        step === 1 ? "La Inteligencia Artificial tomará toda la información que llenaste en las fases anteriores y le dará estructura y formato académico." : 
        "¡Excelente trabajo! Hemos llegado al final de este recorrido. Revisa tu documento y prepárate para presentarlo."
      }
    >
      <AnimatePresence mode="wait">
        <div className="w-full flex justify-center">
          {getPasoContent()}
        </div>
      </AnimatePresence>
    </PasoLayout>
  );
};

export default Fase13_DocumentoIA;
