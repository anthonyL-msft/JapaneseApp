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
];
