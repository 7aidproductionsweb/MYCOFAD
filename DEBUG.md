# 🐛 Mode Debug - MYCOFAD

## 🔧 Réinitialiser le quota LLM

### Méthode 1 : Console du navigateur (F12)

Ouvre la console et tape :

```javascript
// Accéder au contexte via React DevTools ou directement
localStorage.setItem('llmData', JSON.stringify({ count: 0, lastReset: new Date().toDateString() }));
window.location.reload();
```

### Méthode 2 : Via React DevTools

1. Installe React DevTools (extension Chrome/Firefox)
2. Ouvre DevTools → Onglet "Components"
3. Trouve `AppProvider`
4. Dans les hooks, trouve `resetLlmCount`
5. Clique droit → "Store as global variable"
6. Dans la console, tape : `temp1()` (ou le nom de la variable)

### Méthode 3 : Raccourci clavier secret

Ajoute ce code dans `Home.jsx` ou `VoiceButton.jsx` :

```javascript
// Écouter Ctrl+Shift+R pour reset
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      resetLlmCount();
      alert('✅ Quota LLM réinitialisé !');
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [resetLlmCount]);
```

---

## 📊 Vérifier le quota actuel

### Console :

```javascript
JSON.parse(localStorage.getItem('llmData'))
```

Résultat :
```json
{
  "count": 5,
  "lastReset": "Thu Feb 13 2026"
}
```

---

## 🎯 Accéder aux fonctions du contexte via console

### Méthode rapide :

1. Ouvre la console (F12)
2. Ajoute temporairement ce code dans `App.jsx` :

```javascript
// EN HAUT DU FICHIER App.jsx
import { useApp } from './context/AppContext';

function App() {
  const appContext = useApp();

  // Exposer le contexte globalement (DEV ONLY)
  if (import.meta.env.DEV) {
    window._app = appContext;
  }

  // ... reste du code
}
```

3. Ensuite dans la console :

```javascript
// Réinitialiser le quota
window._app.resetLlmCount();

// Voir le quota actuel
console.log(window._app.llmCount, '/', window._app.maxLlm);

// Déconnecter l'utilisateur
window._app.logout();

// Changer de langue
window._app.switchLanguage();
```

---

## 🔥 Bypass complet du quota (mode dev)

### Modifier temporairement maxLlm

Dans `AppContext.jsx`, ligne 20 :

```javascript
// Avant (20 requêtes/jour)
const maxLlm = 20;

// Après (illimité pour dev)
const maxLlm = 9999;
```

Ou utilise une variable d'environnement :

Dans `.env` :
```env
VITE_MAX_LLM=9999
```

Dans `AppContext.jsx` :
```javascript
const maxLlm = import.meta.env.VITE_MAX_LLM
  ? parseInt(import.meta.env.VITE_MAX_LLM)
  : 20;
```

---

## 🧪 Tester la reconnaissance vocale sans quota

### Option 1 : Forcer le mode local

Dans `commandRouterNew.js`, modifie `processCommand()` :

```javascript
export async function processCommand(text, lang, llmCount = 0, maxLlm = 20) {
  // 1. Essai LOCAL d'abord (TOUJOURS)
  const local = parseCommandLocal(text);

  // FORCER le mode local (commenter les lignes Groq)
  return {
    ...local,
    message: local.understood ? null : "Commande non comprise",
    usedLlm: false
  };

  /* Commenter tout le reste pour forcer local
  if (local.understood && local.confidence >= 2) { ... }
  if (isGroqAvailable() && ...) { ... }
  */
}
```

### Option 2 : Mode offline dans .env

```env
VITE_APP_MODE=offline
```

Cela désactive automatiquement Groq API.

---

## 🎮 Commandes utiles

### Voir tous les documents
```javascript
window._app.documents
```

### Voir l'utilisateur actuel
```javascript
window._app.currentUser
```

### Vérifier la source des données
```javascript
window._app.userSource // 'supabase' ou 'local'
```

### Changer manuellement la langue
```javascript
window._app.switchLanguage()
```

---

## 🚨 Supprimer toutes les données locales

```javascript
// Supprimer le quota LLM
localStorage.removeItem('llmData');

// Tout supprimer
localStorage.clear();

// Recharger
window.location.reload();
```

---

## 📝 Notes de développement

### Variables d'environnement disponibles

- `VITE_SUPABASE_URL` : URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé publique Supabase
- `VITE_GROQ_API_KEY` : Clé API Groq
- `VITE_APP_MODE` : offline | hybrid | online
- `VITE_MAX_LLM` : (optionnel) Limite quotidienne LLM

### Modes de fonctionnement

| Mode | Comportement |
|------|-------------|
| `offline` | 100% local, pas d'API |
| `hybrid` | Supabase + Groq si disponibles, sinon local |
| `online` | Supabase + Groq requis, échoue si indisponible |

---

## 💡 Astuces

### Activer les logs de debug

Dans `App.jsx` :

```javascript
if (import.meta.env.DEV) {
  console.log('🔍 Debug mode enabled');
  console.log('App mode:', import.meta.env.VITE_APP_MODE);
  console.log('Groq available:', import.meta.env.VITE_GROQ_API_KEY ? 'YES' : 'NO');
  console.log('Supabase configured:', import.meta.env.VITE_SUPABASE_URL ? 'YES' : 'NO');
}
```

### Raccourci pour tester rapidement

Ajoute dans `package.json` :

```json
{
  "scripts": {
    "dev": "vite",
    "dev:offline": "VITE_APP_MODE=offline vite",
    "dev:debug": "VITE_MAX_LLM=9999 vite"
  }
}
```

Puis :
```bash
npm run dev:offline  # Mode offline
npm run dev:debug    # Quota illimité
```
