const ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const API_KEY = import.meta.env.VITE_AZURE_OPENAI_KEY;
const DEPLOYMENT = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
const API_VERSION = import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

export interface AIPhrase {
  target: string;
  romanization?: string;
  pronunciation: string;
  pronunciation_chunks: string;
  english: string;
  chinese_tc: string;
  notes: string;
  native_hint?: string;
}

export function isAIConfigured(): boolean {
  return !!(ENDPOINT && API_KEY && API_KEY !== 'PASTE_YOUR_API_KEY_HERE' && DEPLOYMENT);
}

export async function askHowToSay(query: string, lang: string): Promise<AIPhrase> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured. Add your Azure OpenAI key in settings.');
  }

  const langInstructions: Record<string, string> = {
    ja: `Translate to Japanese. Include:
- "target": the phrase in Japanese (kanji + kana)
- "romanization": hiragana reading
- "pronunciation": romaji (Hepburn)
- "pronunciation_chunks": syllable-broken romaji with · separators (e.g., "su·mi·ma·sen")
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": usage tips, politeness level, or context
- "native_hint": kanji meaning bridge for Chinese speakers (if applicable)
Use CASUAL POLITE (丁寧語/masu form) — NOT humble/honorific (謙譲語/尊敬語). 
Keep phrases short and easy to say for beginners. 
Prefer 〜てもらえますか over 〜ていただけますか, 〜でいいですか over 〜でよろしいでしょうか.
Default to 2 people context. Avoid unnecessarily long or formal expressions.`,
    es: `Translate to Spanish. Include:
- "target": the phrase in Spanish
- "pronunciation": phonetic pronunciation guide
- "pronunciation_chunks": syllable-broken pronunciation with · separators
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": usage tips or context`,
    fr: `Translate to French. Include:
- "target": the phrase in French
- "pronunciation": phonetic pronunciation guide
- "pronunciation_chunks": syllable-broken pronunciation with · separators
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": usage tips or context`,
  };

  const systemPrompt = `You are a travel phrase translator. The user will describe what they want to say. ${langInstructions[lang] || langInstructions.ja}

Respond ONLY with a valid JSON object. No markdown, no explanation, just the JSON.`;

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('Empty response from AI');
  }

  // Parse JSON — strip markdown fences if present
  const jsonStr = content.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  const parsed = JSON.parse(jsonStr);

  // Safety: ensure all values are strings (AI sometimes returns objects)
  const safeStr = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v == null) return '';
    if (typeof v === 'object') return Object.values(v as Record<string, unknown>).map(safeStr).join('');
    return String(v);
  };

  return {
    target: safeStr(parsed.target),
    romanization: parsed.romanization ? safeStr(parsed.romanization) : undefined,
    pronunciation: safeStr(parsed.pronunciation),
    pronunciation_chunks: safeStr(parsed.pronunciation_chunks),
    english: safeStr(parsed.english),
    chinese_tc: safeStr(parsed.chinese_tc),
    notes: safeStr(parsed.notes),
    native_hint: parsed.native_hint ? safeStr(parsed.native_hint) : undefined,
  };
}

export interface FollowUpMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Send a follow-up question about a previously translated phrase */
export async function askFollowUp(
  originalPhrase: AIPhrase,
  followUpQuery: string,
  conversationHistory: FollowUpMessage[],
  lang: string,
): Promise<AIPhrase> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured.');
  }

  const langName = lang === 'ja' ? 'Japanese' : lang === 'es' ? 'Spanish' : 'French';

  const systemPrompt = `You are a travel language tutor helping a beginner learner. The user previously asked how to say something and got a ${langName} translation. Now they want a follow-up: a simpler version, a more polite version, a variation, or an explanation.

Always respond with a valid JSON object in this exact format:
- "target": the phrase in ${langName} (for Japanese: kanji + kana)
${lang === 'ja' ? '- "romanization": hiragana reading\n' : ''}- "pronunciation": romanized pronunciation
- "pronunciation_chunks": syllable-broken with · separators
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": explanation of how this differs from the original, usage tips
${lang === 'ja' ? '- "native_hint": kanji meaning bridge for Chinese speakers (if applicable)\n' : ''}
${lang === 'ja' ? 'Use CASUAL POLITE (丁寧語/masu form). Keep phrases short and easy for beginners.' : ''}

Respond ONLY with valid JSON. No markdown, no explanation.`;

  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Original phrase: ${originalPhrase.target} (${originalPhrase.pronunciation}) = "${originalPhrase.english}"` },
  ];

  // Add conversation history
  for (const msg of conversationHistory) {
    if (msg.role === 'assistant') {
      messages.push({ role: 'assistant', content: msg.content });
    } else {
      messages.push({ role: 'user', content: msg.content });
    }
  }

  // Add the new follow-up
  messages.push({ role: 'user', content: followUpQuery });

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': API_KEY,
    },
    body: JSON.stringify({
      messages,
      temperature: 0.3,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('Empty response from AI');
  }

  const jsonStr = content.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  const parsed = JSON.parse(jsonStr);

  const safeStr = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v == null) return '';
    if (typeof v === 'object') return Object.values(v as Record<string, unknown>).map(safeStr).join('');
    return String(v);
  };

  return {
    target: safeStr(parsed.target),
    romanization: parsed.romanization ? safeStr(parsed.romanization) : undefined,
    pronunciation: safeStr(parsed.pronunciation),
    pronunciation_chunks: safeStr(parsed.pronunciation_chunks),
    english: safeStr(parsed.english),
    chinese_tc: safeStr(parsed.chinese_tc),
    notes: safeStr(parsed.notes),
    native_hint: parsed.native_hint ? safeStr(parsed.native_hint) : undefined,
  };
}
