import type { IAd } from "../models/IAd";
import type { LocationCoordinates } from "../models/ILocationCoordinates";
import { calculateDistanceKm, extractAdCoordinates } from "./geoUtils";
import { DEFAULT_SEARCH_FILTERS } from "./constants";


export interface JobSearchFilters {
  query: string;
  radiusKm: number;
  employmentType?: string;
}

export const DEFAULT_FILTERS: JobSearchFilters = DEFAULT_SEARCH_FILTERS;

/**
 * Applies client-side radius filters to job ads as additional filtering
 * after API radius filtering for more precise results.
 * 
 * @param ads - Array of job ads to filter (already sorted by API)
 * @param filters - Filter parameters
 * @param userLocation - Optional user location for radius filtering
 * @returns Filtered array of job ads
 */
export function applyClientSideFilters(ads: IAd[], f: JobSearchFilters, userLocation?: LocationCoordinates | null): IAd[] {
  const center = userLocation;
  
  return ads.filter(ad => {
    if (f.radiusKm > 0 && center) {
      const c = extractAdCoordinates(ad);
      if (c) {
        if (calculateDistanceKm(center.lat, center.lon, c.lat, c.lon) > f.radiusKm) return false;
      }
    }

    return true;
  });
}