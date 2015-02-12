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
}; // end Variable#needsEscaping

Variable.prototype.toString = function()
{
    return this.needsEscaping() ? "'" + this.name + "'" : this.name;
}; // end Variable#toString

Variable.prototype.eval = function(scope)
{
    scope = defaultScope.buildDefaultScope(scope);
    var clone = _.clone(this);
    clone.value = scope[this.name];

    if(clone.value === undefined)
    {
        var error = new Error("Variable '" + this.name + "' not found in scope.");
        error.scope = scope;

        throw error;
    } // end if

    return clone;
}; // end Variable#eval

//---------------------------------------------------------------------------------------------------------------------

module.exports = Variable;

//---------------------------------------------------------------------------------------------------------------------
