// ---------------------------------------------------------------------------------------------------------------------
// An repeat and sum expression.
// ---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

const { parse } = require('./parser');
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
        let content = this.content.render();

        if(this.results && this.results.length)
        {
            const results = this.results.reduce((results, result) =>
            {
                results.push(result.render());
                return results;
            }, []);

            content = results.join(', ');
        }

        return `${ this.count.render() }(${ content })`;
    } // end render

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.count = this.count.eval(scope, depth + 1);

        const count = Math.floor(Math.abs(this.count.value));

        this.results = range(count).reduce((results) =>
        {
            results.push(parse(this.content.toString()).eval(scope, depth + 1));
            return results;
        }, []);

        this.value = this.results.reduce((results, result) => results + result.value, 0);

        this.value *= (this.count.value < 0 ? -1 : 1);

        return this;
    } // end eval
} // end Repeat

// ---------------------------------------------------------------------------------------------------------------------

module.exports = Repeat;

// ---------------------------------------------------------------------------------------------------------------------
