// ---------------------------------------------------------------------------------------------------------------------
// An repeat and sum expression.
// ---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

const { range } = require('./utils');

// ---------------------------------------------------------------------------------------------------------------------

class Repeat extends Expression
{
    constructor(count, content)
    {
        super('repeat');

        this.count = count;
        this.content = content;
    } // end constructor

    toString()
    {
        return `${ this.count.toString() }(${ this.content.toString() })`;
    } // end toString

    render()
    {
        return `${ this.count.render() }(${ this.content.render() })`;
    } // end render

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.count = this.count.eval(scope, depth + 1);

        this.results = range(this.count.value).reduce((results) =>
        {
            results.push(this.content.eval(scope, depth + 1));
            return results;
        }, []);

        this.value = this.results.reduce((results, result) => results + result.value, 0);

        return this;
    } // end eval
} // end Repeat

// ---------------------------------------------------------------------------------------------------------------------

module.exports = Repeat;

// ---------------------------------------------------------------------------------------------------------------------
