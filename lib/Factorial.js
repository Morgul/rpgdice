// ----------------------------------------------------------------------------------------------------------------------
// A factorial expression.
// ----------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');

// ----------------------------------------------------------------------------------------------------------------------

class Factorial extends Expression
{
    constructor (content)
    {
        super('factorial');

        this.content = content;
    } // end constructor

    toString ()
    {
        return `${this.content}!`;
    } // end toString

    // noinspection JSAnnotator
    eval ()
    {
        this.value = 1;

        if (this.content > 0)
        {
            for (var i = 2; i <= this.content; i++)
            {
                this.value = this.value * i;
            }
        }

        return this;
    } // end eval
} // end Factorial

// ----------------------------------------------------------------------------------------------------------------------

module.exports = Factorial;

// ----------------------------------------------------------------------------------------------------------------------
