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

Func.prototype.eval = function(scope)
{
    scope = defaultScope.buildDefaultScope(scope);

    var clone = _.clone(this);
    var func = scope[this.name];

    if(!_.isFunction(func))
    {
        var error = new Error("'" + this.name + "' is not a function on the provided scope.");
        error.scope = scope;

        throw(error);
    } // end if

    // Always pass the clone and scope as the last arguments
    clone.value = func.apply(clone, this.args.concat([clone, scope]));

    return clone;
}; // end Func#eval

//---------------------------------------------------------------------------------------------------------------------

module.exports = Func;

//---------------------------------------------------------------------------------------------------------------------
