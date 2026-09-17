import { createClient } from '@supabase/supabase-js';

// Usamos variables de entorno de Vite
// En desarrollo, asegúrate de tener un archivo .env.local con estas variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
