const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Fase10_PlanFinanciero.jsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /totalPasos=\{18\}[\s\S]*guardando=\{guardando\}/;
const match = content.match(regex);

if (!match) {
  console.log("Could not find layout section");
  process.exit(1);
}

const replacement = `totalPasos={19}
      tabs={[
        { id: 1, icon: <Play size={16} />, label: 'V. Inversión' },
        { id: 2, icon: <Wallet size={16} />, label: 'Cap. Inversión' },
        { id: 3, icon: <Calculator size={16} />, label: 'Recetas y Prod.' },
        { id: 4, icon: <Package size={16} />, label: 'Cap. Trabajo' },
        { id: 5, icon: <Wallet size={16} />, label: 'Resumen' },
        { id: 6, icon: <Play size={16} />, label: 'V. Costos' },
        { id: 7, icon: <Calculator size={16} />, label: 'Costos' },
        { id: 8, icon: <Play size={16} />, label: 'V. Precio Venta' },
        { id: 9, icon: <Calculator size={16} />, label: 'Precio Venta' },
        { id: 10, icon: <Play size={16} />, label: 'V. Proy. Gan' },
        { id: 11, icon: <TrendingUp size={16} />, label: 'Proy. Gan' },
        { id: 12, icon: <Play size={16} />, label: 'V. Gastos' },
        { id: 13, icon: <Wallet size={16} />, label: 'Proy. Gastos' },
        { id: 14, icon: <Play size={16} />, label: 'V. Utilidad' },
        { id: 15, icon: <TrendingUp size={16} />, label: 'Utilidad' },
        { id: 16, icon: <Play size={16} />, label: 'V. Equilibrio' },
        { id: 17, icon: <Calculator size={16} />, label: 'Equilibrio' },
        { id: 18, icon: <Play size={16} />, label: 'V. Evaluación' },
        { id: 19, icon: <TrendingUp size={16} />, label: 'VAN y TIR' }
      ]}
      onTabClick={(id) => {
        setPendingSave(true);
        irAPaso(id);
      }}
      onSiguiente={() => step < 19 ? siguientePaso() : handleFinalizar()}
      onAnterior={step > 1 ? pasoAnterior : null}
      mentorText={
        step === 1 ? "Comprender qué necesitas comprar antes de abrir es vital para no quedarte sin dinero a mitad del camino." :
          step === 2 ? "Usa la caja de herramientas para listar tus activos fijos y diferidos (Capital de Inversión)." :
            step === 3 ? "Define la receta base o estructura de costos por unidad para cada producto." :
              step === 4 ? "Ingresa aquí el capital de trabajo: materia prima (automático), insumos, sueldos y gastos de arranque." :
                step === 5 ? "Aquí puedes ver el resumen total de todo lo que necesitas para arrancar tu negocio." :
                  step === 6 ? "Fijar un precio correcto garantiza que cubras tus costos y generes ganancias." :
                    step === 7 ? "Usa tu costo unitario y define el margen de ganancia ideal para fijar tu precio con y sin factura." :
                      step === 8 ? "Diferenciar entre lo que pagas fijo cada mes y lo que varía según tus ventas es la clave para fijar precios." :
                        step === 9 ? "Clasifica tus costos en fijos y variables para entender tu estructura." :
                          step === 10 ? "Proyectar ganancias te permite ver el futuro financiero de tu negocio." :
                            step === 11 ? "Mira cómo se acumulan tus ganancias proyectadas a lo largo del tiempo." :
                              step === 12 ? "Así como hay ingresos, hay gastos. Proyectarlos es vital." :
                                step === 13 ? "Estima tus gastos fijos y variables a lo largo de los meses." :
                                  step === 14 ? "La utilidad bruta son tus ingresos menos tus costos directos. Aún faltan los impuestos." :
                                    step === 15 ? "Aplica el porcentaje de impuestos de tu país para obtener la verdadera Utilidad Neta." :
                                      step === 16 ? "El punto de equilibrio es tu meta de supervivencia. Descubre qué es." :
                                        step === 17 ? "¡Descubre cuántas unidades necesitas vender al mes solo para no perder dinero!" :
                                          step === 18 ? "El VAN y la TIR son los jueces finales. Determinan si tu idea es un buen negocio." :
                                            "Juega con la tasa de descuento para ver si tu proyecto genera valor a futuro."
      }
      guardando={guardando}`;

content = content.replace(match[0], replacement);

// And update useFase10Controller.js to have totalPasos: 19 instead of 20
const ctrlFile = path.join(__dirname, '../src/controllers/useFase10Controller.js');
let ctrlContent = fs.readFileSync(ctrlFile, 'utf8');
ctrlContent = ctrlContent.replace(/totalPasos: 20/, 'totalPasos: 19');
fs.writeFileSync(ctrlFile, ctrlContent, 'utf8');
fs.writeFileSync(file, content, 'utf8');
console.log("Done");
