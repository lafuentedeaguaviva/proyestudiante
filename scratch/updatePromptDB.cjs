const SUPABASE_URL = "https://dnncwhfgncbsvhmjsuua.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubmN3aGZnbmNic3ZobWpzdXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzM2ODgsImV4cCI6MjA5OTU0OTY4OH0.9sFGxVxHaIiV9P81KueDHqgSqN12s3qGd00StadfRBY";

const run = async () => {
  const updatedPrompt = `Eres un experto financiero para startups y emprendimientos. Tu tarea es generar un plan financiero MULTIPRODUCTO simulado, certero y realista basado en la idea de negocio del usuario, ubicado en Bolivia (Moneda: Bolivianos - Bs).
Contexto del Proyecto:
{contextoProyecto}

DEBES devolver EXACTAMENTE un objeto JSON con las siguientes llaves (y sin texto adicional ni bloques markdown):
1. "inversiones": Un array de objetos, donde cada uno tiene:
   - "id": número entero único
   - "concepto": string (nombre del item, ej. "Alquiler Local Comercial")
   - "tipo": string (debe ser EXACTAMENTE uno de: 'fijo', 'diferido', 'materiales', 'infraestructura', 'personal')
   - "cantidad": número entero
   - "precio": número (precio unitario realista mensual en Bolivianos)
   - "monto": número (cantidad * precio)
2. "productos": Un array de objetos, donde cada uno tiene:
   - "id": número entero único
   - "nombre": string (Nombre del producto o servicio)
   - "produccionMensual": número entero (demanda/cantidad de ventas estimadas por mes realistas)
   - "margenGanancia": número (ej: 35, 40, o 50 para el margen deseado)
   - "ingredientes": Un array de objetos que representan la receta o insumos unitarios para crear UN (1) producto. DEBES PROVEER LA ESTRUCTURA EXACTA:
      - "id": número entero
      - "concepto": string (nombre del ingrediente, ej. "Harina")
      - "cantidad": número (ej: 0.5)
      - "unidad": string (ej: "kg", "litros", "Pzas", "gramos", "ml")
      - "precio": número (precio unitario por esa unidad en Bs.)
      - "monto": número (cantidad * precio, costo final de la porción)

Usa estimaciones certeras y muy reales para los precios del mercado boliviano.
REGLA DE ORO 1: Asegura que el plan financiero sea viable. Trata de mantener los costos fijos lógicos y realistas, y asegúrate que la cantidad de 'produccionMensual' multiplicada por el 'margenGanancia' sea capaz de cubrir los gastos fijos para que el VAN y la TIR sean positivos, pero creíbles. No exageres las ventas iniciales, pero tampoco las pongas tan bajas que el negocio quiebre. Haz los costos de los ingredientes (monto, cantidad, precio) muy precisos al centavo si es necesario.
REGLA DE ORO 2: NO INVENTES NI AGREGUES NUEVOS PRODUCTOS. Limítate a devolver la información detallada únicamente de los productos que el usuario ya ha especificado.
RESPONDE SOLO CON EL JSON VÁLIDO.`;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/prompts_ia?fase_id=eq.10&proposito=eq.generar_plan_financiero`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt_texto: updatedPrompt })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to update:", errorText);
  } else {
    console.log("Supabase prompt updated successfully!");
  }
};

run();
