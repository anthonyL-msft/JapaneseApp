# 🌏 Travel Language Companion

An offline-first PWA for learning and using foreign languages while traveling. Built for real-world situations — ordering food, asking directions, taking trains, checking into hotels.


## Features

### 📖 Phrase Book
- 543+ travel phrases organized by 15 categories
- Categories: Greetings, Basics, Airport & Transit, Hotel, Restaurant, Food, Drinks, Shopping, Directions, Emergency, Small Talk, Culture, Local Specials, Vocab, Power Phrases
- Hepburn romanization with syllable chunks for easy pronunciation
- **Sounds breakdown:** expanded cards show kana-to-romaji mapping with proximity-based grouping — vowel lengtheners (よう), nasal ん, and devoiced す render smaller and tighter to show how characters combine into spoken sounds
- TTS (Text-to-Speech) with adjustable speed
- Bookmark and Mark as Learned
- Default Open All with Close All toggle

### 📚 Quick Reference
- **Japanese:** 7-Step Learning Framework — 50 Sounds → Sentence Structure → Particles → Polite Forms → Numbers → Yes/No Questions → Question Words
- **French:** Essentials — Gender & Articles, Pronunciation Tips, Tu vs Vous, Key Verb Forms, Numbers, Common Signs
- 50 Sounds with voiced/voiceless toggle overlay (dakuten ゛ / handakuten ゜) (JP)
- Tap any kana → bottom drawer with travel vocab examples
- Accordion examples with Open All/Close All in header
- Interactive number converter with currency rates (HKD/CAD) — input-at-bottom layout
- Tools: Sentence Patterns, Counters, Common Signs, What You'll Hear (29 staff phrases)

### 🎭 Conversations
- 46 real-world dialogue scenarios across 10 groups
- Groups: Airport, Train, Bus & Taxi, Hotel, Restaurant, Food Spots, Shopping, Daily Life, Activities, Trouble
- Step-by-step reveal with auto-play TTS (pauses at choice points)
- Variable swap (change destinations, times, party sizes, durations in conversations)
- Chinese translations update dynamically when swapping variables
- Speaker labels (Staff vs You) with chat bubble UI

### 🃏 Flashcards
- SRS (Spaced Repetition System) with SM-2 algorithm
- Category picker: study by topic or review all learned items
- Kana Recognition decks (Hiragana + Katakana character cards)
- Kana Vocab decks (ひらがな ~130 words, カタカナ ~50 words)
- Includes both phrases and reference examples
- 4-level rating: Again / Hard / Good / Easy

### 🎮 Quiz (Timed Multiple Choice)
- Categories adapt per language: Kana + JP grammar sections shown only for Japanese
- Phrase-based categories (Power, Travel, Food) available for all languages
- 10-second countdown timer per question
- 4 answer choices (1 correct + 3 distractors)
- 20 questions per round
- Green/red feedback with TTS on correct answer
- High score persisted per category

### 🃏 Match Game
- Pair target language ↔ English by tapping (6 pairs × 3 rounds)
- Decks adapt per language; kana decks shown only for Japanese
- Timer counts up — speed is the challenge
- Best time saved per deck
- Correct matches disappear with TTS pronunciation

### 🎯 Daily Challenge
- Learn 3 new phrases + review 5 learned ones
- Progress bars per task
- 🔥 Streak counter (consecutive days)
- Review mode: see English → recall Japanese → check
- Completion tracked daily with streak persistence

### 🔧 Sentence Builder
- Pick a pattern template → fill with vocab chips → get complete sentence
- 3 tabs: Requests, Questions, I want...
- 12 patterns × 60+ vocab items = unlimited combinations
- Sticky result card with TTS + Copy
- Smart vocab: noun patterns also show food/drink chips

### 🌱 Sentence Grow
- Pick a seed sentence → AI expands it step by step
- 16 seed sentences across multiple groups with fallback expansion chains
- Visual timeline shows each expansion stage
- Choose from multiple expansion options at each step
- Save completed sentences to My Stuff

### ✏️ Writing Practice (Japanese only)
- 3 modes: Learn (stroke order), Dictation, Sprint
- Stroke-order animation for hiragana characters
- Drawing canvas for tracing practice
- Dictation mode: hear a word → write the kana (10 rounds, 10s per word)
- Sprint mode: write as many kana as possible in 60 seconds

### ✅ Sentence Check
- Type a sentence in the target language → AI checks grammar and naturalness
- Returns corrected version with explanation
- History of recent checks persisted (last 10)
- TTS playback on corrected sentences

### 🤖 AI Language Tutor
- Translate anything to the target language powered by Azure OpenAI
- Returns target language + romanization + Sounds breakdown + English + Chinese
- **Follow-up conversations:** tap "Ask more" on any phrase to open follow-up drawer
- Quick chips: Simpler? / As a question / More examples / Break it down
- **Break it down:** AI generates mini-lesson with pattern explanation + example phrases
- **More examples:** returns 3-5 pattern variations as stacked cards
- **Teacher mode:** grammar/usage questions (why, can I use this, what does…) get direct answers first — answer → reason → example — not just alternative phrases
- **Inline Hepburn hints:** tappable 「quoted」terms in AI explanations reveal Hepburn reading inline for beginners
- Follow-up threads auto-persist per phrase in localStorage (up to 5 threads)
- Recent translations persist across tab switches (last 10)
- Star ⭐ to save structured phrases to My Stuff (toggle on/off)
- "Ask more" available from Learn phrases, Reference examples, and AI results
- AI explanation language: English or 繁體中文; follow-up style: Teacher or Phrase First (in Settings)

### 📌 My Stuff
- Learned items (phrases + reference examples)
- Bookmarked phrases
- Reference example bookmarks
- AI translation history with TTS
- Personal notes

### ☰ Menu (Left Drawer)
- My Progress — learned count, category bars, streak, recent activity
- Flashcards — kana recognition, vocab, learned phrases (SRS)
- Quiz — timed multiple choice game
- Match Game — pair Japanese ↔ English speed challenge
- Daily Challenge — learn 3 + review 5 with streak
- Writing Practice — stroke order, dictation, sprint
- Sentence Builder
- Sentence Grow
- Sentence Check — AI grammar checker
- Number Converter
- Quick Note
- Settings — light/dark mode, language, speech speed, AI explanation language, AI follow-up style

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS 4 with light/dark mode
- **Icons:** Lucide React (action buttons, nav) + emoji (decorative, categories, celebrations)
- **PWA:** vite-plugin-pwa + Workbox (offline-first)
- **Storage:** IndexedDB via `idb` (bookmarks, notes, SRS, learned items, ref bookmarks)
- **TTS:** Web Speech API
- **AI:** Azure OpenAI (gpt-4.1-mini)
- **Deployment:** GitHub Pages (auto-deploy via GitHub Actions)

## Languages Supported

| Language | Phrases | Scenarios | Reference | Sentence Grow |
|----------|---------|-----------|-----------|---------------|
| 🇯🇵 Japanese | 543+ | 46 | Full (7-step + tools) | 16 seeds + fallbacks |
| 🇪🇸 Spanish | 65+ | — | — | — |
| 🇫🇷 French | 100+ | 4 | Essentials (gender, pronunciation, verbs, signs) | 16 seeds + fallbacks |

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
```

### AI Setup (optional)
Create `.env.local`:
```
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.cognitiveservices.azure.com
VITE_AZURE_OPENAI_KEY=your-key
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4.1-mini
```

## Architecture

```
src/
├── components/          # UI components
│   ├── PhraseBook.tsx   # Category grid → phrase cards
│   ├── PhraseCard.tsx   # Individual phrase with TTS/bookmark/learned
│   ├── Reference.tsx    # 7-step grammar + tools (50 Sounds, converter, etc.)
│   ├── Scenarios.tsx    # 10-group conversation practice
│   ├── Flashcards.tsx   # SRS flashcard game with category picker
│   ├── SentenceBuilder.tsx # Pattern + vocab → sentence
│   ├── SentenceGrow.tsx # Progressive sentence expansion
│   ├── SentenceCheck.tsx # AI grammar checker
│   ├── WritingPractice.tsx # Stroke order, dictation, sprint
│   ├── AskAI.tsx        # Azure OpenAI translation
│   ├── MyStuff.tsx      # Saved items collection
│   ├── SearchBar.tsx    # Search + hamburger drawer menu
│   ├── Settings.tsx     # Theme, language, speech
│   ├── Progress.tsx     # Learning stats tracker
│   └── QuickNote.tsx    # Note-taking page
├── data/
│   ├── types.ts         # Shared types (Phrase, Category, LanguageConfig)
│   ├── phrases.ts       # 543+ Japanese phrase entries
│   ├── phrases-es.ts    # Spanish phrase entries
│   ├── phrases-fr.ts    # French phrase entries
│   ├── sentence-grow.ts # Seed sentences + fallback chains (JP + FR)
│   ├── hiragana-strokes.ts # Stroke order data (JP only)
│   ├── kana-data.ts     # Hiragana/katakana data (JP only)
│   └── scenarios.ts     # 50 conversation scenarios (JP + FR)
├── db/                  # IndexedDB (bookmarks, notes, SRS, learned, ref-bookmarks)
├── utils/               # TTS, SRS algorithm, slide panel hook
└── App.tsx              # Root with 5-tab navigation
```

---

Made with ❤️ by Anthony
