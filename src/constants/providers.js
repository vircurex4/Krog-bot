export const PROVIDERS = [
  {
    id: 'demo',
    name: 'Grok Demo Simulator',
    badge: '⚡ Instant Free Test',
    description: 'Built-in offline engine with witty Grok responses & live search — no API key needed',
    docsUrl: '',
    keyPlaceholder: 'No API key needed',
    needsKey: false,
    defaultModel: 'grok-demo-v1',
    models: [
      { id: 'grok-demo-v1', name: 'Grok Simulated Core', speed: '⚡ Ultra Fast', context: '128k' },
      { id: 'grok-demo-think', name: 'Grok Reasoning Engine', speed: '🧠 Deep Thought', context: '128k' }
    ]
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    badge: '🚀 Free & Lightning Fast',
    description: 'Ultra-fast LPU inference hosting Llama 3.3 70B and DeepSeek R1 (free API tier available)',
    docsUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'gsk_...',
    needsKey: true,
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', speed: '⚡ ~350 t/s', context: '128k' },
      { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill 70B', speed: '🧠 ~300 t/s', context: '128k' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', speed: '⚡ ~800 t/s', context: '128k' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B 32k', speed: '⚡ ~500 t/s', context: '32k' },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B IT', speed: '⚡ ~600 t/s', context: '8k' }
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    badge: '🌐 Universal Hub',
    description: 'Access 200+ models (Claude 3.5 Sonnet, DeepSeek V3, Grok-2, GPT-4o) with one unified key',
    docsUrl: 'https://openrouter.ai/keys',
    keyPlaceholder: 'sk-or-v1-...',
    needsKey: true,
    defaultModel: 'anthropic/claude-3.5-sonnet',
    models: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', speed: '🎯 State of the Art', context: '200k' },
      { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', speed: '⚡ Fast & Smart', context: '64k' },
      { id: 'x-ai/grok-2', name: 'xAI Grok-2', speed: '🚀 Official Grok', context: '128k' },
      { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o', speed: '🧠 Multimodal', context: '128k' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', speed: '⚡ Open Weights', context: '128k' },
      { id: 'mistralai/mistral-large-2407', name: 'Mistral Large 2', speed: '🎯 Reasoning', context: '128k' }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    badge: '🤖 GPT-4o & o-Series',
    description: 'Official OpenAI models including GPT-4o, GPT-4o-mini, o1-preview, and o3-mini',
    docsUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'sk-proj-...',
    needsKey: true,
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Omni)', speed: '🎯 Flagship', context: '128k' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', speed: '⚡ Fast & Cost-Effective', context: '128k' },
      { id: 'o3-mini', name: 'o3-mini (Reasoning)', speed: '🧠 Math & Code', context: '128k' },
      { id: 'o1-preview', name: 'o1-preview', speed: '🧠 Deep Logic', context: '128k' }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    badge: '✨ Claude 3.5 Series',
    description: 'Claude 3.5 Sonnet and Haiku with industry-leading code and reasoning quality',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-api03-...',
    needsKey: true,
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)', speed: '🎯 Code & Nuance', context: '200k' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', speed: '⚡ Fast & Sharp', context: '200k' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', speed: '🧠 Deep Analysis', context: '200k' }
    ]
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: '🔮 Gemini 2.0 & 1.5',
    description: 'Google AI models featuring 1M+ token context window and rapid multimodel speed',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy...',
    needsKey: true,
    defaultModel: 'gemini-1.5-flash',
    models: [
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)', speed: '⚡ Ultra Fast', context: '1M' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', speed: '🧠 2M Context', context: '2M' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', speed: '⚡ Fast & Cheap', context: '1M' }
    ]
  },
  {
    id: 'xai',
    name: 'xAI (Official Grok)',
    badge: '🌌 Native Grok-2',
    description: 'Direct API connection to official xAI Grok-2 and Grok-2 Vision',
    docsUrl: 'https://console.x.ai',
    keyPlaceholder: 'xai-...',
    needsKey: true,
    defaultModel: 'grok-2-1212',
    models: [
      { id: 'grok-2-1212', name: 'Grok-2 (Latest)', speed: '🚀 Flagship Grok', context: '128k' },
      { id: 'grok-2-vision-1212', name: 'Grok-2 Vision', speed: '👁️ Vision & Text', context: '128k' },
      { id: 'grok-beta', name: 'Grok Beta', speed: '⚡ Rapid Iteration', context: '128k' }
    ]
  },
  {
    id: 'ollama',
    name: 'Ollama (Local Desktop)',
    badge: '💻 100% Private Offline',
    description: 'Connect directly to your local Ollama server running on your computer',
    docsUrl: 'https://ollama.com',
    keyPlaceholder: 'No key needed for local Ollama',
    needsKey: false,
    defaultModel: 'llama3',
    defaultBaseUrl: 'http://localhost:11434',
    models: [
      { id: 'llama3', name: 'Llama 3 (Local)', speed: '💻 Local CPU/GPU', context: '8k' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder (Local)', speed: '💻 Local Code', context: '16k' },
      { id: 'mistral', name: 'Mistral (Local)', speed: '💻 Local 7B', context: '8k' },
      { id: 'qwen2.5', name: 'Qwen 2.5 (Local)', speed: '💻 Multilingual', context: '32k' }
    ]
  }
];
