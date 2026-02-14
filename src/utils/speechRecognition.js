/**
 * Initialise la reconnaissance vocale avec Web Speech API
 * FONCTIONNE EN LOCAL (pas besoin d'internet) ✅
 * @param {string} lang - Langue ('fr-FR' ou 'pt-BR')
 * @returns {SpeechRecognition|null}
 */
export function initSpeechRecognition(lang = 'fr-FR') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang; // 'fr-FR' ou 'pt-BR'
  recognition.continuous = true; // Continue d'écouter
  recognition.interimResults = true; // Résultats en temps réel
  recognition.maxAlternatives = 3; // 3 alternatives pour meilleure précision

  return recognition;
}

/**
 * Démarre l'écoute avec gestion des callbacks
 * @param {SpeechRecognition} recognition - Instance de reconnaissance
 * @param {function} onInterim - Callback avec transcript interim
 * @param {function} onFinal - Callback avec transcript final
 * @param {function} onEnd - Callback de fin
 * @param {number} timeout - Timeout en ms (défaut: 10000 = 10 secondes)
 * @returns {function} - Fonction pour arrêter l'écoute
 */
export function startListening(recognition, onInterim, onFinal, onEnd, timeout = 10000) {
  let finalTranscript = '';

  recognition.onresult = (event) => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript = transcript;
      }
    }

    // Callback avec texte interim (pendant que Luis parle)
    onInterim(interimTranscript || finalTranscript);

    // Callback avec texte final (quand Luis a fini de parler)
    if (finalTranscript) {
      onFinal(finalTranscript);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    onEnd();
  };

  recognition.onend = () => {
    onEnd();
  };

  // Démarrer l'écoute
  recognition.start();

  // Timeout manuel après X secondes
  const timeoutId = setTimeout(() => {
    recognition.stop();
  }, timeout);

  // Retourner fonction pour arrêter manuellement
  return () => {
    clearTimeout(timeoutId);
    recognition.stop();
  };
}

/**
 * Convertit le code langue en format Web Speech API
 * @param {string} lang - 'fr' ou 'pt'
 * @returns {string} - 'fr-FR' ou 'pt-BR'
 */
export function getSpeechLang(lang) {
  return lang === 'pt' ? 'pt-BR' : 'fr-FR';
}
