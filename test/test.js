import { strict as assert } from 'assert';
import { describe, it } from 'mocha';
import data from './data.js';
import { getMean, getStandardDeviation, roundPlaces } from '../src/analyze.js'

describe('data', () => {
  it('can be imported', () => {
    assert.deepStrictEqual(Object.keys(data), ['profile', 'topTracks', 'trackFeatures']);
    assert.equal(!!(data.profile), true);
    assert.equal(!!(data.topTracks && data.topTracks.items), true);
    assert.equal(data.trackFeatures.length > 0, true);
  });
});

describe('analyze', () => {
  it('can round a number to X decimal places', () => {
    it('zero', () => {
      assert.equal(roundPlaces(1.2345, 0), 1);
      assert.equal(roundPlaces(6.7898, 0), 7);
    });
    it('one', () => {
      assert.equal(roundPlaces(1.2345, 1), 1.2);
      assert.equal(roundPlaces(6.7898, 1), 6.8);
    });
    it('two', () => {
      assert.equal(roundPlaces(1.2345, 2), 1.23);
      assert.equal(roundPlaces(6.7898, 2), 6.79);
    });
    it('three', () => {
      assert.equal(roundPlaces(1.2345, 3), 1.235);
      assert.equal(roundPlaces(6.7898, 3), 6.790);
    });
  });
  it('can get the mean of a set of numbers', () => {
    assert.equal(getMean([0.2, 0.4, 0.6, 0.8]), 0.5);
  });
  it('can get the standard deviation of a set of numbers', () => {
    assert.equal(roundPlaces(getStandardDeviation([0.2, 0.4, 0.6, 0.8]), 2), 0.26);
  });
  it('can get the standard deviation of a set of numbers, again', () => {
    assert.equal(roundPlaces(getStandardDeviation([2, 1, 3, 2, 4]), 2), 1.01);
  });
  it('can get the standard deviation of a set of numbers, a third time', () => {
    assert.equal(roundPlaces(getStandardDeviation([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 2), 2.88);
  });
});
