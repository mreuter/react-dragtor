/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'invariant';

const makePoint = (event: DragEvent) => {
  const { clientX: x, clientY: y } = event;
  return { x, y };
};

const makeStatus = (event: DragEvent) => {
  invariant(event.currentTarget instanceof HTMLElement, 'target must be of type HTMLElement');

  const {
    clientX: x, clientY: y, currentTarget, ctrlKey, shiftKey, altKey, metaKey,
  } = event;
  const {
    top, left, width, height,
  } = currentTarget.getBoundingClientRect();
  return {
    x,
    y,
    mouse: {
      x: x - left,
      y: y - top,
      width,
      height,
    },
    keys: {
      ctrlKey,
      shiftKey,
      altKey,
      metaKey,
    },
  };
};

export { makePoint, makeStatus };
