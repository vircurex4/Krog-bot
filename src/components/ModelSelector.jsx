import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Key } from 'lucide-react';
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
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-arena-850 hover:bg-arena-800 border border-arena-750 text-xs font-medium text-arena-200 transition-all shadow-sm"
      >
        <div className="flex items-center space-x-1.5">
          <span className="font-semibold text-white">{currentProvider.name.split(' ')[0]}</span>
          <span className="text-arena-500">/</span>
          <span className="text-arena-300 font-mono text-[11px]">{currentModel?.name || activeModel}</span>
        </div>
        
        {!hasKey && (
          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/30">
            No Key
          </span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 text-arena-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-arena-900 border border-arena-750 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/50 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2.5 border-b border-arena-800 bg-arena-950/80 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-arena-400">
              Select AI Model
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
              className="text-[11px] text-arena-300 hover:text-white flex items-center space-x-1 hover:underline"
            >
              <Key className="w-3 h-3" />
              <span>API Keys</span>
            </button>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-1.5 space-y-2">
            {PROVIDERS.map((provider) => {
              const isProviderActive = provider.id === activeProvider;
              const providerHasKey = provider.needsKey ? !!settings.apiKeys?.[provider.id] : true;

              return (
                <div key={provider.id} className="rounded-lg bg-arena-850/60 p-2 border border-arena-800">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-xs font-semibold text-white">{provider.name}</span>
                    {!providerHasKey && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                          onOpenSettings();
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Add Key
                      </button>
                    )}
                  </div>

                  <div className="space-y-0.5">
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
                              ? 'bg-arena-750 text-white font-medium'
                              : 'text-arena-400 hover:text-arena-100 hover:bg-arena-800'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-arena-200">{model.name}</span>
                            <span className="text-[10px] text-arena-500 font-mono">{model.id}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-arena-500">{model.speed}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-arena-200 shrink-0" />}
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
