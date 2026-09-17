                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button onClick={handleSiguiente} style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Entendido, a la acción</button>
                </div>
              </motion.div>
            )}

            {/* 3. Formulario de Observación */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '2rem' }}>Observación del Entorno</h2>
                
                {observaciones.map((obs, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 relative">
                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      Problema detectado {idx + 1}
                      {observaciones.length > 1 && (
                        <button 
                          onClick={() => setObservaciones(observaciones.filter((_, i) => i !== idx))}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Trash2 size={18} /> Eliminar
                        </button>
                      )}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>1. El Protagonista: ¿Quién tiene este problema?</label>
                        <input type="text" value={obs.protagonista} onChange={e => { const newObs = [...observaciones]; newObs[idx].protagonista = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: Jóvenes estudiantes universitarios..." className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>2. El Contexto: ¿En qué momento o situación ocurre?</label>
                        <input type="text" value={obs.contexto} onChange={e => { const newObs = [...observaciones]; newObs[idx].contexto = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: Durante la época de exámenes..." className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>3. El Dolor: ¿Qué problema o necesidad específica sufren?</label>
                        <input type="text" value={obs.dolor} onChange={e => { const newObs = [...observaciones]; newObs[idx].dolor = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: No tienen tiempo para preparar comida saludable..." className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>4. La Tarea (Job): ¿Qué intentan lograr en realidad?</label>
                        <input type="text" value={obs.tarea} onChange={e => { const newObs = [...observaciones]; newObs[idx].tarea = e.target.value; setObservaciones(newObs); }} onBlur={autoGuardar} placeholder="Ej: Alimentarse bien sin perder horas de estudio..." className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setObservaciones([...observaciones, { protagonista: '', contexto: '', dolor: '', tarea: '' }])}
                  style={{ width: '100%', padding: '1.5rem', background: 'transparent', border: '2px dashed #ca8a04', color: '#ca8a04', borderRadius: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem', transition: 'all 0.2s', marginTop: '1rem' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fefce8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <PlusCircle size={20} /> Añadir otro problema
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button 
                  onClick={handleSiguiente} 
                  style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  Siguiente
                </button>
                </div>
              </motion.div>
            )}

            {/* 4. Recurso Fricciones */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>{mentorData.teoria_caminos?.recursos?.fricciones?.titulo || "¿Por qué fallan las soluciones?"}</h3>
                <div style={{ background: '#000', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={mentorData.teoria_caminos?.recursos?.fricciones?.url || "https://www.youtube.com/embed/z4vG_y-J15o"} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button onClick={handleSiguiente} style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Entendido, a la acción</button>
                </div>
              </motion.div>
            )}

            {/* 5. Formulario de Fricciones */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '2rem' }}>Análisis de Fricciones</h2>
                
                {observaciones.map((obs, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.3rem' }}>
                      Fricciones del Problema {idx + 1}
                    </h3>
                    <div style={{ padding: '1.5rem', background: '#e2e8f0', borderRadius: '1rem', marginBottom: '2rem', fontSize: '1.1rem', fontStyle: 'italic', color: '#334155' }}>
                      "{generarFraseProblema(obs)}"
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>5. Solución Actual: ¿Cómo lo resuelven hoy?</label>
                        <input type="text" value={fricciones[idx]?.solucionActual || ''} onChange={e => { const newF = [...fricciones]; if(!newF[idx]) newF[idx] = {solucionActual: '', friccion: '', solucionIdeal: ''}; newF[idx].solucionActual = e.target.value; setFricciones(newF); }} onBlur={autoGuardar} placeholder="Ej: Piden comida chatarra a domicilio..." className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>6. Fricción: ¿Por qué esa solución es frustrante?</label>
                        <input type="text" value={fricciones[idx]?.friccion || ''} onChange={e => { const newF = [...fricciones]; if(!newF[idx]) newF[idx] = {solucionActual: '', friccion: '', solucionIdeal: ''}; newF[idx].friccion = e.target.value; setFricciones(newF); }} onBlur={autoGuardar} placeholder="Ej: Es caro y les hace sentir cansados/pesados..." className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label style={{ fontWeight: 'bold', color: '#334155' }}>7. La Solución Ideal: ¿Qué tendría que tener tu idea para hacerlos felices?</label>
                        <input type="text" value={fricciones[idx]?.solucionIdeal || ''} onChange={e => { const newF = [...fricciones]; if(!newF[idx]) newF[idx] = {solucionActual: '', friccion: '', solucionIdeal: ''}; newF[idx].solucionIdeal = e.target.value; setFricciones(newF); }} onBlur={autoGuardar} placeholder="Ej: Comida sana, rápida, barata y que llegue directo a la U..." className="w-full p-3 rounded-lg border border-slate-300 mt-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button onClick={handleSiguiente} style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>Siguiente</button>
                </div>
              </motion.div>
            )}

            {/* 6. Recurso Ideación */}
            {step === 6 && (
              <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>{mentorData.teoria_caminos?.recursos?.ideacion?.titulo || "Video: Brainstorming Efectivo"}</h3>
                <div style={{ background: '#000', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={mentorData.teoria_caminos?.recursos?.ideacion?.url?.includes('youtube') || mentorData.teoria_caminos?.recursos?.ideacion?.url?.includes('vimeo') ? mentorData.teoria_caminos.recursos.ideacion.url : "https://www.youtube.com/embed/pWp1-WvU7K8"} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                  {step > 1 && (
                    <button 
                      onClick={logic.handleAnterior}
                      style={{ padding: '1rem 2rem', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      ← Volver
                    </button>
                  )}
                  <button 
                  onClick={() => {
                    handleSiguiente();
                    solicitarIdeasIA();
                  }} 
                  style={{ padding: '1rem 2rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', }}>
                  <Bot size={24} /> Entendido, generar ideas con IA
                </button>
                </div>
              </motion.div>
            )}

            {/* 7. Lluvia de Ideas */}
            {step === 7 && (
              <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '1rem' }}>Lluvia de Ideas y Asistencia IA</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>Selecciona hasta 3 ideas geniales para llevar a la batalla final.</p>
                
                {generandoIA ? (
                  <div style={{ textAlign: 'center', padding: '2rem', background: '#fefce8', borderRadius: '1rem' }}>
                    <Zap size={32} color="#ca8a04" style={{ animation: 'pulse 2s infinite' }} />
                    <p style={{ fontWeight: 'bold', color: '#854d0e', marginTop: '1rem' }}>El Asistente IA está analizando tu dolor y solución ideal...</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
