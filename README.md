# 🌏 Travel Language Companion

An offline-first PWA for learning and using foreign languages while traveling. Built for real-world situations — ordering food, asking directions, taking trains, checking into hotels.


## Features

### 📖 Phrase Book
- 418+ travel phrases organized by 12 categories
- Categories: Greetings, Basics & Vocab, Airport & Transit, Hotel, Restaurant, Food & Drinks, Shopping, Directions, Emergency, Small Talk, Culture, Local Specials
- Hepburn romanization with syllable chunks for easy pronunciation
- **Sounds breakdown:** expanded cards show kana-to-romaji mapping with proximity-based grouping — vowel lengtheners (よう), nasal ん, and devoiced す render smaller and tighter to show how characters combine into spoken sounds
- TTS (Text-to-Speech) with adjustable speed
- Bookmark ☆ and Mark as Learned ✓
- Default Open All with Close All toggle

### 📚 Quick Reference
- **7-Step Learning Framework:** 50 Sounds → Sentence Structure → Particles → Polite Forms → Numbers → Yes/No Questions → Question Words
- 50 Sounds with voiced/voiceless toggle overlay (dakuten ゛ / handakuten ゜)
- Tap any kana → bottom drawer with travel vocab examples
- Accordion examples with Open All/Close All in header
- Interactive number converter with currency rates (HKD/CAD)
- Tools: Counters, Sentence Patterns, Common Signs

### 🎭 Conversations
- 45 real-world dialogue scenarios across 10 groups
- Groups: Airport, Train, Bus & Taxi, Hotel, Restaurant, Food Spots, Shopping, Daily Life, Activities, Trouble
- Step-by-step reveal with auto-play TTS
- Variable swap (change destinations, times, party sizes, durations in conversations)
- Speaker labels (Staff vs You) with chat bubble UI

### 🃏 Flashcards
- SRS (Spaced Repetition System) with SM-2 algorithm
- Category picker: study by topic or review all learned items
- Includes both phrases and reference examples
- 4-level rating: Again / Hard / Good / Easy

### 🔧 Sentence Builder
- Pick a pattern template → fill with vocab chips → get complete sentence
- 3 tabs: Requests, Questions, I want...
- 12 patterns × 60+ vocab items = unlimited combinations
- Sticky result card with TTS + Copy
- Smart vocab: noun patterns also show food/drink chips

### 🤖 Ask AI
- "How do I say...?" powered by Azure OpenAI
- Returns target language + romanization + English + Chinese (Traditional)
- Save translations to My Stuff

### 📌 My Stuff
- ✅ Learned items (phrases + reference examples)
- ⭐ Bookmarked phrases
- 📚 Reference example bookmarks
- 🤖 AI translation history with TTS
- 📝 Personal notes

### ☰ Menu (Left Drawer)
- 📊 My Progress — learned count, category bars, streak, recent activity
- 🃏 Flashcards
- 🔄 Number Converter
- 🔧 Sentence Builder
- 📝 Quick Note
- ⚙️ Settings — light/dark mode, language, speech speed

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS 4 with light/dark mode
- **PWA:** vite-plugin-pwa + Workbox (offline-first)
- **Storage:** IndexedDB via `idb` (bookmarks, notes, SRS, learned items, ref bookmarks)
- **TTS:** Web Speech API
- **AI:** Azure OpenAI (gpt-4.1-mini)
- **Deployment:** GitHub Pages (auto-deploy via GitHub Actions)

## Languages Supported

| Language | Phrases | Scenarios | Reference |
|----------|---------|-----------|-----------|
| 🇯🇵 Japanese | 418+ | 45 | Full (7-step + tools) |
| 🇪🇸 Spanish | Basic | — | — |
| 🇫🇷 French | Basic | — | — |

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
│   ├── AskAI.tsx        # Azure OpenAI translation
│   ├── MyStuff.tsx      # Saved items collection
│   ├── SearchBar.tsx    # Search + hamburger drawer menu
│   ├── Settings.tsx     # Theme, language, speech
│   ├── Progress.tsx     # Learning stats tracker
│   └── QuickNote.tsx    # Note-taking page
├── data/
│   ├── types.ts         # Shared types (Phrase, Category, etc.)
│   ├── phrases.ts       # 418+ phrase entries
│   └── scenarios.ts     # 45 conversation scenarios
├── db/                  # IndexedDB (bookmarks, notes, SRS, learned, ref-bookmarks)
├── utils/               # TTS, SRS algorithm, slide panel hook
└── App.tsx              # Root with 5-tab navigation
```

---

Made with ❤️ by Anthony
