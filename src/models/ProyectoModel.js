import { obtenerMisProyectos, eliminarProyecto, actualizarTituloProyecto, crearProyecto as apiCrearProyecto } from '../services/api';

/**
 * Entidad de dominio Proyecto y métodos para interactuar con su capa de datos.
 * La Lógica es "ciega" (no sabe cómo se muestra).
 */
export class ProyectoModel {
  /**
   * Obtiene todos los proyectos del usuario activo.
   */
  static async getMisProyectos() {
    try {
      const proyectos = await obtenerMisProyectos();
      return proyectos || [];
    } catch (error) {
      console.error("[ProyectoModel] Error obteniendo proyectos:", error);
      throw error;
    }
  }

  /**
   * Elimina un proyecto por su ID.
   */
  static async deleteProyecto(id) {
    try {
      await eliminarProyecto(id);
      return true;
    } catch (error) {
      console.error("[ProyectoModel] Error eliminando proyecto:", error);
      throw error;
    }
  }

  /**
   * Actualiza el título de un proyecto.
   */
  static async updateTitulo(id, nuevoTitulo) {
    try {
      if (!nuevoTitulo.trim()) {
        throw new Error("El título no puede estar vacío");
      }
      await actualizarTituloProyecto(nuevoTitulo, id);
      return true;
    } catch (error) {
      console.error("[ProyectoModel] Error actualizando título:", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo proyecto.
   */
  static async createProyecto(entornoId, tipo) {
    try {
      const nuevoProyecto = await apiCrearProyecto(entornoId, tipo);
      return nuevoProyecto;
    } catch (error) {
      console.error("[ProyectoModel] Error creando proyecto:", error);
      throw error;
    }
  }
}
