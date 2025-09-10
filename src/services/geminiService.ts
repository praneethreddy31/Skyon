// src/services/geminiService.ts

import { Listing } from '../types';
import { getCollection } from './databaseService';

export const geminiService = {
  /**
   * Simulates an AI suggesting a category based on the item's title.
   */
  suggestCategory: async (title: string): Promise<string> => {
    // Simulate API call delay for a better user experience
    await new Promise(resolve => setTimeout(resolve, 500));

    // A simple logic-based suggestion
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

  /**
   * Finds similar listings by fetching from the live database.
   */
  findSimilarListings: async (currentListing: Listing): Promise<Listing[]> => {
    try {
      const allListings = await getCollection<Listing>('listings');
      
      const similar = allListings.filter(
        listing =>
          listing.id !== currentListing.id &&
          listing.category === currentListing.category
      );
      
      return similar.slice(0, 2); // Return up to 2 similar listings
    } catch (error) {
      console.error("Error finding similar listings:", error);
      return [];
    }
  }
};