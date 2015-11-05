//----------------------------------------------------------------------------------------------------------------------
// This is the default scope for dice evaluations
//
// @module defaultScope.js
//----------------------------------------------------------------------------------------------------------------------
"use strict";

var _ = require('lodash');

var rollDie = require('./rolldie').rollDie;

//----------------------------------------------------------------------------------------------------------------------

var defaultScope = {
    min: function(expr1, expr2, scope)
    {
        expr1 = expr1.eval(scope);

        if(!_.isNumber(expr1.value))
        {
            var error = new Error("Non-number passed to 'rerollBelow()': " + expr1.value);
            error.expr = expr1;

            throw error;
        } // end if

        expr2 = expr2.eval(scope);

        if(!_.isNumber(expr2.value))
        {
            var error = new Error("Non-number passed to 'rerollBelow()': " + expr2.value);
            error.expr = expr2;

            throw error;
        } // end if

        return Math.min(expr1, expr2);
    },
    max: function(expr1, expr2, scope)
    {
        expr1 = expr1.eval(scope);

        if(!_.isNumber(expr1.value))
        {
            var error = new Error("Non-number passed to 'rerollBelow()': " + expr1.value);
            error.expr = expr1;

            throw error;
        } // end if

        expr2 = expr2.eval(scope);

        if(!_.isNumber(expr2.value))
        {
            var error = new Error("Non-number passed to 'rerollBelow()': " + expr2.value);
            error.expr = expr2;

            throw error;
        } // end if

        return Math.max(expr1, expr2);
    },
    floor: function(expr, scope)
    {
        this.expr = expr.eval(scope);
        return Math.floor(this.expr.value);
    },
    ceil: function(expr, scope)
    {
        this.expr = expr.eval(scope);
        return Math.ceil(this.expr.value);
    },
    round: function(expr, scope)
    {
        this.expr = expr.eval(scope);
        return Math.round(this.expr.value);
    },
    explode: function(expr, scope)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'explode()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval(scope);

        this.expr = roll;
        this.results = [roll.value];

        while(roll.value === roll.sides)
        {
            roll = expr.eval(scope);
            this.results.push(roll.value);
        } // end while

        // We return the sum of everything rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    dropLowest: function(expr, scope)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'dropLowest()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval(scope);
        this.expr = roll;
        this.results = _.drop(_.sortBy(roll.results), 1);

        // We return the sum of everything but the lowest value rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    dropHighest: function(expr, scope)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'dropHighest()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval(scope);
        this.expr = roll;
        this.results = _.drop(_.sortBy(roll.results).reverse(), 1);

        // We return the sum of everything but the highest value rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    rerollAbove: function(maxVal, expr, scope)
    {
        var roll = expr.eval(scope);
        maxVal = maxVal.eval(scope);

        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'rerollAbove()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        if(!_.isNumber(maxVal.value))
        {
            var error = new Error("Non-number passed to 'rerollAbove()': " + maxVal.value);
            error.expr = expr;

            throw error;
        } // end if

        this.expr = roll;
        this.results = _.reduce(roll.results, function(results, rollVal)
        {
            if(rollVal >= maxVal.value)
            {
                // We reroll, and keep
                results.push(rollDie(roll.sides));
            }
            else
            {
                results.push(rollVal);
            }
            return results;
        }, []);

        // We return the sum of everything rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    rerollBelow: function(minVal, expr, scope)
    {
        var roll = expr.eval(scope);
        minVal = minVal.eval(scope);

        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'rerollBelow()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        if(!_.isNumber(minVal.value))
        {
            var error = new Error("Non-number passed to 'rerollBelow()': " + minVal.value);
            error.expr = expr;

            throw error;
        } // end if

        this.expr = roll;
        this.results = _.reduce(roll.results, function(results, rollVal)
        {
            if(rollVal <= minVal.value)
            {
                // We reroll, and keep
                results.push(rollDie(roll.sides));
            }
            else
            {
                results.push(rollVal);
            }
            return results;
        }, []);

        // We return the sum of everything rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    }
}; // end defaultScope

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    buildDefaultScope: function(scope)
    {
        return _.assign({}, defaultScope, scope);
    },
    defaultScope: defaultScope
}; // end exports

//----------------------------------------------------------------------------------------------------------------------