import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, AlertCircle, ChevronLeft, ChevronRight, MessageSquare, LayoutDashboard, LogOut, Database, Users, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { guardarPromptIA, cerrarSesion } from '../services/api';
import { useAuth } from '../context/AuthContext';

import PromptsTab from '../components/admin/PromptsTab';
import UsersTab from '../components/admin/UsersTab';
import VideosTab from '../components/admin/VideosTab';
import SettingsTab from '../components/admin/SettingsTab';
import VersiculosTab from '../components/admin/VersiculosTab';

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
  },
  {
    fase_id: 7,
    proposito: 'generar_resumen_fase',
    prompt_texto: 'Eres un experto en formulación de proyectos de emprendimiento educativo. Tu tarea es MEJORAR y COMPLETAR los 5 componentes del planteamiento de un proyecto emprendedor, siempre redactados en PRIMERA PERSONA (usando "nosotros" o "yo"), con tono formal y académico.\n\nDATOS DEL PROYECTO:\n- Producto/Servicio: {idea}\n- Problema que resuelve: {problema}\n- Solución propuesta: {solucion}\n- Público objetivo: {publico}\n- Ubicación: {ubicacion}\n- Justificación Social: {just_social}\n- Justificación Económica: {just_economica}\n- Justificación Personal: {just_personal}\n\nCONTENIDO ACTUAL (puede estar incompleto o vacío, debes completarlo o mejorarlo):\n- Diagnóstico actual: {diagnostico_actual}\n- Objetivo General actual: {objetivo_general_actual}\n- Objetivos Específicos actuales: {objetivos_especificos_actuales}\n- Misión actual: {mision_actual}\n- Visión actual: {vision_actual}\n\nINSTRUCCIONES VITALES:\n1. Si un campo está VACÍO, créalo desde cero usando los datos del proyecto.\n2. Si un campo tiene contenido, MEJÓRALO, hazlo más fluido, formal y completo.\n3. El "diagnostico_final" debe ser un texto en prosa de 3-4 párrafos en primera persona.\n4. El "objetivo_general" debe iniciar con un verbo en infinitivo y ser una sola oración completa.\n5. Los "objetivos_especificos" deben ser 4 objetivos numerados, cada uno empezando con un verbo en infinitivo.\n6. La "mision" debe ser 1-2 oraciones que respondan: ¿Quiénes somos? ¿Qué hacemos? ¿Para quién? ¿Por qué?\n7. La "vision" debe ser 1-2 oraciones proyectadas al futuro (3-5 años).\n8. NUNCA uses "no definido", "no completado" ni frases genéricas.\n\nDevuelve ÚNICAMENTE un JSON válido con esta estructura exacta:\n{\n  "diagnostico_final": "texto mejorado en prosa...",\n  "objetivo_general": "texto mejorado...",\n  "objetivos_especificos": "1. texto...\\n2. texto...\\n3. texto...\\n4. texto...",\n  "mision": "texto mejorado...",\n  "vision": "texto mejorado..."\n}'
  }
];

const AdminDashboard = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('usuarios'); // Cambiado a 'usuarios' por defecto para que el usuario vea primero lo que pidió
  const [qrUrl, setQrUrl] = useState('');
  const [numeroContacto, setNumeroContacto] = useState('71541014');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado para gestión de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [cambiadoRolId, setCambiadoRolId] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts_ia')
        .select('*')
        .order('fase_id', { ascending: true });
      
      if (error) throw error;
      
      const mergedPrompts = DEFAULT_PROMPTS.map(defaultP => {
        const dbPrompt = data?.find(p => p.fase_id === defaultP.fase_id && p.proposito === defaultP.proposito);
        return dbPrompt ? dbPrompt : defaultP;
      });
      
      const qrConfig = data?.find(p => p.fase_id === 0 && p.proposito === 'qr_pago_url');
      if (qrConfig) setQrUrl(qrConfig.prompt_texto);

      const numeroConfig = data?.find(p => p.fase_id === 0 && p.proposito === 'numero_contacto_admin');
      if (numeroConfig) setNumeroContacto(numeroConfig.prompt_texto);

      setPrompts(mergedPrompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      setMessage({ text: `Error de BD: ${error.message || error.details || 'Revisa la consola'}`, type: 'error' });
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

  const handleSavePrompt = async (prompt) => {
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
      await guardarPromptIA(0, 'numero_contacto_admin', numeroContacto);
      setMessage({ text: `Configuración guardada exitosamente`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: `Error al guardar: ${error.message}`, type: 'error' });
    }
  };

  // Fondos según la pestaña activa
  const bgStyles = {
    usuarios: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
    prompts: 'radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
    videos: 'radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
    config: 'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)'
  };

  return (
    <div style={{ 
      display: 'flex', minHeight: '100vh', 
      backgroundColor: '#020617', 
      backgroundImage: bgStyles[activeTab],
      color: '#f8fafc', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      overflow: 'hidden',
      transition: 'background-image 0.5s ease-in-out'
    }}>
      
      {/* Sidebar Glassmorphism */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ 
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          zIndex: 10,
          boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: '80px' }}>
          <motion.div 
            whileHover={{ rotate: 90 }}
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '0.75rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.5)' }}
          >
            <Settings size={24} color="white" />
          </motion.div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{ fontWeight: 800, fontSize: '1.25rem', whiteSpace: 'nowrap', background: 'linear-gradient(to right, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}
              >
                Centro de Mando
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ 
            position: 'absolute', top: '28px', right: '-14px', width: '28px', height: '28px', borderRadius: '50%', background: '#1e293b', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: 20, transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.borderColor = '#3b82f6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <nav style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'usuarios', icon: <Users size={20} />, label: 'Usuarios y Roles', color: '#a855f7' },
            { id: 'prompts', icon: <MessageSquare size={20} />, label: 'Prompts IA', color: '#3b82f6' },
            { id: 'videos', icon: <Video size={20} />, label: 'Videos y URLs', color: '#ef4444' },
            { id: 'versiculos', icon: <Database size={20} />, label: 'Versículos', color: '#f59e0b' },
            { id: 'config', icon: <Settings size={20} />, label: 'Límites y Pagos', color: '#10b981' },
            { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Volver a Dashboard', onClick: () => navigate('/dashboard'), color: '#94a3b8' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.div 
                key={item.id}
                onClick={() => { if(item.onClick) item.onClick(); else setActiveTab(item.id); }}
                whileHover={{ x: isActive ? 0 : 5, background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', cursor: 'pointer',
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderRight: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: item.color }}
                  />
                )}
                <div style={{ color: isActive ? item.color : '#94a3b8', transition: 'color 0.2s' }}>
                  {item.icon}
                </div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: '#ef4444', transition: 'all 0.2s', padding: '0.5rem' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.transform = 'translateX(5px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.transform = 'translateX(0)'; }}
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
        
        {/* Top Header Blur */}
        <header style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2, 6, 23, 0.5)', backdropFilter: 'blur(20px)', zIndex: 5 }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              {activeTab === 'prompts' ? 'Gestión de Prompts IA' : 
               activeTab === 'usuarios' ? 'Gestión de Usuarios' : 
               activeTab === 'videos' ? 'Biblioteca de Videos' : 
               activeTab === 'versiculos' ? 'Versículos Bíblicos' : 
               'Configuración General'}
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
              {activeTab === 'prompts' ? 'Ajusta las instrucciones maestras para el motor de Inteligencia Artificial.' : 
               activeTab === 'usuarios' ? 'Administra los roles, permisos y accesos de los usuarios registrados.' : 
               activeTab === 'videos' ? 'Configura las URLs de YouTube y sus marcas de tiempo.' : 
               activeTab === 'versiculos' ? 'Administra los versículos bíblicos aleatorios para el Centro de Mando.' : 
               'Ajustes globales de pago y límites de uso de la plataforma.'}
            </p>
          </motion.div>
        </header>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ 
                    padding: '1rem 1.5rem', marginBottom: '2.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600,
                    background: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
                    border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, 
                    color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
                    boxShadow: message.type === 'error' ? '0 10px 25px -5px rgba(239, 68, 68, 0.2)' : '0 10px 25px -5px rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <AlertCircle size={24} />
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', color: '#94a3b8', gap: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #3b82f6', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Cargando sistema...</span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'prompts' && (
                  <PromptsTab 
                    prompts={prompts} 
                    handlePromptChange={handlePromptChange} 
                    handleRestoreDefault={handleRestoreDefault} 
                    handleSave={handleSavePrompt} 
                  />
                )}
                {activeTab === 'usuarios' && (
                  <UsersTab 
                    usuarios={usuarios}
                    setUsuarios={setUsuarios}
                    loadingUsuarios={loadingUsuarios}
                    setLoadingUsuarios={setLoadingUsuarios}
                    totalAdmins={totalAdmins}
                    setTotalAdmins={setTotalAdmins}
                    cambiadoRolId={cambiadoRolId}
                    setCambiadoRolId={setCambiadoRolId}
                    currentUserId={user?.id}
                    setMessage={setMessage}
                  />
                )}
                {activeTab === 'videos' && (
                  <VideosTab setMessage={setMessage} />
                )}
                {activeTab === 'versiculos' && (
                  <VersiculosTab setMessage={setMessage} />
                )}
                {activeTab === 'config' && (
                  <SettingsTab 
                    qrUrl={qrUrl}
                    setQrUrl={setQrUrl}
                    numeroContacto={numeroContacto}
                    setNumeroContacto={setNumeroContacto}
                    handleSaveQr={handleSaveQr}
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
