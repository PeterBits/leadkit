import React from 'react';
import { Trash2 } from 'lucide-react';
import { SummaryItemCardProps } from '../../../types';
import { CATEGORIES } from '../../../constants';

export const SummaryItemCard: React.FC<SummaryItemCardProps> = ({ item, onDelete }) => {
  const cat = CATEGORIES[item.category];
  const Icon = cat.icon;

  return (
    <div className={`${cat.color} rounded-lg p-3 mb-2`}>
      <div className="flex items-start gap-3">
        <Icon size={18} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{item.title}</h4>
          {item.description && (
            <p className="text-sm opacity-80 mt-1">{item.description}</p>
          )}
        </div>
        <button onClick={() => onDelete(item.id)} className="p-1 hover:bg-white/30 rounded flex-shrink-0">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
