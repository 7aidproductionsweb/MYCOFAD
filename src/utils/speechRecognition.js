/**
 * Initialise la reconnaissance vocale avec Web Speech API
 * @param {string} lang - Langue ('fr-FR' ou 'pt-BR')
 * @param {function} onResult - Callback avec (transcript, isFinal)
 * @param {function} onError - Callback d'erreur
 * @returns {SpeechRecognition|null}
 */
export function initSpeechRecognition(lang = 'fr-FR', onResult, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Navigateur non supporté. Veuillez utiliser Chrome, Edge ou Safari.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang; // 'fr-FR' ou 'pt-BR'
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const isFinal = event.results[0].isFinal;
    onResult(transcript, isFinal);
  };

  recognition.onerror = (event) => {
    onError(event.error);
  };

  return recognition;
}
