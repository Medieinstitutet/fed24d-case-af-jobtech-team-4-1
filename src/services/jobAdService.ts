import { get } from "./serviceBase";
import type { IAd, IAds } from "../models/IAd";
import type { LocationCoordinates } from "../models/ILocationCoordinates";
import type { JobSearchFilters } from "../utils/jobFilters";
import { extractTechKeywords, sortByRelevance } from "../utils/searchUtils";

const BASE_URL = "https://jobsearch.api.jobtechdev.se/search?";

export enum OccupationId {
  FRONTEND = "name=GDHs_eoz_uKx",
  BACKEND = "name=7wdX_4rv_33z",
  FULLSTACK = "name=71Ji_irM_rSJ",
  ALL = "group=2512",
}


/**
Builds API URL with search and filter parameters including radius
 * @param occupation - Job occupation category
 * @param filters - Search and filter parameters
 * @param userLocation - Optional user location for radius filtering
 * @returns Complete API URL with parameters
 */
const buildSearchUrl = (occupation: OccupationId, filters: JobSearchFilters, userLocation?: LocationCoordinates | null): string => {
  let url = `${BASE_URL}occupation-${occupation}&offset=0&limit=25`;
  
  // Add text search query to API
  if (filters.query && filters.query.trim()) {
    const techQuery = extractTechKeywords(filters.query.trim());
    if (techQuery) {
      url += `&q=${encodeURIComponent(techQuery)}`;
    }
  }
  
  
  if (filters.radiusKm > 0 && userLocation) {
    const radiusParam = `${userLocation.lat},${userLocation.lon}__${filters.radiusKm}`;
    url += `&location__radius=${radiusParam}`;
    
    if (userLocation.lat >= 59.2 && userLocation.lat <= 59.4 && 
        userLocation.lon >= 17.8 && userLocation.lon <= 18.3) {
      url += `&municipality=Stockholm`;
    }
  }
  

  return url;
};

/**
 * Fetches job ads from JobTech API with search and filter parameters including radius
 * @param occupation - Job occupation category
 * @param filters - Search and filter parameters
 * @param userLocation - Optional user location for radius filtering
 * @returns Promise with filtered job ads from API
 */
export const getJobAds = async (occupation: OccupationId, filters: JobSearchFilters, userLocation?: LocationCoordinates | null): Promise<IAd[]> => {
  const url = buildSearchUrl(occupation, filters, userLocation);
  
  const data = await get<IAds>(url);
  
  if (filters.query && filters.query.trim()) {
    return sortByRelevance(data.hits, filters.query.trim());
  }
  
  return data.hits;
};


/**
 * Legacy function for backward compatibility - fetches job ads with query string
 * @param occupation - Job occupation category  
 * @param query - Search query string
 * @returns Promise with job ads
 */
export const getJobAdsLegacy = async (occupation: OccupationId, query?: string): Promise<IAd[]> => {
  const filters: JobSearchFilters = { query: query || "", radiusKm: 0 };
  return getJobAds(occupation, filters);
};


// ADDED: New function for paginated data with total count
export const getJobAdsPaginated = async (occupation: OccupationId, offset: number = 0) => {
  const data = await get<IAds>(`${BASE_URL}occupation-${occupation}&offset=${offset}&limit=25`);
  return {
    hits: data.hits,
    totalCount: data.total?.value || 0, // ADDED: Extract total count from API response
    offset,
  };
};
