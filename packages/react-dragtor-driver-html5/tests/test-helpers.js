/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

class DomBuilder {
  stack = [];

  document: Document;

  constructor(doc: Document) {
    this.document = doc;
  }

  get currentElement() { return this.stack[this.stack.length - 1]; }

  text = (content: string) => {
    const newText = this.document.createTextNode(content);
    if (this.stack.length > 0) {
      this.currentElement.appendChild(newText);
    }
    return this;
  };

  element = (tag: string) => {
    const newElement = this.document.createElement(tag);
    this.stack.push(newElement);
    return this;
  };

  attributes = (attributes: {[string]: string}) => {
    Object.keys(attributes).forEach(
      key => this.currentElement.setAttribute(key, attributes[key]),
    );
    return this;
  };

  className = (cls: string) => {
    this.currentElement.className = cls;
    return this;
  };

  end = (autoAppend: boolean = false) => {
    if (this.stack.length > 1) {
      const finishedElement = this.stack.pop();
      this.currentElement.appendChild(finishedElement);
      return this;
    }

    if (autoAppend && this.document.body) {
      this.document.body.appendChild(this.currentElement);
    }

    return this;
  };

  get = () => {
    const result = this.currentElement;
    this.stack = [];
    return result;
  }
}

export default DomBuilder;
