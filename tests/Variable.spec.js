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
    var variable, escapedVar;
    beforeEach(function()
    {
        variable = new Variable('foo');
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
});

// ---------------------------------------------------------------------------------------------------------------------