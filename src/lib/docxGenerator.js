import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, HeadingLevel, TableOfContents } from 'docx';

const safeString = (val) => {
  if (!val) return '';
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'object') return safeString(parsed);
    } catch (e) {}
  }
  if (Array.isArray(val)) {
    return val.map(v => safeString(v)).filter(Boolean).join(', ');
  }
  if (typeof val === 'object') {
    return val.text || val.texto || val.nombre || val.desc || val.descripcion || val.title || val.name || val.problema || val.segmento || val.beneficio || val.caracteristica || '';
  }
  return String(val);
};

const cleanText = (str) => {
  const safeStr = safeString(str);
  if (!safeStr) return '';
  return safeStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFD\u00EF\u00BF\u00BD]/g, '');
};

const formatCurrency = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "Bs. 0.00";
  return "Bs. " + n.toFixed(2);
};

const base64ToUint8Array = (base64Str) => {
  if (!base64Str) return null;
  try {
    const b64Data = base64Str.split(',')[1] || base64Str;
    if (!b64Data) return null;
    const binaryString = window.atob(b64Data);
    const len = binaryString.length;
    if (len < 100) return null;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  } catch (e) { return null; }
};

const createHeading = (text, level = 1) => {
  const headingLevels = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
  };
  return new Paragraph({
    text: cleanText(text),
    heading: headingLevels[level] || HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 }
  });
};

const createParagraph = (text, isBold = false, align = AlignmentType.JUSTIFIED) => {
  if (!text) text = "[Completar]";
  return new Paragraph({
    alignment: align,
    children: [new TextRun({ text: cleanText(text), bold: isBold })],
    spacing: { after: 120 }
  });
};

const createTable = (headers, rows) => {
  if (!rows || rows.length === 0) {
    rows = [headers.map(() => "Sin datos")];
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" }
    },
    rows: [
      new TableRow({
        children: headers.map(h => new TableCell({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: cleanText(h), bold: true })]
          })],
          shading: { fill: "f1f5f9" },
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }))
      }),
      ...rows.map(row => new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: cleanText(cell), bold: false })]
          })],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }))
      }))
    ]
  });
};

const createImage = (base64Str, w, h, placeholder = "[Imagen no disponible]") => {
  const data = base64ToUint8Array(base64Str);
  if (!data) return createParagraph(placeholder, false, AlignmentType.CENTER);
  return new Paragraph({
    children: [new ImageRun({ type: 'png', data, transformation: { width: w, height: h } })],
    alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }
  });
};

export const generarYDescargarWord = async (datosTotales, mejoradosConIA = {}, imagenesBase64 = {}, perfilUsuario = {}) => {
  const safeGet = (faseObj, prop) => faseObj ? (faseObj[prop] || "") : "";
  const getDato = (key) => mejoradosConIA[key] || "";

  // Manejo de tabla de costos generada por IA
  let invArray = null;
  if (mejoradosConIA.inversiones_array) {
    if (Array.isArray(mejoradosConIA.inversiones_array)) invArray = mejoradosConIA.inversiones_array;
    else if (typeof mejoradosConIA.inversiones_array === 'string') {
      try { invArray = JSON.parse(mejoradosConIA.inversiones_array); } catch (e) {}
    }
  }
  const inversionesLoc = (invArray && invArray.length > 0) ? invArray : (datosTotales[10]?.inversiones || []);
  
  let datosFinancieros = null;
  if (mejoradosConIA.datos_financieros) {
    if (typeof mejoradosConIA.datos_financieros === 'object') datosFinancieros = mejoradosConIA.datos_financieros;
    else if (typeof mejoradosConIA.datos_financieros === 'string') {
      try { datosFinancieros = JSON.parse(mejoradosConIA.datos_financieros); } catch (e) {}
    }
  }

  const proyeccionesFin = (datosFinancieros && datosFinancieros.proyecciones) ? datosFinancieros.proyecciones : (datosTotales[10]?.proyecciones || []);
  const preciosFin = datosFinancieros ? datosFinancieros : (datosTotales[10]?.precios || {});
  const ptoEquilibrioFin = datosFinancieros?.puntoEquilibrio || datosTotales[10]?.puntoEquilibrio || 0;
  
  // Tablas financieras
  const capitalInversion = inversionesLoc.filter(i => ['activoFijo', 'activoDiferido'].includes(i.tipo));
  const capitalOperacion = inversionesLoc.filter(i => ['materiales', 'infraestructura', 'personal'].includes(i.tipo));
  
  const totalInversion = capitalInversion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const totalOperacion = capitalOperacion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  
  const headersInv = ["Concepto", "Tipo", "Monto (Bs.)"];
  const rowsInversion = capitalInversion.map(i => [i.concepto || "N/A", i.tipo === 'activoFijo' ? 'Activo Fijo' : 'Activo Diferido', formatCurrency(i.monto)]);
  const rowsOperacion = capitalOperacion.map(i => [i.concepto || "N/A", i.tipo, formatCurrency(i.monto)]);
  const rowsTotal = [
    ["Capital de Inversión", formatCurrency(totalInversion)],
    ["Capital de Operación", formatCurrency(totalOperacion)],
    ["TOTAL REQUERIDO", formatCurrency(totalInversion + totalOperacion)]
  ];

  // Fallbacks inteligentes en caso de que Fase 7 esté vacía
  const ideaFb = safeGet(datosTotales[1], 'idea_ganadora') || safeGet(datosTotales[4], 'nombreProducto') || "un nuevo producto/servicio";
  const problemaFb = safeGet(datosTotales[2], 'problema') || (datosTotales[1]?.observaciones?.[0]?.dolor) || "una necesidad local";
  const publicoFb = safeGet(datosTotales[3], 'segmento') || safeGet(datosTotales[3], 'publico_objetivo') || "la comunidad";
  
  const fb_diagnostico = `Se ha identificado que existe ${problemaFb} en nuestro entorno. Por ello, la propuesta de ${ideaFb} surge como una alternativa productiva para atender a ${publicoFb}.`;
  const fb_objGeneral = `Desarrollar y comercializar ${ideaFb} para satisfacer la demanda de ${publicoFb}.`;
  const fb_objEspecificos = `1. Diseñar el modelo de negocio para ${ideaFb}.\n2. Atraer y fidelizar a ${publicoFb}.\n3. Lanzar el emprendimiento al mercado con éxito.`;
  const fb_mision = `Brindar ${ideaFb} con la mejor calidad, solucionando ${problemaFb} para ${publicoFb}.`;
  const fb_vision = `Ser un emprendimiento líder y referente en la provisión de ${ideaFb}, generando un impacto positivo.`;
  const fb_justificacion = `Social: El proyecto contribuye al desarrollo local y al bienestar de ${publicoFb}.\nEconómica: Representa una oportunidad de negocio viable al resolver ${problemaFb}.\nPersonal: Permite poner en práctica habilidades emprendedoras y lograr independencia.`;

  try {
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: "Arial", size: 22 }, // 11pt = 22 half-points
            paragraph: { spacing: { line: 360 } }, // 1.5 line spacing
          },
        },
      },
      sections: [{
        properties: { 
          page: { margin: { top: 1417, bottom: 1417, right: 1417, left: 1701 } } 
        },
        children: [
          // PORTADA
          createParagraph("PROYECTO DE EMPRENDIMIENTO PRODUCTIVO", true, AlignmentType.CENTER),
          createParagraph(getDato('titulo_proyecto') || safeGet(datosTotales[1], 'titulo_proyecto') || safeGet(datosTotales[2], 'nombreIdea') || "[TITULO DEL PROYECTO]", true, AlignmentType.CENTER),
          createParagraph(`Nombre del Estudiante: ${perfilUsuario?.nombre_completo || "[Nombre no registrado]"}`, false, AlignmentType.CENTER),
          createParagraph(`Institución: ${perfilUsuario?.colegio || "[Colegio no registrado]"}`, false, AlignmentType.CENTER),
          createParagraph(`Curso / Área: ${perfilUsuario?.curso || "[Curso no registrado]"}`, false, AlignmentType.CENTER),
          new Paragraph({ children: [new PageBreak()] }),
          
          // AGRADECIMIENTO
          createHeading("AGRADECIMIENTO", 1),
          createParagraph(getDato('agradecimientos') || safeGet(datosTotales[11], 'agradecimientos')),
          new Paragraph({ children: [new PageBreak()] }),

          // DEDICATORIA
          createHeading("DEDICATORIA", 1),
          createParagraph(getDato('dedicatoria') || safeGet(datosTotales[11], 'dedicatoria')),
          new Paragraph({ children: [new PageBreak()] }),

          // ÍNDICE
          new TableOfContents("Índice", { hyperlinked: true, headingStyleRange: "1-3" }),
          new Paragraph({ children: [new PageBreak()] }),

          // RESUMEN
          createHeading("RESUMEN", 1),
          createParagraph(getDato('resumen') || safeGet(datosTotales[11], 'resumen')),
          new Paragraph({ children: [new PageBreak()] }),

          // 1. INTRODUCCIÓN
          createHeading("1. INTRODUCCIÓN", 1),
          createParagraph(getDato('intro_contexto') || safeGet(datosTotales[11], 'intro_contexto')),
          createParagraph(getDato('intro_problema') || safeGet(datosTotales[11], 'intro_problema')),
          createParagraph(getDato('intro_objetivos') || safeGet(datosTotales[11], 'intro_objetivos')),
          createParagraph(getDato('intro_estructura') || safeGet(datosTotales[11], 'intro_estructura')),

          // 2. PLANTEAMIENTO DEL EMPRENDIMIENTO PRODUCTIVO
          createHeading("2. PLANTEAMIENTO DEL EMPRENDIMIENTO PRODUCTIVO", 1),
          createHeading("2.1. Diagnóstico del contexto productivo", 2),
          createParagraph(getDato('diagnostico') || safeGet(datosTotales[7], 'diagnostico') || fb_diagnostico),
          
          createHeading("2.2. Objetivos del emprendimiento productivo", 2),
          createHeading("2.2.1. Objetivo general", 3),
          createParagraph(getDato('objGeneral') || safeGet(datosTotales[7], 'objGeneral') || fb_objGeneral),
          
          createHeading("2.2.2. Objetivos específicos", 3),
          createParagraph(getDato('objEspecificos') || safeGet(datosTotales[7], 'objEspecificos') || fb_objEspecificos),
          
          createHeading("2.2.3. Misión", 3),
          createParagraph(getDato('mision') || safeGet(datosTotales[7], 'mision_redaccion_final') || fb_mision),
          
          createHeading("2.2.4. Visión", 3),
          createParagraph(getDato('vision') || safeGet(datosTotales[7], 'vision_redaccion_final') || fb_vision),
          
          createHeading("2.3. Justificación", 2),
          createParagraph(getDato('justificacion') || (safeGet(datosTotales[7], 'justificacion_social') ? `Social: ${safeGet(datosTotales[7], 'justificacion_social')}\nEconómica: ${safeGet(datosTotales[7], 'justificacion_economica')}\nPersonal: ${safeGet(datosTotales[7], 'justificacion_personal')}` : fb_justificacion)),

          // 3. DESARROLLO DEL EMPRENDIMIENTO PRODUCTIVO
          createHeading("3. DESARROLLO DEL EMPRENDIMIENTO PRODUCTIVO", 1),
          createHeading("3.1. Localización y Distribución", 2),
          createHeading("3.1.1 Localización del emprendimiento", 3),
          createParagraph(getDato('localizacion') || `Macro: ${safeGet(datosTotales[6], 'dondeProducir')} - Micro: ${safeGet(datosTotales[6], 'dondeVender')}`),
          ...(imagenesBase64.croquis ? [createImage(imagenesBase64.croquis, 500, 300)] : []),
          
          createHeading("3.1.2 Logistica de Entrega", 3),
          createParagraph(getDato('logistica_entrega') || safeGet(datosTotales[6], 'comoEntregar')),
          
          createHeading("3.1.3 Metodos de Pago", 3),
          createParagraph(getDato('metodos_pago') || safeGet(datosTotales[6], 'comoRecibirPago')),
          
          createHeading("3.1.4 Plan de Accion de Distribucion", 3),
          createParagraph(getDato('plan_distribucion') || "Plan de distribución."),
          
          createHeading("3.1.5 Presupuesto de Distribucion", 3),
          createParagraph(getDato('presupuesto') || "Presupuesto de distribución."),
          
          createHeading("3.1.6 Necesidades de distribucion", 3),
          createParagraph(getDato('necesidades_distribucion') || safeGet(datosTotales[6], 'necesidadesDistribucion')),
          
          createHeading("3.2. Análisis del mercado", 2),
          createHeading("3.2.1 Oferta", 3),
          createParagraph(getDato('oferta') || "Análisis de oferta."),
          
          createHeading("3.2.2 Demanda", 3),
          createParagraph(getDato('demanda') || safeGet(datosTotales[3], 'tamano_mercado')),
          
          createHeading("3.2.3 Público objetivo (cliente y/o usuario)", 3),
          createParagraph(getDato('publico_objetivo') || safeGet(datosTotales[3], 'perfil_cliente')),
          
          createHeading("3.2.4 Entorno y competencia", 3),
          createParagraph(getDato('entorno') || "Análisis PESTEL."),
          
          createHeading("3.2.5 Ventaja competitiva del emprendimiento", 3),
          createParagraph(getDato('ventaja_competitiva') || safeGet(datosTotales[5], 'ventajaFrase')),

          createHeading("3.3. Estrategia de promoción y distribución", 2),
          createParagraph(getDato('promocion') || safeGet(datosTotales[5], 'promoCanales')),
          
          createHeading("3.4. Estructura organizacional", 2),
          createParagraph(getDato('estructura_org') || "Roles y estructura organizacional."),
          ...(imagenesBase64.organigrama ? [createImage(imagenesBase64.organigrama, 600, 400)] : []),

          createHeading("3.5. Diseño de producto o servicio", 2),
          createHeading("3.5.1. Características del producto o servicio", 3),
          createParagraph(getDato('caracteristicas_producto') || "Características y beneficios del producto."),
          
          createHeading("3.5.2. Empaque y etiquetado", 3),
          createParagraph(getDato('empaque') || safeGet(datosTotales[4], 'empaqueProducto')),
          ...(imagenesBase64.empaque ? [createImage(imagenesBase64.empaque, 400, 400)] : []),
          
          createHeading("3.6. Análisis y descripción del ciclo de producción o de servicio", 2),
          createHeading("3.6.1 Procesos", 3),
          createParagraph(getDato('procesos') || "Análisis de procesos productivos."),
          
          createHeading("3.6.2 Layout", 3),
          createParagraph(getDato('layout') || "Descripción del layout."),
          ...(imagenesBase64.layout ? [createImage(imagenesBase64.layout, 500, 300)] : []),

          // 4. VIABILIDAD Y SOSTENIBILIDAD
          createHeading("4. VIABILIDAD Y SOSTENIBILIDAD", 1),
          
          createHeading("4.1. Cálculo de inversiones", 2),
          createHeading("4.1.1. Capital de inversión", 3),
          createTable(headersInv, rowsInversion),
          
          createHeading("4.1.2. Capital de operación", 3),
          createTable(headersInv, rowsOperacion),
          
          createHeading("4.1.3. Resumen de Inversión Total", 3),
          createTable(["Categoría", "Monto Total (Bs.)"], rowsTotal),
          
          createHeading("4.2. Costo de producción", 2),
          createHeading("4.2.1. Cálculo de costos", 3),
          createParagraph("La tabla superior (Capital de Operación) detalla la estructura de costos operativos iniciales."),
          
          createHeading("4.3. Precio de Venta", 2),
          createParagraph(`Cálculo de precio de venta estimado según proyecciones del proyecto (Fase 10).`),
          createTable(["Concepto", "Monto"], [
            ["Precio Unitario (aprox)", formatCurrency(preciosFin.precioSinFactura)],
            ["Precio c/ Factura", formatCurrency(preciosFin.precioFacturado)],
            ["Margen de Ganancia", `${preciosFin.porcentajeGanancia || 0}%`]
          ]),
          
          createHeading("4.4. Ganancias", 2),
          createHeading("4.4.1 Proyeccion de Ganancias (Ingresos)", 3),
          createTable(["Mes", "Monto"], proyeccionesFin.map((p, idx) => [`Mes ${idx+1}`, formatCurrency(p.ingresos)])),
          
          createHeading("4.4.2. Proyeccion de Gastos", 3),
          createTable(["Mes", "Monto"], proyeccionesFin.map((p, idx) => [`Mes ${idx+1}`, formatCurrency(p.gastos)])),
          
          createHeading("4.4.3. Utilidad", 3),
          createTable(["Mes", "Monto"], proyeccionesFin.map((p, idx) => [`Mes ${idx+1}`, formatCurrency(p.utilidad)])),
          
          createHeading("4.5 Punto de Equilibrio", 2),
          createParagraph(`El Punto de Equilibrio (en unidades) es: ${ptoEquilibrioFin || 0}`),
          
          createHeading("4.6 Indicadores de rentabilidad", 2),
          createParagraph("Basado en el flujo de caja proyectado."),
          
          createHeading("4.7 Viabilidad y Sostenibilidad", 2),
          createParagraph(getDato('viabilidad') || `VAN: ${formatCurrency(safeGet(datosTotales[10]?.indicadores, 'van'))}, TIR: ${safeGet(datosTotales[10]?.indicadores, 'tir')}%`),

          // 5. RESULTADOS
          createHeading("5. RESULTADOS", 1),
          createParagraph(getDato('resultados') || `Mercado: ${safeGet(datosTotales[11], 'resultados_mercado')} - Técnico: ${safeGet(datosTotales[11], 'resultados_tecnico')} - Financiero: ${safeGet(datosTotales[11], 'resultados_financiero')}`),

          // 6. PROYECTO DE VIDA
          createHeading("6. PROYECTO DE VIDA", 1),
          createParagraph(getDato('proyecto_vida') || safeGet(datosTotales[12], 'proposito_valor')),

          // 7. CONCLUSIONES Y RECOMENDACIONES
          createHeading("7. CONCLUSIONES Y RECOMENDACIONES", 1),
          createParagraph(getDato('conclusiones') || safeGet(datosTotales[11], 'conclusiones')),
          
          createHeading("BIBLIOGRAFÍA", 1),
          createParagraph("Inserte aquí las referencias bibliográficas.", false, AlignmentType.LEFT),
          
          createHeading("ANEXOS", 1),
          createParagraph("Gráficos, resultados de encuestas y anexos adicionales.", false, AlignmentType.LEFT),
          ...(imagenesBase64?.grafico_encuesta ? [
             createParagraph("Gráfico de Encuesta (Fase 2)", true, AlignmentType.CENTER),
             createImage(imagenesBase64.grafico_encuesta, 500, 300)
          ] : []),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Proyecto_Final_Emprendimiento.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al generar docx", error);
  }
};