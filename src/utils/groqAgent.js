// Groq API (plateforme d'inférence ultra-rapide)
// Compatible OpenAI, plus rapide et moins cher que Grok (xAI)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Tu es l'assistant vocal de MYCOFAD, le coffre administratif de Luis.

Tu peux UNIQUEMENT effectuer ces actions :
- display : afficher un document
- download : télécharger un document
- edit : modifier un document (seulement CV et lettre)
- send : préparer l'envoi par email

Documents disponibles :
- cv : CV de Luis (modifiable)
- lettre : Lettre de motivation SOFRIGU (modifiable)
- cpf : Compte CPF (lecture seule)
- attestation : Attestation formation "Gestes et postures" (lecture seule)
- pole : Numéro Pôle Emploi (lecture seule)

IMPORTANT : Réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{ "action": "display|download|edit|send|null", "docType": "cv|lettre|cpf|attestation|pole|null", "message": "phrase courte pour Luis" }

Si tu ne comprends pas ou si l'action n'est pas permise :
{ "action": null, "docType": null, "message": "explication courte" }`;

/**
 * Demande à Groq de comprendre une commande vocale
 * @param {string} userMessage - Commande vocale de l'utilisateur
 * @param {string} lang - Langue ('fr' ou 'pt')
 * @returns {Promise<{action: string|null, docType: string|null, message: string, understood: boolean}>}
 */
export async function askGroq(userMessage, lang = 'fr') {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  // Si pas de clé API, retourner erreur
  if (!apiKey || apiKey === 'ta-clé-groq') {
    return {
      action: null,
      docType: null,
      message: lang === 'fr'
        ? "Assistant IA non configuré (mode local uniquement)"
        : "Assistente IA não configurado (modo local apenas)",
      understood: false
    };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        // Modèle Groq rapide et performant pour JSON
        model: "llama-3.3-70b-versatile", // ⚡ Ultra-rapide
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `[Langue: ${lang}] ${userMessage}` }
        ],
        max_tokens: 150,
        temperature: 0.3,
        response_format: { type: "json_object" } // Force JSON
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // Parser le JSON de Groq
    const parsed = JSON.parse(content);
    return {
      action: parsed.action,
      docType: parsed.docType,
      message: parsed.message,
      understood: !!(parsed.action && parsed.docType)
    };

  } catch (error) {
    console.error('Groq API error:', error);
    return {
      action: null,
      docType: null,
      message: lang === 'fr'
        ? "Erreur de connexion à l'assistant IA"
        : "Erro de conexão com o assistente IA",
      understood: false
    };
  }
}

/**
 * Vérifie si Groq est disponible
 * @returns {boolean}
 */
export function isGroqAvailable() {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  return !!(apiKey && apiKey !== 'ta-clé-groq');
}
