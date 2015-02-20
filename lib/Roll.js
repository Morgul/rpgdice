//---------------------------------------------------------------------------------------------------------------------
// A roll expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var _ = require('lodash');

var Expression = require('./Expression');
var rollDie = require('./rolldie').rollDie;

//---------------------------------------------------------------------------------------------------------------------

function Roll(count, sides)
{
    this.count = count;
    this.sides = sides;
    this.results = [];

    Expression.call(this);
} // end Roll

util.inherits(Roll, Expression);

Roll.prototype.type = 'roll';

Roll.prototype.toString = function()
{
    return util.format('%sd%s', this.count, this.sides);
}; // end Roll#toString

Roll.prototype.render = function()
{
    var roll = util.format('%sd%s', this.count, this.sides);
    return '{ ' + roll + ': [ ' + this.results.join(', ') + ' ] }';
}; // end Roll#render

Roll.prototype.eval = function()
{
    var self = this;
    this.results = _.reduce(_.range(this.count), function(results)
    {
        results.push(rollDie(self.sides));
        return results;
    }, []);

    this.value = _.reduce(this.results, function(results, roll) { return results + roll; }, 0);

    return this;
}; // end Roll#eval

//---------------------------------------------------------------------------------------------------------------------

module.exports = Roll;

//---------------------------------------------------------------------------------------------------------------------
