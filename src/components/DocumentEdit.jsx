import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ConfirmModal from './ConfirmModal';

export default function DocumentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, updateDocument, language, t } = useApp();

  const document = documents.find((doc) => doc.id === id);
  const [content, setContent] = useState(document?.content || {});
  const [showConfirm, setShowConfirm] = useState(false);

  if (!document || !document.isEditable) {
    return (
      <div className="document-edit">
        <p>Ce document n'est pas éditable</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Retour
        </button>
      </div>
    );
  }

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = () => {
    updateDocument(document.id, content);
    setShowConfirm(false);
    navigate(`/document/view/${document.id}`);
  };

  const handleCancel = () => {
    navigate(`/document/view/${document.id}`);
  };

  const renderEditForm = () => {
    if (document.type === 'cv') {
      return (
        <div className="edit-form">
          <div className="form-section">
            <h3>Informations personnelles</h3>
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                value={content.infosPersonnelles?.prenom || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    infosPersonnelles: {
                      ...content.infosPersonnelles,
                      prenom: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={content.infosPersonnelles?.nom || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    infosPersonnelles: {
                      ...content.infosPersonnelles,
                      nom: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={content.infosPersonnelles?.email || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    infosPersonnelles: {
                      ...content.infosPersonnelles,
                      email: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                value={content.infosPersonnelles?.telephone || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    infosPersonnelles: {
                      ...content.infosPersonnelles,
                      telephone: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                value={content.infosPersonnelles?.adresse || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    infosPersonnelles: {
                      ...content.infosPersonnelles,
                      adresse: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Titre du poste</h3>
            <div className="form-group">
              <input
                type="text"
                value={content.titre || ''}
                onChange={(e) =>
                  setContent({ ...content, titre: e.target.value })
                }
                required
                minLength="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Compétences</h3>
            {content.competences?.map((comp, idx) => (
              <div key={idx} className="form-group-inline">
                <input
                  type="text"
                  value={comp}
                  onChange={(e) => {
                    const newComp = [...content.competences];
                    newComp[idx] = e.target.value;
                    setContent({ ...content, competences: newComp });
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    const newComp = content.competences.filter(
                      (_, i) => i !== idx
                    );
                    setContent({ ...content, competences: newComp });
                  }}
                  className="btn-danger"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setContent({
                  ...content,
                  competences: [...content.competences, ''],
                })
              }
              className="btn-secondary"
            >
              + Ajouter une compétence
            </button>
          </div>
        </div>
      );
    }

    if (document.type === 'lettre_motivation') {
      return (
        <div className="edit-form">
          <div className="form-section">
            <h3>Destinataire</h3>
            <div className="form-group">
              <label>Entreprise</label>
              <input
                type="text"
                value={content.destinataire?.entreprise || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    destinataire: {
                      ...content.destinataire,
                      entreprise: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Adresse</label>
              <input
                type="text"
                value={content.destinataire?.adresse || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    destinataire: {
                      ...content.destinataire,
                      adresse: e.target.value,
                    },
                  })
                }
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Objet</h3>
            <div className="form-group">
              <input
                type="text"
                value={content.objet || ''}
                onChange={(e) =>
                  setContent({ ...content, objet: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Date</h3>
            <div className="form-group">
              <input
                type="text"
                value={content.date || ''}
                onChange={(e) =>
                  setContent({ ...content, date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Corps de la lettre</h3>
            <div className="form-group">
              <textarea
                rows="15"
                value={content.corps || ''}
                onChange={(e) =>
                  setContent({ ...content, corps: e.target.value })
                }
                required
                minLength="50"
              />
            </div>
          </div>
        </div>
      );
    }

    return <p>Type de document non supporté pour l'édition</p>;
  };

  return (
    <div className="document-edit">
      <div className="document-header">
        <h1>
          {t('edit')} - {document.name[language]}
        </h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {renderEditForm()}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
          >
            {t('save')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
          >
            {t('cancel')}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showConfirm}
        message={`${t('confirm')} l'enregistrement des modifications ?`}
        onConfirm={confirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
