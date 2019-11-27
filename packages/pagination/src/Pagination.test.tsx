/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, cleanup} from '@testing-library/react';
import Pagination from './Pagination';

afterEach(cleanup);

test('renders (first page current)', () => {
  const {container} = render(<Pagination currentPage={0} totalPages={20} />);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul
        style="list-style: none; margin: 0px auto;"
      >
        <li
          style="list-style: none; display: inline;"
        >
           
          FIRST
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          PREV
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          0
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/1"
          >
            1
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/2"
          >
            2
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/3"
          >
            3
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/4"
          >
            4
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/5"
          >
            5
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/6"
          >
            6
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/7"
          >
            7
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/8"
          >
            8
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/9"
          >
            9
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/10"
          >
            10
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/11"
          >
            11
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/12"
          >
            12
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/13"
          >
            13
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/14"
          >
            14
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/15"
          >
            15
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/16"
          >
            16
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/17"
          >
            17
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/18"
          >
            18
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/19"
          >
            19
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/1"
          >
            NEXT
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/19"
          >
            LAST
          </a>
           
        </li>
      </ul>
    </div>
  `);
});

test('renders (middle page current)', () => {
  const {container} = render(<Pagination currentPage={10} totalPages={20} />);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul
        style="list-style: none; margin: 0px auto;"
      >
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/0"
          >
            FIRST
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/9"
          >
            PREV
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/0"
          >
            0
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/1"
          >
            1
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/2"
          >
            2
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/3"
          >
            3
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/4"
          >
            4
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/5"
          >
            5
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/6"
          >
            6
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/7"
          >
            7
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/8"
          >
            8
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/9"
          >
            9
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          10
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/11"
          >
            11
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/12"
          >
            12
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/13"
          >
            13
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/14"
          >
            14
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/15"
          >
            15
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/16"
          >
            16
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/17"
          >
            17
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/18"
          >
            18
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/19"
          >
            19
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/11"
          >
            NEXT
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/19"
          >
            LAST
          </a>
           
        </li>
      </ul>
    </div>
  `);
});

test('renders (last page current)', () => {
  const {container} = render(<Pagination currentPage={19} totalPages={20} />);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul
        style="list-style: none; margin: 0px auto;"
      >
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/0"
          >
            FIRST
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/18"
          >
            PREV
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/0"
          >
            0
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/1"
          >
            1
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/2"
          >
            2
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/3"
          >
            3
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/4"
          >
            4
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/5"
          >
            5
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/6"
          >
            6
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/7"
          >
            7
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/8"
          >
            8
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/9"
          >
            9
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/10"
          >
            10
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/11"
          >
            11
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/12"
          >
            12
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/13"
          >
            13
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/14"
          >
            14
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/15"
          >
            15
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/16"
          >
            16
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/17"
          >
            17
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/18"
          >
            18
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          19
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          NEXT
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          LAST
           
        </li>
      </ul>
    </div>
  `);
});

test('renders (first page current, size: 7)', () => {
  const {container} = render(
    <Pagination currentPage={0} totalPages={20} size={7} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul
        style="list-style: none; margin: 0px auto;"
      >
        <li
          style="list-style: none; display: inline;"
        >
           
          FIRST
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          PREV
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          0
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/1"
          >
            1
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/2"
          >
            2
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/3"
          >
            3
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/4"
          >
            4
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/5"
          >
            5
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/6"
          >
            6
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/1"
          >
            NEXT
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/19"
          >
            LAST
          </a>
           
        </li>
      </ul>
    </div>
  `);
});

test('renders (middle page current, size: 7)', () => {
  const {container} = render(
    <Pagination currentPage={10} totalPages={20} size={7} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul
        style="list-style: none; margin: 0px auto;"
      >
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/0"
          >
            FIRST
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/9"
          >
            PREV
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/7"
          >
            7
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/8"
          >
            8
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/9"
          >
            9
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          10
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/11"
          >
            11
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/12"
          >
            12
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/13"
          >
            13
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/11"
          >
            NEXT
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/19"
          >
            LAST
          </a>
           
        </li>
      </ul>
    </div>
  `);
});

test('renders (last page current, size: 7)', () => {
  const {container} = render(
    <Pagination currentPage={19} totalPages={20} size={7} />,
  );

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul
        style="list-style: none; margin: 0px auto;"
      >
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/0"
          >
            FIRST
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/18"
          >
            PREV
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/13"
          >
            13
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/14"
          >
            14
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/15"
          >
            15
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/16"
          >
            16
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/17"
          >
            17
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          <a
            href="/18"
          >
            18
          </a>
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          19
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          NEXT
           
        </li>
        <li
          style="list-style: none; display: inline;"
        >
           
          LAST
           
        </li>
      </ul>
    </div>
  `);
});

test('renders (0 pages)', () => {
  const {container} = render(<Pagination currentPage={0} totalPages={0} />);

  expect(container).toMatchInlineSnapshot(`
    <div>
      <ul
        style="list-style: none; margin: 0px auto;"
      />
    </div>
  `);
});
