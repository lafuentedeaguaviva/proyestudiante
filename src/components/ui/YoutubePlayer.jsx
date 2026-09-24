import React, { useState, useEffect } from 'react';
import { obtenerVideosConfig, buildYoutubeEmbedUrl } from '../../services/api';

// Caché en memoria para evitar múltiples llamadas en la misma sesión
let cachedVideosConfig = null;
let isFetchingConfig = false;
let fetchPromise = null;

const fetchConfigGlobal = async () => {
  if (cachedVideosConfig) return cachedVideosConfig;
  if (isFetchingConfig) return fetchPromise;

  isFetchingConfig = true;
  fetchPromise = obtenerVideosConfig().then(config => {
    cachedVideosConfig = config;
    isFetchingConfig = false;
    return config;
  });

  return fetchPromise;
};

export const clearVideoCache = () => {
  cachedVideosConfig = null;
  isFetchingConfig = false;
  fetchPromise = null;
};

/**
 * Componente reutilizable para iframes de YouTube con configuración dinámica (recorte de tiempo)
 */
const YoutubePlayer = ({ videoKey, fallbackUrl, title = "YouTube video player", className = "", style = {} }) => {
  const [finalUrl, setFinalUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const globalConfig = await fetchConfigGlobal();
        const videoConfig = globalConfig[videoKey];
        
        const builtUrl = buildYoutubeEmbedUrl(videoConfig, fallbackUrl);
        setFinalUrl(builtUrl);
      } catch (err) {
        console.error(`Error loading config for ${videoKey}`, err);
        // Fallback robusto
        setFinalUrl(buildYoutubeEmbedUrl(null, fallbackUrl));
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [videoKey, fallbackUrl]);

  if (loading) {
    return (
      <div style={{ width: '100%', ...style, background: '#1e293b', borderRadius: '1rem', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }} className={className}>
        <div style={{ width: '30px', height: '30px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', ...style, background: '#000', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }} className={className}>
      <iframe 
        width="100%" 
        height="100%" 
        src={finalUrl} 
        title={title} 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YoutubePlayer;
