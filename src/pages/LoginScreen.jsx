import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import { autenticarUsuario, obtenerPerfilActivo } from '../services/api';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Nuevo estado
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState(null);

  useEffect(() => {
    const verificarSesion = async () => {
      const data = await obtenerPerfilActivo();
      if (data && data.user) {
        redirigirUsuario(data.perfil);
      }
    };
    verificarSesion();
  }, []);

  const redirigirUsuario = (perfil) => {
    // Si no tiene perfil o le faltan datos críticos, va a CompletarPerfil
    if (!perfil || !perfil.nombre_completo || !perfil.celular) {
      navigate('/completar-perfil');
    } else {
      // Usuario con perfil completo, va al Dashboard
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr(null);
    try {
      const emailLimpio = email.trim();
      await autenticarUsuario(emailLimpio, password, isLogin);
      const data = await obtenerPerfilActivo();
      
      if (!data || !data.user) {
        throw new Error(isLogin ? "Credenciales incorrectas." : "El correo ya está registrado.");
      }
      
      redirigirUsuario(data.perfil);
    } catch (err) {
      console.error(err);
      setErrorStr(err.message || (isLogin ? 'Credenciales incorrectas.' : 'Error al crear la cuenta.'));
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative'
        }}
      >
        <button 
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', borderRadius: '50%', background: '#e0e7ff', marginBottom: '1rem' }}>
            <Rocket size={30} color="#3b82f6" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>EduProyectos</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta de agente'}
          </p>
        </div>

        {/* TABS DE LOGIN / REGISTRO */}
        <div style={{ display: 'flex', marginBottom: '1.5rem', background: '#f1f5f9', borderRadius: '0.5rem', padding: '0.25rem' }}>
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setErrorStr(null); }}
            style={{ flex: 1, padding: '0.5rem', border: 'none', background: isLogin ? 'white' : 'transparent', color: isLogin ? '#3b82f6' : '#64748b', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer', boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
          >
            Ingresar
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setErrorStr(null); }}
            style={{ flex: 1, padding: '0.5rem', border: 'none', background: !isLogin ? 'white' : 'transparent', color: !isLogin ? '#3b82f6' : '#64748b', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer', boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
          >
            Nuevo Usuario
          </button>
        </div>

        {errorStr && (
          <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #fecaca', fontSize: '0.875rem', textAlign: 'center' }}>
            {errorStr}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>
              Correo Institucional
            </label>
            <input 
              type="email" 
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', outline: 'none', fontSize: '1rem', boxSizing: 'border-box'
              }}
              placeholder="estudiante@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>
              Contraseña
            </label>
            <input 
              type="password" 
              style={{
                width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', outline: 'none', fontSize: '1rem', boxSizing: 'border-box'
              }}
              placeholder="Min. 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              marginTop: '0.5rem',
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#0f172a',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
