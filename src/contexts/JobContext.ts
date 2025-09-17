import { createContext, type Dispatch } from "react";
import type { IAd } from "../models/IAd";
import { OccupationId } from "../services/jobAdService";
import type { JobAction } from "../reducers/JobReducer";

export type JobState = {
  [OccupationId.BACKEND]: IAd[];
  [OccupationId.FRONTEND]: IAd[];
  [OccupationId.FULLSTACK]: IAd[];
  [OccupationId.ALL]: IAd[];
  // ADDED: Pagination state for each occupation
  pagination: {
    [key in OccupationId]: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  };
};

export const initialState: JobState = {
  [OccupationId.BACKEND]: [],
  [OccupationId.FRONTEND]: [],
  [OccupationId.FULLSTACK]: [],
  [OccupationId.ALL]: [],
  // ADDED: Initialize pagination for each occupation
  pagination: {
    [OccupationId.BACKEND]: { currentPage: 1, totalPages: 0, totalCount: 0, limit: 25 },
    [OccupationId.FRONTEND]: { currentPage: 1, totalPages: 0, totalCount: 0, limit: 25 },
    [OccupationId.FULLSTACK]: { currentPage: 1, totalPages: 0, totalCount: 0, limit: 25 },
    [OccupationId.ALL]: { currentPage: 1, totalPages: 0, totalCount: 0, limit: 25 },
  },
};

type JobContextType = {
  jobs: JobState;
  dispatch: Dispatch<JobAction>;
};

export const JobContext = createContext<JobContextType>({
  jobs: initialState,
  dispatch: () => {},
});
