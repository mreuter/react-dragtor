/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import Handler from './Handler';

type DraggableType = '@dragtor/TEST';

it('should return true for doesHandleSource, if dragSource is configured', () => {
  const handler: Handler<DraggableType> = new Handler({
    dragSource: { type: '@dragtor/TEST' },
  });
  expect(handler.doesHandleSource).toBeTruthy();
  expect(handler.doesHandleTarget).toBeFalsy();
});

it('should return true for doesHandleTarget, if dropTarget is configured', () => {
  const handler: Handler<DraggableType> = new Handler({
    dropTarget: { types: ['@dragtor/TEST'] },
  });
  expect(handler.doesHandleSource).toBeFalsy();
  expect(handler.doesHandleTarget).toBeTruthy();
});

it('should handle both, if dragSource and dropTarget are configured', () => {
  const handler: Handler<DraggableType> = new Handler({
    dragSource: { type: '@dragtor/TEST' },
    dropTarget: { types: ['@dragtor/TEST'] },
  });

  expect(handler.doesHandleSource).toBeTruthy();
  expect(handler.doesHandleTarget).toBeTruthy();
});

it('should throw error, if dragSource and dropTarget are NOT configured', () => {
  expect(() => {
    const handler = new Handler({});
    expect(handler).toBeDefined();
  }).toThrow();
});

it('should be able to set values for isDragging, isOver and isOverEdge', () => {
  const handler: Handler<DraggableType> = new Handler({
    dragSource: { type: '@dragtor/TEST' },
    dropTarget: { types: ['@dragtor/TEST'] },
  });

  expect(handler.isDragging).toBeFalsy();
  handler.isDragging = true;
  expect(handler.isDragging).toBeTruthy();
  handler.isDragging = false;
  expect(handler.isDragging).toBeFalsy();

  expect(handler.isOver).toBeFalsy();
  handler.isOver = true;
  expect(handler.isOver).toBeTruthy();
  handler.isOver = false;
  expect(handler.isOver).toBeFalsy();

  expect(handler.isOverEdge).toEqual({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });
  handler.isOverEdge = {
    top: true,
    right: false,
    bottom: false,
    left: false,
  };
  expect(handler.isOverEdge).toEqual({
    top: true,
    right: false,
    bottom: false,
    left: false,
  });
  handler.isOverEdge = {
    top: false,
    right: false,
    bottom: false,
    left: true,
  };
  expect(handler.isOverEdge).toEqual({
    top: false,
    right: false,
    bottom: false,
    left: true,
  });
});

it('should call callbacks, if value is changed', () => {
  const handler: Handler<DraggableType> = new Handler({
    dragSource: { type: '@dragtor/TEST' },
    dropTarget: { types: ['@dragtor/TEST'] },
  });
  const draggingCallback = jest.fn();
  const overCallback = jest.fn();
  handler.setDraggingStateCallback(draggingCallback);
  handler.setOverStateCallback(overCallback);

  handler.isDragging = true;
  expect(draggingCallback).toHaveBeenCalledTimes(1);
  handler.isDragging = true;
  expect(draggingCallback).toHaveBeenCalledTimes(1);
  handler.isDragging = false;
  expect(draggingCallback).toHaveBeenCalledTimes(2);

  handler.isOver = true;
  expect(overCallback).toHaveBeenCalledTimes(1);
  handler.isOver = true;
  expect(overCallback).toHaveBeenCalledTimes(1);
  handler.isOver = false;
  expect(overCallback).toHaveBeenCalledTimes(2);
  handler.isOverEdge = {
    top: true,
    right: false,
    bottom: false,
    left: false,
  };
  expect(overCallback).toHaveBeenCalledTimes(3);
  handler.isOverEdge = {
    top: true,
    right: false,
    bottom: false,
    left: false,
  };
  expect(overCallback).toHaveBeenCalledTimes(3);
  handler.isOverEdge = {
    top: false,
    right: false,
    bottom: false,
    left: true,
  };
  expect(overCallback).toHaveBeenCalledTimes(4);
});

it('should return isDragging prop for drag sources', () => {
  const handler: Handler<DraggableType> = new Handler({ dragSource: { type: '@dragtor/TEST' } });

  expect(handler.props).toHaveProperty('isDragging', false);
  expect(handler.props).not.toHaveProperty('isOver');
  expect(handler.props).not.toHaveProperty('isOverEdge');
  handler.isDragging = true;
  expect(handler.props).toHaveProperty('isDragging', true);
});

it('should return isOver and isOverEgde prop for drop target', () => {
  const handler: Handler<DraggableType> = new Handler({
    dropTarget: {
      types: ['@dragtor/TEST'],
      edges: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  });

  expect(handler.props).toHaveProperty('isOver', false);
  expect(handler.props).not.toHaveProperty('isOverEdge');
  expect(handler.props).not.toHaveProperty('isDragging');
  handler.isOver = true;
  expect(handler.props).toHaveProperty('isOver', true);
  handler.isOverEdge = {
    top: false,
    right: false,
    bottom: true,
    left: false,
  };
  expect(handler.props).toHaveProperty('isOverEdge.bottom', true);
});

it('should not have isOverEgde prop for drop target, if edges are not configures', () => {
  const handler: Handler<DraggableType> = new Handler({
    dropTarget: {
      types: ['@dragtor/TEST'],
      edges: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  });

  expect(handler.props).not.toHaveProperty('isOverEdge');
  handler.isOverEdge = {
    top: false,
    right: false,
    bottom: true,
    left: false,
  };
  expect(handler.props).not.toHaveProperty('isOverEdge');
  handler.isOver = true;
  expect(handler.props).toHaveProperty('isOverEdge');
});

it('should only add isOverEdge, if it is over', () => {});

it('should map props according to propMap', () => {
  const handler: Handler<DraggableType> = new Handler({
    dragSource: { type: '@dragtor/TEST' },
    dropTarget: {
      types: ['@dragtor/TEST'],
      edges: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    propMap: {
      isOver: 'wasOver',
      isOverEdge: 'wasOverEdge',
      isDragging: 'wasDragging',
    },
  });

  handler.isOver = true;
  handler.isOverEdge = {
    top: false,
    right: false,
    bottom: true,
    left: false,
  };
  expect(handler.props).not.toHaveProperty('isOver');
  expect(handler.props).not.toHaveProperty('isOverEdge');
  expect(handler.props).not.toHaveProperty('isDragging');

  expect(handler.props).toHaveProperty('wasOver');
  expect(handler.props).toHaveProperty('wasOverEdge');
  expect(handler.props).toHaveProperty('wasDragging');
});

it('should set isDragging to true on drag start and call into drag source', () => {
  const dragSource = { type: '@dragtor/TEST', onDragStart: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dragSource });
  expect(handler.isDragging).toBeFalsy();
  handler.onDragStart({ node, x: 5, y: 7 });
  expect(handler.isDragging).toBeTruthy();
  expect(dragSource.onDragStart).toHaveBeenCalledWith({
    position: { x: 5, y: 7 },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
  });
});

it("should return 'all', if the drag source does not return an allowed effect on drag start", () => {
  const dragSource = { type: '@dragtor/TEST', onDragStart: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dragSource });
  expect(handler.onDragStart({ node, x: 5, y: 7 })).toBe('all');
});

it('should return the value provided by the drag source does on drag start', () => {
  const dragSource = { type: '@dragtor/TEST', onDragStart: jest.fn(() => 'copyMove') };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dragSource });
  expect(handler.onDragStart({ node, x: 5, y: 7 })).toBe('copyMove');
});

it('should call into drag source on drag', () => {
  const dragSource = { type: '@dragtor/TEST', onDrag: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dragSource });
  handler.onDrag({ node, x: 6, y: 8 });
  // Need to be called to cancelAnimationFrame; otherwise we'd need to mock it:
  handler.onDragEnd({ node, x: 6, y: 8 });
  expect(dragSource.onDrag).toHaveBeenCalledWith({
    position: { x: 6, y: 8 },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
  });
});

it('should call into drag source on drag end and set isDragging to false', () => {
  const dragSource = { type: '@dragtor/TEST', onDragEnd: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dragSource });
  handler.isDragging = true;
  expect(handler.isDragging).toBeTruthy();
  handler.onDragEnd({ node, x: 8, y: 10 });
  expect(dragSource.onDragEnd).toHaveBeenCalledWith({
    position: { x: 8, y: 10 },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
  });
  expect(handler.isDragging).toBeFalsy();
});

it('should call into drop target on drag enter and set isOver to true', () => {
  const dropTarget = { types: ['@dragtor/TEST'], onDragEnter: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dropTarget });
  expect(handler.isOver).toBeFalsy();
  handler.onDragEnter({ node, x: 9, y: 11 });
  expect(dropTarget.onDragEnter).toHaveBeenCalledWith({
    position: { x: 9, y: 11 },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
    target: undefined,
  });
  expect(handler.isOver).toBeTruthy();
});

it('should call into drop target on drag leave and set isOver to false (and adjust isOverEdge)', () => {
  const dropTarget = { types: ['@dragtor/TEST'], onDragLeave: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dropTarget });
  handler.isOver = true;
  expect(handler.isOver).toBeTruthy();
  handler.onDragLeave({ node, x: 10, y: 12 });
  expect(dropTarget.onDragLeave).toHaveBeenCalledWith({
    position: { x: 10, y: 12 },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
    target: undefined,
  });
  expect(handler.isOver).toBeFalsy();
});

it('should call into drop target on drag over and set isOverEdge if drag over edge is detected', () => {
  const dropTarget = {
    types: ['@dragtor/TEST'],
    onDragOver: jest.fn(),
    edges: { top: 12, bottom: 12, left: 12 },
  };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dropTarget });

  handler.isOver = true;
  handler.onDragOver({
    node,
    x: 100,
    y: 120,
    mouse: {
      x: 20,
      y: 6,
      width: 100,
      height: 100,
    },
    effectAllowed: 'all',
  });
  expect(dropTarget.onDragOver).toHaveBeenCalledWith({
    position: { x: 100, y: 120 },
    edges: {
      bottom: false,
      left: false,
      right: false,
      top: true,
    },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
    target: undefined,
  });
  expect(handler.isOverEdge).toEqual({
    top: true,
    right: false,
    bottom: false,
    left: false,
  });
  handler.onDragOver({
    node,
    x: 100,
    y: 120,
    mouse: {
      x: 6,
      y: 98,
      width: 100,
      height: 100,
    },
    effectAllowed: 'all',
  });
  expect(handler.isOverEdge).toEqual({
    top: false,
    right: false,
    bottom: true,
    left: true,
  });
});

it('should work without configured edges', () => {
  const dropTarget = { types: ['@dragtor/TEST'], onDragOver: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dropTarget });
  handler.isOver = true;
  handler.onDragOver({
    node,
    x: 100,
    y: 120,
    mouse: {
      x: 20,
      y: 6,
      width: 100,
      height: 100,
    },
    effectAllowed: 'all',
  });
  expect(dropTarget.onDragOver).toHaveBeenCalledWith({
    position: { x: 100, y: 120 },
    edges: {
      bottom: false,
      left: false,
      right: false,
      top: false,
    },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
    target: undefined,
  });
  expect(handler.isOverEdge).toEqual({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });
});

it('should call into drop target on drop and set isOverEdge if drag over edge is detected', () => {
  const dropTarget = { types: ['@dragtor/TEST'], onDrop: jest.fn(), edges: { right: 12 } };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dropTarget });
  handler.isOver = true;
  handler.onDrop({
    node,
    x: 110,
    y: 130,
    mouse: {
      x: 96,
      y: 56,
      width: 100,
      height: 100,
    },
    effectAllowed: 'all',
  });
  expect(dropTarget.onDrop).toHaveBeenCalledWith({
    position: { x: 110, y: 130 },
    edges: {
      bottom: false,
      left: false,
      right: true,
      top: false,
    },
    sourceData: {
      type: '@dragtor/TEST',
      userData: undefined,
    },
    target: undefined,
  });
  expect(handler.isOverEdge).toEqual({
    top: false,
    right: true,
    bottom: false,
    left: false,
  });
});

it('should pass set component props to collect function', () => {
  const dragSource = { type: '@dragtor/TEST', collect: jest.fn() };
  const node = document.createElement('div');
  const handler: Handler<DraggableType> = new Handler({ dragSource });
  // $FlowFixMe
  handler.setSourceProps({ x: 10 });
  handler.onDragStart({ node, x: 10, y: 12 });
  expect(dragSource.collect).toHaveBeenCalledWith({ x: 10 });
});
