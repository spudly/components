import React from 'react';
import usePaginate from '@spudly/use-paginate';

export type Props = {
  currentPage: number;
  totalPages: number;
  size?: number;
};

const Pagination = ({currentPage, totalPages, size = Infinity}: Props) => {
  const pages = usePaginate(currentPage, totalPages, size);
  return (
    <ul style={{listStyle: 'none', margin: '0 auto'}}>
      {pages.map(({type, page, isCurrentPage}) => {
        const label = type === 'NUMBER' ? page : type;
        return (
          <li
            key={`${type}-${page}`}
            style={{listStyle: 'none', display: 'inline'}}
          >
            {' '}
            {page == null || isCurrentPage ? (
              label
            ) : (
              <a href={`/${page}`}>{label}</a>
            )}{' '}
          </li>
        );
      })}
    </ul>
  );
};

export default Pagination;
