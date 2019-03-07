// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the parser.js module.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');

// ---------------------------------------------------------------------------------------------------------------------

describe('Dice Syntax Parser', () =>
{

    describe('Dice Syntax', () =>
    {
        it('supports `XdY` dice format', () =>
        {
            const results = parser.parse('3d6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });

        it('leaves count undefined if you only specify `dY`', () =>
        {
            const results = parser.parse('d6');

            expect(results.type).to.equal('roll');
            expect(results.count).to.not.exist;
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });

        it('supports `XdYdZ dice format as Xd(YdZ)', () =>
        {
            const results = parser.parse('3d1d6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'roll');
            expect(results).to.have.nested.property('sides.count.type', 'number');
            expect(results).to.have.nested.property('sides.count.value', 1);
            expect(results).to.have.nested.property('sides.sides.type', 'number');
            expect(results).to.have.nested.property('sides.sides.value', 6);
            
        });
    });

    describe('Mathematical Operations', () =>
    {
        it('supports addition', () =>
        {
            const results = parser.parse('3d6 + 4');

            expect(results.type).to.equal('add');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports subtraction', () =>
        {
            const results = parser.parse('3d6 - 4');

            expect(results.type).to.equal('subtract');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports multiplication', () =>
        {
            const results = parser.parse('3d6 * 4');

            expect(results.type).to.equal('multiply');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports division', () =>
        {
            const results = parser.parse('3d6 / 4');

            expect(results.type).to.equal('divide');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports modulo', () =>
        {
            const results = parser.parse('3d6 % 4');

            expect(results.type).to.equal('modulo');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports exponent', () =>
        {
            const results = parser.parse('3d6 ^ 4');

            expect(results.type).to.equal('exponent');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports order of operations', () =>
        {
            let results = parser.parse('3 + 2 - 5 * 4 / 6 % 7 ^ 9 * (1 + 2)');
            expect(results).to.have.property('type', 'subtract');
            expect(results).to.have.nested.property('left.type', 'add');
            expect(results).to.have.nested.property('left.left.type', 'number');
            expect(results).to.have.nested.property('left.left.value', 3);
            expect(results).to.have.nested.property('left.right.type', 'number');
            expect(results).to.have.nested.property('left.right.value', 2);
            expect(results).to.have.nested.property('right.type', 'multiply');
            expect(results).to.have.nested.property('right.left.type', 'modulo');
            expect(results).to.have.nested.property('right.left.left.type', 'divide');
            expect(results).to.have.nested.property('right.left.left.left.type', 'multiply');
            expect(results).to.have.nested.property('right.left.left.left.left.type', 'number');
            expect(results).to.have.nested.property('right.left.left.left.left.value', 5);
            expect(results).to.have.nested.property('right.left.left.left.right.type', 'number');
            expect(results).to.have.nested.property('right.left.left.left.right.value', 4);
            expect(results).to.have.nested.property('right.left.left.right.type', 'number');
            expect(results).to.have.nested.property('right.left.left.right.value', 6);
            expect(results).to.have.nested.property('right.left.right.type', 'exponent');
            expect(results).to.have.nested.property('right.left.right.left.type', 'number');
            expect(results).to.have.nested.property('right.left.right.left.value', 7);
            expect(results).to.have.nested.property('right.left.right.right.type', 'number');
            expect(results).to.have.nested.property('right.left.right.right.value', 9);
            expect(results).to.have.nested.property('right.right.type', 'parentheses');
            expect(results).to.have.nested.property('right.right.content.type', 'add');
            expect(results).to.have.nested.property('right.right.content.left.type', 'number');
            expect(results).to.have.nested.property('right.right.content.left.value', 1);
            expect(results).to.have.nested.property('right.right.content.right.type', 'number');
            expect(results).to.have.nested.property('right.right.content.right.value', 2);

            results = parser.parse('(2 + 1) * 9 ^ 7 % 6 / 4 * 5 - 2 + 3');
            expect(results).to.have.property('type', 'add');
            expect(results).to.have.nested.property('left.type', 'subtract');
            expect(results).to.have.nested.property('left.left.type', 'multiply');
            expect(results).to.have.nested.property('left.left.left.type', 'divide');
            expect(results).to.have.nested.property('left.left.left.left.type', 'modulo');
            expect(results).to.have.nested.property('left.left.left.left.left.type', 'multiply');
            expect(results).to.have.nested.property('left.left.left.left.left.left.type', 'parentheses');
            expect(results).to.have.nested.property('left.left.left.left.left.left.content.type', 'add');
            expect(results).to.have.nested.property('left.left.left.left.left.left.content.left.type', 'number');
            expect(results).to.have.nested.property('left.left.left.left.left.left.content.left.value', 2);
            expect(results).to.have.nested.property('left.left.left.left.left.left.content.right.type', 'number');
            expect(results).to.have.nested.property('left.left.left.left.left.left.content.right.value', 1);
            expect(results).to.have.nested.property('left.left.left.left.left.right.type', 'exponent');
            expect(results).to.have.nested.property('left.left.left.left.left.right.left.type', 'number');
            expect(results).to.have.nested.property('left.left.left.left.left.right.left.value', 9);
            expect(results).to.have.nested.property('left.left.left.left.left.right.right.type', 'number');
            expect(results).to.have.nested.property('left.left.left.left.left.right.right.value', 7);
            expect(results).to.have.nested.property('left.left.left.left.right.type', 'number');
            expect(results).to.have.nested.property('left.left.left.left.right.value', 6);
            expect(results).to.have.nested.property('left.left.left.right.type', 'number');
            expect(results).to.have.nested.property('left.left.left.right.value', 4);
            expect(results).to.have.nested.property('left.left.right.type', 'number');
            expect(results).to.have.nested.property('left.left.right.value', 5);
            expect(results).to.have.nested.property('left.right.type', 'number');
            expect(results).to.have.nested.property('left.right.value', 2);
            expect(results).to.have.nested.property('right.type', 'number');
            expect(results).to.have.nested.property('right.value', 3);
        });
    });

    describe('Repeats', () =>
    {
        it('supports implicit repeats with `X(...)`', () =>
        {
            const results = parser.parse('3(2d6 + 4)');
            expect(results.type).to.equal('repeat');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results.content).to.exist;
        });
    });

    describe('Variables', () =>
    {
        it('supports standard variable names', () =>
        {
            let results = parser.parse('foobar');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('foobar');

            results = parser.parse('fooBar239875');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('fooBar239875');
        });

        it('supports quoted variable names', () =>
        {
            let results = parser.parse('\'var with spaces\'');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('var with spaces');

            results = parser.parse('[var with spaces]');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('var with spaces');
        });

        it('supports (escaped) nested variables', () =>
        {
            let results = parser.parse('\'foo.bar.0.baz\'');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('foo.bar.0.baz');

            results = parser.parse('[foo.bar.0.baz]');
            expect(results.type).to.equal('variable');
            expect(results.name).to.equal('foo.bar.0.baz');
        });
    });

    describe('Functions', () =>
    {
        it('supports functions', () =>
        {
            const results = parser.parse('foobar(2d6)');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('foobar');
            expect(results).to.have.nested.property('args.length', 1);
            expect(results).to.have.nested.property('args[0].count.type', 'number');
            expect(results).to.have.nested.property('args[0].count.value', 2);
            expect(results).to.have.nested.property('args[0].sides.type', 'number');
            expect(results).to.have.nested.property('args[0].sides.value', 6);
        });

        it('supports functions with no arguments', () =>
        {
            const results = parser.parse('foobar()');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('foobar');
            expect(results.args).to.exist;
            expect(results.args.length).to.equal(0);
        });

        it('supports functions with multiple arguments', () =>
        {
            const results = parser.parse('foobar(2d6, 3)');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('foobar');
            expect(results).to.have.nested.property('args.length', 2);
            expect(results).to.have.nested.property('args[0].count.type', 'number');
            expect(results).to.have.nested.property('args[0].count.value', 2);
            expect(results).to.have.nested.property('args[0].sides.type', 'number');
            expect(results).to.have.nested.property('args[0].sides.value', 6);
            expect(results).to.have.nested.property('args[1].type', 'number');
            expect(results).to.have.nested.property('args[1].value', 3);
        });

        it('supports quoted names for functions', () =>
        {
            const results = parser.parse('\'func with spaces\'(2d6)');
            expect(results.type).to.equal('function');
            expect(results.name).to.equal('func with spaces');
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
