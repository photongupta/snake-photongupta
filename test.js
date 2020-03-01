const assert = require('assert');

describe('test', function() {
  it('test', function() {
    let actual = 5;
    let expected = 5;
    assert.strictEqual(actual, expected);
  });
});

describe('forTest', function() {
  it('forTest', function() {
    let actual = 3;
    let expected = 5;
    assert.strictEqual(actual, expected);
  });
});
