import {ReactElement} from 'react';
import range from '@spudly/range';

type Props = {
  currentPage: number;
  totalPages: number;
  size?: number;
  render: (
    pages: Array<{label: string; page: number | null; isCurrentPage: boolean}>,
  ) => ReactElement | null;
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
      {label: 'first', page: firstPage},
      {label: 'prev', page: prevPage},
      ...pageNumbers.map(num => ({label: `${num}`, page: num})),
      {label: 'next', page: nextPage},
      {label: 'last', page: lastPage},
    ].map(descriptor => ({
      ...descriptor,
      isCurrentPage: descriptor.page === currentPage,
    })),
  );
};

export default Pagination;
