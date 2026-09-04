# ⚡ GrokPulse Desktop

> **Next-Generation, High-Performance Multi-Model AI Desktop Workstation & Grok Alternative**

GrokPulse Desktop is a privacy-first, desktop-grade AI workstation inspired by Grok. It lets you connect your own API keys or run local offline models while enjoying Grok's signature features: **witty persona modes, real-time live DeepSearch, interactive code execution sandbox, Imagine AI image generation, and voice synthesis**.

---

## 🌟 Key Highlights & Features

### 1. 🎭 Grok Persona Modes
- 🚀 **Fun Mode (Grok Classic)**: Sarcastic, edgy, humorous, pop-culture savvy, zero corporate boilerplate fluff.
- 🧠 **DeepThink Mode**: Full step-by-step chain-of-thought reasoning with collapsible thinking processes and rigor.
- 🎯 **Normal Mode**: Fast, concise, objective, sharp, and balanced.
- 🔥 **De-Hype Mode (Unhinged Reality)**: Debunks marketing speak, corporate buzzwords, and PR fluff with brutal pragmatism.
- 💻 **Dev Master Mode**: Principal software engineer persona delivering clean, benchmarked, modular code.

### 2. 🔌 Universal Multi-Provider & Model Switcher
Bring your own API key or connect to any backend with zero vendor lock-in:
- **Groq Cloud** (Lightning fast ~300-800 t/s with *Llama 3.3 70B*, *DeepSeek R1 Distill*, *Mixtral*) — *Free API tier available!*
- **OpenRouter** (Universal hub: *Claude 3.5 Sonnet*, *GPT-4o*, *DeepSeek V3*, *Grok-2*)
- **OpenAI** (*GPT-4o*, *GPT-4o-mini*, *o1*, *o3-mini*)
- **Anthropic Claude** (*Claude 3.5 Sonnet*, *Claude 3.5 Haiku*, *Claude 3 Opus*)
- **Google Gemini** (*Gemini 2.0 Flash*, *Gemini 1.5 Pro*)
- **xAI Official** (*Grok-2*, *Grok-2-Vision*)
- **Ollama (Local Offline)** (*Llama 3*, *DeepSeek-Coder*, *Mistral*, *Qwen 2.5* on `http://localhost:11434`)
- **Grok Demo Simulator** (Built-in offline mode to test immediately with no API key needed)

### 3. 🌐 DeepSearch (Real-Time Live Web Search)
- Query the web in real-time using instant search indexes and Wikipedia context.
- Live source cards with citations and clickable references.

### 4. 💻 Interactive Code Execution Sandbox
- Run JavaScript code directly inside the chat interface.
- Real-time terminal output, console logs, error trapping, and millisecond execution timers.

### 5. 🎨 Imagine Studio (AI Image Generation)
- Built-in Flux / Aurora AI image engine.
- Grokify Prompt enhancer, aspect ratios (1:1, 16:9, 9:16), and instant downloads.

### 6. 🎙️ Voice & Neural Speech
- **Voice Input (STT)**: Speak directly into the microphone with active speech recognition.
- **Voice Narration (TTS)**: Listen to Grok read answers aloud with customizable pitch and speed.

### 7. 🔒 100% Privacy & Local Storage
- API keys and chat histories remain strictly on your local machine.
- Export chats as Markdown (`.md`), JSON, or backup the entire workstation state.

---

## 🚀 Quick Start Guide

### 1. Running in Web Preview Mode (Instant)
The server is already running live on `http://localhost:3000`! You can use the app immediately in your browser preview.

### 2. Running Locally as a Native Desktop App (Electron)

#### Prerequisites:
- Node.js 18+ and npm installed

```bash
# Clone or navigate to the directory
cd grok-desktop

# Install dependencies
npm install

# Start both backend and React client
npm run dev

# Launch Electron desktop window
npm run electron:dev
```

### 3. Building Standalone Desktop Installers (.exe, .dmg, .AppImage)

```bash
# Build desktop production packages
npm run electron:build
```

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + N` / `⌘N` | Start a new conversation |
| `Ctrl + K` / `⌘K` | Quick Command Palette & Search |
| `Ctrl + ,` / `⌘,` | Open Settings & API Key Manager |
| `Ctrl + D` / `⌘D` | Toggle Real-Time DeepSearch |
| `Ctrl + M` / `⌘M` | Cycle through Grok Persona Modes |
| `Ctrl + I` / `⌘I` | Open Imagine AI Image Studio |
| `Ctrl + /` | Keyboard Shortcuts Reference |
| `Esc` | Close active dialog / modal |

---

## ⚙️ Setting Up Your API Keys

1. Click **Settings (⚙️)** in the top right or press `Ctrl+,` (or `⌘,`).
2. Go to **API Keys & Providers**.
3. Paste your key:
   - **Groq**: [console.groq.com/keys](https://console.groq.com/keys) (Free & ultra-fast)
   - **OpenRouter**: [openrouter.ai/keys](https://openrouter.ai/keys)
   - **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
   - **Gemini**: [aistudio.google.com](https://aistudio.google.com)
   - **xAI**: [console.x.ai](https://console.x.ai)
4. Click **Test Connection** to verify your endpoint.
5. Click **Save Changes**!
