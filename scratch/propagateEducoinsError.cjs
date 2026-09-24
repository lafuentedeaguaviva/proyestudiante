const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/services/api.js');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Modificamos cobrarEducoin
const cobrarEducoinOriginal = `export const cobrarEducoin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para usar la IA.");
  
  const { data, error } = await supabase.rpc('consumir_educoin', { user_id: user.id, amount: 10 });
  if (error) {
    console.error("Error consumiendo educoin:", error);
    // Si la función RPC no existe, podemos decidir bloquear o permitir. 
    // Como es un requerimiento estricto, bloqueamos.
    throw new Error("Error interno al consumir EduCoins. Revisa la consola o corre el script SQL.");
  }
  
  if (data !== true) {
    throw new Error("❌ SALDO INSUFICIENTE: No tienes suficientes EduCoins (🪙) para utilizar la Inteligencia Artificial. Contacta a tu Mentor o Administrador para una recarga.");
  }
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('educoin_gastado'));
  }
  return true;
};`;

const cobrarEducoinNew = `export const cobrarEducoin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para usar la IA.");
  
  const { data, error } = await supabase.rpc('consumir_educoin', { user_id: user.id, amount: 10 });
  if (error) {
    console.error("Error consumiendo educoin:", error);
    if (typeof window !== 'undefined') alert("Error interno al consumir EduCoins. Revisa la consola o corre el script SQL.");
    throw new Error("EDUCOINS_ERROR");
  }
  
  if (data !== true) {
    if (typeof window !== 'undefined') alert("❌ SALDO INSUFICIENTE: No tienes suficientes EduCoins (🪙) para utilizar la Inteligencia Artificial. Contacta a tu Mentor o Administrador para una recarga.");
    throw new Error("EDUCOINS_ERROR");
  }
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('educoin_gastado'));
  }
  return true;
};`;

if (content.includes('export const cobrarEducoin = async () => {')) {
  // We'll just replace the function body
  const startIdx = content.indexOf('export const cobrarEducoin = async () => {');
  content = content.substring(0, startIdx) + cobrarEducoinNew;
}

// 2. Modificamos los catch para que relancen el error si es EDUCOINS_ERROR
// We will replace "catch (error) {" with "catch (error) { if (error.message === 'EDUCOINS_ERROR') throw error;"
// Also for "catch (err) {" or "catch (parseError) {"

content = content.replace(/catch \((.*?)\) \{/g, (match, p1) => {
  return `catch (${p1}) { if (${p1}?.message === 'EDUCOINS_ERROR') throw ${p1};`;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log("api.js actualizada para propagar EDUCOINS_ERROR");
