// Shared kana data — used by both Reference (50 Sounds chart) and Flashcards (kana recognition)

export interface KanaVocab { jp: string; hep: string; en: string }

// Vocab examples keyed by romanization — travel-useful words featuring each sound
export const KANA_VOCAB: Record<string, KanaVocab[]> = {
  a: [{ jp: 'ありがとう', hep: 'a·ri·ga·tou', en: 'Thank you' }, { jp: 'あさ', hep: 'a·sa', en: 'Morning' }, { jp: 'あつい', hep: 'a·tsu·i', en: 'Hot (weather)' }],
  i: [{ jp: 'いくら', hep: 'i·ku·ra', en: 'How much?' }, { jp: 'いち', hep: 'i·chi', en: 'One (1)' }, { jp: 'いりません', hep: 'i·ri·ma·sen', en: "I don't need it" }],
  u: [{ jp: 'うどん', hep: 'u·don', en: 'Udon noodles' }, { jp: 'うえ', hep: 'u·e', en: 'Up / above' }],
  e: [{ jp: 'えき', hep: 'e·ki', en: 'Station' }, { jp: '円', hep: 'en', en: 'Yen (¥)' }, { jp: 'エレベーター', hep: 'e·re·bee·taa', en: 'Elevator' }],
  o: [{ jp: 'おいしい', hep: 'o·i·shii', en: 'Delicious' }, { jp: 'お願いします', hep: 'o·ne·gai·shi·ma·su', en: 'Please' }, { jp: 'おはよう', hep: 'o·ha·you', en: 'Good morning' }],
  ka: [{ jp: 'かわいい', hep: 'ka·wa·ii', en: 'Cute' }, { jp: '会計', hep: 'kai·kei', en: 'Bill/check' }, { jp: 'かさ', hep: 'ka·sa', en: 'Umbrella' }],
  ki: [{ jp: '切符', hep: 'kip·pu', en: 'Ticket' }, { jp: 'きれい', hep: 'ki·rei', en: 'Beautiful/clean' }, { jp: '昨日', hep: 'ki·nou', en: 'Yesterday' }],
  ku: [{ jp: '空港', hep: 'kuu·kou', en: 'Airport' }, { jp: 'ください', hep: 'ku·da·sai', en: 'Please (give me)' }, { jp: '薬', hep: 'ku·su·ri', en: 'Medicine' }],
  ke: [{ jp: '今朝', hep: 'ke·sa', en: 'This morning' }, { jp: '携帯', hep: 'kei·tai', en: 'Mobile phone' }],
  ko: [{ jp: 'ここ', hep: 'ko·ko', en: 'Here' }, { jp: 'これ', hep: 'ko·re', en: 'This' }, { jp: 'コンビニ', hep: 'kon·bi·ni', en: 'Convenience store' }],
  sa: [{ jp: 'さむい', hep: 'sa·mu·i', en: 'Cold (weather)' }, { jp: 'さかな', hep: 'sa·ka·na', en: 'Fish' }, { jp: 'さくら', hep: 'sa·ku·ra', en: 'Cherry blossom' }],
  shi: [{ jp: '新幹線', hep: 'shin·kan·sen', en: 'Bullet train' }, { jp: '写真', hep: 'sha·shin', en: 'Photo' }, { jp: 'しお', hep: 'shi·o', en: 'Salt' }],
  su: [{ jp: 'すみません', hep: 'su·mi·ma·sen', en: 'Excuse me / Sorry' }, { jp: 'すし', hep: 'su·shi', en: 'Sushi' }, { jp: 'すき', hep: 'su·ki', en: 'Like / favorite' }],
  se: [{ jp: 'せき', hep: 'se·ki', en: 'Seat' }, { jp: '先生', hep: 'sen·sei', en: 'Teacher' }],
  so: [{ jp: 'そこ', hep: 'so·ko', en: 'There' }, { jp: 'そば', hep: 'so·ba', en: 'Soba noodles' }],
  ta: [{ jp: '食べます', hep: 'ta·be·ma·su', en: 'Eat' }, { jp: 'タクシー', hep: 'ta·ku·shii', en: 'Taxi' }, { jp: 'たかい', hep: 'ta·kai', en: 'Expensive / tall' }],
  chi: [{ jp: '地下鉄', hep: 'chi·ka·te·tsu', en: 'Subway' }, { jp: 'ちかい', hep: 'chi·kai', en: 'Near / close' }, { jp: 'チェックイン', hep: 'chek·ku·in', en: 'Check-in' }],
  tsu: [{ jp: 'つめたい', hep: 'tsu·me·tai', en: 'Cold (drink/food)' }, { jp: 'ひとつ', hep: 'hi·to·tsu', en: 'One (counter)' }],
  te: [{ jp: '天気', hep: 'ten·ki', en: 'Weather' }, { jp: '手', hep: 'te', en: 'Hand' }, { jp: 'てんぷら', hep: 'ten·pu·ra', en: 'Tempura' }],
  to: [{ jp: 'トイレ', hep: 'toi·re', en: 'Toilet' }, { jp: '東京', hep: 'tou·kyou', en: 'Tokyo' }, { jp: 'とりにく', hep: 'to·ri·ni·ku', en: 'Chicken meat' }],
  na: [{ jp: '名古屋', hep: 'na·go·ya', en: 'Nagoya' }, { jp: '名前', hep: 'na·ma·e', en: 'Name' }, { jp: 'なに', hep: 'na·ni', en: 'What?' }],
  ni: [{ jp: '日本語', hep: 'ni·hon·go', en: 'Japanese language' }, { jp: '荷物', hep: 'ni·mo·tsu', en: 'Luggage' }, { jp: 'にく', hep: 'ni·ku', en: 'Meat' }],
  nu: [{ jp: 'ぬるい', hep: 'nu·ru·i', en: 'Lukewarm' }],
  ne: [{ jp: '値段', hep: 'ne·dan', en: 'Price' }, { jp: 'ねこ', hep: 'ne·ko', en: 'Cat' }],
  no: [{ jp: '飲みます', hep: 'no·mi·ma·su', en: 'Drink' }, { jp: 'のりもの', hep: 'no·ri·mo·no', en: 'Vehicle / ride' }],
  ha: [{ jp: 'はい', hep: 'hai', en: 'Yes' }, { jp: '話します', hep: 'ha·na·shi·ma·su', en: 'Speak' }, { jp: '花', hep: 'ha·na', en: 'Flower' }],
  hi: [{ jp: 'ひとり', hep: 'hi·to·ri', en: 'One person / alone' }, { jp: 'ひだり', hep: 'hi·da·ri', en: 'Left (direction)' }, { jp: '飛行機', hep: 'hi·kou·ki', en: 'Airplane' }],
  fu: [{ jp: 'ふたり', hep: 'fu·ta·ri', en: 'Two people' }, { jp: 'ふゆ', hep: 'fu·yu', en: 'Winter' }],
  he: [{ jp: '部屋', hep: 'he·ya', en: 'Room' }, { jp: 'へいわ', hep: 'hei·wa', en: 'Peace' }],
  ho: [{ jp: 'ホテル', hep: 'ho·te·ru', en: 'Hotel' }, { jp: 'ほしい', hep: 'ho·shii', en: 'Want (something)' }],
  ma: [{ jp: '待ちます', hep: 'ma·chi·ma·su', en: 'Wait' }, { jp: 'まっすぐ', hep: 'mas·su·gu', en: 'Straight ahead' }, { jp: 'まずい', hep: 'ma·zui', en: 'Bad taste' }],
  mi: [{ jp: '水', hep: 'mi·zu', en: 'Water' }, { jp: 'みぎ', hep: 'mi·gi', en: 'Right (direction)' }, { jp: 'みせ', hep: 'mi·se', en: 'Shop / store' }],
  mu: [{ jp: '無料', hep: 'mu·ryou', en: 'Free (no charge)' }, { jp: 'むずかしい', hep: 'mu·zu·ka·shii', en: 'Difficult' }],
  me: [{ jp: 'メニュー', hep: 'me·nyuu', en: 'Menu' }, { jp: 'めがね', hep: 'me·ga·ne', en: 'Glasses' }],
  mo: [{ jp: 'もう一度', hep: 'mou i·chi·do', en: 'One more time' }, { jp: 'もの', hep: 'mo·no', en: 'Thing / item' }],
  ya: [{ jp: 'やすい', hep: 'ya·su·i', en: 'Cheap' }, { jp: 'やさい', hep: 'ya·sai', en: 'Vegetables' }, { jp: '薬局', hep: 'yak·kyoku', en: 'Pharmacy' }],
  yu: [{ jp: 'ゆっくり', hep: 'yuk·ku·ri', en: 'Slowly' }, { jp: 'ゆき', hep: 'yu·ki', en: 'Snow' }],
  yo: [{ jp: '予約', hep: 'yo·ya·ku', en: 'Reservation' }, { jp: 'よる', hep: 'yo·ru', en: 'Night' }, { jp: 'ようこそ', hep: 'you·ko·so', en: 'Welcome' }],
  ra: [{ jp: 'ラーメン', hep: 'raa·men', en: 'Ramen' }, { jp: '来週', hep: 'rai·shuu', en: 'Next week' }],
  ri: [{ jp: '旅行', hep: 'ryo·kou', en: 'Travel / trip' }, { jp: 'りんご', hep: 'rin·go', en: 'Apple' }],
  ru: [{ jp: 'るすばん', hep: 'ru·su·ban', en: 'House-sitting' }],
  re: [{ jp: 'レストラン', hep: 're·su·to·ran', en: 'Restaurant' }, { jp: '冷蔵庫', hep: 'rei·zou·ko', en: 'Refrigerator' }],
  ro: [{ jp: '六', hep: 'ro·ku', en: 'Six (6)' }, { jp: 'ロッカー', hep: 'rok·kaa', en: 'Locker' }],
  wa: [{ jp: 'わかります', hep: 'wa·ka·ri·ma·su', en: 'Understand' }, { jp: 'わさび', hep: 'wa·sa·bi', en: 'Wasabi' }],
  wo: [{ jp: '水をください', hep: 'mi·zu wo ku·da·sai', en: 'Water please' }],
  n: [{ jp: '何', hep: 'na·ni', en: 'What?' }, { jp: 'パン', hep: 'pan', en: 'Bread' }, { jp: 'ラーメン', hep: 'raa·men', en: 'Ramen' }],
  // Voiced (dakuten)
  ga: [{ jp: '外国人', hep: 'gai·ko·ku·jin', en: 'Foreigner' }, { jp: 'がんばって', hep: 'gan·bat·te', en: 'Good luck / Do your best' }],
  gi: [{ jp: '牛肉', hep: 'gyuu·ni·ku', en: 'Beef' }, { jp: '銀行', hep: 'gin·kou', en: 'Bank' }],
  gu: [{ jp: 'ぐらい', hep: 'gu·rai', en: 'About / approximately' }],
  ge: [{ jp: '元気', hep: 'gen·ki', en: 'Healthy / fine' }, { jp: '下車', hep: 'ge·sha', en: 'Getting off (train)' }],
  go: [{ jp: 'ごめんなさい', hep: 'go·men·na·sai', en: "I'm sorry" }, { jp: '午後', hep: 'go·go', en: 'Afternoon / PM' }],
  za: [{ jp: '座席', hep: 'za·se·ki', en: 'Seat' }],
  ji: [{ jp: '時間', hep: 'ji·kan', en: 'Time / hours' }, { jp: '自動販売機', hep: 'ji·dou·han·bai·ki', en: 'Vending machine' }],
  zu: [{ jp: 'ずっと', hep: 'zut·to', en: 'All the time / much more' }],
  ze: [{ jp: '全部', hep: 'zen·bu', en: 'Everything / all' }],
  zo: [{ jp: '雑巾', hep: 'zou·kin', en: 'Cloth / rag' }],
  da: [{ jp: '大丈夫', hep: 'dai·jou·bu', en: "It's okay / I'm fine" }, { jp: '大学', hep: 'dai·ga·ku', en: 'University' }],
  di: [{ jp: 'ぢは使わない', hep: 'di wa tsu·ka·wa·nai', en: 'Rarely used — じ(ji) is standard' }],
  du: [{ jp: 'づは使わない', hep: 'du wa tsu·ka·wa·nai', en: 'Rarely used — ず(zu) is standard' }],
  de: [{ jp: '電車', hep: 'den·sha', en: 'Train' }, { jp: '出口', hep: 'de·gu·chi', en: 'Exit' }],
  do: [{ jp: 'どこ', hep: 'do·ko', en: 'Where?' }, { jp: 'どうぞ', hep: 'dou·zo', en: 'Please / Go ahead' }],
  ba: [{ jp: 'バス', hep: 'ba·su', en: 'Bus' }, { jp: '場所', hep: 'ba·sho', en: 'Place / location' }],
  bi: [{ jp: 'ビール', hep: 'bii·ru', en: 'Beer' }, { jp: '美術館', hep: 'bi·ju·tsu·kan', en: 'Art museum' }],
  bu: [{ jp: '部屋', hep: 'bu? → he·ya', en: 'Note: 部屋 reads he·ya not bu·ya' }, { jp: 'ぶたにく', hep: 'bu·ta·ni·ku', en: 'Pork' }],
  be: [{ jp: '弁当', hep: 'ben·tou', en: 'Bento / lunchbox' }, { jp: '便利', hep: 'ben·ri', en: 'Convenient' }],
  bo: [{ jp: '帽子', hep: 'bou·shi', en: 'Hat / cap' }],
  // Handakuten (p-sounds)
  pa: [{ jp: 'パスポート', hep: 'pa·su·poo·to', en: 'Passport' }, { jp: 'パン', hep: 'pan', en: 'Bread' }],
  pi: [{ jp: 'ピザ', hep: 'pi·za', en: 'Pizza' }],
  pu: [{ jp: 'プレゼント', hep: 'pu·re·zen·to', en: 'Gift / present' }],
  pe: [{ jp: 'ペットボトル', hep: 'pet·to·bo·to·ru', en: 'Plastic bottle' }],
  po: [{ jp: 'ポケット', hep: 'po·ket·to', en: 'Pocket' }, { jp: 'ポスト', hep: 'po·su·to', en: 'Mailbox / post' }],
};

// Hiragana chart rows — each cell is "char rom" (e.g. "あ a"), empty string = gap
export const HIRAGANA_CHART: string[][] = [
  ['あ a', 'い i', 'う u', 'え e', 'お o'],
  ['か ka', 'き ki', 'く ku', 'け ke', 'こ ko'],
  ['さ sa', 'し shi', 'す su', 'せ se', 'そ so'],
  ['た ta', 'ち chi', 'つ tsu', 'て te', 'と to'],
  ['な na', 'に ni', 'ぬ nu', 'ね ne', 'の no'],
  ['は ha', 'ひ hi', 'ふ fu', 'へ he', 'ほ ho'],
  ['ま ma', 'み mi', 'む mu', 'め me', 'も mo'],
  ['や ya', '', 'ゆ yu', '', 'よ yo'],
  ['ら ra', 'り ri', 'る ru', 'れ re', 'ろ ro'],
  ['わ wa', '', '', '', 'を wo'],
  ['ん n', '', '', '', ''],
];

// Katakana chart rows — same layout as hiragana
export const KATAKANA_CHART: string[][] = [
  ['ア a', 'イ i', 'ウ u', 'エ e', 'オ o'],
  ['カ ka', 'キ ki', 'ク ku', 'ケ ke', 'コ ko'],
  ['サ sa', 'シ shi', 'ス su', 'セ se', 'ソ so'],
  ['タ ta', 'チ chi', 'ツ tsu', 'テ te', 'ト to'],
  ['ナ na', 'ニ ni', 'ヌ nu', 'ネ ne', 'ノ no'],
  ['ハ ha', 'ヒ hi', 'フ fu', 'ヘ he', 'ホ ho'],
  ['マ ma', 'ミ mi', 'ム mu', 'メ me', 'モ mo'],
  ['ヤ ya', '', 'ユ yu', '', 'ヨ yo'],
  ['ラ ra', 'リ ri', 'ル ru', 'レ re', 'ロ ro'],
  ['ワ wa', '', '', '', 'ヲ wo'],
  ['ン n', '', '', '', ''],
];

// Voiced (dakuten) map: base rom → { h: hiragana, k: katakana, rom: voiced rom }
export const VOICED_MAP: Record<string, { h: string; k: string; rom: string }> = {
  ka: { h: 'が', k: 'ガ', rom: 'ga' }, ki: { h: 'ぎ', k: 'ギ', rom: 'gi' }, ku: { h: 'ぐ', k: 'グ', rom: 'gu' }, ke: { h: 'げ', k: 'ゲ', rom: 'ge' }, ko: { h: 'ご', k: 'ゴ', rom: 'go' },
  sa: { h: 'ざ', k: 'ザ', rom: 'za' }, shi: { h: 'じ', k: 'ジ', rom: 'ji' }, su: { h: 'ず', k: 'ズ', rom: 'zu' }, se: { h: 'ぜ', k: 'ゼ', rom: 'ze' }, so: { h: 'ぞ', k: 'ゾ', rom: 'zo' },
  ta: { h: 'だ', k: 'ダ', rom: 'da' }, chi: { h: 'ぢ', k: 'ヂ', rom: 'di' }, tsu: { h: 'づ', k: 'ヅ', rom: 'du' }, te: { h: 'で', k: 'デ', rom: 'de' }, to: { h: 'ど', k: 'ド', rom: 'do' },
  ha: { h: 'ば', k: 'バ', rom: 'ba' }, hi: { h: 'び', k: 'ビ', rom: 'bi' }, fu: { h: 'ぶ', k: 'ブ', rom: 'bu' }, he: { h: 'べ', k: 'ベ', rom: 'be' }, ho: { h: 'ぼ', k: 'ボ', rom: 'bo' },
};

export const HANDAKUTEN_MAP: Record<string, { h: string; k: string; rom: string }> = {
  ha: { h: 'ぱ', k: 'パ', rom: 'pa' }, hi: { h: 'ぴ', k: 'ピ', rom: 'pi' }, fu: { h: 'ぷ', k: 'プ', rom: 'pu' }, he: { h: 'ぺ', k: 'ペ', rom: 'pe' }, ho: { h: 'ぽ', k: 'ポ', rom: 'po' },
};

// Build flat card arrays for flashcard decks
export interface KanaCard {
  char: string;
  rom: string;
  altChar: string; // the equivalent in the other script
  vocab: KanaVocab[];
}

function buildCards(chart: string[][], altChart: string[][]): KanaCard[] {
  const cards: KanaCard[] = [];
  const flat = chart.flat();
  const altFlat = altChart.flat();
  for (let i = 0; i < flat.length; i++) {
    const cell = flat[i];
    if (!cell) continue;
    const [char, rom] = cell.split(' ');
    const altCell = altFlat[i];
    const altChar = altCell ? altCell.split(' ')[0] : '';
    cards.push({ char, rom, altChar, vocab: KANA_VOCAB[rom] || [] });
  }
  return cards;
}

export const HIRAGANA_CARDS = buildCards(HIRAGANA_CHART, KATAKANA_CHART);
export const KATAKANA_CARDS = buildCards(KATAKANA_CHART, HIRAGANA_CHART);
