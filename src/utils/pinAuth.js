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
