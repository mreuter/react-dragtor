/**
 * Copyright (c) 2018-present, Marc Reuter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import camel2title from '../helpers/camel2title';

// --- types ---------------------------------------------------------------------------------------

type ExamplesProps = {
  title: string,
  examples: {
    [string]: React.ComponentType<Object>
  }
};

// --- main ----------------------------------------------------------------------------------------

const Examples = ({ title, examples }: ExamplesProps) => (
  <div>
    <h2>{title}</h2>
    {Object.keys(examples).map((key) => {
      const Component = examples[key];
      return [<h3 key="headline">{camel2title(key)}</h3>, <Component key="component" />];
    })}
  </div>
);

export default Examples;
