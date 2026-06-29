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

export interface FollowUpExplanation {
  answer: string;
  example?: AIPhrase;
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

IMPORTANT: ${explainLang === 'zh-TW' ? '"notes" and "native_hint" MUST be in Traditional Chinese (繁體中文).' : '"notes" and "native_hint" MUST be in English.'} "pronunciation" MUST have spaces between words. ${lang === 'ja' ? '"romanization" is REQUIRED — always include the full hiragana reading.' : ''}

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

/** Answer grammar/usage follow-up questions without forcing a new translated phrase */
export async function askFollowUpExplain(
  originalPhrase: AIPhrase,
  followUpQuery: string,
  lang: string,
  explainLang: string = 'en',
  tutorMode: string = 'teacher',
): Promise<FollowUpExplanation> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured.');
  }

  const langName = lang === 'ja' ? 'Japanese' : lang === 'es' ? 'Spanish' : 'French';

  const teacherRules = tutorMode === 'teacher'
    ? `
Teaching style requirements:
- Start with a direct answer in the first sentence (for yes/no questions, begin with Yes or No).
- Then explain why in 1-2 short sentences.
- End with one short practical example if helpful.
- Do not answer with only an alternative phrase; always answer the actual question first.`
    : '';

  const replyLang2 = explainLang === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'English';

  const systemPrompt = `You are a travel language tutor. IMPORTANT: You MUST write all explanations and answers in ${replyLang2}. Never reply in ${langName} except for example phrases. The user asks a grammar/meaning/word-choice question about an existing ${langName} phrase.

Return a valid JSON object:
{
  "answer": "structured answer in ${replyLang2}",
  "example": { "target": "example phrase in ${langName}", "romanization": "hiragana reading", "pronunciation": "romaji with spaces", "english": "${explainLang === 'zh-TW' ? 'Chinese translation' : 'English translation'}" }
}

Rules for "answer" — structure it like a mini-lesson:
1. Start with a direct answer (1-2 sentences). For yes/no questions, start with Yes or No.
2. When explaining a word or usage, include common patterns or combinations if helpful.
3. If asked for "more examples", give 3-5 example sentences, each on its own line: phrase (romaji) = meaning.
4. Keep it concise — no more than 6-8 lines total.
5. The "answer" text MUST be in ${replyLang2}. ${langName} words are OK inline as examples but all explanations in ${replyLang2}.

Rules for "example":
- OPTIONAL — only include when a single practical travel example directly illustrates the point.
- Omit if the answer already contains examples or is self-explanatory.
- "english" field should be in ${replyLang2}.

General:
- For ${langName === 'Japanese' ? '"romanization" must be the hiragana reading. "pronunciation" must be romaji with spaces between words.' : '"pronunciation" must be phonetic guide.'}
${teacherRules}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Original phrase: ${originalPhrase.target} (${originalPhrase.pronunciation}) = "${originalPhrase.english}"` },
    { role: 'user', content: followUpQuery },
  ];

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
      max_tokens: 350,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from AI');

  const jsonStr = content.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        parsed = JSON.parse(objMatch[0]);
      } catch {
        parsed = null;
      }
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    return { answer: content };
  }

  const answer = safeStr(parsed.answer).trim();
  if (!answer) {
    return { answer: content };
  }

  // Parse optional example phrase
  let example: AIPhrase | undefined;
  if (parsed.example && typeof parsed.example === 'object') {
    const ex = parsed.example as Record<string, unknown>;
    if (ex.target) {
      example = {
        target: safeStr(ex.target),
        romanization: ex.romanization ? safeStr(ex.romanization) : undefined,
        pronunciation: safeStr(ex.pronunciation),
        pronunciation_chunks: safeStr(ex.pronunciation_chunks),
        english: safeStr(ex.english),
        chinese_tc: safeStr(ex.chinese_tc),
        notes: safeStr(ex.notes),
      };
    }
  }

  return { answer, example };
}

/** Answer a standalone grammar question without needing a specific phrase */
export async function askGrammarQuestion(
  question: string,
  lang: string,
  explainLang: string = 'en',
): Promise<FollowUpExplanation> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured.');
  }

  const langName = lang === 'ja' ? 'Japanese' : lang === 'es' ? 'Spanish' : 'French';

  const replyLang = explainLang === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'English';

  const systemPrompt = `You are a travel language tutor for ${langName}. IMPORTANT: You MUST write all explanations and answers in ${replyLang}. Never reply in ${langName} except for example phrases.

The user asks a grammar, structure, or usage question. They may ask in English, Chinese, or ${langName}. If the question includes "Context:", use that context to give a relevant follow-up answer about the same grammar topic.

Return a valid JSON object:
{
  "answer": "structured answer in ${replyLang}",
  "example": { "target": "example phrase in ${langName}", "romanization": "hiragana reading", "pronunciation": "romaji with spaces", "english": "${explainLang === 'zh-TW' ? 'Chinese translation' : 'English translation'}" }
}

Rules for "answer" — structure it like a mini-lesson:
1. Start with a direct answer (1-2 sentences). For yes/no questions, start with Yes or No.
2. If explaining a word or grammar point, include:
   - Common patterns of use (e.g. 暑い〜, 〜は暑い)
   - 2-3 common word combinations (e.g. 暑い夏 = hot summer, 暑い日 = hot day)
3. If the user asks for "more examples", give 3-5 example sentences, each on its own line: phrase (romaji) = meaning.
4. Keep it concise — no more than 6-8 lines total.
5. The "answer" text MUST be in ${replyLang}. ${langName} words are OK inline as examples but all explanations in ${replyLang}.

Rules for "example":
- OPTIONAL — only include when a single practical travel example directly illustrates the point.
- Do NOT include for meta questions ("how to memorize", "best way to learn") or when examples are already in the answer text.
- "english" field should be in ${replyLang}.

General rules:
- For Japanese: "romanization" = hiragana reading, "pronunciation" = romaji with spaces between words.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question },
  ];

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify({ messages, temperature: 0.3, max_tokens: 800 }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from AI');

  const jsonStr = content.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  let parsed: Record<string, unknown> | null = null;
  try { parsed = JSON.parse(jsonStr); } catch {
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) { try { parsed = JSON.parse(objMatch[0]); } catch { parsed = null; } }
  }

  // Fallback: extract "answer" value from truncated/malformed JSON
  if (!parsed || typeof parsed !== 'object') {
    const answerMatch = jsonStr.match(/"answer"\s*:\s*"([\s\S]*?)(?:"\s*[,}]|"?\s*$)/);
    if (answerMatch) {
      const extracted = answerMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      return { answer: extracted };
    }
    return { answer: content };
  }

  const answer = safeStr(parsed.answer).trim();
  if (!answer) return { answer: content };

  let example: AIPhrase | undefined;
  if (parsed.example && typeof parsed.example === 'object') {
    const ex = parsed.example as Record<string, unknown>;
    if (ex.target) {
      example = {
        target: safeStr(ex.target),
        romanization: ex.romanization ? safeStr(ex.romanization) : undefined,
        pronunciation: safeStr(ex.pronunciation),
        pronunciation_chunks: safeStr(ex.pronunciation_chunks),
        english: safeStr(ex.english),
        chinese_tc: safeStr(ex.chinese_tc),
        notes: safeStr(ex.notes),
      };
    }
  }

  return { answer, example };
}

/** Check a user-written sentence for correctness */
export async function askCheckSentence(
  sentence: string,
  lang: string,
  explainLang: string = 'en',
): Promise<FollowUpExplanation> {
  if (!isAIConfigured()) {
    throw new Error('AI not configured.');
  }

  const langName = lang === 'ja' ? 'Japanese' : lang === 'es' ? 'Spanish' : 'French';
  const replyLang = explainLang === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'English';

  const systemPrompt = `You are a ${langName} sentence checker. The user writes a sentence in ${langName} and you check if it is correct. IMPORTANT: All explanations MUST be in ${replyLang}.

Return a valid JSON object:
{
  "answer": "structured feedback in ${replyLang}",
  "example": { "target": "corrected sentence in ${langName}", "romanization": "hiragana reading", "pronunciation": "romaji with spaces", "english": "translation in ${replyLang}" }
}

Rules for "answer":
1. First line: verdict — "✅ Correct!" or "❌ Not quite right."
2. If incorrect, explain WHAT is wrong in 1-2 sentences (in ${replyLang}).
3. Show the correction: ❌ [user's sentence] → ✅ [corrected sentence]
4. Briefly explain WHY — what grammar rule applies (in ${replyLang}).
5. If mostly correct but unnatural, say "✅ Grammatically OK but more natural: [better version]"

Rules for "example":
- ALWAYS include — this is the corrected (or confirmed correct) sentence.
- If the sentence was already correct, include it as-is with its reading.

Keep feedback concise — max 5-6 lines. Be encouraging.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: sentence },
  ];

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify({ messages, temperature: 0.3, max_tokens: 600 }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from AI');

  const jsonStr = content.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '');
  let parsed: Record<string, unknown> | null = null;
  try { parsed = JSON.parse(jsonStr); } catch {
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) { try { parsed = JSON.parse(objMatch[0]); } catch { parsed = null; } }
  }

  // Fallback: extract "answer" value from truncated/malformed JSON
  if (!parsed || typeof parsed !== 'object') {
    const answerMatch = jsonStr.match(/"answer"\s*:\s*"([\s\S]*?)(?:"\s*[,}]|"?\s*$)/);
    if (answerMatch) {
      const extracted = answerMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      return { answer: extracted };
    }
    return { answer: content };
  }

  const answer = safeStr(parsed.answer).trim();
  if (!answer) return { answer: content };

  let example: AIPhrase | undefined;
  if (parsed.example && typeof parsed.example === 'object') {
    const ex = parsed.example as Record<string, unknown>;
    if (ex.target) {
      example = {
        target: safeStr(ex.target),
        romanization: ex.romanization ? safeStr(ex.romanization) : undefined,
        pronunciation: safeStr(ex.pronunciation),
        pronunciation_chunks: safeStr(ex.pronunciation_chunks),
        english: safeStr(ex.english),
        chinese_tc: safeStr(ex.chinese_tc),
        notes: safeStr(ex.notes),
      };
    }
  }

  return { answer, example };
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
${lang === 'ja' ? '- "romanization": REQUIRED hiragana reading (e.g. "このせきはあいていますか")\n' : ''}- "pronunciation": romanized pronunciation with spaces between words
- "pronunciation_chunks": syllable-broken with · separators and spaces between words (e.g. "ko·no se·ki wa ai·te i·ma·su ka")
- "english": English translation
- "chinese_tc": Traditional Chinese translation
- "notes": brief note IN ${explainLang === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'ENGLISH'} on when/where to use this variation
${lang === 'ja' ? `- "native_hint": IN ${explainLang === 'zh-TW' ? 'Traditional Chinese' : 'ENGLISH'}, kanji bridge for Chinese speakers (if applicable)\n` : ''}
${lang === 'ja' ? 'Use CASUAL POLITE (丁寧語/masu form). Keep phrases short and practical for travel. "romanization" is REQUIRED for every phrase.' : ''}

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
2. Phrase block: { "type": "phrase", "target": "...", ${lang === 'ja' ? '"romanization": "REQUIRED hiragana reading", ' : ''}"pronunciation": "romaji with spaces between words", "pronunciation_chunks": "syllable·broken with spaces between words", "english": "...", "chinese_tc": "...", "notes": "brief note" }

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

// ============================================================
// Sentence Expansion — grow a sentence step by step
// ============================================================

export interface SentenceExpansion {
  label: string;       // e.g. "+Where" or "+Who"
  target: string;      // full expanded sentence
  pronunciation: string;
  pronunciation_chunks: string;
  english: string;
  added: string;       // the new part that was added (for highlighting)
}

export async function askSentenceExpansion(
  currentSentence: string,
  currentEnglish: string,
  history: string[],
): Promise<SentenceExpansion[]> {
  if (!isAIConfigured()) throw new Error('AI not configured.');

  const historyNote = history.length > 0
    ? `\nPrevious expansions already added: ${history.join(', ')}. Do NOT suggest the same categories again.`
    : '';

  const systemPrompt = `You are a Japanese sentence building tutor for beginners. Given a Japanese sentence, suggest 2-3 ways to expand it by adding ONE grammar element.

Each suggestion should add a different type of element:
- +Where (destination/location): に, で, へ
- +Who (companion): と
- +When (time): に, 朝/昼/夜, 曜日
- +What (object): を
- +How (manner/transport): で
- +Why (reason): から, ので
- +How much/many (quantity): 数量
${historyNote}

Return a JSON array of 2-3 expansion objects. Each object:
{
  "label": "+Category (e.g. +Where, +Who, +When)",
  "target": "full expanded Japanese sentence",
  "pronunciation": "romaji with spaces between words",
  "pronunciation_chunks": "syllable·broken with · separators and spaces between words",
  "english": "English translation",
  "added": "just the new Japanese words/phrase that was added"
}

Keep sentences natural, travel-relevant, and in casual polite form (ます/です).
Each expansion should produce a natural sentence a traveler might actually say.
Respond ONLY with a valid JSON array.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Expand this sentence: ${currentSentence} = "${currentEnglish}"` },
  ];

  const url = `${ENDPOINT}/openai/deployments/${DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': API_KEY },
    body: JSON.stringify({ messages, temperature: 0.7, max_tokens: 600 }),
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
    if (arrMatch) {
      try { parsed = JSON.parse(arrMatch[0]); } catch { throw new Error('Could not parse AI response.'); }
    } else { throw new Error('AI returned non-JSON response.'); }
  }
  if (!Array.isArray(parsed)) parsed = [parsed];

  return parsed.map((e: Record<string, unknown>): SentenceExpansion => ({
    label: safeStr(e.label),
    target: safeStr(e.target),
    pronunciation: safeStr(e.pronunciation),
    pronunciation_chunks: safeStr(e.pronunciation_chunks),
    english: safeStr(e.english),
    added: safeStr(e.added),
  }));
}
