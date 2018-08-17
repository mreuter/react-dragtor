/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureDragtor from './Dragtor';

Enzyme.configure({ adapter: new Adapter() });

type ComponentMockProps = {
  connect: Function,
};

const driverMock = {
  connectSource: jest.fn(),
  connectTarget: jest.fn(),
  disconnectSource: jest.fn(),
  disconnectTarget: jest.fn(),
};
const handlerMock = {
  doesHandleSource: false,
  doesHandleTarget: false,
  onDragStart: jest.fn(),
  onDrag: jest.fn(),
  onDragEnd: jest.fn(),
  onDragEnter: jest.fn(),
  onDragOver: jest.fn(),
  onDragLeave: jest.fn(),
  onDrop: jest.fn(),
  props: { handlerProp: 'MyValue' },
  setDraggingStateCallback: jest.fn(),
  setOverStateCallback: jest.fn(),
  setSourceProps: jest.fn(),
  setTarget: jest.fn(),
};

const handlerFactory = () => handlerMock;

const ComponentMock = ({ connect }: ComponentMockProps) => connect(<div className="my-component">My Component</div>);

beforeEach(() => {
  handlerMock.doesHandleSource = false;
  handlerMock.doesHandleTarget = false;
  handlerMock.props = { handlerProp: 'MyValue' };
  Object.keys(handlerMock).forEach(
    key => typeof handlerMock[key] === 'function' && handlerMock[key].mockClear(),
  );

  Object.keys(driverMock).forEach(
    key => typeof driverMock[key] === 'function' && driverMock[key].mockClear(),
  );
});

it('should pass props, handler props and connect to wrapped component', () => {
  const Component = configureDragtor(driverMock, handlerFactory)(ComponentMock);
  const wrapper = mount(<Component someProp="MyProp" />);
  expect(wrapper.find(ComponentMock)).toHaveLength(1);
  expect(typeof wrapper.find(ComponentMock).prop('connect')).toBe('function');
  expect(wrapper.find(ComponentMock).prop('handlerProp')).toBe('MyValue');
  expect(wrapper.find(ComponentMock).prop('someProp')).toBe('MyProp');
});

it('should connect source if configured', () => {
  handlerMock.doesHandleSource = true;
  const Component = configureDragtor(driverMock, handlerFactory)(ComponentMock);
  const wrapper = mount(<Component />);
  expect(driverMock.connectSource).toHaveBeenCalledTimes(1);
  expect(handlerMock.setDraggingStateCallback).toHaveBeenCalledTimes(1);
  wrapper.unmount();
  expect(driverMock.disconnectSource).toHaveBeenCalledTimes(1);
  expect(handlerMock.setDraggingStateCallback).toHaveBeenCalledTimes(2);
});

it('should connect target if configured', () => {
  handlerMock.doesHandleTarget = true;
  const Component = configureDragtor(driverMock, handlerFactory)(ComponentMock);
  const wrapper = mount(<Component />);
  expect(driverMock.connectTarget).toHaveBeenCalledTimes(1);
  expect(handlerMock.setOverStateCallback).toHaveBeenCalledTimes(1);
  wrapper.unmount();
  expect(driverMock.disconnectTarget).toHaveBeenCalledTimes(1);
  expect(handlerMock.setOverStateCallback).toHaveBeenCalledTimes(2);
});

it('should connect to source and target if configured', () => {
  handlerMock.doesHandleTarget = true;
  handlerMock.doesHandleSource = true;
  const Component = configureDragtor(driverMock, handlerFactory)(ComponentMock);
  const wrapper = mount(<Component />);
  expect(driverMock.connectSource).toHaveBeenCalledTimes(1);
  expect(handlerMock.setDraggingStateCallback).toHaveBeenCalledTimes(1);
  expect(driverMock.connectTarget).toHaveBeenCalledTimes(1);
  expect(handlerMock.setOverStateCallback).toHaveBeenCalledTimes(1);
  wrapper.unmount();
  expect(driverMock.disconnectSource).toHaveBeenCalledTimes(1);
  expect(handlerMock.setDraggingStateCallback).toHaveBeenCalledTimes(2);
  expect(driverMock.disconnectTarget).toHaveBeenCalledTimes(1);
  expect(handlerMock.setOverStateCallback).toHaveBeenCalledTimes(2);
});
