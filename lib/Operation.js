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

Operation.prototype.render = function()
{
    var op = this.type == 'add' ? '+' : this.type == 'subtract' ? '-' : this.type == 'multiply' ? '*' : '/';
    return util.format('%s %s %s', this.left.render(), op, this.right.render());
}; // end Operation#render

Operation.prototype.eval = function(scope)
{
    scope = defaultScope.buildDefaultScope(scope);

    this.left = this.left.eval(scope);
    this.right = this.right.eval(scope);

    switch(this.type)
    {
        case 'add':
            this.value = this.left.value + this.right.value;
            break;

        case 'subtract':
            this.value = this.left.value - this.right.value;
            break;

        case 'multiply':
            this.value = this.left.value * this.right.value;
            break;

        case 'divide':
            this.value = this.left.value / this.right.value;
            break;
    } // end switch

    return this;
}; // end Operation#eval

//----------------------------------------------------------------------------------------------------------------------

module.exports = Operation;

//----------------------------------------------------------------------------------------------------------------------