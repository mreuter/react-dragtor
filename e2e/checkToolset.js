var dragAndDrop = require('html-dnd').codeForSelectors;

module.exports = {
  'Page loading and using dragtor': function(browser) {
    browser
      .url('http://localhost:7777')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.App-title', 1000);
    browser.expect.element('.App-title').text.to.contain('react-dragtor');
    browser.end();
  },
  'Drag and Drop using only driver': function(browser) {
    browser
      .url('http://localhost:7777')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.driver-only-source', 1000);
    browser.expect.element('.driver-only-source').text.to.contain('Dragged: 0');
    browser.execute(dragAndDrop, ['.driver-only-source', '.driver-only-target-1']);
    browser.expect.element('.driver-only-source').text.to.contain('Dragged: 1');
    browser.execute(dragAndDrop, ['.driver-only-source', '.driver-only-target-1']);
    browser.execute(dragAndDrop, ['.driver-only-source', '.driver-only-target-2']);
    browser.execute(dragAndDrop, ['.driver-only-source', '.driver-only-target-3']);
    browser.expect.element('.driver-only-source').text.to.contain('Dragged: 4');
    browser.expect.element('.driver-only-target-1').text.to.contain('Dropped: 2');
    browser.expect.element('.driver-only-target-2').text.to.contain('Dropped: 1');
    browser.expect.element('.driver-only-target-3').text.to.contain('Dropped: 1');
  },
  'Nested Drag and Drop using only driver': function(browser) {
    browser
      .url('http://localhost:7777')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('.driver-only-source', 1000);
    browser.execute(dragAndDrop, ['.driver-only-source', '.driver-only-target-4']);
    browser.execute(dragAndDrop, ['.driver-only-source', '.driver-only-target-5']);
    browser.execute(dragAndDrop, ['.driver-only-source-2', '.driver-only-target-5']);
    browser.execute(dragAndDrop, ['.driver-only-source-3', '.driver-only-target-5']);
    browser.expect.element('.driver-only-source').text.to.contain('Dragged: 2');
    browser.expect.element('.driver-only-source-2').text.to.contain('Dragged: 1');
    browser.expect.element('.driver-only-source-3').text.to.contain('Dragged: 1');
    browser.expect.element('.driver-only-target-4').text.to.contain('Dropped: 1');
    browser.expect.element('.driver-only-target-5').text.to.contain('Dropped: 3');
  },
};
