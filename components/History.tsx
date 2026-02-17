
import React from 'react';
import { TrashAnalysis } from '../types';
import { Calendar, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryProps {
  history: TrashAnalysis[];
  onSelectItem: (item: TrashAnalysis) => void;
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onSelectItem, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700">No history yet</h3>
        <p className="text-slate-500 max-w-xs mt-2">Start scanning waste to see your contribution to the planet here!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Scan History</h2>
        <button 
          onClick={onClearHistory}
          className="text-sm font-semibold text-red-500 hover:text-red-600"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid gap-3">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="flex items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img 
                src={`data:image/jpeg;base64,${item.imageUri}`} 
                className="w-full h-full object-cover" 
                alt={item.name}
              />
            </div>
            <div className="ml-4 flex-grow">
              <h4 className="font-bold text-slate-800 line-clamp-1">{item.name}</h4>
              <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                <Calendar className="w-3 h-3" />
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadgeColor(item.category)}`}>
                {item.category}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case 'Recyclable': return 'bg-blue-100 text-blue-600';
    case 'Organic': return 'bg-green-100 text-green-600';
    case 'Hazardous': return 'bg-red-100 text-red-600';
    case 'General Waste': return 'bg-slate-100 text-slate-600';
    default: return 'bg-emerald-100 text-emerald-600';
  }
};
