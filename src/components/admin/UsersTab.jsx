import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, ShieldCheck, ShieldOff, PlusCircle } from 'lucide-react';
import { obtenerTodosLosUsuarios, cambiarRolUsuario, recargarEducoins } from '../../services/api';

const UsersTab = ({ usuarios, setUsuarios, loadingUsuarios, setLoadingUsuarios, totalAdmins, setTotalAdmins, cambiadoRolId, setCambiadoRolId, currentUserId, setMessage }) => {

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const data = await obtenerTodosLosUsuarios();
      setUsuarios(data);
      setTotalAdmins(data.filter(u => u.rol === 'admin').length);
    } catch (err) {
      setMessage({ text: `Error cargando usuarios: ${err.message}`, type: 'error' });
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleRecargar = async (targetUserId, currentName) => {
    const amountStr = window.prompt(`¿Cuántos EduCoins deseas agregar a ${currentName}?`, '50');
    if (!amountStr) return;
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ text: 'Cantidad inválida.', type: 'error' });
      return;
    }
    setCambiadoRolId(targetUserId);
    try {
      await recargarEducoins(targetUserId, amount);
      setMessage({ text: `Se recargaron ${amount} EduCoins a ${currentName} exitosamente.`, type: 'success' });
      await fetchUsuarios();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: 'Error al recargar EduCoins: ' + err.message, type: 'error' });
    } finally {
      setCambiadoRolId(null);
    }
  };

  const handleCambiarRol = async (targetUserId, nuevoRol) => {
    setCambiadoRolId(targetUserId);
    try {
      await cambiarRolUsuario(targetUserId, nuevoRol);
      setMessage({ text: `Rol actualizado exitosamente a "${nuevoRol}"`, type: 'success' });
      await fetchUsuarios();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setCambiadoRolId(null);
    }
  };

  if (loadingUsuarios) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#94a3b8', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #8b5cf6', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        <span>Cargando usuarios...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Indicador de admins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem 2rem',
          borderRadius: '1.5rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 10px 30px -5px rgba(139, 92, 246, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)' }}>
            <Crown size={28} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700 }}>Administradores del Sistema</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
              Gestiona los permisos y accesos elevados.
            </p>
          </div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '0.5rem 1.5rem',
          borderRadius: '2rem',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Total: {totalAdmins}
        </div>
      </motion.div>

      {/* Tabla de usuarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Usuario</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rol Actual</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>EduCoins</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usr, idx) => {
                const isCurrentUser = usr.id === currentUserId;
                const isAdmin = usr.rol === 'admin';
                const isChanging = cambiadoRolId === usr.id;
                const canPromote = !isAdmin;
                const canDemote = isAdmin && !isCurrentUser;

                return (
                  <motion.tr
                    key={usr.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: isCurrentUser ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { if (!isCurrentUser) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isCurrentUser ? 'rgba(59, 130, 246, 0.05)' : 'transparent'; }}
                  >
                    <td style={{ padding: '1rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: isAdmin ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #334155, #475569)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1rem', fontWeight: 700, color: 'white',
                          boxShadow: isAdmin ? '0 4px 10px rgba(168, 85, 247, 0.3)' : 'none'
                        }}>
                          {(usr.nombre_completo || usr.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>
                            {usr.nombre_completo || 'Sin nombre'}
                            {isCurrentUser && <span style={{ color: '#60a5fa', fontSize: '0.75rem', marginLeft: '0.5rem', background: 'rgba(59, 130, 246, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>(Tú)</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 2rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                      {usr.email}
                    </td>
                    <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600,
                        background: isAdmin ? 'rgba(168, 85, 247, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                        color: isAdmin ? '#d8b4fe' : '#94a3b8',
                        border: `1px solid ${isAdmin ? 'rgba(168, 85, 247, 0.3)' : 'rgba(100, 116, 139, 0.2)'}`,
                        boxShadow: isAdmin ? 'inset 0 0 10px rgba(168, 85, 247, 0.1)' : 'none'
                      }}>
                        {isAdmin ? <ShieldCheck size={16} /> : null}
                        {isAdmin ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#fcd34d', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          🪙 {usr.educoins ?? 0}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRecargar(usr.id, usr.nombre_completo || usr.email || 'Usuario')}
                          disabled={isChanging}
                          title="Recargar EduCoins"
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            color: '#f59e0b',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isChanging ? 'not-allowed' : 'pointer',
                            opacity: isChanging ? 0.5 : 1
                          }}
                        >
                          <PlusCircle size={16} />
                        </motion.button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 2rem', textAlign: 'center' }}>
                      {isAdmin ? (
                        <motion.button
                          whileHover={!(isCurrentUser || isChanging) ? { scale: 1.05 } : {}}
                          whileTap={!(isCurrentUser || isChanging) ? { scale: 0.95 } : {}}
                          onClick={() => handleCambiarRol(usr.id, 'usuario')}
                          disabled={isCurrentUser || isChanging}
                          title={isCurrentUser ? 'No puedes degradarte a ti mismo' : 'Quitar rol de admin'}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1.25rem', borderRadius: '0.75rem',
                            background: isCurrentUser ? 'rgba(255,255,255,0.05)' : 'rgba(239, 68, 68, 0.1)',
                            color: isCurrentUser ? '#64748b' : '#fca5a5',
                            border: `1px solid ${isCurrentUser ? 'rgba(255,255,255,0.1)' : 'rgba(239, 68, 68, 0.3)'}`,
                            cursor: isCurrentUser || isChanging ? 'not-allowed' : 'pointer',
                            fontWeight: 600, fontSize: '0.85rem',
                            opacity: isCurrentUser ? 0.5 : 1,
                            transition: 'all 0.2s'
                          }}
                        >
                          <ShieldOff size={16} />
                          {isChanging ? 'Procesando...' : isCurrentUser ? 'Bloqueado' : 'Revocar'}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={canPromote && !isChanging ? { scale: 1.05, boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)' } : {}}
                          whileTap={canPromote && !isChanging ? { scale: 0.95 } : {}}
                          onClick={() => handleCambiarRol(usr.id, 'admin')}
                          disabled={!canPromote || isChanging}
                          title={'Promover a admin'}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1.25rem', borderRadius: '0.75rem',
                            background: canPromote ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)' : 'transparent',
                            color: canPromote ? '#d8b4fe' : '#475569',
                            border: `1px solid ${canPromote ? 'rgba(168, 85, 247, 0.4)' : '#334155'}`,
                            cursor: !canPromote || isChanging ? 'not-allowed' : 'pointer',
                            fontWeight: 600, fontSize: '0.85rem',
                            opacity: canPromote ? 1 : 0.5,
                            transition: 'all 0.2s'
                          }}
                        >
                          <ShieldCheck size={16} />
                          {isChanging ? 'Procesando...' : 'Promover'}
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {usuarios.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontSize: '1.1rem' }}>
            No se encontraron usuarios registrados.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UsersTab;
