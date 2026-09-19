import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import { autenticarUsuario, obtenerPerfilActivo, iniciarSesionConGoogle } from '../services/api';
import { Mail } from 'lucide-react';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorStr, setErrorStr] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setErrorStr(null);
    try {
      await iniciarSesionConGoogle();
      // Supabase redirige automáticamente, no hace falta navegar
    } catch (err) {
      setErrorStr('Error al conectar con Google. Intenta de nuevo.');
      setLoadingGoogle(false);
    }
  };

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
      
      // Registro exitoso: mostrar pantalla de confirmación de email
      if (!isLogin) {
        setRegistroExitoso(true);
        setLoading(false);
        return;
      }
      redirigirUsuario(data.perfil);
    } catch (err) {
      console.error(err);
      let mensajeError = err.message || (isLogin ? 'Credenciales incorrectas.' : 'Error al crear la cuenta.');
      // Supabase devuelve este mensaje cuando el email no fue confirmado
      if (mensajeError.toLowerCase().includes('email not confirmed')) {
        mensajeError = 'Tu cuenta aún no fue confirmada. Revisa tu correo electrónico y haz clic en el link de verificación para activar tu cuenta.';
      } else if (mensajeError.toLowerCase().includes('invalid login credentials')) {
        mensajeError = 'Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.';
      } else if (mensajeError.toLowerCase().includes('user already registered')) {
        mensajeError = 'Este correo ya está registrado. Usa la pestaña "Ingresar" para iniciar sesión.';
      }
      setErrorStr(mensajeError);
      setLoading(false);
    }
  };

  // Pantalla de éxito tras registrarse
  if (registroExitoso) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)', padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%', maxWidth: '420px',
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
            borderRadius: '1.5rem', padding: '3rem 2rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              display: 'inline-flex', padding: '1.25rem',
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              borderRadius: '50%', marginBottom: '1.5rem',
              boxShadow: '0 10px 20px -5px rgba(16,185,129,0.3)'
            }}
          >
            <Mail size={40} color="#059669" strokeWidth={2} />
          </motion.div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
            ¡Cuenta creada! ✅
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 0.5rem 0' }}>
            Tu cuenta fue registrada con éxito con el correo:
          </p>
          <p style={{
            color: '#2563eb', fontWeight: 700, fontSize: '1rem',
            background: '#eff6ff', padding: '0.5rem 1rem',
            borderRadius: '0.5rem', margin: '0 0 1.25rem 0',
            wordBreak: 'break-all'
          }}>
            {email}
          </p>
          <div style={{
            background: '#fef9c3', border: '1px solid #fde047',
            borderRadius: '0.75rem', padding: '1rem',
            color: '#713f12', fontSize: '0.875rem',
            lineHeight: '1.6', marginBottom: '2rem', textAlign: 'left'
          }}>
            <strong>⚠️ Importante:</strong> Revisa tu bandeja de entrada (y la carpeta de <strong>spam</strong>) y haz clic en el enlace de verificación que te enviamos para activar tu cuenta. Sin ese paso, no podrás iniciar sesión.
          </div>

          <button
            onClick={() => { setRegistroExitoso(false); setIsLogin(true); setPassword(''); setErrorStr(null); }}
            style={{
              width: '100%', padding: '0.875rem',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white', border: 'none', borderRadius: '0.75rem',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(59,130,246,0.5)'
            }}
          >
            Ya confirmé mi correo → Iniciar Sesión
          </button>
        </motion.div>
      </div>
    );
  }

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

        {/* BOTÓN GOOGLE */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={loadingGoogle || loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.75rem', padding: '0.8rem 1rem',
            background: 'white', border: '1.5px solid #e2e8f0',
            borderRadius: '0.625rem', cursor: loadingGoogle ? 'not-allowed' : 'pointer',
            fontWeight: 600, fontSize: '0.95rem', color: '#1e293b',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            transition: 'all 0.2s', marginBottom: '1.25rem',
            opacity: loadingGoogle ? 0.7 : 1
          }}
        >
          {/* Logo SVG de Google */}
          <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.2 0 24 0 14.8 0 7 5.4 3.2 13.3l7.9 6.1C13 13.6 18 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
            <path fill="#FBBC05" d="M11.1 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8.5-6.1z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.3-7.7 2.3-6 0-11-4-12.9-9.4l-8.5 6.1C7 42.6 14.8 48 24 48z"/>
          </svg>
          {loadingGoogle ? 'Conectando con Google...' : 'Continuar con Google'}
        </motion.button>

        {/* DIVISOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}>o con correo y contraseña</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>


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
