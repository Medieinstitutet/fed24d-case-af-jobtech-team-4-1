import { correctQuery } from "./spellCheck";
import type { IAd } from "../models/IAd";

export const extractTechKeywords = (query: string): string => {
  const techKeywords = [
    "react",
    "angular",
    "vue",
    "javascript",
    "typescript",
    "node",
    "python",
    "java",
    "c#",
    "csharp",
    ".net",
    "dotnet",
    "asp.net",
    "frontend",
    "backend",
    "fullstack",
    "developer",
    "programmer",
    "engineer",
    "web",
    "mobile",
    "app",
    "api",
    "database",
    "sql",
  ];

  const locationWords = [
    "stockholm",
    "göteborg",
    "malmö",
    "uppsala",
    "västerås",
    "örebro",
    "linköping",
    "helsingborg",
    "jönköping",
    "norrköping",
  ];

  // Correct typos in the query
  const correctedQuery = correctQuery(query, [...techKeywords, ...locationWords], 2);

  const words = correctedQuery.toLowerCase().split(" ");
  const relevantWords = words.filter(
    word =>
      techKeywords.includes(word) ||
      locationWords.includes(word) ||
      techKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))
  );

  return relevantWords.join(" ");
};

// Sort ads by relevance to search query with secondary sorting
export const sortByRelevance = (ads: IAd[], query: string, hasLocation?: boolean, locationQuery?: string): IAd[] => {
  const normalizedQuery = query.toLowerCase();

  return ads.sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, normalizedQuery, hasLocation, locationQuery);
    const scoreB = calculateRelevanceScore(b, normalizedQuery, hasLocation, locationQuery);

    // Primary sort: by relevance score (higher first)
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // Secondary sort: by application deadline (newer first)
    const dateA = new Date(a.application_deadline || 0).getTime();
    const dateB = new Date(b.application_deadline || 0).getTime();
    return dateB - dateA;
  });
};

// Calculate relevance score for an ad with improved location prioritization
export const calculateRelevanceScore = (
  ad: IAd,
  query: string,
  hasLocation?: boolean,
  locationQuery?: string
): number => {
  let score = 0;

  // Split query into individual words for better matching
  const queryWords = query.split(" ").filter(word => word.length > 0);

  // Check if query contains location words
  const locationWords = [
    "stockholm",
    "göteborg",
    "malmö",
    "uppsala",
    "västerås",
    "örebro",
    "linköping",
    "helsingborg",
    "jönköping",
    "norrköping",
  ];
  const hasLocationInQuery = queryWords.some(word => locationWords.includes(word));

  const headline = ad.headline?.toLowerCase() || "";
  if (headline.includes(query)) score += 15;

  queryWords.forEach(word => {
    if (headline.includes(word)) {
      if (locationWords.includes(word)) {
        score += 3;
      } else {
        score += 8;
      }
    }
  });

  // Check occupation - exact phrase match
  const occupation = ad.occupation?.label?.toLowerCase() || "";
  if (occupation.includes(query)) score += 12;

  // Check occupation - individual word matches
  queryWords.forEach(word => {
    if (occupation.includes(word)) {
      if (locationWords.includes(word)) {
        score += 2;
      } else {
        score += 7;
      }
    }
  });

  // Check description - exact phrase match
  const description = ad.description?.text?.toLowerCase() || "";
  if (description.includes(query)) score += 6;

  // Check description - individual word matches
  queryWords.forEach(word => {
    if (description.includes(word)) {
      if (locationWords.includes(word)) {
        score += 1;
      } else {
        score += 4;
      }
    }
  });

  const employer = ad.employer?.name?.toLowerCase() || "";
  if (employer.includes(query)) score += 4;

  queryWords.forEach(word => {
    if (employer.includes(word)) {
      if (locationWords.includes(word)) {
        score += 1;
      } else {
        score += 3;
      }
    }
  });

  const municipality = ad.workplace_address?.municipality?.toLowerCase() || "";

  if (hasLocationInQuery) {
    queryWords.forEach(word => {
      if (locationWords.includes(word) && municipality.includes(word)) {
        score += 20;
      }
    });

    if (queryWords.some(word => locationWords.includes(word) && municipality.includes(word))) {
      score += 15;
    }
  }

  if (hasLocation && locationQuery && municipality.includes(locationQuery.toLowerCase())) {
    score += 10;
  }

  return score;
};
