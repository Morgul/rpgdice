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

Variable.prototype.needsEscaping = function()
{
    return !(/^[A-Za-z_][A-Za-z0-9_]+$/g.test(this.name));
}; // end needsEscaping

Variable.prototype.toString = function()
{
    return this.needsEscaping() ? "'" + this.name + "'" : this.name;
}; // end Variable#toString

//---------------------------------------------------------------------------------------------------------------------

module.exports = Variable;
