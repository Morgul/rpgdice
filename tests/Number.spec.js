// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Number.spec.js module.
//
// @module Number.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');
var Number = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Number Class', function()
{
    var number;
    beforeEach(function()
    {
        number = new Number(3);
    });

    it('can be converted to json', function()
    {
        expect(JSON.stringify(number)).to.equal('{"type":"number","value":3}');
    });

    it('can be converted to a parsable string', function()
    {
        expect(number.toString()).to.equal('3');
        expect(parser.parse(number.toString())).to.deep.equal(number);
    });
});

// ---------------------------------------------------------------------------------------------------------------------