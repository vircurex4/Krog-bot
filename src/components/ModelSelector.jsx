import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Key, ExternalLink, Cpu, Sparkles } from 'lucide-react';
import { PROVIDERS } from '../constants/providers';

export default function ModelSelector({
  activeProvider,
  activeModel,
  settings,
  onSelectProvider,
  onSelectModel,
  onOpenSettings
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentProvider = PROVIDERS.find(p => p.id === activeProvider) || PROVIDERS[0];
  const currentModel = currentProvider.models.find(m => m.id === activeModel) || currentProvider.models[0];
  const hasKey = currentProvider.needsKey ? !!settings.apiKeys?.[activeProvider] : true;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-800 hover:border-obsidian-700 text-xs font-medium text-slate-200 transition-all shadow-sm"
      >
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-grok-blue animate-pulse"></span>
          <span className="font-semibold text-white">{currentProvider.name.split(' ')[0]}</span>
          <span className="text-obsidian-500">/</span>
          <span className="text-obsidian-300 font-mono">{currentModel?.name || activeModel}</span>
        </div>
        
        {!hasKey && (
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] border border-amber-500/30 font-medium">
            No Key
          </span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 text-obsidian-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-obsidian-900 border border-obsidian-750 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl ring-1 ring-black/50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-obsidian-800 bg-obsidian-950/60 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-obsidian-400">
              Select AI Engine & Model
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              className="text-[11px] text-grok-blue hover:underline flex items-center space-x-1"
            >
              <Key className="w-3 h-3" />
              <span>Manage Keys</span>
            </button>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-1.5 space-y-3">
            {PROVIDERS.map((provider) => {
              const isProviderActive = provider.id === activeProvider;
              const providerHasKey = provider.needsKey ? !!settings.apiKeys?.[provider.id] : true;

              return (
                <div key={provider.id} className="rounded-lg bg-obsidian-850/50 p-2 border border-obsidian-800/80">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-slate-200">{provider.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-obsidian-800 text-obsidian-300 border border-obsidian-700">
                        {provider.badge}
                      </span>
                    </div>

                    {!providerHasKey && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                          onOpenSettings();
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-0.5"
                      >
                        <span>Add Key</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {provider.models.map((model) => {
                      const isSelected = isProviderActive && activeModel === model.id;

                      return (
                        <button
                          key={model.id}
                          onClick={() => {
                            onSelectProvider(provider.id);
                            onSelectModel(model.id);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-grok-blue/15 text-grok-blue border border-grok-blue/30 font-medium'
                              : 'text-obsidian-300 hover:text-slate-100 hover:bg-obsidian-800'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-200">{model.name}</span>
                            <span className="text-[10px] text-obsidian-400 font-mono">{model.id}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-obsidian-400">{model.speed}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-grok-blue shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
