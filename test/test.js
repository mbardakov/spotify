import { strict as assert } from 'assert';
import data from './data.js';

describe('data', function () {
  it('can be imported', function () {
    assert.deepStrictEqual(Object.keys(data), ['profile', 'topTracks', 'trackFeatures']);
    assert.equal(!!(data.profile), true);
    assert.equal(!!(data.topTracks), true);
    assert.equal(!!(data.trackFeatures), true);
  });
});