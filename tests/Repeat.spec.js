// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Repeat class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Repeat = require('../lib/Repeat');
const Num = require('../lib/Number');
const Roll = require('../lib/Roll');

// ---------------------------------------------------------------------------------------------------------------------

describe('Repeat Class', () =>
{
    let repeat;
    beforeEach(() =>
    {
        repeat = new Repeat(3, new Roll(3, 6));
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(repeat)).to.equal('{"type":"repeat","count":3,"right":{"type":"roll","count":3,"sides":6,"results":[]}}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(repeat.toString()).to.equal('3(3d6)');
        expect(parser.parse(repeat.toString())).to.deep.equal(repeat);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            repeat = new Repeat(3, new Num(5));
            const results = repeat.eval();

            expect(results.value).to.exist;
            expect(results.value).to.equal(15);
        });

        it('stores the results of each iteration in the `results` property', () =>
        {
            repeat = new Repeat(3, new Num(5));
            const results = repeat.eval();

            expect(results.value).to.exist;
            expect(results.results.length).to.equal(3);
            expect(results.results[0].type).to.equal('number');
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
