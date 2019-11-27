/**
 * @jest-environment jsdom
 **/
import React from 'react';
import {render, cleanup} from '@testing-library/react';
import * as icons from '.';

afterEach(cleanup);

(Object.keys(icons) as Array<keyof typeof icons>).forEach(name => {
  describe(name, () => {
    const Icon = icons[name];
    test('renders', () => {
      expect(() => render(<Icon />)).not.toThrow();
    });
  });
});
