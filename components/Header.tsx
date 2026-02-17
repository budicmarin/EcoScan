
import React from 'react';
import { Leaf, History, Info } from 'lucide-react';

interface HeaderProps {
  onViewChange: (view: 'home' | 'history' | 'about') => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, currentView }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onViewChange('home')}
      >
        <div className="bg-emerald-500 p-1.5 rounded-lg">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">EcoScan</h1>
      </div>
      
      <nav className="flex items-center gap-4">
        <button 
          onClick={() => onViewChange('history')}
          className={`p-2 rounded-full transition-colors ${currentView === 'history' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <History className="w-6 h-6" />
        </button>
        <button 
          onClick={() => onViewChange('about')}
          className={`p-2 rounded-full transition-colors ${currentView === 'about' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Info className="w-6 h-6" />
        </button>
      </nav>
    </header>
  );
};
