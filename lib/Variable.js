//---------------------------------------------------------------------------------------------------------------------
// A variable expression.
//---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

const { get } = require('./utils');

//---------------------------------------------------------------------------------------------------------------------

const MAX_DEPTH = 256; // An arbitrary limit; I wanted 'big', but not 'too big'.

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
        const name = this.toString();
        return `{ ${ name }: ${ this.value } }`;
    } // end render

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);
        this.value = get(scope, this.name);

        if(typeof (this.value) === 'string')
        {
            if(depth > MAX_DEPTH)
            {
                const error = new Error(`Evaluation exceeded maximum depth (${ MAX_DEPTH }); refusing to eval.`);
                error.code = 'VAR_MAX_DEPTH';

                throw error;
            } // end if

            const parser = require('./parser');

            try
            {
                this.expr = parser.parse(this.value);
                this.expr.eval(scope, depth + 1);
                this.value = this.expr.value;
            }
            catch (error)
            {
                // If it's a 'variable not found' error, we swallow the error, and assume they meant the literal string
                if(error.code !== 'VAR_NOT_FOUND')
                {
                    // We rethrow the error, since it was legit.
                    throw error;
                } // end if
            } // end try/catch
        } // end if

        if(this.value === undefined)
        {
            const error = new Error(`Variable '${ this.name }' not found in scope.`);
            error.scope = scope;
            error.code = 'VAR_NOT_FOUND';

            throw error;
        } // end if

        return this;
    } // end eval
} // end Variable

//---------------------------------------------------------------------------------------------------------------------

module.exports = Variable;

//---------------------------------------------------------------------------------------------------------------------
