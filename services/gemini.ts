
import { GoogleGenAI, Type } from "@google/genai";
import { TrashAnalysis, TrashCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTrashImage = async (base64Image: string): Promise<Partial<TrashAnalysis>> => {
  const model = 'gemini-3-flash-preview';

  const prompt = `Identify the object in this image and determine how it should be disposed of. 
  Focus on common waste management categories. 
  Crucially, identify the standard COLOR of the waste bin this item usually goes into (e.g., Blue for paper/recycling, Green for organic, Yellow for plastic/packaging, Red for hazardous/glass, Grey/Black for general waste).`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Common name of the item identified.",
          },
          category: {
            type: Type.STRING,
            description: "The waste category.",
          },
          binColor: {
            type: Type.STRING,
            description: "The primary color of the bin this item belongs in (e.g. Blue, Green, Yellow, Red, Black, Grey).",
          },
          disposalInstructions: {
            type: Type.STRING,
            description: "Clear, concise instructions on where and how to throw this item away.",
          },
          ecoTip: {
            type: Type.STRING,
            description: "A short interesting tip or fact about recycling this waste.",
          },
          confidence: {
            type: Type.NUMBER,
            description: "A value between 0 and 1 representing confidence.",
          },
        },
        required: ["name", "category", "binColor", "disposalInstructions", "ecoTip", "confidence"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text);
    return {
      name: result.name,
      category: result.category as TrashCategory,
      binColor: result.binColor,
      disposalInstructions: result.disposalInstructions,
      ecoTip: result.ecoTip,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not understand the analysis result.");
  }
};
