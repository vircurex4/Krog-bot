import React from 'react';
import { 
  Settings, 
  Search, 
  Cpu, 
  HelpCircle,
  Plus,
  PanelLeft,
  Sparkles
} from 'lucide-react';
import { PROVIDERS } from '../constants/providers';

export default function DesktopTitleBar({
  activePersona,
  activeProvider,
  activeModel,
  onOpenSettings,
  onOpenCommandPalette,
  onOpenShortcuts,
  onToggleSidebar,
  sidebarOpen,
  onNewChat
}) {
  const currentProvider = PROVIDERS.find(p => p.id === activeProvider) || PROVIDERS[0];

  return (
    <header className="h-12 bg-arena-900 border-b border-arena-750 flex items-center justify-between px-3.5 select-none z-30 shrink-0">
      {/* Left: Brand with Pi Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-arena-400 hover:text-white hover:bg-arena-800 transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Pi Logo & Name */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-arena-800 border border-arena-700 flex items-center justify-center shadow-sm">
            <span className="font-serif font-bold text-white text-base leading-none">π</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-semibold tracking-tight text-white font-sans">
              arashmidos
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-arena-800 border border-arena-700 text-arena-400 font-medium">
              arena
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Active Model & Search */}
      <div className="hidden md:flex items-center space-x-2">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-arena-850 hover:bg-arena-800 border border-arena-750 text-xs text-arena-400 hover:text-arena-200 transition-all shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-arena-500 group-hover:text-white transition-colors" />
          <span>Search or Command...</span>
          <kbd className="text-[10px] bg-arena-950 px-1.5 py-0.5 rounded border border-arena-750 text-arena-400 font-mono">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-arena-850 border border-arena-750 text-xs text-arena-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-arena-200">{currentProvider.name.split(' ')[0]}</span>
          <span className="text-arena-600">/</span>
          <span className="font-mono text-arena-400 text-[11px] truncate max-w-[130px]">{activeModel}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={onNewChat}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-arena-100 hover:bg-white text-arena-950 transition-all shadow-sm font-sans"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-arena-400 hover:text-white hover:bg-arena-800 transition-colors"
          title="Settings & API Keys"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
