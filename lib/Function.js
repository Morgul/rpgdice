//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var Expression = require('./Expression');

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
}; // end needsEscaping

Func.prototype.toString = function()
{
    var name = this.needsEscaping() ? "'" + this.name + "'" : this.name;
    return util.format('%s(%s)', name, this.args.join(', '));
}; // end Func#toString

//---------------------------------------------------------------------------------------------------------------------

module.exports = Func;
