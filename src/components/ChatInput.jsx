import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Square, 
  Globe, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  Sparkles,
  Paperclip,
  Code
} from 'lucide-react';
import { speechService } from '../services/speechService';

export default function ChatInput({
  onSendMessage,
  isLoading,
  onStopGenerating,
  deepSearchEnabled,
  onToggleDeepSearch,
  onOpenImageModal,
  activePersona
}) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleToggleVoice = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening(
        ({ final, interim }) => {
          if (final) {
            setInput(prev => (prev ? prev + ' ' : '') + final);
          }
        },
        (error) => {
          console.warn('Speech recognition error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className={`relative rounded-2xl bg-obsidian-900/95 border transition-all duration-200 shadow-xl backdrop-blur-xl ${
        deepSearchEnabled 
          ? 'border-amber-500/50 shadow-amber-500/5' 
          : 'border-obsidian-750 focus-within:border-cyan-500/50 focus-within:shadow-cyan-500/5'
      }`}>
        {/* Active DeepSearch Banner if enabled */}
        {deepSearchEnabled && (
          <div className="px-3.5 py-1.5 bg-amber-500/10 border-b border-amber-500/20 rounded-t-2xl flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-semibold">DeepSearch Enabled:</span>
              <span className="text-amber-200/80">Scanning real-time web sources for live context & citations</span>
            </div>
            <button 
              onClick={onToggleDeepSearch}
              className="text-[11px] underline hover:text-amber-100"
            >
              Disable
            </button>
          </div>
        )}

        {/* Text Input Area */}
        <div className="p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              deepSearchEnabled
                ? 'Ask anything for real-time web verification & deep research...'
                : 'Ask Grok anything, roast a concept, or generate code...'
            }
            className="w-full bg-transparent text-slate-100 placeholder-obsidian-400 text-sm focus:outline-none resize-none max-h-44 leading-relaxed font-sans"
          />

          {/* Bottom Toolbar inside the input */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-obsidian-800/80">
            {/* Left Tools */}
            <div className="flex items-center space-x-1.5">
              {/* DeepSearch Toggle */}
              <button
                type="button"
                onClick={onToggleDeepSearch}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  deepSearchEnabled
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800'
                }`}
                title="Toggle DeepSearch (Real-Time Live Web)"
              >
                <Globe className={`w-3.5 h-3.5 ${deepSearchEnabled ? 'text-amber-400' : ''}`} />
                <span className="hidden sm:inline">DeepSearch</span>
              </button>

              {/* Imagine AI Image Studio */}
              <button
                type="button"
                onClick={onOpenImageModal}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800 transition-colors"
                title="Generate AI Images (Imagine Studio)"
              >
                <ImageIcon className="w-3.5 h-3.5 text-grok-cyan" />
                <span className="hidden sm:inline">Imagine</span>
              </button>

              {/* Voice Microphone Input */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice Input (Speak to Grok)'}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Right Action (Send / Stop) */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-obsidian-500 hidden sm:inline font-mono">
                Enter ↵
              </span>

              {isLoading ? (
                <button
                  type="button"
                  onClick={onStopGenerating}
                  className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all shadow-sm"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    input.trim()
                      ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-black shadow-md hover:opacity-90 active:scale-95'
                      : 'bg-obsidian-800 text-obsidian-500 cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
