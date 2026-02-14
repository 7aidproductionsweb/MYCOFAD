import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Footer from './Footer';

export default function PinScreen() {
  const { login, t } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Son de confirmation (ding ascendant agréable)
  const playSuccessSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // Monte à A6

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); // Fade out

    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(pin);
    if (!success) {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 3000);
    } else {
      // Jouer le son de confirmation
      playSuccessSound();
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
      <Footer />
    </div>
  );
}
