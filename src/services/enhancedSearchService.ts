import { get } from "./serviceBase";
import type { IAd, IAds } from "../models/IAd";
import type { SearchState } from "../models/ISearchState";
import { OccupationId } from "./jobAdService";

const BASE_URL = "https://jobsearch.api.jobtechdev.se/search?";

export interface SearchParams {
  query?: string;
  category?: string;
  omfattning?: string;
  anstallningsform?: string;
  radius?: number;
  location?: string;
  offset?: number;
  limit?: number;
}

export const buildSearchUrl = (params: SearchParams): string => {
  const searchParams = new URLSearchParams();
  
  // Add job category
  if (params.category && params.category !== 'all') {
    const occupationMap: Record<string, string> = {
      'frontend': OccupationId.FRONTEND,
      'backend': OccupationId.BACKEND,
      'fullstack': OccupationId.FULLSTACK
    };
    
    if (occupationMap[params.category]) {
      searchParams.append('occupation', occupationMap[params.category]);
    }
  } else {
    // If category is "all", use general IT category
    searchParams.append('occupation', OccupationId.ALL);
  }
  
  // Add text search
  if (params.query) {
    searchParams.append('q', params.query);
  }
  
  // Add work time - corrected mapping for JobTech API
  if (params.omfattning && params.omfattning !== 'all') {
    const worktimeMap: Record<string, string> = {
      'full-time': '100', 
      'part-time': '50',  
      'remote': 'remote'  
    };
    
    if (worktimeMap[params.omfattning]) {
      searchParams.append('worktime', worktimeMap[params.omfattning]);
    }
  }
  
  // Add employment type - JobTech API
  if (params.anstallningsform && params.anstallningsform !== 'permanent') {
    const employmentMap: Record<string, string> = {
      'temporary': 'temporary',
      'contract': 'contract',
      'internship': 'internship'
    };
    
    if (employmentMap[params.anstallningsform]) {
      searchParams.append('employment_type', employmentMap[params.anstallningsform]);
    }
  }
  
  // Add location and radius (if specified)
  if (params.radius && params.location) {
    searchParams.append('municipality', params.location);
    searchParams.append('radius', params.radius.toString());
  }
  
  // Add pagination
  searchParams.append('offset', (params.offset || 0).toString());
  searchParams.append('limit', (params.limit || 25).toString());
  
  return `${BASE_URL}${searchParams.toString()}`;
};

// Function to clean search query from city names for API
const cleanQueryFromCity = (query: string): string => {
  const cities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Västerås', 'Örebro', 'Helsingborg'];
  let cleanQuery = query;
  cities.forEach(city => {
    cleanQuery = cleanQuery.replace(new RegExp(city, 'gi'), '').trim();
  });
  return cleanQuery;
};

export const searchJobsWithFilters = async (searchState: SearchState, offset: number = 0, limit: number = 25): Promise<IAd[]> => {
  const cleanQuery = cleanQueryFromCity(searchState.query || '');
  
  const searchParams: SearchParams = {
    query: cleanQuery || undefined,
    category: searchState.category,
    omfattning: searchState.omfattning !== 'all' ? searchState.omfattning : undefined,
    anstallningsform: searchState.anstallningsform !== 'permanent' ? searchState.anstallningsform : undefined,
    radius: searchState.radius !== 8 ? searchState.radius : undefined,
    location: (searchState as any).location || 'Stockholm',
    offset,
    limit
  };
  
  const url = buildSearchUrl(searchParams);
  console.log('JobTech API Search URL:', url); // Debug log
  const data = await get<IAds>(url);
  
  return data.hits;
};
