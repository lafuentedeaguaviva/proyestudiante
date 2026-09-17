import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Helper for paragraphs with 1.5 spacing and Arial 11
const createParagraph = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        font: "Arial",
        size: 22, // 11pt * 2
      }),
    ],
    spacing: {
      line: 360, // 1.5 line spacing (240 is single, 360 is 1.5)
    },
    alignment: AlignmentType.JUSTIFIED
  });
};

const createHeading = (text, level) => {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: {
      before: 240,
      after: 120,
    },
  });
};

export const generarDocumentoWord = async (data) => {
  const { userData, ideaGanadora, mercadoData, marcaData, mvpData, costosData } = data;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1417,    // 2.5 cm
              bottom: 1417, // 2.5 cm
              right: 1417,  // 2.5 cm
              left: 1701,   // 3.0 cm
            },
          },
        },
        children: [
          // CARÁTULA SIMULADA
          new Paragraph({
            children: [
              new TextRun({
                text: "PROYECTO DE EMPRENDIMIENTO PRODUCTIVO",
                bold: true,
                font: "Arial",
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 2000, after: 1000 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: marcaData?.nombre || "Mi Emprendimiento",
                bold: true,
                font: "Arial",
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 2000 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Autor: ${userData?.nombre || 'Estudiante'}`, font: "Arial", size: 24 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new PageBreak(),

          // 1. INTRODUCCIÓN
          createHeading("1. INTRODUCCIÓN", HeadingLevel.HEADING_1),
          createParagraph(`El presente proyecto de grado plantea la creación de un emprendimiento productivo denominado "${marcaData?.nombre}", cuyo enfoque principal es: ${ideaGanadora?.texto}. Este documento ha sido estructurado siguiendo la normativa para la obtención del título de Técnico Medio.`),

          // 2. PLANTEAMIENTO
          createHeading("2. PLANTEAMIENTO DEL EMPRENDIMIENTO PRODUCTIVO", HeadingLevel.HEADING_1),
          createHeading("2.1. Diagnóstico del contexto productivo", HeadingLevel.HEADING_2),
          createParagraph(`Mediante la observación del entorno, se identificaron diversas necesidades. Específicamente, se realizó un Análisis FODA que determinó las siguientes fortalezas: ${mercadoData?.foda?.fortalezas.join(', ') || 'recursos locales'}. Asimismo, se detectaron oportunidades como: ${mercadoData?.foda?.oportunidades.join(', ') || 'demanda insatisfecha'}.`),
          
          createHeading("2.2. Objetivos del emprendimiento productivo", HeadingLevel.HEADING_2),
          createHeading("2.2.1. Objetivo general", HeadingLevel.HEADING_3),
          createParagraph(`Desarrollar y comercializar ${mvpData?.coreFeature} para satisfacer la demanda del público objetivo en la región.`),
          
          createHeading("2.2.3. Misión (opcional)", HeadingLevel.HEADING_3),
          createParagraph(`Misión: Bajo el lema "${marcaData?.slogan}", buscamos ofrecer el mejor producto a nuestros clientes.`),

          createHeading("2.3. Justificación", HeadingLevel.HEADING_2),
          createParagraph(`La creación de este proyecto se justifica por la necesidad evidente del mercado de contar con alternativas innovadoras que resuelvan las falencias de los competidores actuales (como ${mercadoData?.competitors}).`),

          // 3. DESARROLLO
          createHeading("3. DESARROLLO DEL EMPRENDIMIENTO PRODUCTIVO", HeadingLevel.HEADING_1),
          createHeading("3.1. Análisis del mercado", HeadingLevel.HEADING_2),
          createHeading("3.1.3 Público objetivo (cliente y/o usuario)", HeadingLevel.HEADING_3),
          createParagraph(`El mercado meta está constituido por: ${mercadoData?.target}.`),
          
          createHeading("3.1.4 Entorno y competencia", HeadingLevel.HEADING_3),
          createParagraph(`Los principales competidores son: ${mercadoData?.competitors}. Su debilidad principal permite nuestra entrada al mercado.`),
          
          createHeading("3.1.5 Ventaja competitiva del emprendimiento", HeadingLevel.HEADING_3),
          createParagraph(`Nuestro diferenciador único es: ${mercadoData?.diferenciador}.`),

          createHeading("3.5. Diseño de producto o servicio", HeadingLevel.HEADING_2),
          createParagraph(`El Producto Mínimo Viable (MVP) consta de: ${mvpData?.coreFeature}. Es un producto que cumple con las características de calidad necesarias para los primeros adoptantes.`),

          // 4. VIABILIDAD
          createHeading("4. VIABILIDAD Y SOSTENIBILIDAD", HeadingLevel.HEADING_1),
          createHeading("4.1. Cálculo de inversiones", HeadingLevel.HEADING_2),
          createParagraph(`Para la puesta en marcha del proyecto, se requiere una inversión inicial de Bs. ${costosData?.inversion?.toFixed(2) || '0.00'}, la cual cubrirá los equipos e insumos necesarios para el primer mes.`),
          
          createHeading("4.2. Costos", HeadingLevel.HEADING_2),
          createParagraph(`Los costos fijos mensuales calculados ascienden a Bs. ${costosData?.fijos?.toFixed(2) || '0.00'}. Los costos variables por unidad producida han sido estimados en Bs. ${costosData?.variables?.toFixed(2) || '0.00'}. Esto demuestra un margen de contribución positivo para la sostenibilidad del negocio.`),

          // 5. CONCLUSIONES
          createHeading("5. CONCLUSIONES Y RECOMENDACIONES", HeadingLevel.HEADING_1),
          createParagraph(`El proyecto de emprendimiento "${marcaData?.nombre}" es técnica y económicamente viable. La fase de validación de mercado demostró que existe una necesidad insatisfecha. Se recomienda iniciar las operaciones productivas a la brevedad posible.`),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Proyecto_Grado_${userData?.nombre || 'Emprendedor'}.docx`);
};
