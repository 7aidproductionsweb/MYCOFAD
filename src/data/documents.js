export const documents = [
  {
    id: "cv-1",
    type: "cv",
    name: { fr: "Mon CV", pt: "Meu Currículo" },
    isEditable: true,
    content: {
      infosPersonnelles: {
        nom: "Chauveau",
        prenom: "Luis",
        age: 46,
        nationalite: "Française",
        adresse: "13 Cité Césaire, Rue de Kourou, 97300 Guyane Française",
        telephone: "+594 694 XX-30-36",
        email: "luis.chauveau@gmail.com"
      },
      titre: "Magasinier / Manutentionnaire",
      experienceAnnees: 15,
      competences: [
        "Gestion des stocks",
        "Préparation de commandes",
        "Gerbeurs jusqu'à 500 kg",
        "Chariots Fenwick",
        "Dépotage containers",
        "Étiquetage produits",
        "Travail en équipe"
      ],
      experiences: [
        {
          poste: "Magasinier",
          entreprise: "Entreprise Logistique Guyane",
          dates: "2015-2025",
          description: "Gestion stocks, préparation commandes, manutention"
        }
      ]
    },
    filePath: null // Généré à la volée
  },
  {
    id: "lettre-1",
    type: "lettre_motivation",
    name: { fr: "Lettre SOFRIGU", pt: "Carta SOFRIGU" },
    isEditable: true,
    content: {
      destinataire: {
        entreprise: "SOFRIGU – Société Frigorifique Guyane",
        adresse: "Route de Baduel – Pont Maggi, 97332 Cayenne CEDEX",
        contact: null
      },
      objet: "Candidature au poste de magasinier / manutentionnaire",
      date: "15 janvier 2026",
      corps: `Madame, Monsieur,

Par la présente, je vous adresse ma candidature pour le poste de magasinier / manutentionnaire au sein de votre société.

Fort d'une expérience de plus de quinze ans dans la logistique, la préparation de commandes et la manutention, je maîtrise l'organisation des zones de stockage, la distribution et le suivi des bons de commande ainsi que le comptage des marchandises et la gestion des stocks.

J'ai également la compétence et les capacités pour l'utilisation du matériel de manutention, notamment les gerbeurs jusqu'à 500 kg et les chariots Fenwick.

Je suis particulièrement motivé à l'idée de rejoindre la société SOFRIGU.

Disponible immédiatement, je reste à votre disposition pour un entretien à votre convenance.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Luis Chauveau`
    },
    filePath: null
  },
  {
    id: "cpf-1",
    type: "identifiant",
    name: { fr: "Mon compte CPF", pt: "Minha conta CPF" },
    isEditable: false,
    content: {
      numero: "1234-5678-XXXX",
      titulaire: "Luis Chauveau",
      statut: "Actif"
    },
    filePath: "cpf-releve.pdf"
  },
  {
    id: "attestation-1",
    type: "attestation",
    name: { fr: "Attestation Formation", pt: "Certificado de Formação" },
    isEditable: false,
    content: {
      titre: "Gestes et postures",
      organisme: "Centre de Formation Guyane",
      date: "Mars 2024",
      duree: "14 heures",
      titulaire: "Luis Chauveau"
    },
    filePath: "attestation-formation.pdf"
  },
  {
    id: "pe-1",
    type: "identifiant",
    name: { fr: "N° Pôle Emploi", pt: "N° Pôle Emploi" },
    isEditable: false,
    content: {
      numero: "PE-973-XXXXX",
      titulaire: "Luis Chauveau",
      agence: "Pôle Emploi Cayenne"
    },
    filePath: null
  }
];
