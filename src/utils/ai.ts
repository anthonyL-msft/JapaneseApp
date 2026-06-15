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

export type BreakdownBlock =
  | { type: 'text'; content: string }
  | { type: 'phrase'; phrase: AIPhrase };

export function isAIConfigured(): boolean {
  return !!(ENDPOINT && API_KEY && API_KEY !== 'PASTE_YOUR_API_KEY_HERE' && DEPLOYMENT);
}

const safeStr = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (v == null) return '';
  if (typeof v === 'object') return Object.values(v as Record<string, unknown>).map(safeStr).join('');
  return String(v);
};

function parseAIResponse(content: string): AIPhrase {
  const jsonStr = content.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[0]); } catch { throw new Error('Could not parse AI response. Try a simpler question.'); }
    } else {
      throw new Error('AI returned non-JSON response. Try again.');
    }
  }
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

export async function askHowToSay(query: string, lang: string, explainLang: string = 'en'): Promise<AIPhrase> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured. Add your Azure OpenAI key in settings.');
  }

  const explainInstr = explainLang === 'zh-TW' ? 'Write "notes" and "native_hint" in Traditional Chinese (繁體中文).' : 'Write "notes" and "native_hint" in English.';

  const langInstructions: Record<string, string> = {
    ja: `Translate to Japanese. Include:
- "target": the phrase in Japanese (kanji + kana)
- "romanization": hiragana reading
- "pronunciation": romaji (Hepburn) with spaces between words
- "pronunciation_chunks": syllable-broken romaji with · separators and spaces between words
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": usage tips, politeness level, or context
- "native_hint": kanji meaning bridge for Chinese speakers (if applicable)
Use CASUAL POLITE (丁寧語/masu form) — NOT humble/honorific (謙譲語/尊敬語). 
Keep phrases short and easy to say for beginners. 
Prefer 〜てもらえますか over 〜ていただけますか, 〜でいいですか over 〜でよろしいでしょうか.
Default to 2 people context. Avoid unnecessarily long or formal expressions.
${explainInstr}`,
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

  return parseAIResponse(content);
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
  explainLang: string = 'en',
): Promise<AIPhrase> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured.');
  }

  const langName = lang === 'ja' ? 'Japanese' : lang === 'es' ? 'Spanish' : 'French';

  const systemPrompt = `You are a travel language tutor helping a beginner learner. The user previously asked how to say something and got a ${langName} translation. Now they want a follow-up: a simpler version, a more polite version, a variation, or an explanation.

Always respond with a valid JSON object in this exact format:
- "target": the phrase in ${langName} (for Japanese: kanji + kana)
${lang === 'ja' ? '- "romanization": hiragana reading (e.g. "このせきはあいていますか")\n' : ''}- "pronunciation": romanized pronunciation with spaces between words (e.g. "kono seki wa aite imasu ka")
- "pronunciation_chunks": syllable-broken with · separators and spaces between words (e.g. "ko·no se·ki wa ai·te i·ma·su ka")
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": explanation IN ENGLISH of how this differs from the original, usage tips
${lang === 'ja' ? '- "native_hint": IN ENGLISH, kanji meaning bridge for Chinese speakers (if applicable)\n' : ''}
${lang === 'ja' ? 'Use CASUAL POLITE (丁寧語/masu form). Keep phrases short and easy for beginners.' : ''}

IMPORTANT: ${explainLang === 'zh-TW' ? '"notes" and "native_hint" MUST be in Traditional Chinese (繁體中文).' : '"notes" and "native_hint" MUST be in English.'} "pronunciation" MUST have spaces between words.

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

  return parseAIResponse(content);
}

/** Send a follow-up that expects multiple phrase examples back */
export async function askFollowUpMulti(
  originalPhrase: AIPhrase,
  followUpQuery: string,
  lang: string,
  explainLang: string = 'en',
): Promise<AIPhrase[]> {
  if (!isAIConfigured()) throw new Error('AI not configured.');

  const langName = lang === 'ja' ? 'Japanese' : lang === 'es' ? 'Spanish' : 'French';

  const systemPrompt = `You are a travel language tutor. The user wants to see multiple examples using the same sentence pattern as the original phrase, but with different objects/subjects/contexts.

Return a JSON array of 3-5 phrase objects. Each object has:
- "target": the phrase in ${langName} (for Japanese: kanji + kana)
${lang === 'ja' ? '- "romanization": hiragana reading\n' : ''}- "pronunciation": romanized pronunciation with spaces between words
- "pronunciation_chunks": syllable-broken with · separators and spaces between words
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": brief note IN ${explainLang === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'ENGLISH'} on when/where to use this variation
${lang === 'ja' ? `- "native_hint": IN ${explainLang === 'zh-TW' ? 'Traditional Chinese' : 'ENGLISH'}, kanji bridge for Chinese speakers (if applicable)\n` : ''}
${lang === 'ja' ? 'Use CASUAL POLITE (丁寧語/masu form). Keep phrases short and practical for travel.' : ''}

Respond ONLY with a valid JSON array. No markdown, no wrapping object, just [...].`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Original phrase: ${originalPhrase.target} (${originalPhrase.pronunciation}) = "${originalPhrase.english}"\n\n${followUpQuery}` },
  ];

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify({ messages, temperature: 0.4, max_tokens: 800 }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`AI request failed: ${resp.status} ${errText}`);
  }

  const resData = await resp.json();
  const resContent = resData.choices?.[0]?.message?.content?.trim();
  if (!resContent) throw new Error('Empty response from AI');

  const jsonStr = resContent.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  let parsed;
  try { parsed = JSON.parse(jsonStr); } catch {
    const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrMatch) { try { parsed = JSON.parse(arrMatch[0]); } catch { throw new Error('Could not parse AI response.'); } }
    else throw new Error('Could not parse AI response. Try again.');
  }

  // AI sometimes wraps array in an object like { "phrases": [...] } or { "examples": [...] }
  if (!Array.isArray(parsed) && typeof parsed === 'object') {
    const vals = Object.values(parsed as Record<string, unknown>);
    const arrVal = vals.find(v => Array.isArray(v));
    if (arrVal) {
      parsed = arrVal;
    } else {
      parsed = [parsed];
    }
  }
  if (!Array.isArray(parsed)) parsed = [parsed];

  return parsed.map((item: Record<string, unknown>) => ({
    target: safeStr(item.target),
    romanization: item.romanization ? safeStr(item.romanization) : undefined,
    pronunciation: safeStr(item.pronunciation),
    pronunciation_chunks: safeStr(item.pronunciation_chunks),
    english: safeStr(item.english),
    chinese_tc: safeStr(item.chinese_tc),
    notes: safeStr(item.notes),
    native_hint: item.native_hint ? safeStr(item.native_hint) : undefined,
  }));
}

/** Break down a phrase into pattern explanation + example phrases */
export async function askBreakdown(
  originalPhrase: AIPhrase,
  lang: string,
  explainLang: string = 'en',
): Promise<BreakdownBlock[]> {
  if (!isAIConfigured()) throw new Error('AI not configured.');

  const langName = lang === 'ja' ? 'Japanese' : lang === 'es' ? 'Spanish' : 'French';

  const systemPrompt = `You are a travel language tutor for beginners. Break down the given ${langName} phrase into a mini-lesson.

Return a JSON array of blocks. Each block is one of:

1. Text block: { "type": "text", "content": "explanation text here" }
2. Phrase block: { "type": "phrase", "target": "...", ${lang === 'ja' ? '"romanization": "hiragana reading", ' : ''}"pronunciation": "...", "pronunciation_chunks": "syllable·broken", "english": "...", "chinese_tc": "...", "notes": "brief note" }

Structure your response as:
1. A text block IN ENGLISH explaining the pattern/grammar structure (identify the reusable pattern like 〇〇してもらえますか)
2. A text block IN ENGLISH breaking down each part of the original phrase (what each word/particle means)
3. 3 phrase blocks showing the same pattern applied to different situations (practical travel examples). Each phrase block MUST have \"pronunciation\" with spaces between words.
4. A text block IN ENGLISH with a tip on how to use this pattern

IMPORTANT: All text block content MUST be in ${explainLang === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'English'}. Phrase blocks have \"notes\" in ${explainLang === 'zh-TW' ? 'Traditional Chinese' : 'English'}.
${lang === 'ja' ? 'Use CASUAL POLITE (丁寧語/masu form). Keep examples practical for travel.' : ''}

Respond ONLY with a valid JSON array. No markdown wrapping.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Break down this phrase: ${originalPhrase.target} (${originalPhrase.pronunciation}) = "${originalPhrase.english}"` },
  ];

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify({ messages, temperature: 0.3, max_tokens: 1000 }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`AI request failed: ${resp.status} ${errText}`);
  }

  const resData = await resp.json();
  const resContent = resData.choices?.[0]?.message?.content?.trim();
  if (!resContent) throw new Error('Empty response from AI');

  const jsonStr = resContent.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  let parsed;
  try { parsed = JSON.parse(jsonStr); } catch {
    const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrMatch) { try { parsed = JSON.parse(arrMatch[0]); } catch { throw new Error('Could not parse AI response.'); } }
    else throw new Error('Could not parse AI response. Try again.');
  }

  // AI sometimes wraps array in an object
  if (!Array.isArray(parsed) && typeof parsed === 'object') {
    const vals = Object.values(parsed as Record<string, unknown>);
    const arrVal = vals.find(v => Array.isArray(v));
    if (arrVal) { parsed = arrVal; } else { parsed = [parsed]; }
  }
  if (!Array.isArray(parsed)) parsed = [parsed];

  return parsed.map((block: Record<string, unknown>): BreakdownBlock => {
    if (block.type === 'text') {
      return { type: 'text', content: safeStr(block.content) };
    }
    // Treat as phrase block
    return {
      type: 'phrase',
      phrase: {
        target: safeStr(block.target),
        romanization: block.romanization ? safeStr(block.romanization) : undefined,
        pronunciation: safeStr(block.pronunciation),
        pronunciation_chunks: safeStr(block.pronunciation_chunks),
        english: safeStr(block.english),
        chinese_tc: safeStr(block.chinese_tc),
        notes: safeStr(block.notes),
        native_hint: block.native_hint ? safeStr(block.native_hint) : undefined,
      },
    };
  });
}
