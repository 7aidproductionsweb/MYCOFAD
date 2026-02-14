import { supabase, shouldUseSupabase } from './supabaseClient';
import { user as localUser } from '../data/user';

/**
 * Valide le code PIN saisi par l'utilisateur
 * @param {string} inputPin - PIN saisi
 * @param {string} storedHash - PIN stocké (en clair pour V1, hashé en production)
 * @returns {boolean}
 */
export function validatePin(inputPin, storedHash) {
  // V1 : comparaison en clair (simple)
  return inputPin === storedHash;
}

/**
 * Hash le PIN pour stockage sécurisé (pour V2/production)
 * @param {string} pin - PIN à hasher
 * @returns {string}
 */
export function hashPin(pin) {
  // V1 : retourne le PIN en clair
  // V2 : implémenter bcrypt ou crypto.subtle
  return pin;
}

/**
 * Authentifie l'utilisateur (Supabase d'abord, puis fallback local)
 * @param {string} pin - Code PIN saisi
 * @returns {Promise<{success: boolean, user: object|null, source: 'supabase'|'local'}>}
 */
export async function authenticateUser(pin) {
  // 1. Essayer Supabase si disponible
  if (shouldUseSupabase()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('pin_hash', pin) // V1: PIN en clair, hashé en prod
        .single();

      if (!error && data) {
        // Conversion de la structure Supabase vers format local
        return {
          success: true,
          user: {
            id: data.id,
            prenom: data.prenom,
            nom: data.nom,
            pinHash: data.pin_hash,
            age: data.age,
            nationalite: data.nationalite,
            adresse: data.adresse,
            telephone: data.telephone,
            email: data.email,
            langue: data.langue
          },
          source: 'supabase'
        };
      }

      // PIN incorrect sur Supabase
      if (!error && !data) {
        return { success: false, user: null, source: 'supabase' };
      }

      // Erreur Supabase → fallback local
      console.warn('Supabase auth failed, falling back to local:', error);
    } catch (err) {
      console.warn('Supabase error, falling back to local:', err);
    }
  }

  // 2. Fallback local (toujours disponible)
  const isValid = validatePin(pin, localUser.pinHash);
  return {
    success: isValid,
    user: isValid ? localUser : null,
    source: 'local'
  };
}
