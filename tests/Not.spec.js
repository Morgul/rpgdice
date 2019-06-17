// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Not class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Not = require('../lib/Not');
const Num = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Not Class', () =>
{
    let not;
    beforeEach(() =>
    {
        not = new Not(new Num(5));
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(not)).to.equal('{"type":"not","content":{"type":"number","value":5}}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(not.toString()).to.equal('!5');
        expect(parser.parse(not.toString())).to.deep.equal(not);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            not = new Not(new Num(5));
            const results = not.eval();

            expect(results.value).to.exist;
            expect(results.value).to.equal(0);
        });

        it('has a value of 1 when content value is 0', () =>
        {
            not = new Not(new Num(0));
            const results = not.eval();

            expect(results.value).to.exist;
            expect(results.value).to.equal(1);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
