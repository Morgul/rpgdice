// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Factorial class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Factorial = require('../lib/Factorial');
const Num = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Factorial Class', () =>
{
    let factorial;
    beforeEach(() =>
    {
        factorial = new Factorial(new Num(3));
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(factorial)).to.equal('{"type":"factorial","content":{"type":"number","value":3}}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(factorial.toString()).to.equal('3!');
        expect(parser.parse(factorial.toString())).to.deep.equal(factorial);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            const factorial = new Factorial(new Num(3));
            const results = factorial.eval();

            expect(results.value).to.exist;
            expect(results.value).to.equal(6);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
