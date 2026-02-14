import { useApp } from '../context/AppContext';
import DocumentList from './DocumentList';
import VoiceButton from './VoiceButton';
import Footer from './Footer';

export default function Home() {
  const { currentUser, t, logout } = useApp();

  return (
    <div className="home">
      <div className="home-header">
        <h1>
          {t('welcome')} {currentUser?.prenom}, {t('helpPrompt')}
        </h1>
        <button onClick={logout} className="btn-secondary">
          {t('logout')}
        </button>
      </div>

      <VoiceButton />

      <div className="documents-section">
        <h2>{t('documents')}</h2>
        <DocumentList />
      </div>

      <Footer />
    </div>
  );
}
