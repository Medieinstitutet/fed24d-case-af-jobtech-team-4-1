import { UniversalJobSearch } from './UniversalJobSearch';
import type { SearchState } from '../models/ISearchState';

export const BackendJobSearch = () => {
  const initialFilters: Partial<SearchState> = {
    category: 'backend'
  };

  return (
    <UniversalJobSearch
      showCategoryFilter={false}
      defaultCategory="backend"
      initialFilters={initialFilters}
      title="Backend developer jobs"
    />
  );
};
