import { supabase } from './supabaseClient';

/**
 * Wrapper genérico para manejar respuestas de Supabase de forma estandarizada,
 * aplicando Global Error Handling y Early Return Pattern.
 */
export const handleSupabaseRequest = async (requestPromise) => {
  try {
    const { data, error } = await requestPromise;
    
    if (error) {
      console.error("[Supabase Error]:", error);
      throw new Error(error.message || "Error desconocido en la base de datos.");
    }
    
    return data;
  } catch (err) {
    console.error("[API Client Exception]:", err);
    throw err;
  }
};

/**
 * Wrapper para operaciones auth de Supabase.
 */
export const authClient = {
  async signIn(email, password) {
    return handleSupabaseRequest(supabase.auth.signInWithPassword({ email, password }));
  },
  
  async signUp(email, password) {
    return handleSupabaseRequest(supabase.auth.signUp({ email, password }));
  },
  
  async getUser() {
    return handleSupabaseRequest(supabase.auth.getUser());
  },
  
  async signOut() {
    return handleSupabaseRequest(supabase.auth.signOut());
  }
};

/**
 * Wrapper para operaciones de base de datos de Supabase.
 */
export const dbClient = {
  from(table) {
    return supabase.from(table);
  }
};
