import { supabase } from '../lib/supabaseClient';

/**
 * Registra o Inicia Sesión (Auth).
 * Como acordamos, si el usuario no existe lo creamos, si existe lo logueamos.
 */
export const autenticarUsuario = async (email, password, isLogin) => {
  let data, error;

  if (isLogin) {
    const res = await supabase.auth.signInWithPassword({ email, password });
    data = res.data;
    error = res.error;
  } else {
    const res = await supabase.auth.signUp({ email, password });
    data = res.data;
    error = res.error;
  }

  if (error) throw error;
  return data.user;
};

/**
 * Inicia el flujo de autenticación con Google OAuth.
 * Supabase redirige al usuario a Google y luego de vuelta a la app.
 */
export const iniciarSesionConGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  if (error) throw error;
};


/**
 * Obtiene el perfil actual del usuario logueado.
 */
export const cerrarSesion = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Supabase signOut error:", error);
  } catch (err) {
    console.error("Excepción en signOut:", err);
  } finally {
    // Forzar la limpieza de cualquier token residual
    localStorage.clear();
    sessionStorage.clear();
  }
};

/**
 * Actualiza los metadatos personalizados del usuario (metadata)
 */
export const actualizarMetadatosUsuario = async (metadataUpdate) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.auth.updateUser({
      data: metadataUpdate
    });
    if (error) console.error("Error al actualizar metadatos:", error);
  } catch (err) {
    console.error("Excepción actualizando metadatos:", err);
  }
};

/**
 * Obtiene los metadatos actuales del usuario
 */
export const obtenerMetadatosUsuario = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.user_metadata || {};
  } catch (err) {
    return {};
  }
};

/**
 * Obtiene el perfil actual del usuario logueado.
 */
export const obtenerPerfilActivo = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: perfil } = await supabase
    .from('perfiles_usuario')
    .select('*, proyecto_usuario(*)')
    .eq('id', user.id)
    .single();

  return { user, perfil };
};

/**
 * Obtiene todos los proyectos del usuario activo.
 */
export const obtenerMisProyectos = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: proyectos } = await supabase
    .from('proyecto_usuario')
    .select('*')
    .eq('usuario_id', user.id)
    .order('actualizado_en', { ascending: false });

  return proyectos || [];
};

/**
 * Guarda o actualiza los datos personales del perfil del usuario (One-time).
 */
export const actualizarPerfilCompleto = async (datos) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("No hay usuario autenticado.");

  const { data, error } = await supabase
    .from('perfiles_usuario')
    .upsert({
      id: user.id,
      email: user.email,
      nombre_completo: datos.nombre,
      celular: datos.celular,
      colegio: datos.colegio,
      curso: datos.curso,
      caracteristicas_personales: datos.caracteristicas
    }, { onConflict: 'id' })
    .select();

  if (error) throw error;
  return data;
};

/**
 * Crea un nuevo proyecto asignado a un mundo y tipo de proyecto (PEP/PI).
 */
export const crearProyecto = async (entornoId, tipoProyecto) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("No hay usuario autenticado.");

    // Mapeo básico de personajes según el entorno (MVP)
    let personajeId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; // Héroe Detective por defecto

    // Primero debemos asegurar que el perfil tenga asignado este entorno y personaje actual
    await supabase.from('perfiles_usuario').update({
      entorno_id: entornoId,
      personaje_id: personajeId
    }).eq('id', user.id);

    // Luego creamos el proyecto
    const { data: proyectoData, error: proyectoError } = await supabase
      .from('proyecto_usuario')
      .insert([
        {
          usuario_id: user.id,
          nombre_proyecto: 'Nuevo Expediente Clasificado',
          tipo_proyecto: tipoProyecto,
          fase_actual: 1
        }
      ])
      .select()
      .single();

    if (proyectoError) {
      console.error("Detalle del error de Supabase:", proyectoError);
      throw new Error(`Error BD: ${proyectoError.message}`);
    }
    return proyectoData;
  } catch (error) {
    console.error("Error en crearProyecto:", error);
    throw error;
  }
};

/**
 * Crea el perfil en la base de datos usando el ID del Auth User actual y el entorno seleccionado.
 */
export const crearPerfilYProyecto = async (datosPerfil, entornoId) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("No hay usuario autenticado.");

    // Mapeo básico de personajes según el entorno (MVP)
    // En el futuro esto debería buscarse en la BD
    let personajeId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; // Héroe Detective por defecto
    if (entornoId !== '11111111-1111-1111-1111-111111111111') {
      // Si es otro mundo, usaríamos otro personaje. 
      // Dejaremos el default para no romper constraint foreign key si no existe.
    }

    // 1. Crear Perfil vinculado a auth.users.id
    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles_usuario')
      .insert([
        {
          id: user.id, // VINCULACIÓN CRÍTICA
          email: user.email,
          nombre_completo: datosPerfil.nombre,
          entorno_id: entornoId,
          personaje_id: personajeId
        }
      ])
      .select()
      .single();

    if (perfilError) throw perfilError;

    // 2. Crear Proyecto asociado
    const { data: proyectoData, error: proyectoError } = await supabase
      .from('proyecto_usuario')
      .insert([
        {
          usuario_id: perfilData.id,
          nombre_proyecto: `Caso de ${datosPerfil.nombre}`,
          tipo_proyecto: 'PEP',
          fase_actual: 1
        }
      ])
      .select()
      .single();

    if (proyectoError) throw proyectoError;

    // Guardamos proyecto en local para referencias rápidas (aunque podríamos leer de BD)
    localStorage.setItem('temp_proyecto_id', proyectoData.id);

    return { perfil: perfilData, proyecto: proyectoData };
  } catch (error) {
    console.error("Error en crearPerfilYProyecto:", error);
    throw error;
  }
};

export const obtenerRetoValidacion = async (fase) => {
  try {
    const { data, error } = await supabase
      .from('retos_validacion')
      .select('*')
      .eq('fase', fase)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error obteniendo reto para la fase ${fase}:`, error);
    return null;
  }
};

/**
 * Guarda las respuestas de una fase usando RLS.
 */
export const guardarContenidoFase = async (fase, campo_clave, contenido) => {
  try {
    const proyecto_id = localStorage.getItem('temp_proyecto_id');
    if (!proyecto_id) throw new Error("No hay proyecto activo");

    // Guardar también en la columna 'paso_actual' de proyecto_usuario para integridad, asegurando que nunca retroceda
    if (campo_clave === 'paso_actual') {
      const nuevoPaso = parseInt(contenido, 10);
      
      const { data: estadoActual, error: estadoError } = await supabase
        .from('proyecto_usuario')
        .select('fase_actual, paso_actual')
        .eq('id', proyecto_id)
        .single();
        
      if (!estadoError && estadoActual) {
        const faseGuardada = parseInt(estadoActual.fase_actual, 10) || 1;
        const pasoGuardado = parseInt(estadoActual.paso_actual, 10) || 1;
        const faseActualInt = parseInt(fase, 10);
        
        let shouldUpdate = false;
        let updatePayload = {};
        
        // Si la fase actual que se guarda es mayor a la registrada, actualizamos ambas
        if (faseActualInt > faseGuardada) {
          shouldUpdate = true;
          updatePayload = { fase_actual: faseActualInt, paso_actual: nuevoPaso };
        } 
        // Si es la misma fase pero el paso es mayor, solo actualizamos el paso
        else if (faseActualInt === faseGuardada && nuevoPaso > pasoGuardado) {
          shouldUpdate = true;
          updatePayload = { paso_actual: nuevoPaso };
        }
        
        if (shouldUpdate) {
          const { error: pasoError } = await supabase
            .from('proyecto_usuario')
            .update(updatePayload)
            .eq('id', proyecto_id);
          if (pasoError) console.error("Error actualizando progreso en proyecto_usuario:", pasoError);
        }
      }
    }

    const res = await supabase
      .from('contenido_proyecto')
      .upsert(
        { proyecto_id, fase, campo_clave, contenido }, 
        { onConflict: 'proyecto_id, fase, campo_clave' }
      )
      .select();

    if (res.error) {
      console.error("Error BD:", res.error);
      throw new Error(res.error.message);
    }
    return res.data;

  } catch (error) {
    console.error("Error guardando contenido:", error);
    throw error;
  }
};

/**
 * Obtiene todo el contenido guardado de una fase específica para el proyecto actual
 */
export const obtenerContenidoFaseCompleto = async (fase) => {
  try {
    const proyecto_id = localStorage.getItem('temp_proyecto_id');
    if (!proyecto_id) return {};

    const { data, error } = await supabase
      .from('contenido_proyecto')
      .select('campo_clave, contenido')
      .eq('proyecto_id', proyecto_id)
      .eq('fase', fase);

    if (error) throw error;

    // Convertir array de objetos a un solo objeto clave-valor
    const resultado = {};
    if (data) {
      data.forEach(item => {
        resultado[item.campo_clave] = item.contenido;
      });
    }
    return resultado;
  } catch (error) {
    console.error("Error obteniendo contenido de la fase:", error);
    return {};
  }
};

/**
 * Elimina un proyecto y todo su contenido asociado
 */
export const eliminarProyecto = async (proyectoId) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("No hay usuario autenticado.");

    // Primero borramos el contenido
    await supabase.from('contenido_proyecto').delete().eq('proyecto_id', proyectoId);

    // Luego el proyecto
    const { data: deletedProject, error: errorProyecto } = await supabase
      .from('proyecto_usuario')
      .delete()
      .eq('id', proyectoId)
      .eq('usuario_id', user.id)
      .select();

    if (errorProyecto) throw errorProyecto;

    if (!deletedProject || deletedProject.length === 0) {
      throw new Error("El proyecto no se pudo borrar de la base de datos (Posible bloqueo por políticas RLS o permisos).");
    }

    return true;
  } catch (error) {
    console.error("Error en eliminarProyecto:", error);
    throw error;
  }
};

/**
 * Actualiza el título de un proyecto
 */
export const actualizarTituloProyecto = async (titulo, id = null) => {
  try {
    const proyecto_id = id || localStorage.getItem('temp_proyecto_id');
    if (!proyecto_id) throw new Error("No hay proyecto activo");

    const { error } = await supabase
      .from('proyecto_usuario')
      .update({ nombre_proyecto: titulo })
      .eq('id', proyecto_id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error al actualizar título:", error);
    throw error;
  }
};


/**
 * Obtiene un archivo de la base de datos de conocimientos (Bibliografía/Teoría).
 * Se utiliza para darle contexto teórico al jugador de forma narrativa.
 */
export const obtenerArchivoClasificado = async (tema) => {
  // Simulando llamada a la base de datos

  const baseDeDatos = {
    'diferencia_pep_pi': {
      titulo: "Diferencia entre Emprendimiento (PEP) e Innovación (PI)",
      contenido: [
        {
          subtitulo: "¿Qué es el emprendimiento?",
          texto: "El emprendimiento se define formalmente como la acción de crear una empresa o proyecto, asumiendo un riesgo económico e invirtiendo recursos para aprovechar una oportunidad que brinda el mercado (Romero, 2004; Fautapo, s.f., como se citó en Ovando y Valencia, 2021). De acuerdo con el Reglamento de Modalidades de Graduación, un emprendimiento productivo es 'una iniciativa de concreción de un proyecto, con el objeto de aprovechar una oportunidad... para fortalecer y desarrollar la economía familiar y comunitaria' (Ministerio de Educación, 2022). Su enfoque principal es la generación de desarrollo económico y social, buscando la rentabilidad o ingresos sostenibles a través de la oferta de bienes o servicios a un público objetivo."
        },
        {
          subtitulo: "¿Qué es la innovación?",
          texto: "La innovación consiste en alterar algo con el propósito de mejorarlo o crear algo completamente nuevo, original y beneficioso (Ministerio de Educación, 2023). Su objetivo central es introducir modificaciones o transformaciones en procesos y métodos para encontrar soluciones concretas a problemas específicos. La innovación se caracteriza por ser la acción de cambiar o transformar la realidad mediante la combinación de conocimiento, creatividad, diseño y tecnología para optimizar procesos o crear nuevos productos (Ministerio de Educación, 2023)."
        },
        {
          subtitulo: "Diferencias Principales",
          lista: [
            "El propósito: El emprendimiento busca identificar una necesidad en el mercado y organizar recursos productivos y comerciales para crear un negocio rentable que cubra esa demanda (Ministerio de Educación, 2023). En cambio, la innovación busca resolver un problema técnico o de producción mediante la invención, mejora o renovación de una herramienta, proceso o producto, centrándose en el avance y la eficiencia (Ministerio de Educación, 2023).",
            "El riesgo y la acción: El emprendedor es la persona que toma la iniciativa, evalúa el mercado y asume los riesgos financieros para sostener el proyecto. La innovación es el proceso técnico creativo o el 'invento' en sí mismo que transforma algo existente.",
            "Su complementariedad: Aunque son distintos, se complementan; la normativa indica que un proyecto de emprendimiento exitoso debe articular 'criterios de innovación' para tener mayor impacto en su entorno, y una innovación suele requerir de un emprendedor para ser introducida exitosamente en la sociedad (Ministerio de Educación, 2022)."
          ]
        }
      ],
      bibliografia: [
        "Ministerio de Educación. (2022). Reglamento de Modalidades de Graduación para el Nivel Técnico Medio del Ámbito de Educación Alternativa (R.M. 0281/2022). La Paz, Bolivia.",
        "Ministerio de Educación. (2023). Guía para la modalidad de graduación Emprendimiento Productivo (Nivel Técnico Medio). La Paz, Bolivia.",
        "Ministerio de Educación. (2023). Guía para la modalidad de graduación Innovación Tecnológica (Nivel Técnico Medio). La Paz, Bolivia.",
        "Ovando, L. y Valencia, S. (2021). Factores de éxito y fracaso al emprendimiento productivo de derivación de lácteos de mujeres en el Municipio de Batallas. Perspectivas, Año 24, Nº 48. Cochabamba: Universidad Católica Boliviana 'San Pablo'.",
        "Romero, R. (2010). Emprendimiento y cultura para la perdurabilidad empresarial. Bogotá: Administración de Negocios Internacionales, Universidad del Rosario."
      ]
    }
  };

  return baseDeDatos[tema] || null;
};

export const obtenerConfiguracionFase = async (entornoId, faseNumero) => {
  const { data, error } = await supabase
    .from('entornos_dialogos')
    .select('*')
    .eq('entorno_id', entornoId)
    .eq('fase_numero', faseNumero)
    .single();

  if (error) {
    console.error("ERROR CRÍTICO: No se encontró la configuración en Supabase.", error);
    throw new Error(`Error de BD (${error.code}): ${error.message} - ${error.details || ''}`);
  }
  return data;
};

/**
 * Obtiene el mapa completo de fases (títulos y pasos) para un entorno específico, ordenado por número de fase.
 */
export const obtenerMapaEntorno = async (entornoId) => {
  const { data, error } = await supabase
    .from('entornos_dialogos')
    .select('fase_numero, titulo_mapa, pasos_mapa')
    .eq('entorno_id', entornoId)
    .order('fase_numero', { ascending: true });

  if (error) {
    console.error("Error obteniendo mapa del entorno:", error);
    return [];
  }
  return data || [];
};
/**
 * Obtiene un prompt de la base de datos
 */
export const obtenerPromptIA = async (fase_id, proposito) => {
  try {
    const { data, error } = await supabase
      .from('prompts_ia')
      .select('prompt_texto')
      .eq('fase_id', fase_id)
      .eq('proposito', proposito)
      .single();
      
    if (error || !data) return null;
    return data.prompt_texto;
  } catch (err) {
    console.error("Error obteniendo prompt:", err);
    return null;
  }
};

/**
 * Guarda o actualiza un prompt de la base de datos
 */
export const guardarPromptIA = async (fase_id, proposito, prompt_texto) => {
  try {
    const { data, error } = await supabase
      .from('prompts_ia')
      .upsert({ fase_id, proposito, prompt_texto }, { onConflict: 'fase_id,proposito' })
      .select();
      
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error guardando prompt:", err);
    throw err;
  }
};

// =============================================
// GESTIÓN DE ROLES (Admin)
// =============================================

/**
 * Obtiene todos los usuarios con su email, nombre y rol.
 * Solo debe ser llamada por administradores.
 */
export const obtenerTodosLosUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('perfiles_usuario')
      .select('id, email, nombre_completo, rol, educoins')
      .order('rol', { ascending: false }); // admins primero

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    throw err;
  }
};

/**
 * Cambia el rol de un usuario (usuario ↔ admin).
 * Valida que el admin no se degrade a sí mismo.
 */
export const cambiarRolUsuario = async (targetUserId, nuevoRol) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay usuario autenticado.');

    // Protección: no degradarse a sí mismo
    if (targetUserId === user.id && nuevoRol === 'usuario') {
      throw new Error('No puedes quitarte el rol de administrador a ti mismo.');
    }

    const { data, error } = await supabase
      .from('perfiles_usuario')
      .update({ rol: nuevoRol })
      .eq('id', targetUserId)
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error cambiando rol:', err);
    throw err;
  }
};

/**
 * Obtiene el conteo actual de administradores.
 */
export const contarAdmins = async () => {
  try {
    const { data, error } = await supabase
      .from('perfiles_usuario')
      .select('id')
      .eq('rol', 'admin');

    if (error) throw error;
    return data ? data.length : 0;
  } catch (err) {
    console.error('Error contando admins:', err);
    return 0;
  }
};

/**
 * REAL: Obtiene ideas desde DeepSeek
 */
export const generarIdeasDeepSeek = async (contextoData) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) return ["No se encontró API Key."];

  try {
    let promptTexto = await obtenerPromptIA(1, 'generar_ideas');
    
    if (promptTexto) {
      // Reemplazar variables en el prompt
      promptTexto = promptTexto
        .replace('{area}', contextoData.area || 'General')
        .replace('{frase_problema}', contextoData.frase_problema || '')
        .replace('{solucionActual}', contextoData.solucionActual || '')
        .replace('{friccion}', contextoData.friccion || '')
        .replace('{solucionIdeal}', contextoData.solucionIdeal || '');
    } else {
      // Fallback si no hay DB
      promptTexto = `Los problemas del usuario son: "${contextoData.frase_problema}". Sus soluciones ideales son: "${contextoData.solucionIdeal}". Basado en esto, genera 10 ideas de negocio variadas (apps, servicios, productos físicos). Las primeras deben ser versiones muy mejoradas de sus soluciones ideales, y el resto ideas nuevas y creativas. Responde solo con un array JSON como ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5", "Idea 6", "Idea 7", "Idea 8", "Idea 9", "Idea 10"].`;
    }

    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un mentor experto en innovación y emprendimiento. Tu tarea es ayudar a generar ideas de negocio. Responde ÚNICAMENTE con un array JSON de 10 strings que describan las ideas de negocio de forma concisa. IMPORTANTE: NO incluyas nombres comerciales para las ideas (por ejemplo, en vez de 'NutriExam: Servicio de...', simplemente devuelve 'Servicio de...'). El nombre se elegirá en un paso posterior." },
          { role: "user", content: promptTexto }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Intentamos extraer el array JSON de la respuesta
    const match = content.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    } else {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error DeepSeek:", error);
    return [
      `App para resolver: ${contextoData.frase_problema}`,
      `Servicio premium enfocado en ${contextoData.solucionIdeal}`,
      `Consultoría sobre el dolor mencionado`,
      `Plataforma colaborativa`,
      `Producto de hardware económico`,
      `Suscripción mensual innovadora`,
      `Comunidad exclusiva para afectados`,
      `Solución de automatización B2B`,
      `Marketplace especializado`
    ];
  }
};

/**
 * REAL: Obtiene nombres desde DeepSeek
 */
export const generarNombresDeepSeek = async (ideaGanadora) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) return ["InnovaPro", "SoluciónYa", "IdeaX"];

  try {
    let promptTexto = await obtenerPromptIA(1, 'generar_nombres');
    let systemPrompt = "Eres un experto en branding. Tu tarea es generar nombres para negocios. DEBES basarte ÚNICA Y EXCLUSIVAMENTE en la idea ganadora que se te proporciona. Responde ÚNICAMENTE con un array JSON de 3 objetos, donde cada objeto tenga 'nombre' (el nombre creativo y corto) y 'representa' (una breve explicación de por qué es ideal para el negocio).";
    
    if (promptTexto) {
      promptTexto = promptTexto.replace('{ideaGanadora}', ideaGanadora).replace('{idea}', ideaGanadora);
    } else {
      promptTexto = `Basándote ÚNICAMENTE en esta idea ganadora de negocio: "${ideaGanadora}", genera 3 nombres atractivos y modernos. No uses ninguna otra información externa. Responde solo con el array JSON: [{"nombre": "Nombre1", "representa": "Representa..."}, {"nombre": "Nombre2", "representa": "Representa..."}, {"nombre": "Nombre3", "representa": "Representa..."}].`;
    }

    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptTexto }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const match = content.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : JSON.parse(content);
  } catch (error) {
    console.error("Error DeepSeek:", error);
    return [
      { nombre: "IdeaNova", representa: "Representa la innovación y la frescura de una nueva idea." },
      { nombre: "Solvex", representa: "Evoca la capacidad de resolver problemas de forma eficaz." },
      { nombre: "ProStart", representa: "Sugiere un comienzo profesional y estructurado." }
    ];
  }
};

/**
 * REAL: Genera Pitch desde DeepSeek
 */
export const generarPitchDeepSeek = async (contextoData) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) return "Ayudamos a nuestro cliente ideal a resolver su principal dolor mediante una solución que elimina la fricción de sus opciones actuales.";

  try {
    let promptTexto = await obtenerPromptIA(1, 'generar_pitch');
    let systemPrompt = "Eres un mentor experto en innovación y oratoria. Tu tarea es generar un Discurso Comercial (Pitch) breve y motivador. Responde ÚNICAMENTE con el texto del pitch, sin explicaciones ni comillas adicionales.";
    
    if (promptTexto) {
      promptTexto = promptTexto
        .replace('{protagonista}', contextoData.protagonista || '')
        .replace('{contexto}', contextoData.contexto || '')
        .replace('{dolor}', contextoData.dolor || '')
        .replace('{tarea}', contextoData.tarea || '')
        .replace('{friccion}', contextoData.friccion || '')
        .replace('{ideaGanadora}', contextoData.ideaGanadora || '')
        .replace('{nombreElegido}', contextoData.nombreElegido || '');
    } else {
      promptTexto = `La idea ganadora del proyecto es: "${contextoData.ideaGanadora}". El protagonista al que va dirigida es: "${contextoData.protagonista}". El contexto es: "${contextoData.contexto}". Su dolor principal es: "${contextoData.dolor}". La tarea que intentan realizar es: "${contextoData.tarea}". La fricción de su solución actual es: "${contextoData.friccion}". La solución propuesta se llama: "${contextoData.nombreElegido}". Genera un "Discurso de Presentación (Pitch)" breve, persuasivo y motivacional de no más de 3 oraciones que resuma cómo esta idea ganadora resuelve su problema. No uses explicaciones adicionales, solo devuelve el texto del pitch.`;
    }

    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptTexto }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim().replace(/^"|"$/g, '');
  } catch (error) {
    console.error("Error DeepSeek:", error);
    return `Ayudamos a ${contextoData.protagonista} a resolver ${contextoData.dolor} mediante ${contextoData.nombreElegido} basado en la idea ${contextoData.ideaGanadora}, mejorando sus opciones actuales.`;
  }
};

/**
 * REAL: Genera Resumen (Problema, Solución, Protagonista) bien redactado desde DeepSeek
 */
export const generarResumenFase1DeepSeek = async (contextoData) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) return {
    problema: contextoData.dolor || 'No definido',
    solucion: contextoData.ideaGanadora || 'No definido',
    protagonista: contextoData.protagonista || 'No definido'
  };

  try {
    let systemPrompt = "Eres un analista de negocios experto. A partir de los datos crudos proporcionados, redacta de forma extremadamente concisa y directa (máximo 15 palabras por campo) el problema, la solución (producto o servicio) y el protagonista (público objetivo). Responde ÚNICAMENTE con un objeto JSON con las claves 'problema', 'solucion', y 'protagonista'. No uses markdown de bloques de código en tu respuesta, solo el JSON puro.";
    
    let promptTexto = await obtenerPromptIA(1, 'generar_resumen_fase1');

    if (promptTexto) {
      promptTexto = promptTexto
        .replace('{ideaGanadora}', contextoData.ideaGanadora || '')
        .replace('{protagonista}', contextoData.protagonista || '')
        .replace('{dolor}', contextoData.dolor || '');
    } else {
      promptTexto = `La idea ganadora (solución) es: "${contextoData.ideaGanadora}". El protagonista al que va dirigida es: "${contextoData.protagonista}". Su dolor principal (problema) es: "${contextoData.dolor}". Genera un texto muy corto, directo y conciso (máximo 15 palabras por campo) para cada propiedad del JSON.`;
    }

    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptTexto }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const match = content.match(/\{.*\}/s);
    return match ? JSON.parse(match[0]) : JSON.parse(content);
  } catch (error) {
    console.error("Error DeepSeek al generar resumen:", error);
    return {
      problema: contextoData.dolor || 'No definido',
      solucion: contextoData.ideaGanadora || 'No definido',
      protagonista: contextoData.protagonista || 'No definido'
    };
  }
};

/**
 * Crea un proyecto generando un nombre consecutivo (Ej: PEP-001)
 */
export const crearProyectoMentor = async (tipoProyecto) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("No hay usuario autenticado.");

    // 1. Obtener proyectos existentes para saber el consecutivo
    const { data: proyectosExistentes } = await supabase
      .from('proyecto_usuario')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('tipo_proyecto', tipoProyecto);

    const conteo = (proyectosExistentes ? proyectosExistentes.length : 0) + 1;
    const numeroFormateado = conteo.toString().padStart(3, '0');
    const tituloGenerado = `${tipoProyecto}-${numeroFormateado}`; // Ej: PEP-001

    // 2. Crear el proyecto en BD
    const { data: proyectoData, error: proyectoError } = await supabase
      .from('proyecto_usuario')
      .insert([
        {
          usuario_id: user.id,
          nombre_proyecto: tituloGenerado,
          tipo_proyecto: tipoProyecto,
          fase_actual: 1
        }
      ])
      .select()
      .single();

    if (proyectoError) throw new Error(`Error BD: ${proyectoError.message}`);
    return proyectoData;
  } catch (error) {
    console.error("Error en crearProyectoMentor:", error);
    throw error;
  }
};

/**
 * REAL: Genera pasos de producción desde DeepSeek usando un prompt personalizado
 */
export const generarPasosPersonalizadoIA = async (promptUsuario) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) return [
    { texto: "Adquirir insumos y materias primas", categoriaCorrecta: "almacenamiento" },
    { texto: "Preparar el área de trabajo y materiales", categoriaCorrecta: "operacion" },
    { texto: "Llevar los insumos al área de mezclado", categoriaCorrecta: "transporte" },
    { texto: "Mezclar y hornear el producto principal", categoriaCorrecta: "operacion" },
    { texto: "Revisar y verificar la calidad de la salida", categoriaCorrecta: "inspeccion" },
    { texto: "Almacenar el producto terminado para entrega", categoriaCorrecta: "almacenamiento" }
  ];

  try {
    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un experto en procesos industriales, creación de servicios y operaciones de negocios. Tu tarea es generar la lista EXACTA de pasos secuenciales para producir el producto o brindar el servicio descrito por el usuario. Para cada paso, debes clasificarlo en una de estas 4 categorías: 'operacion', 'almacenamiento', 'transporte', 'inspeccion'. Responde ÚNICAMENTE con un array de objetos JSON que contengan 'texto' (la descripción del paso) y 'categoriaCorrecta' (una de las 4 categorías indicadas). Ejemplo: [{\"texto\": \"Comprar ingredientes\", \"categoriaCorrecta\": \"almacenamiento\"}, {\"texto\": \"Hornear la masa\", \"categoriaCorrecta\": \"operacion\"}]." },
          { role: "user", content: promptUsuario }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const match = content.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : JSON.parse(content);
  } catch (error) {
    console.error("Error DeepSeek:", error);
    return [{ texto: "Hubo un error al generar los pasos. Por favor, intenta de nuevo.", categoriaCorrecta: "operacion" }];
  }
};

/**
 * REAL: Evalúa la clasificación de los procesos usando DeepSeek
 */
export const evaluarClasificacionProcesosIA = async (pasos) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    // Si no hay API, mockeamos que todos están bien para no bloquear
    const resultado = {};
    pasos.forEach(p => resultado[p.id] = { correcto: true, sugerencia: "" });
    return resultado;
  }

  const promptPasos = pasos.map(p => `ID: ${p.id} | Paso: "${p.texto}" | Categoría Elegida: "${p.categoria}"`).join("\n");

  try {
    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un ingeniero industrial experto. El usuario está clasificando pasos de producción en 4 categorías: 'operacion', 'almacenamiento', 'transporte', 'inspeccion'. Tu tarea es verificar si la categoría que eligió el usuario para cada paso tiene lógica. Devuelve ÚNICAMENTE un objeto JSON válido donde la clave sea el ID del paso, y el valor sea un objeto con 'correcto' (booleano) y 'sugerencia' (string corto explicando por qué si es incorrecto, o vacío si es correcto). Ejemplo: {\"123\": {\"correcto\": true, \"sugerencia\": \"\"}, \"456\": {\"correcto\": false, \"sugerencia\": \"Es revisión, por ende es Inspección\"}}" },
          { role: "user", content: `Por favor evalúa esta clasificación:\n${promptPasos}` }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const match = content.match(/\{.*\}/s);
    return match ? JSON.parse(match[0]) : JSON.parse(content);
  } catch (error) {
    console.error("Error DeepSeek Evaluación:", error);
    // En caso de error, permitir que continúen
    const resultadoFallback = {};
    pasos.forEach(p => resultadoFallback[p.id] = { correcto: true, sugerencia: "Error al verificar, pero puedes continuar." });
    return resultadoFallback;
  }
};

/**
 * Obtiene TODO el contenido guardado de TODAS las fases para el proyecto actual
 */
export const obtenerTodoElContenidoProyecto = async () => {
  try {
    const proyecto_id = localStorage.getItem('temp_proyecto_id');
    if (!proyecto_id) return {};

    const { data, error } = await supabase
      .from('contenido_proyecto')
      .select('fase, campo_clave, contenido')
      .eq('proyecto_id', proyecto_id);

    if (error) throw error;

    // Estructurar la data por fase y luego por campo_clave
    const resultado = {};
    if (data) {
      data.forEach(item => {
        if (!resultado[item.fase]) resultado[item.fase] = {};
        resultado[item.fase][item.campo_clave] = item.contenido;
      });
    }
    
    // Obtener info básica del proyecto
    const { data: proyectoData } = await supabase
      .from('proyecto_usuario')
      .select('nombre_proyecto, tipo_proyecto')
      .eq('id', proyecto_id)
      .single();
      
    if (proyectoData) {
      resultado.info_proyecto = proyectoData;
    }
    
    // Obtener info básica del usuario
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfilData } = await supabase
        .from('perfiles_usuario')
        .select('nombre_completo, colegio, curso')
        .eq('id', user.id)
        .single();
      if (perfilData) {
        resultado.info_usuario = perfilData;
      }
    }

    return resultado;
  } catch (error) {
    console.error("Error obteniendo TODO el contenido del proyecto:", error);
    return {};
  }
};

/**
 * Llama a DeepSeek para mejorar o generar secciones del documento final
 */
export const generarDocumentoMejoradoIA = async (textoBruto, configIA) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey || !textoBruto || textoBruto.trim() === '') return textoBruto; // Fallback si no hay API o no hay texto

  try {
    const tono = configIA.tono || "académico y profesional";
    const instrucciones = configIA.instrucciones || "Mejora la redacción y ortografía";
    
    const systemPrompt = `Eres un asistente experto en redacción académica para tesis de emprendimiento. Tu tarea es tomar un texto bruto (borrador) y reescribirlo usando un tono ${tono}. Debes respetar la idea original, pero hacer que suene más profesional, fluido y claro.
REGLA DE ORO: REDACTA ABSOLUTAMENTE TODO EN PRIMERA PERSONA DEL SINGULAR (ej: "Mi proyecto") Y EN UN TONO ESTRICTAMENTE POSITIVO Y OPTIMISTA. Nunca uses lenguaje pesimista.
Instrucciones extra: ${instrucciones}. NO agregues comentarios ni explicaciones adicionales, devuelve SOLO el texto mejorado.`;
    
    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Texto a mejorar:\n\n${textoBruto}` }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error DeepSeek mejorando documento:", error);
    return textoBruto;
  }
};

/**
 * Llama a DeepSeek para redactar contenido desde cero con nivel medio para campos vacíos
 */
export const generarRedaccionMediaIA = async (contextoProyecto, campoFaltante, instrucciones, nivelIA = 'medio') => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) return `(Simulación IA - Falta API Key) Redacción nivel ${nivelIA} para: ${campoFaltante}`;

  let descNivel = 'claro, profesional, pero sin llegar a ser excesivamente complejo o técnico';
  if (nivelIA === 'basico') descNivel = 'muy sencillo, directo y fácil de entender por cualquier persona';
  if (nivelIA === 'avanzado') descNivel = 'muy formal, académico, utilizando términos técnicos avanzados apropiados para una tesis universitaria';

  try {
    const systemPrompt = `Eres un asistente experto en redacción de planes de emprendimiento. Tu tarea es generar la redacción de una sección específica que está vacía, basándote en la información general del proyecto. 
El nivel de redacción debe ser "${nivelIA}": ${descNivel}.
REGLA DE ORO: REDACTA ABSOLUTAMENTE TODO EN PRIMERA PERSONA DEL SINGULAR (ej: "Mi proyecto") Y EN UN TONO ESTRICTAMENTE POSITIVO Y OPTIMISTA. Nunca uses lenguaje pesimista o limitante.
NO agregues introducciones, saludos ni comentarios. Genera directamente el contenido para la sección: "${campoFaltante}".
Instrucciones específicas: ${instrucciones || 'Genera 1 o 2 párrafos concisos y bien estructurados.'}`;
    
    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Contexto del Proyecto:\n${contextoProyecto}\n\nPor favor, redacta el contenido para la sección vacía: ${campoFaltante}` }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error en IA de redacción:", error);
    return `Error al generar la redacción para ${campoFaltante}.`;
  }
};

/**
 * Llama a DeepSeek con un Mega-Prompt que incluye todos los textos del proyecto de una sola vez.
 * Lanza error explícito si falla, para que la UI pueda manejarlo.
 */
export const generarDocumentoConsolidadoIA = async (textosBrutos, contextoGlobal, configIA) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("No hay API Key configurada para DeepSeek.");
  
  if (!textosBrutos || Object.keys(textosBrutos).length === 0) {
    throw new Error("No hay textos para mejorar.");
  }

  const tono = configIA.tono || "académico y profesional";
  const instrucciones = configIA.instrucciones || "Mejora la redacción y ortografía";
  
  const systemPrompt = `Eres un asistente experto en redacción académica para tesis de emprendimiento.
Contexto Global del Proyecto:
${contextoGlobal || "Proyecto de emprendimiento."}

Tu tarea es tomar un JSON con varias secciones del proyecto en bruto (borradores) y reescribirlas usando un tono ${tono}.
Debes mantener EXACTAMENTE las mismas llaves del JSON original, pero con los valores mejorados.
Respeta la idea original de cada sección, pero haz que suene más profesional, fluido, claro, y que todo el documento tenga coherencia.

IMPORTANTE:
Si el valor de alguna llave incluye la directiva "[SECCIÓN VACÍA]", debes INVENTAR y redactar esa sección desde cero de la mejor manera posible, basándote lógicamente en el "Contexto Global del Proyecto" y en el resto de los datos proporcionados. No dejes notas de que faltan datos, asume el rol y genera un texto convincente y bien estructurado que encaje perfectamente con el proyecto.

REGLA DE ORO: REDACTA ABSOLUTAMENTE TODO EL JSON EN PRIMERA PERSONA DEL SINGULAR (ej: "Mi proyecto") Y EN UN TONO ESTRICTAMENTE POSITIVO Y OPTIMISTA. Transforma cualquier debilidad o bajo presupuesto en una fortaleza (eficiencia, agilidad).

Instrucciones extra: ${instrucciones}.

RESPONDE ÚNICA Y EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO. NO agregues comillas invertidas de markdown (\`\`\`json), NO agregues explicaciones, SOLO el JSON puro.`;

    await cobrarEducoin();
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(textosBrutos) }
      ],
      temperature: 0.4,
      max_tokens: 8192,
      response_format: { type: "json_object" } // Asegurar respuesta JSON
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error en la API de DeepSeek (Estado: ${response.status})`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    let cleanContent = content;
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanContent = content.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleanContent);
  } catch (parseError) {
    console.error("Error parseando respuesta de IA:", content);
    throw new Error("La IA no devolvió un formato válido (JSON). Por favor, intenta de nuevo.");
  }
};

/**
 * Llama a DeepSeek para generar todo el plan financiero (Fase 10) basado en el contexto.
 */
export const generarPlanFinancieroIA = async (contextoProyecto) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("No hay API Key configurada para DeepSeek.");
  
  let systemPrompt = await obtenerPromptIA(10, 'generar_plan_financiero');
  
  if (systemPrompt) {
    systemPrompt = systemPrompt.replace('{contextoProyecto}', contextoProyecto || "Proyecto de emprendimiento general.");
  } else {
    systemPrompt = `Eres un experto financiero para startups y emprendimientos. Tu tarea es generar un plan financiero MULTIPRODUCTO simulado, certero y realista basado en la idea de negocio del usuario, ubicado en Bolivia (Moneda: Bolivianos - Bs).
Contexto del Proyecto:
${contextoProyecto || "Proyecto de emprendimiento general."}

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
  }

    await cobrarEducoin();
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Genera el plan financiero completo ahora." }
      ],
      temperature: 0.6,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error en la API de DeepSeek (Estado: ${response.status})`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    let cleanContent = content;
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanContent = content.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleanContent);
  } catch (parseError) {
    console.error("Error parseando respuesta de IA Financiera:", content);
    throw new Error("La IA no devolvió un formato válido (JSON). Intenta de nuevo.");
  }
};

/**
 * Genera estrategias IA para incrementar la demanda potencial cuando los indicadores financieros son negativos
 */
export const generarConsejosDemandaIA = async (contextoProyecto, datosFinancieros) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("No hay API Key configurada para DeepSeek.");

  const systemPrompt = `Eres un consultor de negocios y estrategia de crecimiento (Growth Hacker) experto en emprendimientos.
El usuario tiene un proyecto donde la evaluación financiera (VAN y TIR) actualmente da RESULTADOS NEGATIVOS o insuficientes.

Contexto del Proyecto:
${contextoProyecto || "Proyecto de emprendimiento general."}

Datos Financieros Actuales:
- Ventas estimadas actuales: ${datosFinancieros.demandaActual} unidades/mes
- Ventas requeridas para breakeven/VAN positivo: ${datosFinancieros.unidadesNecesarias} unidades/mes
- Precio Facturado actual: Bs. ${datosFinancieros.precioVenta}
- VAN Actual: Bs. ${datosFinancieros.van}
- TIR Actual: ${datosFinancieros.tir}% mensual (vs TMAR ${datosFinancieros.tmar}%)

Debes devolver EXACTAMENTE un objeto JSON (sin texto adicional ni bloques de markdown) con la siguiente estructura:
{
  "diagnostico": "Resumen claro y motivador de 2 oraciones sobre por qué los indicadores actuales están en rojo y qué palanca principal mover.",
  "estrategiasDemanda": [
    {
      "titulo": "Nombre corto de la estrategia 1",
      "descripcion": "Explicación práctica de cómo aumentar la demanda de clientes potenciales en 2 oraciones.",
      "impacto": "Impacto estimado (ej: '+30% en ventas en 2 meses')"
    },
    {
      "titulo": "Nombre corto de la estrategia 2",
      "descripcion": "Explicación práctica de un nuevo canal o alianzas comerciales.",
      "impacto": "Impacto estimado"
    },
    {
      "titulo": "Nombre corto de la estrategia 3",
      "descripcion": "Estrategia de posicionamiento o empaquetado premium para subir precio/demanda.",
      "impacto": "Impacto estimado"
    }
  ],
  "consejoEstructuraCostos": "Consejo breve de 1 oración sobre si se debe optimizar algún costo fijo o reducir la inversión inicial."
}

Usa un tono positivo, alentador, profesional y muy práctico. RESPONDE SOLO CON EL JSON VÁLIDO.`;

    await cobrarEducoin();
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Genera el plan de acción para aumentar la demanda potencial y rentabilizar el proyecto ahora." }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error en la API de DeepSeek (Estado: ${response.status})`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();

  try {
    let cleanContent = content;
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanContent = content.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleanContent);
  } catch (parseError) {
    console.error("Error parseando consejos de demanda IA:", content);
    throw new Error("La IA no devolvió un formato JSON válido.");
  }
};

/**
 * Genera el resumen estructurado de las encuestas usando DeepSeek (Fase 2 Paso 7)
 */
export const generarResumenEncuestasIA = async (encuestasData, metricasAvanzadas = null) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("No se encontró API Key de DeepSeek.");

  let systemPrompt = await obtenerPromptIA(2, 'generar_resumen_encuestas');
  if (!systemPrompt) {
    systemPrompt = `Eres un analista experto de estudios de mercado. A continuación recibirás un JSON con las respuestas de encuestas de validación de un producto/servicio. Tu tarea es analizar estas respuestas y devolver un JSON estricto con las siguientes 10 claves exactas:
- "demografia": (string) Edad promedio, género predominante y zona de residencia más común.
- "buyer_persona": (string) Pequeña redacción describiendo al cliente ideal basado en las respuestas.
- "publico_objetivo_resumido": (string) Resume el público objetivo en máximo 5 palabras (mejor si son 2 o 3, ej: "Jóvenes universitarios", "Amas de casa").
- "precio_sugerido": (string) Análisis de ingresos y rango de precio recomendado.
- "frecuencia": (string) Frecuencia estimada de consumo/compra, cantidad de unidades/porciones por compra, y los momentos/situaciones preferidos de uso.
- "educacion": (string) Nivel de educación u ocupación dominante y tono sugerido para hablarles.
- "dolores": (string) Principales problemas o pain points urgentes que intentan resolver.
- "canales": (string) Medios por donde preferirían comprar o enterarse del producto.
- "decision": (string) Factores que valoran más al momento de la compra (calidad, precio, etc.).
- "conclusion": (string) Pequeño veredicto de 1-2 oraciones indicando si la idea tiene potencial real.

Responde ÚNICAMENTE con el objeto JSON, sin formato markdown, para que sea parseado por JSON.parse().`;
  }

    await cobrarEducoin();
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt + `\n\nATENCIÓN: Analiza explícitamente los datos de 'unidades' (unidades por vez) y 'momento' (momento o situación de uso) y asegúrate de incluirlos en tu respuesta bajo la sección de "frecuencia" o donde veas conveniente.` },
        { role: "user", content: "Aquí están los datos de las encuestas:\n" + JSON.stringify(encuestasData) + (metricasAvanzadas ? `\n\nDATOS CLAVE PRE-CALCULADOS:\nÍndice de Necesidad (0-1): ${metricasAvanzadas.IN}\nÍndice de Intención de Compra (0-1): ${metricasAvanzadas.IC}\nFrecuencia de Compra (veces/mes): ${metricasAvanzadas.FC}\nCantidad por Compra (unidades): ${metricasAvanzadas.QC}\nUsa estas métricas explícitamente en tu conclusión o en la sección de frecuencia.` : "") }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Error al comunicarse con la IA.");
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    let cleanContent = content;
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanContent = content.substring(firstBrace, lastBrace + 1);
    }
    return JSON.parse(cleanContent);
  } catch (err) {
    console.error("Error parseando respuesta de IA (Encuestas):", content);
    throw new Error("Formato inválido devuelto por la IA.");
  }
};

/**
 * REAL: Genera resumen de Estrategia de Marketing (Fase 5) desde DeepSeek
 */
export const generarResumenMarketingIA = async (dataFase5) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) return {
    resumen_competencia: "Falta API Key",
    resumen_ventaja: "Falta API Key",
    resumen_entorno: "Falta API Key",
    resumen_promocion: "Falta API Key",
    recomendacion_estrategica: "Por favor configura VITE_DEEPSEEK_API_KEY"
  };

  try {
    let systemPrompt = await obtenerPromptIA(5, 'generar_resumen_marketing');
    
    const compDetalles = dataFase5.competencia?.map(c => `- ${c.nombre} (Vende: ${c.vende || 'No especificado'}, Fortalezas: ${c.fortalezas || 'No especificado'})`).join('\n') || '';
    const ventaja = dataFase5.ventajaFrase || '';
    const entornoPESTEL = [
      dataFase5.pestelPolitico ? `Político: ${dataFase5.pestelPolitico}` : '',
      dataFase5.pestelEconomico ? `Económico: ${dataFase5.pestelEconomico}` : '',
      dataFase5.pestelSocial ? `Social: ${dataFase5.pestelSocial}` : '',
      dataFase5.pestelTecnologico ? `Tecnológico: ${dataFase5.pestelTecnologico}` : '',
      dataFase5.pestelAmbiental ? `Ambiental: ${dataFase5.pestelAmbiental}` : ''
    ].filter(Boolean).join('\n');
    const promoCan = dataFase5.promoCanales?.join(', ') || '';
    const promoMensaje = dataFase5.promoMensaje || '';

    if (systemPrompt) {
      systemPrompt = systemPrompt
        .replace('{compNombres}', compDetalles)
        .replace('{ventaja}', ventaja)
        .replace('{entornoPol}', entornoPESTEL)
        .replace('{entornoEco}', '')
        .replace('{promoCan}', promoCan)
        .replace('{promoMensaje}', promoMensaje);
    } else {
      systemPrompt = `Eres un estratega de marketing experto (Director de Marketing). A partir de los datos crudos proporcionados por un emprendedor, redacta un resumen directivo y estratégico de su plan de marketing.
Datos de la Estrategia de Marketing:
Competidores identificados:\n${compDetalles}
Ventaja competitiva (Frase poderosa): ${ventaja}.
Factores del Entorno PESTEL:\n${entornoPESTEL}
Promoción - Canales: ${promoCan}. Mensaje: ${promoMensaje}.

REGLA DE ORO 1: REDACTA ABSOLUTAMENTE TODO EN PRIMERA PERSONA DEL SINGULAR (ej: "Mi proyecto", "Mi estrategia", "Ofreceré"). 
REGLA DE ORO 2: NUNCA USES TONO NEGATIVO NI PESIMISTA. El texto debe sonar como un emprendedor muy seguro y positivo presentando su plan de marketing. ¡Prohibido criticar o señalar debilidades!

INSTRUCCIONES ESPECÍFICAS PARA CADA CAMPO DEL JSON:
- 'resumen_competencia': Dedica un párrafo bien redactado para cada competidor evaluando sus fortalezas y qué vende (usa doble salto de línea \\n\\n entre párrafos).
- 'resumen_ventaja': Mejora y amplía la ventaja competitiva para que suene contundente y persuasiva.
- 'resumen_entorno': Redacta los factores PESTEL incluyendo subtítulos en negrita (ej: **Político:** ...) separados por saltos de línea (\\n).
- 'resumen_promocion': Redacta la estrategia mejorada e incluye viñetas (usa el símbolo - o •) para listar claramente las acciones de promoción.
- 'recomendacion_estrategica': Un consejo de marketing directo.

Responde ÚNICAMENTE con el objeto JSON puro.`;
    }

    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: systemPrompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const match = content.match(/\{.*\}/s);
    return match ? JSON.parse(match[0]) : JSON.parse(content);
  } catch (error) {
    console.error("Error DeepSeek al generar resumen de marketing:", error);
    return {
      resumen_competencia: "Error al conectar con la IA.",
      resumen_ventaja: "Error al conectar con la IA.",
      resumen_entorno: "Error al conectar con la IA.",
      resumen_promocion: "Error al conectar con la IA.",
      recomendacion_estrategica: "Revisa tu conexión a internet o la consola de errores."
    };
  }
};

export const generarResumenFase4IA = async (dataFase4) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    return {
      resumen_concepto: "Falta API Key",
      resumen_ventaja: "Falta API Key",
      resumen_empaque: "Falta API Key",
      resumen_demanda: "Falta API Key",
      recomendacion_estrategica: "Por favor configura VITE_DEEPSEEK_API_KEY"
    };
  }

  try {
    let systemPrompt = await obtenerPromptIA(4, 'generar_resumen_fase4');

    if (systemPrompt) {
      systemPrompt = systemPrompt
        .replace('{tipoNegocio}', dataFase4.tipoNegocio || 'No especificado')
        .replace('{nomProd}', dataFase4.nomProd || 'No especificado')
        .replace('{paraQueSirve}', dataFase4.paraQueSirve || 'No especificada')
        .replace('{caracteristicasTecnicas}', JSON.stringify(dataFase4.caracteristicasTecnicas || []))
        .replace('{beneficios}', JSON.stringify(dataFase4.beneficios || []))
        .replace('{disenoEmpaque}', dataFase4.disenoEmpaque || dataFase4.descripcionServicio || 'No especificado')
        .replace('{calculoMensual}', dataFase4.calculoMensual || 'No calculado');
    } else {
      systemPrompt = `
      Eres un Mentor de Emprendimiento nivel experto. Un emprendedor acaba de terminar la Fase 4 (Diseño de Producto o Servicio).
      
      Información ingresada por el emprendedor:
      - Tipo de Negocio: ${dataFase4.tipoNegocio || 'No especificado'}
      - Producto/Servicio: ${dataFase4.nomProd || 'No especificado'}
      - Funcionalidad (Para qué sirve): ${dataFase4.paraQueSirve || 'No especificada'}
      - Características Técnicas: ${JSON.stringify(dataFase4.caracteristicasTecnicas || [])}
      - Beneficios: ${JSON.stringify(dataFase4.beneficios || [])}
      - Empaque/Presentación: ${dataFase4.disenoEmpaque || dataFase4.descripcionServicio || 'No especificado'}
      - Demanda (Clientes mensuales estimados): ${dataFase4.calculoMensual || 'No calculado'}
      - Métrica N (Población Total): ${dataFase4.mercadoTotalN || 'No especificado'}
      - MÉTRICAS REALES CALCULADAS (¡OBLIGATORIO USAR ESTOS VALORES EXACTOS Y NO INVENTAR OTROS!): 
        IN: ${dataFase4.metricasAplicadas?.IN || '0'}
        IC: ${dataFase4.metricasAplicadas?.IC || '0'}
        FC: ${dataFase4.metricasAplicadas?.FC || '0'}
        QC: ${dataFase4.metricasAplicadas?.QC || '0'}
      - Distribución de demanda entre productos: ${dataFase4.calculoMensual || 'No calculado'}

      REGLA DE ORO 1: SIEMPRE DEBES REDACTAR EN POSITIVO, MEJORANDO TODO LO QUE EL EMPRENDEDOR ESCRIBIÓ. NUNCA USES TONO NEGATIVO NI PESIMISTA.
      REGLA DE ORO 2: REDACTA ABSOLUTAMENTE TODO EN PRIMERA PERSONA DEL SINGULAR (ej: "Mi proyecto", "Ofrezco", "Mi producto"). El texto debe sonar como si el propio emprendedor lo estuviera presentando con extrema seguridad.
      NUNCA debes decir "no está definido", "falta detallar" o "no se especificó". Si falta información, DEBES INVENTARLA o ASUMIRLA de forma lógica basándote en el nombre del producto o el contexto del proyecto. Actúa como si el proyecto ya fuera un éxito y redacta de manera asertiva y convincente.

      IMPORTANTE: DEBES responder EXCLUSIVAMENTE con un objeto JSON (sin formato Markdown adicional, ni \`\`\`json) que contenga exactamente estas 5 propiedades (tipo string, puede tener saltos de línea para las fórmulas usando \\n):
      {
        "resumen_concepto": "Concepto y funcionalidad del servicio/producto (MEJORADO Y EN POSITIVO).",
        "resumen_ventaja": "Los beneficios redactados en base a las características del producto, pero de forma MUY MEJORADA y comercial.",
        "resumen_empaque": "La estrategia de empaque o presentación del servicio, redactada de forma MEJORADA, creativa y en positivo.",
        "resumen_demanda": "TITÚLALO INTERNAMENTE COMO 'Demanda Potencial'. Redacta de forma detallada, en primera persona y en tono muy positivo cómo se calculó la demanda. Muestra la fórmula Dmes = N * IN * IC * FC * QC y REEMPLAZA las letras por los VALORES EXACTOS proporcionados en las 'MÉTRICAS REALES CALCULADAS' (N, IN, IC, FC, QC) y el resultado total de 'Demanda (Clientes mensuales)'. Explica matemáticamente qué significa cada métrica. Luego, explica cómo esta demanda total se distribuye exactamente entre los diferentes productos (usa los datos de Distribución proporcionados). Usa viñetas o saltos de línea (\\n) para que se vea como una explicación matemática bonita y profesional.",
        "recomendacion_estrategica": "Un consejo experto para potenciar su diseño."
      }
      `;
    }

    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: systemPrompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    const match = content.match(/\{.*\}/s);
    return match ? JSON.parse(match[0]) : JSON.parse(content);
  } catch (error) {
    console.error("Error DeepSeek en Fase 4:", error);
    return {
      resumen_concepto: "Error al conectar.",
      resumen_ventaja: "Error al conectar.",
      resumen_empaque: "Error al conectar.",
      resumen_demanda: "Error al conectar.",
      recomendacion_estrategica: "Error al conectar."
    };
  }
};

export const generarResumenFase6IA = async (dataFase6) => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    return {
      resumen_ubicacion: "Falta API Key",
      resumen_canales: "Falta API Key",
      resumen_plan: "Falta API Key",
      recomendacion_logistica: "Por favor configura VITE_DEEPSEEK_API_KEY"
    };
  }

  try {
    let systemPrompt = await obtenerPromptIA(6, 'generar_resumen_fase6');

    if (systemPrompt) {
      systemPrompt = systemPrompt
        .replace('{dondeProducir}', dataFase6.dondeProducir || 'No especificado')
        .replace('{dondeAlmacenar}', dataFase6.dondeAlmacenar || 'No especificado')
        .replace('{distComoVender}', dataFase6.distComoVender || 'No especificado')
        .replace('{lugares}', JSON.stringify(dataFase6.lugares || []))
        .replace('{comoRecibirPago}', dataFase6.comoRecibirPago || 'No especificados')
        .replace('{planDistribucion}', JSON.stringify(dataFase6.planDistribucion || []));
    } else {
      systemPrompt = `
      Eres un Mentor de Emprendimiento experto en Logística. El emprendedor acaba de terminar la Fase 6 (Localización y Distribución).
      
      Información ingresada:
      - Producción: ${dataFase6.dondeProducir || 'No especificado'}
      - Almacenamiento: ${dataFase6.dondeAlmacenar || 'No especificado'}
      - Dirección de Venta (Croquis): ${dataFase6.croquisDescripcion || 'No especificado'}
      - Modalidad de Venta: ${dataFase6.distComoVender || 'No especificado'}
      - Lugares Evaluados: ${JSON.stringify(dataFase6.lugares || [])}
      - Métodos de Pago: ${dataFase6.comoRecibirPago || 'No especificados'}
      - Plan de Acción: ${JSON.stringify(dataFase6.planDistribucion || [])}

      Genera un resumen profesional, alentador y ejecutivo evaluando su estrategia.
      
      REGLA DE ORO 1: REDACTA ABSOLUTAMENTE TODO EN PRIMERA PERSONA DEL SINGULAR (ej: "Mi proyecto", "Mi plan", "Distribuiré", "Cuento con un presupuesto"). 
      REGLA DE ORO 2: NUNCA USES TONO NEGATIVO NI PESIMISTA. Si un presupuesto es bajo o un plan es simple, resáltalo como una fortaleza (ej: "optimizando recursos al máximo", "operación ágil", "enfoque lean"). El texto debe sonar como un emprendedor muy seguro y positivo presentando su modelo. ¡Prohibido criticar o señalar debilidades! Todo debe ser justificado de manera optimista.

      IMPORTANTE: DEBES responder EXCLUSIVAMENTE con un objeto JSON (sin formato Markdown adicional, ni \`\`\`json) que contenga exactamente estas 6 propiedades (tipo string, de 2 a 3 líneas cada una):
      {
        "resumen_ubicacion": "Análisis de las ventajas/desventajas del lugar físico elegido.",
        "resumen_canales": "Eficiencia de los canales de venta elegidos.",
        "resumen_direccion": "Redacción fluida indicando el lugar de producción, el lugar de almacenamiento, y la dirección de venta (según el croquis o si es delivery). Analízalo lógicamente.",
        "resumen_pagos": "Redacción sobre los métodos de pago elegidos y una lista de los mismos.",
        "resumen_plan": "Revisión sobre la factibilidad del plan de acción logístico.",
        "recomendacion_logistica": "Un consejo experto para optimizar la cadena de entrega o distribución."
      }
      `;
    }

    await cobrarEducoin();
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: systemPrompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    const match = content.match(/\{.*\}/s);
    return match ? JSON.parse(match[0]) : JSON.parse(content);
  } catch (error) {
    console.error("Error DeepSeek en Fase 6:", error);
    return {
      resumen_ubicacion: "Error al conectar.",
      resumen_canales: "Error al conectar.",
      resumen_plan: "Error al conectar.",
      recomendacion_logistica: "Error al conectar."
    };
  }
};

// =============================================
// GESTIÓN DE CONFIGURACIÓN DE VIDEOS (YouTube)
// =============================================

/**
 * Obtiene todas las configuraciones de videos (guardadas en prompts_ia con proposito video_*)
 */
export const obtenerVideosConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('prompts_ia')
      .select('*')
      .eq('fase_id', 0)
      .like('proposito', 'video_%');

    if (error) throw error;
    
    // Convertir de array a objeto indexado por key
    const configs = {};
    if (data) {
      data.forEach(item => {
        try {
          configs[item.proposito] = JSON.parse(item.prompt_texto);
        } catch (e) {
          console.warn(`Error parseando config de video ${item.proposito}`, e);
        }
      });
    }
    return configs;
  } catch (err) {
    console.error("Error obteniendo configs de videos:", err);
    return {};
  }
};

/**
 * Guarda o actualiza la configuración de un video
 */
export const guardarVideoConfig = async (videoKey, url) => {
  const configJson = JSON.stringify({
    url,
    startStr: '',
    endStr: ''
  });

  return await guardarPromptIA(0, videoKey, configJson);
};

/**
 * Helper para construir URL final de YouTube embed con parámetros
 */
export const buildYoutubeEmbedUrl = (config, fallbackUrl) => {
  let finalUrl = config?.url || fallbackUrl;
  
  if (!finalUrl) return '';

  // Si es un iframe embebido entero, sacamos el src
  const iframeMatch = finalUrl.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    finalUrl = iframeMatch[1];
  }

  // Extraer el ID del video de forma robusta
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = finalUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (videoId) {
    finalUrl = `https://www.youtube.com/embed/${videoId}`;
  } else {
    if (finalUrl.includes('watch?v=')) finalUrl = finalUrl.replace('watch?v=', 'embed/');
    else if (finalUrl.includes('youtu.be/')) finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    finalUrl = finalUrl.split('?')[0].split('&')[0];
  }

  const params = [];
  
  // Siempre agregar rel=0 para mejor UX
  params.push('rel=0');

  if (params.length > 0) {
    finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.join('&');
  }

  return finalUrl;
};
export const recargarEducoins = async (targetUserId, amount) => { try { const { data, error } = await supabase.rpc('recargar_educoins', { user_id: targetUserId, amount: amount }); if (error) { const res = await supabase.from('perfiles_usuario').select('educoins').eq('id', targetUserId).single(); const newAmount = (res.data?.educoins || 0) + amount; const { data: updateData, error: updateError } = await supabase.from('perfiles_usuario').update({ educoins: newAmount }).eq('id', targetUserId).select(); if (updateError) throw updateError; return updateData; } return data; } catch (err) { console.error('Error al recargar EduCoins:', err); throw err; } };


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
