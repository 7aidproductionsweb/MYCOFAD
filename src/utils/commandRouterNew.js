import { askGroq, isGroqAvailable } from './groqAgent';

// Mots-clés pour détection locale (SANS INTERNET)
const keywords = {
  display: [
    'affiche', 'afficher', 'montre', 'montrer', 'voir',
    'ouvre', 'ouvrir', 'consulte', 'consulter', 'regarde',
    'mostrar', 'ver', 'abrir', 'exibir', 'visualizar'
  ],
  download: [
    'telecharge', 'telecharger', 'telechargement',
    'download', 'baixar', 'descarregar'
  ],
  edit: [
    'modifie', 'modifier', 'change', 'changer',
    'edite', 'editer', 'corrige', 'corriger', 'mets a jour',
    'editar', 'modificar', 'alterar', 'mudar'
  ],
  send: [
    'envoie', 'envoyer', 'envoi', 'mail', 'email',
    'transmet', 'transmettre', 'partage', 'partager',
    'enviar', 'mandar', 'compartilhar'
  ]
};

const docTypes = {
  cv: [
    'cv', 'curriculum', 'curriculo', 'resume', 'profil'
  ],
  lettre: [
    'lettre', 'lettres', 'motivation', 'candidature', 'sofrigu',
    'carta', 'cartas', 'motivacao'
  ],
  cpf: [
    'cpf', 'compte formation', 'formation professionnelle',
    'compte personnel', 'droit formation'
  ],
  attestation: [
    'attestation', 'certificat', 'diplome', 'formation',
    'geste', 'gestes', 'posture', 'postures',
    'certificado', 'formacao'
  ],
  pole: [
    'pole', 'emploi', 'pole emploi', 'france travail',
    'chomage', 'inscription', 'identifiant pe'
  ]
};

/**
 * Normalise le texte pour la comparaison (retire accents, minuscules)
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Retire accents
    .replace(/['']/g, " ");
}

/**
 * Détection locale par mots-clés (fonctionne OFFLINE)
 * @param {string} text - Transcription vocale
 * @returns {{action: string|null, docType: string|null, understood: boolean, confidence: number}}
 */
export function parseCommandLocal(text) {
  const lower = normalizeText(text);

  let action = null;
  let actionScore = 0;

  // Détection de l'action
  for (const [key, words] of Object.entries(keywords)) {
    const matches = words.filter(w => lower.includes(w)).length;
    if (matches > actionScore) {
      action = key;
      actionScore = matches;
    }
  }

  let docType = null;
  let docScore = 0;

  // Détection du type de document
  for (const [key, words] of Object.entries(docTypes)) {
    const matches = words.filter(w => lower.includes(w)).length;
    if (matches > docScore) {
      docType = key;
      docScore = matches;
    }
  }

  const confidence = actionScore + docScore;
  const understood = !!(action && docType) && confidence >= 2;

  return {
    action,
    docType,
    understood,
    confidence
  };
}

/**
 * Traite une commande vocale (local d'abord, puis Grok si nécessaire)
 * @param {string} text - Transcription vocale
 * @param {string} lang - Langue ('fr' ou 'pt')
 * @param {number} llmCount - Nombre de requêtes LLM utilisées aujourd'hui
 * @param {number} maxLlm - Limite quotidienne (défaut: 20)
 * @returns {Promise<{action, docType, message, understood, usedLlm}>}
 */
export async function processCommand(text, lang, llmCount = 0, maxLlm = 20) {
  // 1. Essai LOCAL d'abord (TOUJOURS, même offline)
  const local = parseCommandLocal(text);

  // Si compris localement avec bonne confiance → pas besoin de LLM
  if (local.understood && local.confidence >= 2) {
    return {
      ...local,
      message: null,
      usedLlm: false
    };
  }

  // 2. Si pas compris localement, essayer Groq si disponible
  if (isGroqAvailable() && navigator.onLine && llmCount < maxLlm) {
    const groqResult = await askGroq(text, lang);
    return {
      ...groqResult,
      usedLlm: true
    };
  }

  // 3. Quota LLM dépassé ou Groq non disponible
  return {
    action: null,
    docType: null,
    understood: false,
    message: llmCount >= maxLlm
      ? (lang === 'fr'
        ? "Limite de requêtes IA atteinte pour aujourd'hui."
        : "Limite de solicitações IA atingido hoje.")
      : (lang === 'fr'
        ? "Je n'ai pas compris. Essaie : 'Affiche mon CV' ou 'Télécharge ma lettre'"
        : "Não entendi. Tente: 'Mostrar meu CV' ou 'Baixar minha carta'"),
    usedLlm: false
  };
}

/**
 * Mappe le docType vers l'ID de document réel
 * @param {string} docType - Type de document ('cv', 'lettre', etc.)
 * @returns {string|null} - ID du document ou null
 */
export function mapDocTypeToId(docType) {
  const mapping = {
    'cv': 'cv-1',
    'lettre': 'lettre-1',
    'cpf': 'cpf-1',
    'attestation': 'attestation-1',
    'pole': 'pe-1'
  };
  return mapping[docType] || null;
}
