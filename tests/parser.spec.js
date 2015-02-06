// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the parser.spec.js module.
//
// @module parser.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');

// ---------------------------------------------------------------------------------------------------------------------

describe('Dice Syntax Parser', function()
{

    beforeEach(function()
    {
        // Code goes here.
    });

    describe('Dice Syntax', function()
    {
        it('supports `XdY` dice format', function()
        {
            var results = parser.parse('3d6');

            expect(results.type).to.equal('roll');
            expect(results.count).to.equal(3);
            expect(results.sides).to.equal(6);
        });

        it('assumes 1 if you only specify `dY`', function()
        {
            var results = parser.parse('d6');

            expect(results.type).to.equal('roll');
            expect(results.count).to.equal(1);
            expect(results.sides).to.equal(6);
        });
    });

    describe('Mathematical Operations', function()
    {
        it('supports addition', function()
        {
            var results = parser.parse('3d6 + 4');

            expect(results.type).to.equal('add');
            expect(results.left).to.have.deep.property('type', 'roll');
            expect(results.right).to.have.deep.property('type', 'number');
        });

        it('supports subtraction', function()
        {
            var results = parser.parse('3d6 - 4');

            expect(results.type).to.equal('subtract');
            expect(results.left).to.have.deep.property('type', 'roll');
            expect(results.right).to.have.deep.property('type', 'number');
        });

        it('supports multiplication', function()
        {
            var results = parser.parse('3d6 * 4');

            expect(results.type).to.equal('multiply');
            expect(results.left).to.have.deep.property('type', 'roll');
            expect(results.right).to.have.deep.property('type', 'number');
        });

        it('supports division', function()
        {
            var results = parser.parse('3d6 / 4');

            expect(results.type).to.equal('divide');
            expect(results.left).to.have.deep.property('type', 'roll');
            expect(results.right).to.have.deep.property('type', 'number');
        });

        it('supports order of operations', function()
        {
            var results = parser.parse('3 + 2 - 5 * 4 / 6');
            expect(results).to.have.deep.property('type', 'add');
            expect(results).to.have.deep.property('left.value', 3);
            expect(results).to.have.deep.property('right.type', 'subtract');
            expect(results).to.have.deep.property('right.left.value', 2);
            expect(results).to.have.deep.property('right.right.type', 'multiply');
            expect(results).to.have.deep.property('right.right.left.value', 5);
            expect(results).to.have.deep.property('right.right.right.type', 'divide');
            expect(results).to.have.deep.property('right.right.right.left.value', 4);
            expect(results).to.have.deep.property('right.right.right.right.value', 6);

            results = parser.parse('6 / 4 * 5 - 2 + 3');
            expect(results).to.have.deep.property('type', 'subtract');
            expect(results).to.have.deep.property('left.type', 'divide');
            expect(results).to.have.deep.property('left.left.value', 6);
            expect(results).to.have.deep.property('left.right.type', 'multiply');
            expect(results).to.have.deep.property('left.right.left.value', 4);
            expect(results).to.have.deep.property('left.right.right.value', 5);
            expect(results).to.have.deep.property('right.type', 'add');
            expect(results).to.have.deep.property('right.left.value', 2);
            expect(results).to.have.deep.property('right.right.value', 3);
        });
    });

    describe('Grouping', function()
    {
        xit('grouping overrides order of operations', function()
        {
        });

        xit('supports implicit repeats with `X(...)`', function()
        {
        });
    });

    describe('Variables', function()
    {
        xit('supports standard variable names', function()
        {
        });

        xit('supports quoted variable names', function()
        {
        });
    });

    describe('Functions', function()
    {
        xit('supports functions', function()
        {
        });

        xit('supports functions with multiple arguments', function()
        {
        });

        xit('supports quoted names for functions', function()
        {
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------