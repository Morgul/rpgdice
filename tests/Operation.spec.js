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

    describe('#eval()', function()
    {
        it('returns itself with the value populated', function()
        {
            var results = op.eval();
            expect(results.value).to.exist;
            expect(results.value).to.equal(9);
        });

        it('stores the evaluation of both `left` and `right` properties', function()
        {
            var results = op.eval();

            expect(results.left.value).to.exist;
            expect(results.left.type).to.equal('number');

            expect(results.right.value).to.exist;
            expect(results.right.type).to.equal('number');
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------