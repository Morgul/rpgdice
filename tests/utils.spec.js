// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the utils.js module.
// ---------------------------------------------------------------------------------------------------------------------

const { expect } = require('chai');

const utils = require('../lib/utils');

// ---------------------------------------------------------------------------------------------------------------------

describe('Utils', () =>
{
    describe('#get()', () =>
    {
        const object = { 'a': [{ 'b': { 'c': 3 } }] };

        it('gets the value at `path` of `object`', () =>
        {
            const results = utils.get(object, 'a[0].b.c');
            expect(results).to.equal(3);

            const results2 = utils.get(object, ['a', '0', 'b', 'c']);
            expect(results2).to.equal(3);
        });

        it('returns the `defaultValue` if the resolved value is `undefined`', () =>
        {
            const results = utils.get(object, 'a.b.c', 'default');
            expect(results).to.equal('default');

            const results2 = utils.get(object, ['a', 'b', 'c'], 'default');
            expect(results2).to.equal('default');
        });
    });

    describe('#range()', () =>
    {
        it('takes a single parameter, and assumes a `start` of 0, `end` of the parameter, `step` of 1', () =>
        {
            const results = utils.range(4);
            expect(results).to.be.an('array');
            expect(results).to.deep.equal([ 0, 1, 2, 3 ]);
        });

        it('takes a single negative parameter, and assumes a `start` of 0, `end` of the parameter, `step` of -1', () =>
        {
            const results = utils.range(-4);
            expect(results).to.be.an('array');
            expect(results).to.deep.equal([ 0, -1, -2, -3 ]);
        });

        it('takes a `start` and `stop` parameter, creating an array progressing from `start` up to, but not including, `end`.', () =>
        {
            const results = utils.range(1, 5);
            expect(results).to.be.an('array');
            expect(results).to.deep.equal([ 1, 2, 3, 4 ]);
        });

        it('takes three parameters, creating an array progressing from `start` up to, but not including, `end`, with appropriate step size.', () =>
        {
            const results = utils.range(0, 20, 5);
            expect(results).to.be.an('array');
            expect(results).to.deep.equal([ 0, 5, 10, 15 ]);

            const results2 = utils.range(5, 25, 5);
            expect(results2).to.be.an('array');
            expect(results2).to.deep.equal([ 5, 10, 15, 20 ]);
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------
