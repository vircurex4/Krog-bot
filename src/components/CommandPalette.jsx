import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Settings, 
  Globe, 
  Image as ImageIcon, 
  Sparkles, 
  Flame, 
  BrainCircuit, 
  Zap, 
  Skull, 
  Terminal,
  MessageSquare,
  X
} from 'lucide-react';
import { GROK_PERSONAS } from '../constants/personas';

export default function CommandPalette({
  isOpen,
  onClose,
  onNewChat,
  onSelectPersona,
  onToggleDeepSearch,
  onOpenImageModal,
  onOpenSettings,
  chats,
  onSelectChat
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'new_chat',
      title: 'Start New Conversation',
      shortcut: '⌘N',
      icon: Plus,
      color: 'text-cyan-400',
      run: () => { onNewChat(); onClose(); }
    },
    {
      id: 'toggle_deepsearch',
      title: 'Toggle DeepSearch (Real-Time Web)',
      shortcut: '⌘D',
      icon: Globe,
      color: 'text-amber-400',
      run: () => { onToggleDeepSearch(); onClose(); }
    },
    {
      id: 'open_imagine',
      title: 'Imagine AI Image Generator',
      shortcut: '⌘I',
      icon: ImageIcon,
      color: 'text-purple-400',
      run: () => { onOpenImageModal(); onClose(); }
    },
    {
      id: 'open_settings',
      title: 'Open Settings & API Keys',
      shortcut: '⌘,',
      icon: Settings,
      color: 'text-grok-blue',
      run: () => { onOpenSettings(); onClose(); }
    },
    ...GROK_PERSONAS.map(p => ({
      id: `persona_${p.id}`,
      title: `Switch Mode: ${p.name} (${p.tagline})`,
      shortcut: `Mode`,
      icon: p.id === 'fun' ? Flame : p.id === 'think' ? BrainCircuit : p.id === 'unhinged' ? Skull : p.id === 'dev' ? Terminal : Zap,
      color: 'text-slate-200',
      run: () => { onSelectPersona(p.id); onClose(); }
    }))
  ];

  const filteredActions = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const matchingChats = chats.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-obsidian-900 border border-obsidian-750 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Search Input */}
        <div className="p-3 border-b border-obsidian-800 flex items-center space-x-3 bg-obsidian-950/70">
          <Search className="w-4 h-4 text-obsidian-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search chats..."
            className="w-full bg-transparent text-slate-100 text-xs focus:outline-none placeholder-obsidian-500 font-medium"
          />
          <kbd className="text-[10px] bg-obsidian-850 px-1.5 py-0.5 rounded border border-obsidian-750 text-obsidian-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-obsidian-400 uppercase tracking-wider">
                Quick Actions
              </div>
              <div className="space-y-0.5">
                {filteredActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.run}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-obsidian-800 transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-3.5 h-3.5 ${action.color}`} />
                        <span className="group-hover:text-white">{action.title}</span>
                      </div>
                      <span className="text-[10px] text-obsidian-400 font-mono bg-obsidian-850 px-1.5 py-0.5 rounded border border-obsidian-750">
                        {action.shortcut}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Chats */}
          {matchingChats.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-obsidian-400 uppercase tracking-wider">
                Conversations
              </div>
              <div className="space-y-0.5">
                {matchingChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <span className="text-[10px] text-obsidian-500 font-mono shrink-0">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
