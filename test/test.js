import { strict as assert } from 'assert';
import data from './data.js';

describe('data', () => {
  it('can be imported', () => {
    assert.deepStrictEqual(Object.keys(data), ['profile', 'topTracks', 'trackFeatures']);
    assert.equal(!!(data.profile), true);
    assert.equal(!!(data.topTracks && data.topTracks.items), true);
    assert.equal(data.trackFeatures.length > 0, true);
  });
});
