// ----------------------------------------------------------------------------------------------------------------------
// A conditional expression.
// ----------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

// ----------------------------------------------------------------------------------------------------------------------

class Conditional extends Expression
{
    constructor(condition, thenExpr, elseExpr)
    {
        super('conditional');

        this.condition = condition;
        this.thenExpr = thenExpr;
        this.elseExpr = elseExpr;
    } // end constructor

    toString()
    {
        return `${ this.condition.toString() } ? ${ this.thenExpr.toString() } : ${ this.elseExpr.toString() }`;
    } // end toString

    render()
    {
        return `${ this.condition.render() } ? ${ this.thenExpr.render() } : ${ this.elseExpr.render() }`;
    } // end render

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.condition = this.condition.eval(scope, depth + 1);
        this.thenExpr = this.thenExpr.eval(scope, depth + 1);
        this.elseExpr = this.elseExpr.eval(scope, depth + 1);

        if(this.condition.value !== 0)
        {
            this.value = this.thenExpr.value;
        }
        else
        {
            this.value = this.elseExpr.value;
        }

        return this;
    } // end eval
} // end Conditional

// ----------------------------------------------------------------------------------------------------------------------

module.exports = Conditional;

// ----------------------------------------------------------------------------------------------------------------------
