import range from '@spudly/range';
import {Props, PageDescriptor} from './types';

const types: {[key: string]: PageDescriptor['type']} = {
  FIRST: 'FIRST',
  PREV: 'PREV',
  NUMBER: 'NUMBER',
  NEXT: 'NEXT',
  LAST: 'LAST',
};

const Pagination = ({
  currentPage,
  totalPages,
  size = Infinity,
  render,
}: Props) => {
  const firstPage = totalPages > 0 ? 0 : null;
  const lastPage = totalPages > 0 ? totalPages - 1 : null;
  const prevPage =
    firstPage != null && currentPage > firstPage ? currentPage - 1 : null;
  const nextPage =
    lastPage != null && currentPage < lastPage ? currentPage + 1 : null;

  const pageNumbers =
    size === Infinity || size >= totalPages
      ? range(0, totalPages)
      : totalPages && currentPage < size / 2
      ? range(0, size)
      : totalPages && currentPage > totalPages - size / 2
      ? range(totalPages - size, totalPages)
      : range(
          currentPage - Math.floor(size / 2),
          currentPage + Math.ceil(size / 2),
        );

  return render(
    [
      {type: types.FIRST, page: firstPage},
      {type: types.PREV, page: prevPage},
      ...pageNumbers.map(num => ({type: types.NUMBER, page: num})),
      {type: types.NEXT, page: nextPage},
      {type: types.LAST, page: lastPage},
    ].map(descriptor => ({
      ...descriptor,
      isCurrentPage: descriptor.page === currentPage,
    })),
  );
};

export default Pagination;
