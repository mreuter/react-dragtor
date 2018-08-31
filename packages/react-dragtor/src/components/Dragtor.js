/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';

// --- types ---------------------------------------------------------------------------------------

import type { Driver } from '../handler/types';
import type { AnyElement } from './types';

// --- main ----------------------------------------------------------------------------------------

const configureDragtor = (
  driver: Driver,
  handlerFactory: Function,
  connectProp: string = 'connect',
) => (WrappedComponent: React.ComponentType<Object>) => {
  class Dragtor extends React.PureComponent<Object> {
    ref = React.createRef();

    handler = handlerFactory();

    constructor() {
      super();
      // $FlowFixMe
      this.forceUpdate = this.forceUpdate.bind(this);
    }

    componentDidMount = () => {
      const {
        handler,
        ref: { current },
      } = this;
      if (!!current && handler.doesHandleSource) driver.connectSource(handler, current);
      if (!!current && handler.doesHandleTarget) driver.connectTarget(handler, current);
      if (handler.doesHandleSource) handler.setDraggingStateCallback(this.forceUpdate);
      if (handler.doesHandleTarget) handler.setOverStateCallback(this.forceUpdate);
      if (handler.doesHandleSource) handler.setSourceProps(this.wrappedElement.props);
      if (handler.doesHandleTarget) handler.setTarget(this.wrappedElement);
    };

    componentWillUnmount = () => {
      const {
        handler,
        ref: { current },
      } = this;
      if (!!current && handler.doesHandleSource) driver.disconnectSource(handler, current);
      if (!!current && handler.doesHandleTarget) driver.disconnectTarget(handler, current);
      if (handler.doesHandleSource) handler.setDraggingStateCallback();
      if (handler.doesHandleTarget) handler.setOverStateCallback();
      if (handler.doesHandleSource) handler.setSourceProps();
      if (handler.doesHandleTarget) handler.setTarget(this.wrappedElement);
    };

    connect = (element: AnyElement) => React.cloneElement(element, { ref: this.ref });

    wrappedElement;

    render() {
      const connectProps = { [connectProp]: this.connect };
      this.wrappedElement = (
        <WrappedComponent {...this.props} {...connectProps} {...this.handler.props} />
      );
      return this.wrappedElement;
    }
  }

  return Dragtor;
};

export default configureDragtor;
