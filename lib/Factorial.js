// ----------------------------------------------------------------------------------------------------------------------
// A factorial expression.
// ----------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

// ----------------------------------------------------------------------------------------------------------------------

class Factorial extends Expression
{
    constructor(content)
    {
        super('factorial');

        this.content = content;
    } // end constructor

    toString()
    {
        return `${ this.content }!`;
    } // end toString

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.content = this.content.eval(scope, depth + 1);

        let content = Math.abs(this.content.value);

        if (content > 170 || content < 0 ) { 
            throw new RangeError ("Factorial content out of range, must be 0 - [-]170 inclusive.");
        }

        this.value = 1;

        for(let i = 2; i <= content; i++)
        {
            this.value *= i;
        }

        this.value *= (this.content.value < 0 ? -1 : 1);

        return this;
    } // end eval
} // end Factorial

// ----------------------------------------------------------------------------------------------------------------------

module.exports = Factorial;

// ----------------------------------------------------------------------------------------------------------------------
