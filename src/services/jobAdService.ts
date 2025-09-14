import { get } from "./serviceBase";
import type { IAd, IAds } from "../models/IAd";

const BASE_URL = "https://jobsearch.api.jobtechdev.se/search?";

export enum OccupationId {
  FRONTEND = "name=GDHs_eoz_uKx",
  BACKEND = "name=7wdX_4rv_33z",
  FULLSTACK = "name=71Ji_irM_rSJ",
  ALL = "group=2512",
}

export const getJobAds = async (occupation: OccupationId, offset: number = 0, limit: number = 25): Promise<IAd[]> => {
  const data = await get<IAds>(`${BASE_URL}occupation-${occupation}&offset=${offset}&limit=${limit}`);

  return data.hits;
};

// ADDED: New function for paginated data with total count
export const getJobAdsPaginated = async (occupation: OccupationId, offset: number = 0, limit: number = 25) => {
  const data = await get<IAds>(`${BASE_URL}occupation-${occupation}&offset=${offset}&limit=${limit}`);
  return {
    hits: data.hits,
    totalCount: data.total?.value || 0, // ADDED: Extract total count from API response
    offset,
    limit
  };
};
