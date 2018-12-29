// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Variable class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Variable = require('../lib/Variable');
const Roll = require('../lib/Roll');
const Operation = require('../lib/Operation');

// ---------------------------------------------------------------------------------------------------------------------

describe('Variable Class', () =>
{
    let variable, nestedVar, escapedVar;
    beforeEach(function()
    {
        variable = new Variable('foo');
        nestedVar = new Variable("foo.bar.0.baz");
        escapedVar = new Variable('This is a var!');
    });

    it('can be converted to json', () =>
    {
        expect(JSON.stringify(variable)).to.equal('{"type":"variable","name":"foo"}');
    });

    it('can be converted to a parsable string', () =>
    {
        expect(variable.toString()).to.equal('foo');
        expect(parser.parse(variable.toString())).to.deep.equal(variable);

        expect(escapedVar.toString()).to.equal("'This is a var!'");
        expect(parser.parse(escapedVar.toString())).to.deep.equal(escapedVar);
    });

    describe('#eval()', function()
    {
        it('returns itself with the value populated', () =>
        {
            const results = variable.eval({ foo: 'bar' });

            // Ensure we populated value correctly
            expect(results.value).to.equal('bar');
        });

        it('supports nested variables', function()
        {
            const results = nestedVar.eval({ foo: { bar: [ { baz: 23 } ] } });
            expect(results.value).to.equal(23);
        });

        it('throws an error if the variable is not found in the scope', () =>
        {
            expect(variable.eval.bind(variable)).to.throw("Variable '" + variable.name + "' not found in scope.");
        });

        it('expands parsable expressions', () =>
        {
            const results = variable.eval({ foo: '1 + 2' });
            expect(results.expr).to.be.instanceOf(Operation);
            expect(results.value).to.equal(3);

            const results2 = variable.eval({ foo: '1d6' });
            expect(results2.expr).to.be.instanceOf(Roll);
            expect(results2.value).to.be.at.least(1);
            expect(results2.value).to.be.at.most(6);
        });

        it('throws an error if evaluation becomes too deeply nested', () =>
        {
            expect(() => variable.eval({ foo: 'foo + 2' })).to.throw(Error).with.property('code', 'VAR_MAX_DEPTH');
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
