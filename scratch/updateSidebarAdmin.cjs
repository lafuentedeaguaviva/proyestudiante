const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/components/ui/SidebarFases.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Agregar el state numeroAdmin
if (!content.includes('const [numeroAdmin, setNumeroAdmin]')) {
  content = content.replace(
    'const [loadingMapa, setLoadingMapa] = useState(true);',
    'const [loadingMapa, setLoadingMapa] = useState(true);\n  const [numeroAdmin, setNumeroAdmin] = useState("71541014");'
  );
}

// 2. Extraer de base de datos
const fetchQuery = `
      // Obtener el número de admin
      const configRes = await supabase.from('configuracion_prompts_ia').select('prompt_texto').eq('fase_id', 0).eq('proposito', 'numero_contacto_admin').single();
      if (configRes.data?.prompt_texto) setNumeroAdmin(configRes.data.prompt_texto);
`;
if (!content.includes('numero_contacto_admin')) {
  content = content.replace(
    'setFasesActivas(mapaEstatico);\n      setLoadingMapa(false);',
    fetchQuery + '\n      setFasesActivas(mapaEstatico);\n      setLoadingMapa(false);'
  );
  // Also try CRLF if needed
  content = content.replace(
    'setFasesActivas(mapaEstatico);\r\n      setLoadingMapa(false);',
    fetchQuery + '\r\n      setFasesActivas(mapaEstatico);\r\n      setLoadingMapa(false);'
  );
}

// 3. Modificar la alerta para que muestre numeroAdmin
if (!content.includes('Contacte con el número de WhatsApp')) {
  content = content.replace(
    "onClick={() => alert('Para adquirir más EduCoins, por favor contacta a tu mentor o administrador.')}",
    "onClick={() => alert(`Para adquirir más EduCoins, por favor contacta a tu mentor o administrador. Contacte con el número de celular/WhatsApp: ${numeroAdmin}`)}"
  );
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('SidebarFases actualizada con numeroAdmin');
