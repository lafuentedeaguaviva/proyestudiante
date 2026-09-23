import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wrapper de ruta que protege rutas privadas (Dashboard, Fases, etc).
 * - Si está cargando la sesión (ej. al refrescar): muestra un spinner.
 * - Si no hay usuario activo: redirige a /login.
 * - Si hay usuario: renderiza los children.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        color: '#475569',
        gap: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '4px solid #3b82f6',
          borderTopColor: 'transparent',
          animation: 'protectedSpin 1s linear infinite'
        }} />
        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Cargando sesión...</span>
        <style>{`
          @keyframes protectedSpin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
