import React from 'react';
import Pagination from './Pagination';

export const firstPageCurrent = () => (
  <Pagination currentPage={0} totalPages={20} />
);

export const middlePageCurrent = () => (
  <Pagination currentPage={10} totalPages={20} />
);

export const lastPageCurrent = () => (
  <Pagination currentPage={19} totalPages={20} />
);

export const firstPageCurrentSize7 = () => (
  <Pagination currentPage={0} totalPages={20} size={7} />
);

export const middlePageCurrentSize7 = () => (
  <Pagination currentPage={10} totalPages={20} size={7} />
);

export const lastPageCurrentSize7 = () => (
  <Pagination currentPage={19} totalPages={20} size={7} />
);

export const zeroPages = () => <Pagination currentPage={0} totalPages={0} />;

export default {title: 'pagination'};
