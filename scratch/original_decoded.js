export const generarYDescargarWord = async (datosTotales, mejoradosConIA = {}) => {
  
  // Safe extraction of data
  const safeGet = (fase, clave, subclave = null) => {
    try {
      const dataFase = datosTotales[fase] ? datosTotales[fase][clave] : null;
      if (!dataFase) return "";
      if (subclave) return dataFase[subclave] || "";
      
      //
<truncated 12096 bytes>
ultados_tecnico') || safeGet(11, 'documento_final', 'resultados_tecnico')),
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

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Proyecto_Emprendimiento_${tituloProyecto.replace(/\\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

The above content shows the entire, complete file contents of the requested file.
"}