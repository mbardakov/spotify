import { strict as assert } from 'assert';
// import { getMean } from '../src/script.js';
// todo: separate main code from other functions so you can test those functions without invoking main
import data from './data.js';

describe('data', () => {
  it('can be imported', () => {
    assert.deepStrictEqual(Object.keys(data), ['profile', 'topTracks', 'trackFeatures']);
    assert.equal(!!(data.profile), true);
    assert.equal(!!(data.topTracks), true);
    assert.equal(data.trackFeatures.length > 0, true);
  });
});

// describe('number crunching', () => {
//   it('can calculate the mean ', () => {
//     assert.equal(getMean(data.trackFeatures.map(feature => feature.danceability)), 12.591/20);
//   })
// });

/*
0.531
0.566
0.555
0.742
0.707
0.646
0.655
0.701
0.699
0.589
0.664
0.72
0.787
0.701
0.521
0.508
0.666
0.579
0.657
0.397
*/