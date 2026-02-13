import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PinScreen() {
  const { login, t } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(pin);
    if (!success) {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="pin-screen">
      <div className="pin-container">
        <h1>🔐 MYCOFAD</h1>
        <p className="subtitle">Mon Coffre Administratif Personnel</p>
        <form onSubmit={handleSubmit} className="pin-form">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t('pinPlaceholder')}
            className="pin-input"
            maxLength="4"
            autoFocus
          />
          {error && <p className="error-message">{t('pinError')}</p>}
          <button type="submit" className="btn-primary">
            Entrer
          </button>
        </form>
      </div>
    </div>
  );
}
