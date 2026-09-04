import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Pin, 
  Trash2, 
  Edit2, 
  Settings, 
  Check, 
  X,
  PanelLeftClose
} from 'lucide-react';

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onTogglePin,
  onOpenSettings,
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

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-arena-900 border-r border-arena-750 flex flex-col h-full z-20 shrink-0 select-none">
      {/* Top Header */}
      <div className="p-3 border-b border-arena-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-arena-800 border border-arena-700 flex items-center justify-center text-white">
            <span className="font-serif font-bold text-sm">π</span>
          </div>
          <span className="text-xs font-semibold text-white tracking-tight">arashmidos</span>
        </div>

        <button
          onClick={onToggleOpen}
          className="p-1 rounded-md text-arena-400 hover:text-white hover:bg-arena-800 transition-colors"
          title="Close Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-2.5">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-arena-800 hover:bg-arena-750 border border-arena-700 text-white text-xs font-medium transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-arena-300" />
            <span>New Chat</span>
          </div>
          <kbd className="text-[10px] bg-arena-900 px-1.5 py-0.5 rounded border border-arena-700 text-arena-400 font-mono">
            ⌘N
          </kbd>
        </button>
      </div>

      {/* Search chats */}
      <div className="px-2.5 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-arena-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-arena-950 text-arena-200 placeholder-arena-500 text-xs rounded-lg pl-8 pr-2.5 py-1.5 border border-arena-800 focus:outline-none focus:border-arena-600"
          />
        </div>
      </div>

      {/* Chat Lists */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {pinnedChats.length > 0 && (
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold text-arena-500 uppercase tracking-wider flex items-center space-x-1">
              <Pin className="w-2.5 h-2.5" />
              <span>Pinned</span>
            </div>
            <div className="space-y-0.5">
              {pinnedChats.map((chat) => renderChatItem(chat))}
            </div>
          </div>
        )}

        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-arena-500 uppercase tracking-wider flex items-center justify-between">
            <span>Recent Chats</span>
            <span className="text-[10px] text-arena-600">{unpinnedChats.length}</span>
          </div>
          
          {unpinnedChats.length === 0 && pinnedChats.length === 0 ? (
            <div className="p-4 text-center text-xs text-arena-500">
              No conversations yet.
            </div>
          ) : (
            <div className="space-y-0.5">
              {unpinnedChats.map((chat) => renderChatItem(chat))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="p-2 border-t border-arena-800 bg-arena-950/40">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-arena-300 hover:text-white hover:bg-arena-800 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-3.5 h-3.5 text-arena-400" />
            <span>Settings & API Keys</span>
          </div>
          <kbd className="text-[10px] bg-arena-900 px-1 py-0.5 rounded border border-arena-750 text-arena-400 font-mono">
            ⌘,
          </kbd>
        </button>
      </div>
    </aside>
  );

  function renderChatItem(chat) {
    const isActive = chat.id === activeChatId;
    const isEditing = editingId === chat.id;

    return (
      <div
        key={chat.id}
        onClick={() => onSelectChat(chat.id)}
        className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
          isActive
            ? 'bg-arena-800 text-white font-medium'
            : 'text-arena-400 hover:bg-arena-850 hover:text-arena-200'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1 pr-1">
          <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />

          {isEditing ? (
            <div className="flex items-center space-x-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="w-full bg-arena-950 text-white text-xs px-1.5 py-0.5 rounded border border-arena-600 focus:outline-none"
              />
              <button onClick={(e) => handleSaveRename(chat.id, e)} className="p-0.5 text-emerald-400">
                <Check className="w-3 h-3" />
              </button>
              <button onClick={handleCancelRename} className="p-0.5 text-arena-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="truncate">{chat.title}</span>
          )}
        </div>

        {!isEditing && (
          <div className="hidden group-hover:flex items-center space-x-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(chat.id);
              }}
              className={`p-1 rounded hover:bg-arena-750 ${
                chat.isPinned ? 'text-amber-400' : 'text-arena-500 hover:text-white'
              }`}
              title="Pin"
            >
              <Pin className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => handleStartRename(chat, e)}
              className="p-1 rounded text-arena-500 hover:text-white hover:bg-arena-750"
              title="Rename"
            >
              <Edit2 className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="p-1 rounded text-arena-500 hover:text-red-400 hover:bg-arena-750"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }
}
