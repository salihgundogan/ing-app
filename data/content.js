// ===== Princess Zeynep's English Kingdom — Static A1 Content =====

const CONTENT = {
  // ─── Vocabulary Topics ───
  vocabularyTopics: [
    { id: "colors", name: "Colors", nameTr: "Renkler", icon: "🎨" },
    { id: "numbers", name: "Numbers (1-20)", nameTr: "Sayılar (1-20)", icon: "🔢" },
    { id: "animals", name: "Animals", nameTr: "Hayvanlar", icon: "🐾" },
    { id: "family", name: "Family Members", nameTr: "Aile Üyeleri", icon: "👨‍👩‍👧‍👦" },
    { id: "food", name: "Food & Drinks", nameTr: "Yiyecek ve İçecekler", icon: "🍕" },
    { id: "routines", name: "Daily Routines", nameTr: "Günlük Rutinler", icon: "☀️" },
    { id: "body", name: "Body Parts", nameTr: "Vücut Bölümleri", icon: "🦵" },
    { id: "clothes", name: "Clothes", nameTr: "Giysiler", icon: "👗" },
    { id: "weather", name: "Weather", nameTr: "Hava Durumu", icon: "🌦️" },
    { id: "house", name: "House & Furniture", nameTr: "Ev ve Mobilya", icon: "🏠" },
    { id: "jobs", name: "Jobs & Professions", nameTr: "Meslekler", icon: "👩‍⚕️" },
    { id: "days", name: "Days & Months", nameTr: "Günler ve Aylar", icon: "📅" },
    { id: "feelings", name: "Feelings & Emotions", nameTr: "Duygular", icon: "😊" },
    { id: "transport", name: "Transportation", nameTr: "Ulaşım", icon: "🚌" },
    { id: "places", name: "Places in City", nameTr: "Şehirdeki Yerler", icon: "🏙️" },
  ],

  // ─── Grammar Topics with Hardcoded Explanations ───
  grammarTopics: [
    {
      id: "to_be",
      name: 'To Be (am/is/are)',
      nameTr: '"To Be" Fiili (am/is/are)',
      icon: "📝",
      explanation: `📜 TO BE — am / is / are

✨ Rule (Kural):
• I → am
• He / She / It → is
• You / We / They → are

🇬🇧 Example: "I am Princess Zeynep. She is my friend."
🇹🇷 Türkçe: "Ben Prenses Zeynep'im. O benim arkadaşım."

✅ Positive (Olumlu):
• I am happy. (Ben mutluyum.)
• She is a student. (O bir öğrenci.)
• They are friends. (Onlar arkadaş.)

❌ Negative (Olumsuz):
• I am not (I'm not) sad.
• He is not (He isn't) here.
• They are not (They aren't) tired.

❓ Question (Soru):
• Am I...? / Is she...? / Are they...?
• Is he a teacher? (O bir öğretmen mi?)
• Are you ready? (Hazır mısın?)`
    },
    {
      id: "have_has",
      name: "Have / Has",
      nameTr: "Have / Has (Sahip olmak)",
      icon: "🤲",
      explanation: `📜 HAVE / HAS — Sahip olmak

✨ Rule (Kural):
• I / You / We / They → have
• He / She / It → has

🇬🇧 Example: "I have a cat. She has a dog."
🇹🇷 Türkçe: "Benim bir kedim var. Onun bir köpeği var."

✅ Positive (Olumlu):
• I have two brothers. (İki erkek kardeşim var.)
• He has a red car. (Onun kırmızı bir arabası var.)

❌ Negative (Olumsuz):
• I don't have a pet. (Evcil hayvanım yok.)
• She doesn't have a sister. (Kız kardeşi yok.)

❓ Question (Soru):
• Do you have...? / Does he have...?
• Do you have a pen? (Kalemin var mı?)`
    },
    {
      id: "present_simple_pos",
      name: "Present Simple — Positive",
      nameTr: "Geniş Zaman — Olumlu",
      icon: "➕",
      explanation: `📜 PRESENT SIMPLE — Positive (Olumlu)

✨ Rule (Kural):
• I / You / We / They → verb (fiil olduğu gibi)
• He / She / It → verb + s/es

🇬🇧 Example: "I play football. She plays tennis."
🇹🇷 Türkçe: "Ben futbol oynarım. O tenis oynar."

📌 Spelling Rules (Yazım Kuralları):
• Most verbs: add -s → plays, reads, eats
• Verbs ending in -ch, -sh, -ss, -x, -o: add -es → watches, goes
• Verbs ending in consonant + y: change y to i, add -es → studies

✅ Examples:
• I drink tea every morning. (Her sabah çay içerim.)
• She goes to school. (O okula gider.)
• They like pizza. (Onlar pizzayı sever.)`
    },
    {
      id: "present_simple_neg",
      name: "Present Simple — Negative & Questions",
      nameTr: "Geniş Zaman — Olumsuz ve Soru",
      icon: "❓",
      explanation: `📜 PRESENT SIMPLE — Negative & Questions

❌ Negative (Olumsuz):
• I / You / We / They → don't + verb
• He / She / It → doesn't + verb (NO -s on verb!)

🇬🇧 Example: "I don't like fish. She doesn't eat meat."
🇹🇷 Türkçe: "Balığı sevmem. O et yemez."

❓ Question (Soru):
• Do + I / you / we / they + verb?
• Does + he / she / it + verb? (NO -s on verb!)

🇬🇧 Example: "Do you speak English? Does she play guitar?"
🇹🇷 Türkçe: "İngilizce konuşuyor musun? O gitar çalar mı?"

⚠️ Important (Önemli):
• doesn't/does ile fiil -s almaz!
• ✅ She doesn't like → ❌ She doesn't likes`
    },
    {
      id: "articles",
      name: "Articles (a/an/the)",
      nameTr: "Artikeller (a/an/the)",
      icon: "📄",
      explanation: `📜 ARTICLES — a / an / the

✨ Rule (Kural):
• a → before consonant sounds: a book, a cat
• an → before vowel sounds: an apple, an egg
• the → specific/known thing: the sun, the teacher

🇬🇧 Example: "I have a dog. The dog is brown."
🇹🇷 Türkçe: "Bir köpeğim var. Köpek kahverengi."

📌 When to use (Ne zaman kullanılır):
• a/an = first time mentioning, any one of → "I see a bird."
• the = we both know which one → "The bird is blue."
• the = only one exists → "the moon, the sky"

⚠️ No article with:
• Names: Zeynep (not "the Zeynep")
• Cities/Countries (mostly): Turkey, Istanbul`
    },
    {
      id: "plurals",
      name: "Plural Nouns",
      nameTr: "Çoğul İsimler",
      icon: "👥",
      explanation: `📜 PLURAL NOUNS — Çoğul İsimler

✨ Rule (Kural):
• Most nouns: add -s → cat → cats, book → books
• -s, -sh, -ch, -x, -z: add -es → bus → buses, watch → watches
• consonant + y: change y → -ies → baby → babies
• -f/-fe: change to -ves → knife → knives, leaf → leaves

🇬🇧 Example: "I have two cats and three books."
🇹🇷 Türkçe: "İki kedim ve üç kitabım var."

⚠️ Irregular Plurals (Düzensiz Çoğullar):
• man → men
• woman → women
• child → children
• foot → feet
• tooth → teeth
• mouse → mice
• person → people`
    },
    {
      id: "possessives",
      name: "Possessive Adjectives",
      nameTr: "İyelik Sıfatları",
      icon: "👑",
      explanation: `📜 POSSESSIVE ADJECTIVES — İyelik Sıfatları

✨ Rule (Kural):
• I → my (benim)
• You → your (senin)
• He → his (onun - erkek)
• She → her (onun - kadın)
• It → its (onun - nesne/hayvan)
• We → our (bizim)
• They → their (onların)

🇬🇧 Example: "This is my crown. That is her castle."
🇹🇷 Türkçe: "Bu benim tacım. Şu onun kalesi."

📌 Remember (Unutma):
• Possessive adj. + noun → my book, her name, their house
• ✅ "This is my cat." → ❌ "This is me cat."
• its (possessive) ≠ it's (it is)`
    },
    {
      id: "there_is_are",
      name: "There is / There are",
      nameTr: "There is / There are (Var/Vardır)",
      icon: "📍",
      explanation: `📜 THERE IS / THERE ARE — Var, Vardır

✨ Rule (Kural):
• There is + singular noun → There is a book.
• There are + plural noun → There are two books.

🇬🇧 Example: "There is a castle. There are many trees."
🇹🇷 Türkçe: "Bir kale var. Birçok ağaç var."

❌ Negative (Olumsuz):
• There isn't a park here. (Burada park yok.)
• There aren't any shops. (Hiç dükkan yok.)

❓ Question (Soru):
• Is there a bank near here? (Buralarda banka var mı?)
• Are there any students? (Öğrenci var mı?)

📌 Kısa cevap:
• Yes, there is. / No, there isn't.
• Yes, there are. / No, there aren't.`
    },
    {
      id: "prepositions",
      name: "Prepositions of Place",
      nameTr: "Yer Edatları",
      icon: "📦",
      explanation: `📜 PREPOSITIONS OF PLACE — Yer Edatları

✨ Common Prepositions (Yaygın Edatlar):
• in → içinde → The cat is in the box.
• on → üstünde → The book is on the table.
• under → altında → The dog is under the table.
• next to → yanında → The school is next to the park.
• between → arasında → The house is between two trees.
• in front of → önünde → The car is in front of the house.
• behind → arkasında → The garden is behind the house.

🇬🇧 Example: "The crown is on the shelf."
🇹🇷 Türkçe: "Taç rafın üstünde."

❓ Question: "Where is the cat?" → "It's under the bed."
🇹🇷 "Kedi nerede?" → "Yatağın altında."`
    },
    {
      id: "can_cant",
      name: "Can / Can't",
      nameTr: "Can / Can't (Yetenek)",
      icon: "💪",
      explanation: `📜 CAN / CAN'T — Ability (Yetenek)

✨ Rule (Kural):
• can + verb (no -s, no -to!) → She can swim.
• can't + verb → He can't fly.
• All persons use same form (hepsi aynı)

🇬🇧 Example: "I can speak English. I can't speak French."
🇹🇷 Türkçe: "İngilizce konuşabilirim. Fransızca konuşamam."

✅ Positive: I/You/He/She/We/They can dance.
❌ Negative: I/You/He/She/We/They can't (cannot) dance.

❓ Question (Soru):
• Can you swim? (Yüzebilir misin?)
• Can she play piano? (Piyano çalabilir mi?)

📌 Short Answers (Kısa Cevaplar):
• Yes, I can. / No, I can't.
• ✅ "She can sing." → ❌ "She can sings." / "She can to sing."`
    },
  ],

  // ─── Conversation Scenarios ───
  royalScenarios: [
    { id: "queen", name: "Meeting the Queen", nameTr: "Kraliçe ile Tanışma", icon: "👸", character: "Queen Mother" },
    { id: "banquet", name: "At the Royal Banquet", nameTr: "Kraliyet Ziyafetinde", icon: "🍷", character: "Royal Chef" },
    { id: "forest", name: "Lost in the Enchanted Forest", nameTr: "Büyülü Ormanda Kaybolmak", icon: "🌳", character: "Wise Forest Fairy" },
    { id: "dragon", name: "The Dragon's Riddle", nameTr: "Ejderhanın Bilmecesi", icon: "🐉", character: "A Friendly Dragon" },
    { id: "market", name: "Shopping at the Magic Market", nameTr: "Sihirli Çarşıda Alışveriş", icon: "🧙", character: "Magic Shop Owner" },
  ],

  realWorldScenarios: [
    { id: "cafe", name: "At the Café", nameTr: "Kafede", icon: "☕", character: "Barista" },
    { id: "supermarket", name: "At the Supermarket", nameTr: "Süpermarkette", icon: "🛒", character: "Cashier" },
    { id: "doctor", name: "At the Doctor", nameTr: "Doktorda", icon: "🏥", character: "Doctor" },
    { id: "bus", name: "On the Bus", nameTr: "Otobüste", icon: "🚌", character: "Bus Driver" },
    { id: "hotel", name: "At the Hotel", nameTr: "Otelde", icon: "🏨", character: "Receptionist" },
    { id: "intro", name: "Introducing Yourself", nameTr: "Kendini Tanıtma", icon: "🤝", character: "New Friend" },
  ],

  // ─── Luna's Motivational Quotes ───
  lunaQuotes: [
    "Every great queen was once a student, Princess! ✨",
    "Your English shines brighter than all the stars in the kingdom! 🌟",
    "A word learned today is a treasure for tomorrow, Your Highness! 👑",
    "Even the tallest tower was built one brick at a time, Princess! 🏰",
    "The bravest princesses are the ones who keep learning! 💫",
    "You're writing your royal story, one English word at a time! 📜",
    "Magic happens when you practice, Princess Zeynep! 🧚",
    "The whole kingdom is proud of your progress! 🌟",
    "A princess who speaks two languages is twice as powerful! 👑✨",
    "Today's practice is tomorrow's fluency, Your Highness! 💫",
  ],

  // ─── Luna's A1 Tips ───
  lunaTips: [
    "💡 Tip: Read English words aloud — your voice is your magic wand! 🪄",
    "💡 Tip: Watch English cartoons with subtitles — learning can be fun! 📺",
    "💡 Tip: Label objects in your room in English — make your own kingdom! 🏷️",
    "💡 Tip: Practice 10 minutes every day — consistency is the royal secret! ⏰",
    "💡 Tip: Don't be afraid of mistakes — they are stepping stones! 🪨",
    "💡 Tip: Listen to simple English songs — music helps memory! 🎵",
    "💡 Tip: Write 3 English sentences before bed — sweet dreams in English! 🌙",
    "💡 Tip: Talk to yourself in English — be your own practice partner! 🗣️",
  ],

  // ─── Milestone Messages ───
  milestones: {
    100: { title: "Royal Apprentice! 🌟", message: "100 Royal Points! You're beginning your magical journey, Princess!" },
    250: { title: "Castle Scholar! 📚", message: "250 Royal Points! The royal library celebrates your wisdom!" },
    500: { title: "Kingdom Knight! ⚔️", message: "500 Royal Points! You've earned your place in the royal court!" },
    1000: { title: "Legendary Queen! 👑", message: "1000 Royal Points! All the kingdom bows to your English mastery!" },
  },
};

// Make available globally
if (typeof window !== "undefined") {
  window.CONTENT = CONTENT;
}
