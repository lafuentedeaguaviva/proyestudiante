const fs = require('fs');
const path = require('path');

// 1. Update useFase1Logic.js to save the name in localStorage
const hookPath = path.join(__dirname, '..', 'src/hooks/useFase1Logic.js');
let hookContent = fs.readFileSync(hookPath, 'utf-8');
const hookRegex = /await actualizarTituloProyecto\(nombre, proyecto_id\)\.catch\(err => console\.error\("Error guardando titulo:", err\)\);/g;
if(hookContent.match(hookRegex)) {
  hookContent = hookContent.replace(hookRegex, `await actualizarTituloProyecto(nombre, proyecto_id).catch(err => console.error("Error guardando titulo:", err));
          localStorage.setItem('temp_proyecto_nombre', nombre);
          window.dispatchEvent(new Event('proyectoNombreActualizado'));`);
  fs.writeFileSync(hookPath, hookContent, 'utf-8');
  console.log("Updated useFase1Logic.js");
}

// 2. Update SidebarFases.jsx to show the project name
const sidebarPath = path.join(__dirname, '..', 'src/components/ui/SidebarFases.jsx');
let sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

if (!sidebarContent.includes('temp_proyecto_nombre')) {
  // Add state and effect
  const effectCode = `
    const [maxPasoFaseActual, setMaxPasoFaseActual] = useState(1);
    const [proyectoNombre, setProyectoNombre] = useState(localStorage.getItem('temp_proyecto_nombre') || 'Mi Proyecto');

    useEffect(() => {
      const handleNombre = () => setProyectoNombre(localStorage.getItem('temp_proyecto_nombre') || 'Mi Proyecto');
      window.addEventListener('proyectoNombreActualizado', handleNombre);
      return () => window.removeEventListener('proyectoNombreActualizado', handleNombre);
    }, []);
`;
  sidebarContent = sidebarContent.replace(/const \[maxPasoFaseActual, setMaxPasoFaseActual\] = useState\(1\);.*?(?=\n\s*useEffect\()/s, effectCode);

  // Replace "Mapa del Proyecto" with the actual project name
  sidebarContent = sidebarContent.replace(
    /<h2 style=\{\{ margin: 0, fontSize: '1\.25rem', color: theme\.textMain \}\}>Mapa del Proyecto<\/h2>/,
    `<h2 style={{ margin: 0, fontSize: '1.15rem', color: theme.textMain, maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={proyectoNombre}>{proyectoNombre}</h2>`
  );
  
  fs.writeFileSync(sidebarPath, sidebarContent, 'utf-8');
  console.log("Updated SidebarFases.jsx");
}

// 3. Update Fase13_DocumentoIA.jsx to pass project name to Word generator
const f13Path = path.join(__dirname, '..', 'src/pages/Fase13_DocumentoIA.jsx');
let f13Content = fs.readFileSync(f13Path, 'utf-8');

if (!f13Content.includes('const nombreProyecto =')) {
  f13Content = f13Content.replace(/setEstadoIA\('Formateando el documento Word\.\.\.'\);/, `setEstadoIA('Formateando el documento Word...');\n      const nombreProyecto = localStorage.getItem('temp_proyecto_nombre') || 'Proyecto_Final_Emprendimiento';`);
  
  f13Content = f13Content.replace(/await generarYDescargarWord\(datosTotales, mejorados, imagenesBase64, perfilUsuario\);/g, `await generarYDescargarWord(datosTotales, mejorados, imagenesBase64, perfilUsuario, nombreProyecto);`);
  
  f13Content = f13Content.replace(/generarYDescargarWord\(datosListos, mejoradosListos, imagenesListas, perfilListo\)/g, `generarYDescargarWord(datosListos, mejoradosListos, imagenesListas, perfilListo, localStorage.getItem('temp_proyecto_nombre') || 'Proyecto_Final_Emprendimiento')`);
  
  fs.writeFileSync(f13Path, f13Content, 'utf-8');
  console.log("Updated Fase13_DocumentoIA.jsx");
}

// 4. Update docxGenerator.js to accept project name and use it for the file name
const docxPath = path.join(__dirname, '..', 'src/lib/docxGenerator.js');
let docxContent = fs.readFileSync(docxPath, 'utf-8');

if (!docxContent.includes('proyectoNombre = "Proyecto_Final"')) {
  docxContent = docxContent.replace(/export const generarYDescargarWord = async \(datosTotales, datosMejorados, imagenesBase64, perfilUsuario\) => \{/, `export const generarYDescargarWord = async (datosTotales, datosMejorados, imagenesBase64, perfilUsuario, proyectoNombre = "Proyecto_Final") => {`);
  
  docxContent = docxContent.replace(/a\.download = "Proyecto_Final_Emprendimiento\.docx";/g, `a.download = \`\${proyectoNombre.replace(/[^a-z0-9]/gi, '_')}.docx\`;`);
  
  fs.writeFileSync(docxPath, docxContent, 'utf-8');
  console.log("Updated docxGenerator.js");
}
