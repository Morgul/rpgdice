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
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports subtraction', function()
        {
            var results = parser.parse('3d6 - 4');

            expect(results.type).to.equal('subtract');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports multiplication', function()
        {
            var results = parser.parse('3d6 * 4');

            expect(results.type).to.equal('multiply');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports division', function()
        {
            var results = parser.parse('3d6 / 4');

            expect(results.type).to.equal('divide');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports order of operations', function()
        {
            var results = parser.parse('3 + 2 - 5 * 4 / 6');
            expect(results).to.have.property('type', 'add');
            expect(results).to.have.nested.property('left.value', 3);
            expect(results).to.have.nested.property('right.type', 'subtract');
            expect(results).to.have.nested.property('right.left.value', 2);
            expect(results).to.have.nested.property('right.right.type', 'multiply');
            expect(results).to.have.nested.property('right.right.left.value', 5);
            expect(results).to.have.nested.property('right.right.right.type', 'divide');
            expect(results).to.have.nested.property('right.right.right.left.value', 4);
            expect(results).to.have.nested.property('right.right.right.right.value', 6);

            results = parser.parse('6 / 4 * 5 - 2 + 3');
            expect(results).to.have.property('type', 'subtract');
            expect(results).to.have.nested.property('left.type', 'divide');
            expect(results).to.have.nested.property('left.left.value', 6);
            expect(results).to.have.nested.property('left.right.type', 'multiply');
            expect(results).to.have.nested.property('left.right.left.value', 4);
            expect(results).to.have.nested.property('left.right.right.value', 5);
            expect(results).to.have.nested.property('right.type', 'add');
            expect(results).to.have.nested.property('right.left.value', 2);
            expect(results).to.have.nested.property('right.right.value', 3);
        });
    });

    describe('Grouping', function()
    {
        it('grouping overrides order of operations', function()
        {
            var results = parser.parse('(3 + 2) * 4');
            expect(results).to.have.property('type', 'multiply');
            expect(results).to.have.nested.property('left.type', 'add');
            expect(results).to.have.nested.property('left.left.value', 3);
            expect(results).to.have.nested.property('left.right.value', 2);
            expect(results).to.have.nested.property('right.value', 4);
        });

        it('supports implicit repeats with `X(...)`', function()
        {
            var results = parser.parse('3(2d6 + 4)');
            expect(results.type).to.equal('repeat');
            expect(results.count).to.equal(3);
        });
    });

    describe('Variables', function()
    {
        it('supports standard variable names', function()
        {
            var results = parser.parse('foobar');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('foobar');

            results = parser.parse('fooBar239875');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('fooBar239875');
        });

        it('supports quoted variable names', function()
        {
            var results = parser.parse("'var with spaces'");
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('var with spaces');

            results = parser.parse('[var with spaces]');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('var with spaces');
        });

        it('supports (escaped) nested variables', function()
        {
            var results = parser.parse("'foo.bar.0.baz'");
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('foo.bar.0.baz');

            results = parser.parse('[foo.bar.0.baz]');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('foo.bar.0.baz');
        });
    });

    describe('Functions', function()
    {
        it('supports functions', function()
        {
            var results = parser.parse('foobar(2d6)');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('foobar');
            expect(results).to.have.nested.property('args.length', 1);
            expect(results).to.have.nested.property('args[0].count', 2);
            expect(results).to.have.nested.property('args[0].sides', 6);
        });

        it('supports functions with no arguments', function()
        {
            var results = parser.parse('foobar()');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('foobar');
        });

        it('supports functions with multiple arguments', function()
        {
            var results = parser.parse('foobar(2d6, 3)');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('foobar');
            expect(results).to.have.nested.property('args.length', 2);
            expect(results).to.have.nested.property('args[0].count', 2);
            expect(results).to.have.nested.property('args[0].sides', 6);
            expect(results).to.have.nested.property('args[1].type', 'number');
            expect(results).to.have.nested.property('args[1].value', 3);
        });

        it('supports quoted names for functions', function()
        {
            var results = parser.parse('\'func with spaces\'(2d6)');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('func with spaces');
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
