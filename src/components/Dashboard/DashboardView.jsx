import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Rocket, BookOpen, Plus, Folder, User, Settings, Lightbulb, LogOut, Coins } from 'lucide-react';
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
  const { isAdmin, perfil } = useAuth();
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
            {state.versiculoRandom && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.5rem 2rem', 
                  background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)', 
                  borderRadius: '1.5rem', 
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderLeft: '4px solid var(--color-primary)', 
                  maxWidth: '700px',
                  boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '1rem', color: 'var(--color-primary)' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--color-text-primary)', fontStyle: 'italic', fontSize: '1.15rem', lineHeight: 1.6, fontWeight: 500, letterSpacing: '0.01em' }}>
                    "{state.versiculoRandom.texto}"
                  </p>
                  <p style={{ margin: '0.75rem 0 0 0', color: 'var(--color-primary)', fontWeight: '800', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    — {state.versiculoRandom.cita}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                color: '#ca8a04',
                padding: '0 var(--spacing-lg)',
                borderRadius: 'var(--radius-full)',
                fontWeight: 'bold',
                cursor: 'default',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Tus EduCoins actuales"
            >
              <Coins size={20} />
              <span>{perfil?.educoins || 0}</span>
            </motion.div>
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

        <AnimatePresence>
          {!isAdmin && (perfil?.educoins || 0) <= 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderLeft: '4px solid #ef4444',
                padding: '1.5rem',
                borderRadius: '1rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '0.5rem', color: '#ef4444' }}>
                <Shield size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ef4444', fontWeight: 'bold' }}>Suministros Agotados (0 EduCoins)</h3>
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-secondary)' }}>
                  Tu saldo actual es insuficiente para iniciar nuevas misiones o continuar operativos vigentes. Por favor, <strong>contacta a tu administrador al celular/WhatsApp {state.numeroAdmin} para solicitar una recarga</strong>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
