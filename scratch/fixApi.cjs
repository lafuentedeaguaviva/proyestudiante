const fs = require('fs');
const path = require('path');

const filePath = path.join((path.join(__dirname, '..')), 'src/services/api.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the corrupted string
content = content.replace(/e x p o r t .*\} ;/g, '');
content = content.replace(/\u0000/g, ''); // Remove null bytes

// Ensure cobrarEducoin is well formed
if (!content.includes('export const cobrarEducoin = async () => {')) {
  content += `\n
export const cobrarEducoin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para usar la IA.");
  
  const { data, error } = await supabase.rpc('consumir_educoin', { user_id: user.id, amount: 1 });
  if (error) {
    console.error("Error consumiendo educoin:", error);
    if (error.code === '42883') return true; 
  }
  if (data === false) {
    throw new Error("❌ SALDO INSUFICIENTE: No tienes suficientes EduCoins (🪙) para utilizar la Inteligencia Artificial. Contacta a tu Mentor o Administrador para una recarga.");
  }
  return true;
};
`;
}

if (!content.includes('export const recargarEducoins = async')) {
  content += `\n
export const recargarEducoins = async (targetUserId, amount) => {
  try {
    const { data, error } = await supabase.rpc('recargar_educoins', { user_id: targetUserId, amount: amount });
    if (error) {
      const res = await supabase.from('perfiles_usuario').select('educoins').eq('id', targetUserId).single();
      const newAmount = (res.data?.educoins || 0) + amount;
      const { data: updateData, error: updateError } = await supabase.from('perfiles_usuario').update({ educoins: newAmount }).eq('id', targetUserId).select();
      if (updateError) throw updateError;
      return updateData;
    }
    return data;
  } catch (err) {
    console.error('Error al recargar EduCoins:', err);
    throw err;
  }
};
`;
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed api.js');
