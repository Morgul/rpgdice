// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Operation.spec.js module.
//
// @module Operation.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');
var Num = require('../lib/Number');
var Operation = require('../lib/Operation');

// ---------------------------------------------------------------------------------------------------------------------

describe('Operation Class', function()
{
    var op;
    beforeEach(function()
    {
        op = new Operation('add', new Num(3), new Num(6));
    });

    it('can be converted to json', function()
    {
        expect(JSON.stringify(op)).to.equal('{"type":"add","left":{"type":"number","value":3},"right":{"type":"number","value":6}}');
    });

    it('can be converted to a parsable string', function()
    {
        expect(op.toString()).to.equal('3 + 6');
        expect(parser.parse(op.toString())).to.deep.equal(op);
    });
});

// ---------------------------------------------------------------------------------------------------------------------