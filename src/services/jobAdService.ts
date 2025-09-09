import { get } from "./serviceBase";
import type { IAd, IAds } from "../models/IAd";

const BASE_URL = "https://jobsearch.api.jobtechdev.se/search?";

export enum OccupationId {
  FRONTEND = "name=GDHs_eoz_uKx",
  BACKEND = "name=7wdX_4rv_33z",
  FULLSTACK = "name=71Ji_irM_rSJ",
  ALL = "group=2512",
}

export const getJobAds = async (occupation: OccupationId): Promise<IAd[]> => {
  const data = await get<IAds>(`${BASE_URL}occupation-${occupation}&offset=0&limit=25`);

  return data.hits;
};
