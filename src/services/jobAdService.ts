import { get } from "./serviceBase";
import type { IAd, IAds } from "../models/IAd";
import { correctQuery } from "../utils/spellCheck";

const BASE_URL = "https://jobsearch.api.jobtechdev.se/search?";

export enum OccupationId {
  FRONTEND = "name=GDHs_eoz_uKx",
  BACKEND = "name=7wdX_4rv_33z",
  FULLSTACK = "name=71Ji_irM_rSJ",
  ALL = "group=2512",
}

// Extract technology keywords from search query
// Example: "react stockholm" -> "react" (for API)
// Example: "javascript developer malmö" -> "javascript developer" (for API)
const extractTechKeywords = (query: string): string => {
  const techKeywords = [
    'react', 'angular', 'vue', 'javascript', 'typescript', 'node', 'python', 'java',
    'c#', 'csharp', '.net', 'dotnet', 'asp.net',
    'frontend', 'backend', 'fullstack', 'developer', 'programmer', 'engineer',
    'web', 'mobile', 'app', 'api', 'database', 'sql'
  ];
  
  // typos in the query
  const correctedQuery = correctQuery(query, techKeywords, 2);
  
  const words = correctedQuery.toLowerCase().split(' ');
  const techWords = words.filter(word => 
    techKeywords.includes(word) || 
    techKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))
  );
  
  return techWords.join(' ');
};

export const getJobAds = async (occupation: OccupationId, query?: string): Promise<IAd[]> => {
  let url = `${BASE_URL}occupation-${occupation}&offset=0&limit=25`;
  
  if (query && query.trim()) {
    
    // This allows API to find tech-related jobs
    const techQuery = extractTechKeywords(query.trim());
    
    if (techQuery) {
      url += `&q=${encodeURIComponent(techQuery)}`;
    }
  }
  
  const data = await get<IAds>(url);
  
  // Apply client-side sorting 
  if (query && query.trim()) {
    return sortByRelevance(data.hits, query.trim());
  }
  
  return data.hits;
};

// Sort ads by relevance to search query
export const sortByRelevance = (ads: IAd[], query: string, hasLocation?: boolean, locationQuery?: string): IAd[] => {
  const normalizedQuery = query.toLowerCase();
  
  return ads.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, normalizedQuery, hasLocation, locationQuery);
    const scoreB = calculateRelevanceScore(b, normalizedQuery, hasLocation, locationQuery);
    return scoreB - scoreA; // Higher score first
  });
};

// Calculate relevance score for an ad
export const calculateRelevanceScore = (ad: IAd, query: string, hasLocation?: boolean, locationQuery?: string): number => {
  let score = 0;
  
  // Split query into individual words for better matching
  // Example: "react stockholm" -> ["react", "stockholm"]
  // This allows finding "React Developer" when searching "react stockholm"
  const queryWords = query.split(" ").filter(word => word.length > 0);
  
  // Check headline - exact phrase match gets highest score
  const headline = ad.headline?.toLowerCase() || "";
  if (headline.includes(query)) score += 10;
  
  // Check headline - individual word matches
  queryWords.forEach(word => {
    if (headline.includes(word)) score += 6;
  });
  
  // Check occupation - exact phrase match
  const occupation = ad.occupation?.label?.toLowerCase() || "";
  if (occupation.includes(query)) score += 8;
  
  // Check occupation - individual word matches
  queryWords.forEach(word => {
    if (occupation.includes(word)) score += 5;
  });
  
  // Check description - exact phrase match
  const description = ad.description?.text?.toLowerCase() || "";
  if (description.includes(query)) score += 5;
  
  // Check description - individual word matches
  queryWords.forEach(word => {
    if (description.includes(word)) score += 3;
  });
  
  // Check employer - exact phrase match
  const employer = ad.employer?.name?.toLowerCase() || "";
  if (employer.includes(query)) score += 3;
  
  // Check employer - individual word matches
  queryWords.forEach(word => {
    if (employer.includes(word)) score += 2;
  });
  
  // Check location - exact phrase match
  const municipality = ad.workplace_address?.municipality?.toLowerCase() || "";
  if (municipality.includes(query)) score += 7;
  
  // Check location - individual word matches
  queryWords.forEach(word => {
    if (municipality.includes(word)) score += 4;
  });
  
  // Location for user's specific location
  if (hasLocation && locationQuery && municipality.includes(locationQuery.toLowerCase())) {
    score += 3;
  }
  
  return score; 
};
