import { OccupationId } from "../services/jobAdService";
import type { IAd } from "../models/IAd";
import type { JobState } from "../contexts/JobContext";

export enum JobActionTypes {
  SET_JOBS,
}

export type JobAction = { type: JobActionTypes.SET_JOBS; payload: { occupation: OccupationId; jobs: IAd[] } };

export const JobReducer = (state: JobState, action: JobAction) => {
  switch (action.type) {
    case JobActionTypes.SET_JOBS: {
      const { occupation, jobs: newJobs } = action.payload;
      return {
        ...state,
        [occupation]: newJobs,
      };
    }
    default:
      return state;
  }
};
