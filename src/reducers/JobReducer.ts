import { OccupationId } from "../services/jobAdService";
import type { IAd } from "../models/IAd";
import type { JobState } from "../contexts/JobContext";

export enum JobActionTypes {
  SET_JOBS,
  SET_PAGINATION,
}

export type JobAction =
  | { type: JobActionTypes.SET_JOBS; payload: { occupation: OccupationId; jobs: IAd[] } }
  | {
      type: JobActionTypes.SET_PAGINATION;
      payload: {
        occupation: OccupationId;
        pagination: { currentPage: number; totalPages: number; totalCount: number };
      };
    };

export const JobReducer = (state: JobState, action: JobAction) => {
  switch (action.type) {
    case JobActionTypes.SET_JOBS: {
      const { occupation, jobs: newJobs } = action.payload;
      return {
        ...state,
        [occupation]: newJobs,
      };
    }

    case JobActionTypes.SET_PAGINATION: {
      const { occupation, pagination } = action.payload;
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [occupation]: pagination,
        },
      };
    }

    default:
      return state;
  }
};
