
export type TrashCategory = 
  | 'Recyclable' 
  | 'Organic' 
  | 'Hazardous' 
  | 'Electronic' 
  | 'General Waste' 
  | 'Glass' 
  | 'Paper' 
  | 'Plastic';

export interface TrashAnalysis {
  id: string;
  timestamp: number;
  imageUri: string;
  name: string;
  category: TrashCategory;
  binColor: string;
  disposalInstructions: string;
  ecoTip: string;
  confidence: number;
}

export interface AppState {
  isAnalyzing: boolean;
  history: TrashAnalysis[];
  currentResult: TrashAnalysis | null;
  error: string | null;
}
