import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Phone, School, BookOpen, BrainCircuit, ArrowLeft } from 'lucide-react';
import { actualizarPerfilCompleto, obtenerPerfilActivo } from '../services/api';

const CompletarPerfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '', celular: '', colegio: '', curso: '', caracteristicas: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await obtenerPerfilActivo();
        if (data && data.perfil) {
          setFormData({
            nombre: data.perfil.nombre_completo || '',
            celular: data.perfil.celular || '',
            colegio: data.perfil.colegio || '',
            curso: data.perfil.curso || '',
            caracteristicas: data.perfil.caracteristicas_personales || ''
          });
        }
      } catch (err) {
        console.error("Error cargando perfil", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr(null);
    try {
      await actualizarPerfilCompleto(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorStr(err.message || 'Error al guardar el perfil.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)', // Fondo claro
      padding: '3rem 1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Círculos decorativos de fondo */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: '#3b82f6', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.3 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: '#8b5cf6', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.3 }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          maxWidth: '600px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem', 
          padding: '3rem 2.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <button 
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
            style={{ display: 'inline-flex', padding: '1rem', background: '#e0e7ff', borderRadius: '50%', color: '#3b82f6', marginBottom: '1.5rem', boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.2)' }}
          >
            <User size={36} strokeWidth={2.5} />
          </motion.div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>Mi Perfil Estudiantil</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '1.125rem' }}>Ingresa tus datos para personalizar tu experiencia en la plataforma.</p>
        </div>

        {errorStr && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
            {errorStr}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Nombres y Apellidos</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez"
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>Celular / Teléfono</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="tel" name="celular" required value={formData.celular} onChange={handleChange} placeholder="Ej. 12345678"
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>Colegio o Institución</label>
              <div style={{ position: 'relative' }}>
                <School size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" name="colegio" required value={formData.colegio} onChange={handleChange} placeholder="Ej. U. Educativa..."
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>Área o Curso</label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" name="curso" required value={formData.curso} onChange={handleChange} placeholder="Ej. 6to de Secundaria"
                  style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>
              <BrainCircuit size={18} style={{ verticalAlign: 'text-bottom', marginRight: '0.5rem', color: '#3b82f6' }}/>
              Perfil Psicológico & Habilidades
            </label>
            <textarea name="caracteristicas" required value={formData.caracteristicas} onChange={handleChange} placeholder="Descríbete brevemente. ¿Cuáles son tus mayores talentos? ¿Eres un líder nato, un genio creativo o un analista frío?" rows="4"
              style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.5' }}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            style={{ 
              marginTop: '1rem', padding: '1.25rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Perfil y Continuar'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompletarPerfil;
