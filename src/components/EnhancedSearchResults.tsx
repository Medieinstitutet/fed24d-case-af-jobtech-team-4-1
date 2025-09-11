import { useEffect, useState } from "react";
import type { IAd } from "../models/IAd";
import type { SearchState } from "../models/ISearchState";
import { searchJobsWithFilters } from "../services/enhancedSearchService";
import { Link } from "react-router";
import "./AdsPresentation.css";

interface EnhancedSearchResultsProps {
  searchState: SearchState;
  onResultsChange?: (results: IAd[], count: number) => void;
}

export const EnhancedSearchResults = ({ searchState, onResultsChange }: EnhancedSearchResultsProps) => {
  const [jobs, setJobs] = useState<IAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Only search if there's a query or filters are changed
    const shouldSearch = searchState.query || 
      searchState.category !== 'all' || 
      searchState.omfattning !== 'all' ||
      searchState.anstallningsform !== 'permanent';

    if (shouldSearch) {
      performSearch();
    } else if (hasSearched) {
      // Clear results if no search criteria
      setJobs([]);
      onResultsChange?.([], 0);
    }
  }, [searchState]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchJobsWithFilters(searchState);
      setJobs(results);
      onResultsChange?.(results, results.length);
    } catch (err) {
      setError("Could not fetch jobs. Please try again.");
      console.error(err);
      onResultsChange?.([], 0);
    } finally {
      setLoading(false);
    }
  };

  const formatDeadline = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Use the search function to find jobs</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No jobs found with the selected filters</p>
      </div>
    );
  }

  return (
    <ul>
      {jobs.map(job => (
        <li key={job.id}>
          <Link to={`/${job.id}`}>
            <h3>{job.headline}</h3>
          </Link>
          <p>
            {job.employer?.name} - {job.workplace_address.municipality}
          </p>
          <p>Apply by: {formatDeadline(job.application_deadline)}</p>
        </li>
      ))}
    </ul>
  );
};
