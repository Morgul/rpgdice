// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Number.spec.js module.
//
// @module Number.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');
var Num = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Number Class', function()
{
    var number;
    beforeEach(function()
    {
        number = new Num(3);
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

    describe('#eval()', function()
    {
        it('returns itself with the value populated', function()
        {
            var results = number.eval();

            // Ensure we populated value correctly
            expect(results.value).to.equal(3);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------