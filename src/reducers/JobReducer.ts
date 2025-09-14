import { OccupationId } from "../services/jobAdService";
import type { IAd } from "../models/IAd";
import type { JobState } from "../contexts/JobContext";

export enum JobActionTypes {
  SET_JOBS,
  // ADDED: New action types for pagination
  SET_PAGINATION,
  SET_LOADING,
}

// ADDED: Extended action types for pagination
export type JobAction = 
  | { type: JobActionTypes.SET_JOBS; payload: { occupation: OccupationId; jobs: IAd[] } }
  | { type: JobActionTypes.SET_PAGINATION; payload: { occupation: OccupationId; pagination: { currentPage: number; totalPages: number; totalCount: number; limit: number } } }
  | { type: JobActionTypes.SET_LOADING; payload: { occupation: OccupationId; loading: boolean } };

export const JobReducer = (state: JobState, action: JobAction) => {
  switch (action.type) {
    case JobActionTypes.SET_JOBS: {
      const { occupation, jobs: newJobs } = action.payload;
      return {
        ...state,
        [occupation]: newJobs,
      };
    }
    // ADDED: Handle pagination updates
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
    // ADDED: Handle loading states
    case JobActionTypes.SET_LOADING: {
      return state;
    }
    default:
      return state;
  }
};
