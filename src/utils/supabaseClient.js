import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const appMode = import.meta.env.VITE_APP_MODE || 'hybrid';

// Vérifier si Supabase est configuré
export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'https://ton-projet.supabase.co'
  );
};

// Créer le client Supabase si configuré
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Vérifier si on doit utiliser Supabase
export const shouldUseSupabase = () => {
  if (appMode === 'offline') return false;
  if (appMode === 'online') return isSupabaseConfigured();
  // Mode hybrid : utilise Supabase si configuré ET en ligne
  return isSupabaseConfigured() && navigator.onLine;
};

// Helper pour gérer les erreurs Supabase
export const handleSupabaseError = (error, fallback = null) => {
  if (!error) return { success: true, data: fallback };

  console.error('Supabase error:', error);
  return {
    success: false,
    error: error.message || 'Erreur de connexion',
    data: fallback
  };
};
