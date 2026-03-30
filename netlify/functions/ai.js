// Netlify Serverless Function — Gemini 2.5 Flash API Proxy
// Handles all AI requests: vocabulary, quiz, grammar exercises, conversation, chat

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const LUNA_SYSTEM_PROMPT = `You are Luna, a magical fairy assistant to Princess Zeynep who is learning English. 
You speak in a warm, encouraging, royal-fantasy style. 
Always address the user as "Princess Zeynep" or "Your Highness".
Keep your responses SHORT — maximum 3-4 sentences.
The user is at A1 English level — use VERY simple English, and always add Turkish translation below your English response in parentheses.
Format: [English response] \\n (Türkçe: [Turkish translation])
Encourage and motivate constantly. Use emojis: 👑 ✨ 🌟 💫 🧚
Never say the user is wrong — gently guide them to the right answer.
If the user writes in Turkish, respond in both English and Turkish.`;

function buildPrompt(type, payload) {
  switch (type) {
    case "vocabulary":
      return `Generate exactly 12 A1 level English vocabulary words for the topic: "${payload.topic}".
Return ONLY a valid JSON array, no markdown, no explanation, no code fences:
[{"english": "word", "turkish": "kelime", "example_en": "Simple example sentence.", "example_tr": "Basit örnek cümle."}]
Make sure each word is appropriate for A1 beginners. Use simple, common words.`;

    case "quiz":
      return `Generate 8 multiple choice vocabulary quiz questions from these words: ${JSON.stringify(payload.words)}.
Each question should test if the student knows the Turkish meaning of the English word or vice versa.
Return ONLY a valid JSON array, no markdown, no explanation, no code fences:
[{"question": "What is the Turkish meaning of 'apple'?", "options": ["elma", "armut", "kiraz", "üzüm"], "correct": 0, "luna_feedback": "Wonderful, Princess! 🍎✨"}]
The "correct" field is the zero-based index of the correct option.
Make Luna's feedback encouraging and royal-themed with emojis.`;

    case "grammar_exercise":
      return `Generate 6 mixed exercises for this A1 grammar topic: "${payload.topic}".
Mix of types: fill_blank and multiple_choice ONLY. Do NOT use "order" or sentence ordering questions.
Return ONLY a valid JSON array, no markdown, no explanation, no code fences:
[
  {"type": "fill_blank", "question": "I ___ a student. (Ben bir öğrenciyim.)", "options": null, "words": null, "answer": "am", "luna_feedback": "Perfect, Princess! ✨"},
  {"type": "multiple_choice", "question": "She ___ a teacher.", "options": ["am", "is", "are", "be"], "words": null, "answer": "is", "correct": 1, "luna_feedback": "Wonderful! 👑"}
]
CRITICAL: For "fill_blank" questions, you MUST include a hint or the Turkish translation in parentheses at the end of the sentence so the user exactly knows which word is missing. Examples: "She loves ___ (elmalar)." -> answer: "apples".
Keep everything A1 level. Make Luna's feedback warm, encouraging and royal-themed.`;

    case "conversation":
      return `${LUNA_SYSTEM_PROMPT}

You are now in a roleplay scenario: ${payload.scenario}
Your role: ${payload.character || "Luna the fairy assistant"}
Stay in character for this scenario while being Luna.
Keep responses under 3 sentences, very simple A1 English.
Add Turkish translation in parentheses after your English response.

Previous messages:
${payload.history || "No previous messages."}

Princess Zeynep says: ${payload.userMessage}`;

    case "chat":
      return `${LUNA_SYSTEM_PROMPT}

Conversation history:
${payload.history || "No previous messages."}

Princess Zeynep says: ${payload.userMessage}`;

    default:
      throw new Error(`Unknown request type: ${type}`);
  }
}

exports.handler = async function (event) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { type, payload } = body;

  if (!type || !payload) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing type or payload" }),
    };
  }

  let prompt;
  try {
    prompt = buildPrompt(type, payload);
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }

  // Call Gemini API — with one retry on failure
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: type === "chat" || type === "conversation" ? 0.8 : 0.4,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (attempt ${attempt + 1}):`, errorText);
        if (attempt === 1) {
          return {
            statusCode: 502,
            headers,
            body: JSON.stringify({ error: "AI service error", details: errorText }),
          };
        }
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        if (attempt === 1) {
          return {
            statusCode: 502,
            headers,
            body: JSON.stringify({ error: "Empty response from AI" }),
          };
        }
        continue;
      }

      // For types that expect JSON, try to parse and validate
      if (["vocabulary", "quiz", "grammar_exercise"].includes(type)) {
        try {
          // Strip markdown code fences if present
          let cleanText = text.trim();
          if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
          }
          const parsed = JSON.parse(cleanText);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ result: parsed }),
          };
        } catch (parseErr) {
          console.error(`JSON parse error (attempt ${attempt + 1}):`, parseErr.message);
          if (attempt === 1) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ result: text, raw: true }),
            };
          }
          continue;
        }
      }

      // For chat/conversation, return text directly
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ result: text }),
      };

    } catch (err) {
      console.error(`Network error (attempt ${attempt + 1}):`, err.message);
      if (attempt === 1) {
        return {
          statusCode: 502,
          headers,
          body: JSON.stringify({ error: "Network error connecting to AI service" }),
        };
      }
    }
  }
};
