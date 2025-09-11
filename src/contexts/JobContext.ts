import { createContext, type Dispatch } from "react";
import type { IAd } from "../models/IAd";
import { OccupationId } from "../services/jobAdService";
import type { JobAction } from "../reducers/JobReducer";

export type JobState = {
  [OccupationId.BACKEND]: IAd[];
  [OccupationId.FRONTEND]: IAd[];
  [OccupationId.FULLSTACK]: IAd[];
  [OccupationId.ALL]: IAd[];
};

export const initialState: JobState = {
  [OccupationId.BACKEND]: [],
  [OccupationId.FRONTEND]: [],
  [OccupationId.FULLSTACK]: [],
  [OccupationId.ALL]: [],
};

type JobContextType = {
  jobs: JobState;
  dispatch: Dispatch<JobAction>;
};

export const JobContext = createContext<JobContextType>({
  jobs: initialState,
  dispatch: () => {},
});
