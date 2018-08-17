/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/*
 * The Dragtor uses this interface to connect the handler to the driver.
 */
import type { AnyElement } from '../components/types';

export type Point = {
  x: number,
  y: number,
};
export type Dimensions = {
  width: number,
  height: number,
};
export type Edges<T> = {
  top?: T,
  right?: T,
  bottom?: T,
  left?: T,
};

export type EffectAllowed =
  | 'none'
  | 'copy'
  | 'copyLink'
  | 'copyMove'
  | 'link'
  | 'linkMove'
  | 'move'
  | 'all';
export type DropEffect = 'copy' | 'move' | 'link' | 'none';

export type DriverDrag = { node: HTMLElement } & Point;
export type MouseOverStatus = {} & Point & Dimensions;
export type DriverDrop = DriverDrag & {
  mouse: MouseOverStatus,
};
export type DriverDragOver = DriverDrop & {
  effectAllowed: EffectAllowed,
};
export type DriverDragStart = DriverDrag;
export type DriverDragEnd = DriverDrag;
export type DriverDragEnter = DriverDrag;
export type DriverDragLeave = DriverDrag;

// An application using react-dragtor should define an enum type with all possible types T.
export type SourceData<T> = {
  type: T,
  userData: ?Object,
};
export type UserSourceEvent<T> = {
  sourceData: SourceData<T>,
  position: Point,
};
export type UserTargetEvent<T> = UserSourceEvent<T> & {
  target: AnyElement,
};
export type UserTargetEdgeEvent<T> = UserTargetEvent<T> & {
  edges: Edges<boolean>,
};
export type DragSourceOptions<T> = {
  type: T,
  collect?: (?Object) => ?Object,
  onDragStart?: (UserSourceEvent<T>) => ?EffectAllowed,
  onDrag?: (UserSourceEvent<T>) => void,
  onDragEnd?: (UserSourceEvent<T>) => void,
};
export type OverEdge = Edges<boolean>;
export type DropTargetEdgesOptions = Edges<number>;
export type DropTargetOptions<T> = {
  // $FlowFixMe
  types: Array<T>,
  edges?: DropTargetEdgesOptions,
  onDragEnter?: (UserTargetEvent<T>) => void,
  onDragOver?: (UserTargetEdgeEvent<T>) => ?DropEffect,
  onDragLeave?: (UserTargetEvent<T>) => void,
  onDrop?: (UserTargetEdgeEvent<T>) => void,
};

export type PropMapOptions = {
  isOver?: string,
  isOverEdge?: string,
  isDragging?: string,
};
export type HandlerOptions<T> = {
  dragSource?: DragSourceOptions<T>,
  dropTarget?: DropTargetOptions<T>,
  propMap?: PropMapOptions,
};
export type SourceHandler = {
  onDragStart: DriverDragStart => EffectAllowed,
  onDrag: DriverDrag => void,
  onDragEnd: DriverDragEnd => void,
};
export type TargetHandler = {
  onDragEnter: DriverDragEnter => void,
  onDragLeave: DriverDragLeave => void,
  onDragOver: DriverDragOver => DropEffect,
  onDrop: DriverDrop => void,
};
export type CallbackFn = () => void;

export interface HandlerInterface {
  +doesHandleSource: boolean;
  +doesHandleTarget: boolean;
  +props: { [string]: any };
  setDraggingStateCallback(?CallbackFn): void;
  setOverStateCallback(?CallbackFn): void;
  setSourceProps(?{ [string]: any }): void;
  setTarget(AnyElement): void;
  onDragStart(DriverDragStart): EffectAllowed;
  onDrag(DriverDrag): void;
  onDragEnd(DriverDragEnd): void;
  onDragEnter(DriverDragEnter): void;
  onDragLeave(DriverDragLeave): void;
  onDragOver(DriverDragOver): ?DropEffect;
  onDrop(DriverDrop): void;
}

export interface Driver {
  connectSource(HandlerInterface, HTMLElement): void;
  connectTarget(HandlerInterface, HTMLElement): void;
  disconnectSource(HandlerInterface, HTMLElement): void;
  disconnectTarget(HandlerInterface, HTMLElement): void;
}
