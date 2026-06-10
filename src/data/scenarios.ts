export interface ConversationLine {
  speaker: 'staff' | 'you';
  japanese: string;
  hepburn: string;
  hepburn_chunks?: string;
  english: string;
  chinese_tc: string;
  note?: string;
}

export interface Scenario {
  id: string;
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
    title: 'Entering a Restaurant',
    titleTC: '進入餐廳',
    emoji: '🚪',
    description: 'Walking in, getting seated (2 people)',
    lines: [
      { speaker: 'staff', japanese: 'いらっしゃいませ！', hepburn: 'irasshaimase!', hepburn_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！', note: 'You\'ll hear this the moment you walk in. Just smile or nod.' },
      { speaker: 'staff', japanese: '何名様ですか？', hepburn: 'nanmei sama desu ka?', hepburn_chunks: 'nan·mei sa·ma de·su ka', english: 'How many people?', chinese_tc: '請問幾位？' },
      { speaker: 'you', japanese: '二名です', hepburn: 'nimei desu', hepburn_chunks: 'ni·mei de·su', english: 'Two people', chinese_tc: '兩位' },
      { speaker: 'staff', japanese: 'ご予約はございますか？', hepburn: 'go-yoyaku wa gozaimasu ka?', hepburn_chunks: 'go·yo·ya·ku wa go·zai·ma·su ka', english: 'Do you have a reservation?', chinese_tc: '請問有預約嗎？' },
      { speaker: 'you', japanese: '予約していません', hepburn: 'yoyaku shite imasen', hepburn_chunks: 'yo·ya·ku shi·te i·ma·sen', english: 'No reservation', chinese_tc: '沒有預約' },
      { speaker: 'staff', japanese: '少々お待ちください', hepburn: 'shoushou omachi kudasai', hepburn_chunks: 'shou·shou o·ma·chi ku·da·sai', english: 'Please wait a moment', chinese_tc: '請稍等', note: 'Wait patiently — they\'re preparing your table.' },
      { speaker: 'staff', japanese: 'お待たせしました。こちらへどうぞ', hepburn: 'omatase shimashita. kochira e douzo', hepburn_chunks: 'o·ma·ta·se shi·ma·shi·ta. ko·chi·ra e dou·zo', english: 'Sorry for the wait. This way please.', chinese_tc: '讓您久等了。這邊請' },
      { speaker: 'you', japanese: 'ありがとうございます', hepburn: 'arigatou gozaimasu', hepburn_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you', chinese_tc: '謝謝' },
    ],
  },
  {
    id: 'sc02',
    title: 'Entering with Reservation',
    titleTC: '有預約進入餐廳',
    emoji: '📋',
    description: 'You booked a table for 6pm',
    lines: [
      { speaker: 'staff', japanese: 'いらっしゃいませ！', hepburn: 'irasshaimase!', hepburn_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！' },
      { speaker: 'staff', japanese: '何名様ですか？', hepburn: 'nanmei sama desu ka?', hepburn_chunks: 'nan·mei sa·ma de·su ka', english: 'How many people?', chinese_tc: '請問幾位？' },
      { speaker: 'you', japanese: '6時に予約した○○です', hepburn: 'roku-ji ni yoyaku shita ○○ desu', hepburn_chunks: 'ro·ku·ji ni yo·ya·ku shi·ta ○○ de·su', english: 'I have a 6 o\'clock reservation, name is ○○', chinese_tc: '我預約了6點，姓○○', note: 'Replace ○○ with your name' },
      { speaker: 'staff', japanese: 'はい、確認いたしました。お席へご案内いたします', hepburn: 'hai, kakunin itashimashita. oseki e go-annai itashimasu', hepburn_chunks: 'hai, ka·ku·nin i·ta·shi·ma·shi·ta. o·se·ki e go·an·nai i·ta·shi·ma·su', english: 'Yes, confirmed. I\'ll show you to your seat.', chinese_tc: '好的，確認了。帶您到座位' },
      { speaker: 'you', japanese: 'よろしくお願いします', hepburn: 'yoroshiku onegaishimasu', hepburn_chunks: 'yo·ro·shi·ku o·ne·gai·shi·ma·su', english: 'Thank you / Please take care of us', chinese_tc: '麻煩你了' },
    ],
  },
  {
    id: 'sc03',
    title: 'Ordering Food',
    titleTC: '點餐',
    emoji: '📝',
    description: 'The waiter comes, you order for two',
    lines: [
      { speaker: 'staff', japanese: 'ご注文はお決まりでしょうか？', hepburn: 'go-chuumon wa okimari deshou ka?', hepburn_chunks: 'go·chuu·mon wa o·ki·ma·ri de·shou ka', english: 'Are you ready to order?', chinese_tc: '請問決定好了嗎？' },
      { speaker: 'you', japanese: 'はい。これを二つお願いします', hepburn: 'hai. kore wo futatsu onegaishimasu', hepburn_chunks: 'hai. ko·re wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Yes. Two of these please.', chinese_tc: '好的。這個請給我兩份', note: 'Point at the menu item' },
      { speaker: 'staff', japanese: 'お飲み物はいかがですか？', hepburn: 'onomimono wa ikaga desu ka?', hepburn_chunks: 'o·no·mi·mo·no wa i·ka·ga de·su ka', english: 'Would you like something to drink?', chinese_tc: '需要飲料嗎？' },
      { speaker: 'you', japanese: '生ビールを二つお願いします', hepburn: 'nama biiru wo futatsu onegaishimasu', hepburn_chunks: 'na·ma bii·ru wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two draft beers please', chinese_tc: '請給我兩杯生啤酒' },
      { speaker: 'staff', japanese: 'ご注文は以上でよろしいでしょうか？', hepburn: 'go-chuumon wa ijou de yoroshii deshou ka?', hepburn_chunks: 'go·chuu·mon wa i·jou de yo·ro·shii de·shou ka', english: 'Is that everything?', chinese_tc: '以上就是您的點餐了嗎？' },
      { speaker: 'you', japanese: 'はい、お願いします', hepburn: 'hai, onegaishimasu', hepburn_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes, please', chinese_tc: '好的，麻煩了' },
      { speaker: 'staff', japanese: '少々お待ちください', hepburn: 'shoushou omachi kudasai', hepburn_chunks: 'shou·shou o·ma·chi ku·da·sai', english: 'Please wait a moment', chinese_tc: '請稍等' },
    ],
  },
  {
    id: 'sc04',
    title: 'Paying the Bill',
    titleTC: '結帳',
    emoji: '💳',
    description: 'Asking for the check and paying',
    lines: [
      { speaker: 'you', japanese: 'すみません、お会計お願いします', hepburn: 'sumimasen, okaikei onegaishimasu', hepburn_chunks: 'su·mi·ma·sen, o·kai·kei o·ne·gai·shi·ma·su', english: 'Excuse me, check please', chinese_tc: '不好意思，請結帳', note: 'Raise your hand to get attention' },
      { speaker: 'staff', japanese: 'はい、少々お待ちください', hepburn: 'hai, shoushou omachi kudasai', hepburn_chunks: 'hai, shou·shou o·ma·chi ku·da·sai', english: 'Yes, one moment please', chinese_tc: '好的，請稍等' },
      { speaker: 'staff', japanese: 'お会計は3,800円になります', hepburn: 'okaikei wa sanzen happyaku en ni narimasu', hepburn_chunks: 'o·kai·kei wa san·zen hap·pya·ku en ni na·ri·ma·su', english: 'The total is 3,800 yen', chinese_tc: '總共3,800日圓' },
      { speaker: 'you', japanese: 'クレジットカードは使えますか？', hepburn: 'kurejitto kaado wa tsukaemasu ka?', hepburn_chunks: 'ku·re·jit·to kaa·do wa tsu·ka·e·ma·su ka', english: 'Can I use a credit card?', chinese_tc: '可以用信用卡嗎？' },
      { speaker: 'staff', japanese: 'はい、大丈夫です', hepburn: 'hai, daijoubu desu', hepburn_chunks: 'hai, dai·jou·bu de·su', english: 'Yes, that\'s fine', chinese_tc: '可以的' },
      { speaker: 'you', japanese: 'ごちそうさまでした', hepburn: 'gochisousama deshita', hepburn_chunks: 'go·chi·sou·sa·ma de·shi·ta', english: 'Thank you for the meal', chinese_tc: '多謝款待', note: 'Always say this when leaving a restaurant!' },
      { speaker: 'staff', japanese: 'ありがとうございました！', hepburn: 'arigatou gozaimashita!', hepburn_chunks: 'a·ri·ga·tou go·zai·ma·shi·ta', english: 'Thank you very much!', chinese_tc: '非常感謝！' },
    ],
  },
  {
    id: 'sc05',
    title: 'Convenience Store',
    titleTC: '便利商店',
    emoji: '🏪',
    description: 'Buying at 7-Eleven, Lawson, or FamilyMart',
    lines: [
      { speaker: 'staff', japanese: 'いらっしゃいませ！', hepburn: 'irasshaimase!', hepburn_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！', note: 'Just nod and go shopping' },
      { speaker: 'staff', japanese: 'ポイントカードはお持ちですか？', hepburn: 'pointo kaado wa omochi desu ka?', hepburn_chunks: 'poi·n·to kaa·do wa o·mo·chi de·su ka', english: 'Do you have a point card?', chinese_tc: '有集點卡嗎？' },
      { speaker: 'you', japanese: '持っていません', hepburn: 'motte imasen', hepburn_chunks: 'mot·te i·ma·sen', english: 'I don\'t have one', chinese_tc: '我沒有' },
      { speaker: 'staff', japanese: '温めますか？', hepburn: 'atatamemasu ka?', hepburn_chunks: 'a·ta·ta·me·ma·su ka', english: 'Shall I heat it up?', chinese_tc: '需要加熱嗎？', note: 'For bento or onigiri' },
      { speaker: 'you', japanese: 'はい、お願いします', hepburn: 'hai, onegaishimasu', hepburn_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes, please', chinese_tc: '好的，麻煩了' },
      { speaker: 'staff', japanese: '袋はご利用ですか？', hepburn: 'fukuro wa goriyou desu ka?', hepburn_chunks: 'fu·ku·ro wa go·ri·you de·su ka', english: 'Would you like a bag?', chinese_tc: '需要袋子嗎？' },
      { speaker: 'you', japanese: '大丈夫です', hepburn: 'daijoubu desu', hepburn_chunks: 'dai·jou·bu de·su', english: 'No thanks', chinese_tc: '不用了' },
      { speaker: 'staff', japanese: '370円になります', hepburn: 'sanbyaku nanajuu en ni narimasu', hepburn_chunks: 'san·bya·ku na·na·juu en ni na·ri·ma·su', english: 'That\'ll be 370 yen', chinese_tc: '370日圓' },
      { speaker: 'you', japanese: 'Suicaで', hepburn: 'suika de', hepburn_chunks: 'sui·ka de', english: 'With Suica (IC card)', chinese_tc: '用Suica', note: 'Just tap your IC card on the reader' },
      { speaker: 'staff', japanese: 'ありがとうございました！', hepburn: 'arigatou gozaimashita!', hepburn_chunks: 'a·ri·ga·tou go·zai·ma·shi·ta', english: 'Thank you!', chinese_tc: '謝謝！' },
    ],
  },
  {
    id: 'sc06',
    title: 'Hotel Check-in',
    titleTC: '飯店入住',
    emoji: '🏨',
    description: 'Arriving at hotel, checking in for 2',
    lines: [
      { speaker: 'you', japanese: 'チェックインお願いします', hepburn: 'chekkuin onegaishimasu', hepburn_chunks: 'chek·ku·in o·ne·gai·shi·ma·su', english: 'Check-in please', chinese_tc: '我要辦理入住' },
      { speaker: 'staff', japanese: 'ご予約のお名前をお願いします', hepburn: 'go-yoyaku no onamae wo onegaishimasu', hepburn_chunks: 'go·yo·ya·ku no o·na·ma·e wo o·ne·gai·shi·ma·su', english: 'Your reservation name please', chinese_tc: '請問預約的姓名' },
      { speaker: 'you', japanese: '予約した○○です。二泊です', hepburn: 'yoyaku shita ○○ desu. nihaku desu', hepburn_chunks: 'yo·ya·ku shi·ta ○○ de·su. ni·ha·ku de·su', english: 'Reservation under ○○. Two nights.', chinese_tc: '我有預約，姓○○。住兩晚', note: 'Show your booking confirmation on your phone' },
      { speaker: 'staff', japanese: 'はい、確認できました。パスポートをお願いします', hepburn: 'hai, kakunin dekimashita. pasupooto wo onegaishimasu', hepburn_chunks: 'hai, ka·ku·nin de·ki·ma·shi·ta. pa·su·poo·to wo o·ne·gai·shi·ma·su', english: 'Confirmed. Passport please.', chinese_tc: '確認了。請出示護照' },
      { speaker: 'you', japanese: 'はい、どうぞ', hepburn: 'hai, douzo', hepburn_chunks: 'hai, dou·zo', english: 'Here you go', chinese_tc: '好的，這裡' },
      { speaker: 'staff', japanese: 'お部屋は8階の805号室です。朝食は7時から9時までです', hepburn: 'oheya wa hakkai no happyaku go goushitsu desu. choushoku wa shichi-ji kara ku-ji made desu', hepburn_chunks: 'o·he·ya wa hak·kai no 805·gou·shi·tsu de·su. chou·sho·ku wa 7·ji ka·ra 9·ji ma·de de·su', english: 'Your room is 805 on the 8th floor. Breakfast is 7-9am.', chinese_tc: '您的房間是8樓805號房。早餐是7點到9點' },
      { speaker: 'you', japanese: 'Wi-Fiのパスワードは何ですか？', hepburn: 'waifai no pasuwaado wa nan desu ka?', hepburn_chunks: 'wai·fai no pa·su·waa·do wa nan de·su ka', english: 'What\'s the Wi-Fi password?', chinese_tc: 'Wi-Fi密碼是什麼？' },
      { speaker: 'staff', japanese: 'こちらに書いてあります', hepburn: 'kochira ni kaite arimasu', hepburn_chunks: 'ko·chi·ra ni kai·te a·ri·ma·su', english: 'It\'s written here', chinese_tc: '寫在這裡' },
      { speaker: 'you', japanese: 'ありがとうございます', hepburn: 'arigatou gozaimasu', hepburn_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you', chinese_tc: '謝謝' },
    ],
  },
  {
    id: 'sc07',
    title: 'Taking a Taxi',
    titleTC: '搭計程車',
    emoji: '🚕',
    description: 'Telling driver your destination',
    lines: [
      { speaker: 'you', japanese: 'すみません、この住所までお願いします', hepburn: 'sumimasen, kono juusho made onegaishimasu', hepburn_chunks: 'su·mi·ma·sen, ko·no juu·sho ma·de o·ne·gai·shi·ma·su', english: 'Excuse me, to this address please', chinese_tc: '不好意思，請到這個地址', note: 'Show address on phone — the door opens automatically!' },
      { speaker: 'staff', japanese: 'はい、わかりました', hepburn: 'hai, wakarimashita', hepburn_chunks: 'hai, wa·ka·ri·ma·shi·ta', english: 'Yes, understood', chinese_tc: '好的，明白了' },
      { speaker: 'you', japanese: 'だいたい何分くらいですか？', hepburn: 'daitai nanpun kurai desu ka?', hepburn_chunks: 'dai·tai nan·pun ku·rai de·su ka', english: 'About how many minutes?', chinese_tc: '大概幾分鐘？' },
      { speaker: 'staff', japanese: '15分くらいですね', hepburn: 'juugo fun kurai desu ne', hepburn_chunks: 'juu·go fun ku·rai de·su ne', english: 'About 15 minutes', chinese_tc: '大概15分鐘' },
      { speaker: 'you', japanese: 'ここで降ります。ありがとうございます', hepburn: 'koko de orimasu. arigatou gozaimasu', hepburn_chunks: 'ko·ko de o·ri·ma·su. a·ri·ga·tou go·zai·ma·su', english: 'I\'ll get off here. Thank you.', chinese_tc: '我在這裡下車。謝謝', note: 'Don\'t touch the door — it opens automatically' },
      { speaker: 'staff', japanese: '1,240円になります', hepburn: 'sen nihyaku yonjuu en ni narimasu', hepburn_chunks: 'sen ni·hya·ku yon·juu en ni na·ri·ma·su', english: 'That\'ll be 1,240 yen', chinese_tc: '1,240日圓' },
      { speaker: 'you', japanese: 'Suicaで払えますか？', hepburn: 'suika de haraemasu ka?', hepburn_chunks: 'sui·ka de ha·ra·e·ma·su ka', english: 'Can I pay with Suica?', chinese_tc: '可以用Suica付嗎？' },
    ],
  },
  {
    id: 'sc08',
    title: 'Buying Train Tickets',
    titleTC: '買車票',
    emoji: '🚃',
    description: 'At the ticket counter for Shinkansen',
    lines: [
      { speaker: 'you', japanese: 'すみません、京都までの新幹線の切符を二枚お願いします', hepburn: 'sumimasen, kyouto made no shinkansen no kippu wo nimai onegaishimasu', hepburn_chunks: 'su·mi·ma·sen, kyou·to ma·de no shin·kan·sen no kip·pu wo ni·mai o·ne·gai·shi·ma·su', english: 'Two Shinkansen tickets to Kyoto please', chinese_tc: '請給我兩張到京都的新幹線車票' },
      { speaker: 'staff', japanese: '指定席ですか、自由席ですか？', hepburn: 'shiteiseki desu ka, jiyuuseki desu ka?', hepburn_chunks: 'shi·tei·se·ki de·su ka, ji·yuu·se·ki de·su ka', english: 'Reserved or non-reserved seat?', chinese_tc: '對號座還是自由座？' },
      { speaker: 'you', japanese: '指定席をお願いします', hepburn: 'shiteiseki wo onegaishimasu', hepburn_chunks: 'shi·tei·se·ki wo o·ne·gai·shi·ma·su', english: 'Reserved seats please', chinese_tc: '請給我對號座' },
      { speaker: 'staff', japanese: '何時ごろのご希望ですか？', hepburn: 'nanji goro no go-kibou desu ka?', hepburn_chunks: 'nan·ji go·ro no go·ki·bou de·su ka', english: 'Around what time would you like?', chinese_tc: '您希望大約幾點的？' },
      { speaker: 'you', japanese: '午前10時ごろでお願いします', hepburn: 'gozen juuji goro de onegaishimasu', hepburn_chunks: 'go·zen juu·ji go·ro de o·ne·gai·shi·ma·su', english: 'Around 10am please', chinese_tc: '請給我上午10點左右的' },
      { speaker: 'staff', japanese: '10時10分ののぞみ号がございます。隣同士のお席でよろしいですか？', hepburn: 'juuji juppun no nozomi-gou ga gozaimasu. tonari doushi no oseki de yoroshii desu ka?', hepburn_chunks: 'juu·ji jup·pun no no·zo·mi·gou ga go·zai·ma·su. to·na·ri dou·shi no o·se·ki de yo·ro·shii de·su ka', english: 'There\'s a Nozomi at 10:10. Seats next to each other OK?', chinese_tc: '有10點10分的希望號。相鄰座位可以嗎？' },
      { speaker: 'you', japanese: 'はい、それでお願いします', hepburn: 'hai, sore de onegaishimasu', hepburn_chunks: 'hai, so·re de o·ne·gai·shi·ma·su', english: 'Yes, that\'s fine', chinese_tc: '好的，就那個' },
    ],
  },
  {
    id: 'sc09',
    title: 'Asking for Directions',
    titleTC: '問路',
    emoji: '🗺️',
    description: 'You\'re lost, asking a local',
    lines: [
      { speaker: 'you', japanese: 'すみません、ちょっとお聞きしたいのですが', hepburn: 'sumimasen, chotto okiki shitai no desu ga', hepburn_chunks: 'su·mi·ma·sen, chot·to o·ki·ki shi·tai no de·su ga', english: 'Excuse me, may I ask you something?', chinese_tc: '不好意思，想請問一下', note: 'Polite way to approach a stranger' },
      { speaker: 'you', japanese: '○○駅はどこですか？', hepburn: '○○ eki wa doko desu ka?', hepburn_chunks: '○○ e·ki wa do·ko de·su ka', english: 'Where is ○○ station?', chinese_tc: '○○站在哪裡？' },
      { speaker: 'staff', japanese: 'あそこの信号を右に曲がってください', hepburn: 'asoko no shingou wo migi ni magatte kudasai', hepburn_chunks: 'a·so·ko no shin·gou wo mi·gi ni ma·gat·te ku·da·sai', english: 'Turn right at that traffic light over there', chinese_tc: '在那邊的紅綠燈右轉' },
      { speaker: 'staff', japanese: 'まっすぐ行くと、左側にあります', hepburn: 'massugu iku to, hidarigawa ni arimasu', hepburn_chunks: 'mas·su·gu i·ku to, hi·da·ri·ga·wa ni a·ri·ma·su', english: 'Go straight and it\'ll be on the left', chinese_tc: '直走的話，在左邊' },
      { speaker: 'you', japanese: '歩いて何分くらいですか？', hepburn: 'aruite nanpun kurai desu ka?', hepburn_chunks: 'a·ru·i·te nan·pun ku·rai de·su ka', english: 'About how many minutes on foot?', chinese_tc: '走路大概幾分鐘？' },
      { speaker: 'staff', japanese: '5分くらいですよ', hepburn: 'gofun kurai desu yo', hepburn_chunks: 'go·fun ku·rai de·su yo', english: 'About 5 minutes', chinese_tc: '大概5分鐘' },
      { speaker: 'you', japanese: 'ありがとうございます！助かりました', hepburn: 'arigatou gozaimasu! tasukarimashita', hepburn_chunks: 'a·ri·ga·tou go·zai·ma·su! ta·su·ka·ri·ma·shi·ta', english: 'Thank you! That\'s a big help.', chinese_tc: '謝謝！幫了大忙' },
    ],
  },
  {
    id: 'sc10',
    title: 'Shopping — Tax Free',
    titleTC: '免稅購物',
    emoji: '🛍️',
    description: 'Buying souvenirs with tax-free',
    lines: [
      { speaker: 'you', japanese: 'すみません、これはいくらですか？', hepburn: 'sumimasen, kore wa ikura desu ka?', hepburn_chunks: 'su·mi·ma·sen, ko·re wa i·ku·ra de·su ka', english: 'Excuse me, how much is this?', chinese_tc: '不好意思，這個多少錢？' },
      { speaker: 'staff', japanese: '2,200円です', hepburn: 'nisen nihyaku en desu', hepburn_chunks: 'ni·sen ni·hya·ku en de·su', english: 'It\'s 2,200 yen', chinese_tc: '2,200日圓' },
      { speaker: 'you', japanese: 'これを二つください', hepburn: 'kore wo futatsu kudasai', hepburn_chunks: 'ko·re wo fu·ta·tsu ku·da·sai', english: 'Two of these please', chinese_tc: '請給我兩個' },
      { speaker: 'you', japanese: '免税になりますか？', hepburn: 'menzei ni narimasu ka?', hepburn_chunks: 'men·zei ni na·ri·ma·su ka', english: 'Is tax-free available?', chinese_tc: '可以免稅嗎？' },
      { speaker: 'staff', japanese: 'はい、5,000円以上で免税になります。パスポートをお願いします', hepburn: 'hai, gosen en ijou de menzei ni narimasu. pasupooto wo onegaishimasu', hepburn_chunks: 'hai, go·sen en i·jou de men·zei ni na·ri·ma·su. pa·su·poo·to wo o·ne·gai·shi·ma·su', english: 'Yes, tax-free for purchases over 5,000 yen. Passport please.', chinese_tc: '是的，超過5,000日圓可以免稅。請出示護照' },
      { speaker: 'you', japanese: 'はい、どうぞ。包装もお願いします', hepburn: 'hai, douzo. housou mo onegaishimasu', hepburn_chunks: 'hai, dou·zo. hou·sou mo o·ne·gai·shi·ma·su', english: 'Here you go. Gift wrapping too please.', chinese_tc: '好的。也請幫我包裝', note: 'Japanese shops do beautiful gift wrapping!' },
      { speaker: 'staff', japanese: 'かしこまりました', hepburn: 'kashikomarimashita', hepburn_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta', english: 'Certainly (very polite)', chinese_tc: '好的（非常禮貌）', note: 'Very formal "understood" — you\'ll hear this at nice shops' },
    ],
  },
  {
    id: 'sc11',
    title: 'Ramen Shop',
    titleTC: '拉麵店',
    emoji: '🍜',
    description: 'Ordering at a ramen counter (often ticket machine)',
    lines: [
      { speaker: 'staff', japanese: 'いらっしゃいませ！食券をお願いします', hepburn: 'irasshaimase! shokken wo onegaishimasu', hepburn_chunks: 'i·ras·shai·ma·se! shok·ken wo o·ne·gai·shi·ma·su', english: 'Welcome! Meal tickets please.', chinese_tc: '歡迎光臨！請出示餐券', note: 'Many ramen shops use ticket machines at the entrance. Buy ticket first!' },
      { speaker: 'you', japanese: '（食券を渡す）', hepburn: '(shokken wo watasu)', english: '(hand over meal tickets)', chinese_tc: '（遞出餐券）', note: 'Buy 2 tickets from the machine and hand them to the staff' },
      { speaker: 'staff', japanese: '麺の硬さはどうしますか？', hepburn: 'men no katasa wa dou shimasu ka?', hepburn_chunks: 'men no ka·ta·sa wa dou shi·ma·su ka', english: 'How firm would you like the noodles?', chinese_tc: '麵的硬度要怎樣？', note: 'Options: 硬め (katame/firm), 普通 (futsuu/normal), やわらかめ (yawarakame/soft)' },
      { speaker: 'you', japanese: '普通でお願いします', hepburn: 'futsuu de onegaishimasu', hepburn_chunks: 'fu·tsuu de o·ne·gai·shi·ma·su', english: 'Normal please', chinese_tc: '普通的就好' },
      { speaker: 'staff', japanese: 'にんにくは入れますか？', hepburn: 'ninniku wa iremasu ka?', hepburn_chunks: 'nin·ni·ku wa i·re·ma·su ka', english: 'Would you like garlic?', chinese_tc: '要加蒜頭嗎？' },
      { speaker: 'you', japanese: 'はい、お願いします', hepburn: 'hai, onegaishimasu', hepburn_chunks: 'hai, o·ne·gai·shi·ma·su', english: 'Yes please', chinese_tc: '好的，麻煩了' },
      { speaker: 'staff', japanese: 'お待たせしました、どうぞ', hepburn: 'omatase shimashita, douzo', hepburn_chunks: 'o·ma·ta·se shi·ma·shi·ta, dou·zo', english: 'Sorry for the wait, here you go', chinese_tc: '讓您久等了，請用' },
      { speaker: 'you', japanese: 'いただきます！', hepburn: 'itadakimasu!', hepburn_chunks: 'i·ta·da·ki·ma·su', english: 'Let\'s eat! (before eating)', chinese_tc: '我開動了！' },
      { speaker: 'you', japanese: 'ごちそうさまでした', hepburn: 'gochisousama deshita', hepburn_chunks: 'go·chi·sou·sa·ma de·shi·ta', english: 'Thank you for the meal', chinese_tc: '多謝款待', note: 'Say this when leaving' },
    ],
  },
];
