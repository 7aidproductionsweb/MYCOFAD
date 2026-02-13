/**
 * Parse une commande vocale et retourne l'action à effectuer
 * @param {string} transcript - Texte reconnu par la reconnaissance vocale
 * @param {string} language - Langue actuelle ('fr' ou 'pt')
 * @returns {Object} { action, target, confidence, description }
 */
export function parseCommand(transcript, language) {
  const text = transcript.toLowerCase().trim();

  // Commandes en français
  if (language === 'fr') {
    // Voir le CV
    if (text.includes('voir mon cv') || text.includes('ouvre mon cv') || text.includes('affiche mon cv')) {
      return {
        action: 'navigate',
        target: '/document/view/cv-1',
        confidence: 'high',
        description: 'Voir votre CV'
      };
    }

    // Voir la lettre
    if (text.includes('voir ma lettre') || text.includes('ouvre ma lettre') || text.includes('lettre sofrigu')) {
      return {
        action: 'navigate',
        target: '/document/view/lettre-1',
        confidence: 'high',
        description: 'Voir votre lettre de motivation'
      };
    }

    // Modifier le CV
    if (text.includes('modifier mon cv') || text.includes('éditer mon cv') || text.includes('modifie mon cv')) {
      return {
        action: 'navigate',
        target: '/document/edit/cv-1',
        confidence: 'high',
        description: 'Modifier votre CV'
      };
    }

    // Modifier la lettre
    if (text.includes('modifier ma lettre') || text.includes('éditer ma lettre')) {
      return {
        action: 'navigate',
        target: '/document/edit/lettre-1',
        confidence: 'high',
        description: 'Modifier votre lettre de motivation'
      };
    }

    // Télécharger le CV
    if (text.includes('télécharger mon cv') || text.includes('télécharge mon cv')) {
      return {
        action: 'download',
        target: 'cv-1',
        confidence: 'high',
        description: 'Télécharger votre CV en PDF'
      };
    }

    // Voir attestation
    if (text.includes('voir mon attestation') || text.includes('attestation')) {
      return {
        action: 'navigate',
        target: '/document/view/attestation-1',
        confidence: 'medium',
        description: 'Voir votre attestation de formation'
      };
    }

    // Voir CPF
    if (text.includes('voir mon cpf') || text.includes('compte cpf')) {
      return {
        action: 'navigate',
        target: '/document/view/cpf-1',
        confidence: 'medium',
        description: 'Voir votre compte CPF'
      };
    }

    // Retour / Accueil
    if (text.includes('retour') || text.includes('accueil') || text.includes('mes documents')) {
      return {
        action: 'navigate',
        target: '/',
        confidence: 'high',
        description: 'Retour à l\'accueil'
      };
    }
  }

  // Commandes en portugais
  if (language === 'pt') {
    // Ver o currículo
    if (text.includes('ver meu currículo') || text.includes('abrir meu currículo') || text.includes('mostrar meu currículo')) {
      return {
        action: 'navigate',
        target: '/document/view/cv-1',
        confidence: 'high',
        description: 'Ver seu currículo'
      };
    }

    // Ver a carta
    if (text.includes('ver minha carta') || text.includes('abrir minha carta')) {
      return {
        action: 'navigate',
        target: '/document/view/lettre-1',
        confidence: 'high',
        description: 'Ver sua carta de motivação'
      };
    }

    // Editar o currículo
    if (text.includes('editar meu currículo') || text.includes('modificar meu currículo')) {
      return {
        action: 'navigate',
        target: '/document/edit/cv-1',
        confidence: 'high',
        description: 'Editar seu currículo'
      };
    }

    // Editar a carta
    if (text.includes('editar minha carta') || text.includes('modificar minha carta')) {
      return {
        action: 'navigate',
        target: '/document/edit/lettre-1',
        confidence: 'high',
        description: 'Editar sua carta de motivação'
      };
    }

    // Baixar o currículo
    if (text.includes('baixar meu currículo') || text.includes('download currículo')) {
      return {
        action: 'download',
        target: 'cv-1',
        confidence: 'high',
        description: 'Baixar seu currículo em PDF'
      };
    }

    // Ver certificado
    if (text.includes('ver meu certificado') || text.includes('certificado')) {
      return {
        action: 'navigate',
        target: '/document/view/attestation-1',
        confidence: 'medium',
        description: 'Ver seu certificado de formação'
      };
    }

    // Ver CPF
    if (text.includes('ver meu cpf') || text.includes('conta cpf')) {
      return {
        action: 'navigate',
        target: '/document/view/cpf-1',
        confidence: 'medium',
        description: 'Ver sua conta CPF'
      };
    }

    // Voltar / Início
    if (text.includes('voltar') || text.includes('início') || text.includes('meus documentos')) {
      return {
        action: 'navigate',
        target: '/',
        confidence: 'high',
        description: 'Voltar ao início'
      };
    }
  }

  // Commande non reconnue
  return {
    action: 'unknown',
    target: null,
    confidence: 'low',
    description: null
  };
}
