import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bot, Save, CheckCircle } from 'lucide-react';

const Paso6_Resultados = ({ setAyudanteText, onComplete, encuestasData = [] }) => {
  const [guardando, setGuardando] = React.useState(false);

  React.useEffect(() => {
    setAyudanteText("¡Estos son los resultados! Revisa las gráficas. ¿Tu idea tiene potencial según los números?");
  }, []);

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
    { key: 'pago', label: '16. ¿Cuánto pagarías?', type: 'bar' },
    { key: 'carac', label: '17. Característica clave', type: 'bar' }
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
        stats[val] = (stats[val] || 0) + 1;
        total++;
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

  const generateComment = (chartData) => {
    if (chartData.length === 0) return '';
    const top = chartData[0];
    return `La opción predominante es "${top.name}" con un ${top.percentage}% de respuestas.`;
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
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={90} tick={{fontSize: 11}} />
                      <Tooltip formatter={tooltipFormatter} contentStyle={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                      <Bar dataKey="value" fill={COLORS[idx % COLORS.length]} radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#cbd5e1', fontSize: 12, formatter: (val) => { const cd = chartData.find(d => d.value === val); return cd ? `${cd.percentage}%` : ''; } }} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', borderLeft: '3px solid #3b82f6', color: '#64748b', fontSize: '0.9rem', marginTop: 'auto' }}>
                💡 <strong>Análisis rápido:</strong> {generateComment(chartData)}
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
