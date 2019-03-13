// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the defaultScope.js module.
// ---------------------------------------------------------------------------------------------------------------------

const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);

const { expect } = chai;
const proxyquire = require('proxyquire');

const rollDie = require('../lib/rolldie');
const parser = require('../lib/parser');

const Num = require('../lib/Number');

// ---------------------------------------------------------------------------------------------------------------------

describe('Default Scope', () =>
{
    let rollDieMock; let defaultScope;
    beforeEach(() =>
    {
        rollDieMock = {
            rollDie: chai.spy(rollDie.rollDie)
        };

        defaultScope = proxyquire('../lib/defaultScope', { './rolldie': rollDieMock });
    });

    afterEach(() =>
    {
        rollDieMock = {};
    });

    it('builds a scope that includes default functions', () =>
    {
        const scope = defaultScope.buildDefaultScope({ foo: 3 });
        expect(scope.floor).to.be.an.instanceOf(Function);
        expect(scope.foo).to.equal(3);
    });

    it('supports not passing in a scope', () =>
    {
        const scope = defaultScope.buildDefaultScope();
        expect(scope.floor).to.be.an.instanceOf(Function);
    });

    it('allows you to overwrite default functions', () =>
    {
        const scope = defaultScope.buildDefaultScope({ floor: 3 });
        expect(scope.floor).to.equal(3);
    });

    describe('Built-in functions', () =>
    {
        describe('min()', () =>
        {
            it('performs a min on the two passed in expressions', () =>
            {
                let expr = parser.parse('min(5,2)');
                let results = expr.eval();
                expect(results.value).to.equal(2);

                expr = parser.parse('10 + min(foo, 2)');
                results = expr.eval({ foo: 5 });
                expect(results.value).to.equal(12);
            });
        });

        describe('max()', () =>
        {
            it('performs a max on the two passed in expressions', () =>
            {
                let expr = parser.parse('max(5,2)');
                let results = expr.eval();
                expect(results.value).to.equal(5);

                expr = parser.parse('10 + max(foo, 2)');
                results = expr.eval({ foo: 5 });
                expect(results.value).to.equal(15);
            });
        });

        describe('floor()', () =>
        {
            it('performs a floor on the results of any operation', () =>
            {
                let expr = parser.parse('floor(5/2)');
                let results = expr.eval();
                expect(results.value).to.equal(2);

                expr = parser.parse('floor(3d6 / 2)');
                results = expr.eval();

                expect(results.value).to.equal(Math.floor(results.expr.value));
            });
        });

        describe('ceil()', () =>
        {
            it('performs a ceil on the results of any operation', () =>
            {
                let expr = parser.parse('ceil(5/2)');
                let results = expr.eval();
                expect(results.value).to.equal(3);

                expr = parser.parse('ceil(3d6 / 2)');
                results = expr.eval();

                expect(results.value).to.equal(Math.ceil(results.expr.value));
            });
        });

        describe('round()', () =>
        {
            it('performs a round on the results of any operation', () =>
            {
                let expr = parser.parse('round(5/2)');
                let results = expr.eval();
                expect(results.value).to.equal(3);

                expr = parser.parse('round(3d6 / 2)');
                results = expr.eval();

                expect(results.value).to.equal(Math.round(results.expr.value));
            });
        });

        describe('explode()', () =>
        {
            it('rolls the expression again every time the value equals the maximum, summing the results', () =>
            {
                const expr = parser.parse('explode(1d6)');
                let rolls = 0;

                // Replace the eval function on the Roll instance.
                expr.args[0].eval = () =>
                {
                    if(rolls < 3) { rolls++; return { sides: new Num(6), value: 6 }; }
                    else { return { sides: new Num(6), value: 5 }; }
                };

                const results = expr.eval();

                expect(results.value).to.equal(23);
                expect(results.results.length).to.equal(4);
            });

            it('throws an error if the expression is not a roll expression', () =>
            {
                const expr = parser.parse('explode(5)');
                expect(expr.eval.bind(expr)).to.throw("Non-roll passed to 'explode()': 5");
            });
        });

        describe('dropLowest()', () =>
        {
            it('removes the lowest result, and sums the remainder', () =>
            {
                const expr = parser.parse('dropLowest(3d6)');
                expr.args[0].eval = () =>
                {
                    return { results: [ 1, 1, 3, 4, 5 ] };
                };

                const results = expr.eval();

                expect(results.value).to.equal(13);
                expect(results.results.length).to.equal(4);
            });

            it('throws an error if the expression is not a roll expression', () =>
            {
                const expr = parser.parse('dropLowest(5)');
                expect(expr.eval.bind(expr)).to.throw("Non-roll passed to 'dropLowest()': 5");
            });
        });

        describe('dropHighest()', () =>
        {
            it('removes the highest result, and sums the remainder', () =>
            {
                const expr = parser.parse('dropHighest(3d6)');
                expr.args[0].eval = () =>
                {
                    return { results: [ 1, 1, 3, 4, 5 ] };
                };

                const results = expr.eval();

                expect(results.value).to.equal(9);
                expect(results.results.length).to.equal(4);
            });

            it('throws an error if the expression is not a roll expression', () =>
            {
                const expr = parser.parse('dropHighest(5)');
                expect(expr.eval.bind(expr)).to.throw("Non-roll passed to 'dropHighest()': 5");
            });
        });

        describe('rerollAbove()', () =>
        {
            it('rerolls any dice above the give maximum', () =>
            {
                const expr = parser.parse('rerollAbove(4, 5d6)');
                expr.args[1].eval = () =>
                {
                    return { results: [ 1, 1, 3, 4, 5 ], sides: 6, count: 5 };
                };

                const results = expr.eval(defaultScope.defaultScope);
                expect(results.results.length).to.equal(5);
                expect(rollDieMock.rollDie).to.have.been.called.exactly(2);
                expect(results.results[0]).to.equal(1);
                expect(results.results[1]).to.equal(1);
                expect(results.results[2]).to.equal(3);
            });

            it('throws an error if the expression is not a roll expression', () =>
            {
                const expr = parser.parse('rerollAbove(1, 5)');
                expect(expr.eval.bind(expr)).to.throw("Non-roll passed to 'rerollAbove()': 5");
            });

            it('throws an error if the maximum value is not a number', () =>
            {
                const expr = parser.parse('rerollAbove(foo, 5d6)');
                expect(() => { expr.eval({ foo: 'bleh' }); }).to.throw("Non-finite number passed to 'rerollAbove()': bleh");
            });
        });

        describe('rerollBelow()', () =>
        {
            it('rerolls any results below the given minimum', () =>
            {
                const expr = parser.parse('rerollBelow(1, 5d6)');
                expr.args[1].eval = () =>
                {
                    return { results: [ 1, 1, 3, 4, 5 ], sides: 6, count: 5 };
                };

                const results = expr.eval(defaultScope.defaultScope);
                expect(results.results.length).to.equal(5);
                expect(rollDieMock.rollDie).to.have.been.called.exactly(2);
                expect(results.results[2]).to.equal(3);
                expect(results.results[3]).to.equal(4);
                expect(results.results[4]).to.equal(5);
            });

            it('throws an error if the expression is not a roll expression', () =>
            {
                const expr = parser.parse('rerollBelow(1, 5)');
                expect(expr.eval.bind(expr)).to.throw("Non-roll passed to 'rerollBelow()': 5");
            });

            it('throws an error if the minimum value is not a number', () =>
            {
                const expr = parser.parse('rerollBelow(foo, 5d6)');
                expect(() => { expr.eval({ foo: 'bleh' }); }).to.throw("Non-finite number passed to 'rerollBelow()': bleh");
            });
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
