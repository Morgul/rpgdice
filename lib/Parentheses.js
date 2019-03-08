// ---------------------------------------------------------------------------------------------------------------------
// An parentheses expression.
// ---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

// ---------------------------------------------------------------------------------------------------------------------

class Parentheses extends Expression
{
    constructor (content)
    {
        super('parentheses');

        this.content = content;
    } // end constructor

    toString ()
    {
        return `(${this.content.toString()})`;
    } // end toString

    render ()
    {
        return `(${this.content.render()})`;
    } // end render

    // noinspection JSAnnotator
    eval (scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.content = this.content.eval(scope, depth + 1);

        this.value = this.content.value;

        return this;
    } // end eval
} // end Parentheses

// ---------------------------------------------------------------------------------------------------------------------

module.exports = Parentheses;

// ---------------------------------------------------------------------------------------------------------------------
