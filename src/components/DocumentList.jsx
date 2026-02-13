import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const documentIcons = {
  cv: '📄',
  lettre_motivation: '📝',
  attestation: '🎓',
  identifiant: '🆔',
};

export default function DocumentList() {
  const { documents, language, t } = useApp();
  const navigate = useNavigate();

  return (
    <div className="document-grid">
      {documents.map((doc) => (
        <div key={doc.id} className="document-card">
          <div className="document-icon">
            {documentIcons[doc.type] || '📄'}
          </div>
          <h3 className="document-name">{doc.name[language]}</h3>
          <div className="document-actions">
            <button
              onClick={() => navigate(`/document/view/${doc.id}`)}
              className="btn-primary"
            >
              {t('view')}
            </button>
            {doc.isEditable && (
              <button
                onClick={() => navigate(`/document/edit/${doc.id}`)}
                className="btn-secondary"
              >
                {t('edit')}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
