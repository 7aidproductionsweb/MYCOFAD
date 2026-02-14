# 🔧 Mettre à jour les clés Supabase

## Après avoir créé ton projet sur Supabase :

1. Va dans **Settings** ⚙️ → **API**

2. Copie les valeurs suivantes :

### Project URL
```
https://XXXXXXXX.supabase.co
```

### anon public key
```
eyJhbGc... (longue chaîne)
```

3. Remplace dans ton fichier `.env` :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...ta-longue-cle...

# Groq API
VITE_GROQ_API_KEY=your_groq_api_key_here

# Mode
VITE_APP_MODE=hybrid
```

4. **IMPORTANT** : Sauvegarde le fichier `.env`

5. **Teste la connexion** :
```bash
node test-supabase.js
```

Tu devrais voir :
```
✅ Connexion Supabase : OK
⚠️  Tables à créer
```

6. **Exécute le script SQL** :
   - Va sur Supabase → **SQL Editor**
   - Clique sur **New Query**
   - Copie/colle tout le contenu de `supabase-setup.sql`
   - Clique sur **Run** (ou Ctrl+Enter)

7. **Re-teste** :
```bash
node test-supabase.js
```

Maintenant tu devrais voir :
```
✅ Table users accessible
✅ Table documents accessible
✅ Authentification réussie
✅ SUPABASE ENTIÈREMENT CONFIGURÉ
```

---

## 🚀 Une fois terminé, lance l'app :

```bash
npm run dev
```

L'application fonctionnera en mode **hybride** :
- Essaie Supabase d'abord
- Fallback automatique sur données locales si problème

---

## ❓ Problèmes courants

### "Could not find the table"
➡️ Tu n'as pas encore exécuté `supabase-setup.sql`

### "Invalid API key"
➡️ La clé dans `.env` n'est pas la bonne, vérifie Settings → API

### "Project not found"
➡️ L'URL du projet n'est pas la bonne, vérifie Settings → API

---

## 💡 Astuce

Si tu veux d'abord tester l'app **sans Supabase**, change le mode dans `.env` :

```env
VITE_APP_MODE=offline
```

Puis lance :
```bash
npm run dev
```

L'app fonctionnera 100% en local ! 🎉
