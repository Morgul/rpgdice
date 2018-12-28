//----------------------------------------------------------------------------------------------------------------------
// A simple test for uniform distributions.
//----------------------------------------------------------------------------------------------------------------------

const dice = require('../lib/rolldie');
const { range } = require('../lib/utils');

//----------------------------------------------------------------------------------------------------------------------

const SIDES = 20;
const ITERATIONS = 10000000;

//----------------------------------------------------------------------------------------------------------------------

// Populate result object
const results = {};
range(1, SIDES + 1).forEach((side) => { results[side] = 0; });

// Collect results
range(0, ITERATIONS).forEach(() =>
{
    const roll = dice.rollDie(SIDES);
    results[roll] += 1;
});

const expectedCount = Math.floor(ITERATIONS / SIDES);

// Report to the user
console.log('Raw: %j', results);

const variances = Object.keys(results).reduce((accum, key) =>
{
    const val = results[key];
    accum[key] = (((val - expectedCount) / expectedCount) * 100).toFixed(2);

    return accum;
}, {});

console.log('Variance: %j', variances);

//----------------------------------------------------------------------------------------------------------------------
