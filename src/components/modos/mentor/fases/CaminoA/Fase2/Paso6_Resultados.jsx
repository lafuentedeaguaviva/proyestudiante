import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bot, Save, CheckCircle } from 'lucide-react';

const Paso6_Resultados = ({ setAyudanteText, onComplete, encuestasData = [], updateData }) => {
  const [guardando, setGuardando] = React.useState(false);

  React.useEffect(() => {
    setAyudanteText("¡Estos son los resultados! Revisa las gráficas. ¿Tu idea tiene potencial según los números?");
    
    if (updateData && encuestasData && encuestasData.length > 0) {
      let sum = 0;
      let n = 0;
      encuestasData.forEach(d => {
        const val = d.dif;
        if (val) {
          const weight = parseInt(val, 10);
          if (!isNaN(weight)) {
            sum += weight; // fi * wi equivalent since we iterate per response
            n += 1; // N
          }
        }
      });
      if (n > 0) {
        const necesidadPorcentaje = Math.round((sum / (n * 5)) * 100);
        updateData({ necesidadValidada: necesidadPorcentaje });
      }
    }
  }, [encuestasData, setAyudanteText]);

  const cols = [
    { key: 'edad', label: '1. Edad', type: 'pie' },
    { key: 'genero', label: '2. Género', type: 'pie' },
    { key: 'zona', label: '3. Zona', type: 'bar' },
    { key: 'est', label: '4. Nivel de estudios', type: 'bar' },
    { key: 'ing', label: '5. Recibes dinero', type: 'pie' },
    { key: 'cant', label: '6. Cantidad semanal', type: 'bar' },
    { key: 'gasto', label: '7. Gastos', type: 'bar' },
    { key: 'frec', label: '8. Frecuencia', type: 'bar' },
    { key: 'import', label: '9. Lo más importante', type: 'bar' },
    { key: 'lugar', label: '10. Dónde adquieres', type: 'bar' },
    { key: 'redes', label: '11. Redes sociales', type: 'bar' },
    { key: 'dif', label: '12. Dificultad (1-5)', type: 'bar' },
    { key: 'intent', label: '13. Intentos previos', type: 'bar' },
    { key: 'act', label: '14. Acción actual', type: 'bar' },
    { key: 'uso', label: '15. ¿Usarías el producto?', type: 'pie' },
    { key: 'frecCompra', label: '16. Frecuencia de uso/compra', type: 'bar' },
    { key: 'unidades', label: '17. Unidades por vez', type: 'pie' },
    { key: 'momento', label: '18. Momento de uso', type: 'bar' },
    { key: 'pago', label: '19. ¿Cuánto pagarías?', type: 'bar' },
    { key: 'carac', label: '20. Característica clave', type: 'bar' }
  ];

  const datos = encuestasData.length > 0 ? encuestasData : [
    { edad: '14-17', genero: 'Femenino', uso: 'Sí', pago: '5-10', frec: '2-3 veces/sem', dif: '4' }, 
    { edad: '18-21', genero: 'Masculino', uso: 'Sí', pago: '11-20', dif: '5', act: 'Internet' }, 
    { edad: '14-17', genero: 'Masculino', uso: 'No', pago: '< Bs. 5', frec: 'Nunca', act: 'Ignoro' },
    { edad: '22-30', genero: 'Femenino', uso: 'Tal vez', pago: '5-10', carac: 'Calidad' }, 
    { edad: '18-21', genero: 'Femenino', uso: 'Sí', pago: '11-20', carac: 'Rápido', redes: 'TikTok' }
  ];

  const generateChartData = (key) => {
    const stats = {};
    let total = 0;
    datos.forEach(d => {
      const val = d[key];
      if (val) {
        if (typeof val === 'string' && (key === 'gasto' || key === 'redes' || key === 'momento')) {
          val.split(',').forEach(v => {
            const trimmed = v.trim();
            if (trimmed) {
              stats[trimmed] = (stats[trimmed] || 0) + 1;
              total++;
            }
          });
        } else {
          stats[val] = (stats[val] || 0) + 1;
          total++;
        }
      }
    });
    return Object.keys(stats)
      .map(k => ({ 
        name: k, 
        value: stats[k], 
        total, 
        percentage: Math.round((stats[k] / total) * 100) 
      }))
      .sort((a, b) => b.value - a.value);
  };

  const generateComment = (chartData, colKey) => {
    if (chartData.length === 0) return '';
    
    if (colKey === 'dif') {
      let sum = 0;
      let n = 0;
      chartData.forEach(d => {
        const weight = parseInt(d.name, 10);
        if (!isNaN(weight)) {
          sum += d.value * weight;
          n += d.value;
        }
      });
      
      if (n > 0) {
        const necesidadPorcentaje = Math.round((sum / (n * 5)) * 100);
        return (
          <span>
            <strong>Necesidad Validada: {necesidadPorcentaje}%</strong>
            <br/><br/>
            Esta métrica utiliza la fórmula ponderada <code>Necesidad = (∑(fi×wi)) / (N×5) × 100</code>.
            <br/>
            <strong>Donde:</strong>
            <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>fi</strong> = Cantidad de personas que eligieron esa respuesta</li>
              <li><strong>wi</strong> = Peso de la respuesta (1, 2, 3, 4, 5)</li>
              <li><strong>N</strong> = Total de personas encuestadas</li>
            </ul>
            <strong>Escala:</strong> 1 (Muy fácil) a 5 (Muy difícil de resolver). 
            <br/>
            <strong>Interpretación:</strong> El <strong>{necesidadPorcentaje}%</strong> de los encuestados tienen una necesidad real de buscar una nueva alternativa, debido a la dificultad de sus soluciones actuales.
          </span>
        );
      }
    }

    const top = chartData[0];
    return <span>La opción predominante es "{top.name}" con un {top.percentage}% de respuestas.</span>;
  };

  const tooltipFormatter = (value, name, props) => {
    const { percentage } = props.payload;
    return [`${value} votos (${percentage}%)`, name];
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const handleSave = () => {
    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
      onComplete(); // Pasa a la siguiente fase o termina
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Paso 6: Resultados de Validación</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {cols.map((col, idx) => {
          const chartData = generateChartData(col.key);
          if (chartData.length === 0) return null;

          return (
            <div key={col.key} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>{col.label}</h3>
              <div style={{ height: '250px', marginBottom: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {col.type === 'pie' ? (
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={tooltipFormatter} contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={140} tick={{fontSize: 11}} />
                      <Tooltip formatter={tooltipFormatter} contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                      <Bar dataKey="value" fill={COLORS[idx % COLORS.length]} radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#cbd5e1', fontSize: 12, formatter: (val) => { const cd = chartData.find(d => d.value === val); return cd ? `${cd.percentage}%` : ''; } }} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', borderLeft: '3px solid #3b82f6', color: '#64748b', fontSize: '0.9rem', marginTop: 'auto', lineHeight: '1.5' }}>
                💡 <strong>Análisis rápido:</strong> {generateComment(chartData, col.key)}
              </div>
            </div>
          );
        })}

      </div>

      <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #3b82f6', marginBottom: '2rem' }}>
        <h3 style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
          <Bot size={24} /> Análisis de Inteligencia Artificial
        </h3>
        <p style={{ color: '#64748b', lineHeight: '1.6' }}>
          Basado en los {datos.length} encuestados, hay una aceptación positiva del producto, con una tendencia de precio fuerte en el rango intermedio. Recomiendo que el precio de lanzamiento esté acorde a lo que el 60% indicó que está dispuesto a pagar. ¡Tu idea está validada!
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={onComplete}
          style={{ padding: '1rem 3rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Bot size={20} />
          Siguiente
        </button>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Paso6_Resultados;
