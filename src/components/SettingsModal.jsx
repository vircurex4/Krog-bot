import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Sliders, 
  Database, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Trash2
} from 'lucide-react';
import { PROVIDERS } from '../constants/providers';
import axios from 'axios';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExportData,
  onClearAllData
}) {
  const [activeTab, setActiveTab] = useState('keys');
  const [formData, setFormData] = useState({ ...settings });
  const [showKeys, setShowKeys] = useState({});
  const [testStatus, setTestStatus] = useState({});
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
    setTestMessage(prev => ({ ...prev, [providerId]: 'Testing...' }));

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
        setTestMessage(prev => ({ ...prev, [providerId]: 'Connected successfully!' }));
      } else {
        setTestStatus(prev => ({ ...prev, [providerId]: 'error' }));
        setTestMessage(prev => ({ ...prev, [providerId]: 'Unexpected response' }));
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
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="w-full max-w-xl bg-arena-900 border border-arena-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-arena-800 flex items-center justify-between bg-arena-950/60">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-arena-800 border border-arena-700 flex items-center justify-center text-white">
              <span className="font-serif font-bold text-sm">π</span>
            </div>
            <h2 className="text-sm font-bold text-white">Arashmidos Settings</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-arena-400 hover:text-white hover:bg-arena-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-arena-800 bg-arena-950/40 px-3 space-x-2">
          {[
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'params', label: 'System Tuning', icon: Sliders },
            { id: 'data', label: 'Data & Backup', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'border-white text-white bg-arena-850/50'
                    : 'border-transparent text-arena-400 hover:text-arena-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'keys' && (
            <div className="space-y-3">
              <p className="text-xs text-arena-400">
                Configure your personal API keys. All keys are stored locally in your browser/desktop storage.
              </p>

              <div className="space-y-3">
                {PROVIDERS.map((provider) => {
                  const status = testStatus[provider.id];
                  const message = testMessage[provider.id];

                  return (
                    <div
                      key={provider.id}
                      className="p-3 rounded-xl bg-arena-850/70 border border-arena-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{provider.name}</span>
                        {provider.docsUrl && (
                          <a
                            href={provider.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-400 hover:underline flex items-center space-x-1"
                          >
                            <span>Get Key</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      {provider.needsKey ? (
                        <div className="space-y-2">
                          <div className="relative flex items-center">
                            <input
                              type={showKeys[provider.id] ? 'text' : 'password'}
                              value={formData.apiKeys?.[provider.id] || ''}
                              onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                              placeholder={provider.keyPlaceholder}
                              className="w-full bg-arena-950 text-white text-xs rounded-lg px-3 py-1.5 pr-10 border border-arena-750 focus:outline-none focus:border-arena-600 font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => toggleShowKey(provider.id)}
                              className="absolute right-2.5 text-arena-500 hover:text-white"
                            >
                              {showKeys[provider.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleTestConnection(provider.id)}
                              disabled={status === 'testing' || !formData.apiKeys?.[provider.id]}
                              className="px-2.5 py-1 rounded-md bg-arena-800 hover:bg-arena-750 border border-arena-700 text-xs text-arena-200 transition-colors disabled:opacity-40"
                            >
                              {status === 'testing' ? 'Testing...' : 'Test Connection'}
                            </button>

                            {message && (
                              <span className={`text-[11px] ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {message}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-400">
                          ✓ Ready to use without API key
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'params' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-arena-200 mb-1">
                  Global System Prompt / Custom Instructions:
                </label>
                <textarea
                  rows={4}
                  value={formData.customSystemPrompt || ''}
                  onChange={(e) => setFormData({ ...formData, customSystemPrompt: e.target.value })}
                  placeholder="e.g. Provide answers with concise code examples..."
                  className="w-full bg-arena-950 text-white text-xs rounded-xl p-3 border border-arena-750 focus:outline-none focus:border-arena-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-arena-850 border border-arena-750 space-y-1.5">
                  <div className="flex justify-between text-xs text-arena-200 font-medium">
                    <span>Temperature:</span>
                    <span className="font-mono text-white">{formData.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-arena-850 border border-arena-750 space-y-1.5">
                  <div className="flex justify-between text-xs text-arena-200 font-medium">
                    <span>Max Tokens:</span>
                    <span className="font-mono text-white">{formData.maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="512"
                    max="8192"
                    step="256"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-arena-850 border border-arena-750 space-y-2">
                <h3 className="text-xs font-semibold text-white">Export Chats</h3>
                <p className="text-[11px] text-arena-400">Save your full chat history as a JSON backup.</p>
                <button
                  onClick={onExportData}
                  className="px-3 py-1.5 rounded-lg bg-arena-800 hover:bg-arena-750 text-xs text-white"
                >
                  Download JSON Backup
                </button>
              </div>

              <div className="p-3 rounded-xl bg-arena-850 border border-arena-750 space-y-2">
                <h3 className="text-xs font-semibold text-red-400">Clear Data</h3>
                <p className="text-[11px] text-arena-400">Wipe all stored chats and reset settings.</p>
                <button
                  onClick={() => {
                    if (confirm('Clear all conversation history?')) {
                      onClearAllData();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs"
                >
                  Clear All Chats
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-arena-800 bg-arena-950/80 flex items-center justify-between">
          <div className="text-xs text-emerald-400 font-medium">
            {savedToast && '✓ Settings Saved'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-arena-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white text-arena-950 hover:bg-arena-200 shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
