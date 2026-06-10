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

export interface Scenario {
  id: string;
  lang: string;
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
    title: 'Entering a Restaurant',
    titleTC: '進入餐廳',
    emoji: '🚪',
    description: 'Walking in, getting seated (2 people)',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！', pronunciation: 'irasshaimase!', pronunciation_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！', note: 'You\'ll hear this the moment you walk in. Just smile or nod.' },
      { speaker: 'staff', target: '何名様ですか？', pronunciation: 'nanmei sama desu ka?', pronunciation_chunks: 'nan·mei sa·ma de·su ka', english: 'How many people?', chinese_tc: '請問幾位？' },
      { speaker: 'you', target: '二名です', pronunciation: 'nimei desu', pronunciation_chunks: 'ni·mei de·su', english: 'Two people', chinese_tc: '兩位' },
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
    title: 'Izakaya (Japanese Pub)',
    titleTC: '居酒屋',
    emoji: '🍶',
    description: 'Ordering drinks and sharing plates for 2',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！何名様ですか？', pronunciation: 'irasshaimase! nanmei sama desu ka?', pronunciation_chunks: 'i·ras·shai·ma·se! nan·mei sa·ma de·su ka', english: 'Welcome! How many?', chinese_tc: '歡迎光臨！幾位？' },
      { speaker: 'you', target: '二名です', pronunciation: 'nimei desu', pronunciation_chunks: 'ni·mei de·su', english: 'Two people', chinese_tc: '兩位' },
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
];
