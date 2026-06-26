// Seed sentences + pre-built expansion chains for offline fallback

export interface SeedSentence {
  id: string;
  group: 'travel' | 'food' | 'shopping' | 'activity' | 'hotel' | 'transport' | 'social' | 'emergency';
  target: string;
  pronunciation: string;
  pronunciation_chunks: string;
  english: string;
}

export interface ExpansionStep {
  label: string;
  target: string;
  pronunciation: string;
  pronunciation_chunks: string;
  english: string;
  added: string;
}

export const SEED_SENTENCES: SeedSentence[] = [
  // Travel
  { id: 's1', group: 'travel', target: '行きました', pronunciation: 'ikimashita', pronunciation_chunks: 'i·ki·ma·shi·ta', english: 'I went' },
  { id: 's2', group: 'travel', target: '行きます', pronunciation: 'ikimasu', pronunciation_chunks: 'i·ki·ma·su', english: "I'll go" },
  // Food
  { id: 's3', group: 'food', target: '食べました', pronunciation: 'tabemashita', pronunciation_chunks: 'ta·be·ma·shi·ta', english: 'I ate' },
  { id: 's4', group: 'food', target: '食べたいです', pronunciation: 'tabetai desu', pronunciation_chunks: 'ta·be·tai de·su', english: 'I want to eat' },
  // Shopping
  { id: 's5', group: 'shopping', target: '買いました', pronunciation: 'kaimashita', pronunciation_chunks: 'kai·ma·shi·ta', english: 'I bought' },
  { id: 's6', group: 'shopping', target: '買いたいです', pronunciation: 'kaitai desu', pronunciation_chunks: 'kai·tai de·su', english: 'I want to buy' },
  // Activity
  { id: 's7', group: 'activity', target: '見ました', pronunciation: 'mimashita', pronunciation_chunks: 'mi·ma·shi·ta', english: 'I saw / watched' },
  { id: 's8', group: 'activity', target: '飲みました', pronunciation: 'nomimashita', pronunciation_chunks: 'no·mi·ma·shi·ta', english: 'I drank' },
  // Hotel
  { id: 's9', group: 'hotel', target: '泊まりました', pronunciation: 'tomarimashita', pronunciation_chunks: 'to·ma·ri·ma·shi·ta', english: 'I stayed' },
  { id: 's10', group: 'hotel', target: '予約しました', pronunciation: 'yoyaku shimashita', pronunciation_chunks: 'yo·ya·ku shi·ma·shi·ta', english: 'I reserved' },
  // Transportation
  { id: 's11', group: 'transport', target: '乗りました', pronunciation: 'norimashita', pronunciation_chunks: 'no·ri·ma·shi·ta', english: 'I rode' },
  { id: 's12', group: 'transport', target: '降ります', pronunciation: 'orimasu', pronunciation_chunks: 'o·ri·ma·su', english: "I'll get off" },
  // Social
  { id: 's13', group: 'social', target: '住んでいます', pronunciation: 'sunde imasu', pronunciation_chunks: 'sun·de i·ma·su', english: 'I live in' },
  { id: 's14', group: 'social', target: '好きです', pronunciation: 'suki desu', pronunciation_chunks: 'su·ki de·su', english: 'I like' },
  // Emergency
  { id: 's15', group: 'emergency', target: '困っています', pronunciation: 'komatte imasu', pronunciation_chunks: 'ko·mat·te i·ma·su', english: "I'm in trouble" },
  { id: 's16', group: 'emergency', target: 'なくしました', pronunciation: 'nakushimashita', pronunciation_chunks: 'na·ku·shi·ma·shi·ta', english: 'I lost' },
];

// Pre-built expansion chains (offline fallback) — keyed by seed id
export const FALLBACK_CHAINS: Record<string, ExpansionStep[][]> = {
  s1: [
    // Level 1 options
    [
      { label: '+Where', target: 'カラオケに行きました', pronunciation: 'karaoke ni ikimashita', pronunciation_chunks: 'ka·ra·o·ke ni i·ki·ma·shi·ta', english: 'I went to karaoke', added: 'カラオケに' },
      { label: '+Who', target: '友達と行きました', pronunciation: 'tomodachi to ikimashita', pronunciation_chunks: 'to·mo·da·chi to i·ki·ma·shi·ta', english: 'I went with a friend', added: '友達と' },
      { label: '+When', target: '昨日行きました', pronunciation: 'kinou ikimashita', pronunciation_chunks: 'ki·nou i·ki·ma·shi·ta', english: 'I went yesterday', added: '昨日' },
    ],
  ],
  s2: [
    [
      { label: '+Where', target: '東京に行きます', pronunciation: 'toukyou ni ikimasu', pronunciation_chunks: 'tou·kyou ni i·ki·ma·su', english: "I'll go to Tokyo", added: '東京に' },
      { label: '+When', target: '明日行きます', pronunciation: 'ashita ikimasu', pronunciation_chunks: 'a·shi·ta i·ki·ma·su', english: "I'll go tomorrow", added: '明日' },
      { label: '+How', target: '電車で行きます', pronunciation: 'densha de ikimasu', pronunciation_chunks: 'den·sha de i·ki·ma·su', english: "I'll go by train", added: '電車で' },
    ],
  ],
  s3: [
    [
      { label: '+What', target: 'ラーメンを食べました', pronunciation: 'raamen wo tabemashita', pronunciation_chunks: 'raa·men wo ta·be·ma·shi·ta', english: 'I ate ramen', added: 'ラーメンを' },
      { label: '+Where', target: 'レストランで食べました', pronunciation: 'resutoran de tabemashita', pronunciation_chunks: 're·su·to·ran de ta·be·ma·shi·ta', english: 'I ate at a restaurant', added: 'レストランで' },
      { label: '+When', target: '昼に食べました', pronunciation: 'hiru ni tabemashita', pronunciation_chunks: 'hi·ru ni ta·be·ma·shi·ta', english: 'I ate at noon', added: '昼に' },
    ],
  ],
  s4: [
    [
      { label: '+What', target: 'すしを食べたいです', pronunciation: 'sushi wo tabetai desu', pronunciation_chunks: 'su·shi wo ta·be·tai de·su', english: 'I want to eat sushi', added: 'すしを' },
      { label: '+Where', target: '築地で食べたいです', pronunciation: 'tsukiji de tabetai desu', pronunciation_chunks: 'tsu·ki·ji de ta·be·tai de·su', english: 'I want to eat at Tsukiji', added: '築地で' },
      { label: '+When', target: '今晩食べたいです', pronunciation: 'konban tabetai desu', pronunciation_chunks: 'kon·ban ta·be·tai de·su', english: 'I want to eat tonight', added: '今晩' },
    ],
  ],
  s5: [
    [
      { label: '+What', target: 'お土産を買いました', pronunciation: 'omiyage wo kaimashita', pronunciation_chunks: 'o·mi·ya·ge wo kai·ma·shi·ta', english: 'I bought souvenirs', added: 'お土産を' },
      { label: '+Where', target: 'デパートで買いました', pronunciation: 'depaato de kaimashita', pronunciation_chunks: 'de·paa·to de kai·ma·shi·ta', english: 'I bought at a department store', added: 'デパートで' },
      { label: '+Who', target: '家族に買いました', pronunciation: 'kazoku ni kaimashita', pronunciation_chunks: 'ka·zo·ku ni kai·ma·shi·ta', english: 'I bought for my family', added: '家族に' },
    ],
  ],
  s6: [
    [
      { label: '+What', target: '抹茶を買いたいです', pronunciation: 'matcha wo kaitai desu', pronunciation_chunks: 'mat·cha wo kai·tai de·su', english: 'I want to buy matcha', added: '抹茶を' },
      { label: '+Where', target: 'コンビニで買いたいです', pronunciation: 'konbini de kaitai desu', pronunciation_chunks: 'kon·bi·ni de kai·tai de·su', english: 'I want to buy at a convenience store', added: 'コンビニで' },
    ],
  ],
  s7: [
    [
      { label: '+What', target: '桜を見ました', pronunciation: 'sakura wo mimashita', pronunciation_chunks: 'sa·ku·ra wo mi·ma·shi·ta', english: 'I saw cherry blossoms', added: '桜を' },
      { label: '+Where', target: '京都で見ました', pronunciation: 'kyouto de mimashita', pronunciation_chunks: 'kyou·to de mi·ma·shi·ta', english: 'I saw it in Kyoto', added: '京都で' },
      { label: '+When', target: '昨日見ました', pronunciation: 'kinou mimashita', pronunciation_chunks: 'ki·nou mi·ma·shi·ta', english: 'I saw it yesterday', added: '昨日' },
    ],
  ],
  s8: [
    [
      { label: '+What', target: '日本酒を飲みました', pronunciation: 'nihonshu wo nomimashita', pronunciation_chunks: 'ni·hon·shu wo no·mi·ma·shi·ta', english: 'I drank sake', added: '日本酒を' },
      { label: '+Where', target: '居酒屋で飲みました', pronunciation: 'izakaya de nomimashita', pronunciation_chunks: 'i·za·ka·ya de no·mi·ma·shi·ta', english: 'I drank at an izakaya', added: '居酒屋で' },
      { label: '+Who', target: '友達と飲みました', pronunciation: 'tomodachi to nomimashita', pronunciation_chunks: 'to·mo·da·chi to no·mi·ma·shi·ta', english: 'I drank with a friend', added: '友達と' },
    ],
  ],
  s9: [
    [
      { label: '+Where', target: '渋谷に泊まりました', pronunciation: 'shibuya ni tomarimashita', pronunciation_chunks: 'shi·bu·ya ni to·ma·ri·ma·shi·ta', english: 'I stayed in Shibuya', added: '渋谷に' },
      { label: '+When', target: '昨日泊まりました', pronunciation: 'kinou tomarimashita', pronunciation_chunks: 'ki·nou to·ma·ri·ma·shi·ta', english: 'I stayed yesterday', added: '昨日' },
      { label: '+How long', target: '二泊泊まりました', pronunciation: 'nihaku tomarimashita', pronunciation_chunks: 'ni·ha·ku to·ma·ri·ma·shi·ta', english: 'I stayed two nights', added: '二泊' },
    ],
  ],
  s10: [
    [
      { label: '+What', target: 'ホテルを予約しました', pronunciation: 'hoteru wo yoyaku shimashita', pronunciation_chunks: 'ho·te·ru wo yo·ya·ku shi·ma·shi·ta', english: 'I reserved a hotel', added: 'ホテルを' },
      { label: '+When', target: '昨日予約しました', pronunciation: 'kinou yoyaku shimashita', pronunciation_chunks: 'ki·nou yo·ya·ku shi·ma·shi·ta', english: 'I reserved yesterday', added: '昨日' },
      { label: '+How many', target: '二人分予約しました', pronunciation: 'futaribun yoyaku shimashita', pronunciation_chunks: 'fu·ta·ri·bun yo·ya·ku shi·ma·shi·ta', english: 'I reserved for two people', added: '二人分' },
    ],
  ],
  s11: [
    [
      { label: '+What', target: '新幹線に乗りました', pronunciation: 'shinkansen ni norimashita', pronunciation_chunks: 'shin·kan·sen ni no·ri·ma·shi·ta', english: 'I rode the Shinkansen', added: '新幹線に' },
      { label: '+Where', target: '東京から乗りました', pronunciation: 'toukyou kara norimashita', pronunciation_chunks: 'tou·kyou ka·ra no·ri·ma·shi·ta', english: 'I rode from Tokyo', added: '東京から' },
      { label: '+When', target: '今朝乗りました', pronunciation: 'kesa norimashita', pronunciation_chunks: 'ke·sa no·ri·ma·shi·ta', english: 'I rode this morning', added: '今朝' },
    ],
  ],
  s12: [
    [
      { label: '+Where', target: '次の駅で降ります', pronunciation: 'tsugi no eki de orimasu', pronunciation_chunks: 'tsu·gi no e·ki de o·ri·ma·su', english: "I'll get off at the next station", added: '次の駅で' },
      { label: '+Reason', target: 'ここで降ります', pronunciation: 'koko de orimasu', pronunciation_chunks: 'ko·ko de o·ri·ma·su', english: "I'll get off here", added: 'ここで' },
      { label: '+Who', target: '友達と降ります', pronunciation: 'tomodachi to orimasu', pronunciation_chunks: 'to·mo·da·chi to o·ri·ma·su', english: "I'll get off with my friend", added: '友達と' },
    ],
  ],
  s13: [
    [
      { label: '+Where', target: '東京に住んでいます', pronunciation: 'toukyou ni sunde imasu', pronunciation_chunks: 'tou·kyou ni sun·de i·ma·su', english: 'I live in Tokyo', added: '東京に' },
      { label: '+How long', target: '三年住んでいます', pronunciation: 'sannen sunde imasu', pronunciation_chunks: 'san·nen sun·de i·ma·su', english: 'I have lived here for 3 years', added: '三年' },
      { label: '+Who', target: '家族と住んでいます', pronunciation: 'kazoku to sunde imasu', pronunciation_chunks: 'ka·zo·ku to sun·de i·ma·su', english: 'I live with my family', added: '家族と' },
    ],
  ],
  s14: [
    [
      { label: '+What', target: '日本が好きです', pronunciation: 'nihon ga suki desu', pronunciation_chunks: 'ni·hon ga su·ki de·su', english: 'I like Japan', added: '日本が' },
      { label: '+What', target: 'ラーメンが好きです', pronunciation: 'raamen ga suki desu', pronunciation_chunks: 'raa·men ga su·ki de·su', english: 'I like ramen', added: 'ラーメンが' },
      { label: '+How much', target: 'とても好きです', pronunciation: 'totemo suki desu', pronunciation_chunks: 'to·te·mo su·ki de·su', english: 'I like it very much', added: 'とても' },
    ],
  ],
  s15: [
    [
      { label: '+What', target: '道に困っています', pronunciation: 'michi ni komatte imasu', pronunciation_chunks: 'mi·chi ni ko·mat·te i·ma·su', english: "I'm lost (having trouble with directions)", added: '道に' },
      { label: '+What', target: '電車に困っています', pronunciation: 'densha ni komatte imasu', pronunciation_chunks: 'den·sha ni ko·mat·te i·ma·su', english: "I'm having trouble with the train", added: '電車に' },
      { label: '+Intensity', target: 'とても困っています', pronunciation: 'totemo komatte imasu', pronunciation_chunks: 'to·te·mo ko·mat·te i·ma·su', english: "I'm really in trouble", added: 'とても' },
    ],
  ],
  s16: [
    [
      { label: '+What', target: '財布をなくしました', pronunciation: 'saifu wo nakushimashita', pronunciation_chunks: 'sai·fu wo na·ku·shi·ma·shi·ta', english: 'I lost my wallet', added: '財布を' },
      { label: '+Where', target: '電車でなくしました', pronunciation: 'densha de nakushimashita', pronunciation_chunks: 'den·sha de na·ku·shi·ma·shi·ta', english: 'I lost it on the train', added: '電車で' },
      { label: '+What', target: 'パスポートをなくしました', pronunciation: 'pasupooto wo nakushimashita', pronunciation_chunks: 'pa·su·poo·to wo na·ku·shi·ma·shi·ta', english: 'I lost my passport', added: 'パスポートを' },
    ],
  ],
};

export const SEED_GROUPS: { id: string; label: string; emoji: string }[] = [
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'activity', label: 'Activity', emoji: '🎯' },
  { id: 'hotel', label: 'Hotel', emoji: '🏨' },
  { id: 'transport', label: 'Transportation', emoji: '🚃' },
  { id: 'social', label: 'Social', emoji: '💬' },
  { id: 'emergency', label: 'Emergency', emoji: '🚨' },
];

// === French Seed Sentences ===
export const SEED_SENTENCES_FR: SeedSentence[] = [
  { id: 'fr-s1', group: 'travel', target: 'Je suis allé(e)', pronunciation: 'zhuh swee alay', pronunciation_chunks: 'zhuh swee a·lay', english: 'I went' },
  { id: 'fr-s2', group: 'travel', target: "J'irai", pronunciation: 'zheeray', pronunciation_chunks: 'zhee·ray', english: "I'll go" },
  { id: 'fr-s3', group: 'food', target: "J'ai mangé", pronunciation: 'zhay monzhay', pronunciation_chunks: 'zhay mon·zhay', english: 'I ate' },
  { id: 'fr-s4', group: 'food', target: 'Je voudrais manger', pronunciation: 'zhuh voodray monzhay', pronunciation_chunks: 'zhuh voo·dray mon·zhay', english: 'I would like to eat' },
  { id: 'fr-s5', group: 'shopping', target: "J'ai acheté", pronunciation: 'zhay ashtay', pronunciation_chunks: 'zhay ash·tay', english: 'I bought' },
  { id: 'fr-s6', group: 'shopping', target: 'Je voudrais acheter', pronunciation: 'zhuh voodray ashtay', pronunciation_chunks: 'zhuh voo·dray ash·tay', english: 'I would like to buy' },
  { id: 'fr-s7', group: 'activity', target: "J'ai vu", pronunciation: 'zhay vu', pronunciation_chunks: 'zhay vu', english: 'I saw' },
  { id: 'fr-s8', group: 'activity', target: "J'ai bu", pronunciation: 'zhay bu', pronunciation_chunks: 'zhay bu', english: 'I drank' },
  { id: 'fr-s9', group: 'hotel', target: "J'ai séjourné", pronunciation: 'zhay sayzhornay', pronunciation_chunks: 'zhay say·zhor·nay', english: 'I stayed' },
  { id: 'fr-s10', group: 'hotel', target: "J'ai réservé", pronunciation: 'zhay rayzervay', pronunciation_chunks: 'zhay ray·zer·vay', english: 'I reserved' },
  { id: 'fr-s11', group: 'transport', target: "J'ai pris", pronunciation: 'zhay pree', pronunciation_chunks: 'zhay pree', english: 'I took (transport)' },
  { id: 'fr-s12', group: 'transport', target: 'Je descends', pronunciation: 'zhuh desond', pronunciation_chunks: 'zhuh de·sond', english: "I'm getting off" },
  { id: 'fr-s13', group: 'social', target: "J'habite à", pronunciation: 'zhabit a', pronunciation_chunks: 'zha·bit a', english: 'I live in' },
  { id: 'fr-s14', group: 'social', target: "J'aime", pronunciation: 'zhem', pronunciation_chunks: 'zhem', english: 'I like' },
  { id: 'fr-s15', group: 'emergency', target: "J'ai un problème", pronunciation: 'zhay un problem', pronunciation_chunks: 'zhay un pro·blem', english: 'I have a problem' },
  { id: 'fr-s16', group: 'emergency', target: "J'ai perdu", pronunciation: 'zhay perdoo', pronunciation_chunks: 'zhay per·doo', english: 'I lost' },
];

export const FALLBACK_CHAINS_FR: Record<string, ExpansionStep[][]> = {
  'fr-s1': [
    [
      { label: '+Where', target: 'Je suis allé(e) au musée', pronunciation: 'zhuh swee alay o muzay', pronunciation_chunks: 'zhuh swee a·lay o mu·zay', english: 'I went to the museum', added: 'au musée' },
      { label: '+Who', target: 'Je suis allé(e) avec des amis', pronunciation: 'zhuh swee alay avek day zamee', pronunciation_chunks: 'zhuh swee a·lay a·vek day za·mee', english: 'I went with friends', added: 'avec des amis' },
      { label: '+When', target: 'Hier, je suis allé(e)', pronunciation: 'yehr zhuh swee alay', pronunciation_chunks: 'yehr zhuh swee a·lay', english: 'Yesterday I went', added: 'Hier' },
    ],
  ],
  'fr-s3': [
    [
      { label: '+What', target: "J'ai mangé des crêpes", pronunciation: 'zhay monzhay day krep', pronunciation_chunks: 'zhay mon·zhay day krep', english: 'I ate crêpes', added: 'des crêpes' },
      { label: '+Where', target: "J'ai mangé au restaurant", pronunciation: 'zhay monzhay o restoran', pronunciation_chunks: 'zhay mon·zhay o res·to·ran', english: 'I ate at a restaurant', added: 'au restaurant' },
      { label: '+When', target: "J'ai mangé à midi", pronunciation: 'zhay monzhay a midee', pronunciation_chunks: 'zhay mon·zhay a mi·dee', english: 'I ate at noon', added: 'à midi' },
    ],
  ],
  'fr-s4': [
    [
      { label: '+What', target: 'Je voudrais manger un croissant', pronunciation: 'zhuh voodray monzhay un krwason', pronunciation_chunks: 'zhuh voo·dray mon·zhay un krwa·son', english: 'I would like to eat a croissant', added: 'un croissant' },
      { label: '+Where', target: 'Je voudrais manger dans un café', pronunciation: 'zhuh voodray monzhay don un kafay', pronunciation_chunks: 'zhuh voo·dray mon·zhay don un ka·fay', english: 'I would like to eat at a café', added: 'dans un café' },
    ],
  ],
  'fr-s14': [
    [
      { label: '+What', target: "J'aime la cuisine française", pronunciation: 'zhem la kweezeen fronsez', pronunciation_chunks: 'zhem la kwee·zeen fron·sez', english: 'I like French cuisine', added: 'la cuisine française' },
      { label: '+What', target: "J'aime beaucoup Paris", pronunciation: 'zhem boku paree', pronunciation_chunks: 'zhem bo·ku pa·ree', english: 'I really like Paris', added: 'beaucoup Paris' },
    ],
  ],
  'fr-s16': [
    [
      { label: '+What', target: "J'ai perdu mon portefeuille", pronunciation: 'zhay perdoo mon portfuhy', pronunciation_chunks: 'zhay per·doo mon port·fuhy', english: 'I lost my wallet', added: 'mon portefeuille' },
      { label: '+Where', target: "J'ai perdu dans le métro", pronunciation: 'zhay perdoo don luh metro', pronunciation_chunks: 'zhay per·doo don luh me·tro', english: 'I lost it in the metro', added: 'dans le métro' },
      { label: '+What', target: "J'ai perdu mon passeport", pronunciation: 'zhay perdoo mon paspor', pronunciation_chunks: 'zhay per·doo mon pas·por', english: 'I lost my passport', added: 'mon passeport' },
    ],
  ],
};
