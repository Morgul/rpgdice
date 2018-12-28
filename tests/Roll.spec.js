// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Roll class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Roll = require('../lib/Roll');

// ---------------------------------------------------------------------------------------------------------------------

describe('Roll Class', () =>
{
    let roll;
    beforeEach(() =>
    {
        roll = new Roll(3, 6);
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(roll)).to.equal('{"type":"roll","count":3,"sides":6,"results":[]}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(roll.toString()).to.equal('3d6');
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
    });
});

// ---------------------------------------------------------------------------------------------------------------------
