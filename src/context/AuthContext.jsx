import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

/**
 * Proveedor centralizado de autenticación y rol.
 * Expone: user, perfil, rol, isAdmin, loading.
 * Escucha cambios de sesión de Supabase en tiempo real.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPerfil = useCallback(async (authUser) => {
    if (!authUser) {
      setPerfil(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('perfiles_usuario')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        // El perfil puede no existir aún (usuario recién registrado)
        setPerfil(null);
      } else {
        setPerfil(data);
      }
    } catch (err) {
      console.error('Error obteniendo perfil para AuthContext:', err);
      setPerfil(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Obtener sesión inicial
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchPerfil(currentUser);
    };

    initSession();

    // Escuchar cambios de sesión (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (!currentUser) {
          setPerfil(null);
          setLoading(false);
          return;
        }

        await fetchPerfil(currentUser);
      }
    );

    const handleEducoinGastado = () => {
      setPerfil(prev => {
        if (!prev) return prev;
        return { ...prev, educoins: Math.max(0, (prev.educoins ?? 0) - 1) };
      });
    };
    window.addEventListener('educoin_gastado', handleEducoinGastado);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('educoin_gastado', handleEducoinGastado);
    };
  }, [fetchPerfil]);

  /**
   * Fuerza una recarga del perfil (útil después de que el admin
   * cambie roles o el usuario actualice su perfil).
   */
  const refetchPerfil = useCallback(async () => {
    if (user) {
      await fetchPerfil(user);
    }
  }, [user, fetchPerfil]);

  const restarEducoinLocal = useCallback(() => {
    setPerfil(prev => {
      if (!prev) return prev;
      return { ...prev, educoins: Math.max(0, (prev.educoins ?? 0) - 1) };
    });
  }, []);

  const rol = perfil?.rol || 'usuario';
  const isAdmin = rol === 'admin';

  return (
    <AuthContext.Provider value={{ user, perfil, rol, isAdmin, loading, refetchPerfil, restarEducoinLocal }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de autenticación.
 * Lanza error si se usa fuera del AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
