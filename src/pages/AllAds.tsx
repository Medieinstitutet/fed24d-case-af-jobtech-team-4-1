import { SearchFilters } from '../components/SearchFilters';
import type { SearchState } from '../models/ISearchState';

export const AllAds = () => {
  const handleFiltersChange = (filters: SearchState) => {
    console.log('Filters:', filters);
  };

  return (
    <div>
      <SearchFilters onFiltersChange={handleFiltersChange} />
      <h2>Hej</h2>
    </div>
  );
};