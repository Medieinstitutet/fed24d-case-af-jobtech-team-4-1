import { DigiNavigationPagination } from "@digi/arbetsformedlingen-react";
import "./PaginationControls.scss";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {

  const handlePageChange = (event: CustomEvent<number>) => {
    onPageChange(event.detail)
  };

  return (
    <DigiNavigationPagination 
      afTotalPages={totalPages} 
      afInitActivePage={currentPage} 
      onAfOnPageChange={handlePageChange}
      className="pagination"
    >
    </DigiNavigationPagination>
  );
};
