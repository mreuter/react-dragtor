# Dragtor / react-dragtor

_A not so fully featured drag and drop library._

[![blazing speed](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg "blazing speed")](https://twitter.com/acdlite/status/974390255393505280)
[![Build Status](https://travis-ci.com/react-dragtor/react-dragtor.svg?branch=master)](https://travis-ci.com/react-dragtor/react-dragtor)
[![codecov](https://codecov.io/gh/react-dragtor/react-dragtor/branch/master/graph/badge.svg)](https://codecov.io/gh/react-dragtor/react-dragtor)

## Contents

This monorepo includes:

* react-dragtor (packages/react-dragtor)
* react-dragtor-driver-html5 (packages/react-dragtor-driver-html5)
* react-dragtor-example (examples/react-dragtor-example)

## Documentation

The main documentation can be found in the [react-dragtor](./packages/react-dragtor) package.

Some examples on how to use the react-dragtor-driver-html5 without react-dragtor can be found in
the [react-dragtor-driver-html5](./packages/react-dragtor-driver-html5) package.

## Features

_Some of them might also be just wished for._

* [ ] Drag and Drop between IFrames.
* [x] Update the state of drag source when dragging.
* [x] Update the state of the drop target, if dragged item is hovering above it.
* [x] Nested drag sources/drop targets.
* [ ] Removing (or just hiding) of the drag source possible (could be used when
  interactively sorting lists with drag and drop).
* [x] Dropping at the edge of drop targets (to insert items next to the side).
* [x] Runnable in all major browsers (maybe even IE).
* [ ] Native (e. g. files) drop support.

## TODO

Current priorities:

* [ ] Make better example(s).
* [ ] Write tests for examples.
* [ ] Extend E2E tests.

### License and Copyright

[MIT](./LICENSE) &copy; Marc Reuter
