//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var Expression = require('./Expression');

//---------------------------------------------------------------------------------------------------------------------

function Repeat(count, right)
{
    this.count = count;
    this.right = right;

    Expression.call(this);
} // end Repeat

util.inherits(Repeat, Expression);

Repeat.prototype.type = 'repeat';

Repeat.prototype.toString = function()
{
    return util.format('%s(%s)', this.count, this.right.toString());
}; // end Repeat#toString

//---------------------------------------------------------------------------------------------------------------------

module.exports = Repeat;
