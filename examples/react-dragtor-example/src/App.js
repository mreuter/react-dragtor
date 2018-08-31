/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import React from 'react';
import './App.css';

import * as ReactExamples from 'react-dragtor/README.md';
import * as DriverOnlyExamples from 'react-dragtor-driver-html5/README.md';
import Examples from './components/Examples';

const App = () => (
  <div className="App">
    <header className="App-header">
      <h1 className="App-title">react-dragtor e2e test examples</h1>
    </header>
    <section className="App-content">
      <Examples title="React Examples" examples={ReactExamples} />
      <Examples title="Driver only Examples" examples={DriverOnlyExamples} />
    </section>
  </div>
);

export default App;
