//---------------------------------------------------------------------------------------------------------------------
// A base expression object.
//
// @module
//---------------------------------------------------------------------------------------------------------------------
"use strict";

var _ = require('lodash');

//---------------------------------------------------------------------------------------------------------------------

function Expression() {}

Expression.prototype.toJSON = function()
{
    this._results = undefined;
    return _.assign({type: this.type}, this);
}; // end Expression#toJSON

Object.defineProperty(Expression.prototype, 'results', {
    get: function(){ return this._results || this.value; },
    set: function(val){ this._results = val; }
});

//---------------------------------------------------------------------------------------------------------------------

module.exports = Expression;

//---------------------------------------------------------------------------------------------------------------------
