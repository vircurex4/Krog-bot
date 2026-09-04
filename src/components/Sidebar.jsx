import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Pin, 
  Trash2, 
  Edit2, 
  Settings, 
  Download, 
  Upload, 
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  BrainCircuit,
  Zap,
  Skull,
  Terminal
} from 'lucide-react';
import { GROK_PERSONAS } from '../constants/personas';

const PERSONA_ICONS = {
  Flame: Flame,
  BrainCircuit: BrainCircuit,
  Zap: Zap,
  Skull: Skull,
  Terminal: Terminal
};

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onTogglePin,
  onOpenSettings,
  onOpenImageModal,
  onOpenExportModal,
  activePersona,
  onSelectPersona,
  isOpen,
  onToggleOpen
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(c => c.isPinned);
  const unpinnedChats = filteredChats.filter(c => !c.isPinned);

  const handleStartRename = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (chatId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  if (!isOpen) {
    return (
      <div className="w-14 bg-obsidian-900 border-r border-obsidian-800 flex flex-col items-center py-3 justify-between z-30 shrink-0">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={onToggleOpen}
            className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-300 hover:text-white transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onNewChat}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-black flex items-center justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all"
            title="New Chat (Ctrl+N)"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={onOpenImageModal}
            className="p-2.5 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-750 text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Imagine Studio"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-obsidian-900 border-r border-obsidian-800 flex flex-col h-full z-30 shrink-0 transition-all duration-200">
      {/* Top Header */}
      <div className="p-3 border-b border-obsidian-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-display font-black text-black text-sm shadow-md">
            G
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider font-display">GROKPULSE</h2>
            <p className="text-[10px] text-obsidian-400 font-mono">v1.0.0 Workstation</p>
          </div>
        </div>

        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800 transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/40 hover:border-cyan-400/80 text-cyan-300 hover:text-white transition-all group shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-xs font-semibold">New Conversation</span>
          </div>
          <kbd className="text-[10px] bg-obsidian-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-300 font-mono">
            ⌘N
          </kbd>
        </button>
      </div>

      {/* Search chats */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-obsidian-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-obsidian-950/70 text-slate-200 placeholder-obsidian-400 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-obsidian-800 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Chat Lists (Pinned & Recent) */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {/* Pinned Chats */}
        {pinnedChats.length > 0 && (
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-obsidian-400 uppercase tracking-wider flex items-center space-x-1">
              <Pin className="w-2.5 h-2.5 text-amber-400" />
              <span>Pinned</span>
            </div>
            <div className="space-y-0.5">
              {pinnedChats.map((chat) => renderChatItem(chat))}
            </div>
          </div>
        )}

        {/* Unpinned / Recent Chats */}
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-obsidian-400 uppercase tracking-wider flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-[10px] text-obsidian-500">{unpinnedChats.length}</span>
          </div>
          
          {unpinnedChats.length === 0 && pinnedChats.length === 0 ? (
            <div className="p-4 text-center text-xs text-obsidian-400">
              No conversations yet. Start a new chat!
            </div>
          ) : (
            <div className="space-y-0.5">
              {unpinnedChats.map((chat) => renderChatItem(chat))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-2 border-t border-obsidian-800 bg-obsidian-950/40 space-y-1">
        {/* Imagine AI Button */}
        <button
          onClick={onOpenImageModal}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-cyan-300 hover:text-white hover:bg-obsidian-800 transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium">Imagine Studio</span>
        </button>

        {/* Export / Backup */}
        <button
          onClick={onOpenExportModal}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-obsidian-400" />
          <span>Export / Backup Data</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <Settings className="w-3.5 h-3.5 text-grok-blue" />
            <span className="font-medium">Settings & API Keys</span>
          </div>
          <kbd className="text-[10px] bg-obsidian-900 px-1 py-0.5 rounded border border-obsidian-750 text-obsidian-400 font-mono">
            ⌘,
          </kbd>
        </button>
      </div>
    </aside>
  );

  function renderChatItem(chat) {
    const isActive = chat.id === activeChatId;
    const isEditing = editingId === chat.id;
    const persona = GROK_PERSONAS.find(p => p.id === chat.personaId) || GROK_PERSONAS[0];
    const IconComponent = PERSONA_ICONS[persona.iconName] || MessageSquare;

    return (
      <div
        key={chat.id}
        onClick={() => onSelectChat(chat.id)}
        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
          isActive
            ? 'bg-obsidian-800 text-white font-medium border border-obsidian-700 shadow-sm'
            : 'text-obsidian-300 hover:bg-obsidian-850 hover:text-slate-100'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1 pr-2">
          <IconComponent
            className="w-3.5 h-3.5 shrink-0 opacity-70"
            style={{ color: persona.accentColor }}
          />

          {isEditing ? (
            <div className="flex items-center space-x-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="w-full bg-obsidian-950 text-white text-xs px-1.5 py-0.5 rounded border border-cyan-500/60 focus:outline-none"
              />
              <button
                onClick={(e) => handleSaveRename(chat.id, e)}
                className="p-1 text-emerald-400 hover:text-emerald-300"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancelRename}
                className="p-1 text-obsidian-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="truncate">{chat.title}</span>
          )}
        </div>

        {/* Hover / Active Action Icons */}
        {!isEditing && (
          <div className="hidden group-hover:flex items-center space-x-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(chat.id);
              }}
              className={`p-1 rounded hover:bg-obsidian-750 ${
                chat.isPinned ? 'text-amber-400' : 'text-obsidian-400 hover:text-slate-200'
              }`}
              title={chat.isPinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => handleStartRename(chat, e)}
              className="p-1 rounded text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-750"
              title="Rename"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="p-1 rounded text-obsidian-400 hover:text-red-400 hover:bg-obsidian-750"
              title="Delete conversation"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }
}
