import type { SearchState } from './ISearchState';

export interface EnhancedSearchState extends SearchState {
  // Additional fields for enhanced search
}

export interface SearchAndFilterProps {
  onFiltersChange: (filters: SearchState) => void;
  onSearch: (filters: SearchState) => void;
  onClearResults?: () => void;
  showResults?: boolean;
  resultsCount?: number;
  initialFilters?: Partial<SearchState>;
  showCategoryFilter?: boolean;
  defaultCategory?: string;
}

export interface SearchResultsProps {
  searchState: SearchState;
  onResultsChange?: (results: any[], count: number) => void;
}

export interface JobSearchProps {
  showCategoryFilter?: boolean;
  defaultCategory?: string;
  initialFilters?: Partial<SearchState>;
  title?: string;
}
