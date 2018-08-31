/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * A driver must implement the following methods:
 * * connectSource(HandlerInterface, HTMLElement): void
 * * connectTarget(HandlerInterface, HTMLElement): void
 * * disconnectSource(HandlerInterface, HTMLElement): void
 * * disconnectTarget(HandlerInterface, HTMLElement): void
 * * disconnectAll(): void
 *
 * It must mimics the behaviour of the HTML5 drag and drop API and call
 * * onDragStart
 * * onDrag
 * * onDragEnd
 * * onDragEnter
 * * onDragOver
 * * onDragLeave
 * * onDrop
 *
 * in the connected handler.
 */
import type { DropEffect } from 'react-dragtor/src/handler/types';

export type DragEventHandler = DragEvent => void;

export type ModifierKeys = {
  altKey?: boolean,
  ctrlKey?: boolean,
  shiftKey?: boolean,
  metaKey?: boolean
};
export type DisconnectFn = () => void;
export type EffectPriority = {
  keys?: ModifierKeys,
  effect: DropEffect
};
export type EffectPriorities = Array<EffectPriority>;
