import React, { useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Globe, 
  Menu, 
  Trash2, 
  Flame, 
  BrainCircuit, 
  Zap, 
  Skull, 
  Terminal,
  Loader2,
  Cpu
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ModeSelector from './ModeSelector';
import ModelSelector from './ModelSelector';
import { GROK_PERSONAS, SUGGESTED_PROMPTS } from '../constants/personas';

const PERSONA_ICONS = {
  Flame: Flame,
  BrainCircuit: BrainCircuit,
  Zap: Zap,
  Skull: Skull,
  Terminal: Terminal
};

export default function ChatArea({
  activeChat,
  activePersona,
  activeProvider,
  activeModel,
  settings,
  isLoading,
  searchStatus,
  onSendMessage,
  onStopGenerating,
  onRegenerate,
  onClearMessages,
  onSelectPersona,
  onSelectProvider,
  onSelectModel,
  onOpenSettings,
  onOpenImageModal,
  deepSearchEnabled,
  onToggleDeepSearch,
  sidebarOpen,
  onToggleSidebar
}) {
  const messagesEndRef = useRef(null);
  const currentPersona = GROK_PERSONAS.find(p => p.id === activePersona) || GROK_PERSONAS[0];
  const PersonaIcon = PERSONA_ICONS[currentPersona.iconName] || Sparkles;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading, searchStatus]);

  const messages = activeChat?.messages || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-obsidian-950 relative overflow-hidden">
      {/* Top Bar Header */}
      <div className="h-14 border-b border-obsidian-800 bg-obsidian-900/60 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center space-x-3">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Mode Selector */}
          <ModeSelector
            activePersona={activePersona}
            onSelectPersona={onSelectPersona}
          />
        </div>

        {/* Right Controls: Model Picker & Actions */}
        <div className="flex items-center space-x-2">
          <ModelSelector
            activeProvider={activeProvider}
            activeModel={activeModel}
            settings={settings}
            onSelectProvider={onSelectProvider}
            onSelectModel={onSelectModel}
            onOpenSettings={onOpenSettings}
          />

          {messages.length > 0 && (
            <button
              onClick={onClearMessages}
              className="p-1.5 rounded-lg text-obsidian-400 hover:text-red-400 hover:bg-obsidian-800 transition-colors"
              title="Clear current messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Scroll Container */}
      <div className="flex-1 overflow-y-auto relative">
        {messages.length === 0 ? (
          /* Empty / Hero State */
          <div className="min-h-full flex flex-col items-center justify-center p-6 max-w-3xl mx-auto text-center animate-in fade-in duration-300">
            {/* Animated Grok Hero Orb */}
            <div className="relative mb-6">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${currentPersona.accentColor}30, #0a0b0e)`,
                  border: `1.5px solid ${currentPersona.accentColor}80`
                }}
              >
                <PersonaIcon 
                  className="w-10 h-10 animate-pulse"
                  style={{ color: currentPersona.accentColor }}
                />
              </div>
              <div 
                className="absolute -inset-4 rounded-full opacity-30 blur-2xl pointer-events-none animate-pulse"
                style={{ backgroundColor: currentPersona.accentColor }}
              />
            </div>

            {/* Persona Title & Tagline */}
            <div className="space-y-2 mb-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-obsidian-850 border border-obsidian-750 text-xs text-obsidian-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentPersona.accentColor }}></span>
                <span>{currentPersona.badge}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
                Grok <span style={{ color: currentPersona.accentColor }}>{currentPersona.name}</span>
              </h1>
              <p className="text-sm text-obsidian-300 max-w-lg mx-auto leading-relaxed">
                {currentPersona.tagline}
              </p>
            </div>

            {/* Suggested Starter Prompts */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPersona(item.mode);
                    onSendMessage(item.prompt);
                  }}
                  className="p-3.5 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-850 border border-obsidian-800 hover:border-obsidian-700 transition-all text-xs group shadow-sm flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-obsidian-950 text-obsidian-400 font-mono">
                      {item.mode}
                    </span>
                  </div>
                  <p className="text-obsidian-400 text-[11px] line-clamp-2 leading-relaxed">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>

            {/* Capabilities Pill Strip */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-obsidian-400">
              <span className="px-2.5 py-1 rounded-md bg-obsidian-900 border border-obsidian-800 flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>Multi-Model Switcher (Groq, Claude, OpenAI, Ollama)</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-obsidian-900 border border-obsidian-800 flex items-center space-x-1">
                <Globe className="w-3 h-3 text-amber-400" />
                <span>Real-Time DeepSearch</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-obsidian-900 border border-obsidian-800 flex items-center space-x-1">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Live JS Sandbox</span>
              </span>
            </div>
          </div>
        ) : (
          /* Messages Feed */
          <div className="divide-y divide-obsidian-900/40 pb-6">
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                message={msg}
                isLatest={idx === messages.length - 1}
                onRegenerate={idx === messages.length - 1 && msg.role === 'assistant' ? onRegenerate : null}
              />
            ))}

            {/* Live Loading / DeepSearch Indicator */}
            {isLoading && (
              <div className="py-4 px-4 md:px-6 bg-obsidian-900/30 border-y border-obsidian-900/60">
                <div className="max-w-4xl mx-auto flex space-x-3.5 items-start">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md relative"
                    style={{ backgroundColor: `${currentPersona.accentColor}20`, border: `1px solid ${currentPersona.accentColor}60` }}
                  >
                    <PersonaIcon className="w-4 h-4 animate-spin" style={{ color: currentPersona.accentColor, animationDuration: '3s' }} />
                  </div>

                  <div className="flex-1 space-y-2 pt-1">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                      <span>Grok ({currentPersona.shortName})</span>
                      <span className="text-[10px] text-obsidian-400 font-mono">synthesizing...</span>
                    </div>

                    {searchStatus ? (
                      <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                        <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '2s' }} />
                        <span>{searchStatus}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 py-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        <span className="text-xs text-obsidian-400 pl-2">Formulating optimal response...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 pt-2 z-20">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onStopGenerating={onStopGenerating}
          deepSearchEnabled={deepSearchEnabled}
          onToggleDeepSearch={onToggleDeepSearch}
          onOpenImageModal={onOpenImageModal}
          activePersona={activePersona}
        />
      </div>
    </div>
  );
}
