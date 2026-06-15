// Hiragana/Katakana → Romaji character-by-character mapping

// Two-char combinations (small kana ゃゅょ) — check before singles
const COMBO_KANA: Record<string, string> = {
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja',  'じゅ': 'ju',  'じょ': 'jo',
  'ぢゃ': 'dya', 'ぢゅ': 'dyu', 'ぢょ': 'dyo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  // Katakana combos
  'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
  'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
  'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
  'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
  'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
  'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
  'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
  'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
  'ジャ': 'ja',  'ジュ': 'ju',  'ジョ': 'jo',
  'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
  'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
};

const SINGLE_KANA: Record<string, string> = {
  // Hiragana
  'あ': 'a',  'い': 'i',  'う': 'u',  'え': 'e',  'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi','す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi','つ': 'tsu','て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo',
  'ん': 'n',  'っ': '',
  // Dakuten
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  // Handakuten
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  // Katakana
  'ア': 'a',  'イ': 'i',  'ウ': 'u',  'エ': 'e',  'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi','ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi','ツ': 'tsu','テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',  'ッ': '',   'ー': '–',
  // Katakana dakuten
  'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
  'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
  'ダ': 'da', 'ヂ': 'di', 'ヅ': 'du', 'デ': 'de', 'ド': 'do',
  'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
  'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
};

export interface KanaUnit {
  char: string;
  romaji: string;
  isSpace?: boolean;
  isVowelOnly?: boolean;
  /** true if this unit starts a new pronunciation chunk */
  isChunkStart?: boolean;
  /** true if this is a word boundary (space) */
  isWordBreak?: boolean;
  /** true if this kana is a vowel lengthener (う extending ō, い extending ē, etc.) */
  isLengthener?: boolean;
}

const VOWEL_ROMAJI = new Set(['a', 'i', 'u', 'e', 'o']);

/** Split breakdown units into word groups (separated by spaces) */
export function groupByWord(units: KanaUnit[]): KanaUnit[][] {
  const groups: KanaUnit[][] = [];
  let current: KanaUnit[] = [];
  for (const u of units) {
    if (u.isSpace) {
      if (current.length) groups.push(current);
      current = [];
    } else {
      current.push(u);
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

/**
 * Mark chunk boundaries by matching kana romaji against pronunciation_chunks.
 * e.g. chunks "o·ha·you go·zai·ma·su" → よう grouped as one chunk, ざい as one chunk.
 */
export function markChunkBoundaries(units: KanaUnit[], pronunciationChunks: string): KanaUnit[] {
  // Parse chunks: split by space for word groups, then by · for syllable chunks
  // Flatten to a list of chunk strings: ["o","ha","you","go","zai","ma","su"]
  // with word break markers
  const wordParts = pronunciationChunks.split(/\s+/);
  const chunks: { text: string; wordBreakBefore: boolean }[] = [];
  wordParts.forEach((wp, wi) => {
    wp.split('·').forEach((ch, ci) => {
      chunks.push({ text: ch, wordBreakBefore: wi > 0 && ci === 0 });
    });
  });

  // Known pronunciation exceptions: は→wa (particle), へ→e (direction)
  const ALT_ROMAJI: Record<string, string> = { 'ha': 'wa', 'he': 'e' };

  // Now greedily match kana units (skipping spaces) to chunks
  const result = units.map(u => ({ ...u }));
  const nonSpaceUnits = result.filter(u => !u.isSpace);

  let ki = 0; // index into nonSpaceUnits
  for (const chunk of chunks) {
    if (ki >= nonSpaceUnits.length) break;
    
    // Mark first kana in this chunk as a chunk start
    nonSpaceUnits[ki].isChunkStart = true;
    if (chunk.wordBreakBefore) {
      nonSpaceUnits[ki].isWordBreak = true;
    }

    // Accumulate romaji from kana units until we match the chunk
    let acc = '';
    while (ki < nonSpaceUnits.length) {
      const rom = nonSpaceUnits[ki].romaji;
      acc += rom;
      ki++;
      if (acc === chunk.text) break;
      // Try alt pronunciation (は→wa, へ→e)
      if (rom && ALT_ROMAJI[rom]) {
        const altAcc = acc.slice(0, -rom.length) + ALT_ROMAJI[rom];
        if (altAcc === chunk.text) { acc = altAcc; break; }
      }
      // If we've exceeded the chunk length, break to avoid infinite loop
      if (acc.length >= chunk.text.length) break;
    }
  }

  // Mark remaining units as chunk starts
  while (ki < nonSpaceUnits.length) {
    nonSpaceUnits[ki].isChunkStart = true;
    ki++;
  }

  return result;
}

/** Break a hiragana/katakana string into character→romaji pairs */
export function breakdownKana(text: string): KanaUnit[] {
  const result: KanaUnit[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];

    if (ch === ' ' || ch === '　') {
      result.push({ char: ' ', romaji: '', isSpace: true });
      i++;
      continue;
    }

    // Check two-char combo first (char + small kana)
    if (i + 1 < text.length) {
      const pair = text[i] + text[i + 1];
      if (COMBO_KANA[pair]) {
        const r = COMBO_KANA[pair];
        result.push({ char: pair, romaji: r, isVowelOnly: VOWEL_ROMAJI.has(r) });
        i += 2;
        continue;
      }
    }

    const romaji = SINGLE_KANA[ch];
    if (romaji !== undefined) {
      result.push({ char: ch, romaji, isVowelOnly: VOWEL_ROMAJI.has(romaji) });
    } else {
      // Non-kana (kanji, punctuation, etc.)
      result.push({ char: ch, romaji: '' });
    }
    i++;
  }
  return result;
}

/**
 * Detect sound modifiers and mark them for smaller/tighter display.
 * Rules:
 *  - う after a kana ending in 'o' or 'u' → lengthener (ō / ū)
 *  - い after a kana ending in 'i' or 'e' → lengthener (ī / ē)
 *  - Same vowel doubling (ああ, etc.) → lengthener
 *  - ー (katakana long vowel mark) → lengthener
 *  - ん (n) after any kana → nasal modifier, absorbed into prev sound
 *  - す (su) after で or ま → devoiced in です/ます patterns
 */
export function markLengtheners(units: KanaUnit[]): KanaUnit[] {
  const result = units.map(u => ({ ...u }));
  const nonSpace = result.filter(u => !u.isSpace);

  for (let i = 1; i < nonSpace.length; i++) {
    const prev = nonSpace[i - 1];
    const curr = nonSpace[i];
    if (!prev.romaji || !curr.romaji) continue;

    const prevEnds = prev.romaji[prev.romaji.length - 1];
    const currR = curr.romaji;

    if (
      // Vowel lengthening
      (currR === 'u' && (prevEnds === 'o' || prevEnds === 'u')) ||
      // Diphthongs and vowel extensions with い
      (currR === 'i' && (prevEnds === 'a' || prevEnds === 'o' || prevEnds === 'i' || prevEnds === 'e')) ||
      // Same vowel doubling (ああ, etc.)
      (currR === prevEnds && VOWEL_ROMAJI.has(currR)) ||
      (currR === '–') || // katakana ー
      // ん nasal — absorbed into previous sound (gen, kon, etc.)
      (currR === 'n' && curr.char === 'ん') ||
      (currR === 'n' && curr.char === 'ン') ||
      // Devoiced す in です/ます
      (currR === 'su' && (prev.romaji === 'de' || prev.romaji === 'ma'))
    ) {
      curr.isLengthener = true;
    }
  }
  return result;
}

/** Romaji → Hiragana converter (for generating readings from hepburn) */
const ROMAJI_TO_HIRA: Record<string, string> = {
  'sha':'しゃ','shi':'し','shu':'しゅ','sho':'しょ',
  'cha':'ちゃ','chi':'ち','chu':'ちゅ','cho':'ちょ',
  'tsu':'つ',
  'kya':'きゃ','kyu':'きゅ','kyo':'きょ',
  'nya':'にゃ','nyu':'にゅ','nyo':'にょ',
  'hya':'ひゃ','hyu':'ひゅ','hyo':'ひょ',
  'mya':'みゃ','myu':'みゅ','myo':'みょ',
  'rya':'りゃ','ryu':'りゅ','ryo':'りょ',
  'gya':'ぎゃ','gyu':'ぎゅ','gyo':'ぎょ',
  'ja':'じゃ','ju':'じゅ','jo':'じょ',
  'bya':'びゃ','byu':'びゅ','byo':'びょ',
  'pya':'ぴゃ','pyu':'ぴゅ','pyo':'ぴょ',
  'ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ',
  'sa':'さ','su':'す','se':'せ','so':'そ',
  'ta':'た','te':'て','to':'と',
  'na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の',
  'ha':'は','hi':'ひ','fu':'ふ','he':'へ','ho':'ほ',
  'ma':'ま','mi':'み','mu':'む','me':'め','mo':'も',
  'ya':'や','yu':'ゆ','yo':'よ',
  'ra':'ら','ri':'り','ru':'る','re':'れ','ro':'ろ',
  'wa':'わ','wo':'を',
  'ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ','go':'ご',
  'za':'ざ','ji':'じ','zu':'ず','ze':'ぜ','zo':'ぞ',
  'da':'だ','de':'で','do':'ど',
  'ba':'ば','bi':'び','bu':'ぶ','be':'べ','bo':'ぼ',
  'pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ',
  'a':'あ','i':'い','u':'う','e':'え','o':'お',
  'n':'ん',
};

export function romajiToHiragana(romaji: string): string {
  const s = romaji.replace(/·/g, '');
  let result = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] === ' ') { result += ' '; i++; continue; }
    // Double consonant → っ
    if (i + 1 < s.length && s[i] === s[i + 1] && !'aiueon'.includes(s[i])) {
      result += 'っ'; i++; continue;
    }
    let found = false;
    for (const len of [3, 2, 1]) {
      const sub = s.slice(i, i + len);
      if (ROMAJI_TO_HIRA[sub]) { result += ROMAJI_TO_HIRA[sub]; i += len; found = true; break; }
    }
    if (!found) { result += s[i]; i++; }
  }
  return result;
}
