//---------------------------------------------------------------------------------------------------------------------
// A variable expression.
//---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

const { get } = require('./utils');

//---------------------------------------------------------------------------------------------------------------------

class Variable extends Expression
{
    constructor(name)
    {
        super('variable');
        this.name = name;
    } // end constructor

    needsEscaping()
    {
        return !(/^[A-Za-z_][A-Za-z0-9_]+$/g.test(this.name));
    } // end needsEscaping

    toString()
    {
        return this.needsEscaping() ? `'${ this.name }'` : this.name;
    } // end toString

    render()
    {
        var name = this.toString();
        return `{ ${ name }: ${ this.value } }`;
    } // end render

    // noinspection JSAnnotator
    eval(scope)
    {
        scope = defaultScope.buildDefaultScope(scope);
        this.value = get(scope, this.name);

        if(this.value === undefined)
        {
            var error = new Error(`Variable '${ this.name }' not found in scope.`);
            error.scope = scope;

            throw error;
        } // end if

        return this;
    } // end eval
} // end Variable

//---------------------------------------------------------------------------------------------------------------------

module.exports = Variable;

//---------------------------------------------------------------------------------------------------------------------
