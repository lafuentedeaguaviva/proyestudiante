import { useState, useCallback, useEffect, useRef } from 'react';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';
import { obtenerPromptIA } from '../services/api';

const opcionesDiagnostico = [
  {
    id: 1,
    titulo: "Opción 1: De lo general a lo particular",
    parrafos: [
      { id: "diag_p1", label: "Párrafo 1 – Contexto general", placeholder: "Describe brevemente la situación..." },
      { id: "diag_p2", label: "Párrafo 2 – Situación específica", placeholder: "Explica qué ocurre en el sector..." },
      { id: "diag_p3", label: "Párrafo 3 – Problema o necesidad", placeholder: "Señala concretamente qué necesidad..." },
      { id: "diag_p4", label: "Párrafo 4 – Oportunidad productiva", placeholder: "Explica cómo esa necesidad..." },
      { id: "diag_p5", label: "Párrafo 5 – Conclusión del diagnóstico", placeholder: "Resume por qué resulta pertinente..." }
    ]
  },
  {
    id: 2,
    titulo: "Opción 2: Problema → causas → consecuencias → solución",
    parrafos: [
      { id: "diag_p1", label: "Párrafo 1 – Problema", placeholder: "Presenta la situación problemática..." },
      { id: "diag_p2", label: "Párrafo 2 – Causas", placeholder: "Explica cuáles son los factores..." },
      { id: "diag_p3", label: "Párrafo 3 – Consecuencias", placeholder: "Describe cómo afecta el problema..." },
      { id: "diag_p4", label: "Párrafo 4 – Necesidad", placeholder: "Explica qué hace falta..." },
      { id: "diag_p5", label: "Párrafo 5 – Alternativa productiva", placeholder: "Presenta el emprendimiento..." }
    ]
  },
  {
    id: 3,
    titulo: "Opción 3: Observación del entorno",
    parrafos: [
      { id: "diag_p1", label: "Párrafo 1 – Lugar y población", placeholder: "Indica dónde se realizó..." },
      { id: "diag_p2", label: "Párrafo 2 – Lo observado", placeholder: "Describe qué productos..." },
      { id: "diag_p3", label: "Párrafo 3 – Necesidades y preferencias", placeholder: "Explica qué necesidades..." },
      { id: "diag_p4", label: "Párrafo 4 – Recursos disponibles", placeholder: "Menciona los recursos..." },
      { id: "diag_p5", label: "Párrafo 5 – Potencial productivo", placeholder: "Relaciona lo observado..." }
    ]
  }
];

export const useFase7Controller = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGeneration, setActiveGeneration] = useState(null);
  const [isGeneratingResumen, setIsGeneratingResumen] = useState(false);

  const claves = [
    'opcion_diagnostico', 'desc_producto', 'diag_p1', 'diag_p2', 'diag_p3', 'diag_p4', 'diag_p5', 'diagnostico',
    'ubicacion', 'descripcionLugar', 'problemaIdentificado', 'datosRespaldo', 'solucionPropuesta', 'preguntaInvestigacion',
    'obj_verbo', 'obj_producto', 'obj_publico', 'obj_ubicacion', 'obj_plazo',
    'obj_especifico_1', 'obj_especifico_2', 'obj_especifico_3', 'obj_especifico_4',
    'mision_quienes_somos', 'mision_que_hacemos', 'mision_para_quien', 'mision_por_que', 'mision_redaccion_final',
    'vision_como_vemos', 'vision_meta_grande', 'vision_impacto', 'vision_redaccion_final',
    'justificacion_social', 'justificacion_economica', 'justificacion_personal',
    'objGeneral', 'objEspecificos', 'resumen_ia',
    'resumen_diagnostico', 'resumen_objetivo_general', 'resumen_objetivos_especificos',
    'resumen_mision', 'resumen_vision',
    'resumen_justificacion_social', 'resumen_justificacion_economica', 'resumen_justificacion_personal'
  ];

  const baseController = useFaseController({
    faseId: 7,
    totalPasos: 7,
    clavesDeGuardado: claves,
    estructuraJSON: false, // Fase 7 guarda claves planas
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior, setPendingSave } = baseController;

  // Agresivo limpiador de datos corruptos para evitar que se queden atascados
  useEffect(() => {
    if (typeof data.obj_publico === 'string' && data.obj_publico.includes('{')) {
      updateData({ obj_publico: '' });
    }
  }, [data.obj_publico, updateData]);

  useEffect(() => {
    const fetchDefaults = async () => {
      if (!cargando) {
        let updates = {};
        try {
          const f1 = await FaseModel.obtenerDatosFase(1);
          const f2 = await FaseModel.obtenerDatosFase(2);
          const f3 = await FaseModel.obtenerDatosFase(3);
          const f4 = await FaseModel.obtenerDatosFase(4);

          const truncateStr = (text, maxWords = 5) => {
            if (!text) return '';
            const words = text.split(/\s+/);
            if (words.length <= maxWords) return text;
            return words.slice(0, maxWords).join(' ') + '...';
          };

          const safeString = (val) => {
            if (!val) return '';
            if (typeof val === 'string') {
              try {
                const parsed = JSON.parse(val);
                return safeString(parsed);
              } catch (e) {
                return val;
              }
            }
            if (Array.isArray(val)) {
              return val.map(v => safeString(v)).filter(Boolean).join(', ');
            }
            if (typeof val === 'object') {
              return val.text || val.texto || val.nombre || val.desc || val.descripcion || val.title || val.name || val.problema || val.segmento || val.idea || val.publico_objetivo_resumido || val.quienesSon || '';
            }
            return String(val);
          };

          const cleanPublico = (text) => {
            if (!text) return '';
            let t = String(text).trim();
            // Remove common starting prepositions
            t = t.replace(/^(para|dirigido a|a los|a las|a |enfocado en)\s+/i, '');
            // Capitalize first letter
            if (t.length > 0) t = t.charAt(0).toUpperCase() + t.slice(1);
            return truncateStr(t, 6);
          };
          const tryParse = (obj, key) => {
            if (!obj || !obj[key]) return {};
            let parsed = obj[key];
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch(e) { return {}; }
            }
            if (parsed && typeof parsed.resumen_ia === 'string') {
              try { parsed.resumen_ia = JSON.parse(parsed.resumen_ia); } catch(e) {}
            }
            return parsed || {};
          };

          const f2Parsed = tryParse(f2, 'validacion_idea');
          const f3Parsed = tryParse(f3, 'publico_objetivo');
          const f4Parsed = tryParse(f4, 'diseno_producto');

          if (!data.obj_producto) {
            const prodRaw = (f4Parsed && f4Parsed.nombreProducto) || (f1 && f1.idea_ganadora) || '';
            const prod = safeString(prodRaw);
            if(prod) updates.obj_producto = truncateStr(prod, 5);
          }
          if (!data.obj_publico || (typeof data.obj_publico === 'string' && (data.obj_publico.includes('{') || data.obj_publico.length > 150))) {
            let pubRaw = (f2Parsed && f2Parsed.resumen_ia?.publico_objetivo_resumido) || 
                         (f3Parsed && f3Parsed.publicoObjetivoIA) || 
                         (f3Parsed && f3Parsed.publico_objetivo_resumido) ||
                         (f3Parsed && f3Parsed.publicoSituacion) || 
                         (f2Parsed && f2Parsed.publicoObjetivo?.quienesSon);
            
            if (typeof pubRaw === 'string' && pubRaw.includes('{')) {
                pubRaw = '';
            }

            const pub = safeString(pubRaw);
            let finalPub = pub ? cleanPublico(pub) : '';
            if (finalPub.includes('{') || finalPub.length > 100) finalPub = '';
            updates.obj_publico = finalPub;
          }
          if (!data.obj_ubicacion) {
            const ubiRaw = (f3Parsed && f3Parsed.publicoUbicacion) || (f2Parsed && f2Parsed.publicoObjetivo?.ubicacion) || '';
            const ubi = safeString(ubiRaw);
            if(ubi) {
              const cleanedUbi = ubi.replace(/^(en|desde|hacia)\s+/i, '');
              updates.obj_ubicacion = `en ${truncateStr(cleanedUbi, 4)}`;
            }
          }

          if (Object.keys(updates).length > 0) {
            updateData(updates);
          }
        } catch (e) {
          console.error("Error cargando pre-llenados", e);
        }
      }
    };
    fetchDefaults();
  }, [cargando, data.obj_producto, data.obj_publico, data.obj_ubicacion]);

  // Interceptar la navegación para precalcular objGeneral y objEspecificos
  const handleSiguientePasoCustom = () => {
    let updates = {};
    if (data.obj_verbo || data.obj_producto || data.obj_publico || data.obj_ubicacion || data.obj_plazo) {
      updates.objGeneral = `${data.obj_verbo || '[Verbo]'} ${data.obj_producto || '[Producto]'} para ${data.obj_publico || '[Público]'} ${data.obj_ubicacion || '[Ubicación]'} ${data.obj_plazo || '[Plazo]'}`;
    }
    
    const especificos = [data.obj_especifico_1, data.obj_especifico_2, data.obj_especifico_3, data.obj_especifico_4]
      .filter(Boolean)
      .map((obj, i) => `${i + 1}. ${obj}`)
      .join('\n');
      
    if (especificos) {
      updates.objEspecificos = especificos;
    }

    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }
    
    // Llamar al original
    baseController.siguientePaso();
  };

  const generateAI = async (seccion) => {
    setIsGenerating(true);
    setActiveGeneration(seccion);
    try {
      const dataFase1 = await FaseModel.obtenerDatosFase(1);
      const dataFase2 = await FaseModel.obtenerDatosFase(2);
      const dataFase3 = await FaseModel.obtenerDatosFase(3);
      const dataFase4 = await FaseModel.obtenerDatosFase(4);
      
      const tryParse = (obj, key) => {
        if (!obj || !obj[key]) return {};
        let parsed = obj[key];
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch(e) { return {}; }
        }
        if (parsed && typeof parsed.resumen_ia === 'string') {
          try { parsed.resumen_ia = JSON.parse(parsed.resumen_ia); } catch(e) {}
        }
        return parsed || {};
      };

      const f1Parsed = tryParse(dataFase1, 'idea_ganadora');
      const f2Parsed = tryParse(dataFase2, 'validacion_idea');
      const f3Parsed = tryParse(dataFase3, 'publico_objetivo');
      const f4Parsed = tryParse(dataFase4, 'diseno_producto');

      const v_idea = data.desc_producto || data.obj_producto || f1Parsed.idea || f4Parsed.nombreProducto || 'No definido';
      const v_publico = data.obj_publico || f2Parsed.resumen_ia?.publico_objetivo_resumido || f3Parsed.publicoObjetivoIA || 'No definido';
      
      const v_problema = (f1Parsed.observaciones && f1Parsed.observaciones[0]?.dolor) || 
                         (f2Parsed.encontrar_idea?.observaciones?.[0]?.dolor) || 
                         'No definido';
      const v_ubicacion = data.obj_ubicacion || f3Parsed.publicoUbicacion || f2Parsed.publicoObjetivo?.ubicacion || 'Entorno local';
      
      const v_beneficios = f4Parsed.beneficios || 'No definido';

      const contexto = `Idea de negocio: ${v_idea}\nPúblico objetivo: ${v_publico}\nUbicación: ${v_ubicacion}\nBeneficios: ${JSON.stringify(v_beneficios)}`;

      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) {
        alert("API Key de IA no configurada.");
        setIsGenerating(false);
        setActiveGeneration(null);
        return;
      }

      let systemPrompt = "";
      if (seccion === 'diagnostico') {
        const optId = parseInt(data.opcion_diagnostico || 1, 10);
        const opt = opcionesDiagnostico.find(o => o.id === optId) || opcionesDiagnostico[0];
        const campos = opt.parrafos.map(p => `"${p.id}" (${p.label}): ${p.placeholder}`).join('\n');
        
        let customPrompt = await obtenerPromptIA(7, 'generar_diagnostico');
        if (!customPrompt) {
          customPrompt = 'Eres un experto en formulación y redacción de proyectos de emprendimiento educativo. Tu tarea es ayudar a redactar el Diagnóstico del Contexto Productivo basándote en la siguiente información recopilada del estudiante:\n\n- Idea de Negocio / Solución: {idea}\n- Problema o Necesidad Principal: {problema}\n- Público Objetivo: {publico}\n- Ubicación / Entorno: {ubicacion}\n- Beneficios de la Solución: {beneficios}\n\nEl estudiante ha seleccionado la siguiente estructura de diagnóstico: "{estructura}".\n\nGenera un JSON estrictamente válido que contenga 5 propiedades. Cada propiedad corresponde a los siguientes párrafos (sigue estrictamente estas instrucciones para cada párrafo):\n{campos}\n\nInstrucciones vitales:\n1. Redacta un solo párrafo conciso (3-4 oraciones) para cada campo basándote en su descripción.\n2. Utiliza un tono académico, formal y en tercera persona.\n3. Asegúrate de utilizar conectores lógicos variados y fluidos entre oraciones para evitar la repetición y enriquecer la redacción.\n4. Conecta lógicamente el problema con la ubicación y el público.\n5. NUNCA inicies ni utilices la frase "En conclusión" o similares en el último párrafo.\n6. Devuelve ÚNICAMENTE el JSON, sin texto adicional antes o después.';
        }
        
        systemPrompt = customPrompt
          .replace('{idea}', v_idea)
          .replace('{problema}', v_problema)
          .replace('{publico}', v_publico)
          .replace('{ubicacion}', v_ubicacion)
          .replace('{estructura}', opt.titulo)
          .replace('{campos}', campos);
      } else {
        systemPrompt = "Genera JSON"; // Simplificación para el plan
      }

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Devuelve solo el objeto JSON, nada de texto extra ni markdown." }
          ],
          temperature: 0.7
        })
      });

      const resData = await response.json();
      const content = resData.choices[0].message.content;
      const match = content.match(/\{.*\}/s);
      const parsedData = match ? JSON.parse(match[0]) : JSON.parse(content);
      
      updateData(parsedData);
      setPendingSave(true);
      
    } catch (error) {
      console.error("Error AI:", error);
      alert("Hubo un error al generar la propuesta. Revisa la consola.");
    }
    setIsGenerating(false);
    setActiveGeneration(null);
  };

  const generarResumenFase7 = async () => {
    setIsGeneratingResumen(true);
    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) { alert('API Key de IA no configurada.'); return; }

      // Recopilar datos de fases anteriores
      const [f1, f2, f3, f4] = await Promise.all([
        FaseModel.obtenerDatosFase(1),
        FaseModel.obtenerDatosFase(2),
        FaseModel.obtenerDatosFase(3),
        FaseModel.obtenerDatosFase(4)
      ]);

      const tryParse = (raw) => {
        if (!raw) return {};
        if (typeof raw === 'object') return raw;
        try { return JSON.parse(raw); } catch { return {}; }
      };

      const f1p = tryParse(f1?.idea_ganadora);
      const f2p = tryParse(f2?.validacion_idea);
      const f3p = tryParse(f3?.publico_objetivo);
      const f4p = tryParse(f4?.diseno_producto);

      // Extraer contexto enriquecido de todas las fases
      const ideaNegocio = data.obj_producto || f1p?.idea || f4p?.nombreProducto || 'el emprendimiento';
      const problema = f1p?.observaciones?.[0]?.dolor || f2p?.encontrar_idea?.observaciones?.[0]?.dolor || 'una necesidad identificada en la comunidad';
      const solucion = f4p?.descripcion || data.desc_producto || ideaNegocio;
      const publicoObj = data.obj_publico || tryParse(f2?.resumen_ia)?.publico_objetivo_resumido || f3p?.publicoObjetivoIA || 'el público objetivo';
      const ubicacion = data.obj_ubicacion || f3p?.publicoUbicacion || '';
      const plazo = data.obj_plazo || '';
      const verbo = data.obj_verbo || 'Desarrollar';

      // Diagnóstico actual (puede estar parcial o vacío)
      const diagActual = [data.diag_p1, data.diag_p2, data.diag_p3, data.diag_p4, data.diag_p5].filter(Boolean).join(' ');

      // Objetivos actuales (pueden estar parciales o vacíos)
      const objGeneralActual = data.objGeneral || `${verbo} ${ideaNegocio} para ${publicoObj} ${ubicacion} ${plazo}`.trim();
      const objEspActual = data.objEspecificos || [data.obj_especifico_1, data.obj_especifico_2, data.obj_especifico_3, data.obj_especifico_4].filter(Boolean).join('\n');

      // Misión y visión actuales (pueden estar parciales o vacías)
      const misionActual = data.mision_redaccion_final || `${data.mision_quienes_somos || ''} ${data.mision_que_hacemos || ''} para ${data.mision_para_quien || ''}`.trim();
      const visionActual = data.vision_redaccion_final || `${data.vision_como_vemos || ''} ${data.vision_meta_grande || ''}`.trim();

      // Justificaciones
      const justSocial = data.justificacion_social || '';
      const justEcon = data.justificacion_economica || '';
      const justPersonal = data.justificacion_personal || '';

      // Prompt: primero intenta el de Supabase (editable desde el Admin), luego usa el hardcoded
      const promptAdmin = await obtenerPromptIA(7, 'generar_resumen_fase');

      // Si el admin personalizó el prompt, reemplazar sus variables; si no, usar el prompt directo (ya tiene los datos interpolados)
      let systemPrompt;
      if (promptAdmin) {
        systemPrompt = promptAdmin
          .replace('{idea}', ideaNegocio)
          .replace('{problema}', problema)
          .replace('{solucion}', solucion)
          .replace('{publico}', publicoObj)
          .replace('{ubicacion}', ubicacion)
          .replace('{just_social}', justSocial || 'No definida')
          .replace('{just_economica}', justEcon || 'No definida')
          .replace('{just_personal}', justPersonal || 'No definida')
          .replace('{diagnostico_actual}', diagActual || 'VACÍO')
          .replace('{objetivo_general_actual}', objGeneralActual || 'VACÍO')
          .replace('{objetivos_especificos_actuales}', objEspActual || 'VACÍO')
          .replace('{mision_actual}', misionActual || 'VACÍO')
          .replace('{vision_actual}', visionActual || 'VACÍO');
      } else {
        // Prompt por defecto con datos directamente interpolados
        systemPrompt = `Eres un experto en formulación de proyectos de emprendimiento educativo. Tu tarea es MEJORAR y COMPLETAR los 5 componentes del planteamiento de un proyecto emprendedor, siempre redactados en PRIMERA PERSONA (usando "nosotros" o "yo"), con tono formal y académico.

DATOS DEL PROYECTO:
- Producto/Servicio: ${ideaNegocio}
- Problema que resuelve: ${problema}
- Solución propuesta: ${solucion}
- Público objetivo: ${publicoObj}
- Ubicación: ${ubicacion}
- Justificación Social: ${justSocial || 'No definida'}
- Justificación Económica: ${justEcon || 'No definida'}
- Justificación Personal: ${justPersonal || 'No definida'}

CONTENIDO ACTUAL (puede estar incompleto o vacío, debes completarlo o mejorarlo):
- Diagnóstico actual: ${diagActual || 'VACÍO'}
- Objetivo General actual: ${objGeneralActual || 'VACÍO'}
- Objetivos Específicos actuales: ${objEspActual || 'VACÍO'}
- Misión actual: ${misionActual || 'VACÍO'}
- Visión actual: ${visionActual || 'VACÍO'}

INSTRUCCIONES VITALES:
1. Si un campo está VACÍO, créalo desde cero usando los datos del proyecto.
2. Si un campo tiene contenido, MEJÓRALO, hazlo más fluido, formal y completo.
3. El "diagnostico_final" debe ser un texto en prosa de 3-4 párrafos en primera persona.
4. El "objetivo_general" debe iniciar con un verbo en infinitivo y ser una sola oración completa.
5. Los "objetivos_especificos" deben ser 4 objetivos numerados, cada uno empezando con un verbo en infinitivo.
6. La "mision" debe ser 1-2 oraciones que respondan: ¿Quiénes somos? ¿Qué hacemos? ¿Para quién? ¿Por qué?
7. La "vision" debe ser 1-2 oraciones proyectadas al futuro (3-5 años).
8. Genera "justificacion_social", "justificacion_economica" y "justificacion_personal" redactando un párrafo conciso para cada una.
9. NUNCA uses "no definido", "no completado" ni frases genéricas.

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{
  "diagnostico_final": "texto mejorado en prosa...",
  "objetivo_general": "texto mejorado...",
  "objetivos_especificos": "1. texto...\n2. texto...\n3. texto...\n4. texto...",
  "mision": "texto mejorado...",
  "vision": "texto mejorado...",
  "justificacion_social": "El presente emprendimiento se justifica socialmente porque...",
  "justificacion_economica": "Económicamente, el proyecto resulta altamente viable debido a...",
  "justificacion_personal": "En el ámbito personal, este proyecto nos motiva porque..."
}`;
      }

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Genera el JSON ahora. Solo el JSON, nada más.' }
          ],
          temperature: 0.7
        })
      });

      const resData = await response.json();
      const rawContent = resData.choices?.[0]?.message?.content?.trim();
      
      // Extraer el JSON de la respuesta
      const match = rawContent?.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('La IA no devolvió un JSON válido.');
      const parsed = JSON.parse(match[0]);

      // Guardar en campos de resumen Y en los campos originales de la fase
      const updates = {};

      if (parsed.diagnostico_final) {
        updates.resumen_diagnostico = parsed.diagnostico_final;
        updates.diagnostico = parsed.diagnostico_final; // Rellenar campo original de diagnóstico unificado
        
        // Separa eficazmente por saltos de línea (dobles o simples)
        const parrafos = parsed.diagnostico_final
          .split(/\n\s*\n/)
          .map(p => p.trim())
          .filter(Boolean);
        const parrafosFinales = parrafos.length >= 3 
          ? parrafos 
          : parsed.diagnostico_final.split('\n').map(p => p.trim()).filter(Boolean);

        if (parrafosFinales[0]) updates.diag_p1 = parrafosFinales[0];
        if (parrafosFinales[1]) updates.diag_p2 = parrafosFinales[1];
        if (parrafosFinales[2]) updates.diag_p3 = parrafosFinales[2];
        if (parrafosFinales[3]) updates.diag_p4 = parrafosFinales[3];
        if (parrafosFinales[4]) updates.diag_p5 = parrafosFinales[4];
      }

      if (parsed.objetivo_general) {
        updates.resumen_objetivo_general = parsed.objetivo_general;
        updates.objGeneral = parsed.objetivo_general; // Rellenar campo original
      }

      if (parsed.objetivos_especificos) {
        updates.resumen_objetivos_especificos = parsed.objetivos_especificos;
        updates.objEspecificos = parsed.objetivos_especificos; // Rellenar campo original
        
        // También los campos individuales para los inputs del paso 4
        const lineas = parsed.objetivos_especificos.split('\n').filter(l => l.trim());
        const cleanObj = (l) => l.replace(/^\d+[\.\)]\s*/, '').trim();
        if (lineas[0]) updates.obj_especifico_1 = cleanObj(lineas[0]);
        if (lineas[1]) updates.obj_especifico_2 = cleanObj(lineas[1]);
        if (lineas[2]) updates.obj_especifico_3 = cleanObj(lineas[2]);
        if (lineas[3]) updates.obj_especifico_4 = cleanObj(lineas[3]);
      }

      if (parsed.mision) {
        updates.resumen_mision = parsed.mision;
        updates.mision_redaccion_final = parsed.mision; // Rellenar campo original del paso 6
      }

      if (parsed.vision) {
        updates.resumen_vision = parsed.vision;
        updates.vision_redaccion_final = parsed.vision; // Rellenar campo original del paso 8
      }

      if (parsed.justificacion_social) {
        updates.resumen_justificacion_social = parsed.justificacion_social;
        updates.justificacion_social = parsed.justificacion_social; // Rellenar campo original del paso 10
      }

      if (parsed.justificacion_economica) {
        updates.resumen_justificacion_economica = parsed.justificacion_economica;
        updates.justificacion_economica = parsed.justificacion_economica; // Rellenar campo original del paso 10
      }

      if (parsed.justificacion_personal) {
        updates.resumen_justificacion_personal = parsed.justificacion_personal;
        updates.justificacion_personal = parsed.justificacion_personal; // Rellenar campo original del paso 10
      }

      // 1. Actualizar estado en React UI
      updateData(updates);
      setPendingSave(true);

      // 2. Persistir inmediatamente a Supabase todos los campos actualizados
      const promises = Object.entries(updates).map(([key, val]) =>
        FaseModel.guardarDatos(7, key, val)
      );
      await Promise.all(promises);

    } catch (error) {
      console.error('Error generando resumen Fase 7:', error);
      alert('Hubo un error al generar el resumen. Revisa la consola.');
    } finally {
      setIsGeneratingResumen(false);
    }
  };

  return {
    ...baseController,
    siguientePaso: handleSiguientePasoCustom,
    generateAI,
    isGenerating,
    activeGeneration,
    isGeneratingResumen,
    generarResumenFase7
  };
};


