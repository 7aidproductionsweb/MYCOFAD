import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Styles communs pour les PDFs
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2563eb',
  },
  text: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 15,
  },
  listItem: {
    marginBottom: 4,
  },
});

/**
 * Génère le PDF du CV
 * @param {Object} content - Contenu du CV
 * @returns {Promise<Blob>}
 */
export async function generateCV(content) {
  const CVDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.section}>
          <Text style={styles.title}>{content.titre}</Text>
          <Text style={styles.text}>
            {content.infosPersonnelles.prenom} {content.infosPersonnelles.nom}
          </Text>
          <Text style={styles.text}>{content.infosPersonnelles.adresse}</Text>
          <Text style={styles.text}>{content.infosPersonnelles.telephone}</Text>
          <Text style={styles.text}>{content.infosPersonnelles.email}</Text>
          <Text style={styles.text}>
            {content.infosPersonnelles.age} ans - {content.infosPersonnelles.nationalite}
          </Text>
        </View>

        {/* Expérience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expérience professionnelle</Text>
          <Text style={styles.text}>
            {content.experienceAnnees} ans d'expérience dans le secteur
          </Text>
          {content.experiences.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={[styles.text, styles.bold]}>{exp.poste}</Text>
              <Text style={styles.text}>{exp.entreprise}</Text>
              <Text style={styles.text}>{exp.dates}</Text>
              <Text style={styles.text}>{exp.description}</Text>
            </View>
          ))}
        </View>

        {/* Compétences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences</Text>
          <View style={styles.list}>
            {content.competences.map((comp, index) => (
              <Text key={index} style={[styles.text, styles.listItem]}>
                • {comp}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(CVDocument).toBlob();
  return blob;
}

/**
 * Génère le PDF de la lettre de motivation
 * @param {Object} content - Contenu de la lettre
 * @returns {Promise<Blob>}
 */
export async function generateLettre(content) {
  const LettreDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Destinataire */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.text}>{content.destinataire.entreprise}</Text>
          <Text style={styles.text}>{content.destinataire.adresse}</Text>
        </View>

        {/* Objet */}
        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Objet :</Text> {content.objet}
          </Text>
          <Text style={styles.text}>{content.date}</Text>
        </View>

        {/* Corps de la lettre */}
        <View style={styles.section}>
          <Text style={[styles.text, { lineHeight: 1.6 }]}>{content.corps}</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(LettreDocument).toBlob();
  return blob;
}

/**
 * Génère le PDF d'attestation
 * @param {Object} content - Contenu de l'attestation
 * @returns {Promise<Blob>}
 */
export async function generateAttestation(content) {
  const AttestationDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 80 }}>
          <Text style={[styles.title, { marginBottom: 40 }]}>
            ATTESTATION DE FORMATION
          </Text>

          <View style={styles.section}>
            <Text style={[styles.text, { textAlign: 'center', marginBottom: 20 }]}>
              Nous certifions que M. {content.titulaire}
            </Text>
            <Text style={[styles.text, { textAlign: 'center', marginBottom: 20 }]}>
              a suivi avec succès la formation :
            </Text>
          </View>

          <View style={[styles.section, { marginTop: 30 }]}>
            <Text style={[styles.sectionTitle, { textAlign: 'center', fontSize: 16 }]}>
              "{content.titre}"
            </Text>
          </View>

          <View style={[styles.section, { marginTop: 30 }]}>
            <Text style={styles.text}>Durée : {content.duree}</Text>
            <Text style={styles.text}>Date : {content.date}</Text>
            <Text style={styles.text}>Organisme : {content.organisme}</Text>
          </View>

          <View style={{ marginTop: 60, textAlign: 'right' }}>
            <Text style={styles.text}>[Signature]</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(AttestationDocument).toBlob();
  return blob;
}

/**
 * Génère le PDF du relevé CPF
 * @param {Object} content - Contenu du relevé CPF
 * @returns {Promise<Blob>}
 */
export async function generateCPF(content) {
  const CPFDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 60 }}>
          <Text style={[styles.title, { marginBottom: 40 }]}>
            COMPTE PERSONNEL DE FORMATION
          </Text>

          <View style={styles.section}>
            <Text style={styles.text}>
              <Text style={styles.bold}>Titulaire :</Text> {content.titulaire}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>N° de compte :</Text> {content.numero}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Statut :</Text> {content.statut}
            </Text>
          </View>

          <View style={[styles.section, { marginTop: 30 }]}>
            <Text style={styles.text}>
              <Text style={styles.bold}>Droits acquis :</Text> XXX €
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(CPFDocument).toBlob();
  return blob;
}

/**
 * Déclenche le téléchargement d'un blob PDF
 * @param {Blob} blob - Le blob PDF à télécharger
 * @param {string} filename - Nom du fichier
 */
export function downloadPDF(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
