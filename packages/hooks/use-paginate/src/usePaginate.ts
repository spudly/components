import {useMemo} from 'react';
import paginate, {PageDescriptor} from '@spudly/paginate';

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

export {PageDescriptor};
export default usePaginate;
