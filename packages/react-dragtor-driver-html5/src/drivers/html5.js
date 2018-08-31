/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'invariant';
import type {
  Driver,
  DropEffect,
  HandlerInterface,
  Point,
  SourceHandler,
  TargetHandler,
} from 'react-dragtor';
import { makePoint, makeStatus } from './makeEvents';

// --- types ---------------------------------------------------------------------------------------

import type { DisconnectFn, DragEventHandler } from './types';

// --- main ----------------------------------------------------------------------------------------

/*
 * The HTML5Driver uses the HTML5 drag and drop api to drive the drag and drop operations. Its main
 * purpose is, to avoid browser quirks and produce a reliably working drag and drop experience.
 */
class HTML5Driver implements Driver {
  currentDragNode: ?HTMLElement;

  lastDropped: ?HTMLElement;

  /*
   * The lastSourcePos is used in places, where we need to send a position, but we don't have a
   * current one: dragend on firefox, disconnectSource. It is set ondragstart and ondrag.
   */
  lastSourcePos: Point;

  lastDropEffect: ?DropEffect;

  /* The element our currentDragNode is currently over */
  isOver: ?HTMLElement;

  /*
   * This is used, to detect 'missing' dragover events (e. g. when a target gets deleted while
   * hovering over it) and generate them.
   */
  expectOver: ?HTMLElement;

  disconnectSourceMap: Map<HTMLElement, DisconnectFn> = new Map();

  disconnectTargetMap: Map<HTMLElement, DisconnectFn> = new Map();

  nodeTargetMap: Map<?HTMLElement, TargetHandler> = new Map();

  nodeSourceMap: Map<?HTMLElement, SourceHandler> = new Map();

  firefoxMode = false;

  /* When we switched to firefox mode and back again, we will not try to switch to firefox again. */
  tryFirefoxMode = true;

  /*
   * In firefox mode, ondrag does not send ondrag events to the handler, because the mouse position
   * is missing in the ondrag event. Instead we store the function generating the ondrag event in
   * the notification property (to bind the target) and call it from the ondragover handler, that is
   * registered on the document in firefox mode (because firefox HAS coordinates in this event).
   */
  notification: ?(Point) => void;

  enableFirefoxMode = () => {
    if (!this.tryFirefoxMode) return;

    this.firefoxMode = true;
    document.addEventListener('dragover', this.onDocumentDragOver);
  };

  disableFirefoxMode = () => {
    this.firefoxMode = false;
    this.notification = undefined;
    this.tryFirefoxMode = false;
    document.removeEventListener('dragover', this.onDocumentDragOver);
  };

  notifyDrag(point: Point, domNode: HTMLElement) {
    this.lastSourcePos = point;
    if (this.isOver) {
      if (this.expectOver) {
        // Missing dragover event. Target has been (re)moved or was left.
        const expectOverHandler = this.nodeTargetMap.get(this.expectOver);
        if (this.isOver && expectOverHandler) {
          expectOverHandler.onDragLeave({ node: this.isOver, ...point });
        }
        this.isOver = undefined;
      }
      this.expectOver = this.isOver;
    }
    const handler = this.nodeSourceMap.get(domNode);
    if (handler) handler.onDrag({ node: domNode, ...point });
  }

  disconnectAll = () => {
    this.currentDragNode = undefined;
    this.lastDropped = undefined;
    this.lastSourcePos = { x: -1, y: -1 };
    this.lastDropEffect = undefined;
    this.isOver = undefined;
    this.expectOver = undefined;
    this.disconnectSourceMap.forEach(disconnect => disconnect());
    this.disconnectTargetMap.forEach(disconnect => disconnect());
    this.nodeTargetMap = new Map();
    this.nodeSourceMap = new Map();
    this.firefoxMode = false;
    this.tryFirefoxMode = true;
    this.notification = undefined;
    this.lastDropEffect = 'none';
  };

  // --- source ------------------------------------------------------------------------------------

  connectSource = (handler: HandlerInterface, domNode: HTMLElement) => {
    invariant(
      domNode instanceof HTMLElement,
      'Connect failed. Only HTMLElements can be connected.',
    );
    invariant(
      !this.disconnectSourceMap.has(domNode),
      'Already connected. A drag source must not be connected more than once.',
    );

    const boundDragStart = this.onDragStart(handler);
    const boundDrag = this.onDrag;
    const boundDragEnd = this.onDragEnd(handler);

    domNode.addEventListener('dragstart', boundDragStart);
    domNode.addEventListener('drag', boundDrag);
    domNode.addEventListener('dragend', boundDragEnd);
    domNode.setAttribute('draggable', 'true');
    const domNodeRef = domNode;
    domNodeRef.style.cursor = 'grab';

    const disconnect = () => {
      domNode.removeEventListener('dragstart', boundDragStart);
      domNode.removeEventListener('drag', boundDrag);
      domNode.removeEventListener('dragend', boundDragEnd);
      domNode.removeAttribute('draggable');
    };
    this.disconnectSourceMap.set(domNode, disconnect);
    this.nodeSourceMap.set(domNode, handler);
  };

  disconnectSource = (handler: HandlerInterface, domNode: HTMLElement) => {
    const domNodeRef = domNode;
    domNodeRef.style.cursor = 'auto';
    const disconnect = this.disconnectSourceMap.get(domNode);
    this.disconnectSourceMap.delete(domNode);
    this.nodeSourceMap.delete(domNode);

    if (this.currentDragNode === domNode) {
      this.currentDragNode = undefined;
      if (this.isOver) {
        this.isOver = undefined;
        this.expectOver = undefined;
        handler.onDragLeave({ node: domNode, ...this.lastSourcePos });
      }
      handler.onDragEnd({ node: domNode, ...this.lastSourcePos });
    }

    if (disconnect) disconnect();
  };

  onDragStart = (handler: HandlerInterface): DragEventHandler => {
    const driver = this;

    return (event) => {
      // To easier support nested drag/drop nodes, we stop propagation.
      event.stopPropagation();

      if (!(event.target instanceof HTMLElement)) {
        event.preventDefault();
        return;
      }

      invariant(!this.currentDragNode, 'Cannot start dragging. Operation in progress.');
      invariant(event.currentTarget instanceof HTMLElement, 'Target must be of type HTMLElement.');
      invariant(event.dataTransfer instanceof DataTransfer, 'DataTransfer must be valid.');

      const { currentTarget, dataTransfer } = event;
      driver.currentDragNode = currentTarget;

      try {
        dataTransfer.setData('application/x-dragtor', '');
      } catch (error) {
        // IE
        dataTransfer.setData('text', '');
      }

      const currentPoint = makePoint(event);
      driver.lastSourcePos = currentPoint;
      dataTransfer.effectAllowed = handler.onDragStart({ node: currentTarget, ...currentPoint });
      currentTarget.style.cursor = 'grabbing';
    };
  };

  onDocumentDragOver = (event: DragEvent) => {
    const currentPoint = makePoint(event);
    if (this.notification) this.notification(currentPoint);
  };

  onDrag = (event: DragEvent) => {
    // On firefox onDrag might be called without calling onDragStart before (dragged selection)
    event.stopPropagation();

    if (!(event.target instanceof HTMLElement)) {
      event.preventDefault();
      return;
    }

    invariant(this.currentDragNode, 'No drag operation in progress');
    invariant(event.currentTarget instanceof HTMLElement, 'Target must be of type HTMLElement.');

    const { currentTarget } = event;
    const currentPoint = makePoint(event);
    if (this.firefoxMode) {
      this.notification = (point: Point) => this.notifyDrag(point, currentTarget);
      // Maybe the first 0, 0 point was a pure coincidence.
      if (currentPoint.x !== 0 || currentPoint.y !== 0) {
        this.disableFirefoxMode();
      }
    } else if (currentPoint.x === 0 && currentPoint.y === 0) {
      this.enableFirefoxMode();
    } else {
      this.notifyDrag(currentPoint, currentTarget);
    }
  };

  onDragEnd = (handler: HandlerInterface): DragEventHandler => (event) => {
    // On firefox onDrag might be called without calling onDragStart before (dragged selection)
    event.stopPropagation();
    if (!(event.target instanceof HTMLElement)) {
      event.preventDefault();
      return;
    }

    invariant(this.currentDragNode, 'No drag operation in progress');

    this.lastDropped = undefined;

    const { target } = event;
    target.style.cursor = 'grab';
    if (this.firefoxMode) {
      handler.onDragEnd({ node: target, ...this.lastSourcePos });
    } else {
      const currentPoint = makePoint(event);
      handler.onDragEnd({ node: target, ...currentPoint });
    }
    this.currentDragNode = undefined;
  };

  // --- target ------------------------------------------------------------------------------------

  connectTarget = (handler: HandlerInterface, domNode: HTMLElement) => {
    invariant(
      !this.disconnectTargetMap.has(domNode),
      'Already connected. A drop target must not be connected more than once.',
    );

    const boundDragOver = this.onDragOver(handler);
    const boundDrop = this.onDrop(handler);

    domNode.addEventListener('dragover', boundDragOver);
    domNode.addEventListener('drop', boundDrop);

    const disconnect = () => {
      domNode.removeEventListener('dragover', boundDragOver);
      domNode.removeEventListener('drop', boundDrop);
    };
    this.disconnectTargetMap.set(domNode, disconnect);
    this.nodeTargetMap.set(domNode, handler);
  };

  disconnectTarget = (handler: HandlerInterface, domNode: HTMLElement) => {
    const disconnect = this.disconnectTargetMap.get(domNode);
    this.disconnectTargetMap.delete(domNode);
    this.nodeTargetMap.delete(domNode);
    if (disconnect) disconnect();
  };

  onDragOver = (handler: HandlerInterface): DragEventHandler => {
    const driver = this;

    return (event) => {
      if (!this.currentDragNode) {
        return;
      }
      event.stopPropagation();

      invariant(event.currentTarget instanceof HTMLElement, 'Target must be of type HTMLElement.');
      invariant(event.dataTransfer, 'Event must have data transfer object.');

      const { currentTarget, dataTransfer } = event;
      if (driver.isOver !== currentTarget) {
        const currentPoint = makePoint(event);
        const isOverHandler = driver.nodeTargetMap.get(driver.isOver);
        if (this.isOver && isOverHandler) {
          isOverHandler.onDragLeave({ node: this.isOver, ...currentPoint });
        }
        handler.onDragEnter({ node: currentTarget, ...currentPoint });
      }
      // $FlowFixMe dataTransfer.effectAllowed is not the correct enum
      this.lastDropEffect = handler.onDragOver({
        node: currentTarget,
        ...makeStatus(event),
        effectAllowed: dataTransfer.effectAllowed,
      });
      driver.isOver = currentTarget;
      driver.expectOver = undefined;

      event.preventDefault();
    };
  };

  onDrop = (handler: HandlerInterface): DragEventHandler => {
    const driver = this;

    return (event) => {
      if (!this.currentDragNode) {
        event.preventDefault();
        return;
      }
      event.stopPropagation();

      invariant(event.currentTarget instanceof HTMLElement, 'Target must be of type HTMLElement.');

      const { currentTarget } = event;

      if (driver.lastDropEffect !== 'none') {
        handler.onDrop({ node: currentTarget, ...makeStatus(event) });
      }

      handler.onDragLeave({ node: currentTarget, ...makePoint(event) });
      driver.lastDropEffect = undefined;
    };
  };
}

export default new HTML5Driver();
