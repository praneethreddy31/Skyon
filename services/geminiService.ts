import { GoogleGenAI } from "@google/genai";
import { Listing } from '../types';
import { mockListings } from '../data/mockData';

// This file will not be used in the mock setup,
// but it shows how you would structure the real API call.
const getRealCategorySuggestion = async (title: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "General";
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Based on the following item title, suggest a single, appropriate category from this list: Furniture, Books, Appliances, Kids, Clothes, General. Title: "${title}"`,
  });
  return response.text.trim();
};


export const geminiService = {
  suggestCategory: async (title: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // This is a mock implementation.
    // In a real app, you would call getRealCategorySuggestion(title)
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('chair') || lowerTitle.includes('table') || lowerTitle.includes('sofa')) {
      return 'Furniture';
    }
    if (lowerTitle.includes('book') || lowerTitle.includes('novel')) {
      return 'Books';
    }
    if (lowerTitle.includes('oven') || lowerTitle.includes('fridge') || lowerTitle.includes('tv')) {
      return 'Appliances';
    }
    if (lowerTitle.includes('kids') || lowerTitle.includes('toy') || lowerTitle.includes('bicycle')) {
      return 'Kids';
    }
    if (lowerTitle.includes('dress') || lowerTitle.includes('shirt') || lowerTitle.includes('scarf')) {
      return 'Clothes';
    }
    return 'General';
  },

  findSimilarListings: async (currentListing: Listing): Promise<Listing[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock implementation
    return mockListings.filter(
      listing =>
        listing.id !== currentListing.id &&
        listing.category === currentListing.category
    ).slice(0, 2); // Return up to 2 similar listings
  },
};
