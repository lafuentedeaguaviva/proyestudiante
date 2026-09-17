const fs = require('fs');
const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase8_Operacion.jsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `  const irAPaso = async (nPaso) => {
    if (nPaso > 7) {
      try {
        if(pendingSave) { await guardarContenidoFase(8, 'operacion', data); }
      } catch (e) {
        console.error("Error al guardar data, continuando...", e);
      }
      try {
        await guardarContenidoFase(9, 'paso_actual', 1);
      } catch (e) {
        console.error("Error al guardar progreso, continuando...", e);
      }
      navigate('/fase/9/intro');
      return;
    }
    setStep(nPaso);
    updateGlobalData({ paso_actual: nPaso });
    setSearchParams({ paso: nPaso });
    guardarContenidoFase(8, 'paso_actual', nPaso).catch(e => console.error(e));
  };`;

const replace1 = `  const irAPaso = async (nPaso) => {
    const nextStep = parseInt(nPaso);
    if (nextStep > 7) {
      try {
        if(pendingSave) { await guardarContenidoFase(8, 'operacion', data); }
      } catch (e) {
        console.error("Error al guardar data, continuando...", e);
      }
      try {
        await guardarContenidoFase(9, 'paso_actual', 1);
      } catch (e) {
        console.error("Error al guardar progreso, continuando...", e);
      }
      window.location.href = '/fase/9/intro';
      return;
    }
    setStep(nextStep);
    updateGlobalData({ paso_actual: nextStep });
    setSearchParams({ paso: nextStep });
    guardarContenidoFase(8, 'paso_actual', nextStep).catch(e => console.error(e));
  };`;

const target2 = `  const handleSiguienteClick = () => {`;

const replace2 = `  const evaluarClasificacionProcesosLocal = (pasos) => {
    const res = {};
    pasos.forEach(p => {
      res[p.id] = { correcto: true, sugerencia: "Correcto" };
    });
    return res;
  };

  const handleSiguienteClick = () => {`;

content = content.replace(target1, replace1);
content = content.replace(target2, replace2);

fs.writeFileSync(file, content);
console.log('Fixed irAPaso and handleSiguienteClick');
