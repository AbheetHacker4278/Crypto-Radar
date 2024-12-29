import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

// Initialize the API with the key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getAssetInsights = async (
  assetName: string,
  priceHistory: { date: string; priceUsd: string }[],
  currentPrice: Number
) => {
  console.log('Generating insights for:', assetName);
  console.log('Using API key:', GEMINI_API_KEY ? 'Key is present' : 'Key is missing');

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const formattedPriceHistory = priceHistory
      .slice(-7)
      .map(h => `${new Date(h.date).toLocaleDateString()}: $${parseFloat(h.priceUsd).toFixed(2)}`)
      .join('\n');

    const prompt = `
      As a crypto market analyst, analyze this data for ${assetName}:
      
      Current price: $${parseFloat(String(currentPrice)).toFixed(2)}
      
      Last 7 days of price data:
      ${formattedPriceHistory}
      
      Based on this data, please provide:
      1. A brief market sentiment analysis
      2. Potential support and resistance levels
      3. Best time to consider buying (short term)
      4. Key factors affecting price movement
      
      Format the response in JSON with these keys:
      {
        "sentiment": "string",
        "supportLevel": "number",
        "resistanceLevel": "number",
        "buyingAdvice": "string",
        "keyFactors": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);

    const rawResponse = result?.response?.text();

    console.log('Raw Gemini response:', rawResponse);

    // Remove markdown code block markers (e.g., ```json)
    const cleanedResponse = rawResponse?.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleanedResponse || '{}');
    } catch (jsonError) {
      console.error('Error parsing Gemini response:', jsonError);
      return {
        sentiment: "Unable to analyze at this time",
        supportLevel: parseFloat(String(currentPrice)) * 0.9, // Fallback support level
        resistanceLevel: parseFloat(String(currentPrice)) * 1.1, // Fallback resistance level
        buyingAdvice: "Please try again later",
        keyFactors: ["Data unavailable"]
      };
    }
  } catch (error) {
    console.error('Error getting insights:', error);
    return {
      sentiment: "Service temporarily unavailable",
      supportLevel: parseFloat(String(currentPrice)) * 0.9, // Fallback support level
      resistanceLevel: parseFloat(String(currentPrice)) * 1.1, // Fallback resistance level
      buyingAdvice: "Unable to provide advice at this time",
      keyFactors: ["Service error"]
    };
  }
};
