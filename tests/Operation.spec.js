// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Operation class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Num = require('../lib/Number');
const Operation = require('../lib/Operation');

// ---------------------------------------------------------------------------------------------------------------------

describe('Operation Class', () =>
{
    let op;
    beforeEach(() =>
    {
        op = new Operation('add', new Num(3), new Num(6));
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(op)).to.equal('{"type":"add","left":{"type":"number","value":3},"right":{"type":"number","value":6}}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(op.toString()).to.equal('3 + 6');
        expect(parser.parse(op.toString())).to.deep.equal(op);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            const results = op.eval();
            expect(results.value).to.exist;
            expect(results.value).to.equal(9);
        });

        it('stores the evaluation of both `left` and `right` properties', () =>
        {
            const results = op.eval();

            expect(results.left.value).to.exist;
            expect(results.left.type).to.equal('number');

            expect(results.right.value).to.exist;
            expect(results.right.type).to.equal('number');
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
