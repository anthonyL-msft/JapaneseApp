# 🌏 Travel Language Companion

An offline-first PWA for learning and using foreign languages while traveling. Built for real-world situations — ordering food, asking directions, taking trains, checking into hotels.

**Live:** [anthonyl-msft.github.io/JapaneseApp](https://anthonyl-msft.github.io/JapaneseApp/)

## Features

### 📖 Phrase Book
- 350+ travel phrases organized by category (Greetings, Restaurant, Hotel, Shopping, etc.)
- Hepburn romanization with syllable chunks for easy pronunciation
- TTS (Text-to-Speech) with adjustable speed
- Bookmark ☆ and Mark as Learned ✓

### 📚 Quick Reference
- **7-Step Learning Framework:** 50 Sounds → Sentence Structure → Particles → Polite Forms → Numbers → Yes/No Questions → Question Words
- Voiced/voiceless kana toggle overlay
- Accordion examples with Open All/Close All
- Interactive number converter with currency rates (HKD/CAD)

### 🎭 Conversations
- 28 real-world dialogue scenarios (restaurant, hotel, train station, etc.)
- Step-by-step reveal with auto-play TTS
- Variable swap (change places, times, quantities in conversations)
- Speaker labels (Staff vs You)

### 🃏 Flashcards
- SRS (Spaced Repetition System) with SM-2 algorithm
- Category picker: study by topic or review all learned items
- 4-level rating: Again / Hard / Good / Easy

### 🤖 Ask AI
- "How do I say...?" powered by Azure OpenAI
- Returns target language + romanization + English + Chinese (Traditional)
- Save translations to My Stuff

### 📌 My Stuff
- Bookmarked phrases and reference examples
- Learned items tracker
- AI translation history
- Personal notes (WiFi passwords, restaurant names, etc.)

### ☰ Menu
- Language switcher (Japanese 🇯🇵, Spanish 🇪🇸, French 🇫🇷)
- Quick tools (Flashcards, Number Converter)
- Speech speed settings

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS 4
- **PWA:** vite-plugin-pwa + Workbox (offline-first)
- **Storage:** IndexedDB via `idb` (bookmarks, notes, SRS, learned items)
- **TTS:** Web Speech API
- **AI:** Azure OpenAI (gpt-4.1-mini)
- **Deployment:** GitHub Pages (auto-deploy via GitHub Actions)

## Languages Supported

| Language | Phrases | Scenarios | Reference |
|----------|---------|-----------|-----------|
| 🇯🇵 Japanese | 350+ | 28 | Full (7-step + tools) |
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
├── components/     # UI components (PhraseBook, Reference, Scenarios, etc.)
├── data/           # Phrase data, types, category definitions
│   ├── types.ts    # Shared types (Phrase, Category, etc.)
│   ├── phrases.ts  # 350+ phrase entries
│   └── scenarios.ts # 28 conversation scenarios
├── db/             # IndexedDB operations (bookmarks, notes, SRS, learned)
├── utils/          # TTS, SRS algorithm, slide panel hook
└── App.tsx         # Root component with tab navigation
```

---

Made with ❤️ by Anthony
