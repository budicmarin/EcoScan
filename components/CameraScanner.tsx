
import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
  isAnalyzing: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      onCapture(base64String);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6">
      <div className="w-full max-w-sm aspect-square relative rounded-3xl overflow-hidden bg-slate-200 border-4 border-white shadow-xl flex items-center justify-center group transition-all">
        {isAnalyzing ? (
          <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center animate-pulse">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-700 font-semibold text-lg">Analyzing trash...</p>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
              <Camera className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="text-slate-600 font-medium">Take a photo of your waste to see where it belongs</p>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="flex flex-col w-full max-w-sm gap-3">
        <button
          onClick={triggerCamera}
          disabled={isAnalyzing}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-slate-300 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
        >
          <Camera className="w-6 h-6" />
          {isAnalyzing ? 'Processing...' : 'Take Photo'}
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="w-full py-3 bg-white hover:bg-slate-50 active:scale-95 text-slate-600 rounded-2xl font-semibold border border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload from Gallery
        </button>
      </div>
    </div>
  );
};
