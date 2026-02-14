import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initSpeechRecognition, startListening, getSpeechLang } from '../utils/speechRecognition';
import { processCommand, mapDocTypeToId } from '../utils/commandRouterNew';
import { generateCV, downloadPDF } from '../utils/pdfGenerator.jsx';
import ConfirmModal from './ConfirmModal';

export default function VoiceButton() {
  const { language, documents, t, llmCount, maxLlm, incrementLlmCount } = useApp();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const stopListeningRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);
  const [error, setError] = useState('');
  const [usedLlmForCommand, setUsedLlmForCommand] = useState(false);

  const handleStartListening = () => {
    setError('');
    setTranscript('');
    setUsedLlmForCommand(false);

    const speechLang = getSpeechLang(language);
    const recognition = initSpeechRecognition(speechLang);

    if (!recognition) {
      setError(
        language === 'fr'
          ? 'Reconnaissance vocale non supportée par ce navigateur'
          : 'Reconhecimento de voz não suportado neste navegador'
      );
      return;
    }

    recognitionRef.current = recognition;

    // Démarrer l'écoute avec callbacks
    const stopFn = startListening(
      recognition,
      // onInterim: affiche transcription en temps réel
      (interimText) => {
        setTranscript(interimText);
      },
      // onFinal: traite la commande finale
      (finalText) => {
        handleTranscriptFinal(finalText);
      },
      // onEnd: arrêt de l'écoute
      () => {
        setIsListening(false);
      },
      10000 // Timeout 10 secondes
    );

    stopListeningRef.current = stopFn;
    setIsListening(true);
  };

  const handleTranscriptFinal = async (text) => {
    setIsListening(false);

    // Utiliser le nouveau commandRouter avec LLM
    const result = await processCommand(text, language, llmCount, maxLlm);

    // Si LLM utilisé, incrémenter le compteur
    if (result.usedLlm) {
      incrementLlmCount();
      setUsedLlmForCommand(true);
    }

    // Commande non comprise
    if (!result.understood) {
      setError(result.message || t('notUnderstood'));
      return;
    }

    // Construire la commande pour confirmation
    const docId = mapDocTypeToId(result.docType);
    if (!docId) {
      setError(t('notUnderstood'));
      return;
    }

    const doc = documents.find((d) => d.id === docId);
    if (!doc) {
      setError(t('notUnderstood'));
      return;
    }

    const command = buildCommand(result.action, result.docType, docId, doc);
    setPendingCommand(command);
    setShowConfirm(true);
  };

  const buildCommand = (action, docType, docId, doc) => {
    const actionLabel = t(`action${action.charAt(0).toUpperCase() + action.slice(1)}`);
    const docName = doc.name[language];

    switch (action) {
      case 'display':
        return {
          action: 'navigate',
          target: `/document/view/${docId}`,
          description: `${actionLabel} ${docName}`
        };
      case 'edit':
        return {
          action: 'navigate',
          target: `/document/edit/${docId}`,
          description: `${actionLabel} ${docName}`
        };
      case 'download':
        return {
          action: 'download',
          target: docId,
          doc,
          description: `${actionLabel} ${docName}`
        };
      case 'send':
        // Pour V1: redirection vers vue du document (envoi à implémenter V2)
        return {
          action: 'navigate',
          target: `/document/view/${docId}`,
          description: `${language === 'fr' ? 'Préparer envoi' : 'Preparar envio'} ${docName}`
        };
      default:
        return null;
    }
  };

  const executeCommand = async () => {
    if (!pendingCommand) return;

    setShowConfirm(false);

    try {
      if (pendingCommand.action === 'navigate') {
        navigate(pendingCommand.target);
      } else if (pendingCommand.action === 'download') {
        const { doc } = pendingCommand;

        if (doc.type === 'cv') {
          const blob = await generateCV(doc.content);
          downloadPDF(blob, 'CV_Luis_Chauveau.pdf');
        } else {
          // Autres documents: utiliser filePath ou générer selon le type
          console.log('Download document:', doc.id);
        }
      }
    } catch (error) {
      console.error('Erreur exécution commande:', error);
      setError(
        language === 'fr'
          ? 'Erreur lors de l\'exécution de la commande'
          : 'Erro ao executar o comando'
      );
    }

    setPendingCommand(null);
    setTranscript('');
  };

  const cancelCommand = () => {
    setShowConfirm(false);
    setPendingCommand(null);
    setTranscript('');
  };

  const stopListening = () => {
    if (stopListeningRef.current) {
      stopListeningRef.current();
    }
    setIsListening(false);
  };

  const remainingLlm = maxLlm - llmCount;

  return (
    <div className="voice-button-container">
      <button
        onClick={isListening ? stopListening : handleStartListening}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        aria-label={language === 'fr' ? 'Commande vocale' : 'Comando de voz'}
      >
        🎤
      </button>

      {/* Compteur LLM restant */}
      <div className="llm-counter">
        <small>
          {t('llmRemaining')}{remainingLlm}/{maxLlm}
        </small>
      </div>

      {isListening && (
        <div className="voice-status">
          <p className="voice-status-text">{t('listening')}</p>
          {transcript && (
            <p className="voice-transcript">
              {t('heard')}"{transcript}"
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="voice-error">
          <p>{error}</p>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        message={
          pendingCommand
            ? `${language === 'fr' ? 'Voulez-vous' : 'Você quer'} ${
                pendingCommand.description
              } ?`
            : ''
        }
        onConfirm={executeCommand}
        onCancel={cancelCommand}
      />
    </div>
  );
}
