import { get } from "./serviceBase";
import { IAd, IAds } from "../src/models/IAd";

export const getBackend = async (): Promise<IAd[]> => {
  const data = await get<IAds>(`https://jobsearch.api.jobtechdev.se/search?occupation-name=7wdX_4rv_33z`);

  return data.hits;
};
