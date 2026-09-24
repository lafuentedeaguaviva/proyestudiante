import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Video } from 'lucide-react';
import { obtenerVideosConfig, guardarVideoConfig, buildYoutubeEmbedUrl } from '../../services/api';
import { clearVideoCache } from '../ui/YoutubePlayer';

const VIDEO_LIST = [
  { key: 'video_fase_0', fase: 0, desc: 'Fase 0 - El Inicio del Viaje' },
  { key: 'video_fase_1', fase: 1, desc: 'Fase 1 - Encontrar la idea' },
  { key: 'video_fase_2', fase: 2, desc: 'Fase 2 - Validación de la Idea' },
  { key: 'video_fase_3', fase: 3, desc: 'Fase 3 - Público Objetivo' },
  { key: 'video_fase_4', fase: 4, desc: 'Fase 4 - Diseño de producto o servicio' },
  { key: 'video_fase_5', fase: 5, desc: 'Fase 5 - La Estrategia de Marketing' },
  { key: 'video_fase_6', fase: 6, desc: 'Fase 6 - Localización y Distribución' },
  { key: 'video_fase_7', fase: 7, desc: 'Fase 7 - Planteamiento del Emprendimiento' },
  { key: 'video_fase_8', fase: 8, desc: 'Fase 8 - La Operación' },
  { key: 'video_fase_9', fase: 9, desc: 'Fase 9 - Estructura Organizacional' },
  { key: 'video_fase_10', fase: 10, desc: 'Fase 10 - Viabilidad y Sostenibilidad' },
  { key: 'video_fase_11', fase: 11, desc: 'Fase 11 - Consolidación del Documento' },
  { key: 'video_fase_12', fase: 12, desc: 'Fase 12 - Proyecto de Vida' },
  { key: 'video_fase_13', fase: 13, desc: 'Fase 13 - Documento Final IA' }
];

const VideosTab = ({ setMessage }) => {
  const [videosConfig, setVideosConfig] = useState({});
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [savingVideo, setSavingVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const data = await obtenerVideosConfig();
      const configMap = {};
      VIDEO_LIST.forEach(v => {
        configMap[v.key] = data[v.key] || { url: '', startStr: '', endStr: '' };
      });
      setVideosConfig(configMap);
    } catch (err) {
      setMessage({ text: `Error cargando configuraciones de video: ${err.message}`, type: 'error' });
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleChange = (key, field, value) => {
    setVideosConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleSave = async (videoKey) => {
    setSavingVideo(videoKey);
    try {
      const config = videosConfig[videoKey];
      await guardarVideoConfig(videoKey, config.url);
      clearVideoCache();
      setMessage({ text: 'Configuración de video guardada exitosamente.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: `Error guardando video: ${err.message}`, type: 'error' });
    } finally {
      setSavingVideo(null);
    }
  };

  if (loadingVideos) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#94a3b8', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #3b82f6', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        <span>Cargando configuración de videos...</span>
      </div>
    );
  }

  const videosPorFase = VIDEO_LIST.reduce((acc, video) => {
    if (!acc[video.fase]) acc[video.fase] = [];
    acc[video.fase].push(video);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {Object.keys(videosPorFase).sort((a,b)=>Number(a)-Number(b)).map(fase => (
        <motion.div 
          key={`fase-${fase}`} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <h2 style={{ 
            fontSize: '1.5rem', color: '#f8fafc', fontWeight: 700, 
            paddingBottom: '0.75rem', margin: 0,
            borderBottom: '2px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Video size={20} color="#60a5fa" />
            </div>
            {fase === '0' ? 'Global / Onboarding' : `Fase ${fase}`}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '2rem' }}>
            {videosPorFase[fase].map(v => {
              const config = videosConfig[v.key];
              const previewUrl = buildYoutubeEmbedUrl(config, '');
              
              return (
                <motion.div 
                  key={v.key} 
                  whileHover={{ y: -5, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.5)' }}
                  style={{ 
                    background: 'rgba(15, 23, 42, 0.7)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '1.25rem', 
                    padding: '1.5rem', 
                    display: 'flex', flexDirection: 'column', gap: '1.25rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      {v.desc}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>ID: {v.key}</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Enlace o Código Embebido</label>
                    <input 
                      type="text" 
                      placeholder="Pega el enlace o el código de embebido (<iframe...)"
                      value={config.url}
                      onChange={(e) => handleChange(v.key, 'url', e.target.value)}
                      style={{ 
                        width: '100%', padding: '0.85rem', borderRadius: '0.75rem', 
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', 
                        color: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#60a5fa'; e.target.style.boxShadow = '0 0 0 2px rgba(96,165,250,0.2)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  


                  {previewUrl && (
                    <div style={{ 
                      marginTop: '0.5rem', borderRadius: '0.75rem', overflow: 'hidden', 
                      aspectRatio: '16/9', background: '#000', border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <iframe 
                        width="100%" height="100%" 
                        src={previewUrl} 
                        title="Preview" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  <motion.button 
                    whileHover={savingVideo !== v.key ? { scale: 1.02 } : {}}
                    whileTap={savingVideo !== v.key ? { scale: 0.98 } : {}}
                    onClick={() => handleSave(v.key)}
                    disabled={savingVideo === v.key}
                    style={{
                      marginTop: 'auto', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '0.75rem', fontWeight: 600, cursor: savingVideo === v.key ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Save size={18} />
                    {savingVideo === v.key ? 'Guardando...' : 'Guardar Video'}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VideosTab;
