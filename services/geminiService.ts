
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameAdvice = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User asks: ${query}. You are a helpful AI assistant for Law8x1 Gameshop. 
      Answer game-related questions concisely and help them decide which top-up package to buy. 
      Limit response to 2 paragraphs.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my gaming brain right now. Please try again later!";
  }
};
