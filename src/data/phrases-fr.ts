import type { Phrase } from './types';

export const frenchPhrases: Phrase[] = [
  // ============================================================
  // GREETINGS & BASICS
  // ============================================================
  { id: 'fr-g01', lang: 'fr', target: 'Bonjour', pronunciation: 'bonjour', pronunciation_chunks: 'bon·jour', english: 'Hello / Good morning', chinese_tc: '你好 / 早安', category: 'greetings', situation: 'General greeting', difficulty: 1, notes: 'Used from morning until evening' },
  { id: 'fr-g02', lang: 'fr', target: 'Bonsoir', pronunciation: 'bonswar', pronunciation_chunks: 'bon·swar', english: 'Good evening', chinese_tc: '晚上好', category: 'greetings', situation: 'General greeting', difficulty: 1, notes: 'Used from around 6pm' },
  { id: 'fr-g03', lang: 'fr', target: 'Bonne nuit', pronunciation: 'bon nwi', pronunciation_chunks: 'bon nwi', english: 'Good night', chinese_tc: '晚安', category: 'greetings', situation: 'Farewell & Night', difficulty: 1, notes: 'Said when going to sleep' },
  { id: 'fr-g04', lang: 'fr', target: 'Merci', pronunciation: 'mehrsi', pronunciation_chunks: 'mehr·si', english: 'Thank you', chinese_tc: '謝謝', category: 'greetings', situation: 'Thanks & Apologies', difficulty: 1, notes: 'Merci beaucoup = Thank you very much' },
  { id: 'fr-g05', lang: 'fr', target: 'Merci beaucoup', pronunciation: 'mehrsi boku', pronunciation_chunks: 'mehr·si bo·ku', english: 'Thank you very much', chinese_tc: '非常感謝', category: 'greetings', situation: 'Thanks & Apologies', difficulty: 1, notes: '' },
  { id: 'fr-g06', lang: 'fr', target: "S'il vous plaît", pronunciation: 'sil vu pleh', pronunciation_chunks: "sil vu pleh", english: 'Please (formal)', chinese_tc: '請', category: 'greetings', situation: 'Requests & Responses', difficulty: 1, notes: 'Formal/polite. Casual: S\'il te plaît' },
  { id: 'fr-g07', lang: 'fr', target: 'Excusez-moi', pronunciation: 'ekskuzay mwa', pronunciation_chunks: 'eks·ku·zay mwa', english: 'Excuse me', chinese_tc: '不好意思', category: 'greetings', situation: 'Thanks & Apologies', difficulty: 1, notes: 'To get attention or pass through' },
  { id: 'fr-g08', lang: 'fr', target: 'Pardon', pronunciation: 'pardon', pronunciation_chunks: 'par·don', english: 'Sorry / Pardon', chinese_tc: '對不起', category: 'greetings', situation: 'Thanks & Apologies', difficulty: 1, notes: 'For bumping into someone or asking to repeat' },
  { id: 'fr-g09', lang: 'fr', target: 'Oui', pronunciation: 'wi', english: 'Yes', chinese_tc: '是', category: 'greetings', situation: 'Requests & Responses', difficulty: 1, notes: '' },
  { id: 'fr-g10', lang: 'fr', target: 'Non', pronunciation: 'non', english: 'No', chinese_tc: '不', category: 'greetings', situation: 'Requests & Responses', difficulty: 1, notes: '' },
  { id: 'fr-g11', lang: 'fr', target: 'Au revoir', pronunciation: 'o ruhvwar', pronunciation_chunks: 'o ruh·vwar', english: 'Goodbye', chinese_tc: '再見', category: 'greetings', situation: 'Farewell & Night', difficulty: 1, notes: '' },
  { id: 'fr-g12', lang: 'fr', target: 'De rien', pronunciation: 'duh rien', pronunciation_chunks: 'duh rien', english: "You're welcome", chinese_tc: '不客氣', category: 'greetings', situation: 'Thanks & Apologies', difficulty: 1, notes: '' },
  { id: 'fr-g13', lang: 'fr', target: "Je ne comprends pas", pronunciation: 'zhuh nuh compron pa', pronunciation_chunks: 'zhuh nuh com·pron pa', english: "I don't understand", chinese_tc: '我不懂', category: 'greetings', situation: 'Communication', difficulty: 1, notes: 'Key survival phrase!' },
  { id: 'fr-g14', lang: 'fr', target: 'Parlez-vous anglais ?', pronunciation: 'parlay vu onglay', pronunciation_chunks: 'par·lay vu on·glay', english: 'Do you speak English?', chinese_tc: '你會說英語嗎？', category: 'greetings', situation: 'Communication', difficulty: 1, notes: '' },
  { id: 'fr-g15', lang: 'fr', target: "Comment ça va ?", pronunciation: 'komon sa va', pronunciation_chunks: 'ko·mon sa va', english: 'How are you?', chinese_tc: '你好嗎？', category: 'greetings', situation: 'General greeting', difficulty: 1, notes: 'Casual. Formal: Comment allez-vous ?' },
  { id: 'fr-g16', lang: 'fr', target: "Ça va bien, merci", pronunciation: 'sa va bien mehrsi', pronunciation_chunks: 'sa va bien mehr·si', english: "I'm fine, thank you", chinese_tc: '我很好，謝謝', category: 'greetings', situation: 'General greeting', difficulty: 1, notes: '' },
  { id: 'fr-g17', lang: 'fr', target: 'Enchanté(e)', pronunciation: 'onshontay', pronunciation_chunks: 'on·shon·tay', english: 'Nice to meet you', chinese_tc: '很高興認識你', category: 'greetings', situation: 'Meeting & Meals', difficulty: 1, notes: 'Add -e if you are female' },
  { id: 'fr-g18', lang: 'fr', target: 'Bon appétit', pronunciation: 'bon apetee', pronunciation_chunks: 'bon a·pe·tee', english: 'Enjoy your meal', chinese_tc: '請慢用', category: 'greetings', situation: 'Meeting & Meals', difficulty: 1, notes: 'Said before eating — very common in France' },

  // ============================================================
  // BASICS — Communication & Essential Needs
  // ============================================================
  { id: 'fr-b01', lang: 'fr', target: 'Je ne parle pas français', pronunciation: 'zhuh nuh parl pa fronsay', pronunciation_chunks: 'zhuh nuh parl pa fron·say', english: "I don't speak French", chinese_tc: '我不會說法語', category: 'basics', situation: 'Communication', difficulty: 1, notes: '' },
  { id: 'fr-b02', lang: 'fr', target: 'Pouvez-vous répéter ?', pronunciation: 'poovay vu repay-tay', pronunciation_chunks: 'poo·vay vu re·pay·tay', english: 'Can you repeat that?', chinese_tc: '可以再說一次嗎？', category: 'basics', situation: 'Communication', difficulty: 1, notes: '' },
  { id: 'fr-b03', lang: 'fr', target: 'Plus lentement, s\'il vous plaît', pronunciation: 'plu lontmon sil vu pleh', pronunciation_chunks: 'plu lon·tmon sil vu pleh', english: 'More slowly, please', chinese_tc: '請說慢一點', category: 'basics', situation: 'Communication', difficulty: 1, notes: '' },
  { id: 'fr-b04', lang: 'fr', target: "Pouvez-vous l'écrire ?", pronunciation: 'poovay vu laykreer', pronunciation_chunks: 'poo·vay vu lay·kreer', english: 'Can you write it down?', chinese_tc: '可以寫下來嗎？', category: 'basics', situation: 'Communication', difficulty: 1, notes: '' },
  { id: 'fr-b05', lang: 'fr', target: 'Où sont les toilettes ?', pronunciation: 'oo son lay twalet', pronunciation_chunks: 'oo son lay twa·let', english: 'Where are the toilets?', chinese_tc: '廁所在哪裡？', category: 'basics', situation: 'Essential needs', difficulty: 1, notes: 'One of the most important phrases!' },
  { id: 'fr-b06', lang: 'fr', target: 'Avez-vous le Wi-Fi ?', pronunciation: 'avay vu luh weefee', pronunciation_chunks: 'a·vay vu luh wee·fee', english: 'Do you have Wi-Fi?', chinese_tc: '有Wi-Fi嗎？', category: 'basics', situation: 'Essential needs', difficulty: 1, notes: '' },
  { id: 'fr-b07', lang: 'fr', target: 'Quel est le mot de passe ?', pronunciation: 'kel eh luh mo duh pas', pronunciation_chunks: 'kel eh luh mo duh pas', english: 'What is the password?', chinese_tc: '密碼是什麼？', category: 'basics', situation: 'Essential needs', difficulty: 1, notes: '' },
  { id: 'fr-b08', lang: 'fr', target: "Qu'est-ce que c'est ?", pronunciation: 'kess kuh seh', pronunciation_chunks: 'kes kuh seh', english: 'What is this?', chinese_tc: '這是什麼？', category: 'basics', situation: 'Asking questions', difficulty: 1, notes: '' },
  { id: 'fr-b09', lang: 'fr', target: "C'est combien ?", pronunciation: 'seh combien', pronunciation_chunks: 'seh com·bien', english: 'How much is it?', chinese_tc: '多少錢？', category: 'basics', situation: 'Asking questions', difficulty: 1, notes: '' },
  { id: 'fr-b10', lang: 'fr', target: 'Nous sommes deux', pronunciation: 'noo som duh', pronunciation_chunks: 'noo som duh', english: 'There are two of us', chinese_tc: '我們兩個人', category: 'basics', situation: 'Indicating party size', difficulty: 1, notes: '' },
  { id: 'fr-b11', lang: 'fr', target: "Où est ○○ ?", pronunciation: 'oo eh', pronunciation_chunks: 'oo eh', english: 'Where is ○○?', chinese_tc: '○○在哪裡？', category: 'basics', situation: 'Asking questions', difficulty: 1, notes: 'Universal question template' },
  { id: 'fr-b12', lang: 'fr', target: "Je voudrais ○○", pronunciation: 'zhuh voodray', pronunciation_chunks: 'zhuh voo·dray', english: 'I would like ○○', chinese_tc: '我想要○○', category: 'basics', situation: 'Requests & Responses', difficulty: 1, notes: 'Polite way to request anything' },
  { id: 'fr-b13', lang: 'fr', target: "D'accord", pronunciation: 'dakor', pronunciation_chunks: 'da·kor', english: 'OK / Agreed', chinese_tc: '好的', category: 'basics', situation: 'Requests & Responses', difficulty: 1, notes: '' },
  { id: 'fr-b14', lang: 'fr', target: "C'est parfait", pronunciation: 'seh parfeh', pronunciation_chunks: 'seh par·feh', english: "That's perfect", chinese_tc: '太好了', category: 'basics', situation: 'Requests & Responses', difficulty: 1, notes: '' },

  // ============================================================
  // AIRPORT & TRANSIT
  // ============================================================
  { id: 'fr-a01', lang: 'fr', target: 'Où est le terminal ○○ ?', pronunciation: 'oo eh luh terminal', pronunciation_chunks: 'oo eh luh ter·mi·nal', english: 'Where is terminal ○○?', chinese_tc: '○○航廈在哪裡？', category: 'airport', situation: 'Airport', difficulty: 1, notes: '' },
  { id: 'fr-a02', lang: 'fr', target: "Où est l'arrêt de bus ?", pronunciation: 'oo eh lareh duh bus', pronunciation_chunks: 'oo eh la·reh duh bus', english: 'Where is the bus stop?', chinese_tc: '公車站在哪裡？', category: 'airport', situation: 'Transit', difficulty: 1, notes: '' },
  { id: 'fr-a03', lang: 'fr', target: 'Deux billets pour ○○, s\'il vous plaît', pronunciation: 'duh biyay poor, sil vu pleh', pronunciation_chunks: 'duh bi·yay poor sil vu pleh', english: 'Two tickets to ○○, please', chinese_tc: '請給我兩張到○○的票', category: 'airport', situation: 'Buying tickets', difficulty: 1, notes: '' },
  { id: 'fr-a04', lang: 'fr', target: 'Ce train va à ○○ ?', pronunciation: 'suh tren va a', pronunciation_chunks: 'suh tren va a', english: 'Does this train go to ○○?', chinese_tc: '這班火車去○○嗎？', category: 'airport', situation: 'Train', difficulty: 1, notes: '' },
  { id: 'fr-a05', lang: 'fr', target: 'À cette adresse, s\'il vous plaît', pronunciation: 'a set adres sil vu pleh', pronunciation_chunks: 'a set a·dres sil vu pleh', english: 'To this address, please', chinese_tc: '請到這個地址', category: 'airport', situation: 'Taxi', difficulty: 1, notes: 'Show address on phone' },
  { id: 'fr-a06', lang: 'fr', target: 'Où est la sortie ?', pronunciation: 'oo eh la sortee', pronunciation_chunks: 'oo eh la sor·tee', english: 'Where is the exit?', chinese_tc: '出口在哪裡？', category: 'airport', situation: 'Airport', difficulty: 1, notes: '' },
  { id: 'fr-a07', lang: 'fr', target: 'Où est la station de métro ?', pronunciation: 'oo eh la stasion duh metro', pronunciation_chunks: 'oo eh la sta·sion duh me·tro', english: 'Where is the metro station?', chinese_tc: '地鐵站在哪裡？', category: 'airport', situation: 'Transit', difficulty: 1, notes: '' },
  { id: 'fr-a08', lang: 'fr', target: 'Un aller-retour pour ○○', pronunciation: 'un alay ruhtoor poor', pronunciation_chunks: 'un a·lay ruh·toor poor', english: 'A round trip to ○○', chinese_tc: '到○○的來回票', category: 'airport', situation: 'Buying tickets', difficulty: 1, notes: 'aller simple = one-way' },
  { id: 'fr-a09', lang: 'fr', target: 'À quelle heure part le prochain train ?', pronunciation: 'a kel uhr par luh proshain tren', pronunciation_chunks: 'a kel uhr par luh pro·shain tren', english: 'What time does the next train leave?', chinese_tc: '下一班火車幾點出發？', category: 'airport', situation: 'Train', difficulty: 1, notes: '' },
  { id: 'fr-a10', lang: 'fr', target: 'Je dois descendre où ?', pronunciation: 'zhuh dwa desondre oo', pronunciation_chunks: 'zhuh dwa de·son·dre oo', english: 'Where should I get off?', chinese_tc: '我應該在哪裡下車？', category: 'airport', situation: 'Transit', difficulty: 1, notes: '' },

  // ============================================================
  // HOTEL
  // ============================================================
  { id: 'fr-h01', lang: 'fr', target: "J'ai une réservation", pronunciation: 'zhay un rayzervahsion', pronunciation_chunks: 'zhay un ray·zer·vah·sion', english: 'I have a reservation', chinese_tc: '我有預約', category: 'hotel', situation: 'Check-in', difficulty: 1, notes: '' },
  { id: 'fr-h02', lang: 'fr', target: "Une chambre double pour deux nuits", pronunciation: 'un shombr doob poor duh nwi', pronunciation_chunks: 'un shom·br doob poor duh nwi', english: 'A double room for two nights', chinese_tc: '雙人房，兩晚', category: 'hotel', situation: 'Check-in', difficulty: 1, notes: '' },
  { id: 'fr-h03', lang: 'fr', target: "Le petit-déjeuner est à quelle heure ?", pronunciation: 'luh puhtee dayzhunay eh a kel uhr', pronunciation_chunks: 'luh puh·tee day·zhu·nay eh a kel uhr', english: 'What time is breakfast?', chinese_tc: '早餐是幾點？', category: 'hotel', situation: 'Dining', difficulty: 1, notes: '' },
  { id: 'fr-h04', lang: 'fr', target: 'Le petit-déjeuner est inclus ?', pronunciation: 'luh puhtee dayzhunay eh inklu', pronunciation_chunks: 'luh puh·tee day·zhu·nay eh in·klu', english: 'Is breakfast included?', chinese_tc: '有附早餐嗎？', category: 'hotel', situation: 'Dining', difficulty: 1, notes: '' },
  { id: 'fr-h05', lang: 'fr', target: "Puis-je avoir la clé ?", pronunciation: 'pwee zhuh avwar la klay', pronunciation_chunks: 'pwee zhuh av·war la klay', english: 'Can I have the key?', chinese_tc: '可以給我鑰匙嗎？', category: 'hotel', situation: 'Check-in', difficulty: 1, notes: '' },
  { id: 'fr-h06', lang: 'fr', target: "La climatisation ne marche pas", pronunciation: 'la kleemat-ee-zahsion nuh marsh pa', pronunciation_chunks: 'la klee·ma·tee·zah·sion nuh marsh pa', english: "The air conditioning doesn't work", chinese_tc: '空調壞了', category: 'hotel', situation: 'Problems', difficulty: 2, notes: '' },
  { id: 'fr-h07', lang: 'fr', target: "Pouvez-vous appeler un taxi ?", pronunciation: 'poovay vu aplay un taxi', pronunciation_chunks: 'poo·vay vu a·play un tak·si', english: 'Can you call a taxi?', chinese_tc: '可以幫我叫計程車嗎？', category: 'hotel', situation: 'Services', difficulty: 1, notes: '' },
  { id: 'fr-h08', lang: 'fr', target: "Je voudrais faire le check-out", pronunciation: 'zhuh voodray fehr luh check out', pronunciation_chunks: 'zhuh voo·dray fehr luh check out', english: 'I would like to check out', chinese_tc: '我要退房', category: 'hotel', situation: 'Check-out', difficulty: 1, notes: '' },

  // ============================================================
  // RESTAURANT
  // ============================================================
  { id: 'fr-r01', lang: 'fr', target: "Une table pour deux, s'il vous plaît", pronunciation: 'un tabl poor duh sil vu pleh', pronunciation_chunks: 'un ta·bl poor duh sil vu pleh', english: 'A table for two, please', chinese_tc: '請給我們兩位的桌子', category: 'restaurant', situation: 'Entering', difficulty: 1, notes: '' },
  { id: 'fr-r02', lang: 'fr', target: "La carte, s'il vous plaît", pronunciation: 'la kart sil vu pleh', pronunciation_chunks: 'la kart sil vu pleh', english: 'The menu, please', chinese_tc: '請給我菜單', category: 'restaurant', situation: 'Ordering', difficulty: 1, notes: '' },
  { id: 'fr-r03', lang: 'fr', target: "Qu'est-ce que vous recommandez ?", pronunciation: 'kess kuh vu ruhkomanday', pronunciation_chunks: 'kes kuh vu ruh·ko·man·day', english: 'What do you recommend?', chinese_tc: '你推薦什麼？', category: 'restaurant', situation: 'Ordering', difficulty: 1, notes: '' },
  { id: 'fr-r04', lang: 'fr', target: "Je voudrais ○○, s'il vous plaît", pronunciation: 'zhuh voodray, sil vu pleh', pronunciation_chunks: 'zhuh voo·dray sil vu pleh', english: "I'd like ○○, please", chinese_tc: '我想要○○', category: 'restaurant', situation: 'Ordering', difficulty: 1, notes: '' },
  { id: 'fr-r05', lang: 'fr', target: "L'addition, s'il vous plaît", pronunciation: 'ladision sil vu pleh', pronunciation_chunks: 'la·di·sion sil vu pleh', english: 'The bill, please', chinese_tc: '請結帳', category: 'restaurant', situation: 'Paying', difficulty: 1, notes: '' },
  { id: 'fr-r06', lang: 'fr', target: 'On peut payer par carte ?', pronunciation: 'on puh payay par kart', pronunciation_chunks: 'on puh pay·ay par kart', english: 'Can we pay by card?', chinese_tc: '可以刷卡嗎？', category: 'restaurant', situation: 'Paying', difficulty: 1, notes: '' },
  { id: 'fr-r07', lang: 'fr', target: "C'est délicieux !", pronunciation: 'seh daylisyuh', pronunciation_chunks: 'seh day·li·syuh', english: "It's delicious!", chinese_tc: '非常好吃！', category: 'restaurant', situation: 'Compliments', difficulty: 1, notes: '' },
  { id: 'fr-r08', lang: 'fr', target: "Je suis allergique à ○○", pronunciation: 'zhuh swee alehrzhik a', pronunciation_chunks: 'zhuh swee a·lehr·zhik a', english: "I'm allergic to ○○", chinese_tc: '我對○○過敏', category: 'restaurant', situation: 'Allergies', difficulty: 2, notes: '' },
  { id: 'fr-r09', lang: 'fr', target: "Deux verres de vin, s'il vous plaît", pronunciation: 'duh vehr duh ven sil vu pleh', pronunciation_chunks: 'duh vehr duh ven sil vu pleh', english: 'Two glasses of wine, please', chinese_tc: '兩杯葡萄酒，謝謝', category: 'restaurant', situation: 'Drinks', difficulty: 1, notes: '' },
  { id: 'fr-r10', lang: 'fr', target: "De l'eau, s'il vous plaît", pronunciation: 'duh lo sil vu pleh', pronunciation_chunks: 'duh lo sil vu pleh', english: 'Water, please', chinese_tc: '請給我水', category: 'restaurant', situation: 'Drinks', difficulty: 1, notes: 'gazeuse = sparkling, plate = still' },
  { id: 'fr-r11', lang: 'fr', target: "Un café, s'il vous plaît", pronunciation: 'un kafay sil vu pleh', pronunciation_chunks: 'un ka·fay sil vu pleh', english: 'A coffee, please', chinese_tc: '請給我一杯咖啡', category: 'restaurant', situation: 'Drinks', difficulty: 1, notes: '' },

  // ============================================================
  // FOOD
  // ============================================================
  { id: 'fr-f01', lang: 'fr', target: 'Un croissant', pronunciation: 'un krwason', pronunciation_chunks: 'un krwa·son', english: 'A croissant', chinese_tc: '可頌', category: 'food', situation: 'Bakery', difficulty: 1, notes: '' },
  { id: 'fr-f02', lang: 'fr', target: 'Une baguette', pronunciation: 'un baget', pronunciation_chunks: 'un ba·get', english: 'A baguette', chinese_tc: '法棍', category: 'food', situation: 'Bakery', difficulty: 1, notes: '' },
  { id: 'fr-f03', lang: 'fr', target: 'Un croque-monsieur', pronunciation: 'un krok muhsyuh', pronunciation_chunks: 'un krok muh·syuh', english: 'A grilled ham & cheese sandwich', chinese_tc: '法式火腿起司三明治', category: 'food', situation: 'Café', difficulty: 1, notes: 'Classic French café food' },
  { id: 'fr-f04', lang: 'fr', target: 'Une crêpe', pronunciation: 'un krep', pronunciation_chunks: 'un krep', english: 'A crêpe', chinese_tc: '可麗餅', category: 'food', situation: 'Street food', difficulty: 1, notes: '' },
  { id: 'fr-f05', lang: 'fr', target: 'Le plat du jour', pronunciation: 'luh pla du zhoor', pronunciation_chunks: 'luh pla du zhoor', english: 'The dish of the day', chinese_tc: '今日特餐', category: 'food', situation: 'Restaurant', difficulty: 1, notes: 'Usually the best value' },
  { id: 'fr-f06', lang: 'fr', target: "Le fromage", pronunciation: 'luh fromahzh', pronunciation_chunks: 'luh fro·mahzh', english: 'Cheese', chinese_tc: '起司', category: 'food', situation: 'Food items', difficulty: 1, notes: 'France has 400+ cheese varieties!' },

  // ============================================================
  // DRINKS
  // ============================================================
  { id: 'fr-d01', lang: 'fr', target: 'Un café crème', pronunciation: 'un kafay krem', pronunciation_chunks: 'un ka·fay krem', english: 'A coffee with cream', chinese_tc: '拿鐵', category: 'drinks', situation: 'Hot drinks', difficulty: 1, notes: '' },
  { id: 'fr-d02', lang: 'fr', target: 'Un thé', pronunciation: 'un tay', pronunciation_chunks: 'un tay', english: 'A tea', chinese_tc: '茶', category: 'drinks', situation: 'Hot drinks', difficulty: 1, notes: '' },
  { id: 'fr-d03', lang: 'fr', target: 'Un verre de vin rouge', pronunciation: 'un vehr duh ven roozh', pronunciation_chunks: 'un vehr duh ven roozh', english: 'A glass of red wine', chinese_tc: '一杯紅酒', category: 'drinks', situation: 'Alcoholic drinks', difficulty: 1, notes: '' },
  { id: 'fr-d04', lang: 'fr', target: 'Une bière', pronunciation: 'un biehr', pronunciation_chunks: 'un biehr', english: 'A beer', chinese_tc: '啤酒', category: 'drinks', situation: 'Alcoholic drinks', difficulty: 1, notes: 'pression = draft' },
  { id: 'fr-d05', lang: 'fr', target: "Une carafe d'eau", pronunciation: 'un karaf do', pronunciation_chunks: 'un ka·raf do', english: 'A carafe of water', chinese_tc: '一壺水', category: 'drinks', situation: 'Cold drinks', difficulty: 1, notes: 'Free tap water at restaurants' },
  { id: 'fr-d06', lang: 'fr', target: "Un jus d'orange", pronunciation: 'un zhu doronzh', pronunciation_chunks: 'un zhu do·ronzh', english: 'An orange juice', chinese_tc: '柳橙汁', category: 'drinks', situation: 'Cold drinks', difficulty: 1, notes: '' },

  // ============================================================
  // SHOPPING
  // ============================================================
  { id: 'fr-s01', lang: 'fr', target: 'Je regarde, merci', pronunciation: 'zhuh ruhgard mehrsi', pronunciation_chunks: 'zhuh ruh·gard mehr·si', english: "I'm just looking, thanks", chinese_tc: '我只是看看', category: 'shopping', situation: 'Browsing', difficulty: 1, notes: '' },
  { id: 'fr-s02', lang: 'fr', target: "Avez-vous une taille plus grande ?", pronunciation: 'avay vu un tahy plu grond', pronunciation_chunks: 'a·vay vu un tahy plu grond', english: 'Do you have a bigger size?', chinese_tc: '有更大的尺寸嗎？', category: 'shopping', situation: 'Clothing', difficulty: 2, notes: '' },
  { id: 'fr-s03', lang: 'fr', target: 'Je le prends', pronunciation: 'zhuh luh pron', pronunciation_chunks: 'zhuh luh pron', english: "I'll take it", chinese_tc: '我要買這個', category: 'shopping', situation: 'Buying', difficulty: 1, notes: '' },
  { id: 'fr-s04', lang: 'fr', target: 'Est-ce que je peux essayer ?', pronunciation: 'eskuh zhuh puh esayay', pronunciation_chunks: 'es·kuh zhuh puh e·say·ay', english: 'Can I try it on?', chinese_tc: '我可以試穿嗎？', category: 'shopping', situation: 'Clothing', difficulty: 1, notes: '' },
  { id: 'fr-s05', lang: 'fr', target: "C'est trop cher", pronunciation: 'seh tro shehr', pronunciation_chunks: 'seh tro shehr', english: "It's too expensive", chinese_tc: '太貴了', category: 'shopping', situation: 'Negotiating', difficulty: 1, notes: '' },

  // ============================================================
  // DIRECTIONS & NAVIGATION
  // ============================================================
  { id: 'fr-n01', lang: 'fr', target: 'Où est ○○ ?', pronunciation: 'oo eh', pronunciation_chunks: 'oo eh', english: 'Where is ○○?', chinese_tc: '○○在哪裡？', category: 'directions', situation: 'Asking directions', difficulty: 1, notes: '' },
  { id: 'fr-n02', lang: 'fr', target: "C'est loin ?", pronunciation: 'seh lwen', pronunciation_chunks: 'seh lwen', english: 'Is it far?', chinese_tc: '遠嗎？', category: 'directions', situation: 'Distance', difficulty: 1, notes: '' },
  { id: 'fr-n03', lang: 'fr', target: 'À droite', pronunciation: 'a drwat', pronunciation_chunks: 'a drwat', english: 'To the right', chinese_tc: '右邊', category: 'directions', situation: 'Direction words', difficulty: 1, notes: '' },
  { id: 'fr-n04', lang: 'fr', target: 'À gauche', pronunciation: 'a gosh', pronunciation_chunks: 'a gosh', english: 'To the left', chinese_tc: '左邊', category: 'directions', situation: 'Direction words', difficulty: 1, notes: '' },
  { id: 'fr-n05', lang: 'fr', target: 'Tout droit', pronunciation: 'too drwa', pronunciation_chunks: 'too drwa', english: 'Straight ahead', chinese_tc: '直走', category: 'directions', situation: 'Direction words', difficulty: 1, notes: '' },
  { id: 'fr-n06', lang: 'fr', target: 'On peut y aller à pied ?', pronunciation: 'on puh ee alay a pyay', pronunciation_chunks: 'on puh ee a·lay a pyay', english: 'Can we walk there?', chinese_tc: '可以走路去嗎？', category: 'directions', situation: 'Distance', difficulty: 1, notes: '' },

  // ============================================================
  // EMERGENCY & HEALTH
  // ============================================================
  { id: 'fr-e01', lang: 'fr', target: 'Au secours !', pronunciation: 'o skoor', pronunciation_chunks: 'o skoor', english: 'Help!', chinese_tc: '救命！', category: 'emergency', situation: 'Emergency', difficulty: 1, notes: '' },
  { id: 'fr-e02', lang: 'fr', target: "J'ai besoin d'un médecin", pronunciation: 'zhay buhzwen dun maydsun', pronunciation_chunks: 'zhay buh·zwen dun may·dsun', english: 'I need a doctor', chinese_tc: '我需要看醫生', category: 'emergency', situation: 'Medical', difficulty: 1, notes: '' },
  { id: 'fr-e03', lang: 'fr', target: 'Où est la pharmacie ?', pronunciation: 'oo eh la farmasee', pronunciation_chunks: 'oo eh la far·ma·see', english: 'Where is the pharmacy?', chinese_tc: '藥局在哪裡？', category: 'emergency', situation: 'Medical', difficulty: 1, notes: 'Look for the green cross sign' },
  { id: 'fr-e04', lang: 'fr', target: "J'ai perdu mon passeport", pronunciation: 'zhay perdoo mon paspor', pronunciation_chunks: 'zhay per·doo mon pas·por', english: 'I lost my passport', chinese_tc: '我弄丟了護照', category: 'emergency', situation: 'Lost items', difficulty: 1, notes: '' },
  { id: 'fr-e05', lang: 'fr', target: 'Appelez la police', pronunciation: 'aplay la polees', pronunciation_chunks: 'a·play la po·lees', english: 'Call the police', chinese_tc: '報警', category: 'emergency', situation: 'Emergency', difficulty: 1, notes: '' },
  { id: 'fr-e06', lang: 'fr', target: "J'ai mal à la tête", pronunciation: 'zhay mal a la tet', pronunciation_chunks: 'zhay mal a la tet', english: 'I have a headache', chinese_tc: '我頭痛', category: 'emergency', situation: 'Medical', difficulty: 1, notes: '' },

  // ============================================================
  // SMALL TALK & POLITENESS
  // ============================================================
  { id: 'fr-st01', lang: 'fr', target: "Je suis en vacances", pronunciation: 'zhuh swee on vakons', pronunciation_chunks: 'zhuh swee on va·kons', english: "I'm on vacation", chinese_tc: '我在度假', category: 'smalltalk', situation: 'About yourself', difficulty: 1, notes: '' },
  { id: 'fr-st02', lang: 'fr', target: "J'adore la France", pronunciation: 'zhador la frons', pronunciation_chunks: 'zha·dor la frons', english: 'I love France', chinese_tc: '我愛法國', category: 'smalltalk', situation: 'Compliments', difficulty: 1, notes: '' },
  { id: 'fr-st03', lang: 'fr', target: "C'est magnifique !", pronunciation: 'seh manyifeek', pronunciation_chunks: 'seh ma·nyi·feek', english: "It's magnificent!", chinese_tc: '太美了！', category: 'smalltalk', situation: 'Compliments', difficulty: 1, notes: '' },
  { id: 'fr-st04', lang: 'fr', target: "Je viens de ○○", pronunciation: 'zhuh vien duh', pronunciation_chunks: 'zhuh vien duh', english: "I'm from ○○", chinese_tc: '我來自○○', category: 'smalltalk', situation: 'About yourself', difficulty: 1, notes: '' },
  { id: 'fr-st05', lang: 'fr', target: 'Bonne journée', pronunciation: 'bon zhoornay', pronunciation_chunks: 'bon zhoor·nay', english: 'Have a nice day', chinese_tc: '祝你有美好的一天', category: 'smalltalk', situation: 'Farewell', difficulty: 1, notes: '' },

  // ============================================================
  // CULTURE TIPS
  // ============================================================
  { id: 'fr-ct01', lang: 'fr', target: 'La bise', pronunciation: 'la beez', pronunciation_chunks: 'la beez', english: 'The greeting kiss on cheeks', chinese_tc: '見面親臉頰禮', category: 'culture', situation: 'Social customs', difficulty: 1, notes: '2-4 kisses depending on the region — follow the local\'s lead' },
  { id: 'fr-ct02', lang: 'fr', target: 'Vous vs Tu', pronunciation: 'voo / tu', pronunciation_chunks: 'voo / tu', english: 'Formal "you" vs Casual "you"', chinese_tc: '您 vs 你', category: 'culture', situation: 'Politeness', difficulty: 1, notes: 'Always use "vous" with strangers and service staff' },
  { id: 'fr-ct03', lang: 'fr', target: 'Le service est compris', pronunciation: 'luh sehrvis eh compree', pronunciation_chunks: 'luh sehr·vis eh com·pree', english: 'Service charge is included', chinese_tc: '服務費已包含', category: 'culture', situation: 'Dining tips', difficulty: 1, notes: 'Tipping is not expected in France — it\'s included in the price' },

  // ============================================================
  // POWER PHRASES
  // ============================================================
  { id: 'fr-p01', lang: 'fr', target: "Est-ce que ○○ ?", pronunciation: 'eskuh', pronunciation_chunks: 'es·kuh', english: 'Is it / Do you ○○?', chinese_tc: '是否○○？', category: 'power', situation: 'Question pattern', difficulty: 1, notes: 'Universal question opener — just add a statement after it' },
  { id: 'fr-p02', lang: 'fr', target: "Il y a ○○ ?", pronunciation: 'il ee a', pronunciation_chunks: 'il ee a', english: 'Is there ○○?', chinese_tc: '有○○嗎？', category: 'power', situation: 'Question pattern', difficulty: 1, notes: '' },
  { id: 'fr-p03', lang: 'fr', target: "Je peux ○○ ?", pronunciation: 'zhuh puh', pronunciation_chunks: 'zhuh puh', english: 'Can I ○○?', chinese_tc: '我可以○○嗎？', category: 'power', situation: 'Permission', difficulty: 1, notes: '' },
  { id: 'fr-p04', lang: 'fr', target: "Je cherche ○○", pronunciation: 'zhuh shehrsh', pronunciation_chunks: 'zhuh shehrsh', english: "I'm looking for ○○", chinese_tc: '我在找○○', category: 'power', situation: 'Searching', difficulty: 1, notes: '' },
  { id: 'fr-p05', lang: 'fr', target: "Je ne veux pas ○○", pronunciation: 'zhuh nuh vuh pa', pronunciation_chunks: 'zhuh nuh vuh pa', english: "I don't want ○○", chinese_tc: '我不要○○', category: 'power', situation: 'Declining', difficulty: 1, notes: '' },
  { id: 'fr-p06', lang: 'fr', target: "Ça me plaît", pronunciation: 'sa muh pleh', pronunciation_chunks: 'sa muh pleh', english: 'I like it', chinese_tc: '我喜歡', category: 'power', situation: 'Expressing preferences', difficulty: 1, notes: '' },
];
