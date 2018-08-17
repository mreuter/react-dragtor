/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'invariant';

// --- types ---------------------------------------------------------------------------------------

import type {
  CallbackFn,
  DriverDrag,
  DriverDragEnd,
  DriverDragEnter,
  DriverDragLeave,
  DriverDragOver,
  DriverDragStart,
  DriverDrop,
  HandlerOptions,
  MouseOverStatus,
  OverEdge,
  DropEffect,
  HandlerInterface,
  DragSourceOptions,
  DropTargetOptions,
  UserSourceEvent,
  EffectAllowed,
  UserTargetEvent,
  UserTargetEdgeEvent,
  SourceData,
} from './types';
import type { AnyElement } from '../components/types';

// --- helpers -------------------------------------------------------------------------------------

type EmptyObject = {
  collect?: Function,
  onDragStart?: Function,
  onDrag?: Function,
  onDragEnd?: Function,
  onDragEnter?: Function,
  onDragOver?: Function,
  onDragLeave?: Function,
  onDrop?: Function,
};

const edgeDragEqual = (v1, v2) => (
  v1.top === v2.top && v1.right === v2.right && v1.bottom === v2.bottom && v1.left === v2.left
);

const dropEffectTargetTypes = (targetTypes) => {
  if (Array.isArray(targetTypes)) {
    return targetTypes;
  }
  if (typeof targetTypes === 'string') {
    return [targetTypes];
  }
  if (typeof targetTypes === 'object') {
    return Object.keys(targetTypes);
  }
  if (!targetTypes) {
    return [];
  }

  throw new Error('Invalid types for drop target.');
};

const calculateDropEffect = (sourceType, targetTypes) => {
  const tT = dropEffectTargetTypes(targetTypes);

  if (tT.indexOf(sourceType) === -1) return 'none';

  if (typeof targetTypes === 'object' && !Array.isArray(targetTypes)) {
    return targetTypes[sourceType];
  }
  return 'copy';
};

// --- main ----------------------------------------------------------------------------------------

class Handler<T> implements HandlerInterface {
  static dragData: SourceData<T>;

  options: HandlerOptions<T>;

  sourceProps: ?{ [string]: any };

  target: AnyElement;

  dragging: boolean = false;

  over: boolean = false;

  overEdge: OverEdge = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  };

  draggingStateCallback: ?CallbackFn;

  overStateCallback: ?CallbackFn;

  dropEffect: DropEffect;

  get isDragging(): boolean {
    return this.dragging;
  }

  set isDragging(value: boolean) {
    const updateRequired = this.dragging !== value;
    this.dragging = value;
    if (updateRequired && this.draggingStateCallback) this.draggingStateCallback();
  }

  get isOver(): boolean {
    return this.over;
  }

  set isOver(value: boolean) {
    const updateRequired = this.over !== value;
    this.over = value;
    if (updateRequired && this.overStateCallback) this.overStateCallback();
  }

  get isOverEdge(): OverEdge {
    return this.overEdge;
  }

  set isOverEdge(value: OverEdge) {
    const updateRequired = !edgeDragEqual(this.overEdge, value);
    this.overEdge = value;
    if (updateRequired && this.overStateCallback) this.overStateCallback();
  }

  constructor(options: HandlerOptions<T>) {
    // TODO: validate options
    invariant(
      options.dragSource || options.dropTarget,
      'dragSource and/or dropTarget must be configured.',
    );
    this.options = options;
    (this: any).checkDragSource = this.checkDragSource.bind(this);
    (this: any).checkDropTarget = this.checkDropTarget.bind(this);
  }

  checkDragSource(): DragSourceOptions<T> | EmptyObject {
    return (this.options && this.options.dragSource) || {};
  }

  checkDropTarget(): DropTargetOptions<T> | EmptyObject {
    return (this.options && this.options.dropTarget) || {};
  }

  checkCollect = (): ((?Object) => ?Object) => (
    this.checkDragSource().collect || (() => undefined)
  );

  checkOnDragStart(): ((UserSourceEvent<T>) => ?EffectAllowed) {
    return this.checkDragSource().onDragStart || (() => undefined);
  }

  checkOnDrag(): ((UserSourceEvent<T>) => void) {
    return this.checkDragSource().onDrag || (() => undefined);
  }

  checkOnDragEnd(): ((UserSourceEvent<T>) => void) {
    return this.checkDragSource().onDragEnd || (() => undefined);
  }

  checkOnDrop(): ((UserTargetEdgeEvent<T>) => void) {
    return this.checkDropTarget().onDrop || (() => undefined);
  }

  checkOnDragEnter(): ((UserTargetEvent<T>) => void) {
    return this.checkDropTarget().onDragEnter || (() => undefined);
  }

  checkOnDragOver(): ((UserTargetEdgeEvent<T>) => ?DropEffect) {
    return this.checkDropTarget().onDragOver || (() => undefined);
  }

  checkOnDragLeave(): ((UserTargetEvent<T>) => void) {
    return this.checkDropTarget().onDragLeave || (() => undefined);
  }

  get doesHandleSource() {
    return !!this.options.dragSource;
  }

  get doesHandleTarget() {
    return !!this.options.dropTarget;
  }

  get props() {
    const isDragging = this.doesHandleSource
      ? {
        [(this.options.propMap && this.options.propMap.isDragging) || 'isDragging']: this
          .isDragging,
      }
      : {};
    const isOver = this.doesHandleTarget
      ? { [(this.options.propMap && this.options.propMap.isOver) || 'isOver']: this.isOver }
      : {};
    const isOverEdge = this.isOver && !!this.options.dropTarget && !!this.options.dropTarget.edges
      ? {
        [(this.options.propMap && this.options.propMap.isOverEdge) || 'isOverEdge']: this
          .isOverEdge,
      }
      : {};
    return {
      ...isDragging,
      ...isOver,
      ...isOverEdge,
    };
  }

  setDraggingStateCallback = (fn: ?CallbackFn) => {
    this.draggingStateCallback = fn;
  };

  setOverStateCallback = (fn: ?CallbackFn) => {
    this.overStateCallback = fn;
  };

  setSourceProps = (props: ?{ [string]: any }) => {
    this.sourceProps = props;
  };

  setTarget = (target: AnyElement) => {
    this.target = target;
  };

  detectDragOverEdge = ({
    x, y, width, height,
  }: MouseOverStatus) => {
    if (!(this.options.dropTarget && this.options.dropTarget.edges)) return undefined;

    this.isOverEdge = {
      top: y < (this.options.dropTarget.edges.top || 0),
      right: x > width - (this.options.dropTarget.edges.right || 0),
      bottom: y > height - (this.options.dropTarget.edges.bottom || 0),
      left: x < (this.options.dropTarget.edges.left || 0),
    };
    return this.isOverEdge;
  };

  onDragStart = (event: DriverDragStart) => {
    this.isDragging = true;
    const userData = this.checkCollect()(this.sourceProps);
    const type = this.options.dragSource && this.options.dragSource.type;
    Handler.dragData = { type, userData };
    const { x, y } = event;
    return this.checkOnDragStart()({ position: { x, y }, sourceData: Handler.dragData }) || 'all';
  };

  onDrag = (event: DriverDrag) => {
    const { x, y } = event;
    return this.checkOnDrag()({ position: { x, y }, sourceData: Handler.dragData });
  };

  onDragEnd = (event: DriverDragEnd) => {
    const { x, y } = event;
    this.checkOnDragEnd()({ position: { x, y }, sourceData: Handler.dragData });
    this.isDragging = false;
  };

  onDragEnter = (event: DriverDragEnter) => {
    const calculatedDropEffect = calculateDropEffect(
      Handler.dragData.type,
      this.options.dropTarget && this.options.dropTarget.types,
    );
    const { x, y } = event;

    this.dropEffect = this.checkOnDragEnter()({
      position: { x, y },
      sourceData: Handler.dragData,
      target: this.target,
    }) || calculatedDropEffect;
    if (this.dropEffect !== 'none') {
      this.isOver = true;
    }
  };

  onDragLeave = (event: DriverDragLeave) => {
    const { x, y } = event;
    this.checkOnDragLeave()({
      position: { x, y },
      sourceData: Handler.dragData,
      target: this.target,
    });
    this.isOverEdge = {
      top: false,
      right: false,
      bottom: false,
      left: false,
    };
    this.isOver = false;
  };

  onDragOver = (event: DriverDragOver) => {
    this.detectDragOverEdge(event.mouse);
    const { x, y } = event;
    this.checkOnDragOver()({
      position: { x, y },
      sourceData: Handler.dragData,
      target: this.target,
      edges: this.isOverEdge,
    });
    return this.dropEffect;
  };

  onDrop = (event: DriverDrop) => {
    this.detectDragOverEdge(event.mouse);
    const { x, y } = event;
    this.checkOnDrop()({
      position: { x, y },
      sourceData: Handler.dragData,
      target: this.target,
      edges: this.isOverEdge,
    });
  };
}

export default Handler;
