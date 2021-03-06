// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the parser.js module.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const parser = require('../lib/parser');

// ---------------------------------------------------------------------------------------------------------------------

describe('Dice Syntax Parser', () =>
{
    describe('White Space', () =>
    {
        it('supports omitting whitespace', () =>
        {
            const results = parser.parse('  3 \r\n d\t  6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });

        it('supports omitting comments', () =>
        {
            const results = parser.parse('/* comment */3d/* comment 3d6 */6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });
    });

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

        it('supports a negative count', () =>
        {
            const results = parser.parse('-3d6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', -3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });

        it('supports a float count', () =>
        {
            const results = parser.parse('3.75d6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3.75);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });

        it('supports a factorial count', () =>
        {
            const results = parser.parse('3!d6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'factorial');
            expect(results).to.have.nested.property('count.content.type', 'number');
            expect(results).to.have.nested.property('count.content.value', 3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });

        it('supports a parentheses count', () =>
        {
            const results = parser.parse('(3)d6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'parentheses');
            expect(results).to.have.nested.property('count.content.type', 'number');
            expect(results).to.have.nested.property('count.content.value', 3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6);
        });

        it('supports a negative number of sides', () =>
        {
            const results = parser.parse('3d-6');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', -6);
        });

        it('supports a float number of sides', () =>
        {
            const results = parser.parse('3d6.75');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'number');
            expect(results).to.have.nested.property('sides.value', 6.75);
        });

        it('supports a factorial number of sides', () =>
        {
            const results = parser.parse('3d6!');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'factorial');
            expect(results).to.have.nested.property('sides.content.type', 'number');
            expect(results).to.have.nested.property('sides.content.value', 6);
        });

        it('supports a dice roll number of sides', () =>
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

        it('supports a parentheses number of sides', () =>
        {
            const results = parser.parse('3d(6)');

            expect(results.type).to.equal('roll');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3);
            expect(results).to.have.nested.property('sides.type', 'parentheses');
            expect(results).to.have.nested.property('sides.content.type', 'number');
            expect(results).to.have.nested.property('sides.content.value', 6);
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
            let results = parser.parse('3 + 2 - 5 * 4 / 6 % 7 ^ 9 ^ 2 * (1 + 2)');
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
            expect(results).to.have.nested.property('right.left.right.right.type', 'exponent');
            expect(results).to.have.nested.property('right.left.right.right.left.type', 'number');
            expect(results).to.have.nested.property('right.left.right.right.left.value', 9);
            expect(results).to.have.nested.property('right.left.right.right.right.type', 'number');
            expect(results).to.have.nested.property('right.left.right.right.right.value', 2);
            expect(results).to.have.nested.property('right.right.type', 'parentheses');
            expect(results).to.have.nested.property('right.right.content.type', 'add');
            expect(results).to.have.nested.property('right.right.content.left.type', 'number');
            expect(results).to.have.nested.property('right.right.content.left.value', 1);
            expect(results).to.have.nested.property('right.right.content.right.type', 'number');
            expect(results).to.have.nested.property('right.right.content.right.value', 2);

            results = parser.parse('(2 + 1) * 2 ^ 9 ^ 7 % 6 / 4 * 5 - 2 + 3');
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
            expect(results).to.have.nested.property('left.left.left.left.left.right.left.value', 2);
            expect(results).to.have.nested.property('left.left.left.left.left.right.right.type', 'exponent');
            expect(results).to.have.nested.property('left.left.left.left.left.right.right.left.type', 'number');
            expect(results).to.have.nested.property('left.left.left.left.left.right.right.left.value', 9);
            expect(results).to.have.nested.property('left.left.left.left.left.right.right.right.type', 'number');
            expect(results).to.have.nested.property('left.left.left.left.left.right.right.right.value', 7);
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

    describe('Boolean Operations', () =>
    {
        it('supports not', () =>
        {
            const results = parser.parse('!5');

            expect(results.type).to.equal('not');
            expect(results.content).to.have.property('type', 'number');
        });

        it('supports equal', () =>
        {
            const results = parser.parse('1d20 == 5');

            expect(results.type).to.equal('equal');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports notEqual', () =>
        {
            const results = parser.parse('1d20 != 5');

            expect(results.type).to.equal('notEqual');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports greaterThan', () =>
        {
            const results = parser.parse('1d20 > 5');

            expect(results.type).to.equal('greaterThan');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports lessThan', () =>
        {
            const results = parser.parse('1d20 < 5');

            expect(results.type).to.equal('lessThan');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports greaterThanOrEqual', () =>
        {
            const results = parser.parse('1d20 >= 5');

            expect(results.type).to.equal('greaterThanOrEqual');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports lessThanOrEqual', () =>
        {
            const results = parser.parse('1d20 <= 5');

            expect(results.type).to.equal('lessThanOrEqual');
            expect(results.left).to.have.property('type', 'roll');
            expect(results.right).to.have.property('type', 'number');
        });
    });

    describe('Logical Operations', () =>
    {
        it('supports or', () =>
        {
            const results = parser.parse('0 || 10');

            expect(results.type).to.equal('or');
            expect(results.left).to.have.property('type', 'number');
            expect(results.right).to.have.property('type', 'number');
        });

        it('supports and', () =>
        {
            const results = parser.parse('0 && 10');

            expect(results.type).to.equal('and');
            expect(results.left).to.have.property('type', 'number');
            expect(results.right).to.have.property('type', 'number');
        });
    });

    describe('Conditionals', () =>
    {
        it('supports conditionals', () =>
        {
            const results = parser.parse('1d20 + 5 >= 10 ? 2d8 + 3 : 0');

            expect(results.type).to.equal('conditional');
            expect(results.condition).to.have.property('type', 'greaterThanOrEqual');
            expect(results.thenExpr).to.have.property('type', 'add');
            expect(results.elseExpr).to.have.property('type', 'number');
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

        it('supports a negative count', () =>
        {
            const results = parser.parse('-3(2d6 + 4)');
            expect(results.type).to.equal('repeat');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', -3);
            expect(results.content).to.exist;
        });

        it('supports a float count', () =>
        {
            const results = parser.parse('3.75(2d6 + 4)');
            expect(results.type).to.equal('repeat');
            expect(results).to.have.nested.property('count.type', 'number');
            expect(results).to.have.nested.property('count.value', 3.75);
            expect(results.content).to.exist;
        });

        it('supports a factorial count', () =>
        {
            const results = parser.parse('3!(2d6 + 4)');
            expect(results.type).to.equal('repeat');
            expect(results).to.have.nested.property('count.type', 'factorial');
            expect(results).to.have.nested.property('count.content.type', 'number');
            expect(results).to.have.nested.property('count.content.value', 3);
            expect(results.content).to.exist;
        });

        it('supports a parentheses count', () =>
        {
            const results = parser.parse('(3)(2d6 + 4)');
            expect(results.type).to.equal('repeat');
            expect(results).to.have.nested.property('count.type', 'parentheses');
            expect(results).to.have.nested.property('count.content.type', 'number');
            expect(results).to.have.nested.property('count.content.value', 3);
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

    describe('Speed', () =>
    {
        it('performs long parses quickly', () =>
        {
            const start = Date.now();
            const results = parser.parse('5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 5');
            const end = Date.now();

            expect(results.type).to.equal('add');

            const time = (end - start);
            if(time > 500) 
            {
                throw Error(`Parse took ${ time }ms!`);
            }
        });

        // Future test we hope to be able to clear, currently not consistant due to limitations in PEG.js
        /*
        it('performs deeply nested parses quickly', () =>
        {
            const start = Date.now();
            const results = parser.parse('((((((((5))))))))');
            const end = Date.now();

            expect(results.type).to.equal('parentheses');

            const time = (end - start);
            if(time > 500) 
            {
                throw Error(`Parse took ${ time }ms!`);
            }
        });
        */
    });
});

// ---------------------------------------------------------------------------------------------------------------------
