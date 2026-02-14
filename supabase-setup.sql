-- ========================================
-- MYCOFAD - Script de configuration Supabase
-- ========================================

-- 1. Créer la table users
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  age INTEGER,
  nationalite TEXT,
  adresse TEXT,
  telephone TEXT,
  email TEXT,
  langue TEXT DEFAULT 'fr' CHECK (langue IN ('fr', 'pt')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table documents
-- ========================================
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cv', 'lettre_motivation', 'attestation', 'identifiant')),
  name JSONB NOT NULL, -- {fr: "...", pt: "..."}
  is_editable BOOLEAN DEFAULT false,
  content JSONB NOT NULL, -- Structure variable selon le type
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index pour améliorer les performances
-- ========================================
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);

-- 4. Activer Row Level Security (RLS)
-- ========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques RLS pour users
-- ========================================

-- Les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  USING (id = current_setting('app.current_user_id', true));

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (id = current_setting('app.current_user_id', true));

-- Permettre la lecture pour l'authentification (PIN)
CREATE POLICY "Allow PIN authentication"
  ON users
  FOR SELECT
  USING (true);

-- 6. Créer les politiques RLS pour documents
-- ========================================

-- Les utilisateurs peuvent lire leurs propres documents
CREATE POLICY "Users can read own documents"
  ON documents
  FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

-- Les utilisateurs peuvent créer leurs propres documents
CREATE POLICY "Users can create own documents"
  ON documents
  FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- Les utilisateurs peuvent mettre à jour leurs propres documents
CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

-- Les utilisateurs peuvent supprimer leurs propres documents
CREATE POLICY "Users can delete own documents"
  ON documents
  FOR DELETE
  USING (user_id = current_setting('app.current_user_id', true));

-- 7. Insérer l'utilisateur Luis (données initiales)
-- ========================================
INSERT INTO users (id, prenom, nom, pin_hash, age, nationalite, adresse, telephone, email, langue)
VALUES (
  '1',
  'Luis',
  'Chauveau',
  '0199', -- V1: PIN en clair (à hasher en production)
  46,
  'Française',
  '13 Cité Césaire, Rue de Kourou, 97300 Guyane Française',
  '+594 694 XX-30-36',
  'luis.chauveau@gmail.com',
  'fr'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Insérer les documents de Luis
-- ========================================

-- Document 1: CV
INSERT INTO documents (id, user_id, type, name, is_editable, content, file_path)
VALUES (
  'cv-1',
  '1',
  'cv',
  '{"fr": "Mon CV", "pt": "Meu Currículo"}',
  true,
  '{
    "infosPersonnelles": {
      "nom": "Chauveau",
      "prenom": "Luis",
      "age": 46,
      "nationalite": "Française",
      "adresse": "13 Cité Césaire, Rue de Kourou, 97300 Guyane Française",
      "telephone": "+594 694 XX-30-36",
      "email": "luis.chauveau@gmail.com"
    },
    "titre": "Magasinier / Manutentionnaire",
    "experienceAnnees": 15,
    "competences": [
      "Gestion des stocks",
      "Préparation de commandes",
      "Gerbeurs jusqu''à 500 kg",
      "Chariots Fenwick",
      "Dépotage containers",
      "Étiquetage produits",
      "Travail en équipe"
    ],
    "experiences": [
      {
        "poste": "Magasinier",
        "entreprise": "Entreprise Logistique Guyane",
        "dates": "2015-2025",
        "description": "Gestion stocks, préparation commandes, manutention"
      }
    ]
  }',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Document 2: Lettre de motivation SOFRIGU
INSERT INTO documents (id, user_id, type, name, is_editable, content, file_path)
VALUES (
  'lettre-1',
  '1',
  'lettre_motivation',
  '{"fr": "Lettre SOFRIGU", "pt": "Carta SOFRIGU"}',
  true,
  '{
    "destinataire": {
      "entreprise": "SOFRIGU – Société Frigorifique Guyane",
      "adresse": "Route de Baduel – Pont Maggi, 97332 Cayenne CEDEX",
      "contact": null
    },
    "objet": "Candidature au poste de magasinier / manutentionnaire",
    "date": "15 janvier 2026",
    "corps": "Madame, Monsieur,\n\nPar la présente, je vous adresse ma candidature pour le poste de magasinier / manutentionnaire au sein de votre société.\n\nFort d''une expérience de plus de quinze ans dans la logistique, la préparation de commandes et la manutention, je maîtrise l''organisation des zones de stockage, la distribution et le suivi des bons de commande ainsi que le comptage des marchandises et la gestion des stocks.\n\nJ''ai également la compétence et les capacités pour l''utilisation du matériel de manutention, notamment les gerbeurs jusqu''à 500 kg et les chariots Fenwick.\n\nJe suis particulièrement motivé à l''idée de rejoindre la société SOFRIGU.\n\nDisponible immédiatement, je reste à votre disposition pour un entretien à votre convenance.\n\nJe vous prie d''agréer, Madame, Monsieur, l''expression de mes salutations distinguées.\n\nLuis Chauveau"
  }',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Document 3: Compte CPF
INSERT INTO documents (id, user_id, type, name, is_editable, content, file_path)
VALUES (
  'cpf-1',
  '1',
  'identifiant',
  '{"fr": "Mon compte CPF", "pt": "Minha conta CPF"}',
  false,
  '{
    "numero": "1234-5678-XXXX",
    "titulaire": "Luis Chauveau",
    "statut": "Actif"
  }',
  'cpf-releve.pdf'
)
ON CONFLICT (id) DO NOTHING;

-- Document 4: Attestation de formation
INSERT INTO documents (id, user_id, type, name, is_editable, content, file_path)
VALUES (
  'attestation-1',
  '1',
  'attestation',
  '{"fr": "Attestation Formation", "pt": "Certificado de Formação"}',
  false,
  '{
    "titre": "Gestes et postures",
    "organisme": "Centre de Formation Guyane",
    "date": "Mars 2024",
    "duree": "14 heures",
    "titulaire": "Luis Chauveau"
  }',
  'attestation-formation.pdf'
)
ON CONFLICT (id) DO NOTHING;

-- Document 5: Numéro Pôle Emploi
INSERT INTO documents (id, user_id, type, name, is_editable, content, file_path)
VALUES (
  'pe-1',
  '1',
  'identifiant',
  '{"fr": "N° Pôle Emploi", "pt": "N° Pôle Emploi"}',
  false,
  '{
    "numero": "PE-973-XXXXX",
    "titulaire": "Luis Chauveau",
    "agence": "Pôle Emploi Cayenne"
  }',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- 9. Créer une fonction pour mettre à jour updated_at automatiquement
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Créer les triggers pour updated_at
-- ========================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FIN DU SCRIPT
-- ========================================

-- NOTES:
-- 1. Pour tester l'authentification: SELECT * FROM users WHERE pin_hash = '0199';
-- 2. Pour lister les documents de Luis: SELECT * FROM documents WHERE user_id = '1';
-- 3. En production, hasher le PIN avec bcrypt ou similaire
-- 4. Les PDFs statiques (cpf-releve.pdf, attestation-formation.pdf) doivent être
--    uploadés dans Supabase Storage manuellement
