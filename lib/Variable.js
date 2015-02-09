//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var Expression = require('./Expression');

//---------------------------------------------------------------------------------------------------------------------

function Variable(name)
{
    this.name = name;

    Expression.call(this);
} // end Variable

util.inherits(Variable, Expression);

Variable.prototype.type = 'variable';

Variable.prototype.toString = function()
{
    return this.name;
}; // end Variable#toString

//---------------------------------------------------------------------------------------------------------------------

module.exports = Variable;
