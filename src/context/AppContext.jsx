import { createContext, useState, useContext, useEffect } from 'react';
import { user as fallbackUser } from '../data/user';
import { documents as initialDocuments } from '../data/documents';
import { translations } from '../data/translations';
import { authenticateUser } from '../utils/pinAuth';
import { supabase, shouldUseSupabase } from '../utils/supabaseClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(fallbackUser.langue); // 'fr' ou 'pt'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Utilisateur authentifié
  const [userSource, setUserSource] = useState(null); // 'supabase' | 'local'
  const [documents, setDocuments] = useState(initialDocuments);

  // Gestion quota LLM (20 requêtes/jour avec reset quotidien)
  const [llmCount, setLlmCount] = useState(0);
  const [lastLlmReset, setLastLlmReset] = useState(new Date().toDateString());
  const maxLlm = import.meta.env.VITE_MAX_LLM
    ? parseInt(import.meta.env.VITE_MAX_LLM)
    : 20;

  // Vérification et reset quotidien du compteur LLM
  useEffect(() => {
    const stored = localStorage.getItem('llmData');
    if (stored) {
      try {
        const { count, lastReset } = JSON.parse(stored);
        const today = new Date().toDateString();

        if (lastReset === today) {
          // Même jour, on restaure le compteur
          setLlmCount(count);
          setLastLlmReset(lastReset);
        } else {
          // Nouveau jour, reset
          setLlmCount(0);
          setLastLlmReset(today);
          localStorage.setItem('llmData', JSON.stringify({ count: 0, lastReset: today }));
        }
      } catch (err) {
        console.warn('Error loading LLM data:', err);
      }
    } else {
      // Première utilisation
      const today = new Date().toDateString();
      setLastLlmReset(today);
      localStorage.setItem('llmData', JSON.stringify({ count: 0, lastReset: today }));
    }
  }, []);

  // Fonction pour incrémenter le compteur LLM
  const incrementLlmCount = () => {
    const newCount = llmCount + 1;
    setLlmCount(newCount);
    localStorage.setItem('llmData', JSON.stringify({
      count: newCount,
      lastReset: lastLlmReset
    }));
  };

  // Fonction pour réinitialiser le compteur LLM (bypass quota)
  const resetLlmCount = () => {
    const today = new Date().toDateString();
    setLlmCount(0);
    setLastLlmReset(today);
    localStorage.setItem('llmData', JSON.stringify({
      count: 0,
      lastReset: today
    }));
    console.log('✅ Quota LLM réinitialisé à 0');
  };

  // Fonction pour changer de langue
  const switchLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'pt' : 'fr'));
  };

  // Fonction pour charger les documents (Supabase → local fallback)
  const loadDocuments = async (userId) => {
    if (shouldUseSupabase()) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          // Convertir structure Supabase → format local
          const supabaseDocs = data.map(doc => ({
            id: doc.id,
            type: doc.type,
            name: doc.name, // JSON {fr, pt}
            isEditable: doc.is_editable,
            content: doc.content, // JSON
            filePath: doc.file_path
          }));
          setDocuments(supabaseDocs);
          return;
        }

        console.warn('No documents in Supabase, using local:', error);
      } catch (err) {
        console.warn('Error loading documents from Supabase:', err);
      }
    }

    // Fallback : documents locaux
    setDocuments(initialDocuments);
  };

  // Fonction pour se connecter avec le PIN (ASYNC maintenant)
  const login = async (pin) => {
    const result = await authenticateUser(pin);

    if (result.success) {
      setIsAuthenticated(true);
      setCurrentUser(result.user);
      setUserSource(result.source);
      setLanguage(result.user.langue);

      // Charger les documents de l'utilisateur
      await loadDocuments(result.user.id);

      return true;
    }
    return false;
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserSource(null);
    setDocuments(initialDocuments);
  };

  // Fonction pour mettre à jour un document
  const updateDocument = async (documentId, newContent) => {
    // Mise à jour locale immédiate
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, content: newContent } : doc
      )
    );

    // Si Supabase disponible, sauvegarder
    if (shouldUseSupabase() && currentUser) {
      try {
        const { error } = await supabase
          .from('documents')
          .update({ content: newContent })
          .eq('id', documentId)
          .eq('user_id', currentUser.id);

        if (error) {
          console.warn('Failed to update document in Supabase:', error);
        }
      } catch (err) {
        console.warn('Error updating document:', err);
      }
    }
  };

  // Fonction pour obtenir les traductions
  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    switchLanguage,
    isAuthenticated,
    login,
    logout,
    currentUser, // Remplace 'user' statique
    userSource,
    documents,
    updateDocument,
    t,
    // Gestion LLM
    llmCount,
    maxLlm,
    incrementLlmCount,
    resetLlmCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
