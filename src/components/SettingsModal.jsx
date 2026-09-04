import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Cpu, 
  Sliders, 
  Volume2, 
  Database, 
  Check, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Save,
  Trash2
} from 'lucide-react';
import { PROVIDERS } from '../constants/providers';
import { GROK_PERSONAS } from '../constants/personas';
import axios from 'axios';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExportData,
  onImportData,
  onClearAllData
}) {
  const [activeTab, setActiveTab] = useState('keys'); // 'keys' | 'params' | 'voice' | 'data'
  const [formData, setFormData] = useState({ ...settings });
  const [showKeys, setShowKeys] = useState({});
  const [testStatus, setTestStatus] = useState({}); // { [providerId]: 'testing' | 'success' | 'error' }
  const [testMessage, setTestMessage] = useState({});
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleKeyChange = (providerId, value) => {
    setFormData(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [providerId]: value
      }
    }));
  };

  const handleBaseUrlChange = (providerId, value) => {
    setFormData(prev => ({
      ...prev,
      baseUrls: {
        ...prev.baseUrls,
        [providerId]: value
      }
    }));
  };

  const toggleShowKey = (providerId) => {
    setShowKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const handleTestConnection = async (providerId) => {
    setTestStatus(prev => ({ ...prev, [providerId]: 'testing' }));
    setTestMessage(prev => ({ ...prev, [providerId]: 'Testing endpoint...' }));

    const providerConfig = PROVIDERS.find(p => p.id === providerId);
    const key = formData.apiKeys?.[providerId];
    const baseUrl = formData.baseUrls?.[providerId];

    if (providerConfig?.needsKey && !key) {
      setTestStatus(prev => ({ ...prev, [providerId]: 'error' }));
      setTestMessage(prev => ({ ...prev, [providerId]: 'API key cannot be empty' }));
      return;
    }

    try {
      const response = await axios.post('/api/chat', {
        provider: providerId,
        model: providerConfig?.models[0]?.id || 'default',
        messages: [{ role: 'user', content: 'Ping test. Reply with: OK' }],
        apiKey: key,
        baseUrl: baseUrl,
        max_tokens: 10
      });

      if (response.data?.choices?.[0]?.message?.content) {
        setTestStatus(prev => ({ ...prev, [providerId]: 'success' }));
        setTestMessage(prev => ({ ...prev, [providerId]: 'Connected successfully! ⚡' }));
      } else {
        setTestStatus(prev => ({ ...prev, [providerId]: 'error' }));
        setTestMessage(prev => ({ ...prev, [providerId]: 'Unexpected response format' }));
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setTestStatus(prev => ({ ...prev, [providerId]: 'error' }));
      setTestMessage(prev => ({ ...prev, [providerId]: errMsg }));
    }
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-obsidian-900 border border-obsidian-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/10">
        {/* Header */}
        <div className="p-4 border-b border-obsidian-800 flex items-center justify-between bg-obsidian-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-grok-blue/15 border border-grok-blue/30 flex items-center justify-center text-grok-blue">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Workstation Settings</h2>
              <p className="text-[11px] text-obsidian-400">Configure your API keys, Grok persona rules, and models</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-obsidian-800 bg-obsidian-950/30 px-4 space-x-2">
          {[
            { id: 'keys', label: 'API Keys & Providers', icon: Key },
            { id: 'params', label: 'Personas & Tuning', icon: Sliders },
            { id: 'voice', label: 'Voice & Speech', icon: Volume2 },
            { id: 'data', label: 'Data & Backup', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2.5 px-3 border-b-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border-grok-blue text-grok-blue bg-obsidian-850/60'
                    : 'border-transparent text-obsidian-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: API KEYS */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Your Keys are 100% Private:</strong> API keys are saved strictly in your local browser/desktop storage. You can use Groq (free fast Llama 3.3), OpenRouter (all models in one), OpenAI, Anthropic, Gemini, or local Ollama!
                </div>
              </div>

              <div className="space-y-3.5">
                {PROVIDERS.map((provider) => {
                  const hasKey = !!formData.apiKeys?.[provider.id];
                  const status = testStatus[provider.id];
                  const message = testMessage[provider.id];

                  return (
                    <div
                      key={provider.id}
                      className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-100">{provider.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
                            {provider.badge}
                          </span>
                        </div>

                        {provider.docsUrl && (
                          <a
                            href={provider.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-grok-blue hover:underline flex items-center space-x-1"
                          >
                            <span>Get Key</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <p className="text-[11px] text-obsidian-400">{provider.description}</p>

                      {provider.needsKey ? (
                        <div className="space-y-2">
                          <div className="relative flex items-center">
                            <input
                              type={showKeys[provider.id] ? 'text' : 'password'}
                              value={formData.apiKeys?.[provider.id] || ''}
                              onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                              placeholder={provider.keyPlaceholder}
                              className="w-full bg-obsidian-950 text-slate-100 text-xs rounded-lg px-3 py-2 pr-20 border border-obsidian-700 focus:outline-none focus:border-cyan-500/60 font-mono"
                            />
                            <div className="absolute right-2 flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => toggleShowKey(provider.id)}
                                className="p-1 text-obsidian-400 hover:text-slate-200"
                                title={showKeys[provider.id] ? 'Hide Key' : 'Show Key'}
                              >
                                {showKeys[provider.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Base URL override if custom */}
                          {provider.id === 'openrouter' || provider.id === 'openai' ? (
                            <input
                              type="text"
                              value={formData.baseUrls?.[provider.id] || ''}
                              onChange={(e) => handleBaseUrlChange(provider.id, e.target.value)}
                              placeholder="Custom Base URL (optional, e.g. https://...)"
                              className="w-full bg-obsidian-950/60 text-obsidian-300 text-[11px] rounded-lg px-3 py-1.5 border border-obsidian-800 focus:outline-none focus:border-cyan-500/40 font-mono"
                            />
                          ) : null}

                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => handleTestConnection(provider.id)}
                              disabled={status === 'testing' || !formData.apiKeys?.[provider.id]}
                              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-xs text-obsidian-300 hover:text-white transition-colors disabled:opacity-40"
                            >
                              <RefreshCw className={`w-3 h-3 ${status === 'testing' ? 'animate-spin' : ''}`} />
                              <span>Test Connection</span>
                            </button>

                            {message && (
                              <div className={`text-[11px] flex items-center space-x-1 ${
                                status === 'success' ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                                {status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                <span className="truncate max-w-[280px]">{message}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : provider.id === 'ollama' ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={formData.baseUrls?.ollama || 'http://localhost:11434'}
                            onChange={(e) => handleBaseUrlChange('ollama', e.target.value)}
                            placeholder="http://localhost:11434"
                            className="w-full bg-obsidian-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-obsidian-700 focus:outline-none focus:border-cyan-500/60 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleTestConnection('ollama')}
                            className="px-2.5 py-1 rounded-md bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-xs text-obsidian-300 hover:text-white"
                          >
                            Test Local Ollama
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-400 flex items-center space-x-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Always active & ready to chat</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAS & TUNING */}
          {activeTab === 'params' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Custom Global System Prompt / Guidelines:
                </label>
                <p className="text-[11px] text-obsidian-400 mb-2">
                  Appended to Grok's persona instructions for all conversations.
                </p>
                <textarea
                  rows={4}
                  value={formData.customSystemPrompt || ''}
                  onChange={(e) => setFormData({ ...formData, customSystemPrompt: e.target.value })}
                  placeholder="e.g. Always respond in concise bullet points, prefer TypeScript over JavaScript, mention SpaceX analogies..."
                  className="w-full bg-obsidian-950 text-slate-100 text-xs rounded-xl p-3 border border-obsidian-750 focus:outline-none focus:border-cyan-500/60 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">Default Temperature:</span>
                    <span className="font-mono text-grok-blue">{formData.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-obsidian-500">
                    <span>Precise (0.0)</span>
                    <span>Balanced (0.7)</span>
                    <span>Creative (1.5)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">Max Tokens:</span>
                    <span className="font-mono text-grok-blue">{formData.maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="512"
                    max="8192"
                    step="256"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-obsidian-500">
                    <span>512</span>
                    <span>2048</span>
                    <span>8192</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VOICE & SPEECH */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-3">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-grok-blue" />
                  <span className="text-xs font-bold text-slate-200">Grok Voice Narration (TTS)</span>
                </div>
                <p className="text-[11px] text-obsidian-400">
                  Click the speaker icon on any message to have Grok read it aloud with local neural voice synthesis.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-obsidian-300">Speech Rate:</span>
                      <span className="font-mono text-grok-blue">{formData.speechRate}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.75"
                      max="1.5"
                      step="0.05"
                      value={formData.speechRate || 1.05}
                      onChange={(e) => setFormData({ ...formData, speechRate: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-obsidian-300">Speech Pitch:</span>
                      <span className="font-mono text-grok-blue">{formData.speechPitch}</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={formData.speechPitch || 1.0}
                      onChange={(e) => setFormData({ ...formData, speechPitch: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA & BACKUP */}
          {activeTab === 'data' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2">
                <h3 className="text-xs font-bold text-slate-200">Export & Backup</h3>
                <p className="text-[11px] text-obsidian-400">
                  Save all conversation history and preferences to a backup JSON file.
                </p>
                <button
                  onClick={onExportData}
                  className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-xs text-slate-200 font-medium transition-colors"
                >
                  Export Workspace Backup (.json)
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2">
                <h3 className="text-xs font-bold text-red-400">Danger Zone</h3>
                <p className="text-[11px] text-obsidian-400">
                  Clear all stored chat histories and reset preferences.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all conversations?')) {
                      onClearAllData();
                      onClose();
                    }
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Wipe All Local Chats</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-obsidian-800 bg-obsidian-950/80 flex items-center justify-between">
          <div className="text-xs text-obsidian-400">
            {savedToast && <span className="text-emerald-400 font-medium">✓ Settings Saved</span>}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-tr from-cyan-500 to-blue-600 text-black shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
