import React, { useRef, useEffect } from 'react';
import { 
  Globe, 
  Trash2, 
  Loader2,
  Cpu
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ModeSelector from './ModeSelector';
import ModelSelector from './ModelSelector';
import { GROK_PERSONAS, SUGGESTED_PROMPTS } from '../constants/personas';

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
  deepSearchEnabled,
  onToggleDeepSearch
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading, searchStatus]);

  const messages = activeChat?.messages || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-arena-950 relative overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-12 border-b border-arena-750 bg-arena-900/60 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center space-x-2">
          <ModeSelector
            activePersona={activePersona}
            onSelectPersona={onSelectPersona}
          />
        </div>

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
              className="p-1.5 rounded-lg text-arena-400 hover:text-red-400 hover:bg-arena-800 transition-colors"
              title="Clear current messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Scroll View */}
      <div className="flex-1 overflow-y-auto relative">
        {messages.length === 0 ? (
          /* Clean Arena.ai Empty State */
          <div className="min-h-full flex flex-col items-center justify-center p-6 max-w-2xl mx-auto text-center animate-in fade-in duration-200">
            {/* Pi Logo */}
            <div className="w-14 h-14 rounded-2xl bg-arena-850 border border-arena-700 flex items-center justify-center mb-5 shadow-sm">
              <span className="font-serif font-bold text-white text-3xl">π</span>
            </div>

            <h1 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">
              Arashmidos AI Arena
            </h1>
            <p className="text-xs text-arena-400 max-w-md mx-auto mb-8 leading-relaxed">
              Multi-model AI workstation. Choose any model backend, search the live web, or execute code directly.
            </p>

            {/* Clean Prompt Cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-left">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPersona(item.mode);
                    onSendMessage(item.prompt);
                  }}
                  className="p-3 rounded-xl bg-arena-900 hover:bg-arena-850 border border-arena-800 hover:border-arena-700 transition-all text-xs text-arena-300 hover:text-white"
                >
                  <div className="font-semibold text-white mb-1">{item.title}</div>
                  <div className="text-arena-400 text-[11px] line-clamp-2">{item.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="divide-y divide-arena-900/50 pb-6">
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                message={msg}
                isLatest={idx === messages.length - 1}
                onRegenerate={idx === messages.length - 1 && msg.role === 'assistant' ? onRegenerate : null}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-4 px-4 md:px-6 bg-arena-900/30 border-y border-arena-850/50">
                <div className="max-w-3xl mx-auto flex space-x-3.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-arena-800 border border-arena-700 flex items-center justify-center text-white">
                    <span className="font-serif font-bold text-sm animate-pulse">π</span>
                  </div>

                  <div className="flex-1 space-y-1.5 pt-0.5">
                    {searchStatus ? (
                      <div className="flex items-center space-x-2 text-xs text-arena-300 bg-arena-850 px-3 py-1.5 rounded-lg border border-arena-750">
                        <Globe className="w-3.5 h-3.5 animate-spin" />
                        <span>{searchStatus}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 py-1 text-xs text-arena-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-arena-300" />
                        <span>Generating response...</span>
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

      {/* Input */}
      <div className="shrink-0 pt-2 z-10">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onStopGenerating={onStopGenerating}
          deepSearchEnabled={deepSearchEnabled}
          onToggleDeepSearch={onToggleDeepSearch}
        />
      </div>
    </div>
  );
}
