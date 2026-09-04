import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Globe, Square } from 'lucide-react';

export default function ChatInput({
  onSendMessage,
  isLoading,
  onStopGenerating,
  deepSearchEnabled,
  onToggleDeepSearch
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div className="relative rounded-2xl bg-arena-900 border border-arena-750 focus-within:border-arena-600 transition-colors shadow-lg p-3">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message to Arashmidos..."
          className="w-full bg-transparent text-white placeholder-arena-500 text-sm focus:outline-none resize-none max-h-44 leading-relaxed font-sans"
        />

        {/* Action Row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-arena-800">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onToggleDeepSearch}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                deepSearchEnabled
                  ? 'bg-arena-750 text-white border border-arena-600'
                  : 'text-arena-400 hover:text-white hover:bg-arena-850'
              }`}
              title="Search the Web"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Search</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGenerating}
                className="p-1.5 rounded-lg bg-arena-800 hover:bg-arena-750 text-red-400 transition-colors"
                title="Stop"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-1.5 rounded-xl transition-all ${
                  input.trim()
                    ? 'bg-white text-arena-950 hover:bg-arena-200 active:scale-95'
                    : 'bg-arena-800 text-arena-500 cursor-not-allowed'
                }`}
                title="Send"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
