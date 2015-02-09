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
    this.args = args;

    Expression.call(this);
} // end Func

util.inherits(Func, Expression);

Func.prototype.type = 'function';

Func.prototype.toString = function()
{
    return util.format('%s(%s)', this.name, this.args.join(', '));
}; // end Func#toString

//---------------------------------------------------------------------------------------------------------------------

module.exports = Func;
