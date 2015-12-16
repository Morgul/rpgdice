//----------------------------------------------------------------------------------------------------------------------
/// A simple test for uniform distributions.
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var dice = require('../lib/rolldie');

//----------------------------------------------------------------------------------------------------------------------

var SIDES = 20;
var ITERATIONS = 10000000;

//----------------------------------------------------------------------------------------------------------------------

// Populate result object
var results = {};
_.each(_.range(1, SIDES + 1), (side) => { results[side] = 0; });

// Collect results
_.each(_.range(0, ITERATIONS), () =>
{
    var roll = dice.rollDie(SIDES);
    results[roll] += 1;
});

var expectedCount = Math.floor(ITERATIONS / SIDES);

// Report to the user
console.log('Raw: %j', results);

var variances = _.transform(results, (accum, val, key) =>
{
    accum[key] = (((val - expectedCount) / expectedCount) * 100).toFixed(2);
});

console.log('Variance: %j', variances);

//----------------------------------------------------------------------------------------------------------------------