import { UniversalJobSearch } from './UniversalJobSearch';
import type { SearchState } from '../models/ISearchState';

export const FrontendJobSearch = () => {
  const initialFilters: Partial<SearchState> = {
    category: 'frontend'
  };

  return (
    <UniversalJobSearch
      showCategoryFilter={false}
      defaultCategory="frontend"
      initialFilters={initialFilters}
      title="Frontend developer jobs"
    />
  );
};
