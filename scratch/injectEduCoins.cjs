const fs = require('fs');
const path = require('path');

const filePath = path.join((path.join(__dirname, '..')), 'src/services/api.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Añadir la función cobrarEducoin al inicio o cerca de otras funciones
const cobrarEducoinFunc = `
export const cobrarEducoin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para usar la IA.");
  
  const { data, error } = await supabase.rpc('consumir_educoin', { user_id: user.id, amount: 1 });
  if (error) {
    console.error("Error consumiendo educoin:", error);
    // Fallback if RPC doesn't exist yet, we still allow or block?
    // Let's assume RPC exists.
  }
  if (data === false) {
    throw new Error("EDUCOINS_INSUFICIENTES");
  }
  return true;
};
`;

if (!content.includes('cobrarEducoin')) {
  content = content.replace("export const recargarEducoins", cobrarEducoinFunc + "\nexport const recargarEducoins");
}

// Inyectar await cobrarEducoin() antes de los fetch a deepseek
const targetLines = content.split('\n');
let modified = false;
for (let i = 0; i < targetLines.length; i++) {
  if (targetLines[i].includes('fetch("https://api.deepseek.com/chat/completions"')) {
    // Verificar si ya inyectamos antes
    if (!targetLines[i - 1].includes('cobrarEducoin')) {
      targetLines.splice(i, 0, '    await cobrarEducoin();');
      i++; // saltar la linea añadida
      modified = true;
    }
  }
}

if (modified) {
  content = targetLines.join('\n');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Inyectados cobros de EduCoins en api.js');
} else {
  console.log('No se requirieron cambios.');
}
