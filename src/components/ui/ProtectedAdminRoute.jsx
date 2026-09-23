import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wrapper de ruta que bloquea acceso a usuarios no-admin.
 * - Si está cargando: muestra spinner.
 * - Si no hay usuario: redirige a /login.
 * - Si no es admin: redirige silenciosamente a /dashboard.
 * - Si es admin: renderiza los children.
 */
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020617',
        color: '#94a3b8',
        gap: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid #3b82f6',
          borderTopColor: 'transparent',
          animation: 'protectedSpin 1s linear infinite'
        }} />
        <span>Verificando permisos...</span>
        <style>{`@keyframes protectedSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
