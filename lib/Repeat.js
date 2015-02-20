//---------------------------------------------------------------------------------------------------------------------
// An repeat and sum expression.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var util = require('util');

var _ = require('lodash');

var Expression = require('./Expression');
var defaultScope = require('./defaultScope');

//---------------------------------------------------------------------------------------------------------------------

function Repeat(count, right)
{
    this.count = count;
    this.right = right;

    Expression.call(this);
} // end Repeat

util.inherits(Repeat, Expression);

Repeat.prototype.type = 'repeat';

Repeat.prototype.toString = function()
{
    return util.format('%s(%s)', this.count, this.right.toString());
}; // end Repeat#toString

Repeat.prototype.render = function()
{
    return util.format('%s(%s)', this.count, this.right.render());
}; // end Repeat#render

Repeat.prototype.eval = function(scope)
{
    scope = defaultScope.buildDefaultScope(scope);

    var self = this;
    this.results = _.reduce(_.range(this.count), function(results)
    {
        results.push(self.right.eval(scope));
        return results;
    }, []);

    this.value = _.reduce(this.results, function(results, result) { return results + result.value; }, 0);

    return this;
}; // end Repeat#eval

//---------------------------------------------------------------------------------------------------------------------

module.exports = Repeat;

//---------------------------------------------------------------------------------------------------------------------
