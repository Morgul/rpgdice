//---------------------------------------------------------------------------------------------------------------------
// An repeat and sum expression.
//---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

const { range } = require('./utils');

//---------------------------------------------------------------------------------------------------------------------

class Repeat extends Expression
{
    constructor(count, right)
    {
        super('repeat');

        this.count = count;
        this.right = right;
    } // end constructor

    toString()
    {
        return `${ this.count }(${ this.right.toString() })`;
    } // end toString

    render()
    {
        return `${ this.count }(${ this.right.render() })`;
    } // end render

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.results = range(this.count).reduce((results) =>
        {
            results.push(this.right.eval(scope, depth + 1));
            return results;
        }, []);

        this.value = this.results.reduce((results, result) => results + result.value, 0);

        return this;
    } // end eval
} // end Repeat

//---------------------------------------------------------------------------------------------------------------------

module.exports = Repeat;

//---------------------------------------------------------------------------------------------------------------------
