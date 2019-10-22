import {ReactElement} from 'react';

export type PageDescriptor = {
  type: 'FIRST' | 'PREV' | 'NUMBER' | 'NEXT' | 'LAST';
  page: number | null;
  isCurrentPage: boolean;
};

export type Props = {
  currentPage: number;
  totalPages: number;
  size?: number;
  render: (pages: Array<PageDescriptor>) => ReactElement | null;
};
