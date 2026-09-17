const fs = require('fs');
let content = fs.readFileSync('src/pages/Fase6_Distribucion.jsx', 'utf8');

const regex = /const cargarDatos = async \(\) => \{[\s\S]*?cargarDatos\(\);/m;

const newContent = `const cargarDatos = async () => {
      try {
        const guardado = await obtenerContenidoFaseCompleto(6);
        if (guardado && guardado.distribucion) {
          const loadedData = { ...guardado.distribucion };
          // Limpiar datos obsoletos que fueron eliminados de la UI
          delete loadedData.promoCuando;
          delete loadedData.promoQuien;
          
          setData(prev => ({
            ...prev,
            ...loadedData,
            lugares: loadedData.lugares || prev.lugares,
            planDistribucion: loadedData.planDistribucion || prev.planDistribucion,
            presupuesto: loadedData.presupuesto || prev.presupuesto
          }));

          // Recuperar el paso guardado si no viene por URL
          if (guardado.distribucion.paso_actual && !searchParams.get('paso')) {
            const savedStep = parseInt(guardado.distribucion.paso_actual, 10);
            if (!isNaN(savedStep)) {
              setSearchParams({ paso: savedStep > 10 ? 10 : savedStep });
            }
          } else {
            // Aseguramos que la BD sepa que al menos llegamos a este paso
            await guardarContenidoFase(6, 'paso_actual', searchParams.get('paso') ? parseInt(searchParams.get('paso')) : 1).catch(e => console.error(e));
          }
        }
      } catch (error) {
        console.error("Error al cargar datos Fase 6:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();`;

content = content.replace(regex, newContent);
fs.writeFileSync('src/pages/Fase6_Distribucion.jsx', content);
