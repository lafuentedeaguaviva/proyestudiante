import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, Briefcase, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Paso1_RolesResponsabilidades({ setAyudanteText, onComplete, onBack }) {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentRole, setCurrentRole] = useState({ id: null, title: '', responsibilities: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setAyudanteText(`¡Fase 6: Estructura Organizacional! 🏢<br/><br/>Toda gran empresa necesita un gran equipo. Define los <b>cargos clave</b> para que tu negocio funcione y qué hará cada persona.`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddRole = () => {
    setCurrentRole({ id: Date.now(), title: '', responsibilities: '' });
    setShowForm(true);
    setError('');
  };

  const handleSaveRole = () => {
    if (!currentRole.title.trim() || !currentRole.responsibilities.trim()) {
      setError('Debes llenar el cargo y sus responsabilidades.');
      return;
    }
    
    setRoles(prev => [...prev, currentRole]);
    setShowForm(false);
    setCurrentRole({ id: null, title: '', responsibilities: '' });
    setError('');
  };

  const handleRemoveRole = (id) => {
    setRoles(prev => prev.filter(role => role.id !== id));
  };

  const handleComplete = () => {
    if (roles.length === 0) {
      setError('¡Debes agregar al menos un cargo a tu equipo!');
      return;
    }
    onComplete({ roles });
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ChevronLeft size={20} /> Atrás
        </button>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Users color="var(--primary)" /> Estructura Organizativa
        </h2>
        <div style={{ width: '100px' }}></div> {/* Spacer */}
      </div>

      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel"
            style={{ padding: '2rem' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                Arma tu equipo ideal. Crea credenciales para cada puesto clave.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <AnimatePresence>
                {roles.map(role => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -5 }}
                    style={{
                      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}
                  >
                    <button 
                      onClick={() => handleRemoveRole(role.id)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.2rem' }}
                      title="Eliminar cargo"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                      <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Briefcase size={20} color="#fff" />
                      </div>
                      <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem', wordBreak: 'break-word' }}>
                        {role.title}
                      </h3>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Responsabilidades</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {role.responsibilities}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Botón para agregar */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddRole}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px dashed rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  minHeight: '200px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Plus size={40} />
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Añadir Cargo</span>
              </motion.button>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </motion.p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                className="btn-primary" 
                onClick={handleComplete} 
                disabled={roles.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 3rem', fontSize: '1.2rem' }}
              >
                Continuar <ChevronRight size={20} />
              </button>
            </div>

          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel"
            style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <ShieldCheck size={50} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.8rem', margin: 0 }}>Nuevo Cargo</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Define el puesto y sus funciones</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Nombre del Cargo (Ej. Gerente de Ventas)</label>
              <input 
                type="text" 
                value={currentRole.title}
                onChange={e => setCurrentRole({...currentRole, title: e.target.value})}
                placeholder="Escribe el cargo aquí..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  fontSize: '1.1rem',
                  outline: 'none'
                }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Responsabilidades Principales</label>
              <textarea 
                value={currentRole.responsibilities}
                onChange={e => setCurrentRole({...currentRole, responsibilities: e.target.value})}
                placeholder="¿Qué tareas realizará esta persona diariamente? Ej: Vender, atender clientes, manejar caja..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  fontSize: '1.1rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setShowForm(false)}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSaveRole}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <CheckCircle2 size={20} /> Guardar Cargo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
