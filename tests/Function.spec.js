// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the Function.spec.js module.
//
// @module Function.spec.js
// ---------------------------------------------------------------------------------------------------------------------
"use strict";

var expect = require('chai').expect;

var parser = require('../lib/parser');
var Func = require('../lib/Function');
var Roll = require('../lib/Roll');

// ---------------------------------------------------------------------------------------------------------------------

describe('Function Class', function()
{
    var func, escapedFunc;
    beforeEach(function()
    {
        func = new Func('foo', [new Roll(3, 6)]);
        escapedFunc = new Func('Some Function', [new Roll(3, 6)]);
    });

    it('can be converted to json', function()
    {
        expect(JSON.stringify(func)).to.equal('{"type":"function","name":"foo","args":[{"type":"roll","count":3,"sides":6,"results":[]}],"results":[]}');
    });

    it('can be converted to a parsable string', function()
    {
        expect(func.toString()).to.equal('foo(3d6)');
        expect(parser.parse(func.toString())).to.deep.equal(func);

        expect(escapedFunc.toString()).to.equal("'Some Function'(3d6)");
        expect(parser.parse(escapedFunc.toString())).to.deep.equal(escapedFunc);
    });

    describe('#eval()', function()
    {
        it('returns itself with the value populated', function()
        {
            var results = func.eval({ foo: function(expr, scope)
                {
                    this.expr = expr.eval(scope);
                    return this.expr.value + 1
                }
            });

            expect(results.value).to.exist;
            expect(results.value).to.equal(results.expr.value + 1);
        });

        it('throws an error if the function is not found on the scope, or is not a function', function()
        {
            expect(func.eval.bind(func)).to.throw("'foo' is not a function on the provided scope.");
            expect(function(){ func.eval({ foo: 'bleh' }); }).to.throw("'foo' is not a function on the provided scope.");
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------