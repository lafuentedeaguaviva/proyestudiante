const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('prompts_ia')
    .select('*')
    .eq('fase_id', 10)
    .eq('proposito', 'generar_plan_financiero')
    .single();

  if (error) {
    console.log("Error or not found:", error);
    return;
  }

  console.log("Current prompt:", data.prompt_texto);
  
  const updatedPrompt = `Eres un experto financiero para startups y emprendimientos. Tu tarea es generar un plan financiero simulado y realista basado en la idea de negocio del usuario.
Contexto del Proyecto:
{contextoProyecto}

DEBES devolver EXACTAMENTE un objeto JSON con las siguientes llaves (y sin texto adicional, sin formato markdown):
1. "inversiones": Un array de objetos, donde cada uno tiene:
   - "concepto": string (nombre del item, ej. "Máquina de coser")
   - "tipo": string (debe ser EXACTAMENTE uno de: 'fijo', 'diferido', 'materiales', 'infraestructura', 'personal')
   - "cantidad": número entero
   - "precio": número (precio unitario en moneda local)
   - "monto": número (cantidad * precio)
2. "precios": Un objeto con:
   - "precioSinFactura": número
   - "precioFacturado": número
   - "porcentajeGanancia": número
3. "proyecciones": Un array vacío (ya no es necesario, el sistema las calcula dinámicamente).
4. "puntoEquilibrio": 0 (el sistema lo calcula).
5. "produccionMensual": número entero (cantidad inicial de unidades/servicios al mes).
6. "porcentajeGanancia": número (ej: 30).

Usa estimaciones lógicas y realistas para el tipo de negocio.
REGLA DE ORO: Asegura que el plan financiero sea siempre viable y muy rentable.
Ten en cuenta que el sistema calculará las proyecciones automáticamente aplicando un crecimiento mensual del 13% en ventas y un 16% de descuento por impuestos sobre los ingresos.
Ajusta la 'produccionMensual', los 'precios' (altos) y las 'inversiones' (bajas/moderadas) para garantizar que, con esos descuentos, el VAN sea positivo y la TIR supere el 13% mensual.
RESPONDE SOLO CON EL JSON VÁLIDO.`;

  const { error: updateError } = await supabase
    .from('prompts_ia')
    .update({ prompt_texto: updatedPrompt })
    .eq('id', data.id);
    
  if (updateError) {
    console.error("Update error:", updateError);
  } else {
    console.log("Prompt updated successfully in database!");
  }
}

main();
