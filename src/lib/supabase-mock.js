export const supabaseMock = {
  auth: {
    signIn: async () => ({ data: { user: { id: '1' } }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: { id: '1', user_metadata: { nombre: 'Estudiante', avatar: '🎒' } } }, error: null }),
  },
  from: (table) => ({
    select: async () => ({ data: [], error: null }),
    insert: async (data) => ({ data, error: null }),
    update: async (data) => ({ data, error: null }),
    upsert: async (data) => ({ data, error: null }),
  }),
};

// En el futuro, reemplazaremos esto con el cliente real de supabase
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient('TU_URL', 'TU_KEY')
export const supabase = supabaseMock;
