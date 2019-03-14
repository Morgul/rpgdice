//----------------------------------------------------------------------------------------------------------------------
// Rolls a single die of the given number of sides.
//----------------------------------------------------------------------------------------------------------------------

const randomBytes = require('randombytes');

//----------------------------------------------------------------------------------------------------------------------

// Some implementations of `Math.random()` are highly periodic, and poor sources of random numbers. I have opted for a
// (slower) method, which I've tested to generate a nearly uniform distribution of cryptographically secure
// pseudo-random numbers. In short: you can't blame my PRNG for your crappy rolls.
function random()
{
    const num = randomBytes(4).readUInt32LE(0);
    return num / Math.pow(2, 32);
} // end ransom

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    rollDie(sides)
    {
        const rollSides = Math.floor(Math.abs(sides));
        return (Math.floor(random() * rollSides) + (rollSides >= 1 ? 1 : 0)) * (sides < 0 ? -1 : 1);
    } // end rollDice
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
