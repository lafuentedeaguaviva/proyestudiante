import React, { createContext, useState, useEffect } from 'react';

export const NexusContext = createContext();

export const NexusProvider = ({ children }) => {
  // Inicializamos leyendo de localStorage para que persista (simulando persistencia global)
  // En un caso real, podría guardarse en Supabase asociado al perfil del usuario.
  const [nexusInfluence, setNexusInfluence] = useState(() => {
    const saved = localStorage.getItem('nexus_influence');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [nexusMessage, setNexusMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('nexus_influence', nexusInfluence);
  }, [nexusInfluence]);

  const increaseNexus = (amount, reasonMessage = "Suposición detectada. NEXUS se fortalece.") => {
    setNexusInfluence((prev) => {
      const newVal = prev + amount;
      return newVal > 100 ? 100 : newVal;
    });
    setNexusMessage(reasonMessage);
    
    // Ocultar mensaje después de unos segundos
    setTimeout(() => {
      setNexusMessage(null);
    }, 4000);
  };

  const resetNexus = () => {
    setNexusInfluence(0);
    setNexusMessage(null);
  };

  return (
    <NexusContext.Provider value={{ nexusInfluence, increaseNexus, resetNexus, nexusMessage }}>
      {children}
    </NexusContext.Provider>
  );
};
