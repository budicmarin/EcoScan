
import React from 'react';
import { TrashAnalysis, TrashCategory } from '../types';
import { Recycle, Trash2, Biohazard, Apple, Lightbulb, FileText, Package, CheckCircle2, X, Info } from 'lucide-react';

interface TrashResultProps {
  result: TrashAnalysis;
  onClose: () => void;
}

const getCategoryStyles = (category: TrashCategory) => {
  switch (category) {
    case 'Recyclable': return { icon: <Recycle />, color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' };
    case 'Organic': return { icon: <Apple />, color: 'bg-green-100 text-green-700', border: 'border-green-200' };
    case 'Hazardous': return { icon: <Biohazard />, color: 'bg-red-100 text-red-700', border: 'border-red-200' };
    case 'Electronic': return { icon: <Lightbulb />, color: 'bg-purple-100 text-purple-700', border: 'border-purple-200' };
    case 'Paper': return { icon: <FileText />, color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' };
    case 'Plastic': return { icon: <Package />, color: 'bg-cyan-100 text-cyan-700', border: 'border-cyan-200' };
    default: return { icon: <Trash2 />, color: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };
  }
};

const BinIcon = ({ color }: { color: string }) => {
  // Map color strings to tailwind classes
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500 fill-blue-500',
    green: 'text-green-500 fill-green-500',
    yellow: 'text-yellow-400 fill-yellow-400',
    red: 'text-red-500 fill-red-500',
    black: 'text-slate-900 fill-slate-900',
    grey: 'text-slate-400 fill-slate-400',
    gray: 'text-slate-400 fill-slate-400',
    brown: 'text-amber-800 fill-amber-800',
  };

  const colorClass = colorMap[color.toLowerCase()] || 'text-slate-300 fill-slate-300';

  return (
    <svg 
      viewBox="0 0 24 24" 
      width="48" 
      height="48" 
      className={colorClass}
    >
      <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm4.5 2v8h1v-8h-1zm4 0v8h1v-8h-1zM9 4h6V2H9v2z" fill="currentColor" stroke="none"/>
      <path d="M3 6l1.5 16h15L21 6H3zm16 14H5l-1.2-13h16.4L19 20z" fill="rgba(0,0,0,0.1)"/>
    </svg>
  );
};

export const TrashResult: React.FC<TrashResultProps> = ({ result, onClose }) => {
  const styles = getCategoryStyles(result.category);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-500">
        <div className="relative h-48 w-full bg-slate-100">
          <img 
            src={`data:image/jpeg;base64,${result.imageUri}`} 
            className="w-full h-full object-cover" 
            alt="Scanned item"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 text-white p-1.5 rounded-full backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg ${styles.color} ${styles.border} border`}>
                {React.cloneElement(styles.icon as React.ReactElement, { size: 14 })}
                {result.category}
             </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 leading-tight">{result.name}</h2>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-1">
                <CheckCircle2 size={14} />
                {Math.round(result.confidence * 100)}% Match
              </div>
            </div>
            
            {/* Bin Color Indicator */}
            <div className="flex flex-col items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <BinIcon color={result.binColor} />
              <span className="text-[10px] font-black uppercase text-slate-500 mt-1">{result.binColor} Bin</span>
            </div>
          </div>

          <div className="space-y-5">
            <section className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Info size={16} className="text-slate-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Disposal Info</h3>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {result.disposalInstructions}
              </p>
            </section>

            <section className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-500 p-1.5 rounded-lg text-white mt-0.5 shadow-sm shadow-emerald-200">
                  <LeafIcon size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-800 mb-1">Eco Tip</h3>
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    {result.ecoTip}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-100"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

const LeafIcon = ({ size = 16, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C10.32 14.36 12 12 12 12s2.68 2.36 4.92 3c3.23.64 5.08 3 5.08 6"/><path d="M12 12v8"/>
  </svg>
);
