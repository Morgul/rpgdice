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
    floor: function(expr)
    {
        expr = expr.eval();
        return Math.floor(expr.value);
    },
    ceil: function(expr)
    {
        expr = expr.eval();
        return Math.ceil(expr.value);
    },
    round: function(expr)
    {
        expr = expr.eval();
        return Math.round(expr.value);
    },
    explode: function(expr)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'explode()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval();
        this.results = [roll];

        while(roll.value === roll.sides)
        {
            roll = expr.eval();
            this.results.push(roll);
        } // end while

        // We return the sum of everything rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    dropLowest: function(expr)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'dropLowest()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval();
        this.expr = roll;
        this.results = _.drop(_.sortBy(roll.results), 1);

        // We return the sum of everything but the lowest value rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    dropHighest: function(expr)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'dropHighest()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval();
        this.expr = roll;
        this.results = _.drop(_.sortBy(roll.results).reverse(), 1);

        // We return the sum of everything but the highest value rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    rerollAbove: function(maxVal, expr)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'rerollAbove()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval();
        this.expr = roll;
        this.results = _.reduce(roll.results, function(results, rollVal)
        {
            if(rollVal <= maxVal)
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
    rerollBelow: function(minVal, expr)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'rerollBelow()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval();
        this.expr = roll;
        this.results = _.reduce(roll.results, function(results, rollVal)
        {
            if(rollVal >= minVal)
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
    rerollHighest: function(num, expr)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'rerollHighest()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval();
        this.expr = roll;
        this.results = _.sortBy(roll.results);

        var toReroll = this.results.slice(-num);
        this.results = this.results.concat(_.reduce(_.range(toReroll.length), function(results)
        {
            results.push(rollDie(roll.sides));
            return results;
        }, []));

        // We return the sum of everything rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    },
    rerollLowest: function(num, expr)
    {
        if(expr.type !== 'roll')
        {
            var error = new Error("Non-roll passed to 'rerollLowest()': " + expr.toString());
            error.expr = expr;

            throw error;
        } // end if

        var roll = expr.eval();
        this.expr = roll;
        this.results = roll.results;
        this.results = _.sortBy(roll.results).reverse();

        var toReroll = this.results.slice(-num);
        this.results = this.results.concat(_.reduce(_.range(toReroll.length), function(results)
        {
            results.push(rollDie(roll.sides));
            return results;
        }, []));

        // We return the sum of everything rolled
        return _.reduce(this.results, function(results, roll) { return results + roll; }, 0);
    }
}; // end defaultScope

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    buildDefaultScope: function(scope)
    {
        return _.assign(defaultScope, (scope || {}));
    },
    defaultScope: defaultScope
}; // end exports

//----------------------------------------------------------------------------------------------------------------------