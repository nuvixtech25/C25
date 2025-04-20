
import { useState } from 'react';

export function usePagination(initialItemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(initialItemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return {
    currentPage,
    itemsPerPage,
    paginate
  };
}
