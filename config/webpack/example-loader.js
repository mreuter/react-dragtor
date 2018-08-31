const htmlparser = require("htmlparser2");
const getOptions = require('loader-utils').getOptions;
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    capture: {
      type: 'string'
    }
  }
};

module.exports = function exampleLoader(input) {
  const options = getOptions(this);
  validateOptions(schema, options, 'Example Loader');

  let capture = false;
  let jsCode = '';
  const parser = new htmlparser.Parser({
    onopentag: function(name, attributes) {
      if (name === 'code' && attributes.class === options.capture) {
        capture = true;
      }
    },
    ontext: function(text) {
      if (capture) {
        jsCode = jsCode + text;
      }
    },
    onclosetag: function(name) {
      if (name === 'code') {
        capture = false;
      }
    }
  }, {decodeEntities: true});
  parser.write(input);
  parser.end();
  return jsCode;
};
