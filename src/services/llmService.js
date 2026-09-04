import axios from 'axios';
import { GROK_PERSONAS } from '../constants/personas';
import { PROVIDERS } from '../constants/providers';

export const llmService = {
  async sendMessage({
    messages,
    activeProvider = 'demo',
    activeModel = 'llama-3.3-70b-versatile',
    activePersona = 'fun',
    settings,
    searchContext = null,
    onStreamChunk = null
  }) {
    const persona = GROK_PERSONAS.find(p => p.id === activePersona) || GROK_PERSONAS[0];
    const providerConfig = PROVIDERS.find(p => p.id === activeProvider) || PROVIDERS[0];
    const apiKey = settings.apiKeys?.[activeProvider] || '';
    const baseUrl = settings.baseUrls?.[activeProvider] || providerConfig.defaultBaseUrl || '';

    // If provider requires a key and user doesn't have one set
    if (providerConfig.needsKey && !apiKey) {
      throw new Error(`API key required for ${providerConfig.name}. Please open Settings (⚙️) to enter your API key, or switch to the free Demo Simulator.`);
    }

    // Build the system prompt
    let systemPrompt = persona.systemPrompt;
    if (settings.customSystemPrompt && settings.customSystemPrompt.trim()) {
      systemPrompt += `\n\nAdditional user guidelines:\n${settings.customSystemPrompt.trim()}`;
    }

    // Inject DeepSearch context if present
    if (searchContext) {
      systemPrompt += `\n\n${searchContext}`;
    }

    // Prepare full conversation array
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    const payload = {
      provider: activeProvider,
      model: activeModel || providerConfig.defaultModel,
      messages: fullMessages,
      apiKey,
      baseUrl,
      temperature: persona.temperature ?? (settings.temperature || 0.7),
      max_tokens: settings.maxTokens || 2048,
      mode: activePersona,
      stream: false
    };

    try {
      const response = await axios.post('/api/chat', payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });

      const choice = response.data.choices?.[0];
      if (!choice || !choice.message) {
        throw new Error('No response returned from model.');
      }

      let rawContent = choice.message.content || '';
      let reasoning = choice.message.reasoning || '';

      // Check if rawContent contains <think>...</think> tags (like DeepSeek R1 / Grok reasoning)
      const thinkMatch = rawContent.match(/<think>([\s\S]*?)<\/think>/i);
      if (thinkMatch) {
        reasoning = thinkMatch[1].trim();
        rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
      }

      return {
        role: 'assistant',
        content: rawContent,
        reasoning: reasoning || null,
        usage: response.data.usage,
        model: activeModel,
        provider: activeProvider,
        persona: activePersona,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('LLM service request failed:', err);
      const errMsg = err.response?.data?.error || err.message || 'Unknown network error';
      throw new Error(errMsg);
    }
  }
};
