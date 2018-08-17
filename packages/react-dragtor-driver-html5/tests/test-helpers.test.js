/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import DomBuilder from './test-helpers';
import 'jest-dom/extend-expect';

it('should build dom objects with attributes', () => {
  const builder = new DomBuilder(document);

  const link = builder
    .element('a')
    .attributes({ href: 'http://localhost/' })
    .text('Click me!')
    .end()
    .get();

  expect(link instanceof HTMLAnchorElement).toBeTruthy();
  expect(link.tagName).toBe('A');
  expect(link).toHaveAttribute('href', 'http://localhost/');
  expect(link).toHaveTextContent('Click me!');
});

it('should nest dom objects', () => {
  const builder = new DomBuilder(document);

  const nestedSpan = builder
    .element('div')
    .element('span')
    .text('Nested Text')
    .end()
    .end()
    .get();

  expect(nestedSpan instanceof HTMLDivElement).toBeTruthy();
  expect(nestedSpan.querySelector('span')).toHaveTextContent('Nested Text');
});

it('should be able to automatically add elements to the DOM', () => {
  const builder = new DomBuilder(document);

  const divWithClass = builder
    .element('div')
    .className('my-div')
    .text('Inside my div')
    .end(true)
    .get();

  expect(divWithClass instanceof HTMLDivElement).toBeTruthy();
  expect(divWithClass).toHaveClass('my-div');
  // $FlowFixMe library definition seems to be outdated
  expect(divWithClass).toBeInTheDocument();
});

it('should do nothing when starting with a test element', () => {
  const builder = new DomBuilder(document);
  const text = builder
    .text('My Text')
    .end()
    .get();

  expect(text).toBe(undefined);
});
