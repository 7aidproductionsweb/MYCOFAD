import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Styles communs
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
  text: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

// Document attestation
const AttestationDocument = React.createElement(
  Document,
  null,
  React.createElement(
    Page,
    { size: 'A4', style: styles.page },
    React.createElement(
      View,
      { style: { marginTop: 80 } },
      React.createElement(
        Text,
        { style: [styles.title, { marginBottom: 40 }] },
        'ATTESTATION DE FORMATION'
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: [styles.text, { textAlign: 'center', marginBottom: 20 }] },
          'Nous certifions que M. Luis Chauveau'
        ),
        React.createElement(
          Text,
          { style: [styles.text, { textAlign: 'center', marginBottom: 20 }] },
          'a suivi avec succès la formation :'
        )
      ),
      React.createElement(
        View,
        { style: [styles.section, { marginTop: 30 }] },
        React.createElement(
          Text,
          { style: [styles.title, { fontSize: 16 }] },
          '"Gestes et postures"'
        )
      ),
      React.createElement(
        View,
        { style: [styles.section, { marginTop: 30 }] },
        React.createElement(Text, { style: styles.text }, 'Durée : 14 heures'),
        React.createElement(Text, { style: styles.text }, 'Date : Mars 2024'),
        React.createElement(Text, { style: styles.text }, 'Organisme : Centre de Formation Guyane')
      ),
      React.createElement(
        View,
        { style: { marginTop: 60, textAlign: 'right' } },
        React.createElement(Text, { style: styles.text }, '[Signature]')
      )
    )
  )
);

// Document CPF
const CPFDocument = React.createElement(
  Document,
  null,
  React.createElement(
    Page,
    { size: 'A4', style: styles.page },
    React.createElement(
      View,
      { style: { marginTop: 60 } },
      React.createElement(
        Text,
        { style: [styles.title, { marginBottom: 40 }] },
        'COMPTE PERSONNEL DE FORMATION'
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(
          Text,
          { style: styles.text },
          React.createElement(Text, { style: styles.bold }, 'Titulaire :'),
          ' Luis Chauveau'
        ),
        React.createElement(
          Text,
          { style: styles.text },
          React.createElement(Text, { style: styles.bold }, 'N° de compte :'),
          ' 1234-5678-XXXX'
        ),
        React.createElement(
          Text,
          { style: styles.text },
          React.createElement(Text, { style: styles.bold }, 'Statut :'),
          ' Actif'
        )
      ),
      React.createElement(
        View,
        { style: [styles.section, { marginTop: 30 }] },
        React.createElement(
          Text,
          { style: styles.text },
          React.createElement(Text, { style: styles.bold }, 'Droits acquis :'),
          ' XXX €'
        )
      )
    )
  )
);

// Fonction pour générer les PDFs
async function generatePDFs() {
  try {
    const outputDir = path.join(__dirname, '..', 'src', 'assets', 'documents');

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('📄 Génération des PDFs statiques...\n');

    // Générer attestation-formation.pdf
    console.log('Génération de attestation-formation.pdf...');
    const attestationBlob = await pdf(AttestationDocument).toBlob();
    const attestationBuffer = Buffer.from(await attestationBlob.arrayBuffer());
    fs.writeFileSync(
      path.join(outputDir, 'attestation-formation.pdf'),
      attestationBuffer
    );
    console.log('✅ attestation-formation.pdf créé\n');

    // Générer cpf-releve.pdf
    console.log('Génération de cpf-releve.pdf...');
    const cpfBlob = await pdf(CPFDocument).toBlob();
    const cpfBuffer = Buffer.from(await cpfBlob.arrayBuffer());
    fs.writeFileSync(
      path.join(outputDir, 'cpf-releve.pdf'),
      cpfBuffer
    );
    console.log('✅ cpf-releve.pdf créé\n');

    console.log('🎉 Tous les PDFs statiques ont été générés avec succès !');
    console.log(`📂 Emplacement : ${outputDir}`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération des PDFs:', error);
    process.exit(1);
  }
}

// Exécuter la génération
generatePDFs();
