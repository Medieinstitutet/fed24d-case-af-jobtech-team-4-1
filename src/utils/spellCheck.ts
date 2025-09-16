/**
 * Spell checking utilities for search queries
 * Handles typo detection and correction for better search results
 */

/**
 * Calculates Levenshtein distance between two strings
 * Returns the minimum number of single-character edits required to change one string into another
 */
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[b.length][a.length];
};

/**
 * Finds similar keywords based on Levenshtein distance
 * Returns keywords that are within the maximum distance threshold
 */
export const findSimilarKeywords = (word: string, keywords: string[], maxDistance: number = 2): string[] => {
  return keywords.filter(keyword => 
    levenshteinDistance(word.toLowerCase(), keyword.toLowerCase()) <= maxDistance
  );
};

/**
 * Corrects typos in a word by finding the closest match from a list of keywords
 * Returns the original word if no close match is found
 */
export const correctTypo = (word: string, keywords: string[], maxDistance: number = 2): string => {
  const similar = findSimilarKeywords(word, keywords, maxDistance);
  
  if (similar.length === 0) return word;
  
  // Return the most similar keyword (shortest distance)
  return similar.reduce((best, current) => 
    levenshteinDistance(word.toLowerCase(), best.toLowerCase()) < 
    levenshteinDistance(word.toLowerCase(), current.toLowerCase()) 
      ? best 
      : current
  );
};

/**
 * Corrects typos in a search query by processing each word
 * Returns the corrected query with typos fixed
 */
export const correctQuery = (query: string, keywords: string[], maxDistance: number = 2): string => {
  const words = query.trim().split(/\s+/);
  
  return words.map(word => correctTypo(word, keywords, maxDistance)).join(' ');
};
