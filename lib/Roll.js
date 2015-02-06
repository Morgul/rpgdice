//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var Expression = require('./Expression');

//---------------------------------------------------------------------------------------------------------------------

function Roll(count, sides)
{
    this.count = count;
    this.sides = sides;

    Expression.call(this);
} // end Roll

util.inherits(Roll, Expression);

Roll.prototype.type = 'roll';

Roll.prototype.toString = function()
{
    return util.format('%sd%s', this.count, this.sides);
}; // end Roll#toString

//---------------------------------------------------------------------------------------------------------------------

module.exports = Roll;
