import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CategorySelectorProps } from '../../types';

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  const selected = categories.find(c => c.id === value);

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
            <span className={`w-3 h-3 rounded-full bg-${selected.color}`} />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span className="text-gray-400">Sin categoria</span>
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
            <span className="w-3 h-3 rounded-full bg-gray-700" />
            <span>Sin categoria</span>
          </button>
          {sortedCategories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onChange(c.id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 ${value === c.id ? 'bg-blue-500/20' : ''}`}
            >
              <span className={`w-3 h-3 rounded-full bg-${c.color}`} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
