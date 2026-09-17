const fs = require('fs');

const file = 'd:/estudiante/plataforma-gamificada/src/pages/Fase6_LocalizacionDistribucion.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const cardStyle = \{[\s\S]*?case 13:/;

const replacement = `const wrapperStyle = { padding: '2rem', color: '#0f172a', maxWidth: '800px', margin: '0 auto' };
  const cardStyle = { background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' };
  const titleStyle = { fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04', marginBottom: '1.5rem', textAlign: 'center' };
  const groupStyle = { marginBottom: '1.5rem' };
  const labelStyle = { display: 'block', color: '#475569', fontWeight: 'bold', marginBottom: '0.25rem' };
  const inputStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', marginTop: '0.5rem', fontSize: '1rem', outline: 'none' };
  const textStyle = { color: '#475569', marginBottom: '2rem', textAlign: 'center' };

  const getPasoContent = () => {
    switch(step) {
      case 1: return renderVideoStep("1. Distribución", "distribucion", "Planear Distribución");
      case 2: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>2. Canales de Distribución</h2>
          <p style={textStyle}>¿Cómo va a llegar el producto al cliente?</p>
          <div style={cardStyle}>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Cómo voy a vender el producto?</label>
              <select style={inputStyle} value={data.distComoVender} onChange={(e) => updateGlobalData({ distComoVender: e.target.value })}>
                <option value="">Selecciona una opción...</option>
                <option value="punto de venta">En el punto de venta (Quiosco, local, feria)</option>
                <option value="encargo">Por encargo (Punto de recogida acordado)</option>
                <option value="delivery">Delivery (En la casa del cliente)</option>
                <option value="encuentro">Punto de encuentro (Lugar neutral acordado)</option>
                <option value="virtual">Virtual (En línea, Zoom, WhatsApp)</option>
              </select>
            </div>
            
            {data.distComoVender && data.distComoVender !== 'virtual' && (
              <div style={groupStyle}>
                <label style={labelStyle}>¿Dónde voy a vender mi producto? (Especifica la ubicación física)</label>
                <input style={inputStyle} value={data.distDondeVender} onChange={(e) => updateGlobalData({ distDondeVender: e.target.value })} placeholder="Ej: Puerta del colegio, casa del vendedor, parque central..." />
              </div>
            )}
            
            {data.distComoVender === 'virtual' && (
              <div style={groupStyle}>
                <label style={labelStyle}>¿Qué plataforma usarás para vender?</label>
                <input style={inputStyle} value={data.distDondeVender} onChange={(e) => updateGlobalData({ distDondeVender: e.target.value })} placeholder="Ej: WhatsApp, Zoom, Correo Electrónico..." />
              </div>
            )}
          </div>
        </div>
      );
      case 3: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>3. Identificación de la Localización</h2>
          <p style={textStyle}>¿Dónde se llevarán a cabo las actividades principales de tu negocio?</p>
          
          <div style={cardStyle}>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Dónde voy a producir o preparar mi producto?</label>
              <input style={inputStyle} value={data.dondeProducir} onChange={(e) => updateGlobalData({ dondeProducir: e.target.value })} placeholder="Ej: En la cocina de mi casa..." />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Dónde voy a vender mi producto?</label>
              <input style={inputStyle} value={data.dondeVender} onChange={(e) => updateGlobalData({ dondeVender: e.target.value })} placeholder="Ej: En el patio del colegio en los recreos..." />
            </div>
            <div style={groupStyle}>
              <label style={labelStyle}>¿Dónde voy a almacenar mis materiales?</label>
              <input style={inputStyle} value={data.dondeAlmacenar} onChange={(e) => updateGlobalData({ dondeAlmacenar: e.target.value })} placeholder="Ej: En una bodega en mi cuarto..." />
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div style={{ ...wrapperStyle, maxWidth: '1000px' }}>
          <h2 style={titleStyle}>4. Justificación de la Localización</h2>
          <p style={textStyle}>Demuestra por qué elegiste estos lugares y si son viables.</p>
          
          <div style={cardStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>¿Por qué elegí este lugar?</label>
                <textarea style={{ ...inputStyle, minHeight: '80px' }} value={data.porqueLugar} onChange={(e) => updateGlobalData({ porqueLugar: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>¿Está cerca de mis clientes?</label>
                <textarea style={{ ...inputStyle, minHeight: '80px' }} value={data.cercaClientes} onChange={(e) => updateGlobalData({ cercaClientes: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>¿Es accesible y seguro?</label>
                <textarea style={{ ...inputStyle, minHeight: '80px' }} value={data.accesibleSeguro} onChange={(e) => updateGlobalData({ accesibleSeguro: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>¿Tiene los servicios necesarios? (agua, luz, espacio)</label>
                <textarea style={{ ...inputStyle, minHeight: '80px' }} value={data.servicios} onChange={(e) => updateGlobalData({ servicios: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>¿Cuánto cuesta el alquiler o uso del espacio?</label>
                <input style={inputStyle} value={data.costoAlquiler} onChange={(e) => updateGlobalData({ costoAlquiler: e.target.value })} placeholder="Ej: Es gratis (mi casa) o $50 al mes" />
              </div>
              <div>
                <label style={labelStyle}>¿Necesito algún permiso para usar este lugar?</label>
                <input style={inputStyle} value={data.permisos} onChange={(e) => updateGlobalData({ permisos: e.target.value })} placeholder="Ej: Permiso de la directora" />
              </div>
            </div>
          </div>
        </div>
      );
      case 5: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>5. Croquis o Mapa</h2>
          <p style={textStyle}>Dibuja o describe cómo llegar a tu ubicación y sus puntos de referencia.</p>
          
          <div style={cardStyle}>
            <div style={{ border: '3px dashed #cbd5e1', borderRadius: '1rem', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', cursor: 'pointer', background: '#f8fafc' }}>
              <ImagePlus size={64} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <span style={{ fontWeight: 'bold', color: '#64748b' }}>Haz clic aquí para subir una imagen de tu croquis</span>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>(Funcionalidad en construcción, usa la descripción por ahora)</span>
            </div>
            
            <div>
              <label style={labelStyle}>Descripción del Croquis (Ubicación, accesos, puntos de referencia):</label>
              <textarea style={{ ...inputStyle, minHeight: '150px' }} 
                value={data.croquisDescripcion} 
                onChange={(e) => updateGlobalData({ croquisDescripcion: e.target.value })} 
                placeholder="Ej: Mi quiosco estará ubicado justo al lado de la cancha de fútbol, frente a las escaleras principales..."
              />
            </div>
          </div>
        </div>
      );
      case 6: return (
        <div style={{ ...wrapperStyle, maxWidth: '1000px' }}>
          <h2 style={titleStyle}>6. Elección del Lugar (Ubicación)</h2>
          <p style={textStyle}>Compara y califica del 1 al 5 cada ubicación posible (1 es malo, 5 es excelente).</p>
          
          <div style={{ ...cardStyle, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#475569' }}>Criterio (1-5)</th>
                  {data.lugares.map((l, i) => (
                    <th key={l.id} style={{ padding: '1rem', minWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <input 
                          style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 'bold', color: '#0f172a', textAlign: 'center', outline: 'none' }}
                          value={l.nombre} 
                          onChange={(e) => {
                            const n = [...data.lugares]; n[i].nombre = e.target.value; updateGlobalData({ lugares: n });
                          }} 
                          placeholder={\`Ubicación \${i+1}\`} 
                        />
                        {data.lugares.length > 1 && (
                          <button onClick={() => updateGlobalData({ lugares: data.lugares.filter(loc => loc.id !== l.id) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => updateGlobalData({ lugares: [...data.lugares, { id: Date.now(), nombre: '', cercania: 1, flujo: 1, visibilidad: 1, costo: 1, permisos: 1 }] })} 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      <Plus size={16} /> Añadir
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'cercania', label: 'Cercanía al cliente' },
                  { key: 'flujo', label: 'Flujo de personas' },
                  { key: 'visibilidad', label: 'Visibilidad' },
                  { key: 'costo', label: 'Costo bajo' },
                  { key: 'permisos', label: 'Facilidad de permisos' }
                ].map(crit => (
                  <tr key={crit.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#475569' }}>{crit.label}</td>
                    {data.lugares.map((l, i) => (
                      <td key={\`\${crit.key}-\${l.id}\`} style={{ padding: '1rem' }}>
                        <select 
                          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', color: '#0f172a', fontWeight: 'bold', outline: 'none' }}
                          value={l[crit.key]} 
                          onChange={(e) => {
                            const n = [...data.lugares]; n[i][crit.key] = parseInt(e.target.value); updateGlobalData({ lugares: n });
                          }}
                        >
                          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </td>
                    ))}
                    <td></td>
                  </tr>
                ))}
                <tr style={{ background: '#eff6ff', borderTop: '2px solid #bfdbfe' }}>
                  <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1e40af' }}>PUNTAJE TOTAL</td>
                  {data.lugares.map((l) => (
                    <td key={\`total-\${l.id}\`} style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '900', color: '#2563eb', fontSize: '1.5rem' }}>
                        {l.cercania + l.flujo + l.visibilidad + l.costo + l.permisos}
                      </span>
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
      case 7: return renderVideoStep("7. Cómo entregar el producto", "entregar", "Continuar");
      case 8: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>8. Logística de Entrega</h2>
          <p style={textStyle}>Detalla exactamente cómo vas a hacer llegar tu producto a las manos de tu cliente.</p>
          <div style={cardStyle}>
            <textarea style={{ ...inputStyle, minHeight: '150px' }} 
              value={data.comoEntregar} 
              onChange={(e) => updateGlobalData({ comoEntregar: e.target.value })} 
              placeholder="Ej: Si es delivery, lo llevaré en una mochila térmica. Si es en persona, lo tendré en un envase plástico..."
            />
          </div>
        </div>
      );
      case 9: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>9. Métodos de Pago</h2>
          <p style={textStyle}>¿Cómo vas a recibir el dinero?</p>
          <div style={cardStyle}>
            <input style={inputStyle} 
              value={data.comoRecibirPago} 
              onChange={(e) => updateGlobalData({ comoRecibirPago: e.target.value })} 
              placeholder="Ej: Efectivo, transferencia, Yape, Plin..."
            />
          </div>
        </div>
      );
      case 10: return (
        <div style={wrapperStyle}>
          <h2 style={titleStyle}>10. Necesidades de Distribución</h2>
          <p style={textStyle}>¿Qué equipo físico necesitas para vender o entregar?</p>
          <div style={cardStyle}>
            <textarea style={{ ...inputStyle, minHeight: '150px' }} 
              value={data.necesidadesDistribucion} 
              onChange={(e) => updateGlobalData({ necesidadesDistribucion: e.target.value })} 
              placeholder="Ej: Necesito una mesa plegable, mantel, bolsas de papel y un letrero..."
            />
          </div>
        </div>
      );
      case 11: return renderVideoStep("11. Plan de acción de distribución", "acciondistribucion", "Hacer Plan");
      case 12: return (
        <div style={{ ...wrapperStyle, maxWidth: '1000px' }}>
          <h2 style={titleStyle}>12. Plan de Acción de Distribución</h2>
          <p style={textStyle}>Define los pasos exactos para que la distribución se haga realidad.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {data.planDistribucion.map((plan, i) => (
              <div key={plan.id} style={{ ...cardStyle, position: 'relative' }}>
                <button onClick={() => updateGlobalData({ planDistribucion: data.planDistribucion.filter(p => p.id !== plan.id) })} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Eliminar paso">
                  <Trash2 size={20} />
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingRight: '2rem' }}>
                  <div>
                    <label style={labelStyle}>Acción</label>
                    <input style={inputStyle} value={plan.accion} placeholder="¿Qué hacer?" onChange={(e) => { const n = [...data.planDistribucion]; n[i].accion = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Cuándo?</label>
                    <input style={inputStyle} value={plan.cuando} placeholder="Fecha o momento" onChange={(e) => { const n = [...data.planDistribucion]; n[i].cuando = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Quién lo hace?</label>
                    <input style={inputStyle} value={plan.quien} placeholder="Responsable" onChange={(e) => { const n = [...data.planDistribucion]; n[i].quien = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Qué necesito?</label>
                    <input style={inputStyle} value={plan.necesito} placeholder="Recursos" onChange={(e) => { const n = [...data.planDistribucion]; n[i].necesito = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => updateGlobalData({ planDistribucion: [...data.planDistribucion, { id: Date.now(), accion: '', cuando: '', quien: '', necesito: '' }] })} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>+ Añadir Acción</button>
        </div>
      );
      case 13:`;

content = content.replace(regex, replacement);

const regex2 = /const total = data\.presupuesto[\s\S]*?default: return <div>Paso no definido<\/div>;\n    \}/;
const replacement2 = `const total = data.presupuesto.reduce((acc, curr) => acc + (curr.costoUnitario * curr.cantidad), 0);
        return (
        <div style={{ ...wrapperStyle, maxWidth: '1000px' }}>
          <h2 style={titleStyle}>13. Presupuesto de Promoción y Distribución</h2>
          <p style={textStyle}>Calcula cuánto te costará promocionar y entregar tu producto.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {data.presupuesto.map((p, i) => (
              <div key={p.id} style={{ ...cardStyle, position: 'relative' }}>
                <button onClick={() => updateGlobalData({ presupuesto: data.presupuesto.filter(item => item.id !== p.id) })} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Eliminar gasto">
                  <Trash2 size={20} />
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingRight: '2rem' }}>
                  <div>
                    <label style={labelStyle}>Concepto</label>
                    <input style={inputStyle} value={p.concepto} placeholder="Nombre del gasto" onChange={(e) => { const n = [...data.presupuesto]; n[i].concepto = e.target.value; updateGlobalData({ presupuesto: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Costo Unitario ($)</label>
                    <input type="number" min="0" style={inputStyle} value={p.costoUnitario === 0 && !p.costoUnitario.toString().includes('0') ? '' : p.costoUnitario} placeholder="0" onChange={(e) => { const n = [...data.presupuesto]; n[i].costoUnitario = parseFloat(e.target.value) || 0; updateGlobalData({ presupuesto: n }); }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Cantidad</label>
                    <input type="number" min="1" style={inputStyle} value={p.cantidad || ''} placeholder="1" onChange={(e) => { const n = [...data.presupuesto]; n[i].cantidad = parseInt(e.target.value) || 1; updateGlobalData({ presupuesto: n }); }} />
                  </div>
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Subtotal:</span>
                  <span style={{ marginLeft: '0.5rem', fontWeight: 'bold', color: '#1d4ed8', fontSize: '1.25rem' }}>$\${((p.costoUnitario || 0) * (p.cantidad || 1)).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={() => updateGlobalData({ presupuesto: [...data.presupuesto, { id: Date.now(), concepto: '', costoUnitario: 0, cantidad: 1 }] })} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', marginBottom: '2rem' }}>+ Añadir Gasto</button>
          
          <div style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)', padding: '2rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div>
              <p style={{ margin: 0, color: '#bfdbfe', fontWeight: 'bold' }}>Presupuesto Total Estimado</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#e0e7ff' }}>Suma de todos los conceptos</p>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>$\${total.toFixed(2)}</div>
          </div>
        </div>
      );
      default: return <div>Paso no definido</div>;
    }`;

content = content.replace(regex2, replacement2);
fs.writeFileSync(file, content);
console.log('Done replacing styles.');
