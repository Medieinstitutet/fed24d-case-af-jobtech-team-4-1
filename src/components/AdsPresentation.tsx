import { useContext, useEffect, useState } from "react";
import { getJobAdsPaginated, OccupationId } from "../services/jobAdService";
import { Link, useParams, useNavigate } from "react-router";
import { JobContext } from "../contexts/JobContext";
import { JobActionTypes } from "../reducers/JobReducer";
import "./AdsPresentation.scss";
import { DigiLayoutContainer, DigiLinkButton, DigiLoaderSpinner, DigiButton, DigiTypography } from "@digi/arbetsformedlingen-react";
import { LinkButtonSize, LinkButtonVariation, LoaderSpinnerSize, ButtonSize, ButtonVariation } from "@digi/arbetsformedlingen";

type AdsPresentationProps = {
  occupation: OccupationId;
};

// ADDED: Pagination component using Digi components with page numbers
const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  // ADDED: Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-controls">
      <DigiButton 
        afSize={ButtonSize.MEDIUM}
        afVariation={ButtonVariation.SECONDARY}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        style={{ 
          opacity: currentPage <= 1 ? 0.5 : 1,
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
        }}
      >
        Previous
      </DigiButton>
      
      {/* ADDED: Page numbers */}
      <div className="page-numbers">
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <DigiTypography key={`ellipsis-${index}`} className="ellipsis">
              ...
            </DigiTypography>
          ) : (
            <DigiButton
              key={page}
              afSize={ButtonSize.SMALL}
              afVariation={page === currentPage ? ButtonVariation.PRIMARY : ButtonVariation.SECONDARY}
              onClick={() => onPageChange(page as number)}
              className={page === currentPage ? 'current-page' : ''}
              style={page === currentPage ? {
                backgroundColor: '#57a27e',
                color: 'white',
                borderColor: '#57a27e'
              } : {}}
            >
              {page}
            </DigiButton>
          )
        ))}
      </div>
      
      <DigiButton 
        afSize={ButtonSize.MEDIUM}
        afVariation={ButtonVariation.SECONDARY}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        style={{ 
          opacity: currentPage >= totalPages ? 0.5 : 1,
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        Next
      </DigiButton>
    </div>
  );
};

export const AdsPresentation = ({ occupation }: AdsPresentationProps) => {
  const { jobs, dispatch } = useContext(JobContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 25; // Max items per API call
  const navigate = useNavigate();
  const { occupationSlug } = useParams<{ occupationSlug?: string }>();


  // ADDED: Pagination handler - loads new page from API
  const handlePageChange = (newPage: number) => {
    setLoading(true);
    const offset = (newPage - 1) * limit;
    
    getJobAdsPaginated(occupation, offset, limit)
      .then(data => {
        dispatch({
          type: JobActionTypes.SET_JOBS,
          payload: { occupation, jobs: data.hits },
        });
        // ADDED: Update pagination state
        dispatch({
          type: JobActionTypes.SET_PAGINATION,
          payload: { 
            occupation, 
            pagination: {
              currentPage: newPage,
              totalPages: Math.ceil(data.totalCount / limit),
              totalCount: data.totalCount,
              limit: limit
            }
          },
        });
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch jobs");
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // ADDED: Load first page with pagination data
    if (jobs[occupation].length > 0 && jobs.pagination[occupation].totalCount > 0) {
      setLoading(false);
      return;
    }

    getJobAdsPaginated(occupation, 0, limit)
      .then(data => {
        dispatch({
          type: JobActionTypes.SET_JOBS,
          payload: { occupation, jobs: data.hits },
        });
        // ADDED: Set initial pagination state
        dispatch({
          type: JobActionTypes.SET_PAGINATION,
          payload: { 
            occupation, 
            pagination: {
              currentPage: 1,
              totalPages: Math.ceil(data.totalCount / limit),
              totalCount: data.totalCount,
              limit: limit
            }
          },
        });
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch jobs");
        console.error(err);
        setLoading(false);
      });
  }, [occupation, dispatch]);

  // ADDED: Get displayed items (show all jobs from current page)
  const displayedJobs = jobs[occupation];
  
  

  if (loading)
    return (
      <>
        <DigiLoaderSpinner afSize={LoaderSpinnerSize.MEDIUM} afText="Laddar"></DigiLoaderSpinner>
      </>
    );
  if (error) return <p>{error}</p>;

  const formatDeadline = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
  <DigiLayoutContainer>
    <DigiLinkButton
      className="back-btn"
      afSize={LinkButtonSize.MEDIUM}
      afVariation={LinkButtonVariation.SECONDARY}
      af-hide-icon={true}
      onClick={() => {
        navigate("/");
      }}
    >
      ⬅️ Tillbaka
    </DigiLinkButton>
  </DigiLayoutContainer>

  {jobs[occupation].length === 0 ? (
    <p>Inga jobbannonser hittades för {occupationSlug}.</p>
  ) : (
    <>
      <ul>
        {jobs[occupation].map((job) => (
          <li key={job.id}>
            <Link to={`/${occupationSlug}/${job.id}`}>
              <h3>{job.headline}</h3>
            </Link>
            <p>
              {job.employer?.name} - {job.workplace_address.municipality}
            </p>
            <p>Sök senast: {formatDeadline(job.application_deadline)}</p>
          </li>
        ))}
      </ul>

      {jobs.pagination[occupation].totalPages > 1 && (
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <DigiTypography style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
            Page {jobs.pagination[occupation].currentPage} of {jobs.pagination[occupation].totalPages}
          </DigiTypography>
          <PaginationControls
            currentPage={jobs.pagination[occupation].currentPage}
            totalPages={jobs.pagination[occupation].totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  )}
</>

  );
};
