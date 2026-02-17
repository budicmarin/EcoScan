
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CameraScanner } from './components/CameraScanner';
import { TrashResult } from './components/TrashResult';
import { History } from './components/History';
import { TrashAnalysis, AppState } from './types';
import { analyzeTrashImage } from './services/gemini';
import { AlertCircle, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    history: [],
    currentResult: null,
    error: null
  });
  const [view, setView] = useState<'home' | 'history' | 'about'>('home');

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ecoscan_history');
    if (saved) {
      try {
        setState(prev => ({ ...prev, history: JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleCapture = async (base64Image: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      const analysisResult = await analyzeTrashImage(base64Image);
      
      const newEntry: TrashAnalysis = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageUri: base64Image,
        name: analysisResult.name || 'Unknown Item',
        category: analysisResult.category || 'General Waste',
        binColor: analysisResult.binColor || 'Grey',
        disposalInstructions: analysisResult.disposalInstructions || 'Dispose of responsibly.',
        ecoTip: analysisResult.ecoTip || 'Reduce, reuse, recycle.',
        confidence: analysisResult.confidence || 0
      };

      const updatedHistory = [newEntry, ...state.history].slice(0, 50); // Keep last 50
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        currentResult: newEntry,
        history: updatedHistory
      }));

      localStorage.setItem('ecoscan_history', JSON.stringify(updatedHistory));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: err.message || "Something went wrong while scanning."
      }));
    }
  };

  const clearHistory = () => {
    if (window.confirm("Clear all your scan history?")) {
      setState(prev => ({ ...prev, history: [] }));
      localStorage.removeItem('ecoscan_history');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 max-w-md mx-auto shadow-2xl overflow-x-hidden border-x border-slate-100">
      <Header onViewChange={setView} currentView={view} />

      <main className="flex-grow">
        {state.error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800">Oops! Analysis failed</p>
              <p className="text-xs text-red-600 mt-0.5">{state.error}</p>
            </div>
          </div>
        )}

        {view === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CameraScanner 
              onCapture={handleCapture} 
              isAnalyzing={state.isAnalyzing} 
            />
            
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Tips</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Leaf size={18} />
                  </div>
                  <p className="text-xs text-slate-600">Wash containers before recycling to avoid contamination.</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                  <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                    <Leaf size={18} />
                  </div>
                  <p className="text-xs text-slate-600">Remove plastic film from cardboard boxes.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="animate-in slide-in-from-right-10 duration-300">
            <History 
              history={state.history} 
              onSelectItem={(item) => setState(prev => ({ ...prev, currentResult: item }))}
              onClearHistory={clearHistory}
            />