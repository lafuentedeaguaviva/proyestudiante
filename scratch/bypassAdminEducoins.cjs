const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/services/api.js');
let content = fs.readFileSync(filePath, 'utf-8');

const targetContent = "const { data, error } = await supabase.rpc('consumir_educoin', { user_id: user.id, amount: 10 });";
const replacementContent = `  // Verificar si es admin para omitir cobro
  const { data: perfilData } = await supabase.from('perfiles_usuario').select('rol').eq('id', user.id).single();
  if (perfilData && perfilData.rol === 'admin') {
    return true; // Los administradores no pagan EduCoins
  }

  const { data, error } = await supabase.rpc('consumir_educoin', { user_id: user.id, amount: 10 });`;

if (content.includes(targetContent)) {
  content = content.replace(targetContent, replacementContent);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("api.js updated correctly");
} else {
  console.log("Target not found");
}
