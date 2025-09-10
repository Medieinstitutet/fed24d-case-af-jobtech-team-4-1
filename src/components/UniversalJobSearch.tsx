import { useState } from 'react';
import type { SearchState } from '../models/ISearchState';
import { EnhancedSearchFilters } from './EnhancedSearchFilters';
import { EnhancedSearchResults } from './EnhancedSearchResults';

interface UniversalJobSearchProps {
  showCategoryFilter?: boolean;
  defaultCategory?: string;
  initialFilters?: Partial<SearchState>;
}

export const UniversalJobSearch = ({ 
  showCategoryFilter = true, 
  defaultCategory = 'all',
  initialFilters
}: UniversalJobSearchProps) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    category: defaultCategory,
    omfattning: 'all',
    anstallningsform: 'permanent',
    radius: 8,
    ...initialFilters
  });

  const handleFiltersChange = (filters: SearchState) => {
    setSearchState(filters);
  };

  const handleSearch = (filters: SearchState) => {
    setSearchState(filters);
  };

  return (
    <div>
      <EnhancedSearchFilters
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        showCategoryFilter={showCategoryFilter}
        defaultCategory={defaultCategory}
        initialFilters={initialFilters}
      />
      
      <EnhancedSearchResults
        searchState={searchState}
      />
    </div>
  );
};
