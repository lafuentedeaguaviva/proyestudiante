const fs = require('fs');

// --- 1. UPDATE FASE10_PLANFINANCIERO.JSX ---
const fileFase10 = 'd:/estudiante/plataforma-gamificada/src/pages/Fase10_PlanFinanciero.jsx';
let contentFase10 = fs.readFileSync(fileFase10, 'utf8');

const regexGenerarIA = /const handleGenerarIA = async \(\) => \{[\s\S]*?(?=if \(cargando\) return <LoadingSpinner)/;
const replacementGenerarIA = `const handleGenerarIA = async () => {
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
          const fbObjGeneral = fase7.objGeneral || \`\${fase7.obj_verbo || ''} \${fase7.obj_producto || ''} para \${fase7.obj_publico || ''} \${fase7.obj_ubicacion || ''} \${fase7.obj_plazo || ''}\`.trim();

          ctx = \`Problema: \${fbProblem}. Idea: \${fbIdea}. Público: \${fbSeg}. Objetivo General: \${fbObjGeneral}\`;
        } catch (e) { }
      }

      const productosActuales = data.productos || [];
      if (productosActuales.length > 0) {
        const resumenProductos = productosActuales.map(p => \`- Producto: \${p.nombre || 'Sin nombre'} (Demanda: \${p.produccionMensual || 1}, Margen: \${p.margenGanancia || 30}%)\\n  Ingredientes: \${(p.ingredientes || []).map(i => \`\${i.nombre} (Bs.\${i.monto})\`).join(', ')}\`).join('\\n');
        ctx += \`\\nEl usuario YA HA DEFINIDO estos productos y sus costos unitarios de ingredientes:\\n\${resumenProductos}\\nPOR FAVOR, respeta estos productos, mantenlos en tu respuesta, pero hazlos REALISTAS. Rellena los costos (monto) de los ingredientes si están en 0, añade ingredientes si faltan para que la receta sea real, y ajusta la demanda si es irreal.\`;
      } else {
        ctx += \`\\nEl usuario no ha definido productos. Genera un par de productos estrella principales relacionados a la idea, con sus respectivas demandas mensuales, márgenes de ganancia y listas detalladas de ingredientes con costos unitarios reales.\`;
      }

      const inversionesActuales = data.inversiones || [];
      if (inversionesActuales.length > 0) {
        const resumenInversiones = inversionesActuales.map(i => \`- \${i.concepto} (tipo: \${i.tipo}, cant: \${i.cantidad || 1}, precio: \${i.precio || 0})\`).join('\\n');
        ctx += \`\\nEl usuario YA HA AÑADIDO estas inversiones/gastos fijos/variables globales:\\n\${resumenInversiones}\\nPOR FAVOR, INCLUYE ESTOS MISMOS ELEMENTOS EN TU RESPUESTA (ajusta el precio si es 0 o irreal para el mercado boliviano) Y COMPLÉTALOS añadiendo alquileres, sueldos y equipos básicos si faltaran para un negocio real.\`;
      } else {
        ctx += \`\\nEl usuario no ha añadido ninguna inversión aún. Genera todas las necesarias (fijas, diferidas, variables operativas).\`;
      }

      const res = await generarPlanFinancieroIA(ctx);
      if (res) {
        updateGlobalData({
          ...data,
          inversiones: res.inversiones || data.inversiones || [],
          productos: res.productos || data.productos || [],
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

  `;

contentFase10 = contentFase10.replace(regexGenerarIA, replacementGenerarIA);
fs.writeFileSync(fileFase10, contentFase10, 'utf8');

// --- 2. UPDATE API.JS ---
const fileApi = 'd:/estudiante/plataforma-gamificada/src/services/api.js';
let contentApi = fs.readFileSync(fileApi, 'utf8');

const regexPromptIA = /let systemPrompt = await obtenerPromptIA\(10, 'generar_plan_financiero'\);[\s\S]*?(?=const response = await fetch)/;
const replacementPromptIA = `let systemPrompt = await obtenerPromptIA(10, 'generar_plan_financiero');
  
  if (systemPrompt) {
    systemPrompt = systemPrompt.replace('{contextoProyecto}', contextoProyecto || "Proyecto de emprendimiento general.");
  } else {
    systemPrompt = \`Eres un experto financiero para startups y emprendimientos. Tu tarea es generar un plan financiero MULTIPRODUCTO simulado, certero y realista basado en la idea de negocio del usuario, ubicado en Bolivia (Moneda: Bolivianos - Bs).
Contexto del Proyecto:
\${contextoProyecto || "Proyecto de emprendimiento general."}

DEBES devolver EXACTAMENTE un objeto JSON con las siguientes llaves (y sin texto adicional ni bloques markdown):
1. "inversiones": Un array de objetos, donde cada uno tiene:
   - "id": número entero único
   - "concepto": string (nombre del item, ej. "Alquiler Local Comercial")
   - "tipo": string (debe ser EXACTAMENTE uno de: 'fijo', 'diferido', 'materiales', 'infraestructura', 'personal')
   - "cantidad": número entero
   - "precio": número (precio unitario realista mensual en Bolivianos)
   - "monto": número (cantidad * precio)
2. "productos": Un array de objetos, donde cada uno tiene:
   - "id": número entero único
   - "nombre": string (Nombre del producto o servicio)
   - "produccionMensual": número entero (demanda/cantidad de ventas estimadas por mes realistas)
   - "margenGanancia": número (ej: 35, 40, o 50 para el margen deseado)
   - "ingredientes": Un array de objetos que representan la receta o insumos unitarios para crear UN (1) producto:
      - "id": número
      - "nombre": string (ej: "Harina 1kg", "Hora de servicio nube")
      - "monto": número (costo real de esa porción en Bolivianos)

Usa estimaciones certeras y muy reales para los precios del mercado boliviano.
REGLA DE ORO: Asegura que el plan financiero sea viable. Trata de mantener los costos fijos (alquileres, sueldos) lógicos y realistas, y asegúrate que la cantidad de 'produccionMensual' multiplicada por el 'margenGanancia' sea capaz de cubrir los gastos fijos para que el VAN y la TIR sean positivos, pero creíbles. No exageres las ventas iniciales, pero tampoco las pongas tan bajas que el negocio quiebre. Haz los costos de los ingredientes (monto) muy precisos al centavo si es necesario.
RESPONDE SOLO CON EL JSON VÁLIDO.\`;
  }

  `;

contentApi = contentApi.replace(regexPromptIA, replacementPromptIA);
fs.writeFileSync(fileApi, contentApi, 'utf8');

console.log("Success");
