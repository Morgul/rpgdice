//----------------------------------------------------------------------------------------------------------------------
// An operation expression
//
// @module Operation.js
//----------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var _ = require('lodash');

var Expression = require('./Expression');
var defaultScope = require('./defaultScope');

//----------------------------------------------------------------------------------------------------------------------

function Operation(type, left, right)
{
    this.type = type;
    this.left = left;
    this.right = right;

    Expression.call(this);
} // end Operation

util.inherits(Operation, Expression);

Operation.prototype.toString = function()
{
    var op = this.type == 'add' ? '+' : this.type == 'subtract' ? '-' : this.type == 'multiply' ? '*' : '/';
    return util.format('%s %s %s', this.left.toString(), op, this.right.toString());
}; // end Operation#toString

Operation.prototype.eval = function(scope)
{
    scope = defaultScope.buildDefaultScope(scope);

    var clone = _.clone(this);
    clone.left = this.left.eval(scope);
    clone.right = this.right.eval(scope);

    switch(this.type)
    {
        case 'add':
            clone.value = clone.left.value + clone.right.value;
            break;

        case 'subtract':
            clone.value = clone.left.value - clone.right.value;
            break;

        case 'multiply':
            clone.value = clone.left.value * clone.right.value;
            break;

        case 'divide':
            clone.value = clone.left.value / clone.right.value;
            break;
    } // end switch

    return clone;
}; // end Operation#eval

//----------------------------------------------------------------------------------------------------------------------

module.exports = Operation;

//----------------------------------------------------------------------------------------------------------------------