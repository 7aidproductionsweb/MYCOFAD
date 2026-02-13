import { useApp } from '../context/AppContext';

export default function LanguageToggle() {
  const { language, switchLanguage } = useApp();

  return (
    <button className="language-toggle" onClick={switchLanguage}>
      {language === 'fr' ? '🇫🇷 FR' : '🇧🇷 PT'}
    </button>
  );
}
