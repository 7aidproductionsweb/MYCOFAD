import { useApp } from '../context/AppContext';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  const { t } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn-primary">
            {t('confirm')}
          </button>
          <button onClick={onCancel} className="btn-secondary">
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
