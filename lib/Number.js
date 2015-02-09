//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var Expression = require('./Expression');

//---------------------------------------------------------------------------------------------------------------------

function Number(value)
{
    this.value = value;

    Expression.call(this);
} // end Number

util.inherits(Number, Expression);

Number.prototype.type = 'number';

Number.prototype.toString = function()
{
    return this.value.toString();
}; // end Number#toString

//---------------------------------------------------------------------------------------------------------------------

module.exports = Number;
