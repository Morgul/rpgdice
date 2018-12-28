// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Variable class.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');
const Variable = require('../lib/Variable');

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
    });
});

// ---------------------------------------------------------------------------------------------------------------------
