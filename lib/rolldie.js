//----------------------------------------------------------------------------------------------------------------------
// Rolls a single die of the given number of sides.
//----------------------------------------------------------------------------------------------------------------------

// While not always true, modern `Math.random()` implementations provide a uniform distribution. Perfectly usable for
// dice rolling. You can't blame this implementation for your crappy rolls.
function random()
{
    return Math.random();
} // end random

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    rollDie(sides)
    {
        const rollSides = Math.floor(Math.abs(sides));
        return (Math.floor(random() * rollSides) + (rollSides >= 1 ? 1 : 0)) * (sides < 0 ? -1 : 1);
    } // end rollDice
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
