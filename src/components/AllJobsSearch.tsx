import { UniversalJobSearch } from './UniversalJobSearch';

export const AllJobsSearch = () => {
  return (
    <UniversalJobSearch
      showCategoryFilter={true}
      defaultCategory="all"
      title="All developer jobs"
    />
  );
};
