const fs = require('fs');
let content = fs.readFileSync('src/pages/Fase6_Distribucion.jsx', 'utf8');

const regex = /const getPasoContent = \(\) => \{[\s\S]*?default: return <div>Paso no definido<\/div>;\s*\}\s*\};/m;

const newSwitch = const getPasoContent = () => {
    switch(step) {
      case 1: return renderVideoStep("1. Distribución", "distribucion", "Planear Distribución");
      case 2: return (
        <div style={cardStyle}>
          <h2 style={titleStyle}>2. Canales de Distribución</h2>
          <p style={subtitleStyle}>¿Cómo va a llegar el producto al cliente?</p>
          <div>
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
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">3. Elección del Lugar (Ubicación)</h2>
          <p className="text-slate-500 mb-6">Compara y califica del 1 al 5 cada ubicación posible (1 es malo, 5 es excelente).</p>
          
          <div className="overflow-x-auto mt-6">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="p-4 text-left font-bold text-slate-700 w-1/4">Criterio (1-5)</th>
                  {data.lugares.map((l, i) => (
                    <th key={l.id} className="p-4 min-w-[160px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center justify-center gap-2 w-full bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <input 
                            className="font-bold text-slate-800 focus:border-blue-500 outline-none text-center bg-transparent w-full" 
                            value={l.nombre} 
                            onChange={(e) => {
                              const n = [...data.lugares]; n[i].nombre = e.target.value; updateGlobalData({ lugares: n });
                            }} 
                            placeholder={\Ubicación \\} 
                          />
                          {data.lugares.length > 1 && (
                            <button onClick={() => updateGlobalData({ lugares: data.lugares.filter(loc => loc.id !== l.id) })} className="text-slate-400 hover:text-red-500 p-1" title="Eliminar">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="p-4 w-[120px]">
                    <button 
                      onClick={() => updateGlobalData({ lugares: [...data.lugares, { id: Date.now(), nombre: '', cercania: 1, flujo: 1, visibilidad: 1, costo: 1, permisos: 1 }] })} 
                      className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 p-2 rounded-lg whitespace-nowrap transition-colors w-full"
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
                  <tr key={crit.key} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-left text-sm font-semibold text-slate-700">{crit.label}</td>
                    {data.lugares.map((l, i) => (
                      <td key={\\-\\} className="p-4">
                        <select 
                          className="p-2 border border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none cursor-pointer text-center w-20 text-base font-medium" 
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
                <tr className="bg-blue-50 border-t-2 border-blue-200">
                  <td className="p-4 text-left font-bold text-blue-800">PUNTAJE TOTAL</td>
                  {data.lugares.map((l) => (
                    <td key={\	otal-\\} className="p-4">
                      <span className="font-black text-blue-600 text-2xl">
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
      case 4: return renderVideoStep("4. Cómo entregar el producto", "entregar", "Continuar");
      case 5: return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">5. Logística de Entrega</h2>
          <p className="text-slate-500 mb-6">Detalla exactamente cómo vas a hacer llegar tu producto a las manos de tu cliente.</p>
          <textarea className="w-full p-4 border rounded-xl text-lg min-h-[150px]" 
            value={data.comoEntregar} 
            onChange={(e) => updateGlobalData({ comoEntregar: e.target.value })} 
            placeholder="Ej: Si es delivery, lo llevaré en una mochila térmica. Si es en persona, lo tendré en un envase plástico..."
          />
        </div>
      );
      case 6: return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">6. Métodos de Pago</h2>
          <p className="text-slate-500 mb-6">¿Cómo vas a recibir el dinero?</p>
          <input className="w-full p-4 border rounded-xl text-lg" 
            value={data.comoRecibirPago} 
            onChange={(e) => updateGlobalData({ comoRecibirPago: e.target.value })} 
            placeholder="Ej: Efectivo, transferencia, Yape, Plin..."
          />
        </div>
      );
      case 7: return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">7. Necesidades de Distribución</h2>
          <p className="text-slate-500 mb-6">¿Qué equipo físico necesitas para vender o entregar?</p>
          <textarea className="w-full p-4 border rounded-xl text-lg min-h-[150px]" 
            value={data.necesidadesDistribucion} 
            onChange={(e) => updateGlobalData({ necesidadesDistribucion: e.target.value })} 
            placeholder="Ej: Necesito una mesa plegable, mantel, bolsas de papel y un letrero..."
          />
        </div>
      );
      case 8: return renderVideoStep("8. Plan de acción de distribución", "acciondistribucion", "Hacer Plan");
      case 9: return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">9. Plan de Acción de Distribución</h2>
          <p className="text-slate-500 mb-6">Define los pasos exactos para que la distribución se haga realidad.</p>
          
          <div className="flex flex-col gap-4 mt-6 mb-4">
            {data.planDistribucion.map((plan, i) => (
              <div key={plan.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative hover:shadow-md transition-shadow">
                <button onClick={() => updateGlobalData({ planDistribucion: data.planDistribucion.filter(p => p.id !== plan.id) })} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Eliminar paso">
                  <Trash2 size={20} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 pr-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Acción</label>
                    <input className="w-full p-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white" value={plan.accion} placeholder="¿Qué hacer?" onChange={(e) => { const n = [...data.planDistribucion]; n[i].accion = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">¿Cuándo?</label>
                    <input className="w-full p-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white" value={plan.cuando} placeholder="Fecha o momento" onChange={(e) => { const n = [...data.planDistribucion]; n[i].cuando = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">¿Quién lo hace?</label>
                    <input className="w-full p-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white" value={plan.quien} placeholder="Responsable" onChange={(e) => { const n = [...data.planDistribucion]; n[i].quien = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">¿Qué necesito?</label>
                    <input className="w-full p-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white" value={plan.necesito} placeholder="Recursos" onChange={(e) => { const n = [...data.planDistribucion]; n[i].necesito = e.target.value; updateGlobalData({ planDistribucion: n }); }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => updateGlobalData({ planDistribucion: [...data.planDistribucion, { id: Date.now(), accion: '', cuando: '', quien: '', necesito: '' }] })} className="text-blue-600 font-bold hover:underline">+ Añadir Acción</button>
        </div>
      );
      case 10: 
        const total = data.presupuesto.reduce((acc, curr) => acc + (curr.costoUnitario * curr.cantidad), 0);
        return (
        <div className="animate-fade-in p-6 bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">10. Presupuesto de Promoción y Distribución</h2>
          <p className="text-slate-500 mb-6">Calcula cuánto te costará promocionar y entregar tu producto.</p>
          
          <div className="flex flex-col gap-4 mt-6 mb-4">
            {data.presupuesto.map((p, i) => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative hover:shadow-md transition-shadow">
                <button onClick={() => updateGlobalData({ presupuesto: data.presupuesto.filter(item => item.id !== p.id) })} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Eliminar gasto">
                  <Trash2 size={20} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 pr-10">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Concepto</label>
                    <input className="w-full p-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white" value={p.concepto} placeholder="Nombre del gasto" onChange={(e) => { const n = [...data.presupuesto]; n[i].concepto = e.target.value; updateGlobalData({ presupuesto: n }); }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Costo Unitario ($)</label>
                    <input type="number" min="0" className="w-full p-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white" value={p.costoUnitario || ''} placeholder="0" onChange={(e) => { const n = [...data.presupuesto]; n[i].costoUnitario = parseFloat(e.target.value) || 0; updateGlobalData({ presupuesto: n }); }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Cantidad</label>
                    <input type="number" min="1" className="w-full p-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white" value={p.cantidad || ''} placeholder="1" onChange={(e) => { const n = [...data.presupuesto]; n[i].cantidad = parseInt(e.target.value) || 1; updateGlobalData({ presupuesto: n }); }} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <div className="text-right">
                    <span className="text-slate-500 text-sm">Subtotal:</span>
                    <span className="ml-2 font-bold text-blue-700 text-lg"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={() => updateGlobalData({ presupuesto: [...data.presupuesto, { id: Date.now(), concepto: '', costoUnitario: 0, cantidad: 1 }] })} className="text-blue-600 font-bold hover:underline mb-8">+ Añadir Gasto</button>
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg flex justify-between items-center text-white">
            <div>
              <p className="text-blue-100 mb-1">Presupuesto Total Estimado</p>
              <p className="text-sm text-blue-200">Suma de todos los conceptos</p>
            </div>
            <div className="text-4xl font-black"></div>
          </div>
        </div>
      );
      default: return <div>Paso no definido</div>;
    }
  };;

content = content.replace(regex, newSwitch);
fs.writeFileSync('src/pages/Fase6_Distribucion.jsx', content);
