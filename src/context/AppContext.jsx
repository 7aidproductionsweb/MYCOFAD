import { createContext, useState, useContext } from 'react';
import { user } from '../data/user';
import { documents as initialDocuments } from '../data/documents';
import { translations } from '../data/translations';
import { validatePin } from '../utils/pinAuth';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(user.langue); // 'fr' ou 'pt'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documents, setDocuments] = useState(initialDocuments);

  // Fonction pour changer de langue
  const switchLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'pt' : 'fr'));
  };

  // Fonction pour se connecter avec le PIN
  const login = (pin) => {
    if (validatePin(pin, user.pinHash)) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Fonction pour mettre à jour un document
  const updateDocument = (documentId, newContent) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, content: newContent } : doc
      )
    );
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
    user,
    documents,
    updateDocument,
    t,
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
