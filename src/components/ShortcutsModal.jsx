import React from 'react';
import { X, Command, HelpCircle } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '../constants/defaultSettings';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-obsidian-900 border border-obsidian-750 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-obsidian-800 flex items-center justify-between bg-obsidian-950/60">
          <div className="flex items-center space-x-2">
            <Command className="w-4 h-4 text-grok-blue" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          {KEYBOARD_SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-obsidian-850/60 text-xs transition-colors"
            >
              <span className="text-obsidian-300">{item.description}</span>
              <kbd className="bg-obsidian-950 px-2 py-0.5 rounded border border-obsidian-750 text-grok-blue font-mono font-medium text-[11px]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
