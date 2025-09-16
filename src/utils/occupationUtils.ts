/**
 * Occupation utilities
 * Maps between API-friendly occupation IDs and user-friendly slugs
 * 
 * Functions:
 * - occupationSlugs: Maps OccupationId enum to URL-friendly strings (frontend, backend, fullstack, alla-jobb)
 * - slugToOccupation: Reverse mapping from URL slugs back to OccupationId enum values
 */

import { OccupationId } from "../services/jobAdService";

//Give occupationIds userfriendly names
export const occupationSlugs: Record<OccupationId, string> = {
  [OccupationId.FRONTEND]: "frontend",
  [OccupationId.BACKEND]: "backend",
  [OccupationId.FULLSTACK]: "fullstack",
  [OccupationId.ALL]: "alla-jobb",
};

//Revert the userfriendly names for our occupationIds back to something api-friendly
export const slugToOccupation: Record<string, OccupationId> = Object.entries(occupationSlugs).reduce(
  (occ, [id, slug]) => {
    occ[slug] = id as OccupationId;
    return occ;
  },
  {} as Record<string, OccupationId>
);
