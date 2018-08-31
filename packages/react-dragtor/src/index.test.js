/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as Index from './index';
import type { Driver } from './handler/types';

class TestDriver implements Driver {
  connectSource = jest.fn();

  connectTarget = jest.fn();

  disconnectSource = jest.fn();

  disconnectTarget = jest.fn();
}

jest.mock('./handler/Handler', () => jest.fn());
jest.mock('./components/Dragtor', () => jest.fn());

it('should export stuff', () => {
  expect(Index).toHaveProperty('Handler');
  expect(Index).toHaveProperty('configureDragtor');
  expect(Index).toHaveProperty('default');
});

it('should configure default dragtor with passed driver and new standard handler', () => {
  const configureDefaultDragtor = Index.default;
  const options = { x: 1 };
  const driver = new TestDriver();
  configureDefaultDragtor(driver, options);
  expect(Index.configureDragtor).toHaveBeenCalledWith(driver, expect.any(Function));
  // $FlowFixMe
  const factory = Index.configureDragtor.mock.calls[0][1];
  factory();
  expect(Index.Handler).toHaveBeenCalledWith(options);
});
