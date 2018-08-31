/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import 'jest-dom/extend-expect';
import type { HandlerInterface } from 'react-dragtor';
import driver from './html5';
import DomBuilder from '../../tests/test-helpers';

// --- types ---------------------------------------------------------------------------------------

// --- helpers and mocks ---------------------------------------------------------------------------

const testCore: HandlerInterface = {
  onDrag: jest.fn(),
  onDragEnd: jest.fn(),
  onDragEnter: jest.fn(),
  onDragLeave: jest.fn(),
  onDragOver: jest.fn(),
  onDragStart: jest.fn(() => 'all'),
  onDrop: jest.fn(),
  doesHandleTarget: true,
  doesHandleSource: true,
  props: {},
  setDraggingStateCallback: jest.fn(),
  setOverStateCallback: jest.fn(),
  setComponent: jest.fn(),
};

class DataTransfer {
  effectAllowed = undefined;

  setData() {} // eslint-disable-line class-methods-use-this
}
window.DataTransfer = DataTransfer;

const dataTransfer = new DataTransfer();
const spySetData = jest.spyOn(dataTransfer, 'setData');

const clearMocks = () => {
  Object.values(testCore).forEach(fn => typeof fn === 'function' && fn.mockClear());
  spySetData.mockClear();
};

const builder = new DomBuilder(document);

const dispatch = (dragSource, event, position = { clientX: 10, clientY: 10 }) => {
  /*
   * With 0, 0 firefoxmode would be enabled, leading to failing tests because
   * of missing document.onDragOver events
   */
  const dispatchEvent: MouseEvent = new MouseEvent(event, {
    bubbles: true,
    cancelable: true,
    ...position,
  });
  // $FlowFixMe
  dispatchEvent.dataTransfer = dataTransfer;
  dragSource.dispatchEvent(dispatchEvent);
};

// --- tests ---------------------------------------------------------------------------------------

describe('dragSource', () => {
  let dragSource;
  beforeEach(() => {
    clearMocks();
    driver.disconnectAll();

    dragSource = builder
      .element('div')
      .className('drag-source')
      .text('Drag Me')
      .end(true)
      .get();
  });

  it('should be connectable', () => {
    driver.connectSource(testCore, dragSource);
    expect(dragSource).toHaveAttribute('draggable', 'true');
    driver.disconnectSource(testCore, dragSource);
  });

  it('should forward all drag events to core', () => {
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'drag');
    dispatch(dragSource, 'drag');
    dispatch(dragSource, 'drag');
    dispatch(dragSource, 'dragend');
    expect(testCore.onDragStart).toHaveBeenCalledTimes(1);
    expect(testCore.onDrag).toHaveBeenCalledTimes(3);
    expect(testCore.onDragEnd).toHaveBeenCalledTimes(1);
    driver.disconnectSource(testCore, dragSource);
  });

  it('should send dragEnd and stop forwarding events, when dragSource is disconnected', () => {
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'drag');
    dispatch(dragSource, 'drag');
    driver.disconnectSource(testCore, dragSource);
    dispatch(dragSource, 'drag');
    dispatch(dragSource, 'drag');
    expect(testCore.onDragStart).toHaveBeenCalledTimes(1);
    expect(testCore.onDrag).toHaveBeenCalledTimes(2);
    expect(testCore.onDragEnd).toHaveBeenCalledTimes(1);
  });

  it('should not send dragEnd if no drag is in progress', () => {
    driver.connectSource(testCore, dragSource);
    driver.disconnectSource(testCore, dragSource);
    expect(testCore.onDragStart).not.toHaveBeenCalled();
    expect(testCore.onDrag).not.toHaveBeenCalled();
    expect(testCore.onDragEnd).not.toHaveBeenCalled();
  });

  it('should report an error, if no drag is in progress on drag or dragEnd', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const errorHandler = jest.fn();
    window.addEventListener('error', errorHandler);
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'drag');
    dispatch(dragSource, 'dragend');
    expect(testCore.onDragStart).not.toHaveBeenCalled();
    expect(testCore.onDrag).not.toHaveBeenCalled();
    expect(testCore.onDragEnd).not.toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledTimes(2);
    window.removeEventListener('error', errorHandler);
    driver.disconnectSource(testCore, dragSource);
  });

  it('should switch to firefox mode on drag with point (0, 0)', () => {
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'drag', { clientX: 0, clientY: 0 });
    dispatch(document, 'dragover', { clientX: 100, clientY: 200 });
    dispatch(dragSource, 'drag', { clientX: 0, clientY: 0 }); // First drag is not recognized
    dispatch(document, 'dragover', { clientX: 100, clientY: 200 });
    dispatch(dragSource, 'drag', { clientX: 0, clientY: 0 });
    dispatch(dragSource, 'dragend');
    expect(testCore.onDrag).toHaveBeenCalledWith({ x: 100, y: 200, node: expect.anything() });
    driver.disconnectSource(testCore, dragSource);
  });

  it('should back to non firefox mode on drag with point not equal to (0, 0)', () => {
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'drag', { clientX: 0, clientY: 0 });
    dispatch(dragSource, 'drag');
    dispatch(document, 'dragover', { clientX: 100, clientY: 200 });
    dispatch(document, 'dragover', { clientX: 100, clientY: 200 });
    dispatch(dragSource, 'dragend');
    expect(testCore.onDrag).not.toHaveBeenCalledWith({ x: 100, y: 200, node: expect.anything() });
    driver.disconnectSource(testCore, dragSource);
  });

  it('should catch IE error on drag start', () => {
    const errorHandler = jest.fn();
    window.addEventListener('error', errorHandler);

    dataTransfer.setData.mockImplementationOnce(() => {
      throw new Error('IE');
    });

    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    window.removeEventListener('error', errorHandler);
    expect(dataTransfer.setData).toHaveBeenCalledWith('text', '');
    expect(errorHandler).not.toHaveBeenCalled();
  });

  it('should throw an error if drag start is called twice without drag end', () => {
    const errorHandler = jest.fn();
    window.addEventListener('error', errorHandler);
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'dragstart');
    window.removeEventListener('error', errorHandler);
    expect(errorHandler).toHaveBeenCalledTimes(1);
  });

  it('should not retry firefox mode, if it has been disabled once', () => {
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'drag', { clientX: 0, clientY: 0 }); // Enable FF mode
    dispatch(dragSource, 'drag'); // Disable FF mode
    dispatch(dragSource, 'drag', { clientX: 0, clientY: 0 }); // Not enabled FF mode again
    dispatch(document, 'dragover', { clientX: 100, clientY: 200 });
    dispatch(document, 'dragover', { clientX: 100, clientY: 200 });
    dispatch(dragSource, 'dragend');
    expect(testCore.onDrag).not.toHaveBeenCalled();
    driver.disconnectSource(testCore, dragSource);
  });

  it('should work with nested drag sources', () => {
    const errorHandler = jest.fn();
    window.addEventListener('error', errorHandler);

    const dragSource2 = builder
      .element('div')
      .className('drag-source-2')
      .text('Drag Me 2')
      .end(true)
      .get();
    dragSource.appendChild(dragSource2);

    driver.connectSource(testCore, dragSource);
    driver.connectSource(testCore, dragSource2);

    dispatch(dragSource2, 'dragstart');
    dispatch(dragSource2, 'drag');
    dispatch(dragSource2, 'dragEnd');
    window.removeEventListener('error', errorHandler);
    expect(errorHandler).not.toHaveBeenCalled();
  });
});

describe('dropTarget', () => {
  let dropTarget;
  let dragSource;
  beforeEach(() => {
    clearMocks();
    driver.disconnectAll();

    dragSource = builder
      .element('div')
      .className('drag-source')
      .text('Drag Me')
      .end(true)
      .get();

    dropTarget = builder
      .element('div')
      .className('drop-target')
      .text('Drop here')
      .end(true)
      .get();
  });

  it('should be connectable', () => {
    driver.connectTarget(testCore, dropTarget);
    driver.disconnectTarget(testCore, dropTarget);
  });

  it('should forward all drag events to core', () => {
    driver.connectTarget(testCore, dropTarget);
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'drag');
    dispatch(dropTarget, 'dragover');
    dispatch(dragSource, 'drag');
    dispatch(dropTarget, 'dragover');
    dispatch(dragSource, 'drag');
    dispatch(dropTarget, 'dragover');
    dispatch(dragSource, 'drag');
    dispatch(dragSource, 'drag');
    expect(testCore.onDragEnter).toHaveBeenCalledTimes(1);
    expect(testCore.onDragOver).toHaveBeenCalledTimes(3);
    expect(testCore.onDragLeave).toHaveBeenCalledTimes(1);
    driver.disconnectSource(testCore, dragSource);
    driver.disconnectTarget(testCore, dropTarget);
  });

  it('should stop forwarding events, when dropTarget is disconnected', () => {
    driver.connectTarget(testCore, dropTarget);
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart'); // drag over does not fire, if there is no dragged node.
    dispatch(dropTarget, 'dragover');
    dispatch(dropTarget, 'dragover');
    dispatch(dropTarget, 'dragover');
    driver.disconnectTarget(testCore, dropTarget);
    dispatch(dropTarget, 'dragover');
    dispatch(dropTarget, 'dragover');
    dispatch(dropTarget, 'dragover');
    expect(testCore.onDragStart).toHaveBeenCalledTimes(1);
    expect(testCore.onDragOver).toHaveBeenCalledTimes(3);
    expect(testCore.onDragEnd).toHaveBeenCalledTimes(0);
  });

  it('should send dragLeave to drop target, when source disconnected over target', () => {
    driver.connectTarget(testCore, dropTarget);
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dragSource, 'drag');
    dispatch(dropTarget, 'dragover');
    driver.disconnectSource(testCore, dragSource);
    expect(testCore.onDragEnter).toHaveBeenCalledTimes(1);
    expect(testCore.onDragLeave).toHaveBeenCalledTimes(1);
  });

  it('should drop', () => {
    driver.connectTarget(testCore, dropTarget);
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dropTarget, 'dragover');
    dispatch(dropTarget, 'drop');
    dispatch(dragSource, 'dragend');
    expect(testCore.onDragStart).toHaveBeenCalledTimes(1);
    expect(testCore.onDragEnter).toHaveBeenCalledTimes(1);
    expect(testCore.onDragLeave).toHaveBeenCalledTimes(1);
    expect(testCore.onDrop).toHaveBeenCalledTimes(1);
    expect(testCore.onDragEnd).toHaveBeenCalledTimes(1);
  });

  it('should send leave/enter when changing target', () => {
    const dropTarget2 = builder
      .element('div')
      .className('drop-target2')
      .text('Drop here 2')
      .end(true)
      .get();

    driver.connectTarget(testCore, dropTarget);
    driver.connectTarget(testCore, dropTarget2);
    driver.connectSource(testCore, dragSource);
    dispatch(dragSource, 'dragstart');
    dispatch(dropTarget, 'dragover');
    dispatch(dropTarget2, 'dragover');
    dispatch(dropTarget2, 'drop');
    dispatch(dragSource, 'dragend');
    expect(testCore.onDragStart).toHaveBeenCalledTimes(1);
    expect(testCore.onDragEnter).toHaveBeenCalledTimes(2);
    expect(testCore.onDragLeave).toHaveBeenCalledTimes(2);
    expect(testCore.onDragEnd).toHaveBeenCalledTimes(1);
  });

  it('should work with nested drop targets', () => {
    const errorHandler = jest.fn();
    window.addEventListener('error', errorHandler);

    const dropTarget2 = builder
      .element('div')
      .className('drop-target-2')
      .text('Drop here 2')
      .end(true)
      .get();
    dropTarget.appendChild(dropTarget2);
    driver.connectTarget(testCore, dropTarget);
    driver.connectTarget(testCore, dropTarget2);

    dispatch(dropTarget2, 'dragenter');
    dispatch(dropTarget2, 'dragover');
    dispatch(dropTarget2, 'drop');

    window.removeEventListener('error', errorHandler);
    expect(errorHandler).not.toHaveBeenCalled();
  });
});
