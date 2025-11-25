import React from 'react';
import { PLATFORMS, getIcon } from '../constants';
import { PlatformId } from '../types';

interface PlatformSelectorProps {
  selected: PlatformId[];
  onChange: (selected: PlatformId[]) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  const togglePlatform = (id: PlatformId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {PLATFORMS.map((platform) => {
        const isSelected = selected.includes(platform.id);
        return (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
              ${isSelected 
                ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/20' 
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800'}
            `}
          >
            <div className={`mb-2 ${isSelected ? 'text-indigo-400' : platform.color}`}>
              {getIcon(platform.icon, "w-8 h-8")}
            </div>
            <span className="text-sm font-medium">{platform.name}</span>
            {isSelected && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;
