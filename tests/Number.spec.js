// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Number class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Num = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Number Class', () =>
{
    let number;
    beforeEach(() =>
    {
        number = new Num(3);
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(number)).to.equal('{"type":"number","value":3}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(number.toString()).to.equal('3');
        expect(parser.parse(number.toString())).to.deep.equal(number);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            const results = number.eval();

            // Ensure we populated value correctly
            expect(results.value).to.equal(3);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
