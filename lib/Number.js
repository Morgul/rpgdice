//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var _ = require('lodash');

var Expression = require('./Expression');

//---------------------------------------------------------------------------------------------------------------------

function Num(value)
{
    this.value = value;

    Expression.call(this);
} // end Num

util.inherits(Num, Expression);

Num.prototype.type = 'number';

Num.prototype.toString = function()
{
    return this.value.toString();
}; // end Num#toString

Num.prototype.eval = function()
{
    return this;
}; // end Num#eval

//---------------------------------------------------------------------------------------------------------------------

module.exports = Num;

//---------------------------------------------------------------------------------------------------------------------
