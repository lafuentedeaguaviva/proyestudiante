import React from 'react';
import { FileDigit } from 'lucide-react';

const Paso4_Codificacion = ({ setAyudanteText, onComplete }) => {
  React.useEffect(() => {
    setAyudanteText("Codificar significa darle un nombre corto a cada pregunta para tabularla más fácil. ¡Mira la tabla y avancemos!");
  }, []);

    const codes = [
      { preg: "1. Edad", cod: "EDAD", tipo: "Opción Múltiple" },
      { preg: "2. Género", cod: "GEN", tipo: "Opción Múltiple" },
      { preg: "3. Dónde vives/estudias", cod: "ZONA", tipo: "Opción Múltiple" },
      { preg: "4. Nivel de estudios", cod: "EST", tipo: "Opción Múltiple" },
      { preg: "5. Recibes dinero", cod: "ING", tipo: "Opción Múltiple" },
      { preg: "6. Cantidad semanal", cod: "CANT", tipo: "Opción Múltiple" },
      { preg: "7. Gastos principales", cod: "GASTO", tipo: "Opción Múltiple" },
      { preg: "8. Frecuencia", cod: "FREC", tipo: "Opción Múltiple" },
      { preg: "9. Lo más importante", cod: "IMPORT", tipo: "Opción Múltiple" },
      { preg: "10. Dónde adquieres", cod: "LUGAR", tipo: "Opción Múltiple" },
      { preg: "11. Redes sociales", cod: "REDES", tipo: "Opción Múltiple" },
      { preg: "12. Nivel de dificultad (1-5)", cod: "DIF", tipo: "Escala 1-5" },
      { preg: "13. Intentos de solución", cod: "INTENT", tipo: "Opción Múltiple" },
      { preg: "14. Acción actual", cod: "ACT", tipo: "Opción Múltiple" },
      { preg: "15. ¿Usarías el producto?", cod: "USO", tipo: "Sí/No/Tal vez" },
      { preg: "16. ¿Cuánto pagarías?", cod: "PAGO", tipo: "Opción Múltiple" },
      { preg: "17. Característica clave", cod: "CARAC", tipo: "Opción Múltiple" },
      { preg: "18. Sugerencias", cod: "MEJORA", tipo: "Texto Abierto" },
      { preg: "19. Recibir información", cod: "INFO", tipo: "Sí/No" },
      { preg: "20. Contacto", cod: "CONT", tipo: "Texto Abierto" },
    ];

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Paso 4: Codificación</h2>
      <p style={{ color: '#475569', marginBottom: '2rem', textAlign: 'center' }}>
        El sistema asignará automáticamente identificadores cortos (códigos) a tus preguntas para crear la matriz de llenado.
      </p>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#60a5fa' }}>
          <FileDigit size={24} />
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Diccionario de Datos</h3>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
              <th style={{ padding: '0.75rem' }}>Pregunta original</th>
              <th style={{ padding: '0.75rem' }}>Código asignado</th>
              <th style={{ padding: '0.75rem' }}>Tipo de dato</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{c.preg}</td>
                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#059669' }}>{c.cod}</td>
                <td style={{ padding: '0.75rem', color: '#64748b' }}>{c.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={onComplete}
          style={{ padding: '1rem 3rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Siguiente: Llenar Matriz
        </button>
      </div>
    </div>
  );
};

export default Paso4_Codificacion;
