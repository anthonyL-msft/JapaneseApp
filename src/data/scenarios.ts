export interface ResponseOption {
  target: string;
  pronunciation: string;
  pronunciation_chunks?: string;
  english: string;
  chinese_tc: string;
}

export interface Variable {
  placeholder: string;       // the text to replace, e.g. "京都"
  label: string;             // "Destination"
  options: { value: string; pronunciation: string; english: string }[];
}

export interface ConversationLine {
  speaker: 'staff' | 'you';
  target: string;
  pronunciation: string;
  pronunciation_chunks?: string;
  english: string;
  chinese_tc: string;
  note?: string;
  options?: ResponseOption[];  // multiple response choices for "you" lines
  variables?: Variable[];      // swappable placeholders (destinations, times, etc.)
}

export type ScenarioGroup = 'airport' | 'train' | 'transit' | 'hotel' | 'restaurant' | 'foodspots' | 'shopping' | 'daily' | 'activities' | 'trouble';

export const SCENARIO_GROUPS: Record<ScenarioGroup, { label: string; emoji: string }> = {
  airport:    { label: 'Airport', emoji: '🛬' },
  train:      { label: 'Train', emoji: '🚆' },
  transit:    { label: 'Bus & Taxi', emoji: '🚕' },
  hotel:      { label: 'Hotel', emoji: '🏨' },
  restaurant: { label: 'Restaurant', emoji: '🍜' },
  foodspots:  { label: 'Food Spots', emoji: '🍣' },
  shopping:   { label: 'Shopping', emoji: '🛍️' },
  daily:      { label: 'Daily Life', emoji: '🏪' },
  activities: { label: 'Activities', emoji: '🎌' },
  trouble:    { label: 'Trouble', emoji: '🆘' },
};

export interface Scenario {
  id: string;
  lang: string;
  group: ScenarioGroup;
  title: string;
  titleTC: string;
  emoji: string;
  description: string;
  lines: ConversationLine[];
}

export const scenarios: Scenario[] = [
  // ============================================================
  // RESTAURANT — Full flow
  // ============================================================
  {
    id: 'sc01',
    lang: 'ja',
    group: 'restaurant',
    title: 'Entering a Restaurant',
    titleTC: '進入餐廳',
    emoji: '🚪',
    description: 'Walking in, getting seated (2 people)',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！', pronunciation: 'irasshaimase!', pronunciation_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！', note: 'You\'ll hear this the moment you walk in. Just smile or nod.' },
      { speaker: 'staff', target: '何名様ですか？', pronunciation: 'nanmei sama desu ka?', pronunciation_chunks: 'nan·mei sa·ma de·su ka', english: 'How many people?', chinese_tc: '請問幾位？' },
      { speaker: 'you', target: 'ふたりです', pronunciation: 'futari desu', pronunciation_chunks: 'fu·ta·ri de·su', english: 'Two people', chinese_tc: '兩位' },
      { speaker: 'staff', target: 'ご予約はございますか？', pronunciation: 'go-yoyaku wa gozaimasu ka?', pronunciation_chunks: 'go·yo·ya·ku wa go·zai·ma·su ka', english: 'Do you have a reservation?', chinese_tc: '請問有預約嗎？' },
      { speaker: 'you', target: '予約していません', pronunciation: 'yoyaku shite imasen', pronunciation_chunks: 'yo·ya·ku shi·te i·ma·sen', english: 'No reservation', chinese_tc: '沒有預約' },
      { speaker: 'staff', target: '少々お待ちください', pronunciation: 'shoushou omachi kudasai', pronunciation_chunks: 'shou·shou o·ma·chi ku·da·sai', english: 'Please wait a moment', chinese_tc: '請稍等', note: 'Wait patiently — they\'re preparing your table.' },
      { speaker: 'staff', target: 'お待たせしました。こちらへどうぞ', pronunciation: 'omatase shimashita. kochira e douzo', pronunciation_chunks: 'o·ma·ta·se shi·ma·shi·ta. ko·chi·ra e dou·zo', english: 'Sorry for the wait. This way please.', chinese_tc: '讓您久等了。這邊請' },
      { speaker: 'you', target: 'ありがとうございます', pronunciation: 'arigatou gozaimasu', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you', chinese_tc: '謝謝' },
    ],
  },
  {
    id: 'sc02',
    lang: 'ja',
    group: 'restaurant',
    title: 'Entering with Reservation',
    titleTC: '有預約進入餐廳',
    emoji: '📋',
    description: 'You booked a table for 6pm',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！', pronunciation: 'irasshaimase!', pronunciation_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！' },
      { speaker: 'staff', target: '何名様ですか？', pronunciation: 'nanmei sama desu ka?', pronunciation_chunks: 'nan·mei sa·ma de·su ka', english: 'How many people?', chinese_tc: '請問幾位？' },
      { speaker: 'you', target: '6時に予約した○○です', pronunciation: 'roku-ji ni yoyaku shita ○○ desu', pronunciation_chunks: 'ro·ku·ji ni yo·ya·ku shi·ta ○○ de·su', english: 'I have a 6 o\'clock reservation, name is ○○', chinese_tc: '我預約了6點，姓○○', note: 'Replace ○○ with your name', variables: [
        { placeholder: '6時', label: 'Time', options: [
          { value: '6時', pronunciation: 'ro·ku·ji', english: '6pm' },
          { value: '7時', pronunciation: 'shi·chi·ji', english: '7pm' },
          { value: '8時', pronunciation: 'ha·chi·ji', english: '8pm' },
          { value: '12時', pronunciation: 'juu·ni·ji', english: '12pm' },
          { value: '1時', pronunciation: 'i·chi·ji', english: '1pm' },
        ] },
      ] },
      { speaker: 'staff', target: 'はい、確認いたしました。お席へご案内いたします', pronunciation: 'hai, kakunin itashimashita. oseki e go-annai itashimasu', pronunciation_chunks: 'hai, ka·ku·nin i·ta·shi·ma·shi·ta. o·se·ki e go·an·nai i·ta·shi·ma·su', english: 'Yes, confirmed. I\'ll show you to your seat.', chinese_tc: '好的，確認了。帶您到座位' },
      { speaker: 'you', target: 'よろしくお願いします', pronunciation: 'yoroshiku onegaishimasu', pronunciation_chunks: 'yo·ro·shi·ku o·ne·gai·shi·ma·su', english: 'Thank you / Please take care of us', chinese_tc: '麻煩你了' },
    ],
  },
  {
    id: 'sc03',
    lang: 'ja',
    group: 'restaurant',
    title: 'Ordering Food',
    titleTC: '點餐',
    emoji: '📝',
    description: 'The waiter comes, you order for two',
    lines: [
      { speaker: 'staff', target: 'ご注文はお決まりでしょうか？', pronunciation: 'go-chuumon wa okimari deshou ka?', pronunciation_chunks: 'go·chuu·mon wa o·ki·ma·ri de·shou ka', english: 'Are you ready to order?', chinese_tc: '請問決定好了嗎？' },
      { speaker: 'you', target: 'はい。これを二つお願いします', pronunciation: 'hai. kore wo futatsu onegaishimasu', pronunciation_chunks: 'hai. ko·re wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Yes. Two of these please.', chinese_tc: '好的。這個請給我兩份', note: 'Point at the menu item' },
      { speaker: 'staff', target: 'お飲み物はいかがですか？', pronunciation: 'onomimono wa ikaga desu ka?', pronunciation_chunks: 'o·no·mi·mo·no wa i·ka·ga de·su ka', english: 'Would you like something to drink?', chinese_tc: '需要飲料嗎？' },
      { speaker: 'you', target: '生ビールを二つお願いします', pronunciation: 'nama biiru wo futatsu onegaishimasu', pronunciation_chunks: 'na·ma bii·ru wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two draft beers please', chinese_tc: '請給我兩杯生啤酒' },
      { speaker: 'staff', target: 'ご注文は以上でよろしいでしょうか？', pronunciation: 'go-chuumon wa ijou de yoroshii deshou ka?', pronunciation_chunks: 'go·chuu·mon wa i·jou de yo·ro·shii de·shou ka', english: 'Is that everything?', chinese_tc: '以上就是您的點餐了嗎？' },
      { speaker: 'you', target: 'はい、お願いします', pronunciation: 'hai, onegaishimasu', pronunciation_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes, please', chinese_tc: '好的，麻煩了' },
      { speaker: 'staff', target: '少々お待ちください', pronunciation: 'shoushou omachi kudasai', pronunciation_chunks: 'shou·shou o·ma·chi ku·da·sai', english: 'Please wait a moment', chinese_tc: '請稍等' },
    ],
  },
  {
    id: 'sc04',
    lang: 'ja',
    group: 'restaurant',
    title: 'Paying the Bill',
    titleTC: '結帳',
    emoji: '💳',
    description: 'Asking for the check and paying',
    lines: [
      { speaker: 'you', target: 'すみません、お会計お願いします', pronunciation: 'sumimasen, okaikei onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen, o·kai·kei o·ne·gai·shi·ma·su', english: 'Excuse me, check please', chinese_tc: '不好意思，請結帳', note: 'Raise your hand to get attention' },
      { speaker: 'staff', target: 'はい、少々お待ちください', pronunciation: 'hai, shoushou omachi kudasai', pronunciation_chunks: 'hai, shou·shou o·ma·chi ku·da·sai', english: 'Yes, one moment please', chinese_tc: '好的，請稍等' },
      { speaker: 'staff', target: 'お会計は3,800円になります', pronunciation: 'okaikei wa sanzen happyaku en ni narimasu', pronunciation_chunks: 'o·kai·kei wa san·zen hap·pya·ku en ni na·ri·ma·su', english: 'The total is 3,800 yen', chinese_tc: '總共3,800日圓' },
      { speaker: 'you', target: 'クレジットカードは使えますか？', pronunciation: 'kurejitto kaado wa tsukaemasu ka?', pronunciation_chunks: 'ku·re·jit·to kaa·do wa tsu·ka·e·ma·su ka', english: 'Can I use a credit card?', chinese_tc: '可以用信用卡嗎？', options: [
        { target: 'クレジットカードは使えますか？', pronunciation: 'kurejitto kaado wa tsukaemasu ka?', pronunciation_chunks: 'ku·re·jit·to kaa·do wa tsu·ka·e·ma·su ka', english: 'Can I use a credit card?', chinese_tc: '可以用信用卡嗎？' },
        { target: '現金でお願いします', pronunciation: 'genkin de onegaishimasu', pronunciation_chunks: 'gen·kin de o·ne·gai·shi·ma·su', english: 'Cash please', chinese_tc: '用現金' },
        { target: 'Suicaで払えますか？', pronunciation: 'suika de haraemasu ka?', pronunciation_chunks: 'sui·ka de ha·ra·e·ma·su ka', english: 'Can I pay with Suica?', chinese_tc: '可以用Suica付嗎？' },
      ] },
      { speaker: 'staff', target: 'はい、大丈夫です', pronunciation: 'hai, daijoubu desu', pronunciation_chunks: 'hai, dai·jou·bu de·su', english: 'Yes, that\'s fine', chinese_tc: '可以的' },
      { speaker: 'you', target: 'ごちそうさまでした', pronunciation: 'gochisousama deshita', pronunciation_chunks: 'go·chi·sou·sa·ma de·shi·ta', english: 'Thank you for the meal', chinese_tc: '多謝款待', note: 'Always say this when leaving a restaurant!' },
      { speaker: 'staff', target: 'ありがとうございました！', pronunciation: 'arigatou gozaimashita!', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·shi·ta', english: 'Thank you very much!', chinese_tc: '非常感謝！' },
    ],
  },
  {
    id: 'sc05',
    lang: 'ja',
    group: 'daily',
    title: 'Convenience Store',
    titleTC: '便利商店',
    emoji: '🏪',
    description: 'Buying at 7-Eleven, Lawson, or FamilyMart',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！', pronunciation: 'irasshaimase!', pronunciation_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！', note: 'Just nod and go shopping' },
      { speaker: 'staff', target: 'ポイントカードはお持ちですか？', pronunciation: 'pointo kaado wa omochi desu ka?', pronunciation_chunks: 'poi·n·to kaa·do wa o·mo·chi de·su ka', english: 'Do you have a point card?', chinese_tc: '有集點卡嗎？' },
      { speaker: 'you', target: '持っていません', pronunciation: 'motte imasen', pronunciation_chunks: 'mot·te i·ma·sen', english: 'I don\'t have one', chinese_tc: '我沒有' },
      { speaker: 'staff', target: '温めますか？', pronunciation: 'atatamemasu ka?', pronunciation_chunks: 'a·ta·ta·me·ma·su ka', english: 'Shall I heat it up?', chinese_tc: '需要加熱嗎？', note: 'For bento or onigiri' },
      { speaker: 'you', target: 'はい、お願いします', pronunciation: 'hai, onegaishimasu', pronunciation_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes, please', chinese_tc: '好的，麻煩了', options: [
        { target: 'はい、お願いします', pronunciation: 'hai, onegaishimasu', pronunciation_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes, please', chinese_tc: '好的，麻煩了' },
        { target: 'いいえ、大丈夫です', pronunciation: 'iie, daijoubu desu', pronunciation_chunks: 'ii·e, dai·jou·bu de·su', english: 'No, it\'s fine', chinese_tc: '不用了' },
      ] },
      { speaker: 'staff', target: '袋はご利用ですか？', pronunciation: 'fukuro wa goriyou desu ka?', pronunciation_chunks: 'fu·ku·ro wa go·ri·you de·su ka', english: 'Would you like a bag?', chinese_tc: '需要袋子嗎？' },
      { speaker: 'you', target: '大丈夫です', pronunciation: 'daijoubu desu', pronunciation_chunks: 'dai·jou·bu de·su', english: 'No thanks', chinese_tc: '不用了', options: [
        { target: 'はい、お願いします', pronunciation: 'hai, onegaishimasu', pronunciation_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes, please', chinese_tc: '好的，麻煩了' },
        { target: '大丈夫です', pronunciation: 'daijoubu desu', pronunciation_chunks: 'dai·jou·bu de·su', english: 'No thanks', chinese_tc: '不用了' },
      ] },
      { speaker: 'staff', target: '370円になります', pronunciation: 'sanbyaku nanajuu en ni narimasu', pronunciation_chunks: 'san·bya·ku na·na·juu en ni na·ri·ma·su', english: 'That\'ll be 370 yen', chinese_tc: '370日圓' },
      { speaker: 'you', target: 'Suicaで', pronunciation: 'suika de', pronunciation_chunks: 'sui·ka de', english: 'With Suica (IC card)', chinese_tc: '用Suica', note: 'Just tap your IC card on the reader', options: [
        { target: 'Suicaで', pronunciation: 'suika de', pronunciation_chunks: 'sui·ka de', english: 'With Suica (IC card)', chinese_tc: '用Suica' },
        { target: '現金で', pronunciation: 'genkin de', pronunciation_chunks: 'gen·kin de', english: 'Cash', chinese_tc: '用現金' },
        { target: 'クレジットカードで', pronunciation: 'kurejitto kaado de', pronunciation_chunks: 'ku·re·jit·to kaa·do de', english: 'By credit card', chinese_tc: '用信用卡' },
      ] },
      { speaker: 'staff', target: 'ありがとうございました！', pronunciation: 'arigatou gozaimashita!', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·shi·ta', english: 'Thank you!', chinese_tc: '謝謝！' },
    ],
  },
  {
    id: 'sc06',
    lang: 'ja',
    group: 'hotel',
    title: 'Hotel Check-in',
    titleTC: '飯店入住',
    emoji: '🏨',
    description: 'Arriving at hotel, checking in for 2',
    lines: [
      { speaker: 'you', target: 'チェックインお願いします', pronunciation: 'chekkuin onegaishimasu', pronunciation_chunks: 'chek·ku·in o·ne·gai·shi·ma·su', english: 'Check-in please', chinese_tc: '我要辦理入住' },
      { speaker: 'staff', target: 'ご予約のお名前をお願いします', pronunciation: 'go-yoyaku no onamae wo onegaishimasu', pronunciation_chunks: 'go·yo·ya·ku no o·na·ma·e wo o·ne·gai·shi·ma·su', english: 'Your reservation name please', chinese_tc: '請問預約的姓名' },
      { speaker: 'you', target: '予約した○○です。二泊です', pronunciation: 'yoyaku shita ○○ desu. nihaku desu', pronunciation_chunks: 'yo·ya·ku shi·ta ○○ de·su. ni·ha·ku de·su', english: 'Reservation under ○○. Two nights.', chinese_tc: '我有預約，姓○○。住兩晚', note: 'Show your booking confirmation on your phone', variables: [
        { placeholder: '二泊', label: 'Nights', options: [
          { value: '一泊', pronunciation: 'ip·pa·ku', english: '1 night' },
          { value: '二泊', pronunciation: 'ni·ha·ku', english: '2 nights' },
          { value: '三泊', pronunciation: 'san·pa·ku', english: '3 nights' },
          { value: '四泊', pronunciation: 'yon·ha·ku', english: '4 nights' },
          { value: '五泊', pronunciation: 'go·ha·ku', english: '5 nights' },
        ] },
      ] },
      { speaker: 'staff', target: 'はい、確認できました。パスポートをお願いします', pronunciation: 'hai, kakunin dekimashita. pasupooto wo onegaishimasu', pronunciation_chunks: 'hai, ka·ku·nin de·ki·ma·shi·ta. pa·su·poo·to wo o·ne·gai·shi·ma·su', english: 'Confirmed. Passport please.', chinese_tc: '確認了。請出示護照' },
      { speaker: 'you', target: 'はい、どうぞ', pronunciation: 'hai, douzo', pronunciation_chunks: 'hai, dou·zo', english: 'Here you go', chinese_tc: '好的，這裡' },
      { speaker: 'staff', target: 'お部屋は8階の805号室です。朝食は7時から9時までです', pronunciation: 'oheya wa hakkai no happyaku go goushitsu desu. choushoku wa shichi-ji kara ku-ji made desu', pronunciation_chunks: 'o·he·ya wa hak·kai no 805·gou·shi·tsu de·su. chou·sho·ku wa 7·ji ka·ra 9·ji ma·de de·su', english: 'Your room is 805 on the 8th floor. Breakfast is 7-9am.', chinese_tc: '您的房間是8樓805號房。早餐是7點到9點' },
      { speaker: 'you', target: 'Wi-Fiのパスワードは何ですか？', pronunciation: 'waifai no pasuwaado wa nan desu ka?', pronunciation_chunks: 'wai·fai no pa·su·waa·do wa nan de·su ka', english: 'What\'s the Wi-Fi password?', chinese_tc: 'Wi-Fi密碼是什麼？' },
      { speaker: 'staff', target: 'こちらに書いてあります', pronunciation: 'kochira ni kaite arimasu', pronunciation_chunks: 'ko·chi·ra ni kai·te a·ri·ma·su', english: 'It\'s written here', chinese_tc: '寫在這裡' },
      { speaker: 'you', target: 'ありがとうございます', pronunciation: 'arigatou gozaimasu', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you', chinese_tc: '謝謝' },
    ],
  },
  {
    id: 'sc07',
    lang: 'ja',
    group: 'transit',
    title: 'Taking a Taxi',
    titleTC: '搭計程車',
    emoji: '🚕',
    description: 'Telling driver your destination',
    lines: [
      { speaker: 'you', target: 'すみません、この住所までお願いします', pronunciation: 'sumimasen, kono juusho made onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen, ko·no juu·sho ma·de o·ne·gai·shi·ma·su', english: 'Excuse me, to this address please', chinese_tc: '不好意思，請到這個地址', note: 'Show address on phone — the door opens automatically!' },
      { speaker: 'staff', target: 'はい、わかりました', pronunciation: 'hai, wakarimashita', pronunciation_chunks: 'hai, wa·ka·ri·ma·shi·ta', english: 'Yes, understood', chinese_tc: '好的，明白了' },
      { speaker: 'you', target: 'だいたい何分くらいですか？', pronunciation: 'daitai nanpun kurai desu ka?', pronunciation_chunks: 'dai·tai nan·pun ku·rai de·su ka', english: 'About how many minutes?', chinese_tc: '大概幾分鐘？' },
      { speaker: 'staff', target: '15分くらいですね', pronunciation: 'juugo fun kurai desu ne', pronunciation_chunks: 'juu·go fun ku·rai de·su ne', english: 'About 15 minutes', chinese_tc: '大概15分鐘' },
      { speaker: 'you', target: 'ここで降ります。ありがとうございます', pronunciation: 'koko de orimasu. arigatou gozaimasu', pronunciation_chunks: 'ko·ko de o·ri·ma·su. a·ri·ga·tou go·zai·ma·su', english: 'I\'ll get off here. Thank you.', chinese_tc: '我在這裡下車。謝謝', note: 'Don\'t touch the door — it opens automatically' },
      { speaker: 'staff', target: '1,240円になります', pronunciation: 'sen nihyaku yonjuu en ni narimasu', pronunciation_chunks: 'sen ni·hya·ku yon·juu en ni na·ri·ma·su', english: 'That\'ll be 1,240 yen', chinese_tc: '1,240日圓' },
      { speaker: 'you', target: 'Suicaで払えますか？', pronunciation: 'suika de haraemasu ka?', pronunciation_chunks: 'sui·ka de ha·ra·e·ma·su ka', english: 'Can I pay with Suica?', chinese_tc: '可以用Suica付嗎？' },
    ],
  },
  {
    id: 'sc08',
    lang: 'ja',
    group: 'train',
    title: 'Buying Train Tickets',
    titleTC: '買車票',
    emoji: '🚃',
    description: 'At the ticket counter for Shinkansen',
    lines: [
      { speaker: 'you', target: 'すみません、京都までの新幹線の切符を二枚お願いします', pronunciation: 'sumimasen, kyouto made no shinkansen no kippu wo nimai onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen, kyou·to ma·de no shin·kan·sen no kip·pu wo ni·mai o·ne·gai·shi·ma·su', english: 'Two Shinkansen tickets to Kyoto please', chinese_tc: '請給我兩張到京都的新幹線車票', variables: [
        { placeholder: '京都', label: 'Destination', options: [
          { value: '京都', pronunciation: 'kyou·to', english: 'Kyoto' },
          { value: '大阪', pronunciation: 'oo·sa·ka', english: 'Osaka' },
          { value: '東京', pronunciation: 'tou·kyou', english: 'Tokyo' },
          { value: '名古屋', pronunciation: 'na·go·ya', english: 'Nagoya' },
          { value: '広島', pronunciation: 'hi·ro·shi·ma', english: 'Hiroshima' },
          { value: '新大阪', pronunciation: 'shin·oo·sa·ka', english: 'Shin-Osaka' },
          { value: '博多', pronunciation: 'ha·ka·ta', english: 'Hakata (Fukuoka)' },
        ] },
      ] },
      { speaker: 'staff', target: '指定席ですか、自由席ですか？', pronunciation: 'shiteiseki desu ka, jiyuuseki desu ka?', pronunciation_chunks: 'shi·tei·se·ki de·su ka, ji·yuu·se·ki de·su ka', english: 'Reserved or non-reserved seat?', chinese_tc: '對號座還是自由座？' },
      { speaker: 'you', target: '指定席をお願いします', pronunciation: 'shiteiseki wo onegaishimasu', pronunciation_chunks: 'shi·tei·se·ki wo o·ne·gai·shi·ma·su', english: 'Reserved seats please', chinese_tc: '請給我對號座', options: [
        { target: '指定席をお願いします', pronunciation: 'shiteiseki wo onegaishimasu', pronunciation_chunks: 'shi·tei·se·ki wo o·ne·gai·shi·ma·su', english: 'Reserved seats please', chinese_tc: '請給我對號座' },
        { target: '自由席でお願いします', pronunciation: 'jiyuuseki de onegaishimasu', pronunciation_chunks: 'ji·yuu·se·ki de o·ne·gai·shi·ma·su', english: 'Non-reserved seats please', chinese_tc: '請給我自由座' },
      ] },
      { speaker: 'staff', target: '何時ごろのご希望ですか？', pronunciation: 'nanji goro no go-kibou desu ka?', pronunciation_chunks: 'nan·ji go·ro no go·ki·bou de·su ka', english: 'Around what time would you like?', chinese_tc: '您希望大約幾點的？' },
      { speaker: 'you', target: '午前10時ごろでお願いします', pronunciation: 'gozen juuji goro de onegaishimasu', pronunciation_chunks: 'go·zen juu·ji go·ro de o·ne·gai·shi·ma·su', english: 'Around 10am please', chinese_tc: '請給我上午10點左右的' },
      { speaker: 'staff', target: '10時10分ののぞみ号がございます。隣同士のお席でよろしいですか？', pronunciation: 'juuji juppun no nozomi-gou ga gozaimasu. tonari doushi no oseki de yoroshii desu ka?', pronunciation_chunks: 'juu·ji jup·pun no no·zo·mi·gou ga go·zai·ma·su. to·na·ri dou·shi no o·se·ki de yo·ro·shii de·su ka', english: 'There\'s a Nozomi at 10:10. Seats next to each other OK?', chinese_tc: '有10點10分的希望號。相鄰座位可以嗎？' },
      { speaker: 'you', target: 'はい、それでお願いします', pronunciation: 'hai, sore de onegaishimasu', pronunciation_chunks: 'hai, so·re de o·ne·gai·shi·ma·su', english: 'Yes, that\'s fine', chinese_tc: '好的，就那個' },
    ],
  },
  {
    id: 'sc09',
    lang: 'ja',
    group: 'transit',
    title: 'Asking for Directions',
    titleTC: '問路',
    emoji: '🗺️',
    description: 'You\'re lost, asking a local',
    lines: [
      { speaker: 'you', target: 'すみません、ちょっとお聞きしたいのですが', pronunciation: 'sumimasen, chotto okiki shitai no desu ga', pronunciation_chunks: 'su·mi·ma·sen, chot·to o·ki·ki shi·tai no de·su ga', english: 'Excuse me, may I ask you something?', chinese_tc: '不好意思，想請問一下', note: 'Polite way to approach a stranger' },
      { speaker: 'you', target: '○○駅はどこですか？', pronunciation: '○○ eki wa doko desu ka?', pronunciation_chunks: '○○ e·ki wa do·ko de·su ka', english: 'Where is ○○ station?', chinese_tc: '○○站在哪裡？', variables: [
        { placeholder: '○○', label: 'Station', options: [
          { value: '東京', pronunciation: 'tou·kyou', english: 'Tokyo' },
          { value: '渋谷', pronunciation: 'shi·bu·ya', english: 'Shibuya' },
          { value: '新宿', pronunciation: 'shin·ju·ku', english: 'Shinjuku' },
          { value: '池袋', pronunciation: 'i·ke·bu·ku·ro', english: 'Ikebukuro' },
          { value: '品川', pronunciation: 'shi·na·ga·wa', english: 'Shinagawa' },
          { value: '上野', pronunciation: 'u·e·no', english: 'Ueno' },
          { value: '浅草', pronunciation: 'a·sa·ku·sa', english: 'Asakusa' },
          { value: '秋葉原', pronunciation: 'a·ki·ha·ba·ra', english: 'Akihabara' },
        ] },
      ] },
      { speaker: 'staff', target: 'あそこの信号を右に曲がってください', pronunciation: 'asoko no shingou wo migi ni magatte kudasai', pronunciation_chunks: 'a·so·ko no shin·gou wo mi·gi ni ma·gat·te ku·da·sai', english: 'Turn right at that traffic light over there', chinese_tc: '在那邊的紅綠燈右轉' },
      { speaker: 'staff', target: 'まっすぐ行くと、左側にあります', pronunciation: 'massugu iku to, hidarigawa ni arimasu', pronunciation_chunks: 'mas·su·gu i·ku to, hi·da·ri·ga·wa ni a·ri·ma·su', english: 'Go straight and it\'ll be on the left', chinese_tc: '直走的話，在左邊' },
      { speaker: 'you', target: '歩いて何分くらいですか？', pronunciation: 'aruite nanpun kurai desu ka?', pronunciation_chunks: 'a·ru·i·te nan·pun ku·rai de·su ka', english: 'About how many minutes on foot?', chinese_tc: '走路大概幾分鐘？' },
      { speaker: 'staff', target: '5分くらいですよ', pronunciation: 'gofun kurai desu yo', pronunciation_chunks: 'go·fun ku·rai de·su yo', english: 'About 5 minutes', chinese_tc: '大概5分鐘' },
      { speaker: 'you', target: 'ありがとうございます！助かりました', pronunciation: 'arigatou gozaimasu! tasukarimashita', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su! ta·su·ka·ri·ma·shi·ta', english: 'Thank you! That\'s a big help.', chinese_tc: '謝謝！幫了大忙' },
    ],
  },
  {
    id: 'sc10',
    lang: 'ja',
    group: 'shopping',
    title: 'Shopping — Tax Free',
    titleTC: '免稅購物',
    emoji: '🛍️',
    description: 'Buying souvenirs with tax-free',
    lines: [
      { speaker: 'you', target: 'すみません、これはいくらですか？', pronunciation: 'sumimasen, kore wa ikura desu ka?', pronunciation_chunks: 'su·mi·ma·sen, ko·re wa i·ku·ra de·su ka', english: 'Excuse me, how much is this?', chinese_tc: '不好意思，這個多少錢？' },
      { speaker: 'staff', target: '2,200円です', pronunciation: 'nisen nihyaku en desu', pronunciation_chunks: 'ni·sen ni·hya·ku en de·su', english: 'It\'s 2,200 yen', chinese_tc: '2,200日圓' },
      { speaker: 'you', target: 'これを二つください', pronunciation: 'kore wo futatsu kudasai', pronunciation_chunks: 'ko·re wo fu·ta·tsu ku·da·sai', english: 'Two of these please', chinese_tc: '請給我兩個' },
      { speaker: 'you', target: '免税になりますか？', pronunciation: 'menzei ni narimasu ka?', pronunciation_chunks: 'men·zei ni na·ri·ma·su ka', english: 'Is tax-free available?', chinese_tc: '可以免稅嗎？' },
      { speaker: 'staff', target: 'はい、5,000円以上で免税になります。パスポートをお願いします', pronunciation: 'hai, gosen en ijou de menzei ni narimasu. pasupooto wo onegaishimasu', pronunciation_chunks: 'hai, go·sen en i·jou de men·zei ni na·ri·ma·su. pa·su·poo·to wo o·ne·gai·shi·ma·su', english: 'Yes, tax-free for purchases over 5,000 yen. Passport please.', chinese_tc: '是的，超過5,000日圓可以免稅。請出示護照' },
      { speaker: 'you', target: 'はい、どうぞ。包装もお願いします', pronunciation: 'hai, douzo. housou mo onegaishimasu', pronunciation_chunks: 'hai, dou·zo. hou·sou mo o·ne·gai·shi·ma·su', english: 'Here you go. Gift wrapping too please.', chinese_tc: '好的。也請幫我包裝', note: 'Japanese shops do beautiful gift wrapping!' },
      { speaker: 'staff', target: 'かしこまりました', pronunciation: 'kashikomarimashita', pronunciation_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta', english: 'Certainly (very polite)', chinese_tc: '好的（非常禮貌）', note: 'Very formal "understood" — you\'ll hear this at nice shops' },
    ],
  },
  {
    id: 'sc11',
    lang: 'ja',
    group: 'foodspots',
    title: 'Ramen Shop',
    titleTC: '拉麵店',
    emoji: '🍜',
    description: 'Ordering at a ramen counter (often ticket machine)',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！食券をお願いします', pronunciation: 'irasshaimase! shokken wo onegaishimasu', pronunciation_chunks: 'i·ras·shai·ma·se! shok·ken wo o·ne·gai·shi·ma·su', english: 'Welcome! Meal tickets please.', chinese_tc: '歡迎光臨！請出示餐券', note: 'Many ramen shops use ticket machines at the entrance. Buy ticket first!' },
      { speaker: 'you', target: '（食券を渡す）', pronunciation: '(shokken wo watasu)', english: '(hand over meal tickets)', chinese_tc: '（遞出餐券）', note: 'Buy 2 tickets from the machine and hand them to the staff' },
      { speaker: 'staff', target: '麺の硬さはどうしますか？', pronunciation: 'men no katasa wa dou shimasu ka?', pronunciation_chunks: 'men no ka·ta·sa wa dou shi·ma·su ka', english: 'How firm would you like the noodles?', chinese_tc: '麵的硬度要怎樣？', note: 'Options: 硬め (katame/firm), 普通 (futsuu/normal), やわらかめ (yawarakame/soft)' },
      { speaker: 'you', target: '普通でお願いします', pronunciation: 'futsuu de onegaishimasu', pronunciation_chunks: 'fu·tsuu de o·ne·gai·shi·ma·su', english: 'Normal please', chinese_tc: '普通的就好', options: [
        { target: '硬めでお願いします', pronunciation: 'katame de onegaishimasu', pronunciation_chunks: 'ka·ta·me de o·ne·gai·shi·ma·su', english: 'Firm please', chinese_tc: '硬一點' },
        { target: '普通でお願いします', pronunciation: 'futsuu de onegaishimasu', pronunciation_chunks: 'fu·tsuu de o·ne·gai·shi·ma·su', english: 'Normal please', chinese_tc: '普通的就好' },
        { target: 'やわらかめでお願いします', pronunciation: 'yawarakame de onegaishimasu', pronunciation_chunks: 'ya·wa·ra·ka·me de o·ne·gai·shi·ma·su', english: 'Soft please', chinese_tc: '軟一點' },
      ] },
      { speaker: 'staff', target: 'にんにくは入れますか？', pronunciation: 'ninniku wa iremasu ka?', pronunciation_chunks: 'nin·ni·ku wa i·re·ma·su ka', english: 'Would you like garlic?', chinese_tc: '要加蒜頭嗎？' },
      { speaker: 'you', target: 'はい、お願いします', pronunciation: 'hai, onegaishimasu', pronunciation_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes please', chinese_tc: '好的，麻煩了', options: [
        { target: 'はい、お願いします', pronunciation: 'hai, onegaishimasu', pronunciation_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes please', chinese_tc: '好的，麻煩了' },
        { target: 'いいえ、大丈夫です', pronunciation: 'iie, daijoubu desu', pronunciation_chunks: 'ii·e, dai·jou·bu de·su', english: 'No thanks', chinese_tc: '不用了' },
      ] },
      { speaker: 'staff', target: 'お待たせしました、どうぞ', pronunciation: 'omatase shimashita, douzo', pronunciation_chunks: 'o·ma·ta·se shi·ma·shi·ta, dou·zo', english: 'Sorry for the wait, here you go', chinese_tc: '讓您久等了，請用' },
      { speaker: 'you', target: 'いただきます！', pronunciation: 'itadakimasu!', pronunciation_chunks: 'i·ta·da·ki·ma·su', english: 'Let\'s eat! (before eating)', chinese_tc: '我開動了！' },
      { speaker: 'you', target: 'ごちそうさまでした', pronunciation: 'gochisousama deshita', pronunciation_chunks: 'go·chi·sou·sa·ma de·shi·ta', english: 'Thank you for the meal', chinese_tc: '多謝款待', note: 'Say this when leaving' },
    ],
  },

  // ============================================================
  // NEW SCENARIOS
  // ============================================================

  {
    id: 'sc12',
    lang: 'ja',
    group: 'foodspots',
    title: 'Izakaya (Japanese Pub)',
    titleTC: '居酒屋',
    emoji: '🍶',
    description: 'Ordering drinks and sharing plates for 2',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！何名様ですか？', pronunciation: 'irasshaimase! nanmei sama desu ka?', pronunciation_chunks: 'i·ras·shai·ma·se! nan·mei sa·ma de·su ka', english: 'Welcome! How many?', chinese_tc: '歡迎光臨！幾位？' },
      { speaker: 'you', target: 'ふたりです', pronunciation: 'futari desu', pronunciation_chunks: 'fu·ta·ri de·su', english: 'Two people', chinese_tc: '兩位' },
      { speaker: 'staff', target: 'お飲み物からどうぞ', pronunciation: 'onomimono kara douzo', pronunciation_chunks: 'o·no·mi·mo·no ka·ra dou·zo', english: 'Drinks first, please', chinese_tc: '請先點飲料' },
      { speaker: 'you', target: 'とりあえず生ビールを二つお願いします', pronunciation: 'toriaezu nama biiru wo futatsu onegaishimasu', pronunciation_chunks: 'to·ri·a·e·zu na·ma bii·ru wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two draft beers to start', chinese_tc: '先來兩杯生啤酒', note: 'とりあえず生 = the classic Japanese first order at izakaya!' },
      { speaker: 'staff', target: 'かしこまりました。お通しをお持ちします', pronunciation: 'kashikomarimashita. otooshi wo omochi shimasu', pronunciation_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta. o·too·shi wo o·mo·chi shi·ma·su', english: 'Certainly. I\'ll bring the appetizer', chinese_tc: '好的。我送小菜過來', note: 'お通し (otooshi) is a small appetizer automatically served — it\'s not free (usually ¥300-500)' },
      { speaker: 'you', target: '枝豆と唐揚げと焼き鳥をお願いします', pronunciation: 'edamame to karaage to yakitori wo onegaishimasu', pronunciation_chunks: 'e·da·ma·me to ka·ra·a·ge to ya·ki·to·ri wo o·ne·gai·shi·ma·su', english: 'Edamame, fried chicken, and yakitori please', chinese_tc: '請給我毛豆、炸雞和烤雞串' },
      { speaker: 'staff', target: '焼き鳥はタレと塩、どちらがよろしいですか？', pronunciation: 'yakitori wa tare to shio, dochira ga yoroshii desu ka?', pronunciation_chunks: 'ya·ki·to·ri wa ta·re to shi·o, do·chi·ra ga yo·ro·shii de·su ka', english: 'Yakitori — sauce or salt?', chinese_tc: '烤雞串要醬汁還是鹽味？' },
      { speaker: 'you', target: '塩でお願いします', pronunciation: 'shio de onegaishimasu', pronunciation_chunks: 'shi·o de o·ne·gai·shi·ma·su', english: 'Salt please', chinese_tc: '鹽味', options: [
        { target: '塩でお願いします', pronunciation: 'shio de onegaishimasu', pronunciation_chunks: 'shi·o de o·ne·gai·shi·ma·su', english: 'Salt please', chinese_tc: '鹽味' },
        { target: 'タレでお願いします', pronunciation: 'tare de onegaishimasu', pronunciation_chunks: 'ta·re de o·ne·gai·shi·ma·su', english: 'Sauce please', chinese_tc: '醬汁' },
        { target: '半分ずつお願いします', pronunciation: 'hanbun zutsu onegaishimasu', pronunciation_chunks: 'han·bun zu·tsu o·ne·gai·shi·ma·su', english: 'Half and half please', chinese_tc: '各一半' },
      ] },
      { speaker: 'you', target: '飲み放題はありますか？', pronunciation: 'nomihoudai wa arimasu ka?', pronunciation_chunks: 'no·mi·hou·dai wa a·ri·ma·su ka', english: 'Do you have all-you-can-drink?', chinese_tc: '有喝到飽嗎？' },
      { speaker: 'staff', target: '90分で2,000円になります', pronunciation: 'kyuujuppun de nisen en ni narimasu', pronunciation_chunks: 'kyuu·jup·pun de ni·sen en ni na·ri·ma·su', english: '90 minutes for 2,000 yen', chinese_tc: '90分鐘2000日圓' },
      { speaker: 'you', target: 'じゃ、二人分お願いします', pronunciation: 'ja, futaribun onegaishimasu', pronunciation_chunks: 'ja, fu·ta·ri·bun o·ne·gai·shi·ma·su', english: 'OK, for two people please', chinese_tc: '好，兩個人的', options: [
        { target: 'じゃ、二人分お願いします', pronunciation: 'ja, futaribun onegaishimasu', pronunciation_chunks: 'ja, fu·ta·ri·bun o·ne·gai·shi·ma·su', english: 'OK, for two people please', chinese_tc: '好，兩個人的' },
        { target: '大丈夫です、普通に注文します', pronunciation: 'daijoubu desu, futsuu ni chuumon shimasu', pronunciation_chunks: 'dai·jou·bu de·su, fu·tsuu ni chuu·mon shi·ma·su', english: 'No thanks, we\'ll order normally', chinese_tc: '不用了，我們單點' },
      ] },
      { speaker: 'you', target: '乾杯！', pronunciation: 'kanpai!', pronunciation_chunks: 'kan·pai', english: 'Cheers!', chinese_tc: '乾杯！', note: 'Wait until everyone has their drink, then say 乾杯 together!' },
    ],
  },
  {
    id: 'sc13',
    lang: 'ja',
    group: 'foodspots',
    title: 'Sushi Counter',
    titleTC: '壽司吧台',
    emoji: '🍣',
    description: 'Ordering at a sushi counter (omakase or à la carte)',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ。カウンターへどうぞ', pronunciation: 'irasshaimase. kauntaa e douzo', pronunciation_chunks: 'i·ras·shai·ma·se. ka·un·taa e dou·zo', english: 'Welcome. Please sit at the counter.', chinese_tc: '歡迎光臨。請坐吧台' },
      { speaker: 'staff', target: 'おまかせにしますか、お好みで注文しますか？', pronunciation: 'omakase ni shimasu ka, okonomi de chuumon shimasu ka?', pronunciation_chunks: 'o·ma·ka·se ni shi·ma·su ka, o·ko·no·mi de chuu·mon shi·ma·su ka', english: 'Would you like chef\'s choice or order individually?', chinese_tc: '要廚師搭配還是單點？' },
      { speaker: 'you', target: 'お好みでお願いします', pronunciation: 'okonomi de onegaishimasu', pronunciation_chunks: 'o·ko·no·mi de o·ne·gai·shi·ma·su', english: 'Individual orders please', chinese_tc: '我要單點', options: [
        { target: 'お好みでお願いします', pronunciation: 'okonomi de onegaishimasu', pronunciation_chunks: 'o·ko·no·mi de o·ne·gai·shi·ma·su', english: 'Individual orders please', chinese_tc: '我要單點' },
        { target: 'おまかせでお願いします', pronunciation: 'omakase de onegaishimasu', pronunciation_chunks: 'o·ma·ka·se de o·ne·gai·shi·ma·su', english: 'Chef\'s choice please', chinese_tc: '請幫我搭配' },
      ] },
      { speaker: 'you', target: 'サーモンとマグロを二貫ずつお願いします', pronunciation: 'saamon to maguro wo nikan zutsu onegaishimasu', pronunciation_chunks: 'saa·mon to ma·gu·ro wo ni·kan zu·tsu o·ne·gai·shi·ma·su', english: 'Two pieces each of salmon and tuna please', chinese_tc: '鮭魚和鮪魚各兩貫', note: '貫 (kan) is the counter for sushi pieces' },
      { speaker: 'staff', target: 'わさびは大丈夫ですか？', pronunciation: 'wasabi wa daijoubu desu ka?', pronunciation_chunks: 'wa·sa·bi wa dai·jou·bu de·su ka', english: 'Is wasabi OK?', chinese_tc: '芥末可以嗎？' },
      { speaker: 'you', target: 'はい、大丈夫です', pronunciation: 'hai, daijoubu desu', pronunciation_chunks: 'hai, dai·jou·bu de·su', english: 'Yes, that\'s fine', chinese_tc: '可以', options: [
        { target: 'はい、大丈夫です', pronunciation: 'hai, daijoubu desu', pronunciation_chunks: 'hai, dai·jou·bu de·su', english: 'Yes, that\'s fine', chinese_tc: '可以' },
        { target: 'わさび抜きでお願いします', pronunciation: 'wasabi nuki de onegaishimasu', pronunciation_chunks: 'wa·sa·bi nu·ki de o·ne·gai·shi·ma·su', english: 'Without wasabi please', chinese_tc: '不要芥末' },
        { target: '少なめでお願いします', pronunciation: 'sukuname de onegaishimasu', pronunciation_chunks: 'su·ku·na·me de o·ne·gai·shi·ma·su', english: 'Less wasabi please', chinese_tc: '芥末少一點' },
      ] },
      { speaker: 'staff', target: 'はい、どうぞ', pronunciation: 'hai, douzo', pronunciation_chunks: 'hai, dou·zo', english: 'Here you go', chinese_tc: '請用' },
      { speaker: 'you', target: 'おいしい！次はえびとイカをお願いします', pronunciation: 'oishii! tsugi wa ebi to ika wo onegaishimasu', pronunciation_chunks: 'o·i·shii! tsu·gi wa e·bi to i·ka wo o·ne·gai·shi·ma·su', english: 'Delicious! Next, shrimp and squid please', chinese_tc: '好好吃！接下來要蝦和花枝' },
      { speaker: 'you', target: 'ごちそうさまでした。とても美味しかったです', pronunciation: 'gochisousama deshita. totemo oishikatta desu', pronunciation_chunks: 'go·chi·sou·sa·ma de·shi·ta. to·te·mo o·i·shi·kat·ta de·su', english: 'Thank you for the meal. It was very delicious.', chinese_tc: '多謝款待。非常好吃' },
    ],
  },
  {
    id: 'sc14',
    lang: 'ja',
    group: 'hotel',
    title: 'Hotel Check-out & Luggage',
    titleTC: '退房寄放行李',
    emoji: '🧳',
    description: 'Checking out but leaving luggage for the day',
    lines: [
      { speaker: 'you', target: 'チェックアウトお願いします。805号室です', pronunciation: 'chekkuauto onegaishimasu. happyaku go goushitsu desu', pronunciation_chunks: 'chek·ku·au·to o·ne·gai·shi·ma·su. 805·gou·shi·tsu de·su', english: 'Checkout please. Room 805.', chinese_tc: '我要退房。805號房' },
      { speaker: 'staff', target: 'はい、ご利用ありがとうございました。ミニバーのご利用はございましたか？', pronunciation: 'hai, goriyou arigatou gozaimashita. minibaa no goriyou wa gozaimashita ka?', pronunciation_chunks: 'hai, go·ri·you a·ri·ga·tou go·zai·ma·shi·ta. mi·ni·baa no go·ri·you wa go·zai·ma·shi·ta ka', english: 'Thank you for your stay. Did you use the minibar?', chinese_tc: '感謝入住。有使用迷你吧嗎？' },
      { speaker: 'you', target: 'いいえ、使っていません', pronunciation: 'iie, tsukatte imasen', pronunciation_chunks: 'ii·e, tsu·kat·te i·ma·sen', english: 'No, I didn\'t use it', chinese_tc: '沒有', options: [
        { target: 'いいえ、使っていません', pronunciation: 'iie, tsukatte imasen', pronunciation_chunks: 'ii·e, tsu·kat·te i·ma·sen', english: 'No, I didn\'t use it', chinese_tc: '沒有' },
        { target: 'はい、水を二本飲みました', pronunciation: 'hai, mizu wo nihon nomimashita', pronunciation_chunks: 'hai, mi·zu wo ni·hon no·mi·ma·shi·ta', english: 'Yes, I had two bottles of water', chinese_tc: '有，喝了兩瓶水' },
      ] },
      { speaker: 'you', target: 'チェックアウト後に荷物を預かってもらえますか？', pronunciation: 'chekkuauto go ni nimotsu wo azukatte moraemasu ka?', pronunciation_chunks: 'chek·ku·au·to go ni ni·mo·tsu wo a·zu·kat·te mo·ra·e·ma·su ka', english: 'Can you keep my luggage after checkout?', chinese_tc: '退房後可以寄放行李嗎？' },
      { speaker: 'staff', target: 'はい、もちろんです。何時ごろお戻りですか？', pronunciation: 'hai, mochiron desu. nanji goro omodori desu ka?', pronunciation_chunks: 'hai, mo·chi·ron de·su. nan·ji go·ro o·mo·do·ri de·su ka', english: 'Yes, of course. Around what time will you return?', chinese_tc: '好的，當然可以。大約幾點回來？' },
      { speaker: 'you', target: '夕方5時ごろ戻ります', pronunciation: 'yuugata goji goro modorimasu', pronunciation_chunks: 'yuu·ga·ta go·ji go·ro mo·do·ri·ma·su', english: 'I\'ll be back around 5pm', chinese_tc: '傍晚5點左右回來', variables: [
        { placeholder: '5時', label: 'Pickup time', options: [
          { value: '3時', pronunciation: 'san·ji', english: '3pm' },
          { value: '4時', pronunciation: 'yo·ji', english: '4pm' },
          { value: '5時', pronunciation: 'go·ji', english: '5pm' },
          { value: '6時', pronunciation: 'ro·ku·ji', english: '6pm' },
          { value: '7時', pronunciation: 'shi·chi·ji', english: '7pm' },
        ] },
      ] },
      { speaker: 'staff', target: 'かしこまりました。こちらの番号札をお持ちください', pronunciation: 'kashikomarimashita. kochira no bangou fuda wo omochi kudasai', pronunciation_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta. ko·chi·ra no ban·gou fu·da wo o·mo·chi ku·da·sai', english: 'Certainly. Please take this number tag.', chinese_tc: '好的。請拿這個號碼牌' },
      { speaker: 'you', target: 'ありがとうございます', pronunciation: 'arigatou gozaimasu', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you', chinese_tc: '謝謝' },
    ],
  },
  {
    id: 'sc15',
    lang: 'ja',
    group: 'activities',
    title: 'Visiting a Temple / Shrine',
    titleTC: '參觀寺廟/神社',
    emoji: '⛩️',
    description: 'Visiting, photo rules, and getting a goshuin stamp',
    lines: [
      { speaker: 'you', target: 'すみません、ここで写真を撮ってもいいですか？', pronunciation: 'sumimasen, koko de shashin wo totte mo ii desu ka?', pronunciation_chunks: 'su·mi·ma·sen, ko·ko de sha·shin wo tot·te mo ii de·su ka', english: 'Excuse me, may I take photos here?', chinese_tc: '不好意思，這裡可以拍照嗎？' },
      { speaker: 'staff', target: '外はいいですが、中は撮影禁止です', pronunciation: 'soto wa ii desu ga, naka wa satsuei kinshi desu', pronunciation_chunks: 'so·to wa ii de·su ga, na·ka wa sa·tsu·ei kin·shi de·su', english: 'Outside is fine, but inside no photography.', chinese_tc: '外面可以，裡面禁止攝影' },
      { speaker: 'you', target: 'わかりました。拝観料はいくらですか？', pronunciation: 'wakarimashita. haikanryou wa ikura desu ka?', pronunciation_chunks: 'wa·ka·ri·ma·shi·ta. hai·kan·ryou wa i·ku·ra de·su ka', english: 'Understood. How much is the admission?', chinese_tc: '了解。參觀費多少錢？' },
      { speaker: 'staff', target: '大人一人500円です', pronunciation: 'otona hitori gohyaku en desu', pronunciation_chunks: 'o·to·na hi·to·ri go·hya·ku en de·su', english: '500 yen per adult', chinese_tc: '大人一位500日圓' },
      { speaker: 'you', target: '二人分お願いします', pronunciation: 'futaribun onegaishimasu', pronunciation_chunks: 'fu·ta·ri·bun o·ne·gai·shi·ma·su', english: 'For two people please', chinese_tc: '兩個人的' },
      { speaker: 'you', target: '御朱印はどこでもらえますか？', pronunciation: 'goshuin wa doko de moraemasu ka?', pronunciation_chunks: 'go·shu·in wa do·ko de mo·ra·e·ma·su ka', english: 'Where can I get a temple stamp?', chinese_tc: '御朱印在哪裡取得？', note: '御朱印 (goshuin) are beautiful calligraphy stamps. You need a 御朱印帳 (goshuin-cho/stamp book) — buy one at the temple if you don\'t have one.' },
      { speaker: 'staff', target: 'あちらの受付でお願いします。300円です', pronunciation: 'achira no uketsuke de onegaishimasu. sanbyaku en desu', pronunciation_chunks: 'a·chi·ra no u·ke·tsu·ke de o·ne·gai·shi·ma·su. san·bya·ku en de·su', english: 'At the reception over there. 300 yen.', chinese_tc: '在那邊的櫃台。300日圓' },
      { speaker: 'you', target: '御朱印帳も買えますか？', pronunciation: 'goshuinchou mo kaemasu ka?', pronunciation_chunks: 'go·shu·in·chou mo ka·e·ma·su ka', english: 'Can I also buy a stamp book?', chinese_tc: '也可以買御朱印帳嗎？' },
      { speaker: 'staff', target: 'はい、1,500円からございます', pronunciation: 'hai, sen gohyaku en kara gozaimasu', pronunciation_chunks: 'hai, sen go·hya·ku en ka·ra go·zai·ma·su', english: 'Yes, starting from 1,500 yen.', chinese_tc: '有的，1,500日圓起' },
    ],
  },
  {
    id: 'sc16',
    lang: 'ja',
    group: 'activities',
    title: 'Onsen (Hot Spring)',
    titleTC: '溫泉',
    emoji: '♨️',
    description: 'Asking about onsen rules and tattoo policy',
    lines: [
      { speaker: 'you', target: '大浴場は何時から何時までですか？', pronunciation: 'daiyokujou wa nanji kara nanji made desu ka?', pronunciation_chunks: 'dai·yo·ku·jou wa nan·ji ka·ra nan·ji ma·de de·su ka', english: 'What are the bath hours?', chinese_tc: '大浴場開放時間是幾點到幾點？' },
      { speaker: 'staff', target: '朝6時から夜11時までです', pronunciation: 'asa rokuji kara yoru juuichiji made desu', pronunciation_chunks: 'a·sa ro·ku·ji ka·ra yo·ru juu·i·chi·ji ma·de de·su', english: 'From 6am to 11pm.', chinese_tc: '早上6點到晚上11點' },
      { speaker: 'you', target: 'タトゥーがあっても大丈夫ですか？', pronunciation: 'tatuu ga atte mo daijoubu desu ka?', pronunciation_chunks: 'ta·tuu ga at·te mo dai·jou·bu de·su ka', english: 'Is it OK even with tattoos?', chinese_tc: '有刺青也可以嗎？' },
      { speaker: 'staff', target: '申し訳ございませんが、タトゥーのある方はご利用いただけません', pronunciation: 'moushiwake gozaimasen ga, tatuu no aru kata wa goriyou itadakemasen', pronunciation_chunks: 'mou·shi·wa·ke go·zai·ma·sen ga, ta·tuu no a·ru ka·ta wa go·ri·you i·ta·da·ke·ma·sen', english: 'I\'m sorry, but guests with tattoos cannot use the bath.', chinese_tc: '很抱歉，有刺青的客人無法使用', note: 'Some places offer stick-on covers (シール/seal). Ask: タトゥーカバーシールはありますか？' },
      { speaker: 'you', target: 'タトゥーカバーシールはありますか？', pronunciation: 'tatuu kabaa shiiru wa arimasu ka?', pronunciation_chunks: 'ta·tuu ka·baa shii·ru wa a·ri·ma·su ka', english: 'Do you have tattoo cover stickers?', chinese_tc: '有刺青遮蓋貼嗎？' },
      { speaker: 'staff', target: 'はい、フロントでお渡しできます', pronunciation: 'hai, furonto de owatashi dekimasu', pronunciation_chunks: 'hai, fu·ron·to de o·wa·ta·shi de·ki·ma·su', english: 'Yes, we can provide them at the front desk.', chinese_tc: '有的，可以在前台領取' },
      { speaker: 'you', target: 'タオルは持って行っていいですか？', pronunciation: 'taoru wa motte itte ii desu ka?', pronunciation_chunks: 'ta·o·ru wa mot·te it·te ii de·su ka', english: 'Can I bring a towel?', chinese_tc: '可以帶毛巾去嗎？', note: 'Small towel OK (use to cover yourself walking), but don\'t put it in the water!' },
    ],
  },
  {
    id: 'sc17',
    lang: 'ja',
    group: 'trouble',
    title: 'Lost Item / Forgot Something',
    titleTC: '遺失物品',
    emoji: '😰',
    description: 'You left something on a train or at a restaurant',
    lines: [
      { speaker: 'you', target: 'すみません、忘れ物をしたのですが...', pronunciation: 'sumimasen, wasuremono wo shita no desu ga...', pronunciation_chunks: 'su·mi·ma·sen, wa·su·re·mo·no wo shi·ta no de·su ga', english: 'Excuse me, I left something behind...', chinese_tc: '不好意思，我忘了東西...' },
      { speaker: 'staff', target: '何をお忘れになりましたか？', pronunciation: 'nani wo owasure ni narimashita ka?', pronunciation_chunks: 'na·ni wo o·wa·su·re ni na·ri·ma·shi·ta ka', english: 'What did you leave behind?', chinese_tc: '您忘了什麼？' },
      { speaker: 'you', target: '黒い鞄を電車の中に忘れました', pronunciation: 'kuroi kaban wo densha no naka ni wasuremashita', pronunciation_chunks: 'ku·roi ka·ban wo den·sha no na·ka ni wa·su·re·ma·shi·ta', english: 'I left a black bag on the train', chinese_tc: '我把黑色包包忘在電車裡了', variables: [
        { placeholder: '黒い鞄', label: 'Item', options: [
          { value: '黒い鞄', pronunciation: 'ku·roi ka·ban', english: 'black bag' },
          { value: '傘', pronunciation: 'ka·sa', english: 'umbrella' },
          { value: '携帯電話', pronunciation: 'kei·tai·den·wa', english: 'mobile phone' },
          { value: '財布', pronunciation: 'sai·fu', english: 'wallet' },
          { value: 'カメラ', pronunciation: 'ka·me·ra', english: 'camera' },
          { value: '帽子', pronunciation: 'bou·shi', english: 'hat' },
        ] },
        { placeholder: '電車の中', label: 'Location', options: [
          { value: '電車の中', pronunciation: 'den·sha no na·ka', english: 'on the train' },
          { value: 'タクシーの中', pronunciation: 'ta·ku·shii no na·ka', english: 'in the taxi' },
          { value: 'レストラン', pronunciation: 're·su·to·ran', english: 'at the restaurant' },
          { value: 'ホテルの部屋', pronunciation: 'ho·te·ru no he·ya', english: 'in the hotel room' },
        ] },
      ] },
      { speaker: 'staff', target: '何線をご利用でしたか？何時ごろですか？', pronunciation: 'nanisen wo goriyou deshita ka? nanji goro desu ka?', pronunciation_chunks: 'na·ni·sen wo go·ri·you de·shi·ta ka? nan·ji go·ro de·su ka', english: 'What line were you on? Around what time?', chinese_tc: '您搭什麼線？大約幾點？' },
      { speaker: 'you', target: '山手線で、2時ごろです', pronunciation: 'yamanote sen de, niji goro desu', pronunciation_chunks: 'ya·ma·no·te sen de, ni·ji go·ro de·su', english: 'Yamanote Line, around 2pm', chinese_tc: '山手線，大約2點' },
      { speaker: 'staff', target: 'わかりました。忘れ物センターに確認いたします', pronunciation: 'wakarimashita. wasuremono sentaa ni kakunin itashimasu', pronunciation_chunks: 'wa·ka·ri·ma·shi·ta. wa·su·re·mo·no sen·taa ni ka·ku·nin i·ta·shi·ma·su', english: 'Understood. I\'ll check with the lost and found center.', chinese_tc: '了解。我跟失物中心確認', note: 'Japan has amazing lost-item return rates — over 80%! Always report to station staff.' },
      { speaker: 'staff', target: 'お名前と電話番号をお願いします', pronunciation: 'onamae to denwa bangou wo onegaishimasu', pronunciation_chunks: 'o·na·ma·e to den·wa ban·gou wo o·ne·gai·shi·ma·su', english: 'Your name and phone number please.', chinese_tc: '請給我您的姓名和電話號碼' },
      { speaker: 'you', target: 'ホテルの電話番号でもいいですか？', pronunciation: 'hoteru no denwa bangou de mo ii desu ka?', pronunciation_chunks: 'ho·te·ru no den·wa ban·gou de mo ii de·su ka', english: 'Can I give my hotel\'s phone number?', chinese_tc: '可以給飯店的電話嗎？' },
    ],
  },
  {
    id: 'sc18',
    lang: 'ja',
    group: 'foodspots',
    title: 'Café Order',
    titleTC: '咖啡廳點餐',
    emoji: '☕',
    description: 'Ordering coffee and desserts',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ。店内でお召し上がりですか？', pronunciation: 'irasshaimase. tennai de omeshiagari desu ka?', pronunciation_chunks: 'i·ras·shai·ma·se. ten·nai de o·me·shi·a·ga·ri de·su ka', english: 'Welcome. Dining in?', chinese_tc: '歡迎光臨。內用嗎？' },
      { speaker: 'you', target: '店内で二人です', pronunciation: 'tennai de futari desu', pronunciation_chunks: 'ten·nai de fu·ta·ri de·su', english: 'Dining in, two people', chinese_tc: '內用，兩個人', options: [
        { target: '店内で二人です', pronunciation: 'tennai de futari desu', pronunciation_chunks: 'ten·nai de fu·ta·ri de·su', english: 'Dining in, two people', chinese_tc: '內用，兩個人' },
        { target: '持ち帰りでお願いします', pronunciation: 'mochikaeri de onegaishimasu', pronunciation_chunks: 'mo·chi·ka·e·ri de o·ne·gai·shi·ma·su', english: 'Takeout please', chinese_tc: '外帶' },
      ] },
      { speaker: 'you', target: 'アイスコーヒーを二つお願いします', pronunciation: 'aisu koohii wo futatsu onegaishimasu', pronunciation_chunks: 'ai·su koo·hii wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two iced coffees please', chinese_tc: '兩杯冰咖啡', options: [
        { target: 'アイスコーヒーを二つお願いします', pronunciation: 'aisu koohii wo futatsu onegaishimasu', pronunciation_chunks: 'ai·su koo·hii wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two iced coffees please', chinese_tc: '兩杯冰咖啡' },
        { target: 'ホットコーヒーを二つお願いします', pronunciation: 'hotto koohii wo futatsu onegaishimasu', pronunciation_chunks: 'hot·to koo·hii wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two hot coffees please', chinese_tc: '兩杯熱咖啡' },
        { target: '抹茶ラテを二つお願いします', pronunciation: 'matcha rate wo futatsu onegaishimasu', pronunciation_chunks: 'mat·cha ra·te wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two matcha lattes please', chinese_tc: '兩杯抹茶拿鐵' },
      ] },
      { speaker: 'staff', target: 'サイズはいかがですか？', pronunciation: 'saizu wa ikaga desu ka?', pronunciation_chunks: 'sai·zu wa i·ka·ga de·su ka', english: 'What size?', chinese_tc: '要什麼大小？' },
      { speaker: 'you', target: 'Mサイズでお願いします', pronunciation: 'emu saizu de onegaishimasu', pronunciation_chunks: 'e·mu sai·zu de o·ne·gai·shi·ma·su', english: 'Medium please', chinese_tc: '中杯', options: [
        { target: 'Sサイズでお願いします', pronunciation: 'esu saizu de onegaishimasu', pronunciation_chunks: 'e·su sai·zu de o·ne·gai·shi·ma·su', english: 'Small please', chinese_tc: '小杯' },
        { target: 'Mサイズでお願いします', pronunciation: 'emu saizu de onegaishimasu', pronunciation_chunks: 'e·mu sai·zu de o·ne·gai·shi·ma·su', english: 'Medium please', chinese_tc: '中杯' },
        { target: 'Lサイズでお願いします', pronunciation: 'eru saizu de onegaishimasu', pronunciation_chunks: 'e·ru sai·zu de o·ne·gai·shi·ma·su', english: 'Large please', chinese_tc: '大杯' },
      ] },
      { speaker: 'you', target: 'チーズケーキもお願いします', pronunciation: 'chiizu keeki mo onegaishimasu', pronunciation_chunks: 'chii·zu kee·ki mo o·ne·gai·shi·ma·su', english: 'Cheesecake too please', chinese_tc: '也要起司蛋糕' },
      { speaker: 'staff', target: 'お席でお待ちください。お持ちいたします', pronunciation: 'oseki de omachi kudasai. omochi itashimasu', pronunciation_chunks: 'o·se·ki de o·ma·chi ku·da·sai. o·mo·chi i·ta·shi·ma·su', english: 'Please wait at your seat. I\'ll bring it over.', chinese_tc: '請在座位上等候。我送過去' },
    ],
  },
  {
    id: 'sc19',
    lang: 'ja',
    group: 'trouble',
    title: 'At the Pharmacy',
    titleTC: '藥局',
    emoji: '💊',
    description: 'Buying medicine for common travel ailments',
    lines: [
      { speaker: 'you', target: 'すみません、頭痛薬はありますか？', pronunciation: 'sumimasen, zutsuu yaku wa arimasu ka?', pronunciation_chunks: 'su·mi·ma·sen, zu·tsuu ya·ku wa a·ri·ma·su ka', english: 'Excuse me, do you have headache medicine?', chinese_tc: '不好意思，有頭痛藥嗎？', variables: [
        { placeholder: '頭痛薬', label: 'Medicine', options: [
          { value: '頭痛薬', pronunciation: 'zu·tsuu ya·ku', english: 'headache medicine' },
          { value: '胃薬', pronunciation: 'i·gu·su·ri', english: 'stomach medicine' },
          { value: '風邪薬', pronunciation: 'ka·ze·gu·su·ri', english: 'cold medicine' },
          { value: '下痢止め', pronunciation: 'ge·ri·do·me', english: 'anti-diarrhea' },
          { value: '酔い止め', pronunciation: 'yo·i·do·me', english: 'motion sickness' },
          { value: '目薬', pronunciation: 'me·gu·su·ri', english: 'eye drops' },
          { value: '絆創膏', pronunciation: 'ban·sou·kou', english: 'bandaid' },
          { value: '日焼け止め', pronunciation: 'hi·ya·ke·do·me', english: 'sunscreen' },
        ] },
      ] },
      { speaker: 'staff', target: 'こちらにございます。何か他に症状はございますか？', pronunciation: 'kochira ni gozaimasu. nanika hoka ni shoujou wa gozaimasu ka?', pronunciation_chunks: 'ko·chi·ra ni go·zai·ma·su. na·ni·ka ho·ka ni shou·jou wa go·zai·ma·su ka', english: 'It\'s right here. Do you have any other symptoms?', chinese_tc: '在這裡。有其他症狀嗎？' },
      { speaker: 'you', target: '熱もあります', pronunciation: 'netsu mo arimasu', pronunciation_chunks: 'ne·tsu mo a·ri·ma·su', english: 'I also have a fever', chinese_tc: '也有發燒', options: [
        { target: '熱もあります', pronunciation: 'netsu mo arimasu', pronunciation_chunks: 'ne·tsu mo a·ri·ma·su', english: 'I also have a fever', chinese_tc: '也有發燒' },
        { target: 'それだけです', pronunciation: 'sore dake desu', pronunciation_chunks: 'so·re da·ke de·su', english: 'Just that', chinese_tc: '只有這樣' },
      ] },
      { speaker: 'staff', target: 'では、こちらがおすすめです。一日三回、食後に飲んでください', pronunciation: 'dewa, kochira ga osusume desu. ichinichi sankai, shokugo ni nonde kudasai', pronunciation_chunks: 'de·wa, ko·chi·ra ga o·su·su·me de·su. i·chi·ni·chi san·kai, sho·ku·go ni non·de ku·da·sai', english: 'Then I recommend this. Take 3 times a day, after meals.', chinese_tc: '那推薦這個。一天三次，飯後服用' },
      { speaker: 'you', target: 'わかりました。これをください', pronunciation: 'wakarimashita. kore wo kudasai', pronunciation_chunks: 'wa·ka·ri·ma·shi·ta. ko·re wo ku·da·sai', english: 'Understood. I\'ll take it.', chinese_tc: '了解。請給我這個' },
      { speaker: 'you', target: 'アレルギーがある薬はありません', pronunciation: 'arerugii ga aru kusuri wa arimasen', pronunciation_chunks: 'a·re·ru·gii ga a·ru ku·su·ri wa a·ri·ma·sen', english: 'I don\'t have any medicine allergies', chinese_tc: '我沒有藥物過敏' },
    ],
  },
  {
    id: 'sc20',
    lang: 'ja',
    group: 'activities',
    title: 'Taking Photos Together',
    titleTC: '請人拍照',
    emoji: '📸',
    description: 'Asking someone to take your photo as a couple',
    lines: [
      { speaker: 'you', target: 'すみません、写真を撮ってもらえますか？', pronunciation: 'sumimasen, shashin wo totte moraemasu ka?', pronunciation_chunks: 'su·mi·ma·sen, sha·shin wo tot·te mo·ra·e·ma·su ka', english: 'Excuse me, could you take our photo?', chinese_tc: '不好意思，可以幫我們拍照嗎？' },
      { speaker: 'staff', target: 'はい、いいですよ', pronunciation: 'hai, ii desu yo', pronunciation_chunks: 'hai, ii de·su yo', english: 'Sure!', chinese_tc: '好的，沒問題' },
      { speaker: 'you', target: 'このボタンを押してください', pronunciation: 'kono botan wo oshite kudasai', pronunciation_chunks: 'ko·no bo·tan wo o·shi·te ku·da·sai', english: 'Please press this button', chinese_tc: '請按這個按鈕', note: 'Point to the shutter button on your phone' },
      { speaker: 'you', target: '縦でお願いします', pronunciation: 'tate de onegaishimasu', pronunciation_chunks: 'ta·te de o·ne·gai·shi·ma·su', english: 'Vertical (portrait) please', chinese_tc: '請拍直的', options: [
        { target: '縦でお願いします', pronunciation: 'tate de onegaishimasu', pronunciation_chunks: 'ta·te de o·ne·gai·shi·ma·su', english: 'Vertical please', chinese_tc: '請拍直的' },
        { target: '横でお願いします', pronunciation: 'yoko de onegaishimasu', pronunciation_chunks: 'yo·ko de o·ne·gai·shi·ma·su', english: 'Horizontal please', chinese_tc: '請拍橫的' },
      ] },
      { speaker: 'staff', target: 'はい、撮りますよ。3、2、1...', pronunciation: 'hai, torimasu yo. san, ni, ichi...', pronunciation_chunks: 'hai, to·ri·ma·su yo. san, ni, i·chi', english: 'OK, taking it. 3, 2, 1...', chinese_tc: '好，要拍了。3、2、1...' },
      { speaker: 'you', target: 'もう一枚お願いしてもいいですか？', pronunciation: 'mou ichimai onegaishite mo ii desu ka?', pronunciation_chunks: 'mou i·chi·mai o·ne·gai·shi·te mo ii de·su ka', english: 'Could you take one more?', chinese_tc: '可以再拍一張嗎？' },
      { speaker: 'staff', target: 'はい、もちろん！', pronunciation: 'hai, mochiron!', pronunciation_chunks: 'hai, mo·chi·ron', english: 'Yes, of course!', chinese_tc: '好的，當然！' },
      { speaker: 'you', target: 'ありがとうございます！とても上手です', pronunciation: 'arigatou gozaimasu! totemo jouzu desu', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su! to·te·mo jou·zu de·su', english: 'Thank you! You\'re very good (at taking photos)', chinese_tc: '謝謝！拍得好好', note: 'Japanese people love compliments — this will make their day!' },
    ],
  },

  // ============================================================
  // NAGOYA-TOKYO WINTER TRIP SCENARIOS
  // ============================================================

  {
    id: 'sc21',
    lang: 'ja',
    group: 'train',
    title: 'Nagoya to Tokyo Shinkansen',
    titleTC: '名古屋到東京新幹線',
    emoji: '🚅',
    description: 'Buying Nagoya→Tokyo Nozomi tickets at the counter',
    lines: [
      { speaker: 'you', target: 'すみません、名古屋から東京までの新幹線の切符を二枚お願いします', pronunciation: 'sumimasen, nagoya kara toukyou made no shinkansen no kippu wo nimai onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen, na·go·ya ka·ra tou·kyou ma·de no shin·kan·sen no kip·pu wo ni·mai o·ne·gai·shi·ma·su', english: 'Two Shinkansen tickets from Nagoya to Tokyo please', chinese_tc: '請給我兩張名古屋到東京的新幹線車票', variables: [
        { placeholder: '東京', label: 'Destination', options: [
          { value: '東京', pronunciation: 'tou·kyou', english: 'Tokyo' },
          { value: '品川', pronunciation: 'shi·na·ga·wa', english: 'Shinagawa' },
          { value: '新横浜', pronunciation: 'shin·yo·ko·ha·ma', english: 'Shin-Yokohama' },
          { value: '京都', pronunciation: 'kyou·to', english: 'Kyoto' },
          { value: '新大阪', pronunciation: 'shin·oo·sa·ka', english: 'Shin-Osaka' },
        ] },
      ] },
      { speaker: 'staff', target: 'のぞみでよろしいですか？指定席と自由席、どちらにしますか？', pronunciation: 'nozomi de yoroshii desu ka? shiteiseki to jiyuuseki, dochira ni shimasu ka?', pronunciation_chunks: 'no·zo·mi de yo·ro·shii de·su ka? shi·tei·se·ki to ji·yuu·se·ki, do·chi·ra ni shi·ma·su ka', english: 'Nozomi OK? Reserved or non-reserved?', chinese_tc: '搭希望號可以嗎？對號座還是自由座？' },
      { speaker: 'you', target: 'のぞみの指定席でお願いします。窓側がいいのですが', pronunciation: 'nozomi no shiteiseki de onegaishimasu. madogawa ga ii no desu ga', pronunciation_chunks: 'no·zo·mi no shi·tei·se·ki de o·ne·gai·shi·ma·su. ma·do·ga·wa ga ii no de·su ga', english: 'Nozomi reserved seats please. Window side would be nice.', chinese_tc: '請給我希望號對號座。希望靠窗', note: 'Nagoya→Tokyo is about 1h40m by Nozomi. 窓側=window, 通路側=aisle', options: [
        { target: 'のぞみの指定席でお願いします。窓側がいいのですが', pronunciation: 'nozomi no shiteiseki de onegaishimasu. madogawa ga ii no desu ga', pronunciation_chunks: 'no·zo·mi no shi·tei·se·ki de o·ne·gai·shi·ma·su. ma·do·ga·wa ga ii no de·su ga', english: 'Reserved window seats please', chinese_tc: '對號座靠窗' },
        { target: 'のぞみの指定席でお願いします。通路側がいいのですが', pronunciation: 'nozomi no shiteiseki de onegaishimasu. tsuurogawa ga ii no desu ga', pronunciation_chunks: 'no·zo·mi no shi·tei·se·ki de o·ne·gai·shi·ma·su. tsuu·ro·ga·wa ga ii no de·su ga', english: 'Reserved aisle seats please', chinese_tc: '對號座靠走道' },
        { target: '自由席でお願いします', pronunciation: 'jiyuuseki de onegaishimasu', pronunciation_chunks: 'ji·yuu·se·ki de o·ne·gai·shi·ma·su', english: 'Non-reserved seats please', chinese_tc: '自由座' },
      ] },
      { speaker: 'staff', target: '次ののぞみは9時30分発です。お二人隣同士の窓側がございます', pronunciation: 'tsugi no nozomi wa kuji sanjuppun hatsu desu. ofutari tonari doushi no madogawa ga gozaimasu', pronunciation_chunks: 'tsu·gi no no·zo·mi wa ku·ji san·jup·pun ha·tsu de·su. o·fu·ta·ri to·na·ri dou·shi no ma·do·ga·wa ga go·zai·ma·su', english: 'Next Nozomi departs 9:30. Window seats together available.', chinese_tc: '下一班希望號9:30出發。有相鄰的靠窗座位' },
      { speaker: 'you', target: 'それでお願いします', pronunciation: 'sore de onegaishimasu', pronunciation_chunks: 'so·re de o·ne·gai·shi·ma·su', english: 'That one please', chinese_tc: '就那個' },
      { speaker: 'staff', target: '二枚で21,120円になります', pronunciation: 'nimai de niman sen hyaku nijuu en ni narimasu', pronunciation_chunks: 'ni·mai de ni·man sen hya·ku ni·juu en ni na·ri·ma·su', english: 'Two tickets, 21,120 yen.', chinese_tc: '兩張21,120日圓', note: 'Nagoya→Tokyo Nozomi reserved: ~¥10,560 per person' },
    ],
  },
  {
    id: 'sc22',
    lang: 'ja',
    group: 'foodspots',
    title: 'Nagoya Specialties',
    titleTC: '名古屋特色美食',
    emoji: '🍤',
    description: 'Ordering Nagoya\'s famous food — miso katsu, hitsumabushi, tebasaki',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！何名様ですか？', pronunciation: 'irasshaimase! nanmei sama desu ka?', pronunciation_chunks: 'i·ras·shai·ma·se! nan·mei sa·ma de·su ka', english: 'Welcome! How many?', chinese_tc: '歡迎光臨！幾位？' },
      { speaker: 'you', target: 'ふたりです。名古屋名物を食べたいのですが', pronunciation: 'futari desu. nagoya meibutsu wo tabetai no desu ga', pronunciation_chunks: 'fu·ta·ri de·su. na·go·ya mei·bu·tsu wo ta·be·tai no de·su ga', english: 'Two people. We\'d like to try Nagoya specialties.', chinese_tc: '兩位。我們想吃名古屋名物', note: '名物 (meibutsu) = local specialty. Nagoya is famous for unique food!' },
      { speaker: 'staff', target: '名古屋名物でしたら、味噌カツ、ひつまぶし、手羽先がおすすめです', pronunciation: 'nagoya meibutsu deshitara, miso katsu, hitsumabushi, tebasaki ga osusume desu', pronunciation_chunks: 'na·go·ya mei·bu·tsu de·shi·ta·ra, mi·so ka·tsu, hi·tsu·ma·bu·shi, te·ba·sa·ki ga o·su·su·me de·su', english: 'For Nagoya specialties, I recommend miso katsu, hitsumabushi, and tebasaki wings.', chinese_tc: '名古屋名物的話，推薦味噌豬排、鰻魚三吃、和雞翅', note: '味噌カツ=miso pork cutlet, ひつまぶし=eel 3 ways, 手羽先=chicken wings' },
      { speaker: 'you', target: 'ひつまぶしを二人前お願いします', pronunciation: 'hitsumabushi wo futarimai onegaishimasu', pronunciation_chunks: 'hi·tsu·ma·bu·shi wo fu·ta·ri·mae o·ne·gai·shi·ma·su', english: 'Hitsumabushi for two please', chinese_tc: '請給我兩份鰻魚三吃', options: [
        { target: 'ひつまぶしを二人前お願いします', pronunciation: 'hitsumabushi wo futarimai onegaishimasu', pronunciation_chunks: 'hi·tsu·ma·bu·shi wo fu·ta·ri·mae o·ne·gai·shi·ma·su', english: 'Hitsumabushi for two please', chinese_tc: '兩份鰻魚三吃' },
        { target: '味噌カツ定食を二つお願いします', pronunciation: 'miso katsu teishoku wo futatsu onegaishimasu', pronunciation_chunks: 'mi·so ka·tsu tei·sho·ku wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two miso katsu set meals please', chinese_tc: '兩份味噌豬排定食' },
        { target: '手羽先と味噌カツをお願いします', pronunciation: 'tebasaki to miso katsu wo onegaishimasu', pronunciation_chunks: 'te·ba·sa·ki to mi·so ka·tsu wo o·ne·gai·shi·ma·su', english: 'Tebasaki wings and miso katsu please', chinese_tc: '雞翅和味噌豬排' },
      ] },
      { speaker: 'staff', target: 'ひつまぶしは三つの食べ方があります。まずそのまま、次に薬味を乗せて、最後にお茶漬けにしてください', pronunciation: 'hitsumabushi wa mittsu no tabekata ga arimasu. mazu sono mama, tsugi ni yakumi wo nosete, saigo ni ochazuke ni shite kudasai', pronunciation_chunks: 'hi·tsu·ma·bu·shi wa mit·tsu no ta·be·ka·ta ga a·ri·ma·su', english: 'Hitsumabushi has 3 ways to eat: first plain, then with condiments, finally as ochazuke (with tea).', chinese_tc: '鰻魚三吃有三種吃法：先原味，再加佐料，最後加茶泡飯', note: 'This is what makes hitsumabushi special — you eat the eel 3 different ways in one meal!' },
      { speaker: 'you', target: 'わかりました、楽しみです！', pronunciation: 'wakarimashita, tanoshimi desu!', pronunciation_chunks: 'wa·ka·ri·ma·shi·ta, ta·no·shi·mi de·su', english: 'Understood, looking forward to it!', chinese_tc: '了解，好期待！' },
    ],
  },
  {
    id: 'sc23',
    lang: 'ja',
    group: 'activities',
    title: 'Nagoya Castle',
    titleTC: '名古屋城',
    emoji: '🏯',
    description: 'Visiting Nagoya Castle and asking about exhibits',
    lines: [
      { speaker: 'you', target: '入場券を二枚お願いします', pronunciation: 'nyuujouken wo nimai onegaishimasu', pronunciation_chunks: 'nyuu·jou·ken wo ni·mai o·ne·gai·shi·ma·su', english: 'Two admission tickets please', chinese_tc: '請給我兩張入場券' },
      { speaker: 'staff', target: '大人二枚で1,000円です', pronunciation: 'otona nimai de sen en desu', pronunciation_chunks: 'o·to·na ni·mai de sen en de·su', english: 'Two adults, 1,000 yen.', chinese_tc: '兩位大人1,000日圓' },
      { speaker: 'you', target: '本丸御殿は見られますか？', pronunciation: 'honmaru goten wa miraremasu ka?', pronunciation_chunks: 'hon·ma·ru go·ten wa mi·ra·re·ma·su ka', english: 'Can we see the Honmaru Palace?', chinese_tc: '可以參觀本丸御殿嗎？', note: 'The Honmaru Palace is a beautifully reconstructed feudal palace inside the castle grounds.' },
      { speaker: 'staff', target: 'はい、本丸御殿は無料でご覧いただけます。写真も撮れますよ', pronunciation: 'hai, honmaru goten wa muryou de goran itadakemasu. shashin mo toremasu yo', pronunciation_chunks: 'hai, hon·ma·ru go·ten wa mu·ryou de go·ran i·ta·da·ke·ma·su. sha·shin mo to·re·ma·su yo', english: 'Yes, the Honmaru Palace is free to view. You can take photos too.', chinese_tc: '可以的，本丸御殿免費參觀。也可以拍照' },
      { speaker: 'you', target: '金シャチはどこで見られますか？', pronunciation: 'kinshachi wa doko de miraremasu ka?', pronunciation_chunks: 'kin·sha·chi wa do·ko de mi·ra·re·ma·su ka', english: 'Where can we see the golden shachihoko?', chinese_tc: '金鯱在哪裡看？', note: '金シャチ (kinshachi) = golden dolphin-fish — Nagoya\'s iconic symbol on top of the castle' },
      { speaker: 'staff', target: '天守閣の上にございます。現在天守閣は閉館中ですが、外から見られます', pronunciation: 'tenshukaku no ue ni gozaimasu. genzai tenshukaku wa heikanchuu desu ga, soto kara miraremasu', pronunciation_chunks: 'ten·shu·ka·ku no u·e ni go·zai·ma·su. gen·zai ten·shu·ka·ku wa hei·kan·chuu de·su ga, so·to ka·ra mi·ra·re·ma·su', english: 'It\'s on top of the main keep. The keep is currently closed, but you can see it from outside.', chinese_tc: '在天守閣上面。目前天守閣閉館中，但可以從外面看', note: 'Nagoya Castle main keep has been closed for wooden reconstruction since 2018.' },
    ],
  },
  {
    id: 'sc24',
    lang: 'ja',
    group: 'activities',
    title: 'Winter Illumination',
    titleTC: '冬季燈飾',
    emoji: '✨',
    description: 'Visiting a December illumination event',
    lines: [
      { speaker: 'you', target: 'すみません、このイルミネーションは何時までですか？', pronunciation: 'sumimasen, kono irumineeshon wa nanji made desu ka?', pronunciation_chunks: 'su·mi·ma·sen, ko·no i·ru·mi·nee·shon wa nan·ji ma·de de·su ka', english: 'Excuse me, until what time is this illumination?', chinese_tc: '不好意思，這個燈飾到幾點？', note: 'December illuminations are HUGE in Japan — every major area has one.' },
      { speaker: 'staff', target: '夜10時までです。入場は無料ですよ', pronunciation: 'yoru juuji made desu. nyuujou wa muryou desu yo', pronunciation_chunks: 'yo·ru juu·ji ma·de de·su. nyuu·jou wa mu·ryou de·su yo', english: 'Until 10pm. Admission is free.', chinese_tc: '到晚上10點。免費入場' },
      { speaker: 'you', target: 'いい撮影スポットはどこですか？', pronunciation: 'ii satsuei supotto wa doko desu ka?', pronunciation_chunks: 'ii sa·tsu·ei su·pot·to wa do·ko de·su ka', english: 'Where\'s a good photo spot?', chinese_tc: '好的拍照地點在哪？' },
      { speaker: 'staff', target: 'あちらのメインツリーの前が一番きれいですよ', pronunciation: 'achira no mein tsurii no mae ga ichiban kirei desu yo', pronunciation_chunks: 'a·chi·ra no mein tsuu·rii no ma·e ga i·chi·ban ki·rei de·su yo', english: 'In front of the main tree over there is the most beautiful.', chinese_tc: '那邊主樹前面最漂亮' },
      { speaker: 'you', target: 'きれいですね！寒いけど来てよかった', pronunciation: 'kirei desu ne! samui kedo kite yokatta', pronunciation_chunks: 'ki·rei de·su ne! sa·mui ke·do ki·te yo·kat·ta', english: 'It\'s beautiful! Cold but glad we came.', chinese_tc: '好漂亮！雖然冷但是來了真好', note: 'December average temp in Tokyo: 5-10°C. Nagoya is similar. Bring warm clothes!' },
      { speaker: 'you', target: '近くに温かい飲み物を売っている場所はありますか？', pronunciation: 'chikaku ni atatakai nomimono wo utte iru basho wa arimasu ka?', pronunciation_chunks: 'chi·ka·ku ni a·ta·ta·kai no·mi·mo·no wo ut·te i·ru ba·sho wa a·ri·ma·su ka', english: 'Is there somewhere nearby selling hot drinks?', chinese_tc: '附近有賣熱飲的地方嗎？' },
      { speaker: 'staff', target: '出口の横に屋台がありますよ。甘酒やホットチョコレートがあります', pronunciation: 'deguchi no yoko ni yatai ga arimasu yo. amazake ya hotto chokoreeto ga arimasu', pronunciation_chunks: 'de·gu·chi no yo·ko ni ya·tai ga a·ri·ma·su yo. a·ma·za·ke ya hot·to cho·ko·ree·to ga a·ri·ma·su', english: 'There are food stalls by the exit. They have amazake and hot chocolate.', chinese_tc: '出口旁邊有攤販。有甜酒和熱可可', note: '甘酒 (amazake) = sweet fermented rice drink, perfect for winter. Also try ホットワイン (hot wine)!' },
    ],
  },
  {
    id: 'sc25',
    lang: 'ja',
    group: 'activities',
    title: 'Winter Weather Chat',
    titleTC: '冬天氣候對話',
    emoji: '🧣',
    description: 'Talking about cold weather and finding warm places',
    lines: [
      { speaker: 'you', target: '今日はとても寒いですね', pronunciation: 'kyou wa totemo samui desu ne', pronunciation_chunks: 'kyou wa to·te·mo sa·mui de·su ne', english: 'It\'s very cold today, isn\'t it?', chinese_tc: '今天好冷呢' },
      { speaker: 'staff', target: 'そうですね。今日は3度ぐらいです', pronunciation: 'sou desu ne. kyou wa sando gurai desu', pronunciation_chunks: 'sou de·su ne. kyou wa san·do gu·rai de·su', english: 'Yes, it\'s about 3 degrees today.', chinese_tc: '是啊。今天大概3度' },
      { speaker: 'you', target: 'この近くに暖かい場所はありますか？カフェとか', pronunciation: 'kono chikaku ni atatakai basho wa arimasu ka? kafe toka', pronunciation_chunks: 'ko·no chi·ka·ku ni a·ta·ta·kai ba·sho wa a·ri·ma·su ka? ka·fe to·ka', english: 'Is there a warm place nearby? Like a café?', chinese_tc: '附近有暖和的地方嗎？像咖啡廳之類的' },
      { speaker: 'staff', target: '駅の中にスタバがありますよ。地下も暖かいです', pronunciation: 'eki no naka ni sutaba ga arimasu yo. chika mo atatakai desu', pronunciation_chunks: 'e·ki no na·ka ni su·ta·ba ga a·ri·ma·su yo. chi·ka mo a·ta·ta·kai de·su', english: 'There\'s a Starbucks inside the station. Underground is warm too.', chinese_tc: '車站裡面有星巴克。地下也很暖和' },
      { speaker: 'you', target: 'ホッカイロはどこで買えますか？', pronunciation: 'hokkairo wa doko de kaemasu ka?', pronunciation_chunks: 'hok·kai·ro wa do·ko de ka·e·ma·su ka', english: 'Where can I buy hand warmers?', chinese_tc: '暖暖包哪裡買？', note: 'ホッカイロ (hokkairo) — disposable hand warmers, essential for winter in Japan! Available at any convenience store or drugstore.' },
      { speaker: 'staff', target: 'コンビニかドラッグストアで売っていますよ', pronunciation: 'konbini ka doraggu sutoa de utte imasu yo', pronunciation_chunks: 'kon·bi·ni ka do·rag·gu su·to·a de ut·te i·ma·su yo', english: 'They sell them at convenience stores or drugstores.', chinese_tc: '便利商店或藥妝店有賣' },
      { speaker: 'you', target: '貼るタイプをください', pronunciation: 'haru taipu wo kudasai', pronunciation_chunks: 'ha·ru tai·pu wo ku·da·sai', english: 'The stick-on type please', chinese_tc: '請給我貼的那種', options: [
        { target: '貼るタイプをください', pronunciation: 'haru taipu wo kudasai', pronunciation_chunks: 'ha·ru tai·pu wo ku·da·sai', english: 'Stick-on type please', chinese_tc: '貼的那種' },
        { target: '手で持つタイプをください', pronunciation: 'te de motsu taipu wo kudasai', pronunciation_chunks: 'te de mo·tsu tai·pu wo ku·da·sai', english: 'Hand-held type please', chinese_tc: '手握的那種' },
      ] },
    ],
  },
  {
    id: 'sc26',
    lang: 'ja',
    group: 'hotel',
    title: 'Luggage Forwarding (Takkyubin)',
    titleTC: '行李宅配（宅急便）',
    emoji: '📦',
    description: 'Send luggage from Hotel A to Hotel B — travel light on the Shinkansen!',
    lines: [
      { speaker: 'you', target: 'すみません、荷物を次のホテルに送りたいのですが', pronunciation: 'sumimasen, nimotsu wo tsugi no hoteru ni okuritai no desu ga', pronunciation_chunks: 'su·mi·ma·sen, ni·mo·tsu wo tsu·gi no ho·te·ru ni o·ku·ri·tai no de·su ga', english: 'Excuse me, I\'d like to send luggage to my next hotel.', chinese_tc: '不好意思，我想把行李寄到下一間飯店', note: '宅急便 (takkyubin) — Japan\'s amazing luggage forwarding service. Send from hotel/convenience store, arrives next day!' },
      { speaker: 'staff', target: 'はい、宅急便ですね。伝票をご記入ください', pronunciation: 'hai, takkyuubin desu ne. denpyou wo gokinyuu kudasai', pronunciation_chunks: 'hai, tak·kyuu·bin de·su ne. den·pyou wo go·ki·nyuu ku·da·sai', english: 'Yes, takkyubin. Please fill out the slip.', chinese_tc: '好的，宅急便。請填寫單子' },
      { speaker: 'you', target: '送り先の住所を書けばいいですか？', pronunciation: 'okurisaki no juusho wo kakeba ii desu ka?', pronunciation_chunks: 'o·ku·ri·sa·ki no juu·sho wo ka·ke·ba ii de·su ka', english: 'I just write the destination address?', chinese_tc: '寫收件地址就好嗎？' },
      { speaker: 'staff', target: 'はい、届け先のホテル名と住所をお願いします。お届け日はいつがよろしいですか？', pronunciation: 'hai, todokesaki no hoteru mei to juusho wo onegaishimasu. otodoke bi wa itsu ga yoroshii desu ka?', pronunciation_chunks: 'hai, to·do·ke·sa·ki no ho·te·ru mei to juu·sho wo o·ne·gai·shi·ma·su. o·to·do·ke bi wa i·tsu ga yo·ro·shii de·su ka', english: 'Yes, the destination hotel name and address please. What delivery date would you like?', chinese_tc: '是的，請寫收件飯店名稱和地址。希望哪天送到？' },
      { speaker: 'you', target: '明後日の午前中にお願いします', pronunciation: 'asatte no gozenchuu ni onegaishimasu', pronunciation_chunks: 'a·sat·te no go·zen·chuu ni o·ne·gai·shi·ma·su', english: 'Day after tomorrow morning please', chinese_tc: '請後天上午送到', variables: [
        { placeholder: '明後日', label: 'Delivery day', options: [
          { value: '明日', pronunciation: 'a·shi·ta', english: 'Tomorrow' },
          { value: '明後日', pronunciation: 'a·sat·te', english: 'Day after tomorrow' },
        ] },
        { placeholder: '午前中', label: 'Time', options: [
          { value: '午前中', pronunciation: 'go·zen·chuu', english: 'Morning' },
          { value: '午後', pronunciation: 'go·go', english: 'Afternoon' },
          { value: '夕方', pronunciation: 'yuu·ga·ta', english: 'Evening' },
        ] },
      ] },
      { speaker: 'staff', target: 'スーツケース一つですか？', pronunciation: 'suutsukeesu hitotsu desu ka?', pronunciation_chunks: 'suu·tsu·kee·su hi·to·tsu de·su ka', english: 'One suitcase?', chinese_tc: '一個行李箱嗎？' },
      { speaker: 'you', target: 'はい、スーツケース二つです', pronunciation: 'hai, suutsukeesu futatsu desu', pronunciation_chunks: 'hai, suu·tsu·kee·su fu·ta·tsu de·su', english: 'Two suitcases', chinese_tc: '兩個行李箱', options: [
        { target: 'はい、スーツケース一つです', pronunciation: 'hai, suutsukeesu hitotsu desu', pronunciation_chunks: 'hai, suu·tsu·kee·su hi·to·tsu de·su', english: 'One suitcase', chinese_tc: '一個行李箱' },
        { target: 'はい、スーツケース二つです', pronunciation: 'hai, suutsukeesu futatsu desu', pronunciation_chunks: 'hai, suu·tsu·kee·su fu·ta·tsu de·su', english: 'Two suitcases', chinese_tc: '兩個行李箱' },
      ] },
      { speaker: 'staff', target: '合計で3,500円になります。中に壊れやすいものはございますか？', pronunciation: 'goukei de sanzen gohyaku en ni narimasu. naka ni kowareyasui mono wa gozaimasu ka?', pronunciation_chunks: 'gou·kei de san·zen go·hya·ku en ni na·ri·ma·su. na·ka ni ko·wa·re·ya·sui mo·no wa go·zai·ma·su ka', english: 'Total 3,500 yen. Are there any fragile items inside?', chinese_tc: '共3,500日圓。裡面有易碎物品嗎？' },
      { speaker: 'you', target: 'いいえ、大丈夫です。洋服だけです', pronunciation: 'iie, daijoubu desu. youfuku dake desu', pronunciation_chunks: 'ii·e, dai·jou·bu de·su. you·fu·ku da·ke de·su', english: 'No, just clothes.', chinese_tc: '沒有，只有衣服', options: [
        { target: 'いいえ、大丈夫です。洋服だけです', pronunciation: 'iie, daijoubu desu. youfuku dake desu', pronunciation_chunks: 'ii·e, dai·jou·bu de·su. you·fu·ku da·ke de·su', english: 'No, just clothes', chinese_tc: '沒有，只有衣服' },
        { target: 'はい、お土産のお菓子が入っています', pronunciation: 'hai, omiyage no okashi ga haitte imasu', pronunciation_chunks: 'hai, o·mi·ya·ge no o·ka·shi ga hai·tte i·ma·su', english: 'Yes, there are souvenir snacks', chinese_tc: '有，有伴手禮零食' },
      ] },
      { speaker: 'staff', target: 'かしこまりました。控えをお渡しします。追跡番号はこちらです', pronunciation: 'kashikomarimashita. hikae wo owatashi shimasu. tsuiseki bangou wa kochira desu', pronunciation_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta. hi·ka·e wo o·wa·ta·shi shi·ma·su. tsui·se·ki ban·gou wa ko·chi·ra de·su', english: 'Certainly. Here\'s your receipt. This is the tracking number.', chinese_tc: '好的。給您收據。這是追蹤號碼', note: 'Keep this receipt! You can track delivery at yamato-hd.co.jp or sagawa-exp.co.jp' },
      { speaker: 'you', target: 'ありがとうございます。これで身軽に移動できます！', pronunciation: 'arigatou gozaimasu. kore de migaru ni idou dekimasu!', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su. ko·re de mi·ga·ru ni i·dou de·ki·ma·su', english: 'Thank you! Now we can travel light!', chinese_tc: '謝謝！這樣就能輕鬆移動了！', note: 'Pro tip: Send luggage the morning of checkout → take Shinkansen with just a day bag → luggage waiting at next hotel!' },
    ],
  },
  {
    id: 'sc27',
    lang: 'ja',
    group: 'train',
    title: 'Train Ticket Gate Problem',
    titleTC: '車票閘門故障',
    emoji: '🚧',
    description: 'Your multi-day pass won\'t scan — asking station staff for help',
    lines: [
      { speaker: 'you', target: 'すみません、改札が通れないのですが…', pronunciation: 'sumimasen, kaisatsu ga toorenai no desu ga...', pronunciation_chunks: 'su·mi·ma·sen, kai·sa·tsu ga too·re·nai no de·su ga', english: 'Excuse me, I can\'t get through the ticket gate...', chinese_tc: '不好意思，我過不了閘門…', note: '改札 (kaisatsu) = ticket gate. Approach the staff window next to the gates.' },
      { speaker: 'staff', target: '切符を見せてもらえますか？', pronunciation: 'kippu wo misete moraemasu ka?', pronunciation_chunks: 'kip·pu wo mi·se·te mo·ra·e·ma·su ka', english: 'Can I see your ticket?', chinese_tc: '可以讓我看看車票嗎？' },
      { speaker: 'you', target: 'はい、これです。○日間パスです', pronunciation: 'hai, kore desu. ○nichikan pasu desu', pronunciation_chunks: 'hai, ko·re de·su. ○·ni·chi·kan pa·su de·su', english: 'Yes, here it is. It\'s a ○-day pass.', chinese_tc: '好的，這是○日券', variables: [
        { placeholder: '○日間', label: 'Pass type', options: [
          { value: '3日間', pronunciation: 'mik·ka·kan', english: '3-day' },
          { value: '5日間', pronunciation: 'i·tsu·ka·kan', english: '5-day' },
          { value: '7日間', pronunciation: 'na·no·ka·kan', english: '7-day' },
          { value: '14日間', pronunciation: 'juu·yok·ka·kan', english: '14-day' },
        ] },
      ] },
      { speaker: 'staff', target: 'このパスは有人改札をお通りください', pronunciation: 'kono pasu wa yuujin kaisatsu wo otoori kudasai', pronunciation_chunks: 'ko·no pa·su wa yuu·jin kai·sa·tsu wo o·too·ri ku·da·sai', english: 'Please use the staffed gate for this pass.', chinese_tc: '這種票請走人工閘門', note: 'Some passes (like JR Pass) can\'t go through automatic gates — always use the staffed gate window.' },
      { speaker: 'you', target: '有人改札はどこですか？', pronunciation: 'yuujin kaisatsu wa doko desu ka?', pronunciation_chunks: 'yuu·jin kai·sa·tsu wa do·ko de·su ka', english: 'Where is the staffed gate?', chinese_tc: '人工閘門在哪裡？' },
      { speaker: 'staff', target: 'あちらの窓口です。パスを見せるだけで大丈夫です', pronunciation: 'achira no madoguchi desu. pasu wo miseru dake de daijoubu desu', pronunciation_chunks: 'a·chi·ra no ma·do·gu·chi de·su. pa·su wo mi·se·ru da·ke de dai·jou·bu de·su', english: 'It\'s that window over there. Just show your pass.', chinese_tc: '在那邊的窗口。出示票券就可以了' },
      { speaker: 'you', target: 'ありがとうございます！', pronunciation: 'arigatou gozaimasu!', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you!', chinese_tc: '謝謝！' },
    ],
  },
  {
    id: 'sc28',
    lang: 'ja',
    group: 'restaurant',
    title: 'Politely Declining & Correcting',
    titleTC: '禮貌拒絕與更正',
    emoji: '🙅',
    description: 'Saying no, correcting a wrong order, declining offers politely',
    lines: [
      { speaker: 'staff', target: 'お飲み物はいかがですか？', pronunciation: 'onomimono wa ikaga desu ka?', pronunciation_chunks: 'o·no·mi·mo·no wa i·ka·ga de·su ka', english: 'Would you like something to drink?', chinese_tc: '需要飲料嗎？' },
      { speaker: 'you', target: 'いいえ、大丈夫です。水だけで', pronunciation: 'iie, daijoubu desu. mizu dake de', pronunciation_chunks: 'ii·e, dai·jou·bu de·su. mi·zu da·ke de', english: 'No thank you. Just water.', chinese_tc: '不用了。只要水就好', options: [
        { target: 'いいえ、大丈夫です。水だけで', pronunciation: 'iie, daijoubu desu. mizu dake de', pronunciation_chunks: 'ii·e, dai·jou·bu de·su. mi·zu da·ke de', english: 'No thanks, just water', chinese_tc: '不用了，只要水' },
        { target: 'まだ決まっていません', pronunciation: 'mada kimatte imasen', pronunciation_chunks: 'ma·da ki·mat·te i·ma·sen', english: 'We haven\'t decided yet', chinese_tc: '還沒決定' },
      ] },
      { speaker: 'staff', target: 'デザートはいかがですか？', pronunciation: 'dezaato wa ikaga desu ka?', pronunciation_chunks: 'de·zaa·to wa i·ka·ga de·su ka', english: 'Would you like dessert?', chinese_tc: '需要甜點嗎？' },
      { speaker: 'you', target: '結構です、ありがとうございます', pronunciation: 'kekkou desu, arigatou gozaimasu', pronunciation_chunks: 'kek·kou de·su, a·ri·ga·tou go·zai·ma·su', english: 'No thank you (polite decline)', chinese_tc: '不用了，謝謝', note: '結構です is a very polite way to decline. More casual: 大丈夫です' },
      { speaker: 'staff', target: 'お待たせしました。こちらラーメンです', pronunciation: 'omatase shimashita. kochira raamen desu', pronunciation_chunks: 'o·ma·ta·se shi·ma·shi·ta. ko·chi·ra raa·men de·su', english: 'Sorry for the wait. Here\'s the ramen.', chinese_tc: '讓您久等了。這是拉麵' },
      { speaker: 'you', target: 'すみません、これは注文していないのですが…', pronunciation: 'sumimasen, kore wa chuumon shite inai no desu ga...', pronunciation_chunks: 'su·mi·ma·sen, ko·re wa chuu·mon shi·te i·nai no de·su ga', english: 'Excuse me, I didn\'t order this...', chinese_tc: '不好意思，這不是我點的…', note: 'Polite way to say wrong order. Don\'t be aggressive — Japanese staff will fix it immediately.' },
      { speaker: 'staff', target: '申し訳ございません。すぐにお取り替えいたします', pronunciation: 'moushiwake gozaimasen. sugu ni otorikaeshimasu', pronunciation_chunks: 'mou·shi·wa·ke go·zai·ma·sen. su·gu ni o·to·ri·ka·e·shi·ma·su', english: 'I\'m very sorry. I\'ll replace it right away.', chinese_tc: '非常抱歉。立刻為您更換' },
      { speaker: 'you', target: 'お願いします', pronunciation: 'onegaishimasu', pronunciation_chunks: 'o·ne·gai·shi·ma·su', english: 'Please (thank you)', chinese_tc: '麻煩了' },
      { speaker: 'staff', target: 'こちらにサインをお願いします', pronunciation: 'kochira ni sain wo onegaishimasu', pronunciation_chunks: 'ko·chi·ra ni sain wo o·ne·gai·shi·ma·su', english: 'Please sign here.', chinese_tc: '請在這裡簽名' },
      { speaker: 'you', target: 'すみません、内容を確認してもいいですか？', pronunciation: 'sumimasen, naiyou wo kakunin shite mo ii desu ka?', pronunciation_chunks: 'su·mi·ma·sen, nai·you wo ka·ku·nin shi·te mo ii de·su ka', english: 'Can I check the details first?', chinese_tc: '可以先確認內容嗎？', note: 'Always OK to ask to check before signing anything.' },
    ],
  },

  // === SC29: IC Card Purchase ===
  {
    id: 'sc29', lang: 'ja', group: 'airport',
    title: 'Buying an IC Card', titleTC: '購買IC卡',
    emoji: '💳', description: 'At the station ticket machine, buying and charging a Suica/Manaca',
    lines: [
      { speaker: 'you', target: 'すみません、ICカードはどこで買えますか？', pronunciation: 'sumimasen, ai-shii kaado wa doko de kaemasu ka', pronunciation_chunks: 'su·mi·ma·sen ai·shii kaa·do wa do·ko de ka·e·ma·su ka', english: 'Excuse me, where can I buy an IC card?', chinese_tc: '請問哪裡可以買IC卡？' },
      { speaker: 'staff', target: 'あちらの券売機で買えますよ', pronunciation: 'achira no kenbaiki de kaemasu yo', pronunciation_chunks: 'a·chi·ra no ken·bai·ki de ka·e·ma·su yo', english: 'You can buy one at that ticket machine over there.', chinese_tc: '在那邊的售票機可以買' },
      { speaker: 'you', target: '英語の画面はありますか？', pronunciation: 'eigo no gamen wa arimasu ka', pronunciation_chunks: 'ei·go no ga·men wa a·ri·ma·su ka', english: 'Is there an English screen?', chinese_tc: '有英文畫面嗎？', note: 'Most station machines have an English button at the top right!' },
      { speaker: 'staff', target: 'はい、右上のEnglishボタンを押してください', pronunciation: 'hai, migi ue no English botan wo oshite kudasai', pronunciation_chunks: 'hai mi·gi u·e no English bo·tan wo o·shi·te ku·da·sai', english: 'Yes, press the English button at the top right.', chinese_tc: '有，請按右上角的English按鈕' },
      { speaker: 'you', target: 'チャージはいくらがいいですか？', pronunciation: 'chaaji wa ikura ga ii desu ka', pronunciation_chunks: 'chaa·ji wa i·ku·ra ga ii de·su ka', english: 'How much should I charge?', chinese_tc: '應該儲值多少？' },
      { speaker: 'staff', target: '2000円くらいで大丈夫ですよ', pronunciation: 'nisen en kurai de daijoubu desu yo', pronunciation_chunks: 'ni·sen en ku·rai de dai·jou·bu de·su yo', english: 'About 2000 yen should be fine.', chinese_tc: '大概2000日圓就夠了', note: '¥2000 includes ¥500 deposit. Use for trains, buses, convenience stores, vending machines!' },
      { speaker: 'you', target: 'ありがとうございます！', pronunciation: 'arigatou gozaimasu', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you very much!', chinese_tc: '非常感謝！' },
    ],
  },

  // === SC30: Airport Arrival ===
  {
    id: 'sc30', lang: 'ja', group: 'airport',
    title: 'Airport Arrival', titleTC: '機場入境',
    emoji: '🛬', description: 'Immigration, customs, and finding transport to the city',
    lines: [
      { speaker: 'staff', target: 'パスポートをお見せください', pronunciation: 'pasupooto wo omise kudasai', pronunciation_chunks: 'pa·su·poo·to wo o·mi·se ku·da·sai', english: 'Please show your passport.', chinese_tc: '請出示護照' },
      { speaker: 'you', target: 'はい、どうぞ', pronunciation: 'hai, douzo', pronunciation_chunks: 'hai dou·zo', english: 'Here you go.', chinese_tc: '好的，請' },
      { speaker: 'staff', target: '滞在の目的は何ですか？', pronunciation: 'taizai no mokuteki wa nan desu ka', pronunciation_chunks: 'tai·zai no mo·ku·te·ki wa nan de·su ka', english: 'What is the purpose of your stay?', chinese_tc: '您的停留目的是什麼？' },
      { speaker: 'you', target: '観光です', pronunciation: 'kankou desu', pronunciation_chunks: 'kan·kou de·su', english: 'Sightseeing / Tourism.', chinese_tc: '觀光', note: 'Simple and clear. No need to elaborate.' },
      { speaker: 'staff', target: '何日間の滞在ですか？', pronunciation: 'nannichikan no taizai desu ka', pronunciation_chunks: 'nan·ni·chi·kan no tai·zai de·su ka', english: 'How many days will you stay?', chinese_tc: '停留幾天？' },
      { speaker: 'you', target: '一週間です', pronunciation: 'isshuukan desu', pronunciation_chunks: 'is·shuu·kan de·su', english: 'One week.', chinese_tc: '一個星期' },
      { speaker: 'you', target: '荷物の受取所はどこですか？', pronunciation: 'nimotsu no uketori-jo wa doko desu ka', pronunciation_chunks: 'ni·mo·tsu no u·ke·to·ri·jo wa do·ko de·su ka', english: 'Where is the baggage claim?', chinese_tc: '行李提取處在哪裡？' },
      { speaker: 'you', target: '名古屋市内への電車はどこですか？', pronunciation: 'nagoya shinai e no densha wa doko desu ka', pronunciation_chunks: 'na·go·ya shi·nai e no den·sha wa do·ko de·su ka', english: 'Where is the train to Nagoya city?', chinese_tc: '去名古屋市區的電車在哪裡？', note: 'From Chubu Airport: take Meitetsu μ-SKY to Nagoya Station (~28 min)' },
    ],
  },

  // === SC31: Feeling Sick / Medical ===
  {
    id: 'sc31', lang: 'ja', group: 'trouble',
    title: 'Feeling Sick', titleTC: '身體不舒服',
    emoji: '🤒', description: 'Telling hotel staff or a pharmacist about symptoms',
    lines: [
      { speaker: 'you', target: 'すみません、体調が悪いです', pronunciation: 'sumimasen, taichou ga warui desu', pronunciation_chunks: 'su·mi·ma·sen tai·chou ga wa·rui de·su', english: 'Excuse me, I\'m not feeling well.', chinese_tc: '不好意思，我身體不舒服' },
      { speaker: 'staff', target: 'どうしましたか？', pronunciation: 'dou shimashita ka', pronunciation_chunks: 'dou shi·ma·shi·ta ka', english: 'What happened? / What\'s wrong?', chinese_tc: '怎麼了？' },
      { speaker: 'you', target: '熱があります', pronunciation: 'netsu ga arimasu', pronunciation_chunks: 'ne·tsu ga a·ri·ma·su', english: 'I have a fever.', chinese_tc: '我發燒了', note: 'Other symptoms: 頭が痛い (headache), お腹が痛い (stomachache), 咳が出ます (cough)' },
      { speaker: 'staff', target: '病院に行きますか？', pronunciation: 'byouin ni ikimasu ka', pronunciation_chunks: 'byou·in ni i·ki·ma·su ka', english: 'Would you like to go to a hospital?', chinese_tc: '要去醫院嗎？' },
      { speaker: 'you', target: 'まず薬局で薬を買いたいです', pronunciation: 'mazu yakkyoku de kusuri wo kaitai desu', pronunciation_chunks: 'ma·zu yak·kyo·ku de ku·su·ri wo kai·tai de·su', english: 'First I\'d like to buy medicine at a pharmacy.', chinese_tc: '先想去藥局買藥' },
      { speaker: 'staff', target: '近くの薬局をご案内します', pronunciation: 'chikaku no yakkyoku wo go-annai shimasu', pronunciation_chunks: 'chi·ka·ku no yak·kyo·ku wo go·an·nai shi·ma·su', english: 'I\'ll show you a nearby pharmacy.', chinese_tc: '我帶您去附近的藥局' },
      { speaker: 'you', target: '風邪薬をください', pronunciation: 'kaze-gusuri wo kudasai', pronunciation_chunks: 'ka·ze·gu·su·ri wo ku·da·sai', english: 'Cold medicine please.', chinese_tc: '請給我感冒藥', note: 'Useful: 頭痛薬 (headache), 胃薬 (stomach), 解熱剤 (fever reducer)' },
    ],
  },

  // === SC32: Getting Lost on Train ===
  {
    id: 'sc32', lang: 'ja', group: 'train',
    title: 'Wrong Train / Lost', titleTC: '搭錯車',
    emoji: '😰', description: 'Realizing you\'re on the wrong train and asking for help',
    lines: [
      { speaker: 'you', target: 'すみません、この電車は東京駅に行きますか？', pronunciation: 'sumimasen, kono densha wa toukyou eki ni ikimasu ka', pronunciation_chunks: 'su·mi·ma·sen ko·no den·sha wa tou·kyou e·ki ni i·ki·ma·su ka', english: 'Excuse me, does this train go to Tokyo Station?', chinese_tc: '請問這班電車有到東京站嗎？' },
      { speaker: 'staff', target: 'いいえ、この電車は行きません。次の駅で降りてください', pronunciation: 'iie, kono densha wa ikimasen. tsugi no eki de orite kudasai', pronunciation_chunks: 'ii·e ko·no den·sha wa i·ki·ma·sen. tsu·gi no e·ki de o·ri·te ku·da·sai', english: 'No, this train doesn\'t go there. Please get off at the next station.', chinese_tc: '不是，這班不到。請在下一站下車' },
      { speaker: 'you', target: 'どのホームに行けばいいですか？', pronunciation: 'dono hoomu ni ikeba ii desu ka', pronunciation_chunks: 'do·no hoo·mu ni i·ke·ba ii de·su ka', english: 'Which platform should I go to?', chinese_tc: '應該去哪個月台？' },
      { speaker: 'staff', target: '向かいのホーム、3番線です', pronunciation: 'mukai no hoomu, sanban-sen desu', pronunciation_chunks: 'mu·kai no hoo·mu san·ban·sen de·su', english: 'The opposite platform, line 3.', chinese_tc: '對面月台，3號線' },
      { speaker: 'you', target: '乗り換えは必要ですか？', pronunciation: 'norikae wa hitsuyou desu ka', pronunciation_chunks: 'no·ri·ka·e wa hi·tsu·you de·su ka', english: 'Do I need to transfer?', chinese_tc: '需要轉車嗎？' },
      { speaker: 'staff', target: 'はい、次の駅で中央線に乗り換えてください', pronunciation: 'hai, tsugi no eki de chuuou-sen ni norikaete kudasai', pronunciation_chunks: 'hai tsu·gi no e·ki de chuu·ou·sen ni no·ri·ka·e·te ku·da·sai', english: 'Yes, transfer to the Chuo Line at the next station.', chinese_tc: '是的，在下一站轉中央線' },
    ],
  },

  // === SC33: Restaurant Reservation ===
  {
    id: 'sc33', lang: 'ja', group: 'restaurant',
    title: 'Making a Reservation', titleTC: '預約餐廳',
    emoji: '📞', description: 'Booking a table at a restaurant by phone or walk-in',
    lines: [
      { speaker: 'you', target: '予約したいのですが', pronunciation: 'yoyaku shitai no desu ga', pronunciation_chunks: 'yo·ya·ku shi·tai no de·su ga', english: 'I\'d like to make a reservation.', chinese_tc: '我想預約' },
      { speaker: 'staff', target: 'いつのご予約ですか？', pronunciation: 'itsu no go-yoyaku desu ka', pronunciation_chunks: 'i·tsu no go·yo·ya·ku de·su ka', english: 'When would you like to reserve?', chinese_tc: '什麼時候的預約？' },
      { speaker: 'you', target: '今日の7時に二名でお願いします', pronunciation: 'kyou no shichiji ni nimei de onegaishimasu', pronunciation_chunks: 'kyou no shi·chi·ji ni ni·mei de o·ne·gai·shi·ma·su', english: 'Today at 7pm for two people please.', chinese_tc: '今天7點，兩位' },
      { speaker: 'staff', target: '少々お待ちください… はい、大丈夫です', pronunciation: 'shoushou omachi kudasai... hai, daijoubu desu', pronunciation_chunks: 'shou·shou o·ma·chi ku·da·sai hai dai·jou·bu de·su', english: 'One moment please... Yes, that\'s fine.', chinese_tc: '請稍等...好的，可以' },
      { speaker: 'staff', target: 'お名前をお願いします', pronunciation: 'onamae wo onegaishimasu', pronunciation_chunks: 'o·na·ma·e wo o·ne·gai·shi·ma·su', english: 'May I have your name?', chinese_tc: '請問您的名字？' },
      { speaker: 'you', target: 'アンソニーです', pronunciation: 'ansonii desu', pronunciation_chunks: 'an·so·nii de·su', english: 'Anthony.', chinese_tc: 'Anthony', note: 'Just say your name + です. Staff may repeat it back to confirm.' },
      { speaker: 'staff', target: '7時にお待ちしております', pronunciation: 'shichiji ni omachi shite orimasu', pronunciation_chunks: 'shi·chi·ji ni o·ma·chi shi·te o·ri·ma·su', english: 'We\'ll be expecting you at 7.', chinese_tc: '7點恭候您的到來' },
    ],
  },

  // === SC34: Convenience Store Detailed ===
  {
    id: 'sc34', lang: 'ja', group: 'daily',
    title: 'Convenience Store Checkout', titleTC: '便利店結帳',
    emoji: '🏪', description: 'Full checkout flow — heating, bags, payment, eating in',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ', pronunciation: 'irasshaimase', pronunciation_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨' },
      { speaker: 'staff', target: '温めますか？', pronunciation: 'atatamemasu ka', pronunciation_chunks: 'a·ta·ta·me·ma·su ka', english: 'Shall I heat this up?', chinese_tc: '要加熱嗎？' },
      { speaker: 'you', target: 'はい、お願いします', pronunciation: 'hai, onegaishimasu', pronunciation_chunks: 'hai o·ne·gai·shi·ma·su', english: 'Yes please.', chinese_tc: '好的，麻煩了' },
      { speaker: 'staff', target: 'お箸とスプーン、どちらにしますか？', pronunciation: 'ohashi to supuun, dochira ni shimasu ka', pronunciation_chunks: 'o·ha·shi to su·puun do·chi·ra ni shi·ma·su ka', english: 'Chopsticks or spoon?', chinese_tc: '要筷子還是湯匙？' },
      { speaker: 'you', target: 'お箸をお願いします', pronunciation: 'ohashi wo onegaishimasu', pronunciation_chunks: 'o·ha·shi wo o·ne·gai·shi·ma·su', english: 'Chopsticks please.', chinese_tc: '請給我筷子' },
      { speaker: 'staff', target: '袋はご利用ですか？', pronunciation: 'fukuro wa goriyou desu ka', pronunciation_chunks: 'fu·ku·ro wa go·ri·you de·su ka', english: 'Would you like a bag?', chinese_tc: '需要袋子嗎？', note: 'Bags cost ¥3-5. Say いいえ、大丈夫です if you have your own.' },
      { speaker: 'you', target: 'いいえ、大丈夫です。ここで食べてもいいですか？', pronunciation: 'iie, daijoubu desu. koko de tabete mo ii desu ka', pronunciation_chunks: 'ii·e dai·jou·bu de·su. ko·ko de ta·be·te mo ii de·su ka', english: 'No thanks. Can I eat here?', chinese_tc: '不用了。可以在這裡吃嗎？', note: 'Eating in = 10% tax. Taking out = 8% tax. Staff may ask: 店内でお召し上がりですか？' },
      { speaker: 'staff', target: 'はい、イートインコーナーをご利用ください', pronunciation: 'hai, iitoinkoonaa wo goriyou kudasai', pronunciation_chunks: 'hai ii·to·in koo·naa wo go·ri·you ku·da·sai', english: 'Yes, please use the eat-in corner.', chinese_tc: '好的，請使用用餐區' },
    ],
  },

  // === SC35: Department Store / Mall ===
  {
    id: 'sc35', lang: 'ja', group: 'shopping',
    title: 'Department Store', titleTC: '百貨公司',
    emoji: '🏬', description: 'Finding floors, gift wrapping, food hall',
    lines: [
      { speaker: 'you', target: 'お土産売り場は何階ですか？', pronunciation: 'omiyage uriba wa nankai desu ka', pronunciation_chunks: 'o·mi·ya·ge u·ri·ba wa nan·kai de·su ka', english: 'What floor is the souvenir section?', chinese_tc: '伴手禮在幾樓？' },
      { speaker: 'staff', target: '地下1階の食品売り場にございます', pronunciation: 'chika ikkai no shokuhin uriba ni gozaimasu', pronunciation_chunks: 'chi·ka ik·kai no sho·ku·hin u·ri·ba ni go·zai·ma·su', english: 'It\'s in the B1 food hall.', chinese_tc: '在地下1樓的食品賣場', note: '地下 (chika) = basement. デパ地下 (depachika) = department store basement food hall — amazing!' },
      { speaker: 'you', target: 'これを贈り物用に包んでいただけますか？', pronunciation: 'kore wo okurimono-you ni tsutsunde itadakemasu ka', pronunciation_chunks: 'ko·re wo o·ku·ri·mo·no·you ni tsu·tsun·de i·ta·da·ke·ma·su ka', english: 'Could you gift-wrap this?', chinese_tc: '可以幫我包裝成禮物嗎？' },
      { speaker: 'staff', target: 'はい、のしはお付けしますか？', pronunciation: 'hai, noshi wa otsuke shimasu ka', pronunciation_chunks: 'hai no·shi wa o·tsu·ke shi·ma·su ka', english: 'Yes, would you like a noshi (gift tag)?', chinese_tc: '好的，要附熨斗（禮物標籤）嗎？', note: 'のし = traditional Japanese gift decoration. Say いいえ for casual gifts.' },
      { speaker: 'you', target: 'いいえ、普通の包装でお願いします', pronunciation: 'iie, futsuu no housou de onegaishimasu', pronunciation_chunks: 'ii·e fu·tsuu no hou·sou de o·ne·gai·shi·ma·su', english: 'No, regular wrapping is fine.', chinese_tc: '不用，普通包裝就好' },
      { speaker: 'you', target: '海外に送れますか？', pronunciation: 'kaigai ni okuremasu ka', pronunciation_chunks: 'kai·gai ni o·ku·re·ma·su ka', english: 'Can you ship it overseas?', chinese_tc: '可以寄到國外嗎？' },
    ],
  },

  // === SC36: Karaoke ===
  {
    id: 'sc36', lang: 'ja', group: 'activities',
    title: 'Karaoke', titleTC: '卡拉OK',
    emoji: '🎤', description: 'Booking a room, ordering drinks, extending time',
    lines: [
      { speaker: 'you', target: '二名で一時間お願いします', pronunciation: 'nimei de ichijikan onegaishimasu', pronunciation_chunks: 'ni·mei de i·chi·ji·kan o·ne·gai·shi·ma·su', english: 'Two people, one hour please.', chinese_tc: '兩位，一小時' },
      { speaker: 'staff', target: 'ドリンクバーのプランでよろしいですか？', pronunciation: 'dorinku baa no puran de yoroshii desu ka', pronunciation_chunks: 'do·rin·ku baa no pu·ran de yo·ro·shii de·su ka', english: 'Is the drink bar plan okay?', chinese_tc: '飲料吧方案可以嗎？', note: 'Most karaoke requires a drink order. ドリンクバー = unlimited drinks, usually best value.' },
      { speaker: 'you', target: 'はい、それでお願いします', pronunciation: 'hai, sore de onegaishimasu', pronunciation_chunks: 'hai so·re de o·ne·gai·shi·ma·su', english: 'Yes, that\'s fine.', chinese_tc: '好的' },
      { speaker: 'staff', target: '305号室です。こちらへどうぞ', pronunciation: 'sanbyaku go gou-shitsu desu. kochira e douzo', pronunciation_chunks: 'san·bya·ku go gou·shi·tsu de·su ko·chi·ra e dou·zo', english: 'Room 305. This way please.', chinese_tc: '305號房。這邊請' },
      { speaker: 'you', target: '延長できますか？', pronunciation: 'enchou dekimasu ka', pronunciation_chunks: 'en·chou de·ki·ma·su ka', english: 'Can we extend?', chinese_tc: '可以延長嗎？' },
      { speaker: 'staff', target: 'はい、30分ごとに延長できます', pronunciation: 'hai, sanjuppun goto ni enchou dekimasu', pronunciation_chunks: 'hai san·jup·pun go·to ni en·chou de·ki·ma·su', english: 'Yes, you can extend in 30-minute blocks.', chinese_tc: '可以，每30分鐘延長一次' },
      { speaker: 'you', target: 'あと30分お願いします', pronunciation: 'ato sanjuppun onegaishimasu', pronunciation_chunks: 'a·to san·jup·pun o·ne·gai·shi·ma·su', english: '30 more minutes please.', chinese_tc: '再加30分鐘' },
    ],
  },

  // === SC37: ATM / Money ===
  {
    id: 'sc37', lang: 'ja', group: 'daily',
    title: 'Convenience Store ATM', titleTC: '便利店ATM',
    emoji: '🏧', description: 'Withdrawing money from a convenience store ATM',
    lines: [
      { speaker: 'you', target: 'ATMはどこですか？', pronunciation: 'ee-tii-emu wa doko desu ka', pronunciation_chunks: 'ee·tii·e·mu wa do·ko de·su ka', english: 'Where is the ATM?', chinese_tc: 'ATM在哪裡？' },
      { speaker: 'staff', target: '入口の横にあります', pronunciation: 'iriguchi no yoko ni arimasu', pronunciation_chunks: 'i·ri·gu·chi no yo·ko ni a·ri·ma·su', english: 'It\'s next to the entrance.', chinese_tc: '在入口旁邊' },
      { speaker: 'you', target: '海外のカードは使えますか？', pronunciation: 'kaigai no kaado wa tsukaemasu ka', pronunciation_chunks: 'kai·gai no kaa·do wa tsu·ka·e·ma·su ka', english: 'Can I use a foreign card?', chinese_tc: '外國的卡可以用嗎？', note: 'Seven Bank (7-Eleven) and Japan Post ATMs accept most foreign cards. Lawson/FamilyMart sometimes don\'t.' },
      { speaker: 'staff', target: 'セブン銀行のATMなら使えると思います', pronunciation: 'sebun ginkou no ATM nara tsukaeru to omoimasu', pronunciation_chunks: 'se·bun gin·kou no ee·tii·e·mu na·ra tsu·ka·e·ru to o·mo·i·ma·su', english: 'I think you can use the Seven Bank ATM.', chinese_tc: '7-11銀行的ATM應該可以用' },
      { speaker: 'you', target: '手数料はかかりますか？', pronunciation: 'tesuuryou wa kakarimasu ka', pronunciation_chunks: 'te·suu·ryou wa ka·ka·ri·ma·su ka', english: 'Is there a fee?', chinese_tc: '有手續費嗎？', note: '¥110-220 per transaction. Your home bank may also charge fees.' },
    ],
  },

  // === SC38: Vending Machine ===
  {
    id: 'sc38', lang: 'ja', group: 'daily',
    title: 'Vending Machine', titleTC: '自動販賣機',
    emoji: '🥤', description: 'Using Japan\'s famous vending machines',
    lines: [
      { speaker: 'you', target: 'この自動販売機、ICカードは使えますか？', pronunciation: 'kono jidou hanbaiki, ai-shii kaado wa tsukaemasu ka', pronunciation_chunks: 'ko·no ji·dou han·bai·ki ai·shii kaa·do wa tsu·ka·e·ma·su ka', english: 'Can I use an IC card on this vending machine?', chinese_tc: '這台自動販賣機可以用IC卡嗎？', note: 'Look for the IC card symbol. Tap your Suica/Manaca on the reader, then press your drink.' },
      { speaker: 'staff', target: 'はい、ここにタッチしてからボタンを押してください', pronunciation: 'hai, koko ni tacchi shite kara botan wo oshite kudasai', pronunciation_chunks: 'hai ko·ko ni tat·chi shi·te ka·ra bo·tan wo o·shi·te ku·da·sai', english: 'Yes, tap here first then press the button.', chinese_tc: '可以，先在這裡感應再按按鈕' },
      { speaker: 'you', target: 'ホットとコールド、どっちですか？', pronunciation: 'hotto to koorudo, dotchi desu ka', pronunciation_chunks: 'hot·to to koo·ru·do dot·chi de·su ka', english: 'Is it hot or cold?', chinese_tc: '是熱的還是冷的？', note: 'Red label = hot (あたたかい), Blue label = cold (つめたい). Winter machines have both!' },
    ],
  },

  // === SC39: Hotel — Borrowing Items & Services ===
  {
    id: 'sc39', lang: 'ja', group: 'hotel',
    title: 'Hotel Requests', titleTC: '飯店需求',
    emoji: '🛎️', description: 'Borrowing items, breakfast, late checkout, sending luggage',
    lines: [
      { speaker: 'you', target: '充電器を貸していただけますか？', pronunciation: 'juudenki wo kashite itadakemasu ka', pronunciation_chunks: 'juu·den·ki wo ka·shi·te i·ta·da·ke·ma·su ka', english: 'Could I borrow a charger?', chinese_tc: '可以借充電器嗎？', note: 'Hotels often lend: chargers, umbrellas (傘), adapters (変換プラグ), hair dryers (ドライヤー)' },
      { speaker: 'staff', target: 'はい、フロントにございます', pronunciation: 'hai, furonto ni gozaimasu', pronunciation_chunks: 'hai fu·ron·to ni go·zai·ma·su', english: 'Yes, we have them at the front desk.', chinese_tc: '有，在櫃台' },
      { speaker: 'you', target: '朝食は何時からですか？', pronunciation: 'choushoku wa nanji kara desu ka', pronunciation_chunks: 'chou·sho·ku wa nan·ji ka·ra de·su ka', english: 'What time does breakfast start?', chinese_tc: '早餐幾點開始？' },
      { speaker: 'staff', target: '7時から9時までです。2階のレストランです', pronunciation: 'shichiji kara kuji made desu. nikai no resutoran desu', pronunciation_chunks: 'shi·chi·ji ka·ra ku·ji ma·de de·su. ni·kai no re·su·to·ran de·su', english: 'From 7 to 9. It\'s the restaurant on the 2nd floor.', chinese_tc: '7點到9點。在2樓的餐廳' },
      { speaker: 'you', target: 'レイトチェックアウトはできますか？', pronunciation: 'reito chekkuauto wa dekimasu ka', pronunciation_chunks: 'rei·to chek·ku·au·to wa de·ki·ma·su ka', english: 'Can I have a late checkout?', chinese_tc: '可以延遲退房嗎？' },
      { speaker: 'staff', target: '12時まで延長可能です。追加料金は1000円です', pronunciation: 'juuniji made enchou kanou desu. tsuika ryoukin wa sen en desu', pronunciation_chunks: 'juu·ni·ji ma·de en·chou ka·nou de·su. tsui·ka ryou·kin wa sen en de·su', english: '12pm is possible. Extra charge is 1000 yen.', chinese_tc: '可以延到12點。追加費用1000日圓' },
      { speaker: 'you', target: '荷物を先に送りたいのですが', pronunciation: 'nimotsu wo saki ni okuritai no desu ga', pronunciation_chunks: 'ni·mo·tsu wo sa·ki ni o·ku·ri·tai no de·su ga', english: 'I\'d like to send my luggage ahead.', chinese_tc: '我想先把行李寄出去', note: 'Hotels can arrange 宅急便 (takkyubin) to send bags to your next hotel or the airport!' },
    ],
  },

  // === SC40: Shopping Returns ===
  {
    id: 'sc40', lang: 'ja', group: 'shopping',
    title: 'Returns & Exchange', titleTC: '退換貨',
    emoji: '🔄', description: 'Returning or exchanging an item at a store',
    lines: [
      { speaker: 'you', target: 'すみません、この商品を返品したいのですが', pronunciation: 'sumimasen, kono shouhin wo henpin shitai no desu ga', pronunciation_chunks: 'su·mi·ma·sen ko·no shou·hin wo hen·pin shi·tai no de·su ga', english: 'Excuse me, I\'d like to return this item.', chinese_tc: '不好意思，我想退這個商品' },
      { speaker: 'staff', target: 'レシートはお持ちですか？', pronunciation: 'reshiito wa omochi desu ka', pronunciation_chunks: 're·shii·to wa o·mo·chi de·su ka', english: 'Do you have the receipt?', chinese_tc: '有收據嗎？' },
      { speaker: 'you', target: 'はい、これです', pronunciation: 'hai, kore desu', pronunciation_chunks: 'hai ko·re de·su', english: 'Yes, here it is.', chinese_tc: '有，在這裡' },
      { speaker: 'you', target: 'サイズを交換したいです', pronunciation: 'saizu wo koukan shitai desu', pronunciation_chunks: 'sai·zu wo kou·kan shi·tai de·su', english: 'I\'d like to exchange the size.', chinese_tc: '我想換尺寸' },
      { speaker: 'staff', target: 'Mサイズでよろしいですか？', pronunciation: 'emu saizu de yoroshii desu ka', pronunciation_chunks: 'e·mu sai·zu de yo·ro·shii de·su ka', english: 'Is size M okay?', chinese_tc: 'M號可以嗎？' },
      { speaker: 'you', target: 'はい、それでお願いします', pronunciation: 'hai, sore de onegaishimasu', pronunciation_chunks: 'hai so·re de o·ne·gai·shi·ma·su', english: 'Yes, that\'s fine.', chinese_tc: '好的' },
    ],
  },

  // === SC41: Grocery / Market ===
  {
    id: 'sc41', lang: 'ja', group: 'daily',
    title: 'Grocery & Market', titleTC: '超市與市場',
    emoji: '🛒', description: 'Shopping at a supermarket or local market',
    lines: [
      { speaker: 'you', target: 'お刺身売り場はどこですか？', pronunciation: 'osashimi uriba wa doko desu ka', pronunciation_chunks: 'o·sa·shi·mi u·ri·ba wa do·ko de·su ka', english: 'Where is the sashimi section?', chinese_tc: '生魚片區在哪裡？' },
      { speaker: 'staff', target: '奥の冷蔵コーナーにあります', pronunciation: 'oku no reizou koonaa ni arimasu', pronunciation_chunks: 'o·ku no rei·zou koo·naa ni a·ri·ma·su', english: 'It\'s in the refrigerated corner at the back.', chinese_tc: '在後面的冷藏區' },
      { speaker: 'you', target: 'これは今日中に食べた方がいいですか？', pronunciation: 'kore wa kyouchuu ni tabeta hou ga ii desu ka', pronunciation_chunks: 'ko·re wa kyou·chuu ni ta·be·ta hou ga ii de·su ka', english: 'Should I eat this by today?', chinese_tc: '這個今天內吃完比較好嗎？', note: 'Check 消費期限 (shouhi kigen) = use by date. 賞味期限 (shoumi kigen) = best before (still OK after).' },
      { speaker: 'you', target: 'レジ袋はいりません', pronunciation: 'reji bukuro wa irimasen', pronunciation_chunks: 're·ji bu·ku·ro wa i·ri·ma·sen', english: 'I don\'t need a plastic bag.', chinese_tc: '不需要塑膠袋' },
      { speaker: 'staff', target: 'ポイントカードはお持ちですか？', pronunciation: 'pointo kaado wa omochi desu ka', pronunciation_chunks: 'poin·to kaa·do wa o·mo·chi de·su ka', english: 'Do you have a points card?', chinese_tc: '有集點卡嗎？', note: 'Say いいえ (no). Common at supermarkets and drugstores.' },
      { speaker: 'you', target: 'いいえ、ありません', pronunciation: 'iie, arimasen', pronunciation_chunks: 'ii·e a·ri·ma·sen', english: 'No, I don\'t.', chinese_tc: '沒有' },
    ],
  },

  // === SC42: Airport Customs ===
  {
    id: 'sc42', lang: 'ja', group: 'airport',
    title: 'Customs Declaration', titleTC: '海關申報',
    emoji: '🛃', description: 'Going through customs after immigration',
    lines: [
      { speaker: 'staff', target: '申告するものはありますか？', pronunciation: 'shinkoku suru mono wa arimasu ka', pronunciation_chunks: 'shin·ko·ku su·ru mo·no wa a·ri·ma·su ka', english: 'Do you have anything to declare?', chinese_tc: '有需要申報的東西嗎？' },
      { speaker: 'you', target: 'いいえ、ありません', pronunciation: 'iie, arimasen', pronunciation_chunks: 'ii·e a·ri·ma·sen', english: 'No, I don\'t.', chinese_tc: '沒有' },
      { speaker: 'staff', target: 'このバッグの中を見せていただけますか？', pronunciation: 'kono baggu no naka wo misete itadakemasu ka', pronunciation_chunks: 'ko·no bag·gu no na·ka wo mi·se·te i·ta·da·ke·ma·su ka', english: 'May I see inside this bag?', chinese_tc: '可以看一下這個包包裡面嗎？' },
      { speaker: 'you', target: 'はい、どうぞ', pronunciation: 'hai, douzo', pronunciation_chunks: 'hai dou·zo', english: 'Yes, go ahead.', chinese_tc: '好的，請' },
      { speaker: 'staff', target: 'これは何ですか？', pronunciation: 'kore wa nan desu ka', pronunciation_chunks: 'ko·re wa nan de·su ka', english: 'What is this?', chinese_tc: '這是什麼？' },
      { speaker: 'you', target: '個人用のお土産です', pronunciation: 'kojin-you no omiyage desu', pronunciation_chunks: 'ko·jin·you no o·mi·ya·ge de·su', english: 'It\'s personal souvenirs.', chinese_tc: '是個人用的伴手禮', note: 'Duty-free limit: ¥200,000 worth of goods. Alcohol: 3 bottles. Cigarettes: 200.' },
    ],
  },
];
