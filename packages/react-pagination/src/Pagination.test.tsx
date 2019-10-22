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
            <React.Fragment key={page.type}>
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
      {"type":"first","page":0,"isCurrentPage":true}
      {"type":"prev","page":null,"isCurrentPage":false}
      {"type":"0","page":0,"isCurrentPage":true}
      {"type":"1","page":1,"isCurrentPage":false}
      {"type":"2","page":2,"isCurrentPage":false}
      {"type":"3","page":3,"isCurrentPage":false}
      {"type":"4","page":4,"isCurrentPage":false}
      {"type":"5","page":5,"isCurrentPage":false}
      {"type":"6","page":6,"isCurrentPage":false}
      {"type":"7","page":7,"isCurrentPage":false}
      {"type":"8","page":8,"isCurrentPage":false}
      {"type":"9","page":9,"isCurrentPage":false}
      {"type":"10","page":10,"isCurrentPage":false}
      {"type":"11","page":11,"isCurrentPage":false}
      {"type":"12","page":12,"isCurrentPage":false}
      {"type":"13","page":13,"isCurrentPage":false}
      {"type":"14","page":14,"isCurrentPage":false}
      {"type":"15","page":15,"isCurrentPage":false}
      {"type":"16","page":16,"isCurrentPage":false}
      {"type":"17","page":17,"isCurrentPage":false}
      {"type":"18","page":18,"isCurrentPage":false}
      {"type":"19","page":19,"isCurrentPage":false}
      {"type":"next","page":1,"isCurrentPage":false}
      {"type":"last","page":19,"isCurrentPage":false}
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
            <React.Fragment key={page.type}>
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
      {"type":"first","page":0,"isCurrentPage":false}
      {"type":"prev","page":9,"isCurrentPage":false}
      {"type":"0","page":0,"isCurrentPage":false}
      {"type":"1","page":1,"isCurrentPage":false}
      {"type":"2","page":2,"isCurrentPage":false}
      {"type":"3","page":3,"isCurrentPage":false}
      {"type":"4","page":4,"isCurrentPage":false}
      {"type":"5","page":5,"isCurrentPage":false}
      {"type":"6","page":6,"isCurrentPage":false}
      {"type":"7","page":7,"isCurrentPage":false}
      {"type":"8","page":8,"isCurrentPage":false}
      {"type":"9","page":9,"isCurrentPage":false}
      {"type":"10","page":10,"isCurrentPage":true}
      {"type":"11","page":11,"isCurrentPage":false}
      {"type":"12","page":12,"isCurrentPage":false}
      {"type":"13","page":13,"isCurrentPage":false}
      {"type":"14","page":14,"isCurrentPage":false}
      {"type":"15","page":15,"isCurrentPage":false}
      {"type":"16","page":16,"isCurrentPage":false}
      {"type":"17","page":17,"isCurrentPage":false}
      {"type":"18","page":18,"isCurrentPage":false}
      {"type":"19","page":19,"isCurrentPage":false}
      {"type":"next","page":11,"isCurrentPage":false}
      {"type":"last","page":19,"isCurrentPage":false}
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
            <React.Fragment key={page.type}>
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
      {"type":"first","page":0,"isCurrentPage":false}
      {"type":"prev","page":18,"isCurrentPage":false}
      {"type":"0","page":0,"isCurrentPage":false}
      {"type":"1","page":1,"isCurrentPage":false}
      {"type":"2","page":2,"isCurrentPage":false}
      {"type":"3","page":3,"isCurrentPage":false}
      {"type":"4","page":4,"isCurrentPage":false}
      {"type":"5","page":5,"isCurrentPage":false}
      {"type":"6","page":6,"isCurrentPage":false}
      {"type":"7","page":7,"isCurrentPage":false}
      {"type":"8","page":8,"isCurrentPage":false}
      {"type":"9","page":9,"isCurrentPage":false}
      {"type":"10","page":10,"isCurrentPage":false}
      {"type":"11","page":11,"isCurrentPage":false}
      {"type":"12","page":12,"isCurrentPage":false}
      {"type":"13","page":13,"isCurrentPage":false}
      {"type":"14","page":14,"isCurrentPage":false}
      {"type":"15","page":15,"isCurrentPage":false}
      {"type":"16","page":16,"isCurrentPage":false}
      {"type":"17","page":17,"isCurrentPage":false}
      {"type":"18","page":18,"isCurrentPage":false}
      {"type":"19","page":19,"isCurrentPage":true}
      {"type":"next","page":null,"isCurrentPage":false}
      {"type":"last","page":19,"isCurrentPage":true}
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
            <React.Fragment key={page.type}>
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
      {"type":"first","page":0,"isCurrentPage":true}
      {"type":"prev","page":null,"isCurrentPage":false}
      {"type":"0","page":0,"isCurrentPage":true}
      {"type":"1","page":1,"isCurrentPage":false}
      {"type":"2","page":2,"isCurrentPage":false}
      {"type":"3","page":3,"isCurrentPage":false}
      {"type":"4","page":4,"isCurrentPage":false}
      {"type":"5","page":5,"isCurrentPage":false}
      {"type":"6","page":6,"isCurrentPage":false}
      {"type":"next","page":1,"isCurrentPage":false}
      {"type":"last","page":19,"isCurrentPage":false}
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
            <React.Fragment key={page.type}>
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
      {"type":"first","page":0,"isCurrentPage":false}
      {"type":"prev","page":9,"isCurrentPage":false}
      {"type":"7","page":7,"isCurrentPage":false}
      {"type":"8","page":8,"isCurrentPage":false}
      {"type":"9","page":9,"isCurrentPage":false}
      {"type":"10","page":10,"isCurrentPage":true}
      {"type":"11","page":11,"isCurrentPage":false}
      {"type":"12","page":12,"isCurrentPage":false}
      {"type":"13","page":13,"isCurrentPage":false}
      {"type":"next","page":11,"isCurrentPage":false}
      {"type":"last","page":19,"isCurrentPage":false}
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
            <React.Fragment key={page.type}>
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
      {"type":"first","page":0,"isCurrentPage":false}
      {"type":"prev","page":18,"isCurrentPage":false}
      {"type":"13","page":13,"isCurrentPage":false}
      {"type":"14","page":14,"isCurrentPage":false}
      {"type":"15","page":15,"isCurrentPage":false}
      {"type":"16","page":16,"isCurrentPage":false}
      {"type":"17","page":17,"isCurrentPage":false}
      {"type":"18","page":18,"isCurrentPage":false}
      {"type":"19","page":19,"isCurrentPage":true}
      {"type":"next","page":null,"isCurrentPage":false}
      {"type":"last","page":19,"isCurrentPage":true}
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
            <React.Fragment key={page.type}>
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
      {"type":"first","page":null,"isCurrentPage":false}
      {"type":"prev","page":null,"isCurrentPage":false}
      {"type":"next","page":null,"isCurrentPage":false}
      {"type":"last","page":null,"isCurrentPage":false}
      ]
    </div>
  `);
});
