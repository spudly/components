/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, cleanup} from '@testing-library/react';
import Pagination from './Pagination';
import {PageDescriptor} from './types';

const renderProp = (pages: Array<PageDescriptor>) => (
  <>
    [
    {pages.map(descriptor => (
      <React.Fragment key={`${descriptor.type}-${descriptor.page}`}>
        {JSON.stringify(descriptor)}
      </React.Fragment>
    ))}
    ]
  </>
);

afterEach(cleanup);

test('renders (first page current)', () => {
  const {container} = render(
    <Pagination currentPage={0} totalPages={20} render={renderProp} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"type":"FIRST","page":0,"isCurrentPage":true}
      {"type":"PREV","page":null,"isCurrentPage":false}
      {"type":"NUMBER","page":0,"isCurrentPage":true}
      {"type":"NUMBER","page":1,"isCurrentPage":false}
      {"type":"NUMBER","page":2,"isCurrentPage":false}
      {"type":"NUMBER","page":3,"isCurrentPage":false}
      {"type":"NUMBER","page":4,"isCurrentPage":false}
      {"type":"NUMBER","page":5,"isCurrentPage":false}
      {"type":"NUMBER","page":6,"isCurrentPage":false}
      {"type":"NUMBER","page":7,"isCurrentPage":false}
      {"type":"NUMBER","page":8,"isCurrentPage":false}
      {"type":"NUMBER","page":9,"isCurrentPage":false}
      {"type":"NUMBER","page":10,"isCurrentPage":false}
      {"type":"NUMBER","page":11,"isCurrentPage":false}
      {"type":"NUMBER","page":12,"isCurrentPage":false}
      {"type":"NUMBER","page":13,"isCurrentPage":false}
      {"type":"NUMBER","page":14,"isCurrentPage":false}
      {"type":"NUMBER","page":15,"isCurrentPage":false}
      {"type":"NUMBER","page":16,"isCurrentPage":false}
      {"type":"NUMBER","page":17,"isCurrentPage":false}
      {"type":"NUMBER","page":18,"isCurrentPage":false}
      {"type":"NUMBER","page":19,"isCurrentPage":false}
      {"type":"NEXT","page":1,"isCurrentPage":false}
      {"type":"LAST","page":19,"isCurrentPage":false}
      ]
    </div>
  `);
});

test('renders (middle page current)', () => {
  const {container} = render(
    <Pagination currentPage={10} totalPages={20} render={renderProp} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"type":"FIRST","page":0,"isCurrentPage":false}
      {"type":"PREV","page":9,"isCurrentPage":false}
      {"type":"NUMBER","page":0,"isCurrentPage":false}
      {"type":"NUMBER","page":1,"isCurrentPage":false}
      {"type":"NUMBER","page":2,"isCurrentPage":false}
      {"type":"NUMBER","page":3,"isCurrentPage":false}
      {"type":"NUMBER","page":4,"isCurrentPage":false}
      {"type":"NUMBER","page":5,"isCurrentPage":false}
      {"type":"NUMBER","page":6,"isCurrentPage":false}
      {"type":"NUMBER","page":7,"isCurrentPage":false}
      {"type":"NUMBER","page":8,"isCurrentPage":false}
      {"type":"NUMBER","page":9,"isCurrentPage":false}
      {"type":"NUMBER","page":10,"isCurrentPage":true}
      {"type":"NUMBER","page":11,"isCurrentPage":false}
      {"type":"NUMBER","page":12,"isCurrentPage":false}
      {"type":"NUMBER","page":13,"isCurrentPage":false}
      {"type":"NUMBER","page":14,"isCurrentPage":false}
      {"type":"NUMBER","page":15,"isCurrentPage":false}
      {"type":"NUMBER","page":16,"isCurrentPage":false}
      {"type":"NUMBER","page":17,"isCurrentPage":false}
      {"type":"NUMBER","page":18,"isCurrentPage":false}
      {"type":"NUMBER","page":19,"isCurrentPage":false}
      {"type":"NEXT","page":11,"isCurrentPage":false}
      {"type":"LAST","page":19,"isCurrentPage":false}
      ]
    </div>
  `);
});

test('renders (last page current)', () => {
  const {container} = render(
    <Pagination currentPage={19} totalPages={20} render={renderProp} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"type":"FIRST","page":0,"isCurrentPage":false}
      {"type":"PREV","page":18,"isCurrentPage":false}
      {"type":"NUMBER","page":0,"isCurrentPage":false}
      {"type":"NUMBER","page":1,"isCurrentPage":false}
      {"type":"NUMBER","page":2,"isCurrentPage":false}
      {"type":"NUMBER","page":3,"isCurrentPage":false}
      {"type":"NUMBER","page":4,"isCurrentPage":false}
      {"type":"NUMBER","page":5,"isCurrentPage":false}
      {"type":"NUMBER","page":6,"isCurrentPage":false}
      {"type":"NUMBER","page":7,"isCurrentPage":false}
      {"type":"NUMBER","page":8,"isCurrentPage":false}
      {"type":"NUMBER","page":9,"isCurrentPage":false}
      {"type":"NUMBER","page":10,"isCurrentPage":false}
      {"type":"NUMBER","page":11,"isCurrentPage":false}
      {"type":"NUMBER","page":12,"isCurrentPage":false}
      {"type":"NUMBER","page":13,"isCurrentPage":false}
      {"type":"NUMBER","page":14,"isCurrentPage":false}
      {"type":"NUMBER","page":15,"isCurrentPage":false}
      {"type":"NUMBER","page":16,"isCurrentPage":false}
      {"type":"NUMBER","page":17,"isCurrentPage":false}
      {"type":"NUMBER","page":18,"isCurrentPage":false}
      {"type":"NUMBER","page":19,"isCurrentPage":true}
      {"type":"NEXT","page":null,"isCurrentPage":false}
      {"type":"LAST","page":19,"isCurrentPage":true}
      ]
    </div>
  `);
});

test('renders (first page current, size: 7)', () => {
  const {container} = render(
    <Pagination currentPage={0} totalPages={20} size={7} render={renderProp} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"type":"FIRST","page":0,"isCurrentPage":true}
      {"type":"PREV","page":null,"isCurrentPage":false}
      {"type":"NUMBER","page":0,"isCurrentPage":true}
      {"type":"NUMBER","page":1,"isCurrentPage":false}
      {"type":"NUMBER","page":2,"isCurrentPage":false}
      {"type":"NUMBER","page":3,"isCurrentPage":false}
      {"type":"NUMBER","page":4,"isCurrentPage":false}
      {"type":"NUMBER","page":5,"isCurrentPage":false}
      {"type":"NUMBER","page":6,"isCurrentPage":false}
      {"type":"NEXT","page":1,"isCurrentPage":false}
      {"type":"LAST","page":19,"isCurrentPage":false}
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
      render={renderProp}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"type":"FIRST","page":0,"isCurrentPage":false}
      {"type":"PREV","page":9,"isCurrentPage":false}
      {"type":"NUMBER","page":7,"isCurrentPage":false}
      {"type":"NUMBER","page":8,"isCurrentPage":false}
      {"type":"NUMBER","page":9,"isCurrentPage":false}
      {"type":"NUMBER","page":10,"isCurrentPage":true}
      {"type":"NUMBER","page":11,"isCurrentPage":false}
      {"type":"NUMBER","page":12,"isCurrentPage":false}
      {"type":"NUMBER","page":13,"isCurrentPage":false}
      {"type":"NEXT","page":11,"isCurrentPage":false}
      {"type":"LAST","page":19,"isCurrentPage":false}
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
      render={renderProp}
    />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"type":"FIRST","page":0,"isCurrentPage":false}
      {"type":"PREV","page":18,"isCurrentPage":false}
      {"type":"NUMBER","page":13,"isCurrentPage":false}
      {"type":"NUMBER","page":14,"isCurrentPage":false}
      {"type":"NUMBER","page":15,"isCurrentPage":false}
      {"type":"NUMBER","page":16,"isCurrentPage":false}
      {"type":"NUMBER","page":17,"isCurrentPage":false}
      {"type":"NUMBER","page":18,"isCurrentPage":false}
      {"type":"NUMBER","page":19,"isCurrentPage":true}
      {"type":"NEXT","page":null,"isCurrentPage":false}
      {"type":"LAST","page":19,"isCurrentPage":true}
      ]
    </div>
  `);
});

test('renders (0 pages)', () => {
  const {container} = render(
    <Pagination currentPage={0} totalPages={0} render={renderProp} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      [
      {"type":"FIRST","page":null,"isCurrentPage":false}
      {"type":"PREV","page":null,"isCurrentPage":false}
      {"type":"NEXT","page":null,"isCurrentPage":false}
      {"type":"LAST","page":null,"isCurrentPage":false}
      ]
    </div>
  `);
});
