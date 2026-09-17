const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, TableOfContents } = require('docx');
const fs = require('fs');

const createParagraph = (text, isBold = false) => {
  if (!text) text = "[Completar]";
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toString(),
        font: "Arial",
        size: 22, // 11pt (22 half-points)
        bold: isBold
      })
    ],
    spacing: {
      line: 360, // 1.5 line spacing (240 * 1.5 = 360)
    },
    alignment: AlignmentType.JUSTIFIED
  });
};

const createHeading = (text, level) => {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: 240, after: 120 },
    alignment: level === HeadingLevel.HEADING_1 ? AlignmentType.CENTER : AlignmentType.LEFT
  });
};

async function testGen() {
  const datosTotales = {};
  const mejoradosConIA = {};

  const safeGet = (fase, clave, subclave = null) => {
    try {
      const dataFase = datosTotales[fase] ? datosTotales[fase][clave] : null;
      if (!dataFase) return "";
      if (subclave) return dataFase[subclave] || "";
      if (typeof dataFase === 'string') return dataFase;
      return JSON.stringify(dataFase);
    } catch (e) {
      return "";
    }
  };

  const getDato = (claveUnica) => {
    return mejoradosConIA[claveUnica] || "";
  };

  const nombreEstudiante = "[Nombre del Estudiante]";
  const colegio = "[Nombre de la Institución]";
  const curso = "[Curso]";
  const tituloProyecto = "[Título del Emprendimiento]";

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 22,
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
        heading1: {
          run: { font: "Arial", size: 28, bold: true, color: "000000" },
          paragraph: { spacing: { before: 240, after: 120 } }
        },
        heading2: {
          run: { font: "Arial", size: 24, bold: true, color: "000000" },
          paragraph: { spacing: { before: 240, after: 120 } }
        },
        heading3: {
          run: { font: "Arial", size: 22, bold: true, color: "000000" },
          paragraph: { spacing: { before: 240, after: 120 } }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1417,    // 2.5 cm en DXA
              bottom: 1417, // 2.5 cm en DXA
              right: 1417,  // 2.5 cm en DXA
              left: 1701,   // 3.0 cm en DXA
            },
          },
        },
        children: [
          // ================= CARÁTULA =================
          new Paragraph({
            text: "A) PROYECTO DE EMPRENDIMIENTO PRODUCTIVO",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "", spacing: { before: 1000 } }),
          new Paragraph({
            children: [new TextRun({ text: colegio.toUpperCase(), font: "Arial", size: 32, bold: true })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "", spacing: { before: 1000 } }),
          new Paragraph({
            children: [new TextRun({ text: tituloProyecto.toUpperCase(), font: "Arial", size: 28, bold: true })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "", spacing: { before: 1000 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "Estudiante: ", bold: true, font: "Arial", size: 24 }),
              new TextRun({ text: nombreEstudiante, font: "Arial", size: 24 })
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Curso: ", bold: true, font: "Arial", size: 24 }),
              new TextRun({ text: curso, font: "Arial", size: 24 })
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "", spacing: { before: 2000 } }),
          new Paragraph({
            children: [new TextRun({ text: new Date().getFullYear().toString(), font: "Arial", size: 24 })],
            alignment: AlignmentType.CENTER,
          }),
          new PageBreak(),

          // ================= AGRADECIMIENTO =================
          createHeading("AGRADECIMIENTO", HeadingLevel.HEADING_1),
          createParagraph(getDato('agradecimientos') || safeGet(11, 'documento_final', 'agradecimientos')),
          new PageBreak(),

          // ================= DEDICATORIA =================
          createHeading("DEDICATORIA", HeadingLevel.HEADING_1),
          new Paragraph({
            children: [
              new TextRun({
                text: getDato('dedicatoria') || safeGet(11, 'documento_final', 'dedicatoria') || "[Completar]",
                italics: true, font: "Arial", size: 22
              })
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { line: 360 }
          }),
          new PageBreak(),

          // ================= ÍNDICE =================
          createHeading("ÍNDICE", HeadingLevel.HEADING_1),
          new TableOfContents("Índice de Contenidos", {
            hyperlink: true,
            headingStyleRange: "1-3",
          }),
          new PageBreak(),

          // ================= RESUMEN =================
          createHeading("RESUMEN", HeadingLevel.HEADING_1),
          createParagraph("[Completar Resumen en lengua castellana]"),
          createParagraph("[Completar Resumen en lengua originaria]"),
          createParagraph("[Completar Resumen en lengua extranjera]"),
          new PageBreak(),

          // ================= 1. INTRODUCCIÓN =================
          createHeading("1. INTRODUCCIÓN", HeadingLevel.HEADING_1),
          createParagraph(getDato('intro_contexto') || safeGet(11, 'documento_final', 'intro_contexto')),
          createParagraph(getDato('intro_problema') || safeGet(11, 'documento_final', 'intro_problema')),
          createParagraph(getDato('intro_objetivos') || safeGet(11, 'documento_final', 'intro_objetivos')),
          createParagraph(getDato('intro_estructura') || safeGet(11, 'documento_final', 'intro_estructura')),

          // ================= 2. PLANTEAMIENTO =================
          createHeading("2. PLANTEAMIENTO DEL EMPRENDIMIENTO PRODUCTIVO", HeadingLevel.HEADING_1),
          
          createHeading("2.1. Diagnóstico del contexto productivo", HeadingLevel.HEADING_2),
          createParagraph(getDato('diagnostico') || safeGet(7, 'planteamiento', 'diagnostico')),

          createHeading("2.2. Objetivos del emprendimiento productivo", HeadingLevel.HEADING_2),
          createHeading("2.2.1. Objetivo general", HeadingLevel.HEADING_3),
          createParagraph(getDato('objGeneral') || safeGet(7, 'planteamiento', 'objGeneral')),
          
          createHeading("2.2.2. Objetivos específicos", HeadingLevel.HEADING_3),
          createParagraph(getDato('objEspecificos') || safeGet(7, 'planteamiento', 'objEspecificos')),

          createHeading("2.2.3. Misión", HeadingLevel.HEADING_3),
          createParagraph("[Completar Misión]"),

          createHeading("2.2.4. Visión", HeadingLevel.HEADING_3),
          createParagraph("[Completar Visión]"),

          createHeading("2.3. Justificación", HeadingLevel.HEADING_2),
          createParagraph(getDato('justificacion') || safeGet(7, 'planteamiento', 'justificacion') || "[Completar Justificación]"),

          // ================= 3. DESARROLLO =================
          createHeading("3. DESARROLLO DEL EMPRENDIMIENTO PRODUCTIVO", HeadingLevel.HEADING_1),
          
          createHeading("3.1. Localización del emprendimiento", HeadingLevel.HEADING_2),
          createParagraph(`Macro: ${getDato('localizacion_macro') || safeGet(6, 'distribucion', 'macro')}`),
          createParagraph(`Micro: ${getDato('localizacion_micro') || safeGet(6, 'distribucion', 'micro')}`),

          createHeading("3.2. Análisis del mercado", HeadingLevel.HEADING_2),
          
          createHeading("3.2.1. Oferta", HeadingLevel.HEADING_3),
          createParagraph(getDato('oferta') || safeGet(5, 'estrategia_marketing', 'competencia_analisis') || "[Describir competidores y oferta actual]"),

          createHeading("3.2.2. Demanda", HeadingLevel.HEADING_3),
          createParagraph(getDato('demanda') || safeGet(3, 'publico_objetivo', 'tamano_mercado') || "[Describir tamaño de la demanda]"),

          createHeading("3.2.3. Público objetivo (cliente y/o usuario)", HeadingLevel.HEADING_3),
          createParagraph(getDato('publico_objetivo') || safeGet(3, 'publico_objetivo', 'perfil_cliente')),

          createHeading("3.2.4. Entorno y competencia", HeadingLevel.HEADING_3),
          createParagraph(getDato('entorno_competencia') || safeGet(5, 'estrategia_marketing', 'analisis_competencia')),

          createHeading("3.2.5. Ventaja competitiva del emprendimiento", HeadingLevel.HEADING_3),
          createParagraph(getDato('ventaja_competitiva') || safeGet(5, 'estrategia_marketing', 'ventaja_competitiva') || "[Completar Ventaja Competitiva]"),

          createHeading("3.3. Estrategia de promoción y distribución", HeadingLevel.HEADING_2),
          createParagraph(getDato('promocion') || safeGet(5, 'estrategia_marketing', 'promocion') || safeGet(6, 'distribucion', 'canales_fisicos') || "[Detallar estrategias de promoción y canales]"),

          createHeading("3.4. Estructura organizacional", HeadingLevel.HEADING_2),
          createParagraph(getDato('organigrama') || "[Describir el organigrama y roles del equipo]"),

          createHeading("3.5. Diseño de producto o servicio", HeadingLevel.HEADING_2),
          createHeading("3.5.1. Características del producto o servicio", HeadingLevel.HEADING_3),
          createParagraph(getDato('caracteristicas_producto') || safeGet(4, 'diseno_producto', 'caracteristicas') || "[Describir las características físicas o técnicas del producto/servicio]"),

          createHeading("3.6. Análisis y descripción del ciclo de producción o de servicio", HeadingLevel.HEADING_2),
          createParagraph(getDato('ciclo_produccion') || "[Completar fases del proceso de producción o servicio]"),

          // ================= 4. VIABILIDAD Y SOSTENIBILIDAD =================
          createHeading("4. VIABILIDAD Y SOSTENIBILIDAD", HeadingLevel.HEADING_1),
          
          createHeading("4.1. Cálculo de inversiones", HeadingLevel.HEADING_2),
          createHeading("4.1.1. Capital de inversión", HeadingLevel.HEADING_3),
          createParagraph(getDato('capital_inversion') || "[Detallar activos fijos e intangibles adquiridos]"),
          
          createHeading("4.1.2. Capital de operación", HeadingLevel.HEADING_3),
          createParagraph(getDato('capital_operacion') || "[Detallar el efectivo necesario para iniciar operaciones]"),

          createHeading("4.2. Costo de producción", HeadingLevel.HEADING_2),
          createHeading("4.2.1. Cálculo de costos variables", HeadingLevel.HEADING_3),
          createParagraph(getDato('costos_variables') || "[Materia prima, insumos, mano de obra directa]"),
          
          createHeading("4.2.2. Cálculo de costos fijos", HeadingLevel.HEADING_3),
          createParagraph(getDato('costos_fijos') || "[Alquiler, servicios básicos, depreciación]"),

          // ================= 5. RESULTADOS =================
          createHeading("5. RESULTADOS", HeadingLevel.HEADING_1),
          createParagraph(getDato('resultados_mercado') || safeGet(11, 'documento_final', 'resultados_mercado')),
          createParagraph(getDato('resultados_tecnico') || safeGet(11, 'documento_final', 'resultados_tecnico')),
          createParagraph(getDato('resultados_financiero') || safeGet(11, 'documento_final', 'resultados_financiero')),

          // ================= 6. PROYECTO DE VIDA =================
          createHeading("6. PROYECTO DE VIDA", HeadingLevel.HEADING_1),
          createParagraph(getDato('proyecto_vida_proposito') || safeGet(12, 'proyecto_vida', 'proposito_experiencia')),
          createParagraph(getDato('proyecto_vida_metas') || safeGet(12, 'proyecto_vida', 'metaLargo')),

          // ================= 7. CONCLUSIONES Y RECOMENDACIONES =================
          createHeading("7. CONCLUSIONES Y RECOMENDACIONES", HeadingLevel.HEADING_1),
          createParagraph(getDato('conclusiones') || safeGet(11, 'documento_final', 'conclusiones')),
          createParagraph(getDato('recomendaciones') || safeGet(11, 'documento_final', 'recomendaciones')),

          new PageBreak(),

          // ================= BIBLIOGRAFÍA =================
          createHeading("BIBLIOGRAFÍA", HeadingLevel.HEADING_1),
          createParagraph("[Insertar citas y referencias bibliográficas en formato APA]"),

          // ================= ANEXOS =================
          createHeading("ANEXOS", HeadingLevel.HEADING_1),
          createParagraph("[Insertar encuestas, fotos de prototipos, cotizaciones, etc.]")
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('test_full.docx', buffer);
  console.log("Success Full Document");
}

testGen().catch(console.error);
