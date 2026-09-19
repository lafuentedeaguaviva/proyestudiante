import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaseController } from './useFaseController';
import { FaseModel } from '../models/FaseModel';
import { obtenerTodoElContenidoProyecto } from '../services/api';

export const useFase9Controller = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showExpandModal, setShowExpandModal] = useState(false);
  const [modoVista, setModoVista] = useState('lista'); // 'lista' o 'arbol'
  const [isGeneratingResumen, setIsGeneratingResumen] = useState(false);

  const claves = ['organigrama', 'roles', 'resumen_estructura', 'resumen_roles', 'resumen_clima_cultura'];

  const baseController = useFaseController({
    faseId: 9,
    totalPasos: 3,
    clavesDeGuardado: claves,
    estructuraJSON: true // Guarda en 'organigrama'
  });

  const { data, updateData, step, cargando, guardando, irAPaso, siguientePaso, pasoAnterior, setPendingSave } = baseController;

  // Defaults needed by the UI
  const organigrama = Array.isArray(data.organigrama) && data.organigrama.length > 0 
    ? data.organigrama 
    : [{ id: 'ceo', nombre: 'Gerente General / CEO', tipo: 'lider', parentId: null }];
    
  const roles = Array.isArray(data.roles) && data.roles.length > 0
    ? data.roles 
    : [{ 
        id: 'ceo', 
        cargo: 'Gerente General / CEO', 
        responsabilidades: 'Planificación Estratégica, Toma de Decisiones y Control General de Operaciones' 
      }];

  const generarResumenFase9 = async (forceOrganigrama = false) => {
    setIsGeneratingResumen(true);
    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

      const todos = await obtenerTodoElContenidoProyecto();
      const safeString = (val) => {
        if (!val) return '';
        if (typeof val === 'string') {
          try { return safeString(JSON.parse(val)); } catch(e) { return val; }
        }
        if (typeof val === 'object') {
          return val.text || val.texto || val.nombre || val.desc || val.descripcion || val.idea || val.problema || '';
        }
        return String(val);
      };

      const nombreProyecto = safeString(todos.nombre_proyecto || todos[1]?.idea_ganadora || todos[4]?.nombreProducto) || 'Emprendimiento Productivo';
      const problema = safeString(todos[1]?.frase_problema || todos[1]?.dolor || todos[7]?.diag_p1 || todos[7]?.diag_p3) || 'Necesidad no satisfecha en el mercado';
      const publico = safeString(todos[3]?.publico_objetivo_resumido || todos[7]?.obj_publico) || 'Público objetivo definido';

      // Organigrama actual como texto
      const orgActualTexto = organigrama.map(n => `- ${n.nombre} (${n.tipo === 'lider' ? 'Dirección' : n.tipo === 'area' ? 'Área' : n.tipo === 'staff' ? 'Staff/Asesor' : 'Funcionario'})`).join('\n');
      const rolesActualesTexto = roles.map(r => `- ${r.cargo || r.nombreArea || 'Puesto'}: ${Array.isArray(r.responsabilidades) ? r.responsabilidades.join(', ') : (r.responsabilidades || 'General')}`).join('\n');

      let systemPrompt = `Eres un consultor senior especializado en Desarrollo Organizacional, Gestión del Talento Humano y Arquitectura Empresarial.

DATOS DEL NEGOCIO:
- Nombre del Proyecto / Empresa: ${nombreProyecto}
- Problema que resuelve: ${problema}
- Público objetivo: ${publico}

ORGANIGRAMA ACTUAL:
${orgActualTexto}

ROLES Y FUNCIONES ACTUALES:
${rolesActualesTexto}

TU OBJETIVO:
Diseñar una estructura organizacional integral y un manual de roles altamente detallado y profesional, perfectamente ajustado a las necesidades de la empresa "${nombreProyecto}".

INSTRUCCIONES CLAVE DE CONTENIDO:
1. "resumen_estructura": (3 párrafos extensos) Justifica detalladamente el diseño del organigrama, la jerarquía directiva, la interconexión entre áreas y cómo responde al modelo de negocio de "${nombreProyecto}".
2. "resumen_roles": (Extenso, profundo y súper detallado con viñetas o números) Proporciona un desglose minucioso de roles y funciones clave que satisfagan todas las necesidades operativas, comerciales, administrativas y tecnológicas de "${nombreProyecto}". Especifica responsabilidades clave, metas directas e impacto en el cliente final (${publico}).
3. "resumen_clima_cultura": (2 párrafos) Estrategia de cultura organizacional, canales de comunicación, motivación de equipo y clima laboral.
4. "organigrama_sugerido": (Array de entre 5 y 8 objetos JSON con la estructura completa del equipo):
   - Estructura: [{"id": "...", "nombre": "...", "tipo": "lider"|"area"|"staff"|"funcionario", "parentId": "..."}]
   - Debe incluir Líder/CEO, áreas fundamentales (Operaciones, Marketing/Ventas, Finanzas/Administración, Tecnología) y funcionarios/ejecutivos clave subordinados a sus áreas.
5. "roles_sugeridos": (Array de objetos JSON correspondientes a los puestos del organigrama sugerido):
   - Estructura: [{"id": "...", "cargo": "...", "responsabilidades": "..."}]

Devuelve ÚNICAMENTE un JSON válido sin texto ni markdown extra:
{
  "resumen_estructura": "...",
  "resumen_roles": "...",
  "resumen_clima_cultura": "...",
  "organigrama_sugerido": [...],
  "roles_sugeridos": [...]
}`;

      let parsed = {};
      if (apiKey) {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: "Genera el JSON completo con organigrama_sugerido y roles_sugeridos detallados. Solo JSON." }
            ],
            temperature: 0.7
          })
        });

        const resData = await response.json();
        const content = resData.choices?.[0]?.message?.content?.trim();
        const match = content?.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      // Fallback si no hay API Key o falla el parseo
      if (!parsed.resumen_estructura) {
        const defaultOrg = [
          { id: 'ceo', nombre: 'Gerente General / CEO', tipo: 'lider', parentId: null },
          { id: 'area_ops', nombre: 'Operaciones y Logística', tipo: 'area', parentId: 'ceo' },
          { id: 'area_mkt', nombre: 'Marketing y Ventas', tipo: 'area', parentId: 'ceo' },
          { id: 'area_fin', nombre: 'Finanzas y Administración', tipo: 'area', parentId: 'ceo' },
          { id: 'area_tech', nombre: 'Tecnología y Calidad', tipo: 'area', parentId: 'ceo' },
          { id: 'func_ops', nombre: 'Especialista en Control Operativo', tipo: 'funcionario', parentId: 'area_ops' },
          { id: 'func_mkt', nombre: 'Ejecutivo Comercial y Social Media', tipo: 'funcionario', parentId: 'area_mkt' }
        ];

        const defaultRoles = [
          { id: 'ceo', cargo: 'Gerente General / CEO', responsabilidades: `Liderazgo estratégico, definición de objetivos anuales, toma de decisiones ejecutivas y supervisión general de todas las áreas en ${nombreProyecto} para resolver la problemática: ${problema}.` },
          { id: 'area_ops', cargo: 'Director de Operaciones y Logística', responsabilidades: `Gestión directa de los procesos de entrega, control de insumos/proveedores, aseguramiento de la calidad y cumplimiento de estándares para los clientes (${publico}).` },
          { id: 'area_mkt', cargo: 'Director de Marketing y Ventas', responsabilidades: `Diseño y ejecución de estrategias publicitarias, gestión de embudos comerciales, atracción de clientes y consolidación de la marca de ${nombreProyecto}.` },
          { id: 'area_fin', cargo: 'Director de Finanzas y Administración', responsabilidades: `Control del flujo de efectivo, contabilidad, gestión de costos, presupuestos mensuales y reportes de rentabilidad operativa.` },
          { id: 'area_tech', cargo: 'Encargado de Tecnología y Soporte', responsabilidades: `Mantenimiento de herramientas digitales, infraestructura técnica, automatización de tareas e innovación constante del producto/servicio.` },
          { id: 'func_ops', cargo: 'Especialista en Control Operativo', responsabilidades: `Ejecución diaria de tareas de producción/servicio, soporte directo a clientes y resolución agilizada de incidencias.` },
          { id: 'func_mkt', cargo: 'Ejecutivo Comercial y Social Media', responsabilidades: `Atención a prospectos, prospección de clientes, administración de redes sociales y fidelización del público objetivo.` }
        ];

        parsed = {
          resumen_estructura: `La estructura organizacional de ${nombreProyecto} se ha diseñado estratégicamente bajo un esquema funcional, ágil y altamente coordinado, pensado específicamente para abordar la necesidad del mercado: "${problema}". La cúpula estratégica recae en la Gerencia General, la cual articula directamente con cuatro áreas operativas fundamentales: Operaciones y Logística, Marketing y Ventas, Finanzas y Administración, y Tecnología.\n\nEsta distribución jerárquica clara garantiza que la toma de decisiones sea fluida y que no existan cuellos de botella en la entrega del valor a nuestro público objetivo (${publico}). La separación entre la estrategia comercial y la ejecución operativa permite escalar la empresa ordenadamente sin descuidar la calidad ni la rentabilidad.`,

          resumen_roles: `DESGLOSE DETALLADO DE ROLES Y FUNCIONES AJUSTADO A ${nombreProyecto.toUpperCase()}:\n\n1. GERENCIA GENERAL (CEO):\n- Dirección Estratégica: Define la visión, misión y metas financieras anuales de la empresa.\n- Alianzas y Crecimiento: Establece relaciones clave con inversores, proveedores estratégicos y aliados comerciales.\n\n2. ÁREA DE OPERACIONES Y LOGÍSTICA:\n- Control de Calidad: Garantiza que la solución comercial responda exactamente a lo prometido a ${publico}.\n- Optimización de Procesos: Reduce costos operativos y maximiza la velocidad de entrega del producto/servicio.\n\n3. ÁREA DE MARKETING Y VENTAS:\n- Estrategia Omnicanal: Desarrolla campañas digitales, embudos de venta y contenido masivo.\n- Conversión de Clientes: Administra el cierre de ventas y la fidelización continua del usuario.\n\n4. ÁREA DE FINANZAS Y ADMINISTRACIÓN:\n- Sostenibilidad Financiera: Mantiene el balance, presupuesto de ingresos/egresos y flujo de caja positivo.\n- Cumplimiento Tributario y Legal: Garantiza que la empresa opere dentro del marco normativo vigente.\n\n5. ÁREA DE TECNOLOGÍA Y FUNCIONARIOS:\n- Desarrollo e Infraestructura: Mantiene las plataformas operativas y automatizaciones digitales activas.\n- Ejecución Operativa Diaria: Especialistas dedicados a la atención directa y entrega impecable del servicio.`,

          resumen_clima_cultura: `Para fortalecer el talento humano en ${nombreProyecto}, se promueve un clima organizacional orientado al logro, la innovación y el trabajo en equipo. Se implementarán reuniones semanales de sincronización (sprints), incentivos por desempeño y canales de retroalimentación transparente que me el desapego y eleven la motivación constante de todo el personal.`,

          organigrama_sugerido: defaultOrg,
          roles_sugeridos: defaultRoles
        };
      }

      const updates = {
        resumen_estructura: parsed.resumen_estructura,
        resumen_roles: parsed.resumen_roles,
        resumen_clima_cultura: parsed.resumen_clima_cultura
      };

      // Si se fuerza o si el organigrama actual es pequeño (<= 2 nodos), aplicamos la sugerencia completa
      if (Array.isArray(parsed.organigrama_sugerido) && parsed.organigrama_sugerido.length > 0) {
        if (forceOrganigrama || organigrama.length <= 2 || !data.organigrama || data.organigrama.length <= 2) {
          updates.organigrama = parsed.organigrama_sugerido;
        }
      }

      if (Array.isArray(parsed.roles_sugeridos) && parsed.roles_sugeridos.length > 0) {
        if (forceOrganigrama || roles.length <= 2 || !data.roles || data.roles.length <= 2) {
          updates.roles = parsed.roles_sugeridos;
        }
      }

      updateData(updates);
      setPendingSave(true);

      // Guardado inmediato en Supabase BD
      const fullData = { ...data, ...updates };
      await FaseModel.guardarDatos(9, 'organigrama', fullData);

    } catch (e) {
      console.error("Error generando resumen Fase 9:", e);
      alert("Hubo un detalle al generar con IA. Intenta de nuevo.");
    } finally {
      setIsGeneratingResumen(false);
    }
  };

  const handleFinalizar = async () => {
    try {
      await FaseModel.actualizarProgreso(10, 1);
      navigate('/fase/10/intro');
    } catch (err) {
      console.error(err);
      navigate('/fase/10/intro');
    }
  };

  return {
    ...baseController,
    showSplash, setShowSplash,
    showExpandModal, setShowExpandModal,
    modoVista, setModoVista,
    handleFinalizar,
    organigrama, roles,
    data, updateData,
    isGeneratingResumen,
    generarResumenFase9
  };
};

