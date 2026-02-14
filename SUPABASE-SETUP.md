# 🚀 Configuration Supabase pour MYCOFAD

## Statut actuel

✅ Connexion à Supabase : **OK**
⚠️ Tables de données : **À créer**

---

## 📝 Étapes d'installation

### 1. Accéder au dashboard Supabase

Ouvrez votre navigateur et allez sur :
```
https://supabase.com/dashboard
```

Connectez-vous et sélectionnez votre projet : **wcstoqavvqeshmafwmqn**

### 2. Ouvrir l'éditeur SQL

Dans le menu de gauche :
1. Cliquez sur **SQL Editor** (icône </> )
2. Cliquez sur **New Query** en haut à droite

### 3. Exécuter le script de configuration

1. Ouvrez le fichier `supabase-setup.sql` (dans ce dossier)
2. **Copiez tout le contenu** du fichier
3. **Collez** dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

### 4. Vérifier l'installation

Une fois le script exécuté, vous devriez voir :

```
CREATE TABLE
CREATE TABLE
CREATE INDEX
...
INSERT 0 1
INSERT 0 1
...
```

### 5. Tester la configuration

Retournez dans votre terminal et exécutez :

```bash
node test-supabase.js
```

Vous devriez voir :
```
✅ Table users accessible
✅ Table documents accessible
✅ Authentification réussie
✅ SUPABASE ENTIÈREMENT CONFIGURÉ
```

---

## 🗂️ Structure des tables créées

### Table `users`
- **id** : Identifiant unique
- **prenom, nom** : Informations personnelles
- **pin_hash** : Code PIN (en clair pour V1, à hasher en prod)
- **email, telephone, adresse** : Coordonnées
- **langue** : Langue préférée (fr/pt)

### Table `documents`
- **id** : Identifiant unique
- **user_id** : Référence à l'utilisateur
- **type** : Type de document (cv, lettre_motivation, attestation, identifiant)
- **name** : Nom du document en JSON {fr, pt}
- **is_editable** : Document modifiable ou non
- **content** : Contenu en JSON (structure variable)
- **file_path** : Chemin du fichier PDF statique (optionnel)

### Row Level Security (RLS)

Les politiques RLS sont activées pour :
- Les utilisateurs ne peuvent voir que leurs propres documents
- Les utilisateurs ne peuvent modifier que leurs propres documents
- L'authentification par PIN est autorisée pour tous

---

## 📦 Données initiales

Le script insère automatiquement :

### Utilisateur Luis
- **ID** : 1
- **PIN** : 0199
- **Prénom** : Luis
- **Nom** : Chauveau
- **Langue** : Français

### Documents (5)
1. **cv-1** : CV de Luis (éditable)
2. **lettre-1** : Lettre de motivation SOFRIGU (éditable)
3. **cpf-1** : Compte CPF (lecture seule)
4. **attestation-1** : Attestation formation "Gestes et postures" (lecture seule)
5. **pe-1** : Numéro Pôle Emploi (lecture seule)

---

## 🔧 Commandes utiles

### Tester la connexion Supabase
```bash
node test-supabase.js
```

### Vérifier les données dans Supabase

Allez dans **Table Editor** sur le dashboard Supabase et sélectionnez :
- Table `users` : Vous devriez voir Luis
- Table `documents` : Vous devriez voir 5 documents

### Tester l'authentification en SQL

Dans le SQL Editor, exécutez :
```sql
SELECT * FROM users WHERE pin_hash = '0199';
```

Résultat attendu : 1 ligne (Luis Chauveau)

---

## 🎯 Modes de fonctionnement

L'application MYCOFAD supporte 3 modes (configurables dans `.env`) :

### 1. Mode **offline** (VITE_APP_MODE=offline)
- Utilise uniquement les données locales
- Pas de connexion à Supabase
- Parfait pour démonstration hors ligne

### 2. Mode **hybrid** (VITE_APP_MODE=hybrid) ⭐ **Recommandé**
- Essaie Supabase d'abord
- Fallback automatique sur données locales si :
  - Pas de connexion internet
  - Supabase indisponible
  - Données non trouvées
- **Meilleur des deux mondes**

### 3. Mode **online** (VITE_APP_MODE=online)
- Utilise uniquement Supabase
- Échoue si Supabase indisponible
- Pour production avec données centralisées

---

## ⚠️ Notes importantes

### Sécurité PIN (V1 vs Production)

**V1 (actuel)** :
- PIN stocké en clair : `0199`
- Comparaison directe dans le code
- **À CHANGER en production**

**Production (V2)** :
- Hasher le PIN avec bcrypt
- Utiliser Supabase Auth si possible
- Implémenter rate limiting

### PDFs statiques

Les documents avec `file_path` (cpf-releve.pdf, attestation-formation.pdf) ne sont PAS uploadés automatiquement.

**Pour les uploader manuellement** :
1. Allez dans **Storage** sur Supabase
2. Créez un bucket `documents`
3. Uploadez les PDFs générés (voir `scripts/generateStaticPDFs.js`)

---

## 🐛 Dépannage

### Erreur "Could not find the table"
➡️ Le script SQL n'a pas été exécuté. Retour à l'étape 2.

### Erreur "RLS policy violation"
➡️ Les politiques RLS bloquent l'accès. Vérifiez que le `user_id` correspond.

### Erreur de connexion
➡️ Vérifiez les credentials dans `.env` :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Authentification échoue
➡️ Vérifiez que l'utilisateur Luis est bien inséré :
```sql
SELECT * FROM users;
```

---

## ✅ Checklist finale

Avant de lancer l'application en mode hybride :

- [ ] Script SQL exécuté sur Supabase
- [ ] `node test-supabase.js` retourne ✅ tout vert
- [ ] Variables `.env` correctement configurées
- [ ] Mode `VITE_APP_MODE=hybrid` activé
- [ ] (Optionnel) PDFs statiques uploadés dans Storage

**Une fois tout coché, lancez l'application :**

```bash
npm run dev
```

**Et testez :**
1. Login avec PIN 0199
2. Vérifiez que les documents s'affichent
3. Testez la modification du CV
4. Testez les commandes vocales
5. Vérifiez le compteur LLM

🎉 **Félicitations, MYCOFAD est opérationnel en mode hybride !**
