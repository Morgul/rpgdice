// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Variable.spec.js module.
//
// @module Variable.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');
var Variable = require('../lib/Variable');

// ---------------------------------------------------------------------------------------------------------------------

describe('Variable Class', function()
{
    var variable, nestedVar, escapedVar;
    beforeEach(function()
    {
        variable = new Variable('foo');
        nestedVar = new Variable("foo.bar.0.baz");
        escapedVar = new Variable('This is a var!');
    });

    it('can be converted to json', function()
    {
        expect(JSON.stringify(variable)).to.equal('{"type":"variable","name":"foo"}');
    });

    it('can be converted to a parsable string', function()
    {
        expect(variable.toString()).to.equal('foo');
        expect(parser.parse(variable.toString())).to.deep.equal(variable);

        expect(escapedVar.toString()).to.equal("'This is a var!'");
        expect(parser.parse(escapedVar.toString())).to.deep.equal(escapedVar);
    });

    describe('#eval()', function()
    {
        it('returns itself with the value populated', function()
        {
            var results = variable.eval({ foo: 'bar' });

            // Ensure we populated value correctly
            expect(results.value).to.equal('bar');
        });

        it('supports nested variables', function()
        {
            var results = nestedVar.eval({ foo: { bar: [ { baz: 23 } ] } });
            expect(results.value).to.equal(23);
        });

        it('throws an error if the variable is not found in the scope', function()
        {
            expect(variable.eval.bind(variable)).to.throw("Variable '" + variable.name + "' not found in scope.");
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------