import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initSpeechRecognition } from '../utils/speechRecognition';
import { parseCommand } from '../utils/commandRouter';
import { generateCV, downloadPDF } from '../utils/pdfGenerator.jsx';
import ConfirmModal from './ConfirmModal';

export default function VoiceButton() {
  const { language, documents, t } = useApp();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);
  const [error, setError] = useState('');

  const handleStartListening = () => {
    setError('');
    setTranscript('');

    const lang = language === 'fr' ? 'fr-FR' : 'pt-BR';

    const recognition = initSpeechRecognition(
      lang,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          handleTranscriptFinal(text);
        }
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
      }
    );

    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
  };

  const handleTranscriptFinal = (text) => {
    const command = parseCommand(text, language);

    if (command.action === 'unknown') {
      setError(
        language === 'fr'
          ? 'Commande non comprise. Essayez "voir mon CV" ou "mes documents"'
          : 'Comando não compreendido. Tente "ver meu currículo" ou "meus documentos"'
      );
      setIsListening(false);
      return;
    }

    // Afficher la modal de confirmation
    setPendingCommand(command);
    setShowConfirm(true);
    setIsListening(false);
  };

  const executeCommand = async () => {
    if (!pendingCommand) return;

    setShowConfirm(false);

    try {
      if (pendingCommand.action === 'navigate') {
        navigate(pendingCommand.target);
      } else if (pendingCommand.action === 'download') {
        // Télécharger le document
        const doc = documents.find((d) => d.id === pendingCommand.target);
        if (doc && doc.type === 'cv') {
          const blob = await generateCV(doc.content);
          downloadPDF(blob, 'CV_Luis_Chauveau.pdf');
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
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="voice-button-container">
      <button
        onClick={isListening ? stopListening : handleStartListening}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        aria-label={language === 'fr' ? 'Commande vocale' : 'Comando de voz'}
      >
        🎤
      </button>

      {isListening && (
        <div className="voice-status">
          <p className="voice-status-text">
            {language === 'fr' ? 'Écoute...' : 'Ouvindo...'}
          </p>
          {transcript && (
            <p className="voice-transcript">"{transcript}"</p>
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
