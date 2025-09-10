export interface SearchState {
    query: string;
    category: string; // "all", "frontend", "backend", "fullstack"
    omfattning: string; // "all", "full-time", "part-time", "remote"
    anstallningsform: string; // "permanent", "temporary"
    radius: number; // 8, 12, 20
  }
  
  export interface SearchFiltersProps {
    onFiltersChange: (filters: SearchState) => void;
    initialFilters?: Partial<SearchState>;
  }
  
  export const CATEGORY = {
    ALL: "all",
    FRONTEND: "frontend",
    BACKEND: "backend",
    FULLSTACK: "fullstack"
  } as const;
  
  export const OMFATTNING = {
    ALL: "all",
    FULL_TIME: "full-time",
    PART_TIME: "part-time",
    REMOTE: "remote"
  } as const;
  
  export const ANSTALLNINGSFORM = {
    PERMANENT: "permanent",
    TEMPORARY: "temporary"
  } as const;
  
  export const RADIUS = {
    KM_8: 8,
    KM_12: 12,
    KM_20: 20
  } as const;