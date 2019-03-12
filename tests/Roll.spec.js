// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Roll class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Roll = require('../lib/Roll');
const Num = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Roll Class', () =>
{
    let roll;
    beforeEach(() =>
    {
        roll = new Roll(new Num(3), new Num(6));
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(roll)).to.equal('{"type":"roll","count":{"type":"number","value":3},"sides":{"type":"number","value":6},"results":[]}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(roll.toString()).to.equal('3d6');
        expect(parser.parse(roll.toString())).to.deep.equal(roll);

        roll = new Roll(undefined, new Num(6));

        expect(roll.toString()).to.equal('d6');
        expect(parser.parse(roll.toString())).to.deep.equal(roll);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            const results = roll.eval();

            expect(results.value).to.exist;
            expect(results.value).to.be.at.least(1);
            expect(results.value).to.be.at.most(18);
        });

        it('assumes count equals 1 if count is undefined', () =>
        {
            roll = new Roll(undefined, new Num(6));

            const results = roll.eval();

            expect(results.results).to.exist;
            expect(results.results.length).to.equal(1);
            expect(results.value).to.exist;
            expect(results.value).to.be.at.least(1);
            expect(results.value).to.be.at.most(6);
        });

        it('allows a negative count', () =>
        {
            roll = new Roll(new Num(-1), new Num(6));

            const results = roll.eval();

            expect(results.results).to.exist;
            expect(results.results.length).to.equal(1);
            expect(results.value).to.exist;
            expect(results.value).to.be.at.most(-1);
            expect(results.value).to.be.at.least(-6);
        });

        it('allows a float count, floored', () =>
        {
            roll = new Roll(new Num(1.75), new Num(6));

            const results = roll.eval();

            expect(results.results).to.exist;
            expect(results.results.length).to.equal(1);
            expect(results.value).to.exist;
            expect(results.value).to.be.at.least(1);
            expect(results.value).to.be.at.most(6);
        });

        it('allows a negative number of sides', () =>
        {
            roll = new Roll(new Num(1), new Num(-3));

            const results = roll.eval();

            expect(results.results).to.exist;
            expect(results.value).to.exist;
            expect(results.value).to.be.at.least(-3);
            expect(results.value).to.be.at.most(-1);
        });

        it('allows a float number of sides, floored', () =>
        {
            roll = new Roll(new Num(1), new Num(6.75));

            const results = roll.eval();

            expect(results.results).to.exist;
            expect(results.results.length).to.equal(1);
            expect(results.value).to.exist;
            expect(results.value).to.be.at.least(1);
            expect(results.value).to.be.at.most(6);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
