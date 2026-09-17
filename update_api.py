import re

file_path = 'd:/estudiante/plataforma-gamificada/src/services/api.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add actualizarTituloProyecto if not exists
if 'actualizarTituloProyecto' not in content:
    new_func = """
/**
 * Actualiza el título de un proyecto
 */
export const actualizarTituloProyecto = async (proyectoId, nuevoTitulo) => {
  try {
    const { data, error } = await supabase
      .from('proyecto_usuario')
      .update({ titulo: nuevoTitulo })
      .eq('id', proyectoId)
      .select()
      .single();

    if (error) throw new Error(`Error actualizando título de proyecto: ${error.message}`);
    return data;
  } catch (error) {
    console.error("Error en actualizarTituloProyecto:", error);
    throw error;
  }
};
"""
    content = content + new_func
    
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done api.js")
