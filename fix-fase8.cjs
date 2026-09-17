const fs = require('fs');
let content = fs.readFileSync('d:/estudiante/plataforma-gamificada/src/pages/Fase8_Operacion.jsx', 'utf8');

const corrupted = `    ],
    cuadriculaLayout: Array(36).fill(null), // 6x6 grid
    paso_actual: 1
            if (!isNaN(savedStep)) {
              setSearchParams({ paso: savedStep > 7 ? 7 : savedStep });
            }`;

const fixed = `    ],
    cuadriculaLayout: Array(36).fill(null), // 6x6 grid
    paso_actual: 1
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const guardado = await obtenerContenidoFaseCompleto(8);
        if (guardado && guardado.operacion) {
          const parsedOperacion = typeof guardado.operacion === 'string' ? JSON.parse(guardado.operacion) : guardado.operacion;
          setData(prev => ({
            ...prev,
            ...parsedOperacion
          }));

          // Recuperar el paso guardado si no viene por URL
          if (parsedOperacion.paso_actual && !searchParams.get('paso')) {
            const savedStep = parseInt(parsedOperacion.paso_actual, 10);
            if (!isNaN(savedStep)) {
              setSearchParams({ paso: savedStep > 7 ? 7 : savedStep });
            }`;

content = content.replace(corrupted.replace(/\r\n/g, '\n'), fixed.replace(/\r\n/g, '\n'));
content = content.replace(corrupted, fixed);

fs.writeFileSync('d:/estudiante/plataforma-gamificada/src/pages/Fase8_Operacion.jsx', content);
console.log('Restored chunk in Fase8');
