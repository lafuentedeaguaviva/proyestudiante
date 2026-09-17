import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, AlertCircle, ChevronLeft, ChevronRight, MessageSquare, LayoutDashboard, LogOut, Code, Database, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { guardarPromptIA } from '../services/api';

const DEFAULT_PROMPTS = [
  {
    fase_id: 1,
    proposito: 'generar_ideas',
    prompt_texto: 'Eres un mentor experto en innovación y emprendimiento. Tu objetivo es generar ideas de negocio creativas y viables.\n\nAquí está el contexto del problema que el emprendedor ha investigado:\n- Área del proyecto: {area}\n- El Problema: {frase_problema}\n- Lo que usan actualmente: {solucionActual}\n- Por qué falla lo actual (Fricción): {friccion}\n- Lo que realmente desean (Solución Ideal): {solucionIdeal}\n\nBasado en esta información, genera 5 ideas de negocio variadas (pueden ser apps, servicios o productos físicos) que eliminen la fricción actual, entreguen la solución ideal y estén dentro del área del proyecto.\n\nResponde ÚNICAMENTE con un array JSON de 5 strings concisos que describan la idea de negocio. \nEjemplo de formato: ["Suscripción semanal de viandas saludables para la universidad", "Máquina expendedora de comida caliente nutritiva", "App de delivery estudiantil"]'
  },
  {
    fase_id: 1,
    proposito: 'generar_resumen_fase1',
    prompt_texto: 'La idea ganadora (solución) es: "{ideaGanadora}". El protagonista al que va dirigida es: "{protagonista}". Su dolor principal (problema) es: "{dolor}". Genera un texto muy corto, directo y conciso (máximo 15 palabras por campo) para cada propiedad del JSON.'
  },
  {
    fase_id: 1,
    proposito: 'generar_nombres',
    prompt_texto: 'Eres un experto en branding. Genera 5 opciones de nombres creativos, memorables y comerciales para el siguiente proyecto:\n\n- Idea ganadora: {ideaGanadora}\n- Problema a resolver: {dolor}\n- Público objetivo: {protagonista}\n\nResponde ÚNICAMENTE con un array JSON de 5 strings.'
  },
  {
    fase_id: 1,
    proposito: 'generar_pitch',
    prompt_texto: 'La idea ganadora del proyecto es: "{ideaGanadora}". El protagonista al que va dirigida es: "{protagonista}". El contexto es: "{contexto}". Su dolor principal es: "{dolor}". La tarea que intentan realizar es: "{tarea}". La fricción de su solución actual es: "{friccion}". La solución propuesta se llama: "{nombreElegido}". Genera un "Discurso de Presentación (Pitch)" breve, persuasivo y motivacional de no más de 3 oraciones que resuma cómo esta idea ganadora resuelve su problema. No uses explicaciones adicionales, solo devuelve el texto del pitch.'
  },
  {
    fase_id: 7,
    proposito: 'generar_diagnostico',
    prompt_texto: 'Eres un experto en formulación y redacción de proyectos de emprendimiento educativo. Tu tarea es ayudar a redactar el Diagnóstico del Contexto Productivo basándote en la siguiente información recopilada del estudiante:\n\n- Idea de Negocio / Solución: {idea}\n- Problema o Necesidad Principal: {problema}\n- Público Objetivo: {publico}\n- Ubicación / Entorno: {ubicacion}\n- Beneficios de la Solución: {beneficios}\n\nEl estudiante ha seleccionado la siguiente estructura de diagnóstico: "{estructura}".\n\nGenera un JSON estrictamente válido que contenga 5 propiedades. Cada propiedad corresponde a los siguientes párrafos (sigue estrictamente estas instrucciones para cada párrafo):\n{campos}\n\nInstrucciones vitales:\n1. Redacta un solo párrafo conciso (3-4 oraciones) para cada campo basándote en su descripción.\n2. Utiliza un tono académico, formal y en tercera persona.\n3. Asegúrate de utilizar conectores lógicos variados y fluidos entre oraciones para evitar la repetición y enriquecer la redacción.\n4. Conecta lógicamente el problema con la ubicación y el público.\n5. NUNCA inicies ni utilices la frase "En conclusión" o similares en el último párrafo.\n6. Devuelve ÚNICAMENTE el JSON, sin texto adicional antes o después.'
  },
  {
    fase_id: 10,
    proposito: 'generar_plan_financiero',
    prompt_texto: 'Eres un experto financiero para startups y emprendimientos. Tu tarea es generar un plan financiero simulado y realista basado en la idea de negocio del usuario.\nContexto del Proyecto:\n{contextoProyecto}\n\nDEBES devolver EXACTAMENTE un objeto JSON con las siguientes llaves (y sin texto adicional, sin formato markdown):\n1. "inversiones": Un array de objetos, donde cada uno tiene:\n   - "concepto": string (nombre del item, ej. "Máquina de coser")\n   - "tipo": string (debe ser EXACTAMENTE uno de: \'activoFijo\', \'activoDiferido\', \'materiales\', \'infraestructura\', \'personal\')\n   - "cantidad": número entero\n   - "precio": número (precio unitario en moneda local)\n   - "monto": número (cantidad * precio)\n2. "precios": Un objeto con:\n   - "precioSinFactura": número\n   - "precioFacturado": número\n   - "porcentajeGanancia": número\n3. "proyecciones": Un array de exactamente 6 objetos (para 6 meses), donde cada uno tiene:\n   - "ingresos": número\n   - "gastos": número\n   - "utilidad": número (ingresos - gastos)\n4. "puntoEquilibrio": número entero (unidades estimadas para no perder ni ganar).\n\nUsa estimaciones lógicas y realistas para el tipo de negocio. RESPONDE SOLO CON EL JSON VÁLIDO.'
  },
  {
    fase_id: 2,
    proposito: 'generar_resumen_encuestas',
    prompt_texto: 'Eres un analista experto de estudios de mercado. A continuación recibirás un JSON con las respuestas de encuestas de validación de un producto/servicio. Tu tarea es analizar estas respuestas y devolver un JSON estricto con las siguientes 10 claves exactas:\n- "demografia": (string) Edad promedio, género predominante y zona de residencia más común.\n- "buyer_persona": (string) Pequeña redacción describiendo al cliente ideal basado en las respuestas.\n- "publico_objetivo_resumido": (string) Resume el público objetivo en máximo 5 palabras (mejor si son 2 o 3, ej: "Jóvenes universitarios", "Amas de casa").\n- "precio_sugerido": (string) Análisis de ingresos y rango de precio recomendado.\n- "frecuencia": (string) Frecuencia estimada de consumo/compra.\n- "educacion": (string) Nivel de educación u ocupación dominante y tono sugerido para hablarles.\n- "dolores": (string) Principales problemas o pain points urgentes que intentan resolver.\n- "canales": (string) Medios por donde preferirían comprar o enterarse del producto.\n- "decision": (string) Factores que valoran más al momento de la compra (calidad, precio, etc.).\n- "conclusion": (string) Pequeño veredicto de 1-2 oraciones indicando si la idea tiene potencial real.\n\nResponde ÚNICAMENTE con el objeto JSON, sin formato markdown.'
  },
  {
    fase_id: 4,
    proposito: 'generar_resumen_fase4',
    prompt_texto: 'Eres un Mentor de Emprendimiento nivel experto. Un emprendedor acaba de terminar la Fase 4 (Diseño de Producto o Servicio).\n\nInformación ingresada por el emprendedor:\n- Tipo de Negocio: {tipoNegocio}\n- Producto/Servicio: {nomProd}\n- Funcionalidad (Para qué sirve): {paraQueSirve}\n- Características Técnicas: {caracteristicasTecnicas}\n- Beneficios: {beneficios}\n- Empaque/Presentación: {disenoEmpaque}\n- Demanda (Clientes mensuales estimados): {calculoMensual}\n\nREGLA DE ORO: SIEMPRE DEBES REDACTAR EN POSITIVO, MEJORANDO TODO LO QUE EL EMPRENDEDOR ESCRIBIÓ.\nREGLA DE ORO 2: REDACTA TODO EN PRIMERA PERSONA (plural o singular, ej: "Nuestro proyecto", "Ofrecemos", "Mi producto"). El texto debe sonar como si el propio emprendedor lo estuviera presentando.\nNUNCA debes decir "no está definido", "falta detallar" o "no se especificó". Si falta información, DEBES INVENTARLA o ASUMIRLA de forma lógica basándote en el nombre del producto o el contexto del proyecto. Actúa como si el proyecto ya fuera un éxito y redacta de manera asertiva y convincente.\n\nIMPORTANTE: DEBES responder EXCLUSIVAMENTE con un objeto JSON (sin formato Markdown adicional, ni ```json) que contenga exactamente estas 5 propiedades (tipo string, de 2 a 3 líneas cada una):\n{\n  "resumen_concepto": "Concepto y funcionalidad del servicio/producto (MEJORADO Y EN POSITIVO).",\n  "resumen_ventaja": "Los beneficios redactados en base a las características del producto, pero de forma MUY MEJORADA y comercial.",\n  "resumen_empaque": "La estrategia de empaque o presentación del servicio, redactada de forma MEJORADA, creativa y en positivo.",\n  "resumen_demanda": "La viabilidad del negocio explicada utilizando LOS DATOS DE DEMANDA MENSUAL ingresados, redactada en positivo demostrando que es viable.",\n  "recomendacion_estrategica": "Un consejo experto para potenciar su diseño."\n}'
  },
  {
    fase_id: 5,
    proposito: 'generar_resumen_marketing',
    prompt_texto: 'Eres un estratega de marketing experto (Director de Marketing). A partir de los datos crudos proporcionados por un emprendedor, redacta un resumen directivo y estratégico de su plan de marketing.\n\nDatos de la Estrategia de Marketing:\nCompetidores identificados: {compNombres}.\nVentaja competitiva (Frase poderosa): {ventaja}.\nEntorno clave - Político: {entornoPol}. Económico: {entornoEco}.\nPromoción - Canales: {promoCan}. Mensaje: {promoMensaje}.\n\nREGLA DE ORO: REDACTA TODO EN PRIMERA PERSONA (plural o singular, ej: "Nuestro proyecto", "Ofrecemos", "Mi estrategia"). El texto debe sonar como si el propio emprendedor estuviera presentando y defendiendo su plan ante inversores.\nResponde ÚNICAMENTE con un objeto JSON con las claves "resumen_competencia", "resumen_ventaja", "resumen_entorno", "resumen_promocion" y "recomendacion_estrategica". Cada valor debe ser un texto conciso, profesional y persuasivo de no más de 3 oraciones. No uses markdown de bloques de código, solo el JSON puro.'
  },
  {
    fase_id: 6,
    proposito: 'generar_resumen_fase6',
    prompt_texto: 'Eres un Mentor de Emprendimiento experto en Logística. El emprendedor acaba de terminar la Fase 6 (Localización y Distribución).\n\nInformación ingresada:\n- Producción: {dondeProducir}\n- Almacenamiento: {dondeAlmacenar}\n- Modalidad de Venta: {distComoVender}\n- Lugares Evaluados: {lugares}\n- Métodos de Pago: {comoRecibirPago}\n- Plan de Acción: {planDistribucion}\n- Presupuesto Total: Bs. {presupuestoTotal}\n\nGenera un resumen profesional, alentador y ejecutivo evaluando su estrategia.\n\nREGLA DE ORO: REDACTA TODO EN PRIMERA PERSONA (plural o singular, ej: "Nuestro proyecto", "Distribuiremos", "Mi plan"). El texto debe sonar como si el propio emprendedor estuviera presentando su logística a inversores.\n\nIMPORTANTE: DEBES responder EXCLUSIVAMENTE con un objeto JSON (sin formato Markdown adicional, ni ```json) que contenga exactamente estas 5 propiedades (tipo string, de 2 a 3 líneas cada una):\n{\n  "resumen_ubicacion": "Análisis de las ventajas/desventajas del lugar físico elegido.",\n  "resumen_canales": "Eficiencia de los canales de venta y métodos de pago.",\n  "resumen_plan": "Revisión sobre la factibilidad del plan de acción logístico.",\n  "resumen_presupuesto": "Evaluación de los costos asociados a la distribución.",\n  "recomendacion_logistica": "Un consejo experto para optimizar la cadena de entrega o distribución."\n}'
  }
];

const AdminPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('prompts');
  const [qrUrl, setQrUrl] = useState('');
  const [limiteIA, setLimiteIA] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts_ia')
        .select('*')
        .order('fase_id', { ascending: true });
      
      if (error) throw error;
      
      // Combinar los prompts por defecto con los que ya existan en la BD
      const mergedPrompts = DEFAULT_PROMPTS.map(defaultP => {
        const dbPrompt = data?.find(p => p.fase_id === defaultP.fase_id && p.proposito === defaultP.proposito);
        return dbPrompt ? dbPrompt : defaultP;
      });
      
      const qrConfig = data?.find(p => p.fase_id === 0 && p.proposito === 'qr_pago_url');
      if (qrConfig) setQrUrl(qrConfig.prompt_texto);

      const limiteConfig = data?.find(p => p.fase_id === 0 && p.proposito === 'ia_limite_intentos');
      if (limiteConfig) setLimiteIA(parseInt(limiteConfig.prompt_texto, 10));

      setPrompts(mergedPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      setMessage({ text: `Error de BD: ${error.message || error.details || 'Revisa la consola'}`, type: 'error' });
      // Si falla la BD, al menos mostrar los por defecto
      setPrompts(DEFAULT_PROMPTS);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptChange = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index].prompt_texto = value;
    setPrompts(newPrompts);
  };
  
  const handleRestoreDefault = (index) => {
    const prompt = prompts[index];
    const defaultP = DEFAULT_PROMPTS.find(p => p.fase_id === prompt.fase_id && p.proposito === prompt.proposito);
    if (defaultP) {
      const newPrompts = [...prompts];
      newPrompts[index].prompt_texto = defaultP.prompt_texto;
      setPrompts(newPrompts);
      setMessage({ text: `Prompt ${prompt.proposito} restaurado al valor por defecto (recuerda guardar)`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleSave = async (prompt) => {
    try {
      await guardarPromptIA(prompt.fase_id, prompt.proposito, prompt.prompt_texto);
      setMessage({ text: `Prompt para ${prompt.proposito} guardado exitosamente`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: `Error al guardar: ${error.message}`, type: 'error' });
    }
  };

  const handleSaveQr = async () => {
    try {
      await guardarPromptIA(0, 'qr_pago_url', qrUrl);
      await guardarPromptIA(0, 'ia_limite_intentos', limiteIA.toString());
      setMessage({ text: `Configuración guardada exitosamente`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: `Error al guardar: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden' }}>
      
      {/* Sidebar Colapsable */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ 
          backgroundColor: '#0f172a', 
          borderRight: '1px solid #1e293b', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #1e293b', minHeight: '80px' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '0.5rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={24} color="white" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{ fontWeight: 800, fontSize: '1.2rem', whiteSpace: 'nowrap', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ 
            position: 'absolute', top: '24px', right: '-12px', width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 10px rgba(59,130,246,0.5)', zIndex: 20
          }}
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <nav style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', onClick: () => navigate('/dashboard') },
            { id: 'prompts', icon: <MessageSquare size={20} />, label: 'Prompts IA' },
            { id: 'config', icon: <Settings size={20} />, label: 'Configuración' },
            { id: 'database', icon: <Database size={20} />, label: 'Base de Datos' },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => { if(item.onClick) item.onClick(); else setActiveTab(item.id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer',
                background: activeTab === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                borderRight: activeTab === item.id ? '3px solid #3b82f6' : '3px solid transparent',
                color: activeTab === item.id ? '#60a5fa' : '#94a3b8',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { if(activeTab !== item.id) e.currentTarget.style.color = '#f8fafc'; }}
              onMouseLeave={(e) => { if(activeTab !== item.id) e.currentTarget.style.color = '#94a3b8'; }}
            >
              {item.icon}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #1e293b' }}>
          <div 
            onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: '#ef4444', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
          >
            <LogOut size={20} />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>Cerrar Sesión</motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: '1px solid #1e293b', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(10px)' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
              {activeTab === 'prompts' ? 'Gestión de Prompts' : 'Configuración Global'}
            </h1>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
              {activeTab === 'prompts' ? 'Ajusta las instrucciones maestras para el motor de IA.' : 'Ajustes generales de la plataforma.'}
            </p>
          </div>
        </header>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            <AnimatePresence>
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  style={{ 
                    padding: '1rem 1.5rem', marginBottom: '2rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500,
                    background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                    border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, 
                    color: message.type === 'error' ? '#fca5a5' : '#6ee7b7' 
                  }}
                >
                  <AlertCircle size={20} />
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#94a3b8', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #3b82f6', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                <span>Cargando configuración...</span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : activeTab === 'prompts' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {prompts.map((prompt, index) => (
                  <motion.div 
                    key={`${prompt.fase_id}-${prompt.proposito}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ background: '#0f172a', padding: '2rem', borderRadius: '1rem', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                          <Code size={24} color="#60a5fa" />
                        </div>
                        <div>
                          <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>Fase {prompt.fase_id}</span>
                            <span style={{ color: '#3b82f6' }}>/</span>
                            {prompt.proposito}
                          </h2>
                          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 0 0', fontFamily: 'monospace' }}>
                            Vars: {prompt.proposito === 'generar_pitch' ? '{protagonista}, {contexto}, {dolor}, {tarea}, {friccion}, {ideaGanadora}, {nombreElegido}' : '{area}, {frase_problema}, {solucionIdeal}...'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => handleRestoreDefault(index)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <RotateCcw size={18} /> Restaurar
                        </button>
                        <button 
                          onClick={() => handleSave(prompt)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)'; }}
                        >
                          <Save size={18} /> Guardar Cambios
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={prompt.prompt_texto}
                        onChange={(e) => handlePromptChange(index, e.target.value)}
                        style={{
                          width: '100%',
                          minHeight: '200px',
                          padding: '1.25rem',
                          background: '#020617',
                          border: '1px solid #334155',
                          borderRadius: '0.75rem',
                          color: '#cbd5e1',
                          fontSize: '1rem',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          lineHeight: '1.6',
                          resize: 'vertical',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#334155'}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ background: '#0f172a', padding: '2rem', borderRadius: '1rem', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                        <Settings size={24} color="#10b981" />
                      </div>
                      <div>
                        <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          Muro de Pago (QR) y Límites
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>
                          Configura la URL del código QR y el límite de usos de Inteligencia Artificial por proyecto.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleSaveQr}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.3)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.2)'; }}
                    >
                      <Save size={18} /> Guardar Configuración
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>URL del Código QR</label>
                    <input
                      type="text"
                      placeholder="https://ejemplo.com/mi-qr.png"
                      value={qrUrl}
                      onChange={(e) => setQrUrl(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#020617',
                        border: '1px solid #334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#10b981'}
                      onBlur={(e) => e.target.style.borderColor = '#334155'}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>Límite de usos de IA por Proyecto</label>
                    <input
                      type="number"
                      min="1"
                      value={limiteIA}
                      onChange={(e) => setLimiteIA(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#020617',
                        border: '1px solid #334155',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#10b981'}
                      onBlur={(e) => e.target.style.borderColor = '#334155'}
                    />
                  </div>
                  {qrUrl && (
                    <div style={{ padding: '1rem', background: '#020617', borderRadius: '0.5rem', border: '1px dashed #334155', display: 'flex', justifyContent: 'center' }}>
                      <img src={qrUrl} alt="Vista previa QR" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPrompts;

