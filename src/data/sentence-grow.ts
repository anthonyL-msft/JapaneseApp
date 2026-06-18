// Seed sentences + pre-built expansion chains for offline fallback

export interface SeedSentence {
  id: string;
  group: 'travel' | 'food' | 'shopping' | 'activity';
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
};

export const SEED_GROUPS: { id: string; label: string; emoji: string }[] = [
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'activity', label: 'Activity', emoji: '🎯' },
];
