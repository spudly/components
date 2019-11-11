import {useMemo} from 'react';
import paginate from '@spudly/paginate';

const usePaginate = (
  currentPage: number,
  totalPages: number,
  size: number = Infinity,
) =>
  useMemo(() => paginate(currentPage, totalPages, size), [
    currentPage,
    totalPages,
    size,
  ]);

export default usePaginate;
