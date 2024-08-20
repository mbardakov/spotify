import { strict as assert } from 'assert';
import data from './data.js';

describe('data', function () {
  describe('data does exist', function () {
    it('objects should have at least one key', function () {
      assert.notEqual(Object.keys(data), 0);
    });
  });
});