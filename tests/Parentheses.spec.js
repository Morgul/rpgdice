// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Parentheses class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Parentheses = require('../lib/Parentheses');
const Num = require('../lib/Number');
const Roll = require('../lib/Roll');

// ---------------------------------------------------------------------------------------------------------------------

describe('Parentheses Class', () =>
{
    let parentheses;
    beforeEach(() =>
    {
        parentheses = new Parentheses(new Roll(new Num(3), new Num(6)));
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(parentheses)).to.equal('{"type":"parentheses","content":{"type":"roll","count":{"type":"number","value":3},"sides":{"type":"number","value":6},"results":[]}}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(parentheses.toString()).to.equal('(3d6)');
        expect(parser.parse(parentheses.toString())).to.deep.equal(parentheses);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            parentheses = new Parentheses(new Num(5));
            const results = parentheses.eval();

            expect(results.value).to.exist;
            expect(results.value).to.equal(5);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
