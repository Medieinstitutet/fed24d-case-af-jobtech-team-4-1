import { ButtonSize, ButtonVariation } from "@digi/arbetsformedlingen";
import { DigiButton, DigiTypography } from "@digi/arbetsformedlingen-react";


type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const PaginationControls = ({currentPage, totalPages, onPageChange}: PaginationControlsProps ) => {
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; 
 
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
        if (start > 2) pages.push("...");
      }
 
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
 
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
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
          cursor: currentPage <= 1 ? "not-allowed" : "pointer",
        }}
      >
        Previous
      </DigiButton>

      <div className="page-numbers">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <DigiTypography key={`ellipsis-${index}`} className="ellipsis">
              ...
            </DigiTypography>
          ) : (
            <DigiButton
              key={page}
              afSize={ButtonSize.SMALL}
              afVariation={page === currentPage ? ButtonVariation.PRIMARY : ButtonVariation.SECONDARY}
              onClick={() => onPageChange(page as number)}
              className={page === currentPage ? "current-page" : ""}
              style={
                page === currentPage
                  ? {
                      backgroundColor: "#57a27e",
                      color: "white",
                      borderColor: "#57a27e",
                    }
                  : {}
              }
            >
              {page}
            </DigiButton>
          )
        )}
      </div>
 
      <DigiButton
        afSize={ButtonSize.MEDIUM}
        afVariation={ButtonVariation.SECONDARY}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        style={{
          opacity: currentPage >= totalPages ? 0.5 : 1,
          cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
        }}
      >
        Next
      </DigiButton>
    </div>
  );
};

 