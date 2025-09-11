import { OccupationId } from "../services/jobAdService";
import type { IAd } from "../models/IAd";

export enum JobActionTypes {
  SET_JOBS,
}

export type JobAction = { type: "SET_JOBS"; payload: { occupation: OccupationId; jobs: IAd[] } };
