import React from 'react';
import { GROK_PERSONAS } from '../constants/personas';

export default function ModeSelector({ activePersona, onSelectPersona }) {
  return (
    <div className="flex items-center space-x-1 p-0.5 bg-arena-850 rounded-lg border border-arena-750">
      {GROK_PERSONAS.map((persona) => {
        const isActive = activePersona === persona.id;

        return (
          <button
            key={persona.id}
            onClick={() => onSelectPersona(persona.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              isActive
                ? 'bg-arena-750 text-white shadow-sm'
                : 'text-arena-400 hover:text-arena-200'
            }`}
          >
            {persona.shortName}
          </button>
        );
      })}
    </div>
  );
}
