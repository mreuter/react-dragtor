# react-dragtor
_A not so fully featured drag and drop library._
## Table of Contents
* [Installation](#installation)  
* [Examples](#examples)
* [Documentation](#documentation)
* [Motivation](#motivation)
* [License and Copyright](#license-and-copyright)

## Installation
Install react-dragtor and the html5 driver with npm:
```bash
npm install react-dragtor react-dragtor-driver-html5
```
or using yarn:
```bash
yarn add -s react-dragtor react-dragtor-driver-html5
```
## Examples
The following examples contain simple standlone components, that can
be included in any React App. They are automatically added to the
react-dragtor-example app (see source at [github](https://github.com/react-dragtor/react-dragtor)).
### Example 1: Simple Drag and Drop
Start with importing dependencies. react-dragtor must be configure using a driver.
Currently the only available driver is the html5 driver:
```javascript
import React from 'react';
import configureDragtor from 'react-dragtor';
import driver from 'react-dragtor-driver-html5';
``` 

Create a component, that expects the connect and isDragging properties (these could also be renamed
to avoid prop name collisions; see [Example X: XXX](#example-x-xxx)). This component will be
connected to the driver in the next step:

```javascript
const DragComponent = ({connect, isDragging}) => (
  connect(
    <div className={[
      'drag-source',
       isDragging && 'drag-source--dragging'
       ].filter(Boolean).join(' ')}
     >
      Drag Me
    </div>
  )
);
```

Now connect the component as drag source and configure its type:

```javascript
const dragtorSource = configureDragtor(driver, {
  dragSource: {
    type: '@dragtor/EXAMPLE1',    
  },
});
const DragtorDragSource = dragtorSource(DragComponent);

const DropComponent = ({connect, isOver}) => (
  connect(
    <div className={[
      'drop-target',
       isOver && 'drop-target--over'
       ].filter(Boolean).join(' ')}
     >
      Drop Here
    </div>
  )
);
const dragtorTarget = configureDragtor(driver, {
  dropTarget: {
    types: ['@dragtor/EXAMPLE1'],
    onDrop: () => {},
  },
});
const DragtorDropTarget = dragtorTarget(DropComponent);

const StateDisplay = ({count}) => (
  <div className="state-display">Dropped: {count}</div>
);

const Example1Component = () => <div>
  <DragtorDragSource/>
  <DragtorDragSource/>
  <DragtorDropTarget/>
  <DragtorDropTarget/>
  <StateDisplay count={0}/>
</div>;
```

Then the Component is exported:

```javascript
export {Example1Component as SimpleDragAndDrop};
```

### Example 2: Drag Source = Drop Target
```javascript
const DragAndDropComponent = ({connect, isDragging, isOver}) => (
  connect(
    <div className={[
      'drag-and-drop',
       isDragging && 'drag-and-drop--dragging',
       isOver && 'drag-and-drop--over',
       ].filter(Boolean).join(' ')}
     >
      Drag and Drop Me
    </div>
  )
);

const dragtorDragAndDrop = configureDragtor(driver, {
  dragSource: {
    type: '@dragtor/EXAMPLE2',
  },
  dropTarget: {
    types: ['@dragtor/EXAMPLE2'],
    onDrop: () => {},
  },
});

const DragtorDragAndDrop = dragtorDragAndDrop(DragAndDropComponent);

const Example2Component = () => <div>
  <DragtorDragAndDrop/>
  <DragtorDragAndDrop/>
  <StateDisplay count={0}/>
</div>;

export {Example2Component as DragSourceEqualsDropTarget};
```

### Example 3: Multiple Types
```javascript
```

### Example 4: Nested Drag Sources
```javascript
```

### Example 5: Nested Drop Targets
```javascript
```

### Example CSS
The CSS code that is included in the examples:
```css
.drag-source, .drag-and-drop {
  margin: 20px;
  display: inline-block;
  padding: 30px;
  background: #B3D7FF;
  border: 1px solid #36414D;
  color: #36414D;
  border-radius: 8px;
}
.drag-source.drag-source--dragging,
.drag-and-drop.drag-and-drop--dragging {
  opacity: 0.2;
}

.drag-and-drop {
background-image: linear-gradient(to top right, #B3D7FF, #FFECB3);
}

.drop-target {
  margin: 20px;
  display: inline-block;
  padding: 30px;
  background: #FFECB3;
  border: 1px solid #4D4736;
  color: #4D4736;
  border-radius: 8px;
}
.drop-target.drop-target--over,
.drag-and-drop.drag-and-drop--over {
  background: #4D4736;
  border: 1px solid #4D4736;
  color: white;
}

.state-display {
  margin: 20px;
  padding: 31px;
  border-left: 1px solid #7f7f7f;
  display: inline-block;
}
```

## Documentation
TODO - just take a look at the examples for now.

## Motivation
This library is greatly inspired by [react-dnd](https://github.com/react-dnd/react-dnd).
Thanks for the great work! If you want a full featured and stable drag and drop library
try it!

My reasons for making this library and not sticking with react-dnd were:
- I needed support for dragging into (in-app generated) IFrames, which I wasn't able to
  achieve with react-dnd.
- I didn't want to get into TypeScript to contribute to react-dnd and try to solve this issue.
- I am relatively new to JavaScript and React and wanted to use this project to learn
  more about it.
- I was hoping for a little less size and dependencies by not implementing some
  features that react-dnd has.
  
## License and Copyright
[MIT](./LICENSE) &copy; Marc Reuter
