# 👑 Princess Zeynep's English Kingdom

A magical, fantasy-themed Progressive Web App (PWA) for learning English at A1 level. Built with vanilla HTML/CSS/JS and powered by Google Gemini 2.5 Flash AI.

![Theme: Royal Purple & Gold](https://img.shields.io/badge/Theme-Royal%20Purple%20%26%20Gold-4A0080)
![Level: A1 Beginner](https://img.shields.io/badge/Level-A1%20Beginner-50C878)

## ✨ Features

- 🔤 **Vocabulary** — 15 topics, AI-generated flashcards & quizzes
- 📜 **Grammar** — 10 A1 grammar lessons with AI-powered exercises
- 💬 **Conversation Practice** — Royal roleplay & real-world scenarios
- 🧚 **Luna Chatbot** — Magical AI fairy assistant
- 👑 **Scoring System** — Royal Points, milestones & achievements
- 📱 **PWA** — Installable, offline-capable, mobile-first

## 🚀 Setup

### Prerequisites
- Node.js (v18+)
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ing-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_api_key_here
```

### Local Development

```bash
# Start local dev server with Netlify CLI
npx netlify dev
```

The app will be available at `http://localhost:8888`

### Production Deployment

```bash
# Deploy to Netlify
npx netlify deploy --prod
```

**Important:** Set the `GEMINI_API_KEY` environment variable in:
**Netlify Dashboard → Site Settings → Environment Variables**

## 📁 Project Structure

```
├── index.html          # Main SPA layout
├── style.css           # Fantasy kingdom theme
├── app.js              # All application logic
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── netlify.toml        # Netlify config
├── data/
│   └── content.js      # Static A1 content
├── netlify/
│   └── functions/
│       └── ai.js       # Gemini API serverless function
└── icons/
    ├── icon-192.png    # PWA icon 192x192
    └── icon-512.png    # PWA icon 512x512
```

## 🎨 Design

The app uses a royal fantasy theme:
- **Deep purple** backgrounds with **gold** accents
- **Cinzel Decorative** display font + **Lato** body font
- Animated star particles, gold shimmer effects
- Flashcard flip animations, chat bubbles
- Responsive: mobile bottom nav, desktop top nav

## 🔒 Security

- Gemini API key is **never** exposed to the frontend
- All AI calls go through the Netlify serverless function proxy
- API key is read from environment variables only

## 📝 License

Made with ✨ for Princess Zeynep.
