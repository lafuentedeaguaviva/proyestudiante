import YoutubePlayer from '../components/ui/YoutubePlayer';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SplashScreenMentor from '../components/ui/SplashScreenMentor';
import PasoLayout from '../layouts/PasoLayout';
import { Bot, Settings, Download, CheckCircle, Sparkles, Video } from 'lucide-react';
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
  const [imagenesListas, setImagenesListas] = useState({});
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
      
      // Procesar encuestas para Anexos
      if (datosTotales[2]) {
        const cols = [
          { key: 'edad', label: '1. Edad' },
          { key: 'genero', label: '2. Género' },
          { key: 'zona', label: '3. Zona' },
          { key: 'est', label: '4. Nivel de estudios' },
          { key: 'ing', label: '5. Recibes dinero' },
          { key: 'cant', label: '6. Cantidad semanal' },
          { key: 'gasto', label: '7. Gastos' },
          { key: 'frec', label: '8. Frecuencia' },
          { key: 'import', label: '9. Lo más importante' },
          { key: 'lugar', label: '10. Dónde adquieres' },
          { key: 'redes', label: '11. Redes sociales' },
          { key: 'dif', label: '12. Dificultad (1-5)' },
          { key: 'intent', label: '13. Intentos previos' },
          { key: 'act', label: '14. Acción actual' },
          { key: 'uso', label: '15. ¿Usarías el producto?' },
          { key: 'pago', label: '16. ¿Cuánto pagarías?' },
          { key: 'carac', label: '17. Característica clave' }
        ];
        const rawEncuestas = datosTotales[2].encuestas || [];
        const validEncuestas = rawEncuestas.length > 0 ? rawEncuestas : [
          { edad: '14-17', genero: 'Femenino', uso: 'Sí', pago: '5-10', frec: '2-3 veces/sem', dif: '4' }, 
          { edad: '18-21', genero: 'Masculino', uso: 'Sí', pago: '11-20', dif: '5', act: 'Internet' }
        ];
        
        datosTotales[2].encuestasProcesadas = cols.map(col => {
          const stats = {};
          let total = 0;
          validEncuestas.forEach(d => {
            const val = d[col.key];
            if (val) {
              stats[val] = (stats[val] || 0) + 1;
              total++;
            }
          });
          const chartData = Object.keys(stats)
            .map(k => ({ 
              name: k, 
              value: stats[k], 
              percentage: Math.round((stats[k] / total) * 100) 
            }))
            .sort((a, b) => b.value - a.value);

          let comment = '';
          if (chartData.length > 0) {
            comment = `💡 Análisis rápido: La opción predominante es "${chartData[0].name}" con un ${chartData[0].percentage}% de respuestas.`;
          }
          return {
            label: col.label,
            data: chartData,
            comment: comment
          };
        }).filter(c => c.data.length > 0);
      }
      
      const parseJsonFallback = (faseObj) => {
        if (!faseObj) return {};
        let merged = { ...faseObj };
        Object.keys(faseObj).forEach(k => {
          if (typeof faseObj[k] === 'string') {
            try {
              const parsed = JSON.parse(faseObj[k]);
              if (parsed && typeof parsed === 'object') {
                merged = { ...merged, ...parsed };
              }
            } catch (e) {}
          }
        });
        return merged;
      };

      const pDT = {};
      for (const f in datosTotales) {
        pDT[f] = parseJsonFallback(datosTotales[f]);
      }

      setEstadoIA('Generando capturas visuales (Organigrama y Layout)...');
      
      let organigramaBase64 = null;
      let layoutBase64 = null;
      let croquisBase64 = pDT[6]?.croquisImagen || null;
      let encuestasBase64 = [];

      const captureContainer = document.createElement('div');
      captureContainer.style.position = 'absolute';
      captureContainer.style.top = '-9999px';
      captureContainer.style.left = '-9999px';
      captureContainer.style.width = '1024px';
      captureContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(captureContainer);

      try {
        const layoutData = pDT[8]?.cuadriculaLayout;
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

        const orgData = pDT[9]?.estructura?.organigrama;
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

        // Generar gráficos de encuestas (barras css)
        const encuestasProc = pDT[2]?.encuestasProcesadas;
        if (Array.isArray(encuestasProc) && encuestasProc.length > 0) {
          for (let i = 0; i < encuestasProc.length; i++) {
            const enc = encuestasProc[i];
            const encDiv = document.createElement('div');
            encDiv.style.padding = '30px';
            encDiv.style.border = '1px solid #e2e8f0';
            encDiv.style.borderRadius = '16px';
            encDiv.style.marginBottom = '20px';
            encDiv.style.width = '600px';
            encDiv.style.backgroundColor = '#fff';
            encDiv.style.fontFamily = "'Inter', Arial, sans-serif";
            encDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';

            const title = document.createElement('h3');
            title.innerText = `${i + 1}. ${enc.label}`;
            title.style.fontSize = '20px';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '40px';
            title.style.color = '#1e293b';
            title.style.textAlign = 'center';
            encDiv.appendChild(title);

            const chartWrapper = document.createElement('div');
            chartWrapper.style.position = 'relative';
            chartWrapper.style.marginLeft = '120px';
            chartWrapper.style.marginRight = '40px';
            chartWrapper.style.marginBottom = '40px';
            chartWrapper.style.borderLeft = '1px solid #94a3b8';
            chartWrapper.style.borderBottom = '1px solid #94a3b8';

            // Create 5 vertical grid lines (0, 1, 2, 3, 4) just like the example
            for (let j = 0; j <= 4; j++) {
              const gridLine = document.createElement('div');
              gridLine.style.position = 'absolute';
              gridLine.style.left = `${j * 25}%`;
              gridLine.style.top = '-20px';
              gridLine.style.bottom = '0';
              gridLine.style.borderLeft = j > 0 ? '1px dashed #cbd5e1' : 'none';
              gridLine.style.zIndex = '0';
              
              const tick = document.createElement('div');
              tick.innerText = j;
              tick.style.position = 'absolute';
              tick.style.bottom = '-25px';
              tick.style.transform = 'translateX(-50%)';
              tick.style.color = '#94a3b8';
              tick.style.fontSize = '14px';
              
              gridLine.appendChild(tick);
              chartWrapper.appendChild(gridLine);
            }

            const barsContainer = document.createElement('div');
            barsContainer.style.display = 'flex';
            barsContainer.style.flexDirection = 'column';
            barsContainer.style.gap = '30px';
            barsContainer.style.paddingTop = '20px';
            barsContainer.style.paddingBottom = '20px';
            barsContainer.style.position = 'relative';
            barsContainer.style.zIndex = '1';

            enc.data.forEach(d => {
              const row = document.createElement('div');
              row.style.display = 'flex';
              row.style.alignItems = 'center';
              row.style.position = 'relative';

              const label = document.createElement('div');
              label.innerText = d.name;
              label.style.position = 'absolute';
              label.style.right = '100%';
              label.style.paddingRight = '10px';
              label.style.width = '120px';
              label.style.fontSize = '14px';
              label.style.textAlign = 'right';
              label.style.color = '#64748b';
              row.appendChild(label);

              const barWrapper = document.createElement('div');
              barWrapper.style.width = '100%';
              barWrapper.style.height = '16px';
              barWrapper.style.display = 'flex';
              barWrapper.style.alignItems = 'center';

              const bar = document.createElement('div');
              bar.style.width = `${d.percentage}%`;
              bar.style.height = '100%';
              bar.style.backgroundColor = '#F59E0B'; // Orange bar
              bar.style.borderRadius = '0 8px 8px 0';
              barWrapper.appendChild(bar);

              const val = document.createElement('div');
              val.innerText = `${d.percentage}%`;
              val.style.marginLeft = '10px';
              val.style.fontSize = '14px';
              val.style.fontWeight = 'bold';
              val.style.color = '#cbd5e1'; // Light grey text for %
              barWrapper.appendChild(val);

              row.appendChild(barWrapper);
              barsContainer.appendChild(row);
            });

            chartWrapper.appendChild(barsContainer);
            encDiv.appendChild(chartWrapper);

            if (enc.comment) {
              const analysisBox = document.createElement('div');
              analysisBox.style.backgroundColor = '#f0f4ff';
              analysisBox.style.borderLeft = '4px solid #3b82f6';
              analysisBox.style.borderRadius = '8px';
              analysisBox.style.padding = '16px 20px';
              analysisBox.style.marginTop = '20px';
              analysisBox.style.color = '#475569';
              analysisBox.style.fontSize = '15px';
              analysisBox.style.lineHeight = '1.5';
              
              const analysisText = document.createElement('span');
              analysisText.innerHTML = `💡 <strong style="color: #1e293b;">Análisis rápido:</strong> ${enc.comment}`;
              analysisBox.appendChild(analysisText);
              
              encDiv.appendChild(analysisBox);
            }

            captureContainer.appendChild(encDiv);

            const canvas = await html2canvas(encDiv, { scale: 2 });
            encuestasBase64.push({
              label: enc.label,
              base64: canvas.toDataURL('image/png'),
              comment: enc.comment
            });
            captureContainer.removeChild(encDiv);
          }
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
        organigrama: organigramaBase64,
        encuestas: encuestasBase64
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
        const ds = (fase, key) => {
          const merged = pDT[fase] || {};
          return s(merged[key]);
        };
        const addOrPushIA = (key, value, promptName) => {
          if (value && value.trim().length > 5) {
            // Ya existe texto generado por el usuario o por la IA en fases previas, lo usamos tal cual
            mejorados[key] = value.trim();
          } else {
            // Está vacío, pedimos a la IA que lo genere desde cero
            textosBrutos[key] = `[SECCIÓN VACÍA] Redacta la sección '${promptName}' desde cero, creando contenido coherente basado estrictamente en el contexto global del proyecto. Escribe en párrafos, no dejes instrucciones.`;
          }
        };

        // Fase 11 (Copiado directo sin pasar por la IA)
        mejorados['agradecimientos'] = ds(11, 'agradecimientos') || '';
        mejorados['dedicatoria'] = ds(11, 'dedicatoria') || '';
        
        // El resumen SIEMPRE se mejora o genera con IA usando todos los datos
        const resumenPrevio = ds(11, 'resumen');
        if (resumenPrevio && resumenPrevio.trim().length > 5) {
            textosBrutos['resumen'] = `Mejora, consolida y amplía el siguiente resumen del proyecto: "${resumenPrevio}". Asegúrate de que tenga un tono formal, profesional y esté redactado exclusivamente en español. Basa tu mejora en todo el contexto del proyecto.`;
        } else {
            textosBrutos['resumen'] = `Redacta un Resumen Ejecutivo completo y formal para el proyecto, basándote en todo el contexto proporcionado. El resumen debe estar redactado exclusivamente en español.`;
        }
        // Consolidación de la Introducción (Copiado directo de Fase 11, igual que en el Resumen IA)
        const objText = ds(11, 'intro_objetivos') ? String(ds(11, 'intro_objetivos')).replace(/Objetivo General:?/gi, 'El propósito principal de este proyecto es:').replace(/Objetivos Específicos:?/gi, 'Para alcanzar esta meta, se realizarán las siguientes acciones:') : '';
        const introConsolidada = [
            ds(11, 'intro_contexto'),
            ds(11, 'intro_problema'),
            objText,
            ds(11, 'intro_estructura')
        ].filter(Boolean).join('\n\n');
        
        mejorados['introduccion_consolidada'] = introConsolidada || '';
        
        // Extract conclusions correctly since datosTotales[11] is nested in documento_final
        const ds11Parsed = pDT[11] || {};
        const concEspec = ds11Parsed.conclusiones_especificas;
        const concGen = ds11Parsed.conclusiones_general || ds11Parsed.conclusion_general;
        const textoConclusiones = [
            ...(Array.isArray(concEspec) ? concEspec : []),
            concGen
        ].filter(Boolean).join('\n\n');
        mejorados['conclusiones'] = textoConclusiones || ds(11, 'conclusiones') || '';
        mejorados['recomendaciones'] = ds(11, 'recomendaciones') || '';

        const v = pDT[11]?.viabilidad || {};
        mejorados['viabilidad_comercial'] = v.viabilidadComercial || ds(11, 'resultados_mercado') || '';
        mejorados['viabilidad_tecnica'] = v.viabilidadTecnica || ds(11, 'resultados_tecnico') || '';
        mejorados['viabilidad_legal'] = v.viabilidadLegal || ds(11, 'resultados_financiero') || '';


        // Fase 7 - Copiado directo sin pasar por IA
        mejorados['diagnostico'] = ds(7, 'diagnostico') || '';
        const objG = ds(7, 'obj_producto') ? `Desarrollar ${ds(7, 'obj_producto')} para ${ds(7, 'obj_publico')} en un plazo de ${ds(7, 'obj_plazo')}` : '';
        mejorados['objGeneral'] = ds(7, 'objGeneral') || objG || '';
        const objEsp = [ds(7, 'obj_especifico_1'), ds(7, 'obj_especifico_2'), ds(7, 'obj_especifico_3'), ds(7, 'obj_especifico_4')].filter(Boolean).join('\n');
        mejorados['objEspecificos'] = objEsp || '';
        mejorados['mision'] = ds(7, 'mision_redaccion_final') || '';
        mejorados['vision'] = ds(7, 'vision_redaccion_final') || '';
        const justif = ds(7, 'justificacion_social') ? `Social: ${ds(7, 'justificacion_social')}\nEconómica: ${ds(7, 'justificacion_economica')}\nPersonal: ${ds(7, 'justificacion_personal')}` : '';
        mejorados['justificacion'] = justif || '';

        // Fase 6 - Copiado directo de Resumen IA
        const parsedFase6 = pDT[6] || {};
        const r6 = parsedFase6.resumen_ia || parsedFase6.resumen_fase6 || {};
        mejorados['localizacion'] = r6.resumen_ubicacion ? `${r6.resumen_ubicacion}\n\n${r6.resumen_canales}` : ds(6, 'dondeProducir') ? `Localización Macro: ${ds(6, 'dondeProducir')}\nLocalización Micro: ${ds(6, 'dondeVender')}` : '';
        mejorados['direccion_ubicacion'] = r6.resumen_direccion || '';
        mejorados['metodos_pago'] = r6.resumen_pagos || ds(6, 'comoRecibirPago') || '';
        mejorados['plan_distribucion'] = r6.resumen_plan || '';

        // Fase 5
        const parsedFase5 = pDT[5] || {};
        const r5 = parsedFase5.resumen_ia || parsedFase5.resumen_fase5 || parsedFase5 || {};
        let textoOferta = r5.resumen_competencia || "";
        if (!textoOferta) {
            if (Array.isArray(parsedFase5.competencia) && parsedFase5.competencia.length > 0) { textoOferta += "Análisis de Competidores:\n" + parsedFase5.competencia.map(c => `- ${s(c.nombre)} | Vende: ${s(c.vende)} | Fortalezas: ${s(c.fortalezas)}`).join('\n'); }
            if (Array.isArray(parsedFase5.soluciones) && parsedFase5.soluciones.length > 0) { textoOferta += "\nSoluciones Actuales:\n" + parsedFase5.soluciones.map(sItem => `- ${s(sItem.porque)} | Problema: ${s(sItem.frustracion)}`).join('\n'); }
        }
        addOrPushIA('oferta', textoOferta, 'Análisis de Oferta y Competencia');
        
        let textoPestel = r5.resumen_entorno || "";
        if (!textoPestel) {
            ['pestelPolitico', 'pestelEconomico', 'pestelSocial', 'pestelTecnologico', 'pestelAmbiental'].forEach(p => { if (parsedFase5[p]) { textoPestel += `- ${p}: ${ds(5, p)}\n`; } });
        }
        addOrPushIA('entorno', textoPestel, 'Análisis del Entorno PESTEL');
        
        const textoVentaja = r5.resumen_ventaja || ds(5, 'ventajaFrase');
        addOrPushIA('ventaja_competitiva', textoVentaja, 'Ventaja Competitiva');
        
        let promo = r5.resumen_promocion || "";
        if (!promo) {
            promo = ds(5, 'promoCanales') ? `Canales Promoción: ${ds(5, 'promoCanales')}\nDistribución: ${ds(6, 'distDondeVender')}` : '';
        }
        addOrPushIA('promocion', promo, 'Estrategia de Promoción');

        // Fase 3 y 4 (Demanda)
        const r4 = datosTotales[4]?.resumen_fase4 || datosTotales[4] || {};
        const textoDemanda = r4.resumen_demanda || ds(3, 'tamano_mercado');
        addOrPushIA('demanda', textoDemanda, 'Análisis de Demanda');
        addOrPushIA('explicacion_indices_demanda', '', 'Explicación de los índices utilizados para la demanda estimada (ej. INE, crecimiento poblacional, encuestas)');
        addOrPushIA('publico_objetivo', ds(3, 'perfil_cliente'), 'Público Objetivo');

        // Fase 4
        let textoCarac = "";
        if (r4.resumen_concepto) {
             textoCarac = r4.resumen_concepto + (r4.resumen_ventaja ? `\n\nVentaja (Beneficios):\n${r4.resumen_ventaja}` : "");
        } else {
             const caracteristicasProd = datosTotales[4]?.caracteristicasProducto || datosTotales[4]?.caracteristicasServicio;
             textoCarac = (Array.isArray(caracteristicasProd) && caracteristicasProd.length > 0) ? caracteristicasProd.map(c => `- ${s(c.caracteristica)} (Beneficio: ${s(c.beneficio)})`).join('\n') : '';
        }
        addOrPushIA('caracteristicas_producto', textoCarac, 'Características del Producto o Servicio');
        
        const textoEmpaque = r4.resumen_empaque || ds(4, 'empaqueProducto');
        addOrPushIA('empaque', textoEmpaque, 'Empaque y Etiquetado');

        // Fase 8
        addOrPushIA('procesos_intro', '', 'Redacta un solo párrafo introductorio sobre el ciclo de producción, indicando que a continuación se detalla el diagrama de procesos.');

        // Fase 9
        const r9 = datosTotales[9] || {};
        
        let textoEstructura = r9.resumen_estructura || "";
        addOrPushIA('resumen_estructura', textoEstructura, 'Estructura Organizacional (Resumen)');

        let textoRoles = r9.resumen_roles || "";
        if (!textoRoles) {
            const roles = r9.estructura?.roles;
            textoRoles = (Array.isArray(roles) && roles.length > 0) ? roles.map(r => `- ${s(r.nombreRol)}: ${s(r.objetivo)}. Tareas: ${(r.tareas || []).map(t=>s(t.tarea)).join(', ')}`).join('\n') : '';
        }
        addOrPushIA('resumen_roles', textoRoles, 'Desglose Detallado de Roles y Funciones');

        let textoClima = r9.resumen_clima_cultura || "";
        addOrPushIA('resumen_clima_cultura', textoClima, 'Clima Organizacional');

        // Fase 10 (Viabilidad - Tablas)
        const pDT10 = datosTotales[10] || {};
        let invArray = null;
        if (pDT10.inversiones_array) {
          if (Array.isArray(pDT10.inversiones_array)) invArray = pDT10.inversiones_array;
          else if (typeof pDT10.inversiones_array === 'string') {
            try { invArray = JSON.parse(pDT10.inversiones_array); } catch(e){}
          }
        }
        const inversionesLoc = (invArray && invArray.length > 0) ? invArray : (pDT10.inversiones || []);
        
        const capitalInversion = inversionesLoc.filter(i => ['fijo', 'diferido'].includes(i.tipo));
        const capitalOperacion = inversionesLoc.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));
        
        const cfTotal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const cvGlobal = capitalOperacion.filter(inv => (inv.comportamiento || (inv.tipo === 'materiales' ? 'variable' : 'fijo')) === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        
        const totalProdMensual = (pDT10.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
        const fijoPorUnidad = cfTotal / totalProdMensual;
        const variableGlobalPorUnidad = cvGlobal / totalProdMensual;

        const numMeses = parseInt(pDT10.mesesProyeccion) || 6;
        const flujos = [];
        for (let m = 1; m <= numMeses; m++) {
          let ingresosTotalesMes = 0;
          let gastosVarsMes = 0;
          const multiplicador = 1;

          (pDT10.productos || []).forEach(prod => {
            const prodBase = parseFloat(prod.produccionMensual) || 0;
            const unidades = Math.round(prodBase * multiplicador);

            const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
            const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
            const costoUnitarioTotal = cvUnitario + fijoPorUnidad;

            const margen = parseFloat(prod.margenGanancia ?? pDT10.porcentajeGanancia ?? 30);
            const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
            const precioFacturado = precioSinFactura / 0.84;

            ingresosTotalesMes += (unidades * precioFacturado);
            gastosVarsMes += (unidades * cvUnitario);
          });

          const uBruta = ingresosTotalesMes - gastosVarsMes - cfTotal;
          const impuestos = ingresosTotalesMes * 0.16;
          const uNeta = uBruta - impuestos;
          flujos.push(uNeta);
        }
        
        const totalInversion = capitalInversion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
        const tasaTMAR = parseFloat(pDT10.tasaDescuento) || 13;
        const tasaDescuentoMensual = tasaTMAR / 100;
        
        let vanCalc = -totalInversion;
        flujos.forEach((flujo, index) => {
          vanCalc += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
        });
        
        let tirCalc = 0;
        if (totalInversion > 0 && flujos.some(f => f > 0)) {
          let low = -0.5;
          let high = 1.0;
          for (let i = 0; i < 100; i++) {
            let mid = (low + high) / 2;
            let npv = -totalInversion;
            flujos.forEach((flujo, index) => {
              npv += flujo / Math.pow(1 + mid, index + 1);
            });
            if (npv > 0) low = mid;
            else high = mid;
          }
          tirCalc = low * 100;
        }

        const formattedVan = vanCalc.toFixed(2);
        const formattedTir = tirCalc.toFixed(2);
        
        addOrPushIA('viabilidad_interpretacion', '', `Redacta una interpretación ejecutiva y positiva (máximo 2 párrafos) sobre la viabilidad del proyecto, sabiendo que el Valor Actual Neto (VAN) es ${formattedVan} y la Tasa Interna de Retorno (TIR) es ${formattedTir}%. Explica qué significan estos números para el negocio y si es rentable basándose en esos resultados.`);

        // Fase 12 (Proyecto de Vida) - Copiado directo sin pasar por IA
        mejorados['proyecto_vida'] = ds(12, 'resumen_ia_proyecto_vida') || ds(12, 'proposito_valor') || '';

        // Obtener contexto global
        const titulo = ds(1, 'titulo_proyecto') || ds(2, 'nombreIdea') || "Proyecto Emprendedor";
        const problema = ds(2, 'problema') || "";
        const contextoGlobal = `Título: ${titulo}\nProblema que resuelve: ${problema}`;

        // Ejecución en Lotes (Batching) de la IA SÓLO para las secciones vacías
        try {
          const keys = Object.keys(textosBrutos);
          if (keys.length > 0) {
            const chunkSize = 6; 
            for (let i = 0; i < keys.length; i += chunkSize) {
              const chunkKeys = keys.slice(i, i + chunkSize);
              const chunkObj = {};
              chunkKeys.forEach(k => chunkObj[k] = textosBrutos[k]);
              
              setEstadoIA(`Redactando ${chunkKeys.length} secciones vacías mediante IA (Lote ${Math.floor(i/chunkSize) + 1})...`);
              const chunkResult = await generarDocumentoConsolidadoIA(chunkObj, contextoGlobal, configIA);
              mejorados = { ...mejorados, ...chunkResult };
            }
          } else {
            setEstadoIA(`Todas las secciones tienen contenido previo. Saltando generación por IA...`);
            // Simular un pequeño tiempo para que el usuario lea el mensaje
            await new Promise(r => setTimeout(r, 1000));
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
      setImagenesListas(imagenesBase64);
      setPerfilListo(perfilUsuario);
      setStep(3);
      
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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Video Documento Final IA</h2>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <YoutubePlayer videoKey="video_fase_13" title="Video Documento Final IA" fallbackUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
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

    if (step === 3) {
      return (
        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={sectionClass + " text-center border-emerald-300 relative overflow-hidden w-full"}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 opacity-50 z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
              <CheckCircle size={48} className="text-emerald-600" />
            </div>
            
            <h2 className="text-3xl font-black text-emerald-700 mb-4">¡Documento Generado!</h2>
            <p className="text-lg text-slate-700 mb-8 font-medium">El archivo Word se ha descargado automáticamente. Puedes encontrarlo en tu carpeta de Descargas.</p>

            <div className="space-y-4">
              <button 
                onClick={() => generarYDescargarWord(datosListos, mejoradosListos, imagenesListas, perfilListo)}
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
      totalPasos={3}
      tabs={[
          { id: 1, icon: <Video size={16} />, label: 'Video' },
        { id: 2, icon: <Settings size={16} />, label: 'Configuración' },
        { id: 3, icon: <CheckCircle size={16} />, label: 'Documento' }
      ]}
      onTabClick={(id) => setStep(id)}
      onSiguiente={null}
      onAnterior={step > 1 ? () => setStep(step - 1) : null}
      mentorText={
        step === 1 ? "Mira este video para entender cómo la IA te ayudará a consolidar todo." : step === 2 ? "La Inteligencia Artificial tomará toda la información que llenaste en las fases anteriores y le dará estructura y formato académico." : 
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
