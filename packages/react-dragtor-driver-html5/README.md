# react-dragtor-html5-driver
_A love-letter to the browsers_

The driver is normally used with [react-dragtor](https://www.npmjs.com/package/react-dragtor).

However it is easy to use the driver without react and/or react-dragtor.

## Table of Contents
* [Installation](#installation)  
* [Examples](#examples)
* [Motivation](#motivation)
* [Considerations](#considerations)
* [License and Copyright](#license-and-copyright)

## Installation
Install react-dragtor-driver-html5 with npm:
```bash
npm install react-dragtor-driver-html5
```
or using yarn:
```bash
yarn add -s react-dragtor-driver-html5
```

## Examples
Without react-dragtor, the driver does not support detecting dragging/dropping near edges, setting
types, etc. It just mimics the HTML 5 Drag and Drop API minus the browser quirks.

### Example 1
Start with importing dependencies. React is required to mount the generated DOM into the examples
app and to supply the DOM node that is used as the container for the example.
```javascript
import * as React from 'react';
import driver from 'react-dragtor-driver-html5';
``` 

Create a basic handler:

```javascript
const incCount = node => {
  const countText = node.childNodes.item(2);
  const [prefix, countStr] = countText
    .textContent
    .toString()
    .split(':');
  const count = parseInt(countStr, 10) + 1;
  countText.textContent = [prefix, count].join(': ');
};

const handler = {
  onDragStart: ({node}) => {
    incCount(node);
    node.classList.add('driver-only-source--dragging');
  },
  onDrag: () => {},
  onDragEnd: ({node}) => node.classList.remove('driver-only-source--dragging'),
  onDragEnter: ({node}) => node.classList.add('driver-only-target--over'),
  onDragOver: () => 'copy',
  onDragLeave: ({node}) => node.classList.remove('driver-only-target--over'),
  onDrop: ({node}) => {
    incCount(node);
  },
};

``` 

Create dom and connect to driver and handler:

```javascript

const build = domNode => {
  domNode.innerHTML = '<div class="driver-only-source">Drag Me<br>Dragged: 0</div>' +
    '<div class="driver-only-target-1">Drop Here<br>Dropped: 0</div>' +
    '<div class="driver-only-target-2">Drop Here<br>Dropped: 0</div>' +
    '<div class="driver-only-target-3">Drop Here<br>Dropped: 0</div>' + 
    '<div class="driver-only-target-4">Drop Here<br>Dropped: 0' +
    '<div class="driver-only-target-5">Drop Here<br>Dropped: 0</div>' +
    '</div>' +
    '<div class="driver-only-source-2">Drag Me<br>Dragged: 0' +
    '<div class="driver-only-source-3">Drag Me<br>Dragged: 0</div>' +
    '</div>';
  ['', '-2', '-3'].forEach(
    i => driver.connectSource(handler, domNode.querySelector('.driver-only-source' + i))
  );
  [1, 2, 3, 4, 5].forEach(
    i => driver.connectTarget(handler, domNode.querySelector('.driver-only-target-' + i))
  );
};
``` 

Export react component to use in example app:

```javascript
const Example1Component = () => <div ref={ref => build(ref)}></div>

export {Example1Component};
```

### Example CSS
The CSS code that is included in the examples:
```css
.driver-only-source,
.driver-only-source-2,
.driver-only-source-3 {
  margin: 20px;
  display: inline-block;
  padding: 30px;
  background: #B3D7FF;
  border: 1px solid #36414D;
  color: #36414D;
  border-radius: 8px;
}
.driver-only-source.driver-only-source--dragging,
.driver-only-source-2.driver-only-source--dragging,
.driver-only-source-3.driver-only-source--dragging {
  opacity: 0.2;
}

.driver-only-target-1,
.driver-only-target-2,
.driver-only-target-3,
.driver-only-target-4,
.driver-only-target-5 {
  margin: 20px;
  display: inline-block;
  padding: 30px;
  background: #FFECB3;
  border: 1px solid #4D4736;
  color: #4D4736;
  border-radius: 8px;
}
.driver-only-target-1.driver-only-target--over,
.driver-only-target-2.driver-only-target--over,
.driver-only-target-3.driver-only-target--over,
.driver-only-target-4.driver-only-target--over,
.driver-only-target-5.driver-only-target--over {
  background: #4D4736;
  border: 1px solid #4D4736;
  color: white;
}

.driver-only-state-display {
  margin: 20px;
  padding: 31px;
  border-left: 1px solid #7f7f7f;
  display: inline-block;
}
```

## Motivation
HTML5 drag and drop is not without its (browser-)quirks. This driver circumvents these quirks and
delivers a reliable sequence of events to react-dragtor.

### What does the driver do?
Guaranteed, fixed order of events. Uniform behaviour on all supported browsers.
TODO: Add better explanation

### Considerations
Some of the quirks that can be found in browsers regarding the HTML5 drag and drop API are:
- [x] IE only takes 'text' as type for setData
- [x] Firefox required setData in dragstart or cancels the drag (without dragend)
- [x] dragenter/dragleave can be real bitches
- [x] drop only fires, if last of dragEnter/dragOver events was cancelled
- [x] getData only works on drop (protected mode)
- [x] Deleting currently hovered dropTarget, does not generate dragLeave on some browsers
  (it does on chrome, but doesn't on firefox).
- [x] Dragging an inner nested drag source fires dragStart, drag and dragEnd on
      both sources (Chrome, Safari, IE - maybe all but firefox). Only the events
      of the inner source should be used.
- [x] Most browsers don't pass dropEffect set on drag over to on drop, but always
      have dropEffect none.
- [x] Firefox: When dragging a selection that is partially inside a drag source by dragging a part
      of the selection that is OUTSIDE the drag source, no drag start event is generated (that would
      be cancelled because of the target type), but drag events get generated. 

## License and Copyright
[MIT](./LICENSE) &copy; Marc Reuter
