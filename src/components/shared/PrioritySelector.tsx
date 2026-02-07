import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PrioritySelectorProps } from '../../types';

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priorities,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sortedPriorities = [...priorities].sort((a, b) => a.level - b.level);
  const selected = priorities.find(p => p.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-700 rounded-lg px-3 py-2.5 text-base text-left flex items-center justify-between bg-gray-800"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full bg-${selected.color} flex items-center justify-center`}
            >
              <span className="text-[10px] font-bold text-white">{selected.level}</span>
            </span>
            <span>Nivel {selected.level}</span>
          </span>
        ) : (
          <span className="text-gray-400">Sin prioridad</span>
        )}
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-black/50 max-h-60 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 ${!value ? 'bg-blue-500/20' : ''}`}
          >
            <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-[10px] text-gray-500">-</span>
            </span>
            <span>Sin prioridad</span>
          </button>
          {sortedPriorities.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChange(p.id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 ${value === p.id ? 'bg-blue-500/20' : ''}`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-${p.color} flex items-center justify-center`}
              >
                <span className="text-[10px] font-bold text-white">{p.level}</span>
              </span>
              <span>Nivel {p.level}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
