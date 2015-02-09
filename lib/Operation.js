//----------------------------------------------------------------------------------------------------------------------
// An operation expression
//
// @module Operation.js
//----------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var Expression = require('./Expression');

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
}; // end Roll#toString

//----------------------------------------------------------------------------------------------------------------------

module.exports = Operation;

//----------------------------------------------------------------------------------------------------------------------