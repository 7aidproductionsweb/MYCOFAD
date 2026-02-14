// Script de test de connexion Supabase
// Usage: node test-supabase.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔍 Test de connexion Supabase...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NON DÉFINIE');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERREUR: Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Connexion basique
    console.log('\n1️⃣ Test de connexion basique...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('_supabase_health_check')
      .select('*')
      .limit(1);

    // Test 2: Vérifier si la table users existe
    console.log('\n2️⃣ Test de la table users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      if (usersError.code === '42P01') {
        console.log('⚠️  Table users n\'existe pas encore');
        console.log('📝 Exécutez le script SQL: supabase-setup.sql');
      } else {
        console.log('⚠️  Erreur users:', usersError.message);
      }
    } else {
      console.log('✅ Table users accessible');
      console.log('Utilisateurs trouvés:', users?.length || 0);
      if (users && users.length > 0) {
        console.log('Premier utilisateur:', users[0].prenom, users[0].nom);
      }
    }

    // Test 3: Vérifier si la table documents existe
    console.log('\n3️⃣ Test de la table documents...');
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .limit(1);

    if (docsError) {
      if (docsError.code === '42P01') {
        console.log('⚠️  Table documents n\'existe pas encore');
        console.log('📝 Exécutez le script SQL: supabase-setup.sql');
      } else {
        console.log('⚠️  Erreur documents:', docsError.message);
      }
    } else {
      console.log('✅ Table documents accessible');
      console.log('Documents trouvés:', docs?.length || 0);
    }

    // Test 4: Test d'authentification avec PIN
    console.log('\n4️⃣ Test d\'authentification (PIN: 0199)...');
    const { data: authUser, error: authError } = await supabase
      .from('users')
      .select('*')
      .eq('pin_hash', '0199')
      .single();

    if (authError) {
      if (authError.code === '42P01') {
        console.log('⚠️  Pas encore de données utilisateur');
      } else if (authError.code === 'PGRST116') {
        console.log('⚠️  Aucun utilisateur avec le PIN 0199');
      } else {
        console.log('⚠️  Erreur auth:', authError.message);
      }
    } else {
      console.log('✅ Authentification réussie');
      console.log('Utilisateur:', authUser.prenom, authUser.nom);
    }

    // Résumé
    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(50));

    if (!usersError && !docsError && authUser) {
      console.log('✅ SUPABASE ENTIÈREMENT CONFIGURÉ');
      console.log('✅ Mode hybride prêt à fonctionner');
    } else if (!usersError && !docsError) {
      console.log('✅ Tables créées mais pas de données');
      console.log('📝 Exécutez la section INSERT du script SQL');
    } else {
      console.log('⚠️  CONFIGURATION INCOMPLÈTE');
      console.log('📝 Suivez ces étapes:');
      console.log('   1. Allez sur https://supabase.com/dashboard');
      console.log('   2. Sélectionnez votre projet');
      console.log('   3. Allez dans SQL Editor');
      console.log('   4. Collez le contenu de supabase-setup.sql');
      console.log('   5. Exécutez le script');
    }

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    process.exit(1);
  }
}

testConnection();
