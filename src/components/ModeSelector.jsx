import React from 'react';
import { 
  Flame, 
  BrainCircuit, 
  Zap, 
  Skull, 
  Terminal,
  Sparkles
} from 'lucide-react';
import { GROK_PERSONAS } from '../constants/personas';

const ICON_MAP = {
  Flame: Flame,
  BrainCircuit: BrainCircuit,
  Zap: Zap,
  Skull: Skull,
  Terminal: Terminal
};

export default function ModeSelector({ activePersona, onSelectPersona }) {
  return (
    <div className="flex items-center space-x-1.5 p-1 bg-obsidian-900/90 rounded-xl border border-obsidian-800 backdrop-blur-md overflow-x-auto shadow-sm">
      {GROK_PERSONAS.map((persona) => {
        const IconComponent = ICON_MAP[persona.iconName] || Sparkles;
        const isActive = activePersona === persona.id;

        return (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona.id)}
            title={persona.tagline}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative group shrink-0 ${
              isActive
                ? 'bg-obsidian-800 text-white shadow-md border border-obsidian-700'
                : 'text-obsidian-300 hover:text-slate-100 hover:bg-obsidian-850/80'
            }`}
          >
            {/* Active Indicator Glow */}
            {isActive && (
              <span 
                className="absolute inset-0 rounded-lg opacity-20 blur-sm pointer-events-none"
                style={{ backgroundColor: persona.accentColor }}
              />
            )}

            <IconComponent 
              className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'scale-105' : 'opacity-70'
              }`}
              style={{ color: isActive ? persona.accentColor : undefined }}
            />
            
            <span className={isActive ? 'font-semibold tracking-wide' : 'font-normal'}>
              {persona.shortName}
            </span>

            {/* Sub-badge for active */}
            {isActive && (
              <span 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: persona.accentColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
