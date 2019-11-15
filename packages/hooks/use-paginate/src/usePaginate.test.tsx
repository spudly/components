import React from 'react';
import ReactDOMServer from 'react-dom/server';
import usePaginate from './usePaginate';

const Paginate = ({
  currentPage,
  totalPages,
  size,
}: {
  currentPage: number;
  totalPages: number;
  size?: number;
}) => {
  const descriptors = usePaginate(currentPage, totalPages, size);
  return <p>{descriptors.map(d => `${d.type}-${d.page}`)}</p>;
};

test('returns an array of link descriptors', () => {
  expect(
    ReactDOMServer.renderToString(
      <Paginate currentPage={5} totalPages={10} size={3} />,
    ),
  ).toMatchInlineSnapshot(
    `"<p data-reactroot=\\"\\">FIRST-0<!-- -->PREV-4<!-- -->NUMBER-4<!-- -->NUMBER-5<!-- -->NUMBER-6<!-- -->NEXT-6<!-- -->LAST-9</p>"`,
  );
  expect(
    ReactDOMServer.renderToString(<Paginate currentPage={5} totalPages={10} />),
  ).toMatchInlineSnapshot(
    `"<p data-reactroot=\\"\\">FIRST-0<!-- -->PREV-4<!-- -->NUMBER-0<!-- -->NUMBER-1<!-- -->NUMBER-2<!-- -->NUMBER-3<!-- -->NUMBER-4<!-- -->NUMBER-5<!-- -->NUMBER-6<!-- -->NUMBER-7<!-- -->NUMBER-8<!-- -->NUMBER-9<!-- -->NEXT-6<!-- -->LAST-9</p>"`,
  );
});
