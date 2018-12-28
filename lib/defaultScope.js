//----------------------------------------------------------------------------------------------------------------------
// This is the default scope for dice evaluations
//----------------------------------------------------------------------------------------------------------------------

const { rollDie } = require('./rolldie');

//----------------------------------------------------------------------------------------------------------------------

function ensureFinite(expr, name)
{
    if(!Number.isFinite(expr.value))
    {
        const error = new TypeError(`Non-finite number passed to '${ name }()': ${ expr.value }`);
        error.expr = expr;

        throw error;
    } // end if
} // end ensureFinite

function ensureRollType(expr, name)
{
    if(expr.type !== 'roll')
    {
        const error = new Error(`Non-roll passed to '${ name }()': ${ expr.toString() }`);
        error.expr = expr;

        throw error;
    } // end if
} // end ensureRollType

//----------------------------------------------------------------------------------------------------------------------

var defaultScope = {
    min(expr1, expr2, scope)
    {
        expr1 = expr1.eval(scope);
        ensureFinite(expr1, 'min');

        expr2 = expr2.eval(scope);
        ensureFinite(expr2, 'min');

        return Math.min(expr1.value, expr2.value);
    },
    max(expr1, expr2, scope)
    {
        expr1 = expr1.eval(scope);
        ensureFinite(expr1, 'max');

        expr2 = expr2.eval(scope);
        ensureFinite(expr2, 'max');

        return Math.max(expr1.value, expr2.value);
    },
    floor(expr, scope)
    {
        this.expr = expr.eval(scope);
        ensureFinite(this.expr, 'floor');

        return Math.floor(this.expr.value);
    },
    ceil(expr, scope)
    {
        this.expr = expr.eval(scope);
        ensureFinite(this.expr, 'ceil');

        return Math.ceil(this.expr.value);
    },
    round(expr, scope)
    {
        this.expr = expr.eval(scope);
        ensureFinite(this.expr, 'round');

        return Math.round(this.expr.value);
    },
    explode(expr, scope)
    {
        ensureRollType(expr, 'explode');

        let roll = expr.eval(scope);

        this.expr = roll;
        this.results = [ roll.value ];

        while(roll.value === roll.sides)
        {
            roll = expr.eval(scope);
            this.results.push(roll.value);
        } // end while

        // We return the sum of everything rolled
        return this.results.reduce((results, roll) => results + roll, 0);
    },
    dropLowest(expr, scope)
    {
        ensureRollType(expr, 'dropLowest');

        this.expr = expr.eval(scope);

        // Sort the array by value
        this.results = this.expr.results.concat().sort((a, b) => (a > b) ? 1 : (b > a) ? -1 : 0);

        // Drop the lowest (left most) value
        this.results.shift();

        // We return the sum of everything but the lowest value rolled
        return this.results.reduce((results, roll) => results + roll, 0);
    },
    dropHighest(expr, scope)
    {
        ensureRollType(expr, 'dropHighest');

        this.expr = expr.eval(scope);

        // Sort the array by value
        this.results = this.expr.results.concat().sort((a, b) => (a > b) ? 1 : (b > a) ? -1 : 0);

        // Drop the lowest (right most) value
        this.results.pop();

        // We return the sum of everything but the highest value rolled
        return this.results.reduce((results, roll) => results + roll, 0);
    },
    rerollAbove(maxVal, expr, scope)
    {
        const roll = expr.eval(scope);
        maxVal = maxVal.eval(scope);

        ensureRollType(expr, 'rerollAbove');
        ensureFinite(maxVal, 'rerollAbove');

        this.expr = roll;
        this.results = roll.results.reduce((results, rollVal) =>
        {
            if(rollVal >= maxVal.value)
            {
                // We reroll, and keep
                results.push(rollDie(roll.sides));
            }
            else
            {
                results.push(rollVal);
            } // end if

            return results;
        }, []);

        // We return the sum of everything rolled
        return this.results.reduce((results, roll) => results + roll, 0);
    },
    rerollBelow(minVal, expr, scope)
    {
        const roll = expr.eval(scope);
        minVal = minVal.eval(scope);

        ensureRollType(expr, 'rerollBelow');
        ensureFinite(minVal, 'rerollBelow');

        this.expr = roll;
        this.results = roll.results.reduce((results, rollVal) =>
        {
            if(rollVal <= minVal.value)
            {
                // We reroll, and keep
                results.push(rollDie(roll.sides));
            }
            else
            {
                results.push(rollVal);
            } // end if

            return results;
        }, []);

        // We return the sum of everything rolled
        return this.results.reduce((results, roll) => results + roll, 0);
    }
}; // end defaultScope

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    buildDefaultScope(scope)
    {
        return Object.assign({}, defaultScope, scope);
    },
    defaultScope
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
