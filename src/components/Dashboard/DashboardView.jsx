import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Rocket, BookOpen, Plus, Folder, User, Settings, Lightbulb, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cerrarSesion } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import MundoCard from './MundoCard';
import ProyectoItem from './ProyectoItem';
import ModalPagoQR from './ModalPagoQR';

const mundos = [
  { id: '55555555-5555-5555-5555-555555555555', rol: 'El Mentor', icon: <Lightbulb size={40} />, color: '#ca8a04', desc: 'Asistencia directa y funcional, sin simulaciones ni juegos de rol.' }
];

const DashboardView = ({ state, actions }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };
  if (state.loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
        Cargando Interfaz...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-background)', padding: 'var(--spacing-4xl) var(--spacing-2xl)', fontFamily: 'var(--font-family-base)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background elements */}
      <motion.div 
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1], rotate: [0, 5, 0] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-full)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} 
      />
      <motion.div 
        animate={{ y: [0, 40, 0], scale: [1, 1.1, 1], rotate: [0, -5, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '700px', height: '700px', background: 'var(--color-secondary-light)', borderRadius: 'var(--radius-full)', filter: 'blur(100px)', zIndex: 0, pointerEvents: 'none' }} 
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-2xl)' }}>
          <div>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'var(--font-size-5xl)', fontWeight: 'var(--font-weight-black)', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-0.04em', textShadow: 'var(--shadow-sm)' }}>
              Centro de Mando
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', marginTop: 'var(--spacing-md)', margin: 0, fontWeight: 'var(--font-weight-medium)' }}>
              Base de Operaciones Principal de la Agencia.
            </motion.p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            {!state.showMundos && state.proyectos.length > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => actions.toggleShowMundos(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', background: 'var(--gradient-primary)', color: 'var(--color-text-inverse)', border: 'none', padding: 'var(--spacing-md) var(--spacing-xl)', borderRadius: 'var(--radius-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
              >
                <Plus size={20} /> Nueva Misión
              </motion.button>
            )}
            {isAdmin && (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                onClick={actions.goToAdmin}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-solid)', color: 'var(--color-text-primary)', cursor: 'pointer', border: '1px solid var(--color-border-active)', boxShadow: 'var(--shadow-sm)', marginLeft: 'var(--spacing-md)' }}
                title="Panel de Administración"
              >
                <Settings size={24} />
              </motion.div>
            )}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              onClick={actions.goToProfile}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-solid)', color: 'var(--color-text-primary)', cursor: 'pointer', border: '1px solid var(--color-border-active)', boxShadow: 'var(--shadow-sm)', marginLeft: 'var(--spacing-md)' }}
              title="Mi Perfil"
            >
              <User size={24} />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-solid)', color: 'var(--color-danger)', cursor: 'pointer', border: '1px solid var(--color-border-active)', boxShadow: 'var(--shadow-sm)', marginLeft: 'var(--spacing-md)' }}
              title="Cerrar Sesión"
            >
              <LogOut size={24} />
            </motion.div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {state.showMundos && (
            <motion.div key="mundos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ marginBottom: 'var(--spacing-4xl)' }}>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2xl)' }}>Elige tu Arquetipo Operativo</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-xl)' }}>
                {mundos.map((mundo, idx) => (
                  <MundoCard 
                    key={mundo.id} 
                    mundo={mundo} 
                    idx={idx} 
                    onClick={actions.handleCrearProyecto} 
                  />
                ))}
              </div>
              {state.proyectos.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
                  <button onClick={() => actions.toggleShowMundos(false)} style={{ background: 'transparent', border: '1px solid var(--color-text-tertiary)', color: 'var(--color-text-secondary)', padding: 'var(--spacing-sm) var(--spacing-xl)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 'var(--font-weight-semibold)' }}>
                    Cancelar Selección
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {state.proyectos.length > 0 && !state.showMundos && (
            <motion.div key="proyectos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <Folder color="var(--color-primary)" /> Archivos Activos
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {state.proyectos.map((proyecto, idx) => (
                  <ProyectoItem 
                    key={proyecto.id}
                    proyecto={proyecto}
                    idx={idx}
                    isEditing={state.editingId === proyecto.id}
                    editTitle={state.editTitle}
                    onRetomar={actions.handleRetomarProyecto}
                    onEliminar={actions.handleEliminarProyecto}
                    onIniciarEdicion={actions.iniciarEdicion}
                    onCancelarEdicion={actions.cancelarEdicion}
                    onGuardarEdicion={actions.guardarEdicion}
                    onEditTitleChange={actions.setEditTitle}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <ModalPagoQR 
        isOpen={state.isQrModalOpen}
        onClose={actions.closeQrModal}
        onConfirm={actions.handleConfirmarPago}
        qrUrl={state.qrUrl}
      />
    </div>
  );
};

export default DashboardView;
