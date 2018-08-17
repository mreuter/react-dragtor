/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import alive from './index';

it('should export "I am alive"', () => {
  expect(alive).toBe('I am alive');
});
