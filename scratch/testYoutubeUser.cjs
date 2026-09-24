const buildYoutubeEmbedUrl = (config, fallbackUrl) => {
  let finalUrl = config?.url || fallbackUrl;
  
  if (!finalUrl) return '';

  // Si es un iframe embebido entero, sacamos el src
  const iframeMatch = finalUrl.match(/src=["'](.*?)["']/);
  if (iframeMatch && iframeMatch[1]) {
    finalUrl = iframeMatch[1];
  }

  // Extraer el ID del video de forma robusta
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = finalUrl.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (videoId) {
    finalUrl = `https://www.youtube.com/embed/${videoId}`;
  } else {
    if (finalUrl.includes('watch?v=')) finalUrl = finalUrl.replace('watch?v=', 'embed/');
    else if (finalUrl.includes('youtu.be/')) finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    finalUrl = finalUrl.split('?')[0].split('&')[0];
  }

  const params = [];
  
  // Siempre agregar rel=0 para mejor UX
  params.push('rel=0');

  if (params.length > 0) {
    finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.join('&');
  }

  return finalUrl;
};

console.log(buildYoutubeEmbedUrl({ url: '<iframe width="859" height="483" src="https://www.youtube.com/embed/ffXMaWoNn3A" title="Fase 00  Elige tu Camino" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' }, ''));
