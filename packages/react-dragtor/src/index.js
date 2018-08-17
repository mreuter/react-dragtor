/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import configureDragtor from './components/Dragtor';
import Handler from './handler/Handler';

import type {
  Driver,
  DropEffect,
  HandlerInterface,
  Point,
  SourceHandler,
  TargetHandler,
  HandlerOptions,
} from './handler/types';

const handlerFactory = <T>(options: HandlerOptions<T>, HandlerClass) => (
  () => new HandlerClass(options)
);

const configureDefaultDragtor = <T>(driver: Driver, options: HandlerOptions<T>) => (
  configureDragtor(driver, handlerFactory(options, Handler))
);

export { configureDefaultDragtor as default, configureDragtor, Handler };

export type {
  Driver, DropEffect, HandlerInterface, Point, SourceHandler, TargetHandler,
};
