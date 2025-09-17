import { ButtonSize, ButtonType, ButtonVariation } from "@digi/arbetsformedlingen";
import { DigiButton, DigiTypography } from "@digi/arbetsformedlingen-react";
import "./PaginationControls.scss";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {  
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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
        {currentPage > 1 ? 
      <DigiButton
        afSize={ButtonSize.MEDIUM}
        afVariation={ButtonVariation.SECONDARY}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        afType={ButtonType.BUTTON}
      >
        Föregående
      </DigiButton> : ""}

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

      { currentPage != totalPages ?
      <DigiButton
        afSize={ButtonSize.MEDIUM}
        afVariation={ButtonVariation.SECONDARY}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >
        Nästa
      </DigiButton> : ""}
    </div>
  );
};
