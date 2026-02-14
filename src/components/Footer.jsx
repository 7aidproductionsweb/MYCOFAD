import { useState } from 'react';

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="footer-spacer"></div>

      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-label">Développé par</span>
          <button
            onClick={() => setShowModal(true)}
            className="contact-link"
          >
            <span className="contact-name">Krystian</span>
            <span className="contact-company">7iaproductions</span>
          </button>
        </div>
      </footer>

      {/* Modal de contact */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>📧 Contactez Krystian</h2>
            <p className="modal-message">
              Vous souhaitez contacter <strong>Krystian</strong> de <strong>7iaproductions</strong> ?
            </p>
            <p className="modal-info">
              🚧 La fonction sera bientôt disponible.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="btn-primary"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Spacer pour éviter que le contenu soit caché */
        .footer-spacer {
          height: 70px;
        }

        .app-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem 2rem;
          background: linear-gradient(to top, #1a1a2e 0%, #16213e 100%);
          text-align: center;
          border-top: 2px solid #0f3460;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .footer-label {
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .contact-link {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .contact-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .contact-link:active {
          transform: translateY(0);
        }

        .contact-name {
          font-weight: 700;
        }

        .contact-company {
          opacity: 0.9;
          font-weight: 500;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-in;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-content h2 {
          margin-top: 0;
          color: #1a1a2e;
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }

        .modal-message {
          margin: 1rem 0;
          color: #555;
          line-height: 1.6;
          font-size: 1.05rem;
        }

        .modal-info {
          background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%);
          border: 2px solid #ffc107;
          padding: 1.25rem;
          border-radius: 12px;
          margin: 1.5rem 0;
          color: #856404;
          font-weight: 600;
          font-size: 1rem;
          text-align: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          margin-top: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-30px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .footer-label {
            font-size: 0.75rem;
          }

          .contact-link {
            font-size: 0.85rem;
            padding: 0.4rem 1rem;
          }
        }
      `}</style>
    </>
  );
}
