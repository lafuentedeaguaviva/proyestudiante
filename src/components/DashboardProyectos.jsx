import { motion } from 'framer-motion';
import { Plus, Briefcase, Zap, Play, FolderOpen, Target } from 'lucide-react';
import { useEffect } from 'react';

// Mapeo de misiones para los fondos
const MISIONES_BG = {
  espacial: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
  rescate: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop',
  cyberpunk: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
};

export default function DashboardProyectos({ proyectos, onSelectProject, onCreateProject, setAyudanteText }) {
  
  useEffect(() => {
    if (setAyudanteText) {
      setAyudanteText("¡Bienvenido al Centro de Mando! Haz clic en tu proyecto para continuar, o solicita una nueva misión en el botón [+].");
    }
  }, [setAyudanteText]);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingTop: '5rem', paddingBottom: '3rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
        <button 
          onClick={() => {
            if(window.confirm('¿Estás seguro de que deseas borrar todos los datos y empezar como un usuario nuevo?')) {
              localStorage.removeItem('gamified_global_state');
              window.location.reload();
            }
          }}
          style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: '1px solid #EF4444', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Borrar Datos y Salir
        </button>

        <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <FolderOpen size={50} color="var(--primary)" /> Centro de Mando
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Selecciona una partida guardada o inicia una nueva aventura.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* BOTÓN CREAR NUEVO (SOLICITUD DE NUEVA MISIÓN) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, borderColor: 'var(--primary)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
          onClick={onCreateProject}
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
            border: '2px dashed var(--primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 2rem',
            cursor: 'pointer',
            minHeight: '280px',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative radar ping */}
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} 
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', border: '2px solid var(--primary)', opacity: 0.2 }} 
          />
          
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', zIndex: 1, backdropFilter: 'blur(5px)' }}>
            <Target size={35} color="var(--primary)" />
          </div>
          <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem', zIndex: 1, textTransform: 'uppercase', letterSpacing: '2px' }}>Solicitar Misión</h3>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', zIndex: 1 }}>Inicia una nueva simulación de negocio.</p>
        </motion.div>

        {/* LISTADO DE PROYECTOS (PARTIDAS GUARDADAS) */}
        {proyectos && proyectos.map((proj, idx) => {
          const bgImage = MISIONES_BG[proj.misionTema] || MISIONES_BG.default;
          
          return (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -5, boxShadow: `0 15px 40px ${proj.camino === 'A' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` }}
              onClick={() => onSelectProject(proj.id)}
              style={{
                cursor: 'pointer',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${proj.camino === 'A' ? 'var(--primary)' : 'var(--accent)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              {/* Background Image with Overlay */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
                opacity: 0.4
              }} />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,1) 10%, rgba(15,23,42,0.6) 50%, rgba(15,23,42,0.3) 100%)',
                zIndex: 1
              }} />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.6rem', borderRadius: '50%', backdropFilter: 'blur(5px)', border: `1px solid ${proj.camino === 'A' ? 'var(--primary)' : 'var(--accent)'}` }}>
                      {proj.camino === 'A' ? <Briefcase size={25} color="var(--primary)" /> : <Zap size={25} color="var(--accent)" />}
                    </div>
                    <span style={{ fontSize: '0.75rem', background: proj.camino === 'A' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)', color: proj.camino === 'A' ? '#93C5FD' : '#FCD34D', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(4px)', border: `1px solid ${proj.camino === 'A' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(245, 158, 11, 0.5)'}` }}>
                      {proj.camino === 'A' ? 'Emprendimiento' : 'Innovación'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {proj.nombre}
                  </h3>
                  <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Misión: {proj.misionTema === 'espacial' ? 'Espacial' : proj.misionTema === 'rescate' ? 'Rescate Natural' : 'Cyberpunk'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>Progreso:</span>
                    <span style={{ fontWeight: 'bold', color: proj.camino === 'A' ? 'var(--primary)' : 'var(--accent)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                      {proj.faseActiva > 9 ? 'Completado' : `Fase ${proj.faseActiva}`}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(proj.faseActiva / 9) * 100}%` }}
                      style={{ height: '100%', background: proj.camino === 'A' ? 'var(--primary)' : 'var(--accent)', boxShadow: `0 0 10px ${proj.camino === 'A' ? 'var(--primary)' : 'var(--accent)'}` }}
                    />
                  </div>
                  
                  <button 
                    style={{
                      width: '100%',
                      marginTop: '1.5rem',
                      background: proj.camino === 'A' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      border: `1px solid ${proj.camino === 'A' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
                      color: 'white',
                      padding: '0.8rem',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      backdropFilter: 'blur(5px)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = proj.camino === 'A' ? 'var(--primary)' : 'var(--accent)';
                      e.currentTarget.style.color = '#0F172A';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = proj.camino === 'A' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)';
                      e.currentTarget.style.color = 'white';
                    }}
                  >
                    <Play size={18} fill="currentColor" /> Cargar Partida
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}
