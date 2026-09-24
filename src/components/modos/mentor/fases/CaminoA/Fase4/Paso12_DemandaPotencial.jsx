import React, { useEffect, useState } from 'react';
import { Calculator, Save, Package, Wrench, Info } from 'lucide-react';
import { FaseModel } from '../../../../../../models/FaseModel';

const Paso12_DemandaPotencial = ({ setAyudanteText, globalData, updateGlobalData, onComplete, guardando }) => {
  const { listaProductos = [], demandas = {}, mercadoTotalN = '' } = globalData;
  const [metricasGlobales, setMetricasGlobales] = useState({ IN: 0.5, IC: 0.5, FC: 1, QC: 1 });
  const [loadingMetricas, setLoadingMetricas] = useState(true);

  const calcularMetricasDesdeEncuestas = (encuestasData) => {
    if (!encuestasData || encuestasData.length === 0) return null;
    const total = encuestasData.length;

    let sumDif = 0;
    encuestasData.forEach(d => { sumDif += parseInt(d.dif) || 1; });
    const IN = ((sumDif / total) - 1) / 4;

    let countSi = 0; let countTalVez = 0;
    encuestasData.forEach(d => {
      if (d.uso === 'Sí' || d.uso === 'Si') countSi++;
      if (d.uso === 'Tal vez') countTalVez++;
    });
    const IC = (countSi / total) + (0.5 * (countTalVez / total));

    const frecValues = { "Todos los dias": 30, "3-5 veces semana": 16, "1-2 veces semana": 6, "1 vez semana": 4, "1 vez mes": 1, "Rara vez": 0.5, "Nunca": 0 };
    let sumFC = 0;
    encuestasData.forEach(d => {
      if (frecValues[d.frecCompra] !== undefined) sumFC += frecValues[d.frecCompra];
    });
    const FC = sumFC / total;

    const unitValues = { "1": 1, "2": 2, "3": 3, "4 o más": 4.5 };
    let sumQC = 0;
    encuestasData.forEach(d => {
      if (unitValues[d.unidades] !== undefined) sumQC += unitValues[d.unidades];
    });
    const QC = sumQC / total;

    return { IN: IN.toFixed(2), IC: IC.toFixed(2), FC: FC.toFixed(1), QC: QC.toFixed(1) };
  };

  useEffect(() => {
    setAyudanteText("Pensemos en números. Ingresa la población total de tu mercado. El sistema usará las métricas calculadas en la validación (Fase 2) para proyectar tu demanda potencial real.");
    
    // Cargar métricas de la Fase 2
    const cargarMetricas = async () => {
      try {
        const f2Data = await FaseModel.obtenerDatosFase(2);
        if (f2Data && f2Data.validacion_idea) {
          let valData = f2Data.validacion_idea;
          if (typeof valData === 'string') {
            try { valData = JSON.parse(valData); } catch (e) { console.error("Error parseando validacion_idea", e); }
          }
          if (valData.metricas_clave) {
            setMetricasGlobales(valData.metricas_clave);
            // Inyectar al globalData inmediatamente para que la IA lo vea sin necesidad de editar nada
            updateGlobalData({ metricasAplicadas: valData.metricas_clave });
          } else if (valData.encuestas) {
            const calculadas = calcularMetricasDesdeEncuestas(valData.encuestas);
            if (calculadas) {
              setMetricasGlobales(calculadas);
              updateGlobalData({ metricasAplicadas: calculadas });
            }
          }
        }
      } catch (err) {
        console.error("Error al cargar métricas de fase 2:", err);
      } finally {
        setLoadingMetricas(false);
      }
    };
    cargarMetricas();
  }, [setAyudanteText]);

  // Demanda potencial mensual global
  const calcularDmes = () => {
    const N = parseFloat(mercadoTotalN) || 0;
    const { IN, IC, FC, QC } = metricasGlobales;
    return Math.round(N * IN * IC * FC * QC);
  };

  const dmesGlobal = calcularDmes();

  const calcularPotencialIndividual = (prodId) => {
    if (!listaProductos || listaProductos.length === 0) return dmesGlobal;
    const d = demandas[prodId] || {};
    let porcentaje = parseFloat(d.porcentajeAsignado);
    if (isNaN(porcentaje)) {
      porcentaje = 100 / listaProductos.length;
    }
    return Math.round(dmesGlobal * (porcentaje / 100));
  };

  const calcularTotalGeneral = () => {
    if (!listaProductos || listaProductos.length === 0) {
      return dmesGlobal;
    }
    let total = 0;
    listaProductos.forEach(p => {
      total += calcularPotencialIndividual(p.id);
    });
    return total;
  };

  const updateCalculations = (nextData) => {
    // Calculamos temporalmente con la misma lógica para tener los totales correctos
    const N = parseFloat(nextData.mercadoTotalN) || 0;
    const globalPot = Math.round(N * metricasGlobales.IN * metricasGlobales.IC * metricasGlobales.FC * metricasGlobales.QC);
    
    let totalAsignado = 0;
    let descripcionTotal = globalPot.toString();

    if (nextData.listaProductos && nextData.listaProductos.length > 0) {
      const descripciones = nextData.listaProductos.map(p => {
        const d = (nextData.demandas && nextData.demandas[p.id]) || {};
        let pct = parseFloat(d.porcentajeAsignado);
        if (isNaN(pct)) pct = 100 / nextData.listaProductos.length;
        
        const pot = Math.round(globalPot * (pct / 100));
        totalAsignado += pot;
        const nombreDetalle = p.nombre ? `${p.tipo}: ${p.nombre}` : p.tipo;
        return `${pot} para ${nombreDetalle}`;
      });
      descripcionTotal = `${totalAsignado} asignados de ${globalPot} totales (${descripciones.join(', ')})`;
    } else {
      totalAsignado = globalPot;
    }

    updateGlobalData({
      ...nextData,
      demandaPotencial: totalAsignado,
      clientesPotenciales: totalAsignado,
      demanda_potencial: totalAsignado,
      calculoMensual: descripcionTotal,
      produccionMensual: totalAsignado,
      metricasAplicadas: metricasGlobales // Guardar métricas para la IA
    });
  };

  const handleGlobalChange = (val) => {
    const nextData = { ...globalData, mercadoTotalN: val };
    updateCalculations(nextData);
  };

  const handleChange = (prodId, val) => {
    const nextDemandas = { ...globalData.demandas };
    if (!nextDemandas[prodId]) nextDemandas[prodId] = {};
    nextDemandas[prodId].porcentajeAsignado = val;
    
    const nextData = { ...globalData, demandas: nextDemandas };
    updateCalculations(nextData);
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1',
    background: '#f8fafc', color: '#0f172a', marginTop: '0.5rem', fontSize: '1rem'
  };
  const labelStyle = { display: 'block', color: '#475569', fontWeight: 'bold', marginBottom: '0.25rem' };
  const groupStyle = { marginBottom: '1.5rem' };

  const elementos = listaProductos.length > 0 ? listaProductos : [{ id: 'general', tipo: 'General', nombre: 'Demanda General' }];

  return (
    <div style={{ padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' }}>
        Demanda potencial por mes
      </h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
          <Calculator size={24} color="#3b82f6" /> Cálculo de Demanda Mensual (Global)
        </h3>
        
        <div style={groupStyle}>
          <label style={labelStyle}>Población Total (N) - ¿A cuántas personas llega tu mercado?</label>
          <input type="number" value={mercadoTotalN} onChange={e => handleGlobalChange(e.target.value)} style={inputStyle} placeholder="Ej. 10000" />
        </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #cbd5e1', marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Info size={18} color="#64748b" />
              <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 'bold' }}>Fórmula de proyección basada en validación de Fase 2:</span>
            </div>
            
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#1e293b', background: '#e2e8f0', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
              Dmes = N × IN × IC × FC × QC
            </div>

            <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.5rem', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li><strong>Dmes:</strong> Demanda mensual estimada (unidades/mes)</li>
                <li><strong>N:</strong> Población total del mercado</li>
                <li><strong>IN:</strong> Índice de Necesidad (0 a 1)</li>
                <li><strong>IC:</strong> Índice de Intención de Compra (0 a 1)</li>
                <li><strong>FC:</strong> Frecuencia de Compra mensual (veces/mes)</li>
                <li><strong>QC:</strong> Cantidad por Compra (unidades/vez)</li>
              </ul>
            </div>
          
            {loadingMetricas ? (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Cargando métricas de Fase 2...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>IN (Necesidad)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: '0.25rem 0' }}>{metricasGlobales.IN}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Escala 0 a 1</div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>IC (Intención)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: '0.25rem 0' }}>{metricasGlobales.IC}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Escala 0 a 1</div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>FC (Frecuencia)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0.25rem 0' }}>{metricasGlobales.FC}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Veces por mes</div>
              </div>
              <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>QC (Cantidad)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b', margin: '0.25rem 0' }}>{metricasGlobales.QC}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Unidades por vez</div>
              </div>
            </div>
          )}

          <div style={{ padding: '1rem', background: '#3b82f615', borderRadius: '0.5rem', border: '1px solid #3b82f640', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ color: '#3b82f6', margin: '0 0 0.25rem 0' }}>Demanda Potencial Mensual (Dmes)</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>
                {dmesGlobal} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#64748b' }}>unidades/mes</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {listaProductos.length > 0 && (
        <>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center' }}>
            Distribución de demanda por producto/servicio
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {listaProductos.map((prod, idx) => {
              const d = demandas[prod.id] || {};
              const isProd = prod.tipo === 'Producto';
              const isServ = prod.tipo === 'Servicio';
              const color = isProd ? '#3b82f6' : (isServ ? '#8b5cf6' : '#ca8a04');
              const Icon = isProd ? Package : (isServ ? Wrench : Calculator);
              const pot = calcularPotencialIndividual(prod.id);
              
              let pctValue = d.porcentajeAsignado;
              if (pctValue === undefined || pctValue === null || pctValue === '') {
                 pctValue = (100 / listaProductos.length).toFixed(1);
                 if (pctValue.endsWith('.0')) pctValue = pctValue.slice(0, -2);
              }

              const nombreDetalle = prod.nombre ? `${prod.tipo}: ${prod.nombre}` : prod.tipo;

              return (
                <div key={prod.id || idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 250px' }}>
                    <div style={{ padding: '0.75rem', background: `${color}15`, borderRadius: '0.5rem', color: color }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Elemento {idx + 1}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{nombreDetalle}</div>
                    </div>
                  </div>
                  
                  <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Asignación (%)</label>
                    <input type="number" value={pctValue} onChange={e => handleChange(prod.id, e.target.value)} style={{ ...inputStyle, marginTop: 0, width: '100px' }} placeholder="Ej. 50" max="100" />
                  </div>

                  <div style={{ flex: '0 0 auto', padding: '0.75rem 1.5rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'right', minWidth: '150px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>Producción Mensual</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>{pot} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>unds</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {listaProductos.length > 0 && (
        <div style={{ background: '#0f172a', color: 'white', padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#94a3b8' }}>Producción Mensual Total (Suma asignada)</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{calcularTotalGeneral()} unidades</p>
          </div>
          <Calculator size={48} color="#10b981" opacity={0.5} />
        </div>
      )}

      {onComplete && (
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button 
            onClick={onComplete}
            disabled={guardando}
            style={{ 
              padding: '1rem 3rem', background: guardando ? '#cbd5e1' : '#10b981', color: 'white', 
              border: 'none', borderRadius: '0.5rem', cursor: guardando ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
            }}
          >
            {guardando ? 'Guardando...' : <><Save size={20} /> Guardar Fase 4 y Continuar</>}
          </button>
        </div>
      )}

    </div>
  );
};

export default Paso12_DemandaPotencial;
