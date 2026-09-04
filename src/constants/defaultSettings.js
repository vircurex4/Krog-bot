export const DEFAULT_SETTINGS = {
  activeProvider: 'demo',
  activeModel: 'grok-demo-v1',
  activePersona: 'fun',
  temperature: 0.7,
  maxTokens: 2048,
  deepSearchEnabled: false,
  streamResponse: true,
  soundEffects: true,
  speechVoice: 'default',
  speechRate: 1.0,
  speechPitch: 1.0,
  apiKeys: {
    demo: '',
    groq: '',
    openrouter: '',
    openai: '',
    anthropic: '',
    gemini: '',
    xai: '',
    ollama: ''
  },
  baseUrls: {
    groq: '',
    openrouter: '',
    openai: '',
    anthropic: '',
    gemini: '',
    xai: '',
    ollama: 'http://localhost:11434'
  },
  customSystemPrompt: ''
};

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + N / ⌘N', description: 'Start a new chat session' },
  { key: 'Ctrl + K / ⌘K', description: 'Open Command Palette / Search' },
  { key: 'Ctrl + , / ⌘,', description: 'Open Settings & API Keys' },
  { key: 'Ctrl + D / ⌘D', description: 'Toggle DeepSearch (Live Web)' },
  { key: 'Ctrl + M / ⌘M', description: 'Cycle through Grok Persona Modes' },
  { key: 'Ctrl + I / ⌘I', description: 'Open Imagine AI Image Studio' },
  { key: 'Ctrl + /', description: 'Show keyboard shortcuts guide' },
  { key: 'Esc', description: 'Close any active modal' }
];
