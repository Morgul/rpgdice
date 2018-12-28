//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const { rollDie } = require('./rolldie');

const { range } = require('./utils');

//---------------------------------------------------------------------------------------------------------------------

class Roll extends Expression
{
    constructor(count, sides)
    {
        super('roll');

        this.count = count;
        this.sides = sides;
        this.results = [];
    } // end Roll

    toString()
    {
        return `${ this.count }d${ this.sides }`;
    } // end toString

    render()
    {
        const roll = this.toString();
        return `{ ${ roll }: [ ${ this.results.join(', ') } ] }`;
    } // end render

    // noinspection JSAnnotator
    eval()
    {
        this.results = range(this.count).reduce((results) =>
        {
            results.push(rollDie(this.sides));
            return results;
        }, []);

        this.value = this.results.reduce((results, roll) => results + roll, 0);

        return this;
    }; // end eval
} // end Roll

//---------------------------------------------------------------------------------------------------------------------

module.exports = Roll;

//---------------------------------------------------------------------------------------------------------------------
