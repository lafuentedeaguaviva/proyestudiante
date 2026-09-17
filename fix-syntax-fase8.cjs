const fs = require('fs');
let content = fs.readFileSync('d:/estudiante/plataforma-gamificada/src/pages/Fase8_Operacion.jsx', 'utf8');

const corrupted = `  const [data, setData] = useState({
    // Paso 2: Listado de Pasos
    pasosProduccion: [
      { id: 1, texto: '', categoria: null }
      try {
        setGuardando(true);
        await guardarContenidoFase(8, 'operacion', data);
      } catch (error) {
        console.error("Error guardando progreso:", error);
      } finally {
        setGuardando(false);
        setPendingSave(false);
      }
    }, 500);
    return () => clearTimeout(saveTimer);
  }, [data, pendingSave]);`;

const fixed = `  const [data, setData] = useState({
    // Paso 2: Listado de Pasos
    pasosProduccion: [
      { id: 1, texto: '', categoria: null }
    ],
    // Paso 7: Zonas del Layout
    zonas: [
      { id: 'ventas', nombre: 'Ã rea de Ventas', asignado: false },
      { id: 'produccion', nombre: 'Ã rea de Producción', asignado: false },
      { id: 'bodega', nombre: 'Bodega / Almacén', asignado: false }
    ],
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
            }
          } else {
            await guardarContenidoFase(8, 'paso_actual', searchParams.get('paso') ? parseInt(searchParams.get('paso')) : 1).catch(e => console.error(e));
          }
        }
      } catch (error) {
        console.error("Error al cargar datos Fase 8:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Efecto para guardar con debounce y evitar race conditions
  useEffect(() => {
    if (!pendingSave) return;
    const saveTimer = setTimeout(async () => {
      try {
        setGuardando(true);
        await guardarContenidoFase(8, 'operacion', data);
      } catch (error) {
        console.error("Error guardando progreso:", error);
      } finally {
        setGuardando(false);
        setPendingSave(false);
      }
    }, 500);
    return () => clearTimeout(saveTimer);
  }, [data, pendingSave]);`;

// handle windows line endings
content = content.replace(corrupted.replace(/\n/g, '\r\n'), fixed.replace(/\n/g, '\r\n'));
content = content.replace(corrupted, fixed);

fs.writeFileSync('d:/estudiante/plataforma-gamificada/src/pages/Fase8_Operacion.jsx', content);
console.log('Fixed syntax error in Fase8 completely');
