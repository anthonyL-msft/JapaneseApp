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
  options: { value: string; pronunciation: string; english: string; chinese_tc?: string }[];
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

export type ScenarioGroup = 'airport' | 'train' | 'transit' | 'hotel' | 'stays' | 'restaurant' | 'foodspots' | 'shopping' | 'daily' | 'activities' | 'trouble';

export const SCENARIO_GROUPS: Record<ScenarioGroup, { label: string; emoji: string }> = {
  airport:    { label: 'Airport', emoji: '🛬' },
  train:      { label: 'Train', emoji: '🚆' },
  transit:    { label: 'Bus & Taxi', emoji: '🚕' },
  hotel:      { label: 'Hotel', emoji: '🏨' },
  stays:      { label: 'Ryokan & Local Stay', emoji: '🛖' },
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
  // === SC30: Airport Arrival ===
  // ============================================================
  // RESTAURANT — Full flow
  // ============================================================
  // === SC30: Airport Arrival ===
  {
    id: 'sc30', lang: 'ja', group: 'airport',
    title: 'Passport & Immigration', titleTC: '機場入境',
    emoji: '🛬', description: 'Immigration, customs, and finding transport to the city',
    lines: [
      { speaker: 'staff', target: 'パスポートをお見せください', pronunciation: 'pasupooto wo omise kudasai', pronunciation_chunks: 'pa·su·poo·to wo o·mi·se ku·da·sai', english: 'Please show your passport.', chinese_tc: '請出示護照' },
      { speaker: 'you', target: 'はい、どうぞ', pronunciation: 'hai, douzo', pronunciation_chunks: 'hai dou·zo', english: 'Here you go.', chinese_tc: '好的，請' },
      { speaker: 'staff', target: '滞在の目的は何ですか？', pronunciation: 'taizai no mokuteki wa nan desu ka', pronunciation_chunks: 'tai·zai no mo·ku·te·ki wa nan de·su ka', english: 'What is the purpose of your stay?', chinese_tc: '您的停留目的是什麼？' },
      { speaker: 'you', target: '観光です', pronunciation: 'kankou desu', pronunciation_chunks: 'kan·kou de·su', english: 'Sightseeing / Tourism.', chinese_tc: '觀光', note: 'Simple and clear. No need to elaborate.', options: [
        { target: '観光です', pronunciation: 'kankou desu', pronunciation_chunks: 'kan·kou de·su', english: 'Sightseeing / Tourism', chinese_tc: '觀光' },
        { target: '仕事です', pronunciation: 'shigoto desu', pronunciation_chunks: 'shi·go·to de·su', english: 'Business', chinese_tc: '工作' },
        { target: '友人に会いに来ました', pronunciation: 'yuujin ni ai ni kimashita', pronunciation_chunks: 'yuu·jin ni ai ni ki·ma·shi·ta', english: 'Visiting a friend', chinese_tc: '來拜訪朋友' },
      ] },
      { speaker: 'staff', target: '何日間の滞在ですか？', pronunciation: 'nannichikan no taizai desu ka', pronunciation_chunks: 'nan·ni·chi·kan no tai·zai de·su ka', english: 'How many days will you stay?', chinese_tc: '停留幾天？' },
      { speaker: 'you', target: '一週間です', pronunciation: 'isshuukan desu', pronunciation_chunks: 'is·shuu·kan de·su', english: 'One week.', chinese_tc: '一個星期', variables: [
        { placeholder: '一週間', label: 'Duration', options: [
          { value: '一週間', pronunciation: 'is·shuu·kan', english: 'One week', chinese_tc: '一個星期' },
          { value: '三日間', pronunciation: 'mik·ka·kan', english: 'Three days', chinese_tc: '三天' },
          { value: '五日間', pronunciation: 'it·su·ka·kan', english: 'Five days', chinese_tc: '五天' },
          { value: '十日間', pronunciation: 'too·ka·kan', english: 'Ten days', chinese_tc: '十天' },
          { value: '二週間', pronunciation: 'ni·shuu·kan', english: 'Two weeks', chinese_tc: '兩個星期' },
        ] },
      ] },
      { speaker: 'you', target: '荷物の受取所はどこですか？', pronunciation: 'nimotsu no uketori-jo wa doko desu ka', pronunciation_chunks: 'ni·mo·tsu no u·ke·to·ri·jo wa do·ko de·su ka', english: 'Where is the baggage claim?', chinese_tc: '行李提取處在哪裡？' },
      { speaker: 'you', target: '名古屋市内への電車はどこですか？', pronunciation: 'nagoya shinai e no densha wa doko desu ka', pronunciation_chunks: 'na·go·ya shi·nai e no den·sha wa do·ko de·su ka', english: 'Where is the train to Nagoya city?', chinese_tc: '去名古屋市區的電車在哪裡？', note: 'From Chubu Airport: take Meitetsu μ-SKY to Nagoya Station (~28 min)' },
    ],
  },
  // === SC42: Airport Customs ===
  {
    id: 'sc42', lang: 'ja', group: 'airport',
    title: '"Anything to Declare?"', titleTC: '海關申報',
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
  // === SC29: IC Card Purchase ===
  {
    id: 'sc29', lang: 'ja', group: 'airport',
    title: 'IC Card at the Machine', titleTC: '購買IC卡',
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
  {
    id: 'sc47', lang: 'ja', group: 'airport',
    title: 'Centrair to Nagoya by Meitetsu', titleTC: '中部國際機場到名古屋',
    emoji: '🚈', description: 'Buying Meitetsu tickets and choosing between μSKY and an ordinary limited express car',
    lines: [
      { speaker: 'you', target: 'すみません、名古屋まで二枚お願いします', pronunciation: 'sumimasen, nagoya made nimai onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen na·go·ya ma·de ni·mai o·ne·gai·shi·ma·su', english: 'Excuse me, two tickets to Nagoya please.', chinese_tc: '不好意思，請給我兩張到名古屋的車票', variables: [
        { placeholder: '名古屋', label: 'Destination', options: [
          { value: '名古屋', pronunciation: 'na·go·ya', english: 'Nagoya', chinese_tc: '名古屋' },
          { value: '金山', pronunciation: 'ka·na·ya·ma', english: 'Kanayama', chinese_tc: '金山' },
        ] },
      ] },
      { speaker: 'staff', target: 'ミュースカイと特急があります。どちらになさいますか？', pronunciation: 'myuu sukai to tokkyuu ga arimasu. dochira ni nasaimasu ka', pronunciation_chunks: 'myuu su·kai to tok·kyuu ga a·ri·ma·su do·chi·ra ni na·sai·ma·su ka', english: 'There is the μSKY and the limited express. Which would you like?', chinese_tc: '有μ-SKY和特急。您要搭哪一種？' },
      { speaker: 'you', target: 'ミュースカイでお願いします', pronunciation: 'myuu sukai de onegaishimasu', pronunciation_chunks: 'myuu su·kai de o·ne·gai·shi·ma·su', english: 'The μSKY please.', chinese_tc: '請給我μ-SKY', options: [
        { target: 'ミュースカイでお願いします', pronunciation: 'myuu sukai de onegaishimasu', pronunciation_chunks: 'myuu su·kai de o·ne·gai·shi·ma·su', english: 'The μSKY please', chinese_tc: '請給我μ-SKY' },
        { target: '特急の一般車でお願いします', pronunciation: 'tokkyuu no ippansha de onegaishimasu', pronunciation_chunks: 'tok·kyuu no ip·pan·sha de o·ne·gai·shi·ma·su', english: 'An ordinary car on the limited express please', chinese_tc: '請給我特急的一般車廂' },
      ] },
      { speaker: 'staff', target: 'ミュースカイは全車特別車です。乗車券のほかにミューチケットが必要です', pronunciation: 'myuu sukai wa zensha tokubetsusha desu. joushaken no hoka ni myuu chiketto ga hitsuyou desu', pronunciation_chunks: 'myuu su·kai wa zen·sha to·ku·be·tsu·sha de·su jou·sha·ken no ho·ka ni myuu chi·ket·to ga hi·tsu·you de·su', english: 'All μSKY cars are first class. You need a μticket in addition to the regular ticket.', chinese_tc: 'μ-SKY全車都是特別車。除乘車券外，還需要μ車票', note: 'For an ordinary car on a regular limited express, only the regular ticket is required.' },
      { speaker: 'you', target: '二人並んで座れますか？', pronunciation: 'futari narande suwaremasu ka', pronunciation_chunks: 'fu·ta·ri na·ran·de su·wa·re·ma·su ka', english: 'Can the two of us sit together?', chinese_tc: '我們兩個可以坐在一起嗎？' },
      { speaker: 'staff', target: '空席をお調べします', pronunciation: 'kuuseki wo oshirabe shimasu', pronunciation_chunks: 'kuu·se·ki wo o·shi·ra·be shi·ma·su', english: 'I will check the available seats.', chinese_tc: '我幫您查詢空位' },
      { speaker: 'you', target: '何番ホームから出ますか？', pronunciation: 'nanban hoomu kara demasu ka', pronunciation_chunks: 'nan·ban hoo·mu ka·ra de·ma·su ka', english: 'Which platform does it leave from?', chinese_tc: '從幾號月台出發？' },
      { speaker: 'staff', target: 'ミュースカイは一番ホームです。案内表示もご確認ください', pronunciation: 'myuu sukai wa ichiban hoomu desu. annai hyouji mo gokakunin kudasai', pronunciation_chunks: 'myuu su·kai wa i·chi·ban hoo·mu de·su an·nai hyou·ji mo go·ka·ku·nin ku·da·sai', english: 'The μSKY leaves from platform 1. Please also check the departure display.', chinese_tc: 'μ-SKY從1號月台出發。也請確認資訊顯示板' },
      { speaker: 'you', target: '名鉄名古屋駅までどのくらいかかりますか？', pronunciation: 'meitetsu nagoya eki made dono kurai kakarimasu ka', pronunciation_chunks: 'mei·te·tsu na·go·ya e·ki ma·de do·no ku·rai ka·ka·ri·ma·su ka', english: 'About how long does it take to Meitetsu Nagoya Station?', chinese_tc: '到名鐵名古屋站大概要多久？' },
      { speaker: 'staff', target: '三十分くらいです', pronunciation: 'sanjuppun kurai desu', pronunciation_chunks: 'san·jup·pun ku·rai de·su', english: 'About 30 minutes.', chinese_tc: '大約30分鐘' },
    ],
  },
  {
    id: 'sc52', lang: 'ja', group: 'airport',
    title: 'Departing from Narita', titleTC: '從成田機場出發',
    emoji: '🛫', description: 'Finding the airline counter, checking bags, and locating the lounge and gate',
    lines: [
      { speaker: 'you', target: 'すみません、日本航空のチェックインカウンターはどこですか？', pronunciation: 'sumimasen, nihon koukuu no chekkuin kauntaa wa doko desu ka', pronunciation_chunks: 'su·mi·ma·sen ni·hon kou·kuu no chek·ku·in kaun·taa wa do·ko de·su ka', english: 'Excuse me, where is the Japan Airlines check-in counter?', chinese_tc: '不好意思，日本航空的報到櫃台在哪裡？' },
      { speaker: 'staff', target: '第二ターミナルの出発ロビーです。案内表示をご確認ください', pronunciation: 'daini taaminaru no shuppatsu robii desu. annai hyouji wo gokakunin kudasai', pronunciation_chunks: 'dai·ni taa·mi·na·ru no shup·pa·tsu ro·bii de·su an·nai hyou·ji wo go·ka·ku·nin ku·da·sai', english: 'It is in the Terminal 2 departure lobby. Please check the information display.', chinese_tc: '在第二航廈的出境大廳。請確認資訊顯示板', note: 'Airline terminals can change, so confirm the terminal on your booking before travelling.' },
      { speaker: 'you', target: 'バンクーバー行きのJL18便にチェックインしたいです', pronunciation: 'bankuubaa iki no jei eru juuhachi bin ni chekkuin shitai desu', pronunciation_chunks: 'ban·kuu·baa i·ki no jei e·ru juu·ha·chi bin ni chek·ku·in shi·tai de·su', english: 'I would like to check in for JL18 to Vancouver.', chinese_tc: '我想辦理前往溫哥華的JL18航班報到' },
      { speaker: 'staff', target: 'パスポートをお願いします。お預けになる荷物はありますか？', pronunciation: 'pasupooto wo onegaishimasu. oazuke ni naru nimotsu wa arimasu ka', pronunciation_chunks: 'pa·su·poo·to wo o·ne·gai·shi·ma·su o·a·zu·ke ni na·ru ni·mo·tsu wa a·ri·ma·su ka', english: 'Your passport, please. Do you have any baggage to check?', chinese_tc: '請出示護照。有要托運的行李嗎？' },
      { speaker: 'you', target: '預け荷物は二つあります', pronunciation: 'azuke nimotsu wa futatsu arimasu', pronunciation_chunks: 'a·zu·ke ni·mo·tsu wa fu·ta·tsu a·ri·ma·su', english: 'I have two bags to check.', chinese_tc: '我有兩件托運行李', options: [
        { target: '預け荷物は一つあります', pronunciation: 'azuke nimotsu wa hitotsu arimasu', pronunciation_chunks: 'a·zu·ke ni·mo·tsu wa hi·to·tsu a·ri·ma·su', english: 'I have one bag to check', chinese_tc: '我有一件托運行李' },
        { target: '預け荷物は二つあります', pronunciation: 'azuke nimotsu wa futatsu arimasu', pronunciation_chunks: 'a·zu·ke ni·mo·tsu wa fu·ta·tsu a·ri·ma·su', english: 'I have two bags to check', chinese_tc: '我有兩件托運行李' },
        { target: '預け荷物はありません', pronunciation: 'azuke nimotsu wa arimasen', pronunciation_chunks: 'a·zu·ke ni·mo·tsu wa a·ri·ma·sen', english: 'I have no checked baggage', chinese_tc: '我沒有托運行李' },
      ] },
      { speaker: 'staff', target: 'お荷物の中に危険物や壊れやすい物は入っていませんか？', pronunciation: 'onimotsu no naka ni kikenbutsu ya kowareyasui mono wa haitte imasen ka', pronunciation_chunks: 'o·ni·mo·tsu no na·ka ni ki·ken·bu·tsu ya ko·wa·re·ya·sui mo·no wa hait·te i·ma·sen ka', english: 'Are there any dangerous or fragile items in your baggage?', chinese_tc: '您的行李中有危險品或易碎物品嗎？' },
      { speaker: 'you', target: 'いいえ、ありません', pronunciation: 'iie, arimasen', pronunciation_chunks: 'ii·e a·ri·ma·sen', english: 'No, there are not.', chinese_tc: '沒有' },
      { speaker: 'you', target: 'ラウンジは保安検査の後にありますか？', pronunciation: 'raunji wa hoan kensa no ato ni arimasu ka', pronunciation_chunks: 'raun·ji wa ho·an ken·sa no a·to ni a·ri·ma·su ka', english: 'Is the lounge after security?', chinese_tc: '貴賓室在安檢後嗎？' },
      { speaker: 'staff', target: 'はい。場所は搭乗券の案内をご確認ください', pronunciation: 'hai. basho wa toujouken no annai wo gokakunin kudasai', pronunciation_chunks: 'hai ba·sho wa tou·jou·ken no an·nai wo go·ka·ku·nin ku·da·sai', english: 'Yes. Please check the directions on your boarding pass.', chinese_tc: '是的。位置請確認登機證上的指示' },
      { speaker: 'you', target: '搭乗口には何時までに行けばいいですか？', pronunciation: 'toujouguchi ni wa nanji made ni ikeba ii desu ka', pronunciation_chunks: 'tou·jou·gu·chi ni wa nan·ji ma·de ni i·ke·ba ii de·su ka', english: 'By what time should I be at the gate?', chinese_tc: '我最晚幾點要到登機門？' },
      { speaker: 'staff', target: '搭乗券に書かれた時刻までにお越しください', pronunciation: 'toujouken ni kakareta jikoku made ni okoshi kudasai', pronunciation_chunks: 'tou·jou·ken ni ka·ka·re·ta ji·ko·ku ma·de ni o·ko·shi ku·da·sai', english: 'Please arrive by the time printed on your boarding pass.', chinese_tc: '請在登機證上所寫的時間前到達' },
    ],
  },
  {
    id: 'sc08',
    lang: 'ja',
    group: 'train',
    title: 'Ticket Counter',
    titleTC: '買車票',
    emoji: '🚃',
    description: 'At the ticket counter for Shinkansen',
    lines: [
      { speaker: 'you', target: 'すみません、京都までの新幹線の切符を二枚お願いします', pronunciation: 'sumimasen, kyouto made no shinkansen no kippu wo nimai onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen, kyou·to ma·de no shin·kan·sen no kip·pu wo ni·mai o·ne·gai·shi·ma·su', english: 'Two Shinkansen tickets to Kyoto please', chinese_tc: '請給我兩張到京都的新幹線車票', variables: [
        { placeholder: '京都', label: 'Destination', options: [
          { value: '京都', pronunciation: 'kyou·to', english: 'Kyoto', chinese_tc: '京都' },
          { value: '大阪', pronunciation: 'oo·sa·ka', english: 'Osaka', chinese_tc: '大阪' },
          { value: '東京', pronunciation: 'tou·kyou', english: 'Tokyo', chinese_tc: '東京' },
          { value: '名古屋', pronunciation: 'na·go·ya', english: 'Nagoya', chinese_tc: '名古屋' },
          { value: '広島', pronunciation: 'hi·ro·shi·ma', english: 'Hiroshima', chinese_tc: '廣島' },
          { value: '新大阪', pronunciation: 'shin·oo·sa·ka', english: 'Shin-Osaka', chinese_tc: '新大阪' },
          { value: '博多', pronunciation: 'ha·ka·ta', english: 'Hakata (Fukuoka)', chinese_tc: '博多(福岡)' },
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
  // ============================================================
  // NAGOYA-TOKYO WINTER TRIP SCENARIOS
  // ============================================================

  {
    id: 'sc21',
    lang: 'ja',
    group: 'train',
    title: 'Booking Shinkansen',
    titleTC: '名古屋到東京新幹線',
    emoji: '🚅',
    description: 'Buying Nagoya→Tokyo Nozomi tickets at the counter',
    lines: [
      { speaker: 'you', target: 'すみません、名古屋から東京までの新幹線の切符を二枚お願いします', pronunciation: 'sumimasen, nagoya kara toukyou made no shinkansen no kippu wo nimai onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen, na·go·ya ka·ra tou·kyou ma·de no shin·kan·sen no kip·pu wo ni·mai o·ne·gai·shi·ma·su', english: 'Two Shinkansen tickets from Nagoya to Tokyo please', chinese_tc: '請給我兩張名古屋到東京的新幹線車票', variables: [
        { placeholder: '東京', label: 'Destination', options: [
          { value: '東京', pronunciation: 'tou·kyou', english: 'Tokyo', chinese_tc: '東京' },
          { value: '品川', pronunciation: 'shi·na·ga·wa', english: 'Shinagawa', chinese_tc: '品川' },
          { value: '新横浜', pronunciation: 'shin·yo·ko·ha·ma', english: 'Shin-Yokohama', chinese_tc: '新橫濱' },
          { value: '京都', pronunciation: 'kyou·to', english: 'Kyoto', chinese_tc: '京都' },
          { value: '新大阪', pronunciation: 'shin·oo·sa·ka', english: 'Shin-Osaka', chinese_tc: '新大阪' },
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
    id: 'sc48', lang: 'ja', group: 'train',
    title: 'Nagoya to Kanazawa via Tsuruga', titleTC: '名古屋到金澤轉乘',
    emoji: '🔄', description: 'Buying the current through journey and changing from Shirasagi to the Hokuriku Shinkansen',
    lines: [
      { speaker: 'you', target: 'すみません、名古屋から金沢まで二枚お願いします', pronunciation: 'sumimasen, nagoya kara kanazawa made nimai onegaishimasu', pronunciation_chunks: 'su·mi·ma·sen na·go·ya ka·ra ka·na·za·wa ma·de ni·mai o·ne·gai·shi·ma·su', english: 'Excuse me, two tickets from Nagoya to Kanazawa please.', chinese_tc: '不好意思，請給我兩張從名古屋到金澤的車票', variables: [
        { placeholder: '金沢', label: 'Destination', options: [
          { value: '金沢', pronunciation: 'ka·na·za·wa', english: 'Kanazawa', chinese_tc: '金澤' },
          { value: '福井', pronunciation: 'fu·kui', english: 'Fukui', chinese_tc: '福井' },
          { value: '富山', pronunciation: 'to·ya·ma', english: 'Toyama', chinese_tc: '富山' },
        ] },
      ] },
      { speaker: 'staff', target: '敦賀で北陸新幹線にお乗り換えです', pronunciation: 'tsuruga de hokuriku shinkansen ni onorikae desu', pronunciation_chunks: 'tsu·ru·ga de ho·ku·ri·ku shin·kan·sen ni o·no·ri·ka·e de·su', english: 'You will transfer to the Hokuriku Shinkansen at Tsuruga.', chinese_tc: '您需要在敦賀轉乘北陸新幹線', note: 'Since March 2024, Shirasagi terminates at Tsuruga. Travel to Kanazawa continues by Hokuriku Shinkansen.' },
      { speaker: 'you', target: 'しらさぎと北陸新幹線の指定席をお願いします', pronunciation: 'shirasagi to hokuriku shinkansen no shiteiseki wo onegaishimasu', pronunciation_chunks: 'shi·ra·sa·gi to ho·ku·ri·ku shin·kan·sen no shi·tei·se·ki wo o·ne·gai·shi·ma·su', english: 'Reserved seats on both the Shirasagi and Hokuriku Shinkansen please.', chinese_tc: '請給我白鷺號和北陸新幹線的指定席', options: [
        { target: 'しらさぎと北陸新幹線の指定席をお願いします', pronunciation: 'shirasagi to hokuriku shinkansen no shiteiseki wo onegaishimasu', pronunciation_chunks: 'shi·ra·sa·gi to ho·ku·ri·ku shin·kan·sen no shi·tei·se·ki wo o·ne·gai·shi·ma·su', english: 'Reserved seats on both trains please', chinese_tc: '兩段都要指定席' },
        { target: '窓側の席をお願いします', pronunciation: 'madogawa no seki wo onegaishimasu', pronunciation_chunks: 'ma·do·ga·wa no se·ki wo o·ne·gai·shi·ma·su', english: 'Window seats please', chinese_tc: '請給我靠窗座位' },
        { target: '通路側の席をお願いします', pronunciation: 'tsuurogawa no seki wo onegaishimasu', pronunciation_chunks: 'tsuu·ro·ga·wa no se·ki wo o·ne·gai·shi·ma·su', english: 'Aisle seats please', chinese_tc: '請給我靠走道座位' },
      ] },
      { speaker: 'you', target: '敦賀での乗り換え時間はどのくらいですか？', pronunciation: 'tsuruga de no norikae jikan wa dono kurai desu ka', pronunciation_chunks: 'tsu·ru·ga de no no·ri·ka·e ji·kan wa do·no ku·rai de·su ka', english: 'How much transfer time is there at Tsuruga?', chinese_tc: '在敦賀有多少轉車時間？' },
      { speaker: 'staff', target: '接続時間をお調べします。到着後は新幹線乗換口へお進みください', pronunciation: 'setsuzoku jikan wo oshirabe shimasu. touchakugo wa shinkansen norikaeguchi e osusumi kudasai', pronunciation_chunks: 'se·tsu·zo·ku ji·kan wo o·shi·ra·be shi·ma·su tou·cha·ku·go wa shin·kan·sen no·ri·ka·e·gu·chi e o·su·su·mi ku·da·sai', english: 'I will check the connection time. After arriving, proceed to the Shinkansen transfer gate.', chinese_tc: '我幫您確認轉乘時間。抵達後請前往新幹線轉乘閘口' },
      { speaker: 'you', target: '敦賀で一度改札を出ますか？', pronunciation: 'tsuruga de ichido kaisatsu wo demasu ka', pronunciation_chunks: 'tsu·ru·ga de i·chi·do kai·sa·tsu wo de·ma·su ka', english: 'Do I leave the ticketed area once at Tsuruga?', chinese_tc: '在敦賀需要先出閘嗎？' },
      { speaker: 'staff', target: 'いいえ、新幹線乗換改札をご利用ください。切符は全部まとめて入れてください', pronunciation: 'iie, shinkansen norikae kaisatsu wo goriyou kudasai. kippu wa zenbu matomete irete kudasai', pronunciation_chunks: 'ii·e shin·kan·sen no·ri·ka·e kai·sa·tsu wo go·ri·you ku·da·sai kip·pu wa zen·bu ma·to·me·te i·re·te ku·da·sai', english: 'No, use the Shinkansen transfer gate. Insert all of your tickets together.', chinese_tc: '不用，請使用新幹線轉乘閘口，並把所有車票一起放入' },
      { speaker: 'you', target: 'ありがとうございます。乗り換え口の表示を確認します', pronunciation: 'arigatou gozaimasu. norikaeguchi no hyouji wo kakunin shimasu', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su no·ri·ka·e·gu·chi no hyou·ji wo ka·ku·nin shi·ma·su', english: 'Thank you. I will check the signs for the transfer gate.', chinese_tc: '謝謝。我會確認轉乘閘口的指示' },
    ],
  },
  {
    id: 'sc27',
    lang: 'ja',
    group: 'train',
    title: 'Gate Won\'t Open',
    titleTC: '車票閘門故障',
    emoji: '🚧',
    description: 'Your multi-day pass won\'t scan — asking station staff for help',
    lines: [
      { speaker: 'you', target: 'すみません、改札が通れないのですが…', pronunciation: 'sumimasen, kaisatsu ga toorenai no desu ga...', pronunciation_chunks: 'su·mi·ma·sen, kai·sa·tsu ga too·re·nai no de·su ga', english: 'Excuse me, I can\'t get through the ticket gate...', chinese_tc: '不好意思，我過不了閘門…', note: '改札 (kaisatsu) = ticket gate. Approach the staff window next to the gates.' },
      { speaker: 'staff', target: '切符を見せてもらえますか？', pronunciation: 'kippu wo misete moraemasu ka?', pronunciation_chunks: 'kip·pu wo mi·se·te mo·ra·e·ma·su ka', english: 'Can I see your ticket?', chinese_tc: '可以讓我看看車票嗎？' },
      { speaker: 'you', target: 'はい、これです。○日間パスです', pronunciation: 'hai, kore desu. ○nichikan pasu desu', pronunciation_chunks: 'hai, ko·re de·su. ○·ni·chi·kan pa·su de·su', english: 'Yes, here it is. It\'s a ○-day pass.', chinese_tc: '好的，這是○日券', variables: [
        { placeholder: '○日間', label: 'Pass type', options: [
          { value: '3日間', pronunciation: 'mik·ka·kan', english: '3-day', chinese_tc: '3日券' },
          { value: '5日間', pronunciation: 'i·tsu·ka·kan', english: '5-day', chinese_tc: '5日券' },
          { value: '7日間', pronunciation: 'na·no·ka·kan', english: '7-day', chinese_tc: '7日券' },
          { value: '14日間', pronunciation: 'juu·yok·ka·kan', english: '14-day', chinese_tc: '14日券' },
        ] },
      ] },
      { speaker: 'staff', target: 'このパスは有人改札をお通りください', pronunciation: 'kono pasu wa yuujin kaisatsu wo otoori kudasai', pronunciation_chunks: 'ko·no pa·su wa yuu·jin kai·sa·tsu wo o·too·ri ku·da·sai', english: 'Please use the staffed gate for this pass.', chinese_tc: '這種票請走人工閘門', note: 'Some passes (like JR Pass) can\'t go through automatic gates — always use the staffed gate window.' },
      { speaker: 'you', target: '有人改札はどこですか？', pronunciation: 'yuujin kaisatsu wa doko desu ka?', pronunciation_chunks: 'yuu·jin kai·sa·tsu wa do·ko de·su ka', english: 'Where is the staffed gate?', chinese_tc: '人工閘門在哪裡？' },
      { speaker: 'staff', target: 'あちらの窓口です。パスを見せるだけで大丈夫です', pronunciation: 'achira no madoguchi desu. pasu wo miseru dake de daijoubu desu', pronunciation_chunks: 'a·chi·ra no ma·do·gu·chi de·su. pa·su wo mi·se·ru da·ke de dai·jou·bu de·su', english: 'It\'s that window over there. Just show your pass.', chinese_tc: '在那邊的窗口。出示票券就可以了' },
      { speaker: 'you', target: 'ありがとうございます！', pronunciation: 'arigatou gozaimasu!', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you!', chinese_tc: '謝謝！' },
    ],
  },
  // === SC32: Getting Lost on Train ===
  {
    id: 'sc32', lang: 'ja', group: 'train',
    title: 'Wrong Train — What Now?', titleTC: '搭錯車',
    emoji: '😰', description: 'Realizing you\'re on the wrong train and asking for help',
    lines: [
      { speaker: 'you', target: 'すみません、この電車は東京駅に行きますか？', pronunciation: 'sumimasen, kono densha wa toukyou eki ni ikimasu ka', pronunciation_chunks: 'su·mi·ma·sen ko·no den·sha wa tou·kyou e·ki ni i·ki·ma·su ka', english: 'Excuse me, does this train go to Tokyo Station?', chinese_tc: '請問這班電車有到東京站嗎？', variables: [
        { placeholder: '東京駅', label: 'Destination', options: [
          { value: '東京駅', pronunciation: 'tou·kyou e·ki', english: 'Tokyo Station', chinese_tc: '東京站' },
          { value: '渋谷駅', pronunciation: 'shi·bu·ya e·ki', english: 'Shibuya Station', chinese_tc: '渋谷站' },
          { value: '新宿駅', pronunciation: 'shin·ju·ku e·ki', english: 'Shinjuku Station', chinese_tc: '新宿站' },
          { value: '名古屋駅', pronunciation: 'na·go·ya e·ki', english: 'Nagoya Station', chinese_tc: '名古屋站' },
          { value: '品川駅', pronunciation: 'shi·na·ga·wa e·ki', english: 'Shinagawa Station', chinese_tc: '品川站' },
        ] },
      ] },
      { speaker: 'staff', target: 'いいえ、この電車は行きません。次の駅で降りてください', pronunciation: 'iie, kono densha wa ikimasen. tsugi no eki de orite kudasai', pronunciation_chunks: 'ii·e ko·no den·sha wa i·ki·ma·sen. tsu·gi no e·ki de o·ri·te ku·da·sai', english: 'No, this train doesn\'t go there. Please get off at the next station.', chinese_tc: '不是，這班不到。請在下一站下車' },
      { speaker: 'you', target: 'どのホームに行けばいいですか？', pronunciation: 'dono hoomu ni ikeba ii desu ka', pronunciation_chunks: 'do·no hoo·mu ni i·ke·ba ii de·su ka', english: 'Which platform should I go to?', chinese_tc: '應該去哪個月台？' },
      { speaker: 'staff', target: '向かいのホーム、3番線です', pronunciation: 'mukai no hoomu, sanban-sen desu', pronunciation_chunks: 'mu·kai no hoo·mu san·ban·sen de·su', english: 'The opposite platform, line 3.', chinese_tc: '對面月台，3號線' },
      { speaker: 'you', target: '乗り換えは必要ですか？', pronunciation: 'norikae wa hitsuyou desu ka', pronunciation_chunks: 'no·ri·ka·e wa hi·tsu·you de·su ka', english: 'Do I need to transfer?', chinese_tc: '需要轉車嗎？' },
      { speaker: 'staff', target: 'はい、次の駅で中央線に乗り換えてください', pronunciation: 'hai, tsugi no eki de chuuou-sen ni norikaete kudasai', pronunciation_chunks: 'hai tsu·gi no e·ki de chuu·ou·sen ni no·ri·ka·e·te ku·da·sai', english: 'Yes, transfer to the Chuo Line at the next station.', chinese_tc: '是的，在下一站轉中央線' },
    ],
  },
  // === SC43: Taking a Bus ===
  {
    id: 'sc43', lang: 'ja', group: 'transit',
    title: 'Bus Stop & Riding', titleTC: '搭公車',
    emoji: '🚌', description: 'Finding the bus stop, asking about routes and schedules',
    lines: [
      { speaker: 'you', target: 'すみません、名古屋城行きのバスはどこですか？', pronunciation: 'sumimasen, nagoya-jou iki no basu wa doko desu ka', pronunciation_chunks: 'su·mi·ma·sen na·go·ya·jou i·ki no ba·su wa do·ko de·su ka', english: 'Excuse me, where is the bus to Nagoya Castle?', chinese_tc: '請問去名古屋城的公車在哪裡？', variables: [
        { placeholder: '名古屋城', label: 'Destination', options: [
          { value: '名古屋城', pronunciation: 'na·go·ya·jou', english: 'Nagoya Castle', chinese_tc: '名古屋城' },
          { value: '名古屋駅', pronunciation: 'na·go·ya·e·ki', english: 'Nagoya Station', chinese_tc: '名古屋站' },
          { value: '空港', pronunciation: 'kuu·kou', english: 'Airport', chinese_tc: '機場' },
          { value: '栄', pronunciation: 'sa·ka·e', english: 'Sakae', chinese_tc: '榮' },
        ] },
      ] },
      { speaker: 'staff', target: 'あちらの3番のりばです', pronunciation: 'achira no sanban noriba desu', pronunciation_chunks: 'a·chi·ra no san·ban no·ri·ba de·su', english: 'It\'s at bus stop number 3 over there.', chinese_tc: '在那邊的3號乘車處' },
      { speaker: 'you', target: '次のバスは何時ですか？', pronunciation: 'tsugi no basu wa nanji desu ka', pronunciation_chunks: 'tsu·gi no ba·su wa nan·ji de·su ka', english: 'What time is the next bus?', chinese_tc: '下一班公車幾點？' },
      { speaker: 'staff', target: '10分後に来ますよ', pronunciation: 'juppun go ni kimasu yo', pronunciation_chunks: 'jup·pun go ni ki·ma·su yo', english: 'It comes in 10 minutes.', chinese_tc: '10分鐘後來' },
      { speaker: 'you', target: 'ICカードで乗れますか？', pronunciation: 'ai-shii kaado de noremasu ka', pronunciation_chunks: 'ai·shii kaa·do de no·re·ma·su ka', english: 'Can I ride with an IC card?', chinese_tc: '可以用IC卡搭嗎？', note: 'Most city buses accept IC cards. Tap when boarding (front) or exiting (back) depending on the city.' },
      { speaker: 'staff', target: 'はい、乗る時にタッチしてください', pronunciation: 'hai, noru toki ni tacchi shite kudasai', pronunciation_chunks: 'hai no·ru to·ki ni tat·chi shi·te ku·da·sai', english: 'Yes, tap when you board.', chinese_tc: '可以，上車時感應一下' },
      { speaker: 'you', target: '降りたい時はどうすればいいですか？', pronunciation: 'oritai toki wa dou sureba ii desu ka', pronunciation_chunks: 'o·ri·tai to·ki wa dou su·re·ba ii de·su ka', english: 'What should I do when I want to get off?', chinese_tc: '想下車的時候怎麼辦？' },
      { speaker: 'staff', target: 'ボタンを押してください。次のバス停で降りられます', pronunciation: 'botan wo oshite kudasai. tsugi no basutei de oriraremasu', pronunciation_chunks: 'bo·tan wo o·shi·te ku·da·sai. tsu·gi no ba·su·tei de o·ri·ra·re·ma·su', english: 'Press the button. You can get off at the next stop.', chinese_tc: '按按鈕。在下一站就可以下車' },
    ],
  },
  {
    id: 'sc49', lang: 'ja', group: 'transit',
    title: 'Buying a Regional Travel Pass', titleTC: '購買地區交通票券',
    emoji: '🎫', description: 'Choosing a pass, checking what it covers, and finding the last return service',
    lines: [
      { speaker: 'you', target: 'すみません、この地域の観光パスを二枚買いたいです', pronunciation: 'sumimasen, kono chiiki no kankou pasu wo nimai kaitai desu', pronunciation_chunks: 'su·mi·ma·sen ko·no chii·ki no kan·kou pa·su wo ni·mai kai·tai de·su', english: 'Excuse me, I would like to buy two sightseeing passes for this area.', chinese_tc: '不好意思，我想買兩張這個地區的觀光票券' },
      { speaker: 'staff', target: 'どちらへ行く予定ですか？', pronunciation: 'dochira e iku yotei desu ka', pronunciation_chunks: 'do·chi·ra e i·ku yo·tei de·su ka', english: 'Where are you planning to go?', chinese_tc: '您預計去哪裡？' },
      { speaker: 'you', target: '兼六園とひがし茶屋街を回る予定です', pronunciation: 'kenrokuen to higashi chayagai wo mawaru yotei desu', pronunciation_chunks: 'ken·ro·ku·en to hi·ga·shi cha·ya·gai wo ma·wa·ru yo·tei de·su', english: 'We plan to visit Kenrokuen and the Higashi Chaya District.', chinese_tc: '我們預計去兼六園和東茶屋街', options: [
        { target: '兼六園とひがし茶屋街を回る予定です', pronunciation: 'kenrokuen to higashi chayagai wo mawaru yotei desu', pronunciation_chunks: 'ken·ro·ku·en to hi·ga·shi cha·ya·gai wo ma·wa·ru yo·tei de·su', english: 'Kenrokuen and the Higashi Chaya District', chinese_tc: '兼六園和東茶屋街' },
        { target: '戸隠神社へ行く予定です', pronunciation: 'togakushi jinja e iku yotei desu', pronunciation_chunks: 'to·ga·ku·shi jin·ja e i·ku yo·tei de·su', english: 'We plan to visit Togakushi Shrine', chinese_tc: '我們預計去戶隱神社' },
        { target: '地獄谷野猿公苑へ行く予定です', pronunciation: 'jigokudani yaen kouen e iku yotei desu', pronunciation_chunks: 'ji·go·ku·da·ni ya·en kou·en e i·ku yo·tei de·su', english: 'We plan to visit Jigokudani Snow Monkey Park', chinese_tc: '我們預計去地獄谷野猿公苑' },
      ] },
      { speaker: 'staff', target: '目的地に合うパスをご案内します', pronunciation: 'mokutekichi ni au pasu wo goannai shimasu', pronunciation_chunks: 'mo·ku·te·ki·chi ni a·u pa·su wo go·an·nai shi·ma·su', english: 'I will show you the pass that matches your destinations.', chinese_tc: '我會為您介紹適合目的地的票券' },
      { speaker: 'you', target: 'このパスには何が含まれていますか？', pronunciation: 'kono pasu ni wa nani ga fukumarete imasu ka', pronunciation_chunks: 'ko·no pa·su ni wa na·ni ga fu·ku·ma·re·te i·ma·su ka', english: 'What is included in this pass?', chinese_tc: '這張票券包含什麼？' },
      { speaker: 'staff', target: '対象区間と有効期間はパスによって違います。こちらの路線図をご覧ください', pronunciation: 'taishou kukan to yuukou kikan wa pasu ni yotte chigaimasu. kochira no rosenzu wo goran kudasai', pronunciation_chunks: 'tai·shou ku·kan to yuu·kou ki·kan wa pa·su ni yot·te chi·gai·ma·su ko·chi·ra no ro·sen·zu wo go·ran ku·da·sai', english: 'The covered area and validity period depend on the pass. Please see this route map.', chinese_tc: '適用區間和有效期間依票券而異。請看這張路線圖' },
      { speaker: 'you', target: '今日から使えますか？', pronunciation: 'kyou kara tsukaemasu ka', pronunciation_chunks: 'kyou ka·ra tsu·ka·e·ma·su ka', english: 'Can I use it starting today?', chinese_tc: '今天開始可以使用嗎？' },
      { speaker: 'staff', target: 'はい、ご利用日を今日に設定します', pronunciation: 'hai, goriyoubi wo kyou ni settei shimasu', pronunciation_chunks: 'hai go·ri·you·bi wo kyou ni set·tei shi·ma·su', english: 'Yes, I will set the usage date to today.', chinese_tc: '可以，我會將使用日期設定為今天' },
      { speaker: 'you', target: '帰りの最終便は何時ですか？', pronunciation: 'kaeri no saishuubin wa nanji desu ka', pronunciation_chunks: 'ka·e·ri no sai·shuu·bin wa nan·ji de·su ka', english: 'What time is the last return service?', chinese_tc: '回程末班車是幾點？' },
      { speaker: 'staff', target: '季節によって変わりますので、この時刻表をご確認ください', pronunciation: 'kisetsu ni yotte kawarimasu node, kono jikokuhyou wo gokakunin kudasai', pronunciation_chunks: 'ki·se·tsu ni yot·te ka·wa·ri·ma·su no·de ko·no ji·ko·ku·hyou wo go·ka·ku·nin ku·da·sai', english: 'It changes by season, so please check this timetable.', chinese_tc: '末班時間會依季節變更，請確認這份時刻表' },
    ],
  },
  {
    id: 'sc50', lang: 'ja', group: 'transit',
    title: 'Bus to Togakushi Shrine', titleTC: '搭巴士前往戶隱神社',
    emoji: '🌲', description: 'Buying a Togakushi bus ticket, choosing the right stop, and planning the return bus',
    lines: [
      { speaker: 'you', target: '戸隠方面で使える乗車券はありますか？', pronunciation: 'togakushi houmen de tsukaeru joushaken wa arimasu ka', pronunciation_chunks: 'to·ga·ku·shi hou·men de tsu·ka·e·ru jou·sha·ken wa a·ri·ma·su ka', english: 'Is there a ticket I can use for the Togakushi area?', chinese_tc: '有可以在戶隱地區使用的車票嗎？' },
      { speaker: 'staff', target: '戸隠方面ですね。現在利用できる乗車券をご案内します', pronunciation: 'togakushi houmen desu ne. genzai riyou dekiru joushaken wo goannai shimasu', pronunciation_chunks: 'to·ga·ku·shi hou·men de·su ne gen·zai ri·you de·ki·ru jou·sha·ken wo go·an·nai shi·ma·su', english: 'For the Togakushi area, correct? I will show you the tickets currently available.', chinese_tc: '是前往戶隱地區吧？我為您介紹目前可以使用的車票' },
      { speaker: 'staff', target: '本日ご利用ですか？', pronunciation: 'honjitsu goriyou desu ka', pronunciation_chunks: 'hon·ji·tsu go·ri·you de·su ka', english: 'Will you use it today?', chinese_tc: '今天使用嗎？' },
      { speaker: 'you', target: 'はい。奥社の杉並木へ行きたいです', pronunciation: 'hai. okusya no suginamiki e ikitai desu', pronunciation_chunks: 'hai o·ku·sha no su·gi·na·mi·ki e i·ki·tai de·su', english: 'Yes. We would like to visit the cedar avenue at the Upper Shrine.', chinese_tc: '是的。我們想去奧社的杉木林參道' },
      { speaker: 'staff', target: '戸隠奥社入口で降りてください', pronunciation: 'togakushi okusya iriguchi de orite kudasai', pronunciation_chunks: 'to·ga·ku·shi o·ku·sha i·ri·gu·chi de o·ri·te ku·da·sai', english: 'Please get off at Togakushi Okusha Iriguchi.', chinese_tc: '請在戶隱奧社入口下車' },
      { speaker: 'you', target: 'この切符で中社にも行けますか？', pronunciation: 'kono kippu de chuusha ni mo ikemasu ka', pronunciation_chunks: 'ko·no kip·pu de chuu·sha ni mo i·ke·ma·su ka', english: 'Can I also go to the Middle Shrine with this pass?', chinese_tc: '這張票也可以去中社嗎？' },
      { speaker: 'staff', target: 'はい、対象区間内で乗り降りできます', pronunciation: 'hai, taishou kukannai de nori ori dekimasu', pronunciation_chunks: 'hai tai·shou ku·kan·nai de no·ri o·ri de·ki·ma·su', english: 'Yes, you can get on and off within the covered area.', chinese_tc: '可以，在適用區間內可以自由上下車' },
      { speaker: 'you', target: '長野駅へ戻る最終バスは何時ですか？', pronunciation: 'nagano eki e modoru saishuu basu wa nanji desu ka', pronunciation_chunks: 'na·ga·no e·ki e mo·do·ru sai·shuu ba·su wa nan·ji de·su ka', english: 'What time is the last bus back to Nagano Station?', chinese_tc: '回長野站的末班巴士是幾點？' },
      { speaker: 'staff', target: '季節で時刻が変わります。帰りの時刻表を必ず確認してください', pronunciation: 'kisetsu de jikoku ga kawarimasu. kaeri no jikokuhyou wo kanarazu kakunin shite kudasai', pronunciation_chunks: 'ki·se·tsu de ji·ko·ku ga ka·wa·ri·ma·su ka·e·ri no ji·ko·ku·hyou wo ka·na·ra·zu ka·ku·nin shi·te ku·da·sai', english: 'Times change by season. Be sure to check the return timetable.', chinese_tc: '班次會依季節變更。請務必確認回程時刻表', note: 'Winter weather can affect buses and the approach to Okusha. Check the operating status before leaving Nagano.' },
      { speaker: 'you', target: '乗り場はどこですか？', pronunciation: 'noriba wa doko desu ka', pronunciation_chunks: 'no·ri·ba wa do·ko de·su ka', english: 'Where is the bus stop?', chinese_tc: '乘車處在哪裡？' },
      { speaker: 'staff', target: '案内所を出て、戸隠方面の乗り場へお進みください', pronunciation: 'annaijo wo dete, togakushi houmen no noriba e osusumi kudasai', pronunciation_chunks: 'an·nai·jo wo de·te to·ga·ku·shi hou·men no no·ri·ba e o·su·su·mi ku·da·sai', english: 'Leave the information office and proceed to the stop for Togakushi.', chinese_tc: '離開服務處後，請前往戶隱方向的乘車處' },
    ],
  },
  {
    id: 'sc51', lang: 'ja', group: 'transit',
    title: 'Snow Monkey Pass', titleTC: '雪猴通票與交通',
    emoji: '🐒', description: 'Buying the pass and travelling from Nagano to Jigokudani Snow Monkey Park',
    lines: [
      { speaker: 'you', target: 'スノーモンキーパスを二枚ください', pronunciation: 'sunoo monkii pasu wo nimai kudasai', pronunciation_chunks: 'su·noo mon·kii pa·su wo ni·mai ku·da·sai', english: 'Two Snow Monkey Passes please.', chinese_tc: '請給我兩張雪猴通票' },
      { speaker: 'staff', target: 'ご利用日はいつですか？', pronunciation: 'goriyoubi wa itsu desu ka', pronunciation_chunks: 'go·ri·you·bi wa i·tsu de·su ka', english: 'When will you use them?', chinese_tc: '預計哪一天使用？' },
      { speaker: 'you', target: '今日から使いたいです', pronunciation: 'kyou kara tsukaitai desu', pronunciation_chunks: 'kyou ka·ra tsu·kai·tai de·su', english: 'I would like to use them starting today.', chinese_tc: '我想從今天開始使用' },
      { speaker: 'you', target: '電車とバスと野猿公苑の入苑料は含まれていますか？', pronunciation: 'densha to basu to yaen kouen no nyuuenryou wa fukumarete imasu ka', pronunciation_chunks: 'den·sha to ba·su to ya·en kou·en no nyuu·en·ryou wa fu·ku·ma·re·te i·ma·su ka', english: 'Are the train, bus, and Snow Monkey Park admission included?', chinese_tc: '包含電車、巴士和野猿公苑入場費嗎？' },
      { speaker: 'staff', target: 'はい、対象の電車とバス、それから野猿公苑の入苑券が含まれています', pronunciation: 'hai, taishou no densha to basu, sorekara yaen kouen no nyuuenken ga fukumarete imasu', pronunciation_chunks: 'hai tai·shou no den·sha to ba·su so·re·ka·ra ya·en kou·en no nyuu·en·ken ga fu·ku·ma·re·te i·ma·su', english: 'Yes, it includes the covered trains and buses, plus admission to the park.', chinese_tc: '是的，包含適用的電車、巴士，以及野猿公苑入場券' },
      { speaker: 'you', target: '長野駅からどうやって行けばいいですか？', pronunciation: 'nagano eki kara dou yatte ikeba ii desu ka', pronunciation_chunks: 'na·ga·no e·ki ka·ra dou yat·te i·ke·ba ii de·su ka', english: 'How should I get there from Nagano Station?', chinese_tc: '從長野站要怎麼去？' },
      { speaker: 'staff', target: '急行バスで行くか、長野電鉄で湯田中駅まで行ってバスに乗り換えます', pronunciation: 'kyuukou basu de iku ka, nagano dentetsu de yudanaka eki made itte basu ni norikaemasu', pronunciation_chunks: 'kyuu·kou ba·su de i·ku ka na·ga·no den·te·tsu de yu·da·na·ka e·ki ma·de it·te ba·su ni no·ri·ka·e·ma·su', english: 'Take an express bus, or take Nagano Dentetsu to Yudanaka Station and transfer to a bus.', chinese_tc: '可以搭急行巴士，或搭長野電鐵到湯田中站再轉巴士' },
      { speaker: 'you', target: 'バスを降りてからどのくらい歩きますか？', pronunciation: 'basu wo orite kara dono kurai arukimasu ka', pronunciation_chunks: 'ba·su wo o·ri·te ka·ra do·no ku·rai a·ru·ki·ma·su ka', english: 'About how long is the walk after getting off the bus?', chinese_tc: '下巴士後大概要走多久？' },
      { speaker: 'staff', target: '入口から野猿公苑まで三十分から四十分ほど歩きます', pronunciation: 'iriguchi kara yaen kouen made sanjuppun kara yonjuppun hodo arukimasu', pronunciation_chunks: 'i·ri·gu·chi ka·ra ya·en kou·en ma·de san·jup·pun ka·ra yon·jup·pun ho·do a·ru·ki·ma·su', english: 'It is about a 30 to 40 minute walk from the entrance to the park.', chinese_tc: '從入口走到野猿公苑大約需要30至40分鐘' },
      { speaker: 'you', target: '雪道でも歩けますか？', pronunciation: 'yukimichi demo arukemasu ka', pronunciation_chunks: 'yu·ki·mi·chi de·mo a·ru·ke·ma·su ka', english: 'Can we walk there when the path is snowy?', chinese_tc: '雪地也可以步行嗎？' },
      { speaker: 'staff', target: '滑りにくい靴でお越しください。帰りのバスの時刻も確認してください', pronunciation: 'suberinikui kutsu de okoshi kudasai. kaeri no basu no jikoku mo kakunin shite kudasai', pronunciation_chunks: 'su·be·ri·ni·kui ku·tsu de o·ko·shi ku·da·sai ka·e·ri no ba·su no ji·ko·ku mo ka·ku·nin shi·te ku·da·sai', english: 'Please wear shoes with good traction. Also check the return bus time.', chinese_tc: '請穿防滑的鞋子，也請確認回程巴士時間' },
    ],
  },
  {
    id: 'sc09',
    lang: 'ja',
    group: 'transit',
    title: '"How Do I Get To...?"',
    titleTC: '問路',
    emoji: '🗺️',
    description: 'You\'re lost, asking a local',
    lines: [
      { speaker: 'you', target: 'すみません、ちょっとお聞きしたいのですが', pronunciation: 'sumimasen, chotto okiki shitai no desu ga', pronunciation_chunks: 'su·mi·ma·sen, chot·to o·ki·ki shi·tai no de·su ga', english: 'Excuse me, may I ask you something?', chinese_tc: '不好意思，想請問一下', note: 'Polite way to approach a stranger' },
      { speaker: 'you', target: '○○駅はどこですか？', pronunciation: '○○ eki wa doko desu ka?', pronunciation_chunks: '○○ e·ki wa do·ko de·su ka', english: 'Where is ○○ station?', chinese_tc: '○○站在哪裡？', variables: [
        { placeholder: '○○', label: 'Station', options: [
          { value: '東京', pronunciation: 'tou·kyou', english: 'Tokyo', chinese_tc: '東京' },
          { value: '渋谷', pronunciation: 'shi·bu·ya', english: 'Shibuya', chinese_tc: '渋谷' },
          { value: '新宿', pronunciation: 'shin·ju·ku', english: 'Shinjuku', chinese_tc: '新宿' },
          { value: '池袋', pronunciation: 'i·ke·bu·ku·ro', english: 'Ikebukuro', chinese_tc: '池袋' },
          { value: '品川', pronunciation: 'shi·na·ga·wa', english: 'Shinagawa', chinese_tc: '品川' },
          { value: '上野', pronunciation: 'u·e·no', english: 'Ueno', chinese_tc: '上野' },
          { value: '浅草', pronunciation: 'a·sa·ku·sa', english: 'Asakusa', chinese_tc: '淺草' },
          { value: '秋葉原', pronunciation: 'a·ki·ha·ba·ra', english: 'Akihabara', chinese_tc: '秋葉原' },
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
    id: 'sc07',
    lang: 'ja',
    group: 'transit',
    title: 'Taxi to Your Destination',
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
    id: 'sc06',
    lang: 'ja',
    group: 'hotel',
    title: 'Checking In',
    titleTC: '飯店入住',
    emoji: '🏨',
    description: 'Arriving at hotel, checking in for 2',
    lines: [
      { speaker: 'you', target: 'チェックインお願いします', pronunciation: 'chekkuin onegaishimasu', pronunciation_chunks: 'chek·ku·in o·ne·gai·shi·ma·su', english: 'Check-in please', chinese_tc: '我要辦理入住' },
      { speaker: 'staff', target: 'ご予約のお名前をお願いします', pronunciation: 'go-yoyaku no onamae wo onegaishimasu', pronunciation_chunks: 'go·yo·ya·ku no o·na·ma·e wo o·ne·gai·shi·ma·su', english: 'Your reservation name please', chinese_tc: '請問預約的姓名' },
      { speaker: 'you', target: '予約した○○です。二泊です', pronunciation: 'yoyaku shita ○○ desu. nihaku desu', pronunciation_chunks: 'yo·ya·ku shi·ta ○○ de·su. ni·ha·ku de·su', english: 'Reservation under ○○. Two nights.', chinese_tc: '我有預約，姓○○。住兩晚', note: 'Show your booking confirmation on your phone', variables: [
        { placeholder: '二泊', label: 'Nights', options: [
          { value: '一泊', pronunciation: 'ip·pa·ku', english: '1 night', chinese_tc: '一晚' },
          { value: '二泊', pronunciation: 'ni·ha·ku', english: '2 nights', chinese_tc: '兩晚' },
          { value: '三泊', pronunciation: 'san·pa·ku', english: '3 nights', chinese_tc: '三晚' },
          { value: '四泊', pronunciation: 'yon·ha·ku', english: '4 nights', chinese_tc: '四晚' },
          { value: '五泊', pronunciation: 'go·ha·ku', english: '5 nights', chinese_tc: '五晚' },
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
  // === SC39: Hotel — Borrowing Items & Services ===
  // === SC46: Hotel — Early Arrival / Leave Luggage ===
  {
    id: 'sc46', lang: 'ja', group: 'hotel',
    title: 'Too Early to Check In', titleTC: '提早到飯店寄放行李',
    emoji: '🕐', description: 'Arriving before check-in time and leaving luggage at the hotel',
    lines: [
      { speaker: 'you', target: 'すみません、チェックインは何時からですか？', pronunciation: 'sumimasen, chekkuin wa nanji kara desu ka', pronunciation_chunks: 'su·mi·ma·sen chek·ku·in wa nan·ji ka·ra de·su ka', english: 'Excuse me, what time is check-in from?', chinese_tc: '不好意思，幾點可以辦理入住？' },
      { speaker: 'staff', target: 'チェックインは3時からになります', pronunciation: 'chekkuin wa sanji kara ni narimasu', pronunciation_chunks: 'chek·ku·in wa san·ji ka·ra ni na·ri·ma·su', english: 'Check-in is from 3pm.', chinese_tc: '入住是下午3點開始' },
      { speaker: 'you', target: '予約した○○です。まだ早いのですが、荷物を預けてもいいですか？', pronunciation: 'yoyaku shita ○○ desu. mada hayai no desu ga, nimotsu wo azukete mo ii desu ka', pronunciation_chunks: 'yo·ya·ku shi·ta ○○ de·su. ma·da ha·yai no de·su ga ni·mo·tsu wo a·zu·ke·te mo ii de·su ka', english: 'I have a reservation under ○○. It\'s still early, but can I leave my luggage?', chinese_tc: '我有預約，姓○○。時間還早，可以先寄放行李嗎？' },
      { speaker: 'staff', target: 'はい、もちろんです。こちらでお預かりします', pronunciation: 'hai, mochiron desu. kochira de oazukari shimasu', pronunciation_chunks: 'hai mo·chi·ron de·su. ko·chi·ra de o·a·zu·ka·ri shi·ma·su', english: 'Yes, of course. We\'ll keep it here for you.', chinese_tc: '好的，當然可以。我們幫您保管' },
      { speaker: 'you', target: 'スーツケース二つお願いします', pronunciation: 'suutsukeesu futatsu onegaishimasu', pronunciation_chunks: 'suu·tsu·kee·su fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two suitcases please.', chinese_tc: '兩個行李箱', options: [
        { target: 'スーツケース一つお願いします', pronunciation: 'suutsukeesu hitotsu onegaishimasu', pronunciation_chunks: 'suu·tsu·kee·su hi·to·tsu o·ne·gai·shi·ma·su', english: 'One suitcase please', chinese_tc: '一個行李箱' },
        { target: 'スーツケース二つお願いします', pronunciation: 'suutsukeesu futatsu onegaishimasu', pronunciation_chunks: 'suu·tsu·kee·su fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two suitcases please', chinese_tc: '兩個行李箱' },
        { target: 'スーツケース二つとリュック一つお願いします', pronunciation: 'suutsukeesu futatsu to ryukku hitotsu onegaishimasu', pronunciation_chunks: 'suu·tsu·kee·su fu·ta·tsu to ryuk·ku hi·to·tsu o·ne·gai·shi·ma·su', english: 'Two suitcases and one backpack please', chinese_tc: '兩個行李箱和一個背包' },
      ] },
      { speaker: 'staff', target: 'かしこまりました。お戻りの際にフロントにお声がけください', pronunciation: 'kashikomarimashita. omodori no sai ni furonto ni okoe gake kudasai', pronunciation_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta. o·mo·do·ri no sai ni fu·ron·to ni o·ko·e·ga·ke ku·da·sai', english: 'Certainly. Please come to the front desk when you return.', chinese_tc: '好的。回來時請到前台告知' },
      { speaker: 'you', target: '3時に戻ります。ありがとうございます', pronunciation: 'sanji ni modorimasu. arigatou gozaimasu', pronunciation_chunks: 'san·ji ni mo·do·ri·ma·su. a·ri·ga·tou go·zai·ma·su', english: 'I\'ll be back at 3. Thank you.', chinese_tc: '3點回來。謝謝', note: 'Most hotels happily store luggage before check-in — it\'s free! Go explore while you wait.' },
    ],
  },
  {
    id: 'sc39', lang: 'ja', group: 'hotel',
    title: 'Room Service & Requests', titleTC: '飯店需求',
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
  {
    id: 'sc26',
    lang: 'ja',
    group: 'hotel',
    title: '"Send My Bags Ahead"',
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
          { value: '明日', pronunciation: 'a·shi·ta', english: 'Tomorrow', chinese_tc: '明天' },
          { value: '明後日', pronunciation: 'a·sat·te', english: 'Day after tomorrow', chinese_tc: '後天' },
        ] },
        { placeholder: '午前中', label: 'Time', options: [
          { value: '午前中', pronunciation: 'go·zen·chuu', english: 'Morning', chinese_tc: '上午' },
          { value: '午後', pronunciation: 'go·go', english: 'Afternoon', chinese_tc: '下午' },
          { value: '夕方', pronunciation: 'yuu·ga·ta', english: 'Evening', chinese_tc: '傍晚' },
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
    id: 'sc14',
    lang: 'ja',
    group: 'hotel',
    title: 'Checking Out & Storing Bags',
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
          { value: '3時', pronunciation: 'san·ji', english: '3pm', chinese_tc: '3點' },
          { value: '4時', pronunciation: 'yo·ji', english: '4pm', chinese_tc: '4點' },
          { value: '5時', pronunciation: 'go·ji', english: '5pm', chinese_tc: '5點' },
          { value: '6時', pronunciation: 'ro·ku·ji', english: '6pm', chinese_tc: '6點' },
          { value: '7時', pronunciation: 'shi·chi·ji', english: '7pm', chinese_tc: '7點' },
        ] },
      ] },
      { speaker: 'staff', target: 'かしこまりました。こちらの番号札をお持ちください', pronunciation: 'kashikomarimashita. kochira no bangou fuda wo omochi kudasai', pronunciation_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta. ko·chi·ra no ban·gou fu·da wo o·mo·chi ku·da·sai', english: 'Certainly. Please take this number tag.', chinese_tc: '好的。請拿這個號碼牌' },
      { speaker: 'you', target: 'ありがとうございます', pronunciation: 'arigatou gozaimasu', pronunciation_chunks: 'a·ri·ga·tou go·zai·ma·su', english: 'Thank you', chinese_tc: '謝謝' },
    ],
  },
  // === SC33: Restaurant Reservation ===
  {
    id: 'sc33', lang: 'ja', group: 'restaurant',
    title: 'Booking a Table', titleTC: '預約餐廳',
    emoji: '📞', description: 'Booking a table at a restaurant by phone or walk-in',
    lines: [
      { speaker: 'you', target: '予約したいのですが', pronunciation: 'yoyaku shitai no desu ga', pronunciation_chunks: 'yo·ya·ku shi·tai no de·su ga', english: 'I\'d like to make a reservation.', chinese_tc: '我想預約' },
      { speaker: 'staff', target: 'いつのご予約ですか？', pronunciation: 'itsu no go-yoyaku desu ka', pronunciation_chunks: 'i·tsu no go·yo·ya·ku de·su ka', english: 'When would you like to reserve?', chinese_tc: '什麼時候的預約？' },
      { speaker: 'you', target: '今日の7時にふたりでお願いします', pronunciation: 'kyou no shichiji ni futari de onegaishimasu', pronunciation_chunks: 'kyou no shi·chi·ji ni fu·ta·ri de o·ne·gai·shi·ma·su', english: 'Today at 7pm for two people please.', chinese_tc: '今天7點，兩位', variables: [
        { placeholder: '7時', label: 'Time', options: [
          { value: '6時', pronunciation: 'ro·ku·ji', english: '6pm', chinese_tc: '6點' },
          { value: '7時', pronunciation: 'shi·chi·ji', english: '7pm', chinese_tc: '7點' },
          { value: '8時', pronunciation: 'ha·chi·ji', english: '8pm', chinese_tc: '8點' },
          { value: '9時', pronunciation: 'ku·ji', english: '9pm', chinese_tc: '9點' },
        ] },
        { placeholder: 'ふたり', label: 'Party size', options: [
          { value: 'ひとり', pronunciation: 'hi·to·ri', english: '1 person', chinese_tc: '一位' },
          { value: 'ふたり', pronunciation: 'fu·ta·ri', english: '2 people', chinese_tc: '兩位' },
          { value: 'さんにん', pronunciation: 'san·nin', english: '3 people', chinese_tc: '三位' },
          { value: 'よにん', pronunciation: 'yo·nin', english: '4 people', chinese_tc: '四位' },
        ] },
      ] },
      { speaker: 'staff', target: '少々お待ちください… はい、大丈夫です', pronunciation: 'shoushou omachi kudasai... hai, daijoubu desu', pronunciation_chunks: 'shou·shou o·ma·chi ku·da·sai hai dai·jou·bu de·su', english: 'One moment please... Yes, that\'s fine.', chinese_tc: '請稍等...好的，可以' },
      { speaker: 'staff', target: 'お名前をお願いします', pronunciation: 'onamae wo onegaishimasu', pronunciation_chunks: 'o·na·ma·e wo o·ne·gai·shi·ma·su', english: 'May I have your name?', chinese_tc: '請問您的名字？' },
      { speaker: 'you', target: 'アンソニーです', pronunciation: 'ansonii desu', pronunciation_chunks: 'an·so·nii de·su', english: 'Anthony.', chinese_tc: 'Anthony', note: 'Just say your name + です. Staff may repeat it back to confirm.' },
      { speaker: 'staff', target: '7時にお待ちしております', pronunciation: 'shichiji ni omachi shite orimasu', pronunciation_chunks: 'shi·chi·ji ni o·ma·chi shi·te o·ri·ma·su', english: 'We\'ll be expecting you at 7.', chinese_tc: '7點恭候您的到來' },
    ],
  },
  // === SC44: Restaurant — Non-smoking ===
  {
    id: 'sc44', lang: 'ja', group: 'restaurant',
    title: 'Choosing Your Seat', titleTC: '座位需求',
    emoji: '🪑', description: 'Requesting non-smoking, counter vs table, window seat',
    lines: [
      { speaker: 'staff', target: '何名様ですか？', pronunciation: 'nanmei sama desu ka', pronunciation_chunks: 'nan·mei sa·ma de·su ka', english: 'How many people?', chinese_tc: '請問幾位？' },
      { speaker: 'you', target: 'ふたりです。禁煙席をお願いします', pronunciation: 'futari desu. kinen seki wo onegaishimasu', pronunciation_chunks: 'fu·ta·ri de·su. ki·nen se·ki wo o·ne·gai·shi·ma·su', english: 'Two people. Non-smoking seat please.', chinese_tc: '兩位。請給我禁煙座位', note: 'Since 2020, most indoor restaurants in Japan are fully non-smoking. But some izakaya still have smoking areas.', variables: [
        { placeholder: 'ふたり', label: 'Party size', options: [
          { value: 'ひとり', pronunciation: 'hi·to·ri', english: '1 person', chinese_tc: '一位' },
          { value: 'ふたり', pronunciation: 'fu·ta·ri', english: '2 people', chinese_tc: '兩位' },
          { value: 'さんにん', pronunciation: 'san·nin', english: '3 people', chinese_tc: '三位' },
          { value: 'よにん', pronunciation: 'yo·nin', english: '4 people', chinese_tc: '四位' },
        ] },
      ] },
      { speaker: 'staff', target: 'カウンター席とテーブル席、どちらがよろしいですか？', pronunciation: 'kauntaa seki to teeburu seki, dochira ga yoroshii desu ka', pronunciation_chunks: 'kaun·taa se·ki to tee·bu·ru se·ki do·chi·ra ga yo·ro·shii de·su ka', english: 'Counter or table seat?', chinese_tc: '吧台還是桌位？' },
      { speaker: 'you', target: 'テーブル席でお願いします', pronunciation: 'teeburu seki de onegaishimasu', pronunciation_chunks: 'tee·bu·ru se·ki de o·ne·gai·shi·ma·su', english: 'Table seat please.', chinese_tc: '桌位' },
      { speaker: 'you', target: '窓側の席はありますか？', pronunciation: 'madogawa no seki wa arimasu ka', pronunciation_chunks: 'ma·do·ga·wa no se·ki wa a·ri·ma·su ka', english: 'Is there a window seat?', chinese_tc: '有靠窗的座位嗎？' },
      { speaker: 'staff', target: '少々お待ちください。ご案内いたします', pronunciation: 'shoushou omachi kudasai. go-annai itashimasu', pronunciation_chunks: 'shou·shou o·ma·chi ku·da·sai. go·an·nai i·ta·shi·ma·su', english: 'One moment. I\'ll show you to your seat.', chinese_tc: '請稍等。帶您入座' },
    ],
  },
  // ============================================================
  // RESTAURANT — Full flow
  // ============================================================
  {
    id: 'sc01',
    lang: 'ja',
    group: 'restaurant',
    title: 'Walk-in (No Reservation)',
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
    title: 'Arriving with Reservation',
    titleTC: '有預約進入餐廳',
    emoji: '📋',
    description: 'You booked a table for 6pm',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！', pronunciation: 'irasshaimase!', pronunciation_chunks: 'i·ras·shai·ma·se', english: 'Welcome!', chinese_tc: '歡迎光臨！' },
      { speaker: 'staff', target: '何名様ですか？', pronunciation: 'nanmei sama desu ka?', pronunciation_chunks: 'nan·mei sa·ma de·su ka', english: 'How many people?', chinese_tc: '請問幾位？' },
      { speaker: 'you', target: '6時に予約した○○です', pronunciation: 'roku-ji ni yoyaku shita ○○ desu', pronunciation_chunks: 'ro·ku·ji ni yo·ya·ku shi·ta ○○ de·su', english: 'I have a 6 o\'clock reservation, name is ○○', chinese_tc: '我預約了6點，姓○○', note: 'Replace ○○ with your name', variables: [
        { placeholder: '6時', label: 'Time', options: [
          { value: '6時', pronunciation: 'ro·ku·ji', english: '6pm', chinese_tc: '6點' },
          { value: '7時', pronunciation: 'shi·chi·ji', english: '7pm', chinese_tc: '7點' },
          { value: '8時', pronunciation: 'ha·chi·ji', english: '8pm', chinese_tc: '8點' },
          { value: '12時', pronunciation: 'juu·ni·ji', english: '12pm', chinese_tc: '12點' },
          { value: '1時', pronunciation: 'i·chi·ji', english: '1pm', chinese_tc: '1點' },
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
    title: 'Ordering from the Menu',
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
  // === SC45: Ordering a Set Meal ===
  {
    id: 'sc45', lang: 'ja', group: 'restaurant',
    title: 'Set Meal & Upgrades', titleTC: '點套餐/定食',
    emoji: '🍱', description: 'Set meal options, upgrades, rice size, soup swap',
    lines: [
      { speaker: 'staff', target: '定食になさいますか？単品になさいますか？', pronunciation: 'teishoku ni nasaimasu ka? tanpin ni nasaimasu ka?', pronunciation_chunks: 'tei·sho·ku ni na·sai·ma·su ka tan·pin ni na·sai·ma·su ka', english: 'Would you like a set meal or à la carte?', chinese_tc: '要套餐還是單點？', note: '定食 (teishoku) = set meal with rice, soup, side dishes. 単品 (tanpin) = just the main dish.' },
      { speaker: 'you', target: '定食でお願いします', pronunciation: 'teishoku de onegaishimasu', pronunciation_chunks: 'tei·sho·ku de o·ne·gai·shi·ma·su', english: 'Set meal please.', chinese_tc: '套餐' },
      { speaker: 'staff', target: 'ドリンクセットにしますか？プラス200円です', pronunciation: 'dorinku setto ni shimasu ka? purasu nihyaku en desu', pronunciation_chunks: 'do·rin·ku set·to ni shi·ma·su ka pu·ra·su ni·hya·ku en de·su', english: 'Would you like the drink set? Plus 200 yen.', chinese_tc: '要飲料套餐嗎？加200日圓' },
      { speaker: 'you', target: 'はい、コーヒーでお願いします', pronunciation: 'hai, koohii de onegaishimasu', pronunciation_chunks: 'hai koo·hii de o·ne·gai·shi·ma·su', english: 'Yes, coffee please.', chinese_tc: '好，咖啡' },
      { speaker: 'staff', target: 'ご飯の量はどうしますか？', pronunciation: 'gohan no ryou wa dou shimasu ka', pronunciation_chunks: 'go·han no ryou wa dou shi·ma·su ka', english: 'How much rice would you like?', chinese_tc: '飯量怎麼樣？' },
      { speaker: 'you', target: '大盛りでお願いします', pronunciation: 'oomori de onegaishimasu', pronunciation_chunks: 'oo·mo·ri de o·ne·gai·shi·ma·su', english: 'Large serving please.', chinese_tc: '大碗', note: '大盛り (oomori) = large. 普通 (futsuu) = regular. 少なめ (sukuname) = smaller. Many places offer 大盛り free!' },
      { speaker: 'you', target: '味噌汁を豚汁に変更できますか？', pronunciation: 'misoshiru wo tonjiru ni henkou dekimasu ka', pronunciation_chunks: 'mi·so·shi·ru wo ton·ji·ru ni hen·kou de·ki·ma·su ka', english: 'Can I change miso soup to pork soup?', chinese_tc: '味噌湯可以換豬肉湯嗎？', note: '豚汁 (tonjiru) = hearty pork & vegetable soup. Usually +¥100-200 upgrade.' },
      { speaker: 'staff', target: 'はい、プラス100円で変更できます', pronunciation: 'hai, purasu hyaku en de henkou dekimasu', pronunciation_chunks: 'hai pu·ra·su hya·ku en de hen·kou de·ki·ma·su', english: 'Yes, plus 100 yen for the change.', chinese_tc: '可以，加100日圓' },
    ],
  },
  {
    id: 'sc28',
    lang: 'ja',
    group: 'restaurant',
    title: 'Wrong Order & Declining',
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
  {
    id: 'sc04',
    lang: 'ja',
    group: 'restaurant',
    title: 'Asking for the Check',
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
    id: 'sc11',
    lang: 'ja',
    group: 'foodspots',
    title: 'Ordering Ramen (Ticket Machine)',
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
  {
    id: 'sc13',
    lang: 'ja',
    group: 'foodspots',
    title: 'Ordering at Sushi Counter',
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
    id: 'sc18',
    lang: 'ja',
    group: 'foodspots',
    title: 'Ordering Coffee & Sweets',
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
    id: 'sc22',
    lang: 'ja',
    group: 'foodspots',
    title: '"What\'s Nagoya Famous For?"',
    titleTC: '名古屋特色美食',
    emoji: '🍤',
    description: 'Ordering Nagoya\'s famous food — miso katsu, hitsumabushi, tebasaki',
    lines: [
      { speaker: 'staff', target: 'いらっしゃいませ！何名様ですか？', pronunciation: 'irasshaimase! nanmei sama desu ka?', pronunciation_chunks: 'i·ras·shai·ma·se! nan·mei sa·ma de·su ka', english: 'Welcome! How many?', chinese_tc: '歡迎光臨！幾位？' },
      { speaker: 'you', target: 'ふたりです。名古屋名物を食べたいのですが', pronunciation: 'futari desu. nagoya meibutsu wo tabetai no desu ga', pronunciation_chunks: 'fu·ta·ri de·su. na·go·ya mei·bu·tsu wo ta·be·tai no de·su ga', english: 'Two people. We\'d like to try Nagoya specialties.', chinese_tc: '兩位。我們想吃名古屋名物', note: '名物 (meibutsu) = local specialty. Nagoya is famous for unique food!' },
      { speaker: 'staff', target: '名古屋名物でしたら、味噌カツ、ひつまぶし、手羽先がおすすめです', pronunciation: 'nagoya meibutsu deshitara, miso katsu, hitsumabushi, tebasaki ga osusume desu', pronunciation_chunks: 'na·go·ya mei·bu·tsu de·shi·ta·ra, mi·so ka·tsu, hi·tsu·ma·bu·shi, te·ba·sa·ki ga o·su·su·me de·su', english: 'For Nagoya specialties, I recommend miso katsu, hitsumabushi, and tebasaki wings.', chinese_tc: '名古屋名物的話，推薦味噌豬排、鰻魚三吃、和雞翅', note: 'Your itinerary includes あつた蓬莱軒 for hitsumabushi and 矢場とん for miso katsu.' },
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
    id: 'sc10',
    lang: 'ja',
    group: 'shopping',
    title: 'Tax-Free Shopping',
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
  // === SC35: Department Store / Mall ===
  {
    id: 'sc35', lang: 'ja', group: 'shopping',
    title: 'Gift Wrapping & Floors', titleTC: '百貨公司',
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
  // === SC40: Shopping Returns ===
  {
    id: 'sc40', lang: 'ja', group: 'shopping',
    title: '"Can I Return This?"', titleTC: '退換貨',
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
  {
    id: 'sc05',
    lang: 'ja',
    group: 'daily',
    title: 'First Time at Konbini',
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
  // === SC34: Convenience Store Detailed ===
  {
    id: 'sc34', lang: 'ja', group: 'daily',
    title: 'Konbini Checkout Flow', titleTC: '便利店結帳',
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
  // === SC37: ATM / Money ===
  {
    id: 'sc37', lang: 'ja', group: 'daily',
    title: 'Withdrawing Cash (ATM)', titleTC: '便利店ATM',
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
    title: 'Hot & Cold Drinks Machine', titleTC: '自動販賣機',
    emoji: '🥤', description: 'Using Japan\'s famous vending machines',
    lines: [
      { speaker: 'you', target: 'この自動販売機、ICカードは使えますか？', pronunciation: 'kono jidou hanbaiki, ai-shii kaado wa tsukaemasu ka', pronunciation_chunks: 'ko·no ji·dou han·bai·ki ai·shii kaa·do wa tsu·ka·e·ma·su ka', english: 'Can I use an IC card on this vending machine?', chinese_tc: '這台自動販賣機可以用IC卡嗎？', note: 'Look for the IC card symbol. Tap your Suica/Manaca on the reader, then press your drink.' },
      { speaker: 'staff', target: 'はい、ここにタッチしてからボタンを押してください', pronunciation: 'hai, koko ni tacchi shite kara botan wo oshite kudasai', pronunciation_chunks: 'hai ko·ko ni tat·chi shi·te ka·ra bo·tan wo o·shi·te ku·da·sai', english: 'Yes, tap here first then press the button.', chinese_tc: '可以，先在這裡感應再按按鈕' },
      { speaker: 'you', target: 'ホットとコールド、どっちですか？', pronunciation: 'hotto to koorudo, dotchi desu ka', pronunciation_chunks: 'hot·to to koo·ru·do dot·chi de·su ka', english: 'Is it hot or cold?', chinese_tc: '是熱的還是冷的？', note: 'Red label = hot (あたたかい), Blue label = cold (つめたい). Winter machines have both!' },
    ],
  },
  // === SC41: Grocery / Market ===
  {
    id: 'sc41', lang: 'ja', group: 'daily',
    title: 'Asking About Fresh Food', titleTC: '超市與市場',
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
  {
    id: 'sc15',
    lang: 'ja',
    group: 'activities',
    title: 'Temple & Shrine Etiquette',
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
    id: 'sc23',
    lang: 'ja',
    group: 'activities',
    title: 'Exploring Nagoya Castle',
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
      { speaker: 'staff', target: 'はい、部屋のタオルをお持ちください。タオルは浴槽に入れないでください', pronunciation: 'hai, heya no taoru wo omochi kudasai. taoru wa yokusou ni irenaide kudasai', pronunciation_chunks: 'hai he·ya no ta·o·ru wo o·mo·chi ku·da·sai ta·o·ru wa yo·ku·sou ni i·re·nai·de ku·da·sai', english: 'Yes, bring the towel from your room. Please do not put it in the bath.', chinese_tc: '可以，請帶房間內的毛巾。請不要把毛巾放進浴池' },
      { speaker: 'you', target: '浴衣とスリッパのまま行ってもいいですか？', pronunciation: 'yukata to surippa no mama itte mo ii desu ka', pronunciation_chunks: 'yu·ka·ta to su·rip·pa no ma·ma it·te mo ii de·su ka', english: 'May I go there wearing the yukata and slippers?', chinese_tc: '可以直接穿浴衣和拖鞋去嗎？' },
      { speaker: 'staff', target: 'はい、館内では浴衣とスリッパで大丈夫です', pronunciation: 'hai, kannai de wa yukata to surippa de daijoubu desu', pronunciation_chunks: 'hai kan·nai de wa yu·ka·ta to su·rip·pa de dai·jou·bu de·su', english: 'Yes, yukata and slippers are fine inside the hotel.', chinese_tc: '可以，在館內穿浴衣和拖鞋沒有問題' },
    ],
  },
  {
    id: 'sc20',
    lang: 'ja',
    group: 'activities',
    title: '"Can You Take Our Photo?"',
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
  {
    id: 'sc24',
    lang: 'ja',
    group: 'activities',
    title: 'Enjoying the Lights',
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
  // === SC36: Karaoke ===
  {
    id: 'sc36', lang: 'ja', group: 'activities',
    title: 'Karaoke Night Out', titleTC: '卡拉OK',
    emoji: '🎤', description: 'Booking a room, ordering drinks, extending time',
    lines: [
      { speaker: 'you', target: 'ふたりで一時間お願いします', pronunciation: 'futari de ichijikan onegaishimasu', pronunciation_chunks: 'fu·ta·ri de i·chi·ji·kan o·ne·gai·shi·ma·su', english: 'Two people, one hour please.', chinese_tc: '兩位，一小時', variables: [
        { placeholder: 'ふたり', label: 'Party size', options: [
          { value: 'ふたり', pronunciation: 'fu·ta·ri', english: 'Two people', chinese_tc: '兩位' },
          { value: 'さんにん', pronunciation: 'san·nin', english: 'Three people', chinese_tc: '三位' },
          { value: 'よにん', pronunciation: 'yo·nin', english: 'Four people', chinese_tc: '四位' },
        ] },
        { placeholder: '一時間', label: 'Duration', options: [
          { value: '一時間', pronunciation: 'i·chi·ji·kan', english: 'one hour', chinese_tc: '一小時' },
          { value: '二時間', pronunciation: 'ni·ji·kan', english: 'two hours', chinese_tc: '兩小時' },
          { value: '三時間', pronunciation: 'san·ji·kan', english: 'three hours', chinese_tc: '三小時' },
        ] },
      ] },
      { speaker: 'staff', target: 'ドリンクバーのプランでよろしいですか？', pronunciation: 'dorinku baa no puran de yoroshii desu ka', pronunciation_chunks: 'do·rin·ku baa no pu·ran de yo·ro·shii de·su ka', english: 'Is the drink bar plan okay?', chinese_tc: '飲料吧方案可以嗎？', note: 'Most karaoke requires a drink order. ドリンクバー = unlimited drinks, usually best value.' },
      { speaker: 'you', target: 'はい、それでお願いします', pronunciation: 'hai, sore de onegaishimasu', pronunciation_chunks: 'hai so·re de o·ne·gai·shi·ma·su', english: 'Yes, that\'s fine.', chinese_tc: '好的' },
      { speaker: 'staff', target: '305号室です。こちらへどうぞ', pronunciation: 'sanbyaku go gou-shitsu desu. kochira e douzo', pronunciation_chunks: 'san·bya·ku go gou·shi·tsu de·su ko·chi·ra e dou·zo', english: 'Room 305. This way please.', chinese_tc: '305號房。這邊請' },
      { speaker: 'you', target: '延長できますか？', pronunciation: 'enchou dekimasu ka', pronunciation_chunks: 'en·chou de·ki·ma·su ka', english: 'Can we extend?', chinese_tc: '可以延長嗎？' },
      { speaker: 'staff', target: 'はい、30分ごとに延長できます', pronunciation: 'hai, sanjuppun goto ni enchou dekimasu', pronunciation_chunks: 'hai san·jup·pun go·to ni en·chou de·ki·ma·su', english: 'Yes, you can extend in 30-minute blocks.', chinese_tc: '可以，每30分鐘延長一次' },
      { speaker: 'you', target: 'あと30分お願いします', pronunciation: 'ato sanjuppun onegaishimasu', pronunciation_chunks: 'a·to san·jup·pun o·ne·gai·shi·ma·su', english: '30 more minutes please.', chinese_tc: '再加30分鐘', variables: [
        { placeholder: '30分', label: 'Extension', options: [
          { value: '30分', pronunciation: 'san·jup·pun', english: '30 minutes', chinese_tc: '30分鐘' },
          { value: '一時間', pronunciation: 'i·chi·ji·kan', english: 'one hour', chinese_tc: '一小時' },
        ] },
      ] },
    ],
  },
  {
    id: 'sc25',
    lang: 'ja',
    group: 'activities',
    title: '"It\'s So Cold Today!"',
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
    id: 'sc17',
    lang: 'ja',
    group: 'trouble',
    title: '"I Left Something Behind"',
    titleTC: '遺失物品',
    emoji: '😰',
    description: 'You left something on a train or at a restaurant',
    lines: [
      { speaker: 'you', target: 'すみません、忘れ物をしたのですが...', pronunciation: 'sumimasen, wasuremono wo shita no desu ga...', pronunciation_chunks: 'su·mi·ma·sen, wa·su·re·mo·no wo shi·ta no de·su ga', english: 'Excuse me, I left something behind...', chinese_tc: '不好意思，我忘了東西...' },
      { speaker: 'staff', target: '何をお忘れになりましたか？', pronunciation: 'nani wo owasure ni narimashita ka?', pronunciation_chunks: 'na·ni wo o·wa·su·re ni na·ri·ma·shi·ta ka', english: 'What did you leave behind?', chinese_tc: '您忘了什麼？' },
      { speaker: 'you', target: '黒い鞄を電車の中に忘れました', pronunciation: 'kuroi kaban wo densha no naka ni wasuremashita', pronunciation_chunks: 'ku·roi ka·ban wo den·sha no na·ka ni wa·su·re·ma·shi·ta', english: 'I left a black bag on the train', chinese_tc: '我把黑色包包忘在電車裡了', variables: [
        { placeholder: '黒い鞄', label: 'Item', options: [
          { value: '黒い鞄', pronunciation: 'ku·roi ka·ban', english: 'black bag', chinese_tc: '黑色包包' },
          { value: '傘', pronunciation: 'ka·sa', english: 'umbrella', chinese_tc: '雨傘' },
          { value: '携帯電話', pronunciation: 'kei·tai·den·wa', english: 'mobile phone', chinese_tc: '手機' },
          { value: '財布', pronunciation: 'sai·fu', english: 'wallet', chinese_tc: '錢包' },
          { value: 'カメラ', pronunciation: 'ka·me·ra', english: 'camera', chinese_tc: '相機' },
          { value: '帽子', pronunciation: 'bou·shi', english: 'hat', chinese_tc: '帽子' },
        ] },
        { placeholder: '電車の中', label: 'Location', options: [
          { value: '電車の中', pronunciation: 'den·sha no na·ka', english: 'on the train', chinese_tc: '電車上' },
          { value: 'タクシーの中', pronunciation: 'ta·ku·shii no na·ka', english: 'in the taxi', chinese_tc: '計程車裡' },
          { value: 'レストラン', pronunciation: 're·su·to·ran', english: 'at the restaurant', chinese_tc: '餐廳' },
          { value: 'ホテルの部屋', pronunciation: 'ho·te·ru no he·ya', english: 'in the hotel room', chinese_tc: '飯店房間' },
        ] },
      ] },
      { speaker: 'staff', target: '何線をご利用でしたか？何時ごろですか？', pronunciation: 'nanisen wo goriyou deshita ka? nanji goro desu ka?', pronunciation_chunks: 'na·ni·sen wo go·ri·you de·shi·ta ka? nan·ji go·ro de·su ka', english: 'What line were you on? Around what time?', chinese_tc: '您搭什麼線？大約幾點？' },
      { speaker: 'you', target: '山手線で、2時ごろです', pronunciation: 'yamanote sen de, niji goro desu', pronunciation_chunks: 'ya·ma·no·te sen de, ni·ji go·ro de·su', english: 'Yamanote Line, around 2pm', chinese_tc: '山手線，大約2點', variables: [
        { placeholder: '山手線', label: 'Train line', options: [
          { value: '山手線', pronunciation: 'ya·ma·no·te·sen', english: 'Yamanote Line', chinese_tc: '山手線' },
          { value: '中央線', pronunciation: 'chuu·ou·sen', english: 'Chuo Line', chinese_tc: '中央線' },
          { value: '銀座線', pronunciation: 'gin·za·sen', english: 'Ginza Line', chinese_tc: '銀座線' },
          { value: '東海道線', pronunciation: 'tou·kai·dou·sen', english: 'Tokaido Line', chinese_tc: '東海道線' },
          { value: '名城線', pronunciation: 'mei·jou·sen', english: 'Meijo Line', chinese_tc: '名城線' },
        ] },
        { placeholder: '2時', label: 'Time', options: [
          { value: '12時', pronunciation: 'juu·ni·ji', english: '12pm', chinese_tc: '12點' },
          { value: '2時', pronunciation: 'ni·ji', english: '2pm', chinese_tc: '2點' },
          { value: '4時', pronunciation: 'yo·ji', english: '4pm', chinese_tc: '4點' },
          { value: '6時', pronunciation: 'ro·ku·ji', english: '6pm', chinese_tc: '6點' },
          { value: '8時', pronunciation: 'ha·chi·ji', english: '8pm', chinese_tc: '8點' },
        ] },
      ] },
      { speaker: 'staff', target: 'わかりました。忘れ物センターに確認いたします', pronunciation: 'wakarimashita. wasuremono sentaa ni kakunin itashimasu', pronunciation_chunks: 'wa·ka·ri·ma·shi·ta. wa·su·re·mo·no sen·taa ni ka·ku·nin i·ta·shi·ma·su', english: 'Understood. I\'ll check with the lost and found center.', chinese_tc: '了解。我跟失物中心確認', note: 'Japan has amazing lost-item return rates — over 80%! Always report to station staff.' },
      { speaker: 'staff', target: 'お名前と電話番号をお願いします', pronunciation: 'onamae to denwa bangou wo onegaishimasu', pronunciation_chunks: 'o·na·ma·e to den·wa ban·gou wo o·ne·gai·shi·ma·su', english: 'Your name and phone number please.', chinese_tc: '請給我您的姓名和電話號碼' },
      { speaker: 'you', target: 'ホテルの電話番号でもいいですか？', pronunciation: 'hoteru no denwa bangou de mo ii desu ka?', pronunciation_chunks: 'ho·te·ru no den·wa ban·gou de mo ii de·su ka', english: 'Can I give my hotel\'s phone number?', chinese_tc: '可以給飯店的電話嗎？' },
    ],
  },
  {
    id: 'sc19',
    lang: 'ja',
    group: 'trouble',
    title: 'Buying Medicine',
    titleTC: '藥局',
    emoji: '💊',
    description: 'Buying medicine for common travel ailments',
    lines: [
      { speaker: 'you', target: 'すみません、頭痛薬はありますか？', pronunciation: 'sumimasen, zutsuu yaku wa arimasu ka?', pronunciation_chunks: 'su·mi·ma·sen, zu·tsuu ya·ku wa a·ri·ma·su ka', english: 'Excuse me, do you have headache medicine?', chinese_tc: '不好意思，有頭痛藥嗎？', variables: [
        { placeholder: '頭痛薬', label: 'Medicine', options: [
          { value: '頭痛薬', pronunciation: 'zu·tsuu ya·ku', english: 'headache medicine', chinese_tc: '頭痛藥' },
          { value: '胃薬', pronunciation: 'i·gu·su·ri', english: 'stomach medicine', chinese_tc: '胃藥' },
          { value: '風邪薬', pronunciation: 'ka·ze·gu·su·ri', english: 'cold medicine', chinese_tc: '感冒藥' },
          { value: '下痢止め', pronunciation: 'ge·ri·do·me', english: 'anti-diarrhea', chinese_tc: '止瀉藥' },
          { value: '酔い止め', pronunciation: 'yo·i·do·me', english: 'motion sickness', chinese_tc: '暈車藥' },
          { value: '目薬', pronunciation: 'me·gu·su·ri', english: 'eye drops', chinese_tc: '眼藥水' },
          { value: '絆創膏', pronunciation: 'ban·sou·kou', english: 'bandaid', chinese_tc: 'OK繃' },
          { value: '日焼け止め', pronunciation: 'hi·ya·ke·do·me', english: 'sunscreen', chinese_tc: '防曬' },
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
  // === SC31: Feeling Sick / Medical ===
  {
    id: 'sc31', lang: 'ja', group: 'trouble',
    title: 'I\'m Not Feeling Well', titleTC: '身體不舒服',
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

  // ============================================================
  // CENTRAL JAPAN ITINERARY — LOCAL STAYS, DIRECTIONS & FOOD
  // ============================================================
  {
    id: 'sc53', lang: 'ja', group: 'stays',
    title: 'Checking In at a Ryokan', titleTC: '入住日式旅館',
    emoji: '🛖', description: 'Shoes, tatami room, meal times, futon, and onsen information',
    lines: [
      { speaker: 'you', target: 'こんばんは。予約した○○です', pronunciation: 'konbanwa. yoyaku shita ○○ desu', pronunciation_chunks: 'kon·ban·wa yo·ya·ku shi·ta ○○ de·su', english: 'Good evening. I have a reservation under ○○.', chinese_tc: '晚上好，我有預約，姓○○' },
      { speaker: 'staff', target: 'いらっしゃいませ。こちらで靴を脱いで、スリッパにお履き替えください', pronunciation: 'irasshaimase. kochira de kutsu wo nuide, surippa ni ohakikae kudasai', pronunciation_chunks: 'i·ras·shai·ma·se ko·chi·ra de ku·tsu wo nui·de su·rip·pa ni o·ha·ki·ka·e ku·da·sai', english: 'Welcome. Please remove your shoes here and change into slippers.', chinese_tc: '歡迎光臨。請在這裡脫鞋並換上拖鞋' },
      { speaker: 'you', target: '夕食付きのプランですか？', pronunciation: 'yuushoku tsuki no puran desu ka', pronunciation_chunks: 'yuu·sho·ku tsu·ki no pu·ran de·su ka', english: 'Does our plan include dinner?', chinese_tc: '我們的住宿方案包含晚餐嗎？' },
      { speaker: 'staff', target: 'はい、夕食と朝食が付いております', pronunciation: 'hai, yuushoku to choushoku ga tsuite orimasu', pronunciation_chunks: 'hai yuu·sho·ku to chou·sho·ku ga tsui·te o·ri·ma·su', english: 'Yes, dinner and breakfast are included.', chinese_tc: '是的，包含晚餐和早餐' },
      { speaker: 'staff', target: '夕食は六時か六時半をお選びいただけます', pronunciation: 'yuushoku wa rokuji ka rokuji han wo oerabi itadakemasu', pronunciation_chunks: 'yuu·sho·ku wa ro·ku·ji ka ro·ku·ji·han wo o·e·ra·bi i·ta·da·ke·ma·su', english: 'You may choose dinner at 6:00 or 6:30.', chinese_tc: '晚餐可以選擇6點或6點半' },
      { speaker: 'you', target: '六時半でお願いします。食事は部屋ですか？', pronunciation: 'rokuji han de onegaishimasu. shokuji wa heya desu ka', pronunciation_chunks: 'ro·ku·ji·han de o·ne·gai·shi·ma·su sho·ku·ji wa he·ya de·su ka', english: '6:30 please. Is the meal served in our room?', chinese_tc: '請安排6點半。餐點是在房間享用嗎？', options: [
        { target: '六時でお願いします', pronunciation: 'rokuji de onegaishimasu', pronunciation_chunks: 'ro·ku·ji de o·ne·gai·shi·ma·su', english: '6:00 please', chinese_tc: '請安排6點' },
        { target: '六時半でお願いします。食事は部屋ですか？', pronunciation: 'rokuji han de onegaishimasu. shokuji wa heya desu ka', pronunciation_chunks: 'ro·ku·ji·han de o·ne·gai·shi·ma·su sho·ku·ji wa he·ya de·su ka', english: '6:30 please. Is the meal in our room?', chinese_tc: '請安排6點半。餐點是在房間嗎？' },
      ] },
      { speaker: 'staff', target: '二階の食事処でご用意します。お食事中に布団を敷きます', pronunciation: 'nikai no shokujidokoro de goyoui shimasu. oshokujichuu ni futon wo shikimasu', pronunciation_chunks: 'ni·kai no sho·ku·ji·do·ko·ro de go·you·i shi·ma·su o·sho·ku·ji·chuu ni fu·ton wo shi·ki·ma·su', english: 'Dinner will be served in the dining room on the second floor. We will lay out the futon while you eat.', chinese_tc: '晚餐在二樓用餐處。我們會在您用餐時鋪好日式床墊' },
      { speaker: 'you', target: '大浴場は何時までですか？', pronunciation: 'daiyokujou wa nanji made desu ka', pronunciation_chunks: 'dai·yo·ku·jou wa nan·ji ma·de de·su ka', english: 'Until what time is the communal bath open?', chinese_tc: '大浴場開放到幾點？' },
      { speaker: 'staff', target: '利用時間はこちらに書いてあります。部屋のタオルをお持ちください', pronunciation: 'riyou jikan wa kochira ni kaite arimasu. heya no taoru wo omochi kudasai', pronunciation_chunks: 'ri·you ji·kan wa ko·chi·ra ni kai·te a·ri·ma·su he·ya no ta·o·ru wo o·mo·chi ku·da·sai', english: 'The hours are written here. Please bring the towel from your room.', chinese_tc: '使用時間寫在這裡。請帶房間裡的毛巾' },
    ],
  },
  {
    id: 'sc54', lang: 'ja', group: 'stays',
    title: 'Staying at a Shukubo', titleTC: '入住寺院宿坊',
    emoji: '🛕', description: 'Checking house rules, shared facilities, curfew, meals, and morning practice',
    lines: [
      { speaker: 'you', target: '宿坊に泊まるのは初めてです', pronunciation: 'shukubou ni tomaru no wa hajimete desu', pronunciation_chunks: 'shu·ku·bou ni to·ma·ru no wa ha·ji·me·te de·su', english: 'This is my first time staying at a temple lodging.', chinese_tc: '這是我第一次住寺院宿坊' },
      { speaker: 'staff', target: '館内の決まりをご説明します', pronunciation: 'kannai no kimari wo gosetsumei shimasu', pronunciation_chunks: 'kan·nai no ki·ma·ri wo go·se·tsu·mei shi·ma·su', english: 'I will explain the house rules.', chinese_tc: '我來說明館內規定' },
      { speaker: 'you', target: 'お手洗いとお風呂は共同ですか？', pronunciation: 'otearai to ofuro wa kyoudou desu ka', pronunciation_chunks: 'o·te·a·rai to o·fu·ro wa kyou·dou de·su ka', english: 'Are the toilet and bath shared?', chinese_tc: '洗手間和浴室是共用的嗎？' },
      { speaker: 'staff', target: 'はい、どちらも共同です。お風呂は十時までです', pronunciation: 'hai, dochira mo kyoudou desu. ofuro wa juuji made desu', pronunciation_chunks: 'hai do·chi·ra mo kyou·dou de·su o·fu·ro wa juu·ji ma·de de·su', english: 'Yes, both are shared. The bath is available until 10pm.', chinese_tc: '是的，兩者都是共用。浴室開放到晚上10點' },
      { speaker: 'you', target: '門限はありますか？', pronunciation: 'mongen wa arimasu ka', pronunciation_chunks: 'mon·gen wa a·ri·ma·su ka', english: 'Is there a curfew?', chinese_tc: '有門禁時間嗎？' },
      { speaker: 'staff', target: '夜九時に玄関を閉めます。それまでにお戻りください', pronunciation: 'yoru kuji ni genkan wo shimemasu. sore made ni omodori kudasai', pronunciation_chunks: 'yo·ru ku·ji ni gen·kan wo shi·me·ma·su so·re ma·de ni o·mo·do·ri ku·da·sai', english: 'We close the entrance at 9pm. Please return before then.', chinese_tc: '晚上9點會關閉入口，請在那之前回來' },
      { speaker: 'you', target: '朝のお勤めには参加できますか？', pronunciation: 'asa no otsutome ni wa sanka dekimasu ka', pronunciation_chunks: 'a·sa no o·tsu·to·me ni wa san·ka de·ki·ma·su ka', english: 'May I join the morning prayer service?', chinese_tc: '我可以參加早課嗎？' },
      { speaker: 'staff', target: 'はい、自由にご参加いただけます。六時に本堂へお越しください', pronunciation: 'hai, jiyuu ni gosanka itadakemasu. rokuji ni hondou e okoshi kudasai', pronunciation_chunks: 'hai ji·yuu ni go·san·ka i·ta·da·ke·ma·su ro·ku·ji ni hon·dou e o·ko·shi ku·da·sai', english: 'Yes, participation is optional. Please come to the main hall at 6am.', chinese_tc: '可以，自由參加。請在早上6點到本堂' },
      { speaker: 'you', target: '明日の朝、早く出発しても大丈夫ですか？', pronunciation: 'ashita no asa, hayaku shuppatsu shite mo daijoubu desu ka', pronunciation_chunks: 'a·shi·ta no a·sa ha·ya·ku shup·pa·tsu shi·te mo dai·jou·bu de·su ka', english: 'Is it okay if I leave early tomorrow morning?', chinese_tc: '我明天早上提早出發可以嗎？' },
      { speaker: 'staff', target: 'はい。鍵はこちらの箱にお返しください', pronunciation: 'hai. kagi wa kochira no hako ni okaeshi kudasai', pronunciation_chunks: 'hai ka·gi wa ko·chi·ra no ha·ko ni o·ka·e·shi ku·da·sai', english: 'Yes. Please return the key in this box.', chinese_tc: '可以。請把鑰匙放回這個箱子' },
    ],
  },
  {
    id: 'sc55', lang: 'ja', group: 'activities',
    title: 'Visiting a Day-Use Onsen', titleTC: '日歸溫泉入浴',
    emoji: '♨️', description: 'Paying for entry, renting towels, storing valuables, and asking about bath rules',
    lines: [
      { speaker: 'you', target: 'すみません、日帰り入浴はできますか？', pronunciation: 'sumimasen, higaeri nyuuyoku wa dekimasu ka', pronunciation_chunks: 'su·mi·ma·sen hi·ga·e·ri nyuu·yo·ku wa de·ki·ma·su ka', english: 'Excuse me, is day-use bathing available?', chinese_tc: '不好意思，可以只泡日歸溫泉嗎？' },
      { speaker: 'staff', target: 'はい、ご利用いただけます', pronunciation: 'hai, goriyou itadakemasu', pronunciation_chunks: 'hai go·ri·you i·ta·da·ke·ma·su', english: 'Yes, it is available.', chinese_tc: '可以使用' },
      { speaker: 'you', target: '入浴料はいくらですか？', pronunciation: 'nyuuyokuryou wa ikura desu ka', pronunciation_chunks: 'nyuu·yo·ku·ryou wa i·ku·ra de·su ka', english: 'How much is the bathing fee?', chinese_tc: '泡湯費用是多少？' },
      { speaker: 'staff', target: '料金はこちらです。タオルは別料金になります', pronunciation: 'ryoukin wa kochira desu. taoru wa betsuryoukin ni narimasu', pronunciation_chunks: 'ryou·kin wa ko·chi·ra de·su ta·o·ru wa be·tsu·ryou·kin ni na·ri·ma·su', english: 'The fee is shown here. Towels cost extra.', chinese_tc: '費用寫在這裡。毛巾需要另外付費' },
      { speaker: 'you', target: 'タオルを二枚借りたいです', pronunciation: 'taoru wo nimai karitai desu', pronunciation_chunks: 'ta·o·ru wo ni·mai ka·ri·tai de·su', english: 'I would like to rent two towels.', chinese_tc: '我想租兩條毛巾', options: [
        { target: 'タオルを一枚借りたいです', pronunciation: 'taoru wo ichimai karitai desu', pronunciation_chunks: 'ta·o·ru wo i·chi·mai ka·ri·tai de·su', english: 'I would like to rent one towel', chinese_tc: '我想租一條毛巾' },
        { target: 'タオルを二枚借りたいです', pronunciation: 'taoru wo nimai karitai desu', pronunciation_chunks: 'ta·o·ru wo ni·mai ka·ri·tai de·su', english: 'I would like to rent two towels', chinese_tc: '我想租兩條毛巾' },
      ] },
      { speaker: 'you', target: '貴重品ロッカーはありますか？', pronunciation: 'kichouhin rokkaa wa arimasu ka', pronunciation_chunks: 'ki·chou·hin rok·kaa wa a·ri·ma·su ka', english: 'Are there lockers for valuables?', chinese_tc: '有貴重物品置物櫃嗎？' },
      { speaker: 'staff', target: '脱衣所に鍵付きのロッカーがあります', pronunciation: 'datsuijo ni kagitsuki no rokkaa ga arimasu', pronunciation_chunks: 'da·tsu·i·jo ni ka·gi·tsu·ki no rok·kaa ga a·ri·ma·su', english: 'There are lockers with keys in the changing room.', chinese_tc: '更衣室內有附鎖的置物櫃' },
      { speaker: 'you', target: '貸切風呂は予約できますか？', pronunciation: 'kashikiriburo wa yoyaku dekimasu ka', pronunciation_chunks: 'ka·shi·ki·ri·bu·ro wa yo·ya·ku de·ki·ma·su ka', english: 'Can I reserve a private bath?', chinese_tc: '可以預約私人溫泉嗎？' },
      { speaker: 'staff', target: '空き時間を確認します。先に体を洗ってから浴槽にお入りください', pronunciation: 'akijikan wo kakunin shimasu. saki ni karada wo aratte kara yokusou ni ohairi kudasai', pronunciation_chunks: 'a·ki·ji·kan wo ka·ku·nin shi·ma·su sa·ki ni ka·ra·da wo a·rat·te ka·ra yo·ku·sou ni o·hai·ri ku·da·sai', english: 'I will check the available times. Please wash before entering the bath.', chinese_tc: '我幫您確認空檔。請先洗淨身體再進入浴池' },
    ],
  },
  {
    id: 'sc56', lang: 'ja', group: 'train',
    title: 'Finding the Train to Narai-juku', titleTC: '搭電車前往奈良井宿',
    emoji: '🛤️', description: 'Confirming the train, transfer station, platform, and connection time',
    lines: [
      { speaker: 'you', target: 'すみません、奈良井宿へ行きたいのですが', pronunciation: 'sumimasen, naraijuku e ikitai no desu ga', pronunciation_chunks: 'su·mi·ma·sen na·rai·ju·ku e i·ki·tai no de·su ga', english: 'Excuse me, I would like to go to Narai-juku.', chinese_tc: '不好意思，我想去奈良井宿' },
      { speaker: 'staff', target: '長野から特急しなので塩尻まで行き、普通列車に乗り換えてください', pronunciation: 'nagano kara tokkyuu shinano de shiojiri made iki, futsuu ressha ni norikaete kudasai', pronunciation_chunks: 'na·ga·no ka·ra tok·kyuu shi·na·no de shi·o·ji·ri ma·de i·ki fu·tsuu res·sha ni no·ri·ka·e·te ku·da·sai', english: 'Take the Limited Express Shinano from Nagano to Shiojiri, then transfer to a local train.', chinese_tc: '從長野搭特急信濃號到鹽尻，再轉乘普通列車' },
      { speaker: 'you', target: '直通ではないですか？', pronunciation: 'chokutsuu de wa nai desu ka', pronunciation_chunks: 'cho·ku·tsuu de wa nai de·su ka', english: 'Is it not a direct train?', chinese_tc: '不是直達車嗎？' },
      { speaker: 'staff', target: 'はい、塩尻で乗り換えが必要です', pronunciation: 'hai, shiojiri de norikae ga hitsuyou desu', pronunciation_chunks: 'hai shi·o·ji·ri de no·ri·ka·e ga hi·tsu·you de·su', english: 'Correct, a transfer at Shiojiri is required.', chinese_tc: '是的，需要在鹽尻轉車' },
      { speaker: 'you', target: '乗り換え時間はどのくらいありますか？', pronunciation: 'norikae jikan wa dono kurai arimasu ka', pronunciation_chunks: 'no·ri·ka·e ji·kan wa do·no ku·rai a·ri·ma·su ka', english: 'How much connection time is there?', chinese_tc: '轉車時間有多久？' },
      { speaker: 'staff', target: 'この経路の接続時間をお調べします', pronunciation: 'kono keiro no setsuzoku jikan wo oshirabe shimasu', pronunciation_chunks: 'ko·no kei·ro no se·tsu·zo·ku ji·kan wo o·shi·ra·be shi·ma·su', english: 'I will check the connection time for this route.', chinese_tc: '我幫您查這條路線的轉乘時間' },
      { speaker: 'you', target: '特急しなのは何番線から出ますか？', pronunciation: 'tokkyuu shinano wa nanbansen kara demasu ka', pronunciation_chunks: 'tok·kyuu shi·na·no wa nan·ban·sen ka·ra de·ma·su ka', english: 'Which platform does the Limited Express Shinano leave from?', chinese_tc: '特急信濃號從幾號月台出發？' },
      { speaker: 'staff', target: '発車標で列車名と番線をご確認ください', pronunciation: 'hasshahyou de resshamei to bansen wo gokakunin kudasai', pronunciation_chunks: 'has·sha·hyou de res·sha·mei to ban·sen wo go·ka·ku·nin ku·da·sai', english: 'Please confirm the train name and platform on the departure board.', chinese_tc: '請在發車資訊板確認列車名稱和月台' },
      { speaker: 'you', target: '帰りの最終電車も教えてください', pronunciation: 'kaeri no saishuu densha mo oshiete kudasai', pronunciation_chunks: 'ka·e·ri no sai·shuu den·sha mo o·shi·e·te ku·da·sai', english: 'Please also tell me the last train back.', chinese_tc: '也請告訴我回程末班電車' },
    ],
  },
  {
    id: 'sc57', lang: 'ja', group: 'transit',
    title: 'Finding the Bus in Kanazawa', titleTC: '在金澤找巴士',
    emoji: '🚏', description: 'Finding the correct stop, confirming the destination, and knowing where to get off',
    lines: [
      { speaker: 'you', target: 'すみません、兼六園へ行くバスはどこですか？', pronunciation: 'sumimasen, kenrokuen e iku basu wa doko desu ka', pronunciation_chunks: 'su·mi·ma·sen ken·ro·ku·en e i·ku ba·su wa do·ko de·su ka', english: 'Excuse me, where is the bus to Kenrokuen?', chinese_tc: '不好意思，去兼六園的巴士在哪裡？' },
      { speaker: 'staff', target: '東口のバスターミナルから出ます', pronunciation: 'higashiguchi no basu taaminaru kara demasu', pronunciation_chunks: 'hi·ga·shi·gu·chi no ba·su taa·mi·na·ru ka·ra de·ma·su', english: 'It leaves from the east-exit bus terminal.', chinese_tc: '從東口巴士總站出發' },
      { speaker: 'you', target: '何番乗り場ですか？', pronunciation: 'nanban noriba desu ka', pronunciation_chunks: 'nan·ban no·ri·ba de·su ka', english: 'Which boarding stop is it?', chinese_tc: '是幾號乘車處？' },
      { speaker: 'staff', target: '案内表示で兼六園方面をご確認ください', pronunciation: 'annai hyouji de kenrokuen houmen wo gokakunin kudasai', pronunciation_chunks: 'an·nai hyou·ji de ken·ro·ku·en hou·men wo go·ka·ku·nin ku·da·sai', english: 'Please check the display for buses toward Kenrokuen.', chinese_tc: '請在資訊顯示板確認兼六園方向' },
      { speaker: 'you', target: 'このバスは兼六園下に停まりますか？', pronunciation: 'kono basu wa kenrokuenshita ni tomarimasu ka', pronunciation_chunks: 'ko·no ba·su wa ken·ro·ku·en·shi·ta ni to·ma·ri·ma·su ka', english: 'Does this bus stop at Kenrokuen-shita?', chinese_tc: '這班巴士停兼六園下嗎？' },
      { speaker: 'staff', target: 'はい、停まります', pronunciation: 'hai, tomarimasu', pronunciation_chunks: 'hai to·ma·ri·ma·su', english: 'Yes, it does.', chinese_tc: '是的，會停' },
      { speaker: 'you', target: '着いたら教えていただけますか？', pronunciation: 'tsuitara oshiete itadakemasu ka', pronunciation_chunks: 'tsui·ta·ra o·shi·e·te i·ta·da·ke·ma·su ka', english: 'Could you tell me when we arrive?', chinese_tc: '到站時可以告訴我嗎？' },
      { speaker: 'staff', target: 'わかりました。降りる時は後ろのボタンを押してください', pronunciation: 'wakarimashita. oriru toki wa ushiro no botan wo oshite kudasai', pronunciation_chunks: 'wa·ka·ri·ma·shi·ta o·ri·ru to·ki wa u·shi·ro no bo·tan wo o·shi·te ku·da·sai', english: 'Certainly. Press the button behind you when you want to get off.', chinese_tc: '好的。下車時請按後方的按鈕' },
      { speaker: 'you', target: '帰りのバス停も同じ場所ですか？', pronunciation: 'kaeri no basutei mo onaji basho desu ka', pronunciation_chunks: 'ka·e·ri no ba·su·tei mo o·na·ji ba·sho de·su ka', english: 'Is the return bus stop in the same place?', chinese_tc: '回程巴士站也是同一個地方嗎？' },
    ],
  },
  {
    id: 'sc58', lang: 'ja', group: 'foodspots',
    title: 'Breakfast at Omicho Market', titleTC: '近江町市場早餐',
    emoji: '🐟', description: 'Choosing seasonal seafood, asking how it is prepared, and eating at the market',
    lines: [
      { speaker: 'you', target: 'おはようございます。ここで朝ご飯を食べられますか？', pronunciation: 'ohayou gozaimasu. koko de asa gohan wo taberaremasu ka', pronunciation_chunks: 'o·ha·you go·zai·ma·su ko·ko de a·sa go·han wo ta·be·ra·re·ma·su ka', english: 'Good morning. Can we have breakfast here?', chinese_tc: '早安，可以在這裡吃早餐嗎？' },
      { speaker: 'staff', target: 'はい、こちらで召し上がれます', pronunciation: 'hai, kochira de meshiagaremasu', pronunciation_chunks: 'hai ko·chi·ra de me·shi·a·ga·re·ma·su', english: 'Yes, you can eat here.', chinese_tc: '可以，您可以在這裡享用' },
      { speaker: 'you', target: '今が旬の魚は何ですか？', pronunciation: 'ima ga shun no sakana wa nan desu ka', pronunciation_chunks: 'i·ma ga shun no sa·ka·na wa nan de·su ka', english: 'Which fish is in season now?', chinese_tc: '現在當季的魚是什麼？' },
      { speaker: 'staff', target: '今日はのどぐろとぶりがおすすめです', pronunciation: 'kyou wa nodoguro to buri ga osusume desu', pronunciation_chunks: 'kyou wa no·do·gu·ro to bu·ri ga o·su·su·me de·su', english: 'Today I recommend blackthroat seaperch and yellowtail.', chinese_tc: '今天推薦喉黑魚和鰤魚', note: 'Seafood availability changes daily and by season.' },
      { speaker: 'you', target: 'これは生ですか、焼いてありますか？', pronunciation: 'kore wa nama desu ka, yaite arimasu ka', pronunciation_chunks: 'ko·re wa na·ma de·su ka ya·i·te a·ri·ma·su ka', english: 'Is this raw or grilled?', chinese_tc: '這是生的還是烤過的？' },
      { speaker: 'staff', target: '海鮮丼は生で、のどぐろは塩焼きです', pronunciation: 'kaisendon wa nama de, nodoguro wa shioyaki desu', pronunciation_chunks: 'kai·sen·don wa na·ma de no·do·gu·ro wa shi·o·ya·ki de·su', english: 'The seafood bowl is raw, and the blackthroat seaperch is salt-grilled.', chinese_tc: '海鮮丼是生食，喉黑魚是鹽烤' },
      { speaker: 'you', target: '海鮮丼を二つお願いします', pronunciation: 'kaisendon wo futatsu onegaishimasu', pronunciation_chunks: 'kai·sen·don wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two seafood bowls please.', chinese_tc: '請給我兩份海鮮丼', options: [
        { target: '海鮮丼を二つお願いします', pronunciation: 'kaisendon wo futatsu onegaishimasu', pronunciation_chunks: 'kai·sen·don wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two seafood bowls please', chinese_tc: '兩份海鮮丼' },
        { target: 'のどぐろの塩焼きをお願いします', pronunciation: 'nodoguro no shioyaki wo onegaishimasu', pronunciation_chunks: 'no·do·gu·ro no shi·o·ya·ki wo o·ne·gai·shi·ma·su', english: 'The salt-grilled blackthroat seaperch please', chinese_tc: '請給我鹽烤喉黑魚' },
        { target: '持ち帰りでお願いします', pronunciation: 'mochikaeri de onegaishimasu', pronunciation_chunks: 'mo·chi·ka·e·ri de o·ne·gai·shi·ma·su', english: 'Takeout please', chinese_tc: '請外帶' },
      ] },
      { speaker: 'staff', target: 'かしこまりました。こちらの席でお待ちください', pronunciation: 'kashikomarimashita. kochira no seki de omachi kudasai', pronunciation_chunks: 'ka·shi·ko·ma·ri·ma·shi·ta ko·chi·ra no se·ki de o·ma·chi ku·da·sai', english: 'Certainly. Please wait at this seat.', chinese_tc: '好的，請在這個座位等候' },
    ],
  },
  {
    id: 'sc59', lang: 'ja', group: 'foodspots',
    title: 'Ordering Nagano Specialties', titleTC: '品嚐長野名物',
    emoji: '🥟', description: 'Ordering Shinshu soba, oyaki, and local vegetables',
    lines: [
      { speaker: 'you', target: '長野の名物は何ですか？', pronunciation: 'nagano no meibutsu wa nan desu ka', pronunciation_chunks: 'na·ga·no no mei·bu·tsu wa nan de·su ka', english: 'What are Nagano’s local specialties?', chinese_tc: '長野有什麼名物？' },
      { speaker: 'staff', target: '信州そば、おやき、野沢菜がおすすめです', pronunciation: 'shinshuu soba, oyaki, nozawana ga osusume desu', pronunciation_chunks: 'shin·shuu so·ba o·ya·ki no·za·wa·na ga o·su·su·me de·su', english: 'I recommend Shinshu soba, oyaki, and nozawana greens.', chinese_tc: '推薦信州蕎麥麵、御燒和野澤菜' },
      { speaker: 'you', target: 'そばは温かいのと冷たいの、どちらがおすすめですか？', pronunciation: 'soba wa atatakai no to tsumetai no, dochira ga osusume desu ka', pronunciation_chunks: 'so·ba wa a·ta·ta·kai no to tsu·me·tai no do·chi·ra ga o·su·su·me de·su ka', english: 'Do you recommend hot or cold soba?', chinese_tc: '蕎麥麵推薦熱的還是冷的？' },
      { speaker: 'staff', target: 'そばの香りを楽しむなら、冷たいざるそばがおすすめです', pronunciation: 'soba no kaori wo tanoshimu nara, tsumetai zaru soba ga osusume desu', pronunciation_chunks: 'so·ba no ka·o·ri wo ta·no·shi·mu na·ra tsu·me·tai za·ru so·ba ga o·su·su·me de·su', english: 'For the full aroma of the soba, I recommend cold zaru soba.', chinese_tc: '如果想品嚐蕎麥香，推薦冷的竹盤蕎麥麵' },
      { speaker: 'you', target: 'ざるそばを二つと、おやきをお願いします', pronunciation: 'zaru soba wo futatsu to, oyaki wo onegaishimasu', pronunciation_chunks: 'za·ru so·ba wo fu·ta·tsu to o·ya·ki wo o·ne·gai·shi·ma·su', english: 'Two zaru soba and some oyaki please.', chinese_tc: '請給我兩份竹盤蕎麥麵和御燒', options: [
        { target: 'ざるそばを二つと、おやきをお願いします', pronunciation: 'zaru soba wo futatsu to, oyaki wo onegaishimasu', pronunciation_chunks: 'za·ru so·ba wo fu·ta·tsu to o·ya·ki wo o·ne·gai·shi·ma·su', english: 'Two zaru soba and oyaki please', chinese_tc: '兩份竹盤蕎麥麵和御燒' },
        { target: '温かいそばを二つお願いします', pronunciation: 'atatakai soba wo futatsu onegaishimasu', pronunciation_chunks: 'a·ta·ta·kai so·ba wo fu·ta·tsu o·ne·gai·shi·ma·su', english: 'Two hot soba please', chinese_tc: '兩份熱蕎麥麵' },
        { target: 'おやきを持ち帰りでお願いします', pronunciation: 'oyaki wo mochikaeri de onegaishimasu', pronunciation_chunks: 'o·ya·ki wo mo·chi·ka·e·ri de o·ne·gai·shi·ma·su', english: 'Oyaki to take away please', chinese_tc: '御燒請幫我外帶' },
      ] },
      { speaker: 'you', target: 'おやきは何が入っていますか？', pronunciation: 'oyaki wa nani ga haitte imasu ka', pronunciation_chunks: 'o·ya·ki wa na·ni ga hait·te i·ma·su ka', english: 'What is inside the oyaki?', chinese_tc: '御燒裡面包什麼？' },
      { speaker: 'staff', target: '野沢菜、かぼちゃ、あんこがあります', pronunciation: 'nozawana, kabocha, anko ga arimasu', pronunciation_chunks: 'no·za·wa·na ka·bo·cha an·ko ga a·ri·ma·su', english: 'We have nozawana greens, pumpkin, and sweet red bean.', chinese_tc: '有野澤菜、南瓜和紅豆餡' },
      { speaker: 'you', target: '野沢菜を二つください', pronunciation: 'nozawana wo futatsu kudasai', pronunciation_chunks: 'no·za·wa·na wo fu·ta·tsu ku·da·sai', english: 'Two nozawana ones please.', chinese_tc: '請給我兩個野澤菜口味' },
    ],
  },
  {
    id: 'sc60', lang: 'ja', group: 'stays',
    title: 'One Night with Dinner & Breakfast', titleTC: '一泊二食住宿',
    emoji: '🍱', description: 'Confirming the meal plan, dining times, dietary needs, and extra charges',
    lines: [
      { speaker: 'you', target: 'こんばんは。一泊二食付きのプランを予約した○○です', pronunciation: 'konbanwa. ippaku nishoku tsuki no puran wo yoyaku shita ○○ desu', pronunciation_chunks: 'kon·ban·wa ip·pa·ku ni·sho·ku tsu·ki no pu·ran wo yo·ya·ku shi·ta ○○ de·su', english: 'Good evening. I booked the one-night plan with dinner and breakfast under ○○.', chinese_tc: '晚上好，我姓○○，預訂了一泊二食方案' },
      { speaker: 'staff', target: 'いらっしゃいませ。二名様で一泊、夕食と朝食付きでございます', pronunciation: 'irasshaimase. nimeisama de ippaku, yuushoku to choushoku tsuki de gozaimasu', pronunciation_chunks: 'i·ras·shai·ma·se ni·mei·sa·ma de ip·pa·ku yuu·sho·ku to chou·sho·ku tsu·ki de go·zai·ma·su', english: 'Welcome. Your booking is for two guests and one night, with dinner and breakfast.', chinese_tc: '歡迎光臨。您的預訂是兩位住一晚，包含晚餐和早餐' },
      { speaker: 'you', target: '食事は宿泊料金に含まれていますか？', pronunciation: 'shokuji wa shukuhaku ryoukin ni fukumarete imasu ka', pronunciation_chunks: 'sho·ku·ji wa shu·ku·ha·ku ryou·kin ni fu·ku·ma·re·te i·ma·su ka', english: 'Are the meals included in the accommodation price?', chinese_tc: '餐點包含在住宿費用裡嗎？' },
      { speaker: 'staff', target: 'はい。お飲み物と入湯税は別料金です', pronunciation: 'hai. onomimono to nyuutouzei wa betsuryoukin desu', pronunciation_chunks: 'hai o·no·mi·mo·no to nyuu·tou·zei wa be·tsu·ryou·kin de·su', english: 'Yes. Drinks and the bathing tax are charged separately.', chinese_tc: '是的。飲料和入湯稅需要另外付費' },
      { speaker: 'staff', target: '夕食は六時か七時、朝食は七時か八時からお選びください', pronunciation: 'yuushoku wa rokuji ka shichiji, choushoku wa shichiji ka hachiji kara oerabi kudasai', pronunciation_chunks: 'yuu·sho·ku wa ro·ku·ji ka shi·chi·ji chou·sho·ku wa shi·chi·ji ka ha·chi·ji ka·ra o·e·ra·bi ku·da·sai', english: 'Please choose dinner at 6 or 7, and breakfast at 7 or 8.', chinese_tc: '晚餐請選6點或7點，早餐請選7點或8點' },
      { speaker: 'you', target: '夕食は七時、朝食は八時でお願いします', pronunciation: 'yuushoku wa shichiji, choushoku wa hachiji de onegaishimasu', pronunciation_chunks: 'yuu·sho·ku wa shi·chi·ji chou·sho·ku wa ha·chi·ji de o·ne·gai·shi·ma·su', english: 'Dinner at 7 and breakfast at 8, please.', chinese_tc: '晚餐請安排7點，早餐請安排8點', options: [
        { target: '夕食は六時、朝食は七時でお願いします', pronunciation: 'yuushoku wa rokuji, choushoku wa shichiji de onegaishimasu', pronunciation_chunks: 'yuu·sho·ku wa ro·ku·ji chou·sho·ku wa shi·chi·ji de o·ne·gai·shi·ma·su', english: 'Dinner at 6 and breakfast at 7, please', chinese_tc: '晚餐6點，早餐7點' },
        { target: '夕食は七時、朝食は八時でお願いします', pronunciation: 'yuushoku wa shichiji, choushoku wa hachiji de onegaishimasu', pronunciation_chunks: 'yuu·sho·ku wa shi·chi·ji chou·sho·ku wa ha·chi·ji de o·ne·gai·shi·ma·su', english: 'Dinner at 7 and breakfast at 8, please', chinese_tc: '晚餐7點，早餐8點' },
      ] },
      { speaker: 'staff', target: '食物アレルギーや食べられないものはございますか？', pronunciation: 'shokumotsu arerugii ya taberarenai mono wa gozaimasu ka', pronunciation_chunks: 'sho·ku·mo·tsu a·re·ru·gii ya ta·be·ra·re·nai mo·no wa go·zai·ma·su ka', english: 'Do you have any food allergies or foods you cannot eat?', chinese_tc: '您有食物過敏或不能吃的食物嗎？' },
      { speaker: 'you', target: '一人は生ものが食べられません', pronunciation: 'hitori wa namamono ga taberaremasen', pronunciation_chunks: 'hi·to·ri wa na·ma·mo·no ga ta·be·ra·re·ma·sen', english: 'One of us cannot eat raw food.', chinese_tc: '我們其中一位不能吃生食', options: [
        { target: 'アレルギーはありません', pronunciation: 'arerugii wa arimasen', pronunciation_chunks: 'a·re·ru·gii wa a·ri·ma·sen', english: 'We do not have any allergies', chinese_tc: '我們沒有過敏' },
        { target: '一人は生ものが食べられません', pronunciation: 'hitori wa namamono ga taberaremasen', pronunciation_chunks: 'hi·to·ri wa na·ma·mo·no ga ta·be·ra·re·ma·sen', english: 'One of us cannot eat raw food', chinese_tc: '我們其中一位不能吃生食' },
        { target: '海老アレルギーがあります', pronunciation: 'ebi arerugii ga arimasu', pronunciation_chunks: 'e·bi a·re·ru·gii ga a·ri·ma·su', english: 'I have a shrimp allergy', chinese_tc: '我對蝦過敏' },
      ] },
      { speaker: 'staff', target: '承知しました。調理場に確認いたします', pronunciation: 'shouchi shimashita. chouriba ni kakunin itashimasu', pronunciation_chunks: 'shou·chi shi·ma·shi·ta chou·ri·ba ni ka·ku·nin i·ta·shi·ma·su', english: 'Understood. I will confirm with the kitchen.', chinese_tc: '了解。我會向廚房確認' },
      { speaker: 'you', target: '食事はどこでいただきますか？', pronunciation: 'shokuji wa doko de itadakimasu ka', pronunciation_chunks: 'sho·ku·ji wa do·ko de i·ta·da·ki·ma·su ka', english: 'Where will we have our meals?', chinese_tc: '我們在哪裡用餐？' },
      { speaker: 'staff', target: '夕食も朝食も二階の食事処でご用意します', pronunciation: 'yuushoku mo choushoku mo nikai no shokujidokoro de goyoui shimasu', pronunciation_chunks: 'yuu·sho·ku mo chou·sho·ku mo ni·kai no sho·ku·ji·do·ko·ro de go·you·i shi·ma·su', english: 'Both dinner and breakfast will be served in the second-floor dining room.', chinese_tc: '晚餐和早餐都會在二樓用餐處提供' },
    ],
  },

  // ============================================================
  // FRENCH SCENARIOS
  // ============================================================
  {
    id: 'fr-sc01', lang: 'fr', group: 'restaurant',
    title: 'Au Restaurant', titleTC: '法式餐廳',
    emoji: '🍽️', description: 'Ordering food and drinks at a French restaurant',
    lines: [
      { speaker: 'staff', target: 'Bonsoir, vous avez réservé ?', pronunciation: 'bonswar vu zavay rayzervay', pronunciation_chunks: 'bon·swar vu za·vay ray·zer·vay', english: 'Good evening, do you have a reservation?', chinese_tc: '晚上好，有預約嗎？' },
      { speaker: 'you', target: 'Non, une table pour deux, s\'il vous plaît', pronunciation: 'non un tabl poor duh sil vu pleh', pronunciation_chunks: 'non un ta·bl poor duh sil vu pleh', english: 'No, a table for two, please', chinese_tc: '沒有，請給我們兩位的桌子' },
      { speaker: 'staff', target: 'Suivez-moi, s\'il vous plaît', pronunciation: 'sweevay mwa sil vu pleh', pronunciation_chunks: 'swee·vay mwa sil vu pleh', english: 'Follow me, please', chinese_tc: '請跟我來' },
      { speaker: 'you', target: 'La carte, s\'il vous plaît', pronunciation: 'la kart sil vu pleh', pronunciation_chunks: 'la kart sil vu pleh', english: 'The menu, please', chinese_tc: '請給我菜單' },
      { speaker: 'staff', target: 'Voilà. Vous désirez un apéritif ?', pronunciation: 'vwala vu dayziray un apayritif', pronunciation_chunks: 'vwa·la vu day·zi·ray un a·pay·ri·tif', english: 'Here you go. Would you like an aperitif?', chinese_tc: '給您。要來杯開胃酒嗎？' },
      { speaker: 'you', target: 'Deux verres de vin rouge, s\'il vous plaît', pronunciation: 'duh vehr duh ven roozh sil vu pleh', pronunciation_chunks: 'duh vehr duh ven roozh sil vu pleh', english: 'Two glasses of red wine, please', chinese_tc: '兩杯紅酒，謝謝', options: [
        { target: 'Deux verres de vin rouge', pronunciation: 'duh vehr duh ven roozh', english: 'Two glasses of red wine', chinese_tc: '兩杯紅酒' },
        { target: 'Une carafe d\'eau', pronunciation: 'un karaf do', english: 'A carafe of water', chinese_tc: '一壺水' },
        { target: 'Deux bières, s\'il vous plaît', pronunciation: 'duh biehr sil vu pleh', english: 'Two beers, please', chinese_tc: '兩杯啤酒' },
      ] },
      { speaker: 'you', target: 'Qu\'est-ce que vous recommandez ?', pronunciation: 'kess kuh vu ruhkomanday', pronunciation_chunks: 'kes kuh vu ruh·ko·man·day', english: 'What do you recommend?', chinese_tc: '你推薦什麼？' },
      { speaker: 'staff', target: 'Le plat du jour est excellent', pronunciation: 'luh pla du zhoor eh eksellont', pronunciation_chunks: 'luh pla du zhoor eh ek·se·lont', english: 'The dish of the day is excellent', chinese_tc: '今日特餐非常好' },
      { speaker: 'you', target: 'Je prends le plat du jour', pronunciation: 'zhuh pron luh pla du zhoor', pronunciation_chunks: 'zhuh pron luh pla du zhoor', english: "I'll have the dish of the day", chinese_tc: '我要今日特餐' },
      { speaker: 'you', target: 'L\'addition, s\'il vous plaît', pronunciation: 'ladision sil vu pleh', pronunciation_chunks: 'la·di·sion sil vu pleh', english: 'The bill, please', chinese_tc: '請結帳' },
    ],
  },
  {
    id: 'fr-sc02', lang: 'fr', group: 'hotel',
    title: "Check-in à l'Hôtel", titleTC: '飯店入住',
    emoji: '🏨', description: 'Checking in at a French hotel',
    lines: [
      { speaker: 'staff', target: 'Bonjour, bienvenue. Vous avez une réservation ?', pronunciation: 'bonjour bienvenu vu zavay un rayzervahsion', pronunciation_chunks: 'bon·jour bien·ve·nu vu za·vay un ray·zer·vah·sion', english: 'Hello, welcome. Do you have a reservation?', chinese_tc: '你好，歡迎。有預約嗎？' },
      { speaker: 'you', target: "Oui, j'ai une réservation au nom de ○○", pronunciation: 'wi zhay un rayzervahsion o nom duh', pronunciation_chunks: 'wi zhay un ray·zer·vah·sion o nom duh', english: 'Yes, I have a reservation under ○○', chinese_tc: '有的，我有預約，名字是○○' },
      { speaker: 'staff', target: 'Votre passeport, s\'il vous plaît', pronunciation: 'votr paspor sil vu pleh', pronunciation_chunks: 'vo·tr pas·por sil vu pleh', english: 'Your passport, please', chinese_tc: '請出示護照' },
      { speaker: 'staff', target: 'Voici votre clé. Chambre 305, troisième étage', pronunciation: 'vwasi votr klay shombr trwa son sink troazyem etazh', pronunciation_chunks: 'vwa·si vo·tr klay shom·br trwa·zyem e·tazh', english: 'Here is your key. Room 305, third floor', chinese_tc: '這是您的鑰匙。305號房，三樓' },
      { speaker: 'you', target: 'Le petit-déjeuner est à quelle heure ?', pronunciation: 'luh puhtee dayzhunay eh a kel uhr', pronunciation_chunks: 'luh puh·tee day·zhu·nay eh a kel uhr', english: 'What time is breakfast?', chinese_tc: '早餐是幾點？' },
      { speaker: 'staff', target: 'De sept heures à dix heures', pronunciation: 'duh set uhr a deez uhr', pronunciation_chunks: 'duh set uhr a deez uhr', english: 'From 7 to 10', chinese_tc: '七點到十點' },
      { speaker: 'you', target: 'Merci beaucoup', pronunciation: 'mehrsi boku', pronunciation_chunks: 'mehr·si bo·ku', english: 'Thank you very much', chinese_tc: '非常感謝' },
    ],
  },
  {
    id: 'fr-sc03', lang: 'fr', group: 'train',
    title: 'À la Gare', titleTC: '火車站',
    emoji: '🚆', description: 'Buying tickets and navigating a French train station',
    lines: [
      { speaker: 'you', target: 'Deux billets pour Lyon, s\'il vous plaît', pronunciation: 'duh biyay poor lion sil vu pleh', pronunciation_chunks: 'duh bi·yay poor lion sil vu pleh', english: 'Two tickets to Lyon, please', chinese_tc: '請給我兩張到里昂的票', variables: [
        { placeholder: 'Lyon', label: 'Destination', options: [
          { value: 'Lyon', pronunciation: 'lion', english: 'Lyon' },
          { value: 'Marseille', pronunciation: 'marsay', english: 'Marseille' },
          { value: 'Nice', pronunciation: 'nees', english: 'Nice' },
          { value: 'Bordeaux', pronunciation: 'bordo', english: 'Bordeaux' },
          { value: 'Strasbourg', pronunciation: 'strazboor', english: 'Strasbourg' },
        ] },
      ] },
      { speaker: 'staff', target: 'Aller simple ou aller-retour ?', pronunciation: 'alay simpl oo alay ruhtoor', pronunciation_chunks: 'a·lay sim·pl oo a·lay ruh·toor', english: 'One-way or round trip?', chinese_tc: '單程還是來回？' },
      { speaker: 'you', target: 'Aller-retour, s\'il vous plaît', pronunciation: 'alay ruhtoor sil vu pleh', pronunciation_chunks: 'a·lay ruh·toor sil vu pleh', english: 'Round trip, please', chinese_tc: '來回，謝謝', options: [
        { target: 'Aller-retour', pronunciation: 'alay ruhtoor', english: 'Round trip', chinese_tc: '來回' },
        { target: 'Aller simple', pronunciation: 'alay simpl', english: 'One-way', chinese_tc: '單程' },
      ] },
      { speaker: 'staff', target: 'Le prochain train part à 14h30, voie 7', pronunciation: 'luh proshain tren par a katorzuhr tront vwa set', pronunciation_chunks: 'luh pro·shain tren par a ka·torz·uhr tront vwa set', english: 'The next train leaves at 2:30 PM, platform 7', chinese_tc: '下一班火車14:30出發，第7月台' },
      { speaker: 'you', target: 'Merci. Où est la voie 7 ?', pronunciation: 'mehrsi oo eh la vwa set', pronunciation_chunks: 'mehr·si oo eh la vwa set', english: 'Thanks. Where is platform 7?', chinese_tc: '謝謝。第7月台在哪裡？' },
    ],
  },
  {
    id: 'fr-sc04', lang: 'fr', group: 'shopping',
    title: 'Faire du Shopping', titleTC: '購物',
    emoji: '🛍️', description: 'Shopping at a French boutique or market',
    lines: [
      { speaker: 'staff', target: 'Bonjour, je peux vous aider ?', pronunciation: 'bonjour zhuh puh vu zayday', pronunciation_chunks: 'bon·jour zhuh puh vu zay·day', english: 'Hello, can I help you?', chinese_tc: '你好，需要幫忙嗎？' },
      { speaker: 'you', target: 'Je regarde, merci', pronunciation: 'zhuh ruhgard mehrsi', pronunciation_chunks: 'zhuh ruh·gard mehr·si', english: "I'm just looking, thanks", chinese_tc: '我只是看看', options: [
        { target: 'Je regarde, merci', pronunciation: 'zhuh ruhgard mehrsi', english: "I'm just looking, thanks", chinese_tc: '我只是看看' },
        { target: 'Je cherche un cadeau', pronunciation: 'zhuh shehrsh un kado', english: "I'm looking for a gift", chinese_tc: '我在找禮物' },
      ] },
      { speaker: 'you', target: 'C\'est combien ?', pronunciation: 'seh combien', pronunciation_chunks: 'seh com·bien', english: 'How much is it?', chinese_tc: '多少錢？' },
      { speaker: 'staff', target: 'C\'est vingt-cinq euros', pronunciation: 'seh vent senk uhro', pronunciation_chunks: 'seh vent senk uh·ro', english: "It's twenty-five euros", chinese_tc: '二十五歐元' },
      { speaker: 'you', target: 'Je le prends', pronunciation: 'zhuh luh pron', pronunciation_chunks: 'zhuh luh pron', english: "I'll take it", chinese_tc: '我要買這個' },
      { speaker: 'you', target: 'On peut payer par carte ?', pronunciation: 'on puh payay par kart', pronunciation_chunks: 'on puh pay·ay par kart', english: 'Can we pay by card?', chinese_tc: '可以刷卡嗎？' },
    ],
  },
];
