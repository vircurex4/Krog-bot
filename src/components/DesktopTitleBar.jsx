import React from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Sparkles, 
  Settings, 
  Search, 
  Command, 
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';
import { GROK_PERSONAS } from '../constants/personas';
import { PROVIDERS } from '../constants/providers';

export default function DesktopTitleBar({
  activePersona,
  activeProvider,
  activeModel,
  onOpenSettings,
  onOpenCommandPalette,
  onOpenShortcuts,
  onToggleSidebar,
  sidebarOpen
}) {
  const currentPersona = GROK_PERSONAS.find(p => p.id === activePersona) || GROK_PERSONAS[0];
  const currentProvider = PROVIDERS.find(p => p.id === activeProvider) || PROVIDERS[0];

  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  };

  return (
    <header className="h-10 bg-obsidian-900/90 border-b border-obsidian-750 flex items-center justify-between px-3 select-none z-40 relative backdrop-blur-md">
      {/* Left: Window Controls / App Brand */}
      <div className="flex items-center space-x-3">
        {/* macOS Style Window Dots (decorative in browser, active in electron) */}
        <div className="flex items-center space-x-2 mr-2">
          <button 
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group"
            title="Close"
          >
            <X className="w-2 h-2 text-red-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors flex items-center justify-center group"
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button 
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors flex items-center justify-center group"
            title="Maximize"
          >
            <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Brand & App Name */}
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-black text-black font-display">G</span>
            </div>
            <div className="absolute -inset-0.5 bg-cyan-400 rounded-md blur opacity-30 animate-pulse"></div>
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-200 font-display">
            GROK<span className="text-grok-blue">PULSE</span> <span className="text-[10px] text-obsidian-400 font-normal">DESKTOP</span>
          </span>
        </div>
      </div>

      {/* Middle: Active Status & Search Trigger */}
      <div className="hidden md:flex items-center space-x-2">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2 px-3 py-1 rounded-md bg-obsidian-800/80 hover:bg-obsidian-750 border border-obsidian-700/60 text-xs text-obsidian-300 hover:text-slate-100 transition-all shadow-inner group"
        >
          <Search className="w-3.5 h-3.5 text-obsidian-400 group-hover:text-grok-blue transition-colors" />
          <span>Quick Search or Command...</span>
          <kbd className="text-[10px] bg-obsidian-900 px-1.5 py-0.5 rounded border border-obsidian-700 text-obsidian-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Current Active Engine Pill */}
        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-obsidian-800/70 border border-obsidian-700/50 text-[11px] text-obsidian-300">
          <Cpu className="w-3 h-3 text-grok-blue" />
          <span className="text-slate-300 font-medium">{currentProvider.name.split(' ')[0]}</span>
          <span className="text-obsidian-500">•</span>
          <span className="text-xs font-mono text-obsidian-300 truncate max-w-[120px]">{activeModel}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-md text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800 transition-colors"
          title="Keyboard Shortcuts (Ctrl+/)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-obsidian-800/90 hover:bg-obsidian-750 text-slate-300 hover:text-white border border-obsidian-700/70 hover:border-obsidian-600 transition-all"
          title="Settings & API Keys (Ctrl+,)"
        >
          <Settings className="w-3.5 h-3.5 text-grok-blue" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
}
