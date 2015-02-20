//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var _ = require('lodash');

var Expression = require('./Expression');
var defaultScope = require('./defaultScope');

//---------------------------------------------------------------------------------------------------------------------

function Func(name, args)
{
    this.name = name;
    this.args = args || [];
    this.results = [];

    Expression.call(this);
} // end Func

util.inherits(Func, Expression);

Func.prototype.type = 'function';

Func.prototype.needsEscaping = function()
{
    return !(/^[A-Za-z_][A-Za-z0-9_]+$/g.test(this.name));
}; // end Func#needsEscaping

Func.prototype.toString = function()
{
    var name = this.needsEscaping() ? "'" + this.name + "'" : this.name;
    return util.format('%s(%s)', name, this.args.join(', '));
}; // end Func#toString

Func.prototype.render = function()
{
    var name = this.needsEscaping() ? "'" + this.name + "'" : this.name;
    var args = _.reduce(this.args, function(results, arg){ results.push(arg.render()); return results; }, []);
    return util.format('{ %s(%s): %s }', name, args.join(', '), this.value);
}; // end Func#render

Func.prototype.eval = function(scope)
{
    scope = defaultScope.buildDefaultScope(scope);

    var func = scope[this.name];

    if(!_.isFunction(func))
    {
        var error = new Error("'" + this.name + "' is not a function on the provided scope.");
        error.scope = scope;

        throw(error);
    } // end if

    // Always pass the this and scope as the last arguments
    this.value = func.apply(this, this.args.concat([scope]));

    return this;
}; // end Func#eval

//---------------------------------------------------------------------------------------------------------------------

module.exports = Func;

//---------------------------------------------------------------------------------------------------------------------
