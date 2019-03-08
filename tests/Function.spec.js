// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Function class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Func = require('../lib/Function');
const Roll = require('../lib/Roll');
const Num = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Function Class', () =>
{
    let func, escapedFunc;
    beforeEach(() => 
    {
        func = new Func('foo', [new Roll(new Num(3), new Num(6))]);
        escapedFunc = new Func('Some Function', [new Roll(new Num(3), new Num(6))]);
    });

    it('can be converted to json', () => {
        expect(JSON.stringify(func)).to.equal('{"type":"function","name":"foo","args":[{"type":"roll","count":{"type":"number","value":3},"sides":{"type":"number","value":6},"results":[]}],"results":[]}')
    })

    it('can be converted to a parsable string', () => 
    {
        expect(func.toString()).to.equal('foo(3d6)');
        expect(parser.parse(func.toString())).to.deep.equal(func);

        expect(escapedFunc.toString()).to.equal("'Some Function'(3d6)");
        expect(parser.parse(escapedFunc.toString())).to.deep.equal(escapedFunc);
    });

    describe('#eval()', () =>
    {
        it('returns itself with the value populated', () =>
        {
            const results = func.eval({
                foo: function (expr, scope) {
                    this.expr = expr.eval(scope)
                    return this.expr.value + 1
                }
            });

            expect(results.value).to.exist;
            expect(results.value).to.equal(results.expr.value + 1);
        });

        it('throws an error if the function is not found on the scope, or is not a function', () =>
        {
            expect(func.eval.bind(func)).to.throw("'foo' is not a function on the provided scope.");
            expect(() => { func.eval({ foo: 'bleh' }) }).to.throw("'foo' is not a function on the provided scope.");
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------

