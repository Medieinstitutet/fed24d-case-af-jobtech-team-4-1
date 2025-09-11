import { UniversalJobSearch } from './UniversalJobSearch';
import type { SearchState } from '../models/ISearchState';

export const FullstackJobSearch = () => {
  const initialFilters: Partial<SearchState> = {
    category: 'fullstack'
  };

  return (
    <UniversalJobSearch
      showCategoryFilter={false}
      defaultCategory="fullstack"
      initialFilters={initialFilters}
      title="Fullstack developer jobs"
    />
  );
};
