import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, HeadingLevel, TableOfContents, StyleLevel } from 'docx';

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
  const lines = cleanText(text).split('\n');
  const runs = [];
  
  lines.forEach((line, lineIndex) => {
    let cleanLine = line;
    // If unmatched **, remove the last one so split works, or just replace leftovers later
    const parts = cleanLine.split(/\*\*(.*?)\*\*/g);
    let firstPartForLine = true;
    parts.forEach((part, index) => {
      if (part) {
        runs.push(new TextRun({ 
          text: part.replace(/\*\*/g, ''), 
          bold: isBold || (index % 2 === 1), 
          break: (firstPartForLine && lineIndex > 0) ? 1 : 0 
        }));
        firstPartForLine = false;
      }
    });
  });
  
  return new Paragraph({
    alignment: align,
    children: runs,
    spacing: { after: 120 }
  });
};

const createSplitParagraphs = (text, align = AlignmentType.JUSTIFIED) => {
  if (!text) return [createParagraph("[Completar]", false, align)];
  const sentences = cleanText(text).split('.').filter(s => s.trim().length > 0);
  return sentences.map(sentence => {
    let finalSentence = sentence.trim();
    if (finalSentence && !finalSentence.endsWith('.')) finalSentence += '.';
    return createParagraph(finalSentence, false, align);
  });
};

const createCaption = (text, type = 'tabla') => {
  if (type === 'grafico') {
    return new Paragraph({
      text: text,
      style: "GraficoStyle",
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 120 }
    });
  }

  let headingLevel = HeadingLevel.HEADING_5;
  if (type === 'figura') headingLevel = HeadingLevel.HEADING_6;

  return new Paragraph({
    text: text,
    heading: headingLevel,
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 }
  });
};

const createSource = (text) => {
  return new Paragraph({
    children: [new TextRun({ text: text, italics: true, size: 20 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 120 }
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
  let tCount = 1;
  let fCount = 1;
  let gCount = 1;

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
  if (datosTotales) {
    for (const f in datosTotales) {
      pDT[f] = parseJsonFallback(datosTotales[f]);
    }
  }

  const safeGet = (faseObj, prop) => {
    return faseObj ? (faseObj[prop] || "") : "";
  };
  const getDato = (key) => mejoradosConIA[key] || "";

  // Manejo de tabla de costos generada por IA
  let invArray = null;
  if (mejoradosConIA.inversiones_array) {
    if (Array.isArray(mejoradosConIA.inversiones_array)) invArray = mejoradosConIA.inversiones_array;
    else if (typeof mejoradosConIA.inversiones_array === 'string') {
      try { invArray = JSON.parse(mejoradosConIA.inversiones_array); } catch (e) {}
    }
  }
  const inversionesLoc = (invArray && invArray.length > 0) ? invArray : (pDT[10]?.inversiones || []);
  
  let datosFinancieros = null;
  if (mejoradosConIA.datos_financieros) {
    if (typeof mejoradosConIA.datos_financieros === 'object') datosFinancieros = mejoradosConIA.datos_financieros;
    else if (typeof mejoradosConIA.datos_financieros === 'string') {
      try { datosFinancieros = JSON.parse(mejoradosConIA.datos_financieros); } catch (e) {}
    }
  }

  // Tablas financieras
  const capitalInversion = inversionesLoc.filter(i => ['fijo', 'diferido'].includes(i.tipo));
  const capitalOperacion = inversionesLoc.filter(i => ['infraestructura', 'personal', 'operativo'].includes(i.tipo));
  
  // --- Cálculo Dinámico idéntico a la UI de Fase 10 ---
  const cfTotal = capitalOperacion.filter(inv => (inv.comportamiento || 'fijo') !== 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const cvGlobal = capitalOperacion.filter(inv => (inv.comportamiento || 'fijo') === 'variable').reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  
  const totalProdMensual = (pDT[10]?.productos || []).reduce((acc, p) => acc + (parseFloat(p.produccionMensual) || 0), 0) || 1;
  const fijoPorUnidad = cfTotal / totalProdMensual;
  const variableGlobalPorUnidad = cvGlobal / totalProdMensual;

  const numMeses = parseInt(pDT[10]?.mesesProyeccion) || 6;
  const headerMeses = ["Meses", ...Array.from({ length: numMeses }, (_, i) => `Mes ${i + 1}`)];
  
  const rowUnidades = ["N° de unidades vendidas (Total)"];
  const rowPrecio = ["Precio Promedio (Bs.)"];
  const rowIngresos = ["Ingresos (Bs.)"];
  
  const rowCostosFijos = ["Costos Fijos (Bs.)"];
  const rowCostosVariables = ["Costos Variables (Bs.)"];
  const rowGastoTotal = ["Gasto Total (Bs.)"];

  const rowUtilidadBruta = ["Utilidad Bruta (Bs.)"];
  const rowImpuestos = ["Impuestos (IVA 13% + IT 3%)"];
  const rowUtilidadNeta = ["Utilidad Neta (Bs.)"];

  const flujos = [];
  
  for (let m = 1; m <= numMeses; m++) {
    const multiplicador = 1; // FLAT DEMAND
    
    let ingresosTotalesMes = 0;
    let gastosVarsMes = 0;
    let unidadesTotalesMes = 0;

    (pDT[10]?.productos || []).forEach(prod => {
      const prodBase = parseFloat(prod.produccionMensual) || 0;
      const unidades = Math.round(prodBase * multiplicador);
      unidadesTotalesMes += unidades;

      const costoMaterialesUnitario = (prod.ingredientes || []).reduce((acc, curr) => acc + (curr.monto || 0), 0);
      const cvUnitario = costoMaterialesUnitario + variableGlobalPorUnidad;
      const costoUnitarioTotal = cvUnitario + fijoPorUnidad;

      const margen = parseFloat(prod.margenGanancia ?? pDT[10]?.porcentajeGanancia ?? 30);
      const precioSinFactura = margen < 100 ? costoUnitarioTotal / (1 - (margen / 100)) : costoUnitarioTotal;
      const precioFacturado = precioSinFactura / 0.84;

      ingresosTotalesMes += (unidades * precioFacturado);
      gastosVarsMes += (unidades * cvUnitario);
    });
    
    const gastosTotales = cfTotal + gastosVarsMes;
    const uBruta = ingresosTotalesMes - gastosTotales;
    const impuestos = ingresosTotalesMes * 0.16; // IVA 13% + IT 3%
    const uNeta = uBruta - impuestos;
    
    flujos.push(uNeta);
    
    const precioPromedio = unidadesTotalesMes > 0 ? (ingresosTotalesMes / unidadesTotalesMes) : 0;

    rowUnidades.push(String(unidadesTotalesMes));
    rowPrecio.push(formatCurrency(precioPromedio));
    rowIngresos.push(formatCurrency(ingresosTotalesMes));
    
    rowCostosFijos.push(formatCurrency(cfTotal));
    rowCostosVariables.push(formatCurrency(gastosVarsMes));
    rowGastoTotal.push(formatCurrency(gastosTotales));
    
    rowUtilidadBruta.push(formatCurrency(uBruta));
    rowImpuestos.push(formatCurrency(impuestos));
    rowUtilidadNeta.push(formatCurrency(uNeta));
  }
  
  // Punto de equilibrio Multi-producto (En valor monetario)
  let margenContribucionPonderado = 0;
  let puntoEquilibrioBs = 0;
  // Use first month as baseline
  const baselineIngresos = parseFloat(rowIngresos[1].replace('Bs. ', '')) || 0;
  const baselineVars = parseFloat(rowCostosVariables[1].replace('Bs. ', '')) || 0;
  
  if (baselineIngresos > 0) {
    margenContribucionPonderado = (baselineIngresos - baselineVars) / baselineIngresos;
  }
  if (margenContribucionPonderado > 0) {
    puntoEquilibrioBs = cfTotal / margenContribucionPonderado;
  }

  // VAN y TIR
  const totalInversion = capitalInversion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const inversionInicial = totalInversion;
  const tasaTMAR = parseFloat(pDT[10]?.tasaDescuento) || 13;
  const tasaDescuentoMensual = tasaTMAR / 100;
  
  let van = -inversionInicial;
  flujos.forEach((flujo, index) => {
    van += flujo / Math.pow(1 + tasaDescuentoMensual, index + 1);
  });
  
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
    tir_mensual = low * 100;
  }

  
  

  

  const totalOperacion = capitalOperacion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  
  const activosFijos = capitalInversion.filter(i => i.tipo === 'fijo');
  const activosDiferidos = capitalInversion.filter(i => i.tipo === 'diferido');
  const totalActivosFijos = activosFijos.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const totalActivosDiferidos = activosDiferidos.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);

  const headersInversionDetallada = ["CONCEPTO", "CANT.", "PRECIO UNIT.", "SUBTOTAL"];
  const rowsFijos = activosFijos.map(i => [i.concepto || "N/A", String(i.cantidad || 1), formatCurrency(i.precio || i.monto), formatCurrency(i.monto)]);
  const rowsDiferidos = activosDiferidos.map(i => [i.concepto || "N/A", String(i.cantidad || 1), formatCurrency(i.precio || i.monto), formatCurrency(i.monto)]);

  const matInsumos = [];
  (pDT[10]?.productos || []).forEach(prod => {
    (prod.ingredientes || []).forEach(ing => {
      matInsumos.push({
        concepto: `${ing.concepto} (${prod.nombre})`,
        cantidad: ing.cantidad * (parseFloat(prod.produccionMensual) || 1),
        precio: ing.precio,
        monto: ing.monto * (parseFloat(prod.produccionMensual) || 1),
        tipo: 'materiales'
      });
    });
  });
  const infraServicios = capitalOperacion.filter(i => i.tipo === 'infraestructura');
  const personalData = capitalOperacion.filter(i => i.tipo === 'personal');

  const totalMateriales = matInsumos.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const totalInfra = infraServicios.reduce((acc, curr) => acc + ((parseFloat(curr.monto) || 0) * 12), 0);
  const totalPersonal = personalData.reduce((acc, curr) => acc + ((parseFloat(curr.monto) || 0) * 12), 0);

  const headersMat = ["Artículos", "Cantidad", "Costo por Unidad", "Costo total"];
  const rowsMat = matInsumos.map(i => [i.concepto || "N/A", String(i.cantidad || 1), formatCurrency(i.precio || i.monto), formatCurrency(i.monto)]);

  const headersInfra = ["Detalle", "Cantidad", "Costo Mensual (Bs.)", "Total, Anual (Bs.)"];
  const rowsInfra = infraServicios.map(i => [i.concepto || "N/A", String(i.cantidad || 1), formatCurrency(i.precio || i.monto), formatCurrency((parseFloat(i.monto) || 0) * 12)]);

  const headersPersonal = ["Personal/Cargo", "Cantidad", "Costo O Sueldo Mensual (Bs.)", "Total, Anual (Bs.)"];
  const rowsPersonal = personalData.map(i => [i.concepto || "N/A", String(i.cantidad || 1), formatCurrency(i.precio || i.monto), formatCurrency((parseFloat(i.monto) || 0) * 12)]);

  const headersEstructuraCostos = ["DESCRIPCIÓN", "TIPO DE COSTO", "COSTO (BS.)"];
  const rowsEstructuraCostos = capitalOperacion.map(inv => {
    const isVariable = (inv.comportamiento || 'fijo') === 'variable';
    const tipoLabel = isVariable ? "Costo Variable" : "Costo Fijo";
    const desc = `${inv.concepto || "N/A"} (${inv.tipo.toUpperCase()})`;
    return [desc, tipoLabel, formatCurrency(inv.monto)];
  });
  
  // Agregar materiales dinámicos a la estructura de costos en el word
  const totalMaterialesGlobal = matInsumos.reduce((acc, curr) => acc + (curr.monto || 0), 0);
  if (totalMaterialesGlobal > 0) {
    rowsEstructuraCostos.push([
      "Materiales e Insumos (Por todos los productos)", 
      "Costo Variable", 
      formatCurrency(totalMaterialesGlobal)
    ]);
  }

  const rowsTotal = [
    ["Capital de Inversión", formatCurrency(totalInversion)],
    ["Capital de Operación (Mensualizado)", formatCurrency(totalOperacion)],
    ["TOTAL REQUERIDO", formatCurrency(totalInversion + totalOperacion)]
  ];

  // Fallbacks inteligentes en caso de que Fase 7 esté vacía
  const ideaFb = safeGet(pDT[1], 'idea_ganadora') || safeGet(pDT[4], 'nombreProducto') || "un nuevo producto/servicio";
  const problemaFb = safeGet(pDT[2], 'problema') || (pDT[1]?.observaciones?.[0]?.dolor) || "una necesidad local";
  const publicoFb = safeGet(pDT[3], 'segmento') || safeGet(pDT[3], 'publico_objetivo') || "la comunidad";
  
  const fb_diagnostico = `Se ha identificado que existe ${problemaFb} en nuestro entorno. Por ello, la propuesta de ${ideaFb} surge como una alternativa productiva para atender a ${publicoFb}.`;
  const fb_objGeneral = `Desarrollar y comercializar ${ideaFb} para satisfacer la demanda de ${publicoFb}.`;
  const fb_objEspecificos = `1. Diseñar el modelo de negocio para ${ideaFb}.\n2. Atraer y fidelizar a ${publicoFb}.\n3. Lanzar el emprendimiento al mercado con éxito.`;
  const fb_mision = `Brindar ${ideaFb} con la mejor calidad, solucionando ${problemaFb} para ${publicoFb}.`;
  const fb_vision = `Ser un emprendimiento líder y referente en la provisión de ${ideaFb}, generando un impacto positivo.`;
  const fb_justificacion = `Social: El proyecto contribuye al desarrollo local y al bienestar de ${publicoFb}.\nEconómica: Representa una oportunidad de negocio viable al resolver ${problemaFb}.\nPersonal: Permite poner en práctica habilidades emprendedoras y lograr independencia.`;

  try {
    const doc = new Document({
      features: {
        updateFields: true,
      },
      styles: {
        default: {
          document: {
            run: { font: "Arial", size: 22 }, // 11pt = 22 half-points
            paragraph: { spacing: { line: 360 }, alignment: AlignmentType.JUSTIFIED }, // 1.5 line spacing, Justified
          },
          heading1: {
            run: { font: "Arial", size: 22, bold: true, color: "000000" },
            paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.JUSTIFIED }
          },
          heading2: {
            run: { font: "Arial", size: 22, bold: true, color: "000000" },
            paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.JUSTIFIED }
          },
          heading3: {
            run: { font: "Arial", size: 22, bold: true, color: "000000" },
            paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.JUSTIFIED }
          },
          heading4: {
            run: { font: "Arial", size: 22, bold: true, color: "000000" },
            paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.JUSTIFIED }
          },
          heading5: {
            run: { font: "Arial", size: 20, bold: true, italics: true, color: "555555" },
            paragraph: { spacing: { before: 120, after: 120 }, alignment: AlignmentType.CENTER }
          },
          heading6: {
            run: { font: "Arial", size: 20, bold: true, italics: true, color: "555555" },
            paragraph: { spacing: { before: 120, after: 120 }, alignment: AlignmentType.CENTER }
          }
        },
        paragraphStyles: [
          {
            id: "GraficoStyle",
            name: "Grafico Style",
            basedOn: "Normal",
            next: "Normal",
            run: { font: "Arial", size: 20, bold: true, italics: true, color: "555555" },
            paragraph: { spacing: { before: 120, after: 120 }, alignment: AlignmentType.CENTER }
          }
        ]
      },
      sections: [{
        properties: { 
          page: { margin: { top: 1417, bottom: 1417, right: 1417, left: 1701 } } 
        },
        children: [
          // PORTADA
          createParagraph("PROYECTO DE EMPRENDIMIENTO PRODUCTIVO", true, AlignmentType.CENTER),
          createParagraph(getDato('titulo_proyecto') || safeGet(pDT[1], 'titulo_proyecto') || safeGet(pDT[2], 'nombreIdea') || "[TITULO DEL PROYECTO]", true, AlignmentType.CENTER),
          createParagraph(`Nombre del Estudiante: ${perfilUsuario?.nombre_completo || "[Nombre no registrado]"}`, false, AlignmentType.CENTER),
          createParagraph(`Institución: ${perfilUsuario?.colegio || "[Colegio no registrado]"}`, false, AlignmentType.CENTER),
          createParagraph(`Curso / Área: ${perfilUsuario?.curso || "[Curso no registrado]"}`, false, AlignmentType.CENTER),
          new Paragraph({ children: [new PageBreak()] }),
          
          // AGRADECIMIENTO
          createHeading("AGRADECIMIENTO", 1),
          ...createSplitParagraphs(safeGet(pDT[11], 'agradecimientos'), AlignmentType.RIGHT),
          new Paragraph({ children: [new PageBreak()] }),

          // DEDICATORIA
          createHeading("DEDICATORIA", 1),
          ...createSplitParagraphs(getDato('dedicatoria') || safeGet(pDT[11], 'dedicatoria'), AlignmentType.CENTER),
          new Paragraph({ children: [new PageBreak()] }),

          // ÍNDICES
          new TableOfContents("Índice de Contenidos", { hyperlinked: true, headingStyleRange: "1-3" }),
          new Paragraph({ children: [new PageBreak()] }),
          
          createHeading("Índice de Tablas", 2),
          new TableOfContents("", { hyperlinked: true, headingStyleRange: "5-5" }),
          new Paragraph({ children: [new PageBreak()] }),
          
          createHeading("Índice de Figuras", 2),
          new TableOfContents("", { hyperlinked: true, headingStyleRange: "6-6" }),
          new Paragraph({ children: [new PageBreak()] }),
          
          createHeading("Índice de Gráficas", 2),
          new TableOfContents("", { hyperlinked: true, stylesWithLevels: [new StyleLevel("GraficoStyle", 1)] }),
          new Paragraph({ children: [new PageBreak()] }),

          // RESUMEN
          createHeading("RESUMEN", 1),
          createParagraph(getDato('resumen') || safeGet(pDT[11], 'resumen')),
          new Paragraph({ children: [new PageBreak()] }),

          // 1. INTRODUCCIÓN
          createHeading("1. INTRODUCCIÓN", 1),
          createParagraph(getDato('introduccion_consolidada')),

          // 2. PLANTEAMIENTO DEL EMPRENDIMIENTO PRODUCTIVO
          createHeading("2. PLANTEAMIENTO DEL EMPRENDIMIENTO PRODUCTIVO", 1),
          createHeading("2.1. Diagnóstico del contexto productivo", 2),
          createParagraph(getDato('diagnostico') || safeGet(pDT[7], 'diagnostico') || fb_diagnostico),
          
          createHeading("2.2. Objetivos del emprendimiento productivo", 2),
          createHeading("2.2.1. Objetivo general", 3),
          createParagraph(getDato('objGeneral') || safeGet(pDT[7], 'objGeneral') || fb_objGeneral),
          
          createHeading("2.2.2. Objetivos específicos", 3),
          createParagraph(getDato('objEspecificos') || safeGet(pDT[7], 'objEspecificos') || fb_objEspecificos),
          
          createHeading("2.2.3. Misión", 3),
          createParagraph(getDato('mision') || safeGet(pDT[7], 'mision_redaccion_final') || fb_mision),
          
          createHeading("2.2.4. Visión", 3),
          createParagraph(getDato('vision') || safeGet(pDT[7], 'vision_redaccion_final') || fb_vision),
          
          createHeading("2.3. Justificación", 2),
          createParagraph(getDato('justificacion') || (safeGet(pDT[7], 'justificacion_social') ? `Social: ${safeGet(pDT[7], 'justificacion_social')}\nEconómica: ${safeGet(pDT[7], 'justificacion_economica')}\nPersonal: ${safeGet(pDT[7], 'justificacion_personal')}` : fb_justificacion)),

          // 3. DESARROLLO DEL EMPRENDIMIENTO PRODUCTIVO
          createHeading("3. DESARROLLO DEL EMPRENDIMIENTO PRODUCTIVO", 1),
          createHeading("3.1. Localización y distribución del emprendimiento", 2),
          createHeading("3.1.1 Localización", 3),
          createParagraph(getDato('localizacion') || `Macro: ${safeGet(pDT[6], 'dondeProducir')} - Micro: ${safeGet(pDT[6], 'dondeVender')}`),
          ...(imagenesBase64.croquis ? [
            createCaption(`Figura ${fCount++}: Croquis de Localización`, 'figura'),
            createImage(imagenesBase64.croquis, 500, 300),
            createSource("Fuente: Elaboración propia.")
          ] : []),
          createParagraph(getDato('direccion_ubicacion') || ""),
          
          createHeading("3.1.2 Métodos de Pago", 3),
          createParagraph(getDato('metodos_pago') || safeGet(pDT[6], 'comoRecibirPago')),
          
          createHeading("3.1.3 Plan de Acción de Distribución", 3),
          createParagraph(getDato('plan_distribucion') || "Plan de distribución."),
          
          createHeading("3.2. Análisis del mercado", 2),
          createHeading("3.2.1 Oferta", 3),
          createParagraph(getDato('oferta') || "Análisis de oferta."),
          
          createHeading("3.2.2 Demanda Estimada", 3),
          createParagraph(getDato('demanda') || safeGet(pDT[3], 'tamano_mercado')),
          createHeading("Explicación de Índices de Demanda", 4),
          createParagraph(getDato('explicacion_indices_demanda') || "Explicación de los índices estadísticos y proyecciones utilizados para estimar la demanda."),
          
          createHeading("3.2.3 Público objetivo (cliente y/o usuario)", 3),
          createParagraph(getDato('publico_objetivo') || safeGet(pDT[3], 'perfil_cliente')),
          
          createHeading("3.2.4 Entorno y competencia", 3),
          createParagraph(getDato('entorno') || "Análisis PESTEL."),
          
          createHeading("3.2.5 Ventaja competitiva del emprendimiento", 3),
          createParagraph(getDato('ventaja_competitiva') || safeGet(pDT[5], 'ventajaFrase')),

          createHeading("3.3. Estrategia de promoción", 2),
          createParagraph(getDato('promocion') || safeGet(pDT[5], 'promoCanales')),
          
          createHeading("3.4. Estructura organizacional", 2),
          createHeading("3.4.1 Organigrama", 3),
          createParagraph(getDato('resumen_estructura') || "Resumen de estructura organizacional."),
          ...(imagenesBase64.organigrama ? [
            createCaption(`Figura ${fCount++}: Organigrama de la Empresa`, 'figura'),
            createImage(imagenesBase64.organigrama, 600, 400),
            createSource("Fuente: Elaboración propia.")
          ] : []),
          
          createHeading("3.4.2 Roles y Funciones", 3),
          createParagraph(getDato('resumen_roles') || getDato('estructura_org') || "Detalle de roles y funciones."),
          
          createHeading("3.4.3 Clima organizacional", 3),
          createParagraph(getDato('resumen_clima_cultura') || "Resumen de clima organizacional."),

          createHeading("3.5. Diseño de producto o servicio", 2),
          createHeading("3.5.1. Características del producto o servicio", 3),
          createParagraph(getDato('caracteristicas_producto') || "Características y beneficios del producto."),
          
          createHeading("3.5.2. Empaque y etiquetado", 3),
          createParagraph(getDato('empaque') || safeGet(pDT[4], 'empaqueProducto')),
          ...(imagenesBase64.empaque ? [
            createCaption(`Figura ${fCount++}: Empaque y Etiquetado`, 'figura'),
            createImage(imagenesBase64.empaque, 400, 400),
            createSource("Fuente: Elaboración propia.")
          ] : []),
          
          createHeading("3.6. Análisis y descripción del ciclo de producción o de servicio (opcional)", 2),
          createHeading("3.6.1 Procesos", 3),
          createParagraph(getDato('procesos_intro') || getDato('procesos') || "Análisis de procesos productivos."),
          ...(safeGet(pDT[8], 'pasosProduccion') && Array.isArray(safeGet(pDT[8], 'pasosProduccion')) ? [
            createCaption(`Tabla ${tCount++}: Diagrama de Procesos`),
            createTable(
              ["Descripción de la Operación", "Operación (⭕)", "Inspección (⬜)", "Transporte (➡️)", "Almacenaje (🔺)", "Demora (D)"],
              safeGet(pDT[8], 'pasosProduccion').map((p, i) => [
                `${i + 1}. ${p.texto || ""}`,
                p.categoria === 'operacion' ? "⭕" : "",
                p.categoria === 'inspeccion' ? "⬜" : "",
                p.categoria === 'transporte' ? "➡️" : "",
                (p.categoria === 'almacenamiento' || p.categoria === 'almacenaje') ? "🔺" : "",
                p.categoria === 'demora' ? "D" : ""
              ])
            ),
            createSource("Fuente: Elaboración propia.")
          ] : []),

          // 4. VIABILIDAD Y SOSTENIBILIDAD
          createHeading("4. VIABILIDAD Y SOSTENIBILIDAD", 1),
          
          createHeading("4.1. Cálculo de inversiones", 2),
          createHeading("4.1.1. Capital de inversión", 3),
          
          createHeading("Activos Fijos", 4),
          createCaption(`Tabla ${tCount++}: Activos Fijos`),
          createTable(headersInversionDetallada, rowsFijos),
          createSource("Fuente: Elaboración propia."),
          createParagraph(`Subtotal Activos Fijos: ${formatCurrency(totalActivosFijos)}`, true, AlignmentType.RIGHT),
          
          createHeading("Activos Diferidos / Intangibles", 4),
          createCaption(`Tabla ${tCount++}: Activos Diferidos / Intangibles`),
          createTable(headersInversionDetallada, rowsDiferidos),
          createSource("Fuente: Elaboración propia."),
          createParagraph(`Subtotal Activos Diferidos: ${formatCurrency(totalActivosDiferidos)}`, true, AlignmentType.RIGHT),
          
          createParagraph(`Subtotal Capital de Inversión: ${formatCurrency(totalInversion)}`, true, AlignmentType.RIGHT),
          
          createHeading("4.1.2. Capital de operación", 3),
          
          createHeading("a. Costos de materiales e insumos de producción", 4),
          createCaption(`Tabla ${tCount++}: Materiales e Insumos`),
          createTable(headersMat, rowsMat),
          createSource("Fuente: Elaboración propia."),
          createParagraph(`Total materiales e insumos: ${formatCurrency(totalMateriales)}`, true, AlignmentType.RIGHT),
          
          createHeading("b. Costos por infraestructura y servicios", 4),
          createCaption(`Tabla ${tCount++}: Infraestructura y Servicios`),
          createTable(headersInfra, rowsInfra),
          createSource("Fuente: Elaboración propia."),
          createParagraph(`Total infraestructura y servicio (Anual): ${formatCurrency(totalInfra)}`, true, AlignmentType.RIGHT),
          
          createHeading("c. Costos de personal o mano de obra", 4),
          createCaption(`Tabla ${tCount++}: Personal o Mano de Obra`),
          createTable(headersPersonal, rowsPersonal),
          createSource("Fuente: Elaboración propia."),
          createParagraph(`Total costo de personal (Anual): ${formatCurrency(totalPersonal)}`, true, AlignmentType.RIGHT),
          
          createParagraph(`Subtotal Capital de Trabajo (Mensual): ${formatCurrency(totalOperacion)}`, true, AlignmentType.RIGHT),
          
          createHeading("4.1.3. Resumen de Inversión Total", 3),
          createCaption(`Tabla ${tCount++}: Resumen de Inversión Total`),
          createTable(["Categoría", "Monto Total (Bs.)"], rowsTotal),
          createSource("Fuente: Elaboración propia."),
          
          createHeading("4.2. Costo de producción", 2),
          createHeading("4.2.1. Cálculo de costos (Estructura de Costos)", 3),
          createCaption(`Tabla ${tCount++}: Estructura de Costos`),
          createTable(headersEstructuraCostos, rowsEstructuraCostos),
          createSource("Fuente: Elaboración propia."),
          createParagraph(`TOTALES -> CF: ${formatCurrency(cfTotal)} | CV: ${formatCurrency(cvGlobal + totalMaterialesGlobal)} | GLOBAL: ${formatCurrency(cfTotal + cvGlobal + totalMaterialesGlobal)}`, true, AlignmentType.RIGHT),
          
          createHeading("4.3. Precio de Venta", 2),
          createParagraph(`Cálculo de precio de venta estimado según proyecciones del proyecto (Fase 10).`),
          
          
          createHeading("1. Resumen de Precios por Producto", 4),
          createCaption(`Tabla ${tCount++}: Precios Estimados`),
          createTable(["Producto", "Costo Unitario", "Margen", "Precio (Sin Factura)", "Precio Facturado"], 
            (pDT[10]?.productos || []).map(p => {
              const costoMat = (p.ingredientes || []).reduce((a, b) => a + (b.monto || 0), 0);
              const cuTotal = costoMat + variableGlobalPorUnidad + fijoPorUnidad;
              const mg = parseFloat(p.margenGanancia ?? pDT[10]?.porcentajeGanancia ?? 30);
              const pSinFac = mg < 100 ? cuTotal / (1 - (mg/100)) : cuTotal;
              const pFac = pSinFac / 0.84;
              return [
                p.nombre || "Producto",
                `Bs. ${formatCurrency(cuTotal)}`,
                `${mg}%`,
                `Bs. ${formatCurrency(pSinFac)}`,
                `Bs. ${formatCurrency(pFac)}`
              ];
            })
          ),
          createSource("Fuente: Elaboración propia."),
          
          createHeading("4.4. Proyecciones Financieras", 2),

          
          createHeading("4.4.1. Proyección de Ganancias (Ingresos)", 3),
          createCaption(`Tabla ${tCount++}: Proyección de Ganancias`),
          createTable(headerMeses, [rowUnidades, rowPrecio, rowIngresos]),
          createSource("Fuente: Elaboración propia."),
          
          createHeading("4.4.2. Proyección de Gastos", 3),
          createCaption(`Tabla ${tCount++}: Proyección de Gastos`),
          createTable(headerMeses, [rowCostosFijos, rowCostosVariables, rowGastoTotal]),
          createSource("Fuente: Elaboración propia."),
          
          createHeading("4.4.3. Cálculo de Utilidad Neta", 3),
          createCaption(`Tabla ${tCount++}: Utilidad Neta`),
          createTable(headerMeses, [rowUtilidadBruta, rowImpuestos, rowUtilidadNeta]),
          createSource("Fuente: Elaboración propia."),
          
          createHeading("4.5. Punto de Equilibrio", 2),
          createParagraph(`El punto de equilibrio se alcanza cuando la utilidad neta acumulada en las proyecciones logra cubrir la inversión inicial.`),
          
          createHeading("4.6. Evaluación Financiera (VAN y TIR)", 2),
          createCaption(`Tabla ${tCount++}: VAN y TIR`),
          createTable(["Indicador", "Valor", "Condición / Interpretación"], [
            ["Tasa de Descuento (TMAR)", `${tasaTMAR} % mensual`, "Rentabilidad exigida"],
            ["Valor Actual Neto (VAN)", `Bs. ${formatCurrency(van)}`, van > 0 ? "El proyecto genera valor" : "El proyecto destruye valor"],
            ["Tasa Interna de Retorno (TIR)", `${tir_mensual.toFixed(2)} % mensual`, tir_mensual > tasaTMAR ? "Supera la tasa exigida" : "No alcanza la tasa exigida"]
          ]),
          createSource("Fuente: Elaboración propia."),
          createHeading("Interpretación de Viabilidad y Rentabilidad", 4),
          createParagraph(getDato('viabilidad_interpretacion') || getDato('viabilidad') || "La viabilidad del proyecto se sustenta en el análisis de sus indicadores financieros. Un VAN positivo confirma la generación de valor, mientras que la TIR supera la tasa exigida, confirmando su rentabilidad y viabilidad en el mercado."),

          // 5. RESULTADOS DE VIABILIDAD
          createHeading("5. RESULTADOS DE VIABILIDAD", 1),
          createCaption(`Tabla ${tCount++}: Análisis de Viabilidad del Proyecto`),
          createTable(["Criterio de Viabilidad", "Justificación y Resultados"], [
            ["Viabilidad Comercial", getDato('viabilidad_comercial') || safeGet(pDT[11]?.viabilidad, 'viabilidadComercial') || "Pendiente de análisis"],
            ["Viabilidad Técnica", getDato('viabilidad_tecnica') || safeGet(pDT[11]?.viabilidad, 'viabilidadTecnica') || "Pendiente de análisis"],
            ["Viabilidad Legal y Ambiental", getDato('viabilidad_legal') || safeGet(pDT[11]?.viabilidad, 'viabilidadLegal') || "Pendiente de análisis"]
          ]),
          createSource("Fuente: Elaboración propia."),

          // 6. PROYECTO DE VIDA
          createHeading("6. PROYECTO DE VIDA", 1),
          createParagraph(getDato('proyecto_vida') || safeGet(pDT[12], 'proposito_valor')),

          // 7. CONCLUSIONES Y RECOMENDACIONES
          createHeading("7. CONCLUSIONES Y RECOMENDACIONES", 1),
          createHeading("7.1. Conclusiones", 2),
          createParagraph(getDato('conclusiones') || safeGet(pDT[11], 'conclusiones')),
          createHeading("7.2. Recomendaciones", 2),
          createParagraph(getDato('recomendaciones') || safeGet(pDT[11], 'recomendaciones')),
          
          createHeading("BIBLIOGRAFÍA", 1),
          createParagraph("Inserte aquí las referencias bibliográficas.", false, AlignmentType.LEFT),
          
          createHeading("ANEXOS", 1),
          createHeading("Anexo A: Resultados de Validación de Idea (Fase 2)", 2),
          ...(pDT[2]?.resumenIAData ? [
            createParagraph("Análisis de Inteligencia Artificial:", true),
            createParagraph(pDT[2].resumenIAData)
          ] : []),
          createHeading("5.1. Resultados de las encuestas", 2),
          ...(imagenesBase64.encuestas && imagenesBase64.encuestas.length > 0 ? 
            imagenesBase64.encuestas.flatMap((enc, idx) => [
              createCaption(`Gráfica ${gCount++}: ${enc.label}`, 'grafico'),
              createImage(enc.base64, 600, 450),
              createSource("Fuente: Elaboración propia.")
            ]) 
            : [createParagraph("No se generaron encuestas o hubo un error en la captura.", false, AlignmentType.CENTER)]
          )
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const projectName = localStorage.getItem('temp_proyecto_nombre') || 'Proyecto_Final_Emprendimiento';
    a.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al generar docx", error);
    alert("Error al generar docx: " + error.message + "\n" + error.stack);
  }
};