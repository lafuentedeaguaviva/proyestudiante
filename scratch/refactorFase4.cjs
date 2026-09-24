const fs = require('fs');
const path = 'src/pages/Fase4_DisenoProducto.jsx';
let jsx = fs.readFileSync(path, 'utf8');

// 1. Remove imports
jsx = jsx.replace("import Paso5_VideoCaracteristicas from '../components/modos/mentor/fases/CaminoA/Fase4/Paso5_VideoCaracteristicas';\n", "");
jsx = jsx.replace("import Paso8_VideoEmpaque from '../components/modos/mentor/fases/CaminoA/Fase4/Paso8_VideoEmpaque';\n", "");
jsx = jsx.replace("import Paso11_VideoDemandaPotencial from \n'../components/modos/mentor/fases/CaminoA/Fase4/Paso11_VideoDemandaPotencial';\n", "");
jsx = jsx.replace("import Paso11_VideoDemandaPotencial from '../components/modos/mentor/fases/CaminoA/Fase4/Paso11_VideoDemandaPotencial';\n", "");

// 2. Remove step rendering blocks
jsx = jsx.replace(/\{step === 3 && <motion\.div key="3"[\s\S]*?<Paso5_VideoCaracteristicas[\s\S]*?<\/motion\.div>\}/, "");
jsx = jsx.replace(/\{step === 5 && <motion\.div key="5"[\s\S]*?<Paso8_VideoEmpaque[\s\S]*?<\/motion\.div>\}/, "");
jsx = jsx.replace(/\{step === 8 && <motion\.div key="8"[\s\S]*?<Paso11_VideoDemandaPotencial[\s\S]*?<\/motion\.div>\}/, "");

// 3. Shift step numbers
jsx = jsx.replace(/step === 4 && <motion\.div key="4"/g, 'step === 3 && <motion.div key="3"');
jsx = jsx.replace(/step === 6 && <motion\.div key="6"/g, 'step === 4 && <motion.div key="4"');
jsx = jsx.replace(/step === 7 && <motion\.div key="7"/g, 'step === 5 && <motion.div key="5"');
jsx = jsx.replace(/step === 9 && <motion\.div key="9"/g, 'step === 6 && <motion.div key="6"');
jsx = jsx.replace(/step === 10 && <motion\.div key="10"/g, 'step === 7 && <motion.div key="7"');

// 4. Fix logic in handleNext
const oldHandleNext = `  const handleNext = () => {
    if (globalData.tipoNegocio === 'Servicio' && step === 5) {
      siguientePaso(7); // Saltar Empaque
      return;
    }
    if (globalData.tipoNegocio === 'Producto' && step === 6) {
      siguientePaso(8); // Saltar Presentacion Servicio y su video
      return;
    }
    if (globalData.tipoNegocio === 'Servicio' && step === 7) {
      siguientePaso(8); // Ir a Video Demanda Potencial
      return;
    }
    if (globalData.tipoNegocio === 'Producto' && step === 8) {
      siguientePaso(9); // Continuar normal
      return;
    }
    
    siguientePaso(step + 1);
  };`;

const newHandleNext = `  const handleNext = () => {
    if (globalData.tipoNegocio === 'Servicio' && step === 3) {
      siguientePaso(5); // Saltar Empaque
      return;
    }
    if (globalData.tipoNegocio === 'Producto' && step === 4) {
      siguientePaso(6); // Saltar Presentacion Servicio
      return;
    }
    
    siguientePaso(step + 1);
  };`;

jsx = jsx.replace(oldHandleNext, newHandleNext);

// 5. Fix logic in handlePrev
const oldHandlePrev = `  const handlePrev = () => {
    let prevStep = step - 1;
    if (globalData.tipoNegocio === 'Servicio' && step === 7) {
      prevStep = 5;
    }
    if (globalData.tipoNegocio === 'Producto' && step === 8) {
      prevStep = 6;
    }
    irAPaso(Math.max(prevStep, 1));
  };`;

const newHandlePrev = `  const handlePrev = () => {
    let prevStep = step - 1;
    if (globalData.tipoNegocio === 'Servicio' && step === 5) {
      prevStep = 3;
    }
    if (globalData.tipoNegocio === 'Producto' && step === 6) {
      prevStep = 4;
    }
    irAPaso(Math.max(prevStep, 1));
  };`;

jsx = jsx.replace(oldHandlePrev, newHandlePrev);

// 6. Fix SubMenuFases Tabs
const oldTabsFilter = `              tabs={[
                { id: 1, icon: <Video size={18} />, label: 'Video Prod/Serv' },
                { id: 2, icon: <FileText size={18} />, label: 'Concepto' },
                { id: 3, icon: <Video size={18} />, label: 'Video Atributos' },
                { id: 4, icon: <CheckCircle size={18} />, label: 'Caractersticas' },
                { id: 5, icon: <Video size={18} />, label: 'Video Empaque' },
                { id: 6, icon: <Package size={18} />, label: 'Empaque' },
                { id: 7, icon: <Package size={18} />, label: 'Presentacin' },
                { id: 8, icon: <Video size={18} />, label: 'Video Demanda' },
                { id: 9, icon: <Users size={18} />, label: 'Demanda Potencial' },
                { id: 10, icon: <Bot size={18} />, label: 'Resumen IA' }
              ].filter(t => {
                if (globalData.tipoNegocio === 'Servicio' && (t.id === 5 || t.id === 6)) return false;
                if (globalData.tipoNegocio === 'Producto' && t.id === 7) return false;
                return true;
              })}`;

const newTabsFilter = `              tabs={[
                { id: 1, icon: <Video size={18} />, label: 'Video' },
                { id: 2, icon: <FileText size={18} />, label: 'Concepto' },
                { id: 3, icon: <CheckCircle size={18} />, label: 'Características' },
                { id: 4, icon: <Package size={18} />, label: 'Empaque' },
                { id: 5, icon: <Package size={18} />, label: 'Presentación' },
                { id: 6, icon: <Users size={18} />, label: 'Demanda Potencial' },
                { id: 7, icon: <Bot size={18} />, label: 'Resumen IA' }
              ].filter(t => {
                if (globalData.tipoNegocio === 'Servicio' && t.id === 4) return false;
                if (globalData.tipoNegocio === 'Producto' && t.id === 5) return false;
                return true;
              })}`;

jsx = jsx.replace(/tabs=\{\[[\s\S]*?\}\)/, newTabsFilter);

// Replace button condition step < 10 with step < 7
jsx = jsx.replace('{step < 10 && (', '{step < 7 && (');
jsx = jsx.replace('disabled={step === 10 || cargando}', 'disabled={step === 7 || cargando}');

fs.writeFileSync(path, jsx);
console.log('Fase 4 refactored.');
