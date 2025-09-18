import type { IAd } from "../models/IAd";
import type { ILocationCoordinates } from "../models/ILocationCoordinates";
import { calculateDistanceKm, extractAdCoordinates } from "./geoUtils";
import { DEFAULT_SEARCH_FILTERS } from "./constants";

export interface JobSearchFilters {
  query: string;
  radiusKm: number;
  employmentType?: string;
}

export const DEFAULT_FILTERS: JobSearchFilters = DEFAULT_SEARCH_FILTERS;

export function applyClientSideFilters(
  ads: IAd[],
  f: JobSearchFilters,
  userLocation?: ILocationCoordinates | null
): IAd[] {
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
