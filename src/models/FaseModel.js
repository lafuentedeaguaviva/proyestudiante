import { guardarContenidoFase, obtenerContenidoFaseCompleto } from '../services/api';

/**
 * FaseModel - Clase que encapsula la capa de acceso a datos para las Fases.
 * Siguiendo el principio de Responsabilidad Única (SRP) y MVC.
 */
export class FaseModel {
  /**
   * Obtiene todos los datos guardados para una fase específica.
   * @param {number} faseId - ID de la fase
   * @returns {Promise<Object>} Datos de la fase o un objeto vacío
   */
  static async obtenerDatosFase(faseId) {
    try {
      const data = await obtenerContenidoFaseCompleto(faseId);
      return data || {};
    } catch (error) {
      console.error(`[FaseModel] Error obteniendo datos para fase ${faseId}:`, error);
      throw error;
    }
  }

  /**
   * Guarda un bloque de datos para una fase.
   * @param {number} faseId - ID de la fase
   * @param {string} clave - Clave o nombre del campo a guardar (ej. 'financiero', 'estructura')
   * @param {any} valor - El contenido a guardar
   */
  static async guardarDatos(faseId, clave, valor) {
    try {
      await guardarContenidoFase(faseId, clave, valor);
      return true;
    } catch (error) {
      console.error(`[FaseModel] Error guardando clave ${clave} en fase ${faseId}:`, error);
      throw error;
    }
  }

  /**
   * Avanza el progreso de una fase.
   * Si es el final de la fase, avanza a la siguiente fase globalmente.
   * @param {number} faseDestino - La fase a la que se debe avanzar (ej. 10)
   * @param {number} pasoDestino - El paso al que se avanza (ej. 1)
   */
  static async actualizarProgreso(faseDestino, pasoDestino) {
    try {
      await guardarContenidoFase(faseDestino, 'paso_actual', pasoDestino);
      return true;
    } catch (error) {
      console.error(`[FaseModel] Error actualizando progreso a Fase ${faseDestino} Paso ${pasoDestino}:`, error);
      throw error;
    }
  }
}
