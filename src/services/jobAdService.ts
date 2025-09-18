import { get } from "./serviceBase";
import type { IAd, IAds } from "../models/IAd";
import type { ILocationCoordinates } from "../models/ILocationCoordinates";
import type { JobSearchFilters } from "../utils/jobFilters";
import { extractTechKeywords, sortByRelevance } from "../utils/searchUtils";

const BASE_URL = "https://jobsearch.api.jobtechdev.se/search?";

export enum OccupationId {
  FRONTEND = "name=GDHs_eoz_uKx",
  BACKEND = "name=7wdX_4rv_33z",
  FULLSTACK = "name=71Ji_irM_rSJ",
  ALL = "group=2512",
}

export type JobAdsResult = {
  hits: IAd[];
  totalCount: number;
  offset: number;
};

const buildSearchUrl = (
  occupation: OccupationId,
  filters: JobSearchFilters,
  userLocation?: ILocationCoordinates | null,
  offset: number = 0
): string => {
  let url = `${BASE_URL}occupation-${occupation}&offset=${offset}&limit=25`;

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

    if (userLocation.lat >= 59.2 && userLocation.lat <= 59.4 && userLocation.lon >= 17.8 && userLocation.lon <= 18.3) {
      url += `&municipality=Stockholm`;
    }
  }
  return url;
};

export const getJobAds = async (
  occupation: OccupationId,
  filters: JobSearchFilters,
  userLocation?: ILocationCoordinates | null,
  offset: number = 0
): Promise<JobAdsResult> => {
  const url = buildSearchUrl(occupation, filters, userLocation);
  const data = await get<IAds>(url);

  if (filters.query && filters.query.trim()) {
    const sorted = sortByRelevance(data.hits, filters.query.trim());
    return {
      hits: sorted,
      totalCount: data.total?.value || 0,
      offset,
    };
  }

  return {
    hits: data.hits,
    totalCount: data.total?.value || 0,
    offset,
  };
};

export const getJobAdsLegacy = async (occupation: OccupationId, query?: string): Promise<JobAdsResult> => {
  const filters: JobSearchFilters = { query: query || "", radiusKm: 0 };
  return getJobAds(occupation, filters);
};

export const getJobAdsPaginated = async (
  occupation: OccupationId,
  offset: number = 0
): Promise<JobAdsResult> => {
  const data = await get<IAds>(`${BASE_URL}occupation-${occupation}&offset=${offset}&limit=25`);
  return {
    hits: data.hits,
    totalCount: data.total?.value || 0,
    offset,
  };
};
