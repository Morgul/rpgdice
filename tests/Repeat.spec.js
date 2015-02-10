// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Repeat.spec.js module.
//
// @module Repeat.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');
var Repeat = require('../lib/Repeat');
var Roll = require('../lib/Roll');

// ---------------------------------------------------------------------------------------------------------------------

describe('Repeat Class', function()
{
    var repeat;
    beforeEach(function()
    {
        repeat = new Repeat(3, new Roll(3, 6));
    });

    it('can be converted to json', function()
    {
        expect(JSON.stringify(repeat)).to.equal('{"type":"repeat","count":3,"right":{"type":"roll","count":3,"sides":6}}');
    });

    it('can be converted to a parsable string', function()
    {
        expect(repeat.toString()).to.equal('3(3d6)');
        expect(parser.parse(repeat.toString())).to.deep.equal(repeat);
    });
});

// ---------------------------------------------------------------------------------------------------------------------