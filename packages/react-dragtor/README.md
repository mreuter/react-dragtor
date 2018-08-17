# Dragtor
_A not so fully featured drag and drop library._
## Required Features
_Some of them might also be just wished for._
* Drag and Drop between IFrames.
* Update the state of drag source when dragging.
* Update the state of the drop target, if dragged item is hovering above it.
* Nested drag sources/drop targets.
* Removing (or just hiding) of the drag source possible (could be used when
  interactively sorting lists with drag and drop).
* Dropping at the edge of drop targets (to insert items next to the side):
  more general solution "drop areas"?
* Runnable in all major browsers (maybe even IE 10+).
##Usage
_Currently just in my imagination._
```javascript
const Component = ({connect, isDragging}) => {
    return connect(<div>I am draggable</div>);
};

const options = {
    dragSource: {},
    dropTarget: {},
    connect: 'connectionFunctionNameToAvoidPropCollision'
};

const Dragtor = configureDragtor(options);
const DraggableComponent = Dragtor(Component);
```
## Considerations
HTML5 drag and drop is not without its quirks.
* IE only takes 'text' as type for setData
* Firefox required setData in dragstart or cancels the drag (without dragend)
* dragenter/dragleave can be real bitches
* drop only fires, if last of dragEnter/dragOver events was cancelled
* getData only works on drop (protected mode)
* Deleting currently hovered dropTarget, does not generate dragLeave on some browsers
  (it does on chrome, but doesn't on firefox).
## Architecture
### Driver
I want to have a thin layer, that handles the browser events, removes the
quirks, handles everything DOM related and then passes to the next layer.
