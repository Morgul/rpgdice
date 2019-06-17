// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Conditional class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Num = require('../lib/Number');
const Operation = require('../lib/Operation');
const Conditional = require('../lib/Conditional');

// ---------------------------------------------------------------------------------------------------------------------

describe('Conditional Class', () =>
{
    let conditional;
    beforeEach(() =>
    {
        conditional = new Conditional(new Operation('>=', new Num(6), new Num(3)), new Num(3), new Num(6));
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(conditional)).to.equal('{"type":"conditional","condition":{"type":"greaterThanOrEqual","left":{"type":"number","value":6},"right":{"type":"number","value":3}},"thenExpr":{"type":"number","value":3},"elseExpr":{"type":"number","value":6}}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(conditional.toString()).to.equal('6 >= 3 ? 3 : 6');
        expect(parser.parse(conditional.toString())).to.deep.equal(conditional);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            const results = conditional.eval();
            expect(results.value).to.exist;
            expect(results.value).to.equal(3);
        });

        it('stores the evaluation of `condition`, `thenExpr`, and `elseExpr` properties', () =>
        {
            const results = conditional.eval();

            expect(results.condition.value).to.exist;
            expect(results.condition.type).to.equal('greaterThanOrEqual');

            expect(results.thenExpr.value).to.exist;
            expect(results.thenExpr.type).to.equal('number');

            expect(results.elseExpr.value).to.exist;
            expect(results.elseExpr.type).to.equal('number');
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
