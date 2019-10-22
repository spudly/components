/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, cleanup} from '@testing-library/react';
import Pagination from './Pagination';

test('renders (first page current)', () => {
  const {container} = render(
    <Pagination
      currentPage={0}
      totalPages={20}
      render={pages => (
        <>
          [
          {pages.map(page => (
            <React.Fragment key={page.label}>
              {JSON.stringify(page)}
            </React.Fragment>
          ))}
          ]
        </>
      )}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"label":"first","page":0,"isCurrentPage":true}
      {"label":"prev","page":null,"isCurrentPage":false}
      {"label":"0","page":0,"isCurrentPage":true}
      {"label":"1","page":1,"isCurrentPage":false}
      {"label":"2","page":2,"isCurrentPage":false}
      {"label":"3","page":3,"isCurrentPage":false}
      {"label":"4","page":4,"isCurrentPage":false}
      {"label":"5","page":5,"isCurrentPage":false}
      {"label":"6","page":6,"isCurrentPage":false}
      {"label":"7","page":7,"isCurrentPage":false}
      {"label":"8","page":8,"isCurrentPage":false}
      {"label":"9","page":9,"isCurrentPage":false}
      {"label":"10","page":10,"isCurrentPage":false}
      {"label":"11","page":11,"isCurrentPage":false}
      {"label":"12","page":12,"isCurrentPage":false}
      {"label":"13","page":13,"isCurrentPage":false}
      {"label":"14","page":14,"isCurrentPage":false}
      {"label":"15","page":15,"isCurrentPage":false}
      {"label":"16","page":16,"isCurrentPage":false}
      {"label":"17","page":17,"isCurrentPage":false}
      {"label":"18","page":18,"isCurrentPage":false}
      {"label":"19","page":19,"isCurrentPage":false}
      {"label":"next","page":1,"isCurrentPage":false}
      {"label":"last","page":19,"isCurrentPage":false}
      ]
    </div>
  `);
});

test('renders (middle page current)', () => {
  const {container} = render(
    <Pagination
      currentPage={10}
      totalPages={20}
      render={pages => (
        <>
          [
          {pages.map(page => (
            <React.Fragment key={page.label}>
              {JSON.stringify(page)}
            </React.Fragment>
          ))}
          ]
        </>
      )}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"label":"first","page":0,"isCurrentPage":false}
      {"label":"prev","page":9,"isCurrentPage":false}
      {"label":"0","page":0,"isCurrentPage":false}
      {"label":"1","page":1,"isCurrentPage":false}
      {"label":"2","page":2,"isCurrentPage":false}
      {"label":"3","page":3,"isCurrentPage":false}
      {"label":"4","page":4,"isCurrentPage":false}
      {"label":"5","page":5,"isCurrentPage":false}
      {"label":"6","page":6,"isCurrentPage":false}
      {"label":"7","page":7,"isCurrentPage":false}
      {"label":"8","page":8,"isCurrentPage":false}
      {"label":"9","page":9,"isCurrentPage":false}
      {"label":"10","page":10,"isCurrentPage":true}
      {"label":"11","page":11,"isCurrentPage":false}
      {"label":"12","page":12,"isCurrentPage":false}
      {"label":"13","page":13,"isCurrentPage":false}
      {"label":"14","page":14,"isCurrentPage":false}
      {"label":"15","page":15,"isCurrentPage":false}
      {"label":"16","page":16,"isCurrentPage":false}
      {"label":"17","page":17,"isCurrentPage":false}
      {"label":"18","page":18,"isCurrentPage":false}
      {"label":"19","page":19,"isCurrentPage":false}
      {"label":"next","page":11,"isCurrentPage":false}
      {"label":"last","page":19,"isCurrentPage":false}
      ]
    </div>
  `);
});

test('renders (last page current)', () => {
  const {container} = render(
    <Pagination
      currentPage={19}
      totalPages={20}
      render={pages => (
        <>
          [
          {pages.map(page => (
            <React.Fragment key={page.label}>
              {JSON.stringify(page)}
            </React.Fragment>
          ))}
          ]
        </>
      )}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"label":"first","page":0,"isCurrentPage":false}
      {"label":"prev","page":18,"isCurrentPage":false}
      {"label":"0","page":0,"isCurrentPage":false}
      {"label":"1","page":1,"isCurrentPage":false}
      {"label":"2","page":2,"isCurrentPage":false}
      {"label":"3","page":3,"isCurrentPage":false}
      {"label":"4","page":4,"isCurrentPage":false}
      {"label":"5","page":5,"isCurrentPage":false}
      {"label":"6","page":6,"isCurrentPage":false}
      {"label":"7","page":7,"isCurrentPage":false}
      {"label":"8","page":8,"isCurrentPage":false}
      {"label":"9","page":9,"isCurrentPage":false}
      {"label":"10","page":10,"isCurrentPage":false}
      {"label":"11","page":11,"isCurrentPage":false}
      {"label":"12","page":12,"isCurrentPage":false}
      {"label":"13","page":13,"isCurrentPage":false}
      {"label":"14","page":14,"isCurrentPage":false}
      {"label":"15","page":15,"isCurrentPage":false}
      {"label":"16","page":16,"isCurrentPage":false}
      {"label":"17","page":17,"isCurrentPage":false}
      {"label":"18","page":18,"isCurrentPage":false}
      {"label":"19","page":19,"isCurrentPage":true}
      {"label":"next","page":null,"isCurrentPage":false}
      {"label":"last","page":19,"isCurrentPage":true}
      ]
    </div>
  `);
});

test('renders (first page current, size: 7)', () => {
  const {container} = render(
    <Pagination
      currentPage={0}
      totalPages={20}
      size={7}
      render={pages => (
        <>
          [
          {pages.map(page => (
            <React.Fragment key={page.label}>
              {JSON.stringify(page)}
            </React.Fragment>
          ))}
          ]
        </>
      )}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"label":"first","page":0,"isCurrentPage":true}
      {"label":"prev","page":null,"isCurrentPage":false}
      {"label":"0","page":0,"isCurrentPage":true}
      {"label":"1","page":1,"isCurrentPage":false}
      {"label":"2","page":2,"isCurrentPage":false}
      {"label":"3","page":3,"isCurrentPage":false}
      {"label":"4","page":4,"isCurrentPage":false}
      {"label":"5","page":5,"isCurrentPage":false}
      {"label":"6","page":6,"isCurrentPage":false}
      {"label":"next","page":1,"isCurrentPage":false}
      {"label":"last","page":19,"isCurrentPage":false}
      ]
    </div>
  `);
});

test('renders (middle page current, size: 7)', () => {
  const {container} = render(
    <Pagination
      currentPage={10}
      totalPages={20}
      size={7}
      render={pages => (
        <>
          [
          {pages.map(page => (
            <React.Fragment key={page.label}>
              {JSON.stringify(page)}
            </React.Fragment>
          ))}
          ]
        </>
      )}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"label":"first","page":0,"isCurrentPage":false}
      {"label":"prev","page":9,"isCurrentPage":false}
      {"label":"7","page":7,"isCurrentPage":false}
      {"label":"8","page":8,"isCurrentPage":false}
      {"label":"9","page":9,"isCurrentPage":false}
      {"label":"10","page":10,"isCurrentPage":true}
      {"label":"11","page":11,"isCurrentPage":false}
      {"label":"12","page":12,"isCurrentPage":false}
      {"label":"13","page":13,"isCurrentPage":false}
      {"label":"next","page":11,"isCurrentPage":false}
      {"label":"last","page":19,"isCurrentPage":false}
      ]
    </div>
  `);
});

test('renders (last page current, size: 7)', () => {
  const {container} = render(
    <Pagination
      currentPage={19}
      totalPages={20}
      size={7}
      render={pages => (
        <>
          [
          {pages.map(page => (
            <React.Fragment key={page.label}>
              {JSON.stringify(page)}
            </React.Fragment>
          ))}
          ]
        </>
      )}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"label":"first","page":0,"isCurrentPage":false}
      {"label":"prev","page":18,"isCurrentPage":false}
      {"label":"13","page":13,"isCurrentPage":false}
      {"label":"14","page":14,"isCurrentPage":false}
      {"label":"15","page":15,"isCurrentPage":false}
      {"label":"16","page":16,"isCurrentPage":false}
      {"label":"17","page":17,"isCurrentPage":false}
      {"label":"18","page":18,"isCurrentPage":false}
      {"label":"19","page":19,"isCurrentPage":true}
      {"label":"next","page":null,"isCurrentPage":false}
      {"label":"last","page":19,"isCurrentPage":true}
      ]
    </div>
  `);
});

test('renders (0 pages)', () => {
  const {container} = render(
    <Pagination
      currentPage={0}
      totalPages={0}
      render={pages => (
        <>
          [
          {pages.map(page => (
            <React.Fragment key={page.label}>
              {JSON.stringify(page)}
            </React.Fragment>
          ))}
          ]
        </>
      )}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"label":"first","page":null,"isCurrentPage":false}
      {"label":"prev","page":null,"isCurrentPage":false}
      {"label":"next","page":null,"isCurrentPage":false}
      {"label":"last","page":null,"isCurrentPage":false}
      ]
    </div>
  `);
});
