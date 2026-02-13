import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateCV, generateLettre, generateAttestation, generateCPF, downloadPDF } from '../utils/pdfGenerator.jsx';

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documents, language, t } = useApp();

  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    return (
      <div className="document-view">
        <p>Document non trouvé</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          {t('cancel')}
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    let blob;
    let filename;

    try {
      switch (document.type) {
        case 'cv':
          blob = await generateCV(document.content);
          filename = 'CV_Luis_Chauveau.pdf';
          break;
        case 'lettre_motivation':
          blob = await generateLettre(document.content);
          filename = 'Lettre_Motivation_SOFRIGU.pdf';
          break;
        case 'attestation':
          blob = await generateAttestation(document.content);
          filename = 'Attestation_Formation.pdf';
          break;
        case 'identifiant':
          if (document.id === 'cpf-1') {
            blob = await generateCPF(document.content);
            filename = 'CPF_Releve.pdf';
          }
          break;
        default:
          alert('Type de document non supporté');
          return;
      }

      if (blob) {
        downloadPDF(blob, filename);
      }
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const renderContent = () => {
    const { content, type } = document;

    if (type === 'cv') {
      return (
        <div className="document-content">
          <h2>{content.titre}</h2>

          <div className="section">
            <h3>Informations personnelles</h3>
            <p>{content.infosPersonnelles.prenom} {content.infosPersonnelles.nom}</p>
            <p>{content.infosPersonnelles.age} ans - {content.infosPersonnelles.nationalite}</p>
            <p>{content.infosPersonnelles.adresse}</p>
            <p>{content.infosPersonnelles.telephone}</p>
            <p>{content.infosPersonnelles.email}</p>
          </div>

          <div className="section">
            <h3>Expérience professionnelle</h3>
            <p>{content.experienceAnnees} ans d'expérience</p>
            {content.experiences.map((exp, idx) => (
              <div key={idx} className="experience-item">
                <h4>{exp.poste}</h4>
                <p>{exp.entreprise}</p>
                <p>{exp.dates}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>Compétences</h3>
            <ul>
              {content.competences.map((comp, idx) => (
                <li key={idx}>{comp}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (type === 'lettre_motivation') {
      return (
        <div className="document-content">
          <div className="section">
            <h3>Destinataire</h3>
            <p>{content.destinataire.entreprise}</p>
            <p>{content.destinataire.adresse}</p>
          </div>

          <div className="section">
            <p><strong>Objet :</strong> {content.objet}</p>
            <p>{content.date}</p>
          </div>

          <div className="section">
            <pre className="lettre-corps">{content.corps}</pre>
          </div>
        </div>
      );
    }

    if (type === 'attestation') {
      return (
        <div className="document-content">
          <h2>Attestation de Formation</h2>
          <div className="section">
            <p><strong>Formation :</strong> {content.titre}</p>
            <p><strong>Bénéficiaire :</strong> {content.titulaire}</p>
            <p><strong>Durée :</strong> {content.duree}</p>
            <p><strong>Date :</strong> {content.date}</p>
            <p><strong>Organisme :</strong> {content.organisme}</p>
          </div>
        </div>
      );
    }

    if (type === 'identifiant') {
      return (
        <div className="document-content">
          <h2>{document.name[language]}</h2>
          <div className="section">
            <p><strong>Titulaire :</strong> {content.titulaire}</p>
            <p><strong>Numéro :</strong> {content.numero}</p>
            {content.statut && <p><strong>Statut :</strong> {content.statut}</p>}
            {content.agence && <p><strong>Agence :</strong> {content.agence}</p>}
          </div>
        </div>
      );
    }

    return <p>Type de document non supporté</p>;
  };

  return (
    <div className="document-view">
      <div className="document-header">
        <h1>{document.name[language]}</h1>
        <div className="document-header-actions">
          <button onClick={handleDownload} className="btn-primary">
            {t('download')} PDF
          </button>
          {document.isEditable && (
            <button
              onClick={() => navigate(`/document/edit/${document.id}`)}
              className="btn-secondary"
            >
              {t('edit')}
            </button>
          )}
          <button onClick={() => navigate('/')} className="btn-secondary">
            Retour
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
