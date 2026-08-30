export type IntentCategory = 'Recruiter' | 'Client' | 'Engineering Peer' | 'Spam';

export interface IntentAnalysisResult {
  category: IntentCategory;
  score: number;
  summary: string;
}

/**
 * Heuristic fallback classifier using deterministic pattern matching.
 */
export function classifyIntentHeuristic(intentRaw: string): IntentAnalysisResult {
  const text = (intentRaw || '').toLowerCase().trim();

  // Spam detection
  const spamKeywords = ['crypto', 'viagra', 'seo ranking', 'backlinks', 'free money', 'casino', 'lottery', 'http://', 'https://', 'bit.ly'];
  if (text.length < 5 || spamKeywords.some(k => text.includes(k))) {
    return {
      category: 'Spam',
      score: 0.95,
      summary: 'Potentially promotional or low-quality inquiry.',
    };
  }

  // Client / Business project keywords (checked before broad titles)
  const clientKeywords = [
    'client', 'consulting', 'consultant', 'freelance', 'contract work', 'build an app', 'build our',
    'quotation', 'budget', 'mvp', 'agency', 'partnership', 'estimate', 'services', 'saas', 'startup', 'commission',
  ];
  if (clientKeywords.some(k => text.includes(k))) {
    return {
      category: 'Client',
      score: 0.88,
      summary: 'Prospective client or business partner exploring project collaboration.',
    };
  }

  // Recruiter keywords
  const recruiterKeywords = [
    'hire', 'hiring', 'recruiter', 'recruiting', 'job', 'position', 'open role', 'salary', 'interview',
    'headhunter', 'talent acquisition', 'staffing', 'resume', 'cv', 'opportunity', 'full-time',
    'rate', 'lead developer', 'engineer position', 'salary expectations', 'open to new',
  ];
  if (recruiterKeywords.some(k => text.includes(k))) {
    return {
      category: 'Recruiter',
      score: 0.92,
      summary: 'Hiring manager or talent recruiter seeking candidate credentials.',
    };
  }

  // Engineering Peer keywords
  const peerKeywords = [
    'peer', 'engineer', 'collaboration', 'open source', 'ai agents', 'architecture',
    'antigravity', 'claude', 'langchain', 'tech stack', 'connect', 'networking', 'fellow', 'developer',
  ];
  if (peerKeywords.some(k => text.includes(k))) {
    return {
      category: 'Engineering Peer',
      score: 0.85,
      summary: 'Engineering peer or researcher connecting on technical topics.',
    };
  }

  // Default fallback
  return {
    category: 'Engineering Peer',
    score: 0.70,
    summary: 'General technical inquiry.',
  };
}

/**
 * Evaluates inbound intent using available LLM API (Gemini or OpenAI) with heuristic fallback.
 */
export async function analyzeIntent(intentRaw: string): Promise<IntentAnalysisResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!intentRaw || intentRaw.trim().length === 0) {
    return {
      category: 'Spam',
      score: 1.0,
      summary: 'Empty intent explanation.',
    };
  }

  // If Gemini API Key is available
  if (geminiKey && !geminiKey.startsWith('AIzaSyDummy')) {
    try {
      const prompt = `You are an automated lead intent analyzer for a Senior Full-Stack & AI Architect.
Evaluate the following reason given by a website visitor requesting the resume:
"${intentRaw.replace(/"/g, '\\"')}"

Classify into exactly one category:
- "Recruiter" (Hiring, talent acquisition, recruiters, HR, staffing)
- "Client" (Project inquiries, contract work, consulting, startup founders needing dev)
- "Engineering Peer" (Networking, open-source, fellow engineers, architectural discussion)
- "Spam" (Promotions, scams, irrelevant links, junk, abuse)

Respond ONLY with valid JSON in this exact structure:
{"category": "Recruiter"|"Client"|"Engineering Peer"|"Spam", "score": 0.95, "summary": "one brief sentence"}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const textContent = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textContent) {
          const parsed = JSON.parse(textContent);
          if (parsed.category && ['Recruiter', 'Client', 'Engineering Peer', 'Spam'].includes(parsed.category)) {
            return {
              category: parsed.category,
              score: typeof parsed.score === 'number' ? parsed.score : 0.9,
              summary: parsed.summary || 'AI evaluated intent.',
            };
          }
        }
      }
    } catch (err) {
      console.warn('[AI Intent] Gemini evaluation failed, falling back to heuristic:', err);
    }
  }

  // If OpenAI API Key is available
  if (openAiKey && !openAiKey.startsWith('sk-dummy')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are an intent analyzer. Classify the user intent into "Recruiter", "Client", "Engineering Peer", or "Spam". Respond strictly in JSON: {"category": "...", "score": 0.9, "summary": "..."}',
            },
            { role: 'user', content: intentRaw },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.category && ['Recruiter', 'Client', 'Engineering Peer', 'Spam'].includes(parsed.category)) {
            return {
              category: parsed.category,
              score: typeof parsed.score === 'number' ? parsed.score : 0.9,
              summary: parsed.summary || 'AI evaluated intent.',
            };
          }
        }
      }
    } catch (err) {
      console.warn('[AI Intent] OpenAI evaluation failed, falling back to heuristic:', err);
    }
  }

  // Fallback to deterministic heuristic
  return classifyIntentHeuristic(intentRaw);
}
