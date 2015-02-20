//----------------------------------------------------------------------------------------------------------------------
// Brief description for index.js module.
//
// @module index.js
//----------------------------------------------------------------------------------------------------------------------
"use strict";

var _ = require('lodash');

var parser = require('./lib/parser');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    parse: function(expr)
    {
        return parser.parse(expr);
    },
    eval: function(expr, scope)
    {
        if(_.isString(expr))
        {
            expr = parser.parse(expr);
        } // end if

        return expr.eval(scope);
    }
}; // end exports

if(typeof window !== 'undefined')
{
    window.rpgdice = module.exports;
} // end if

//----------------------------------------------------------------------------------------------------------------------