// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Roll.spec.js module.
//
// @module Roll.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');
var Roll = require('../lib/Roll');

// ---------------------------------------------------------------------------------------------------------------------

describe('Roll Class', function()
{
    var roll;
    beforeEach(function()
    {
        roll = new Roll(3, 6);
    });

    it('can be converted to json', function()
    {
        expect(JSON.stringify(roll)).to.equal('{"type":"roll","count":3,"sides":6,"results":[]}');
    });

    it('can be converted to a parsable string', function()
    {
        expect(roll.toString()).to.equal('3d6');
        expect(parser.parse(roll.toString())).to.deep.equal(roll);
    });

    describe('#eval()', function()
    {
        it('returns itself with the value populated', function()
        {
            var results = roll.eval();

            expect(results.value).to.exist;
            expect(results.value).to.be.at.least(1);
            expect(results.value).to.be.at.most(18);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------