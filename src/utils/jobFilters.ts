/**
 * 
 * This module is now DEPRECATED as JobTech API handles all filtering:
 * - Text search: handled by API parameter 'q'
 * - Radius filtering: handled by API parameter 'location__radius'
 * 
 * Functions:
 * - JobSearchFilters: Interface for search filter parameters (query, radiusKm, employmentType)
 * - DEFAULT_FILTERS: Default filter values
 * - applyFilters:  applies client-side radius filtering
 */

import type { IAd, LocationCoordinates } from "../models/IAd";
import { calculateDistanceKm, extractAdCoordinates } from "./geoUtils";
import { DEFAULT_SEARCH_FILTERS } from "./constants";

/**
 * Job search filter parameters
 */
export interface JobSearchFilters {
  query: string;
  radiusKm: number;
  employmentType?: string;
}

export const DEFAULT_FILTERS: JobSearchFilters = DEFAULT_SEARCH_FILTERS;

/**
 * Applies radius filters to job ads
 * through the 'location__radius' parameter.
 * 
 * @param ads - Array of job ads to filter (already sorted by API)
 * @param filters - Filter parameters
 * @param userLocation - Optional user location for radius filtering
 * @returns Filtered array of job ads
 * @deprecated Use API radius filtering instead
 */
export function applyFilters(ads: IAd[], f: JobSearchFilters, userLocation?: LocationCoordinates | null): IAd[] {
  // Use only user location for radius filtering
  const center = userLocation;
  
  return ads.filter(ad => {
    // Client-side radius filtering (only works with user geolocation)
    if (f.radiusKm > 0 && center) {
      const c = extractAdCoordinates(ad);
      if (c) {
        if (calculateDistanceKm(center.lat, center.lon, c.lat, c.lon) > f.radiusKm) return false;
      }
      // If no coordinates available, skip this ad (can't calculate distance)
    }

    return true;
  });
}