import React, {ComponentProps, ReactElement} from 'react';
import Pagination from './Pagination';
import {Props} from './types';

const render: Props['render'] = pages => (
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

export const firstPageCurrent = () => (
  <Pagination currentPage={0} totalPages={20} render={render} />
);

export const middlePageCurrent = () => (
  <Pagination currentPage={10} totalPages={20} render={render} />
);

export const lastPageCurrent = () => (
  <Pagination currentPage={19} totalPages={20} render={render} />
);

export const firstPageCurrentSize7 = () => (
  <Pagination currentPage={0} totalPages={20} size={7} render={render} />
);

export const middlePageCurrentSize7 = () => (
  <Pagination currentPage={10} totalPages={20} size={7} render={render} />
);

export const lastPageCurrentSize7 = () => (
  <Pagination currentPage={19} totalPages={20} size={7} render={render} />
);

export const zeroPages = () => (
  <Pagination currentPage={0} totalPages={0} render={render} />
);

export default {title: 'react-pagination'};
