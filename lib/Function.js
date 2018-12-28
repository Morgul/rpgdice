//---------------------------------------------------------------------------------------------------------------------
// A function expression.
//---------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

//---------------------------------------------------------------------------------------------------------------------

class Func extends Expression
{
    constructor(name, args)
    {
        super('function');

        this.name = name;
        this.args = args || [];
        this.results = [];
    } // end constructor

    needsEscaping()
    {
        return !(/^[A-Za-z_][A-Za-z0-9_]+$/g.test(this.name));
    } // end needsEscaping

    toString()
    {
        const name = this.needsEscaping() ? `'${ this.name }'` : this.name;
        return `${ name }(${ this.args.join(', ') })`;
    } // end toString

    render()
    {
        const name = this.needsEscaping() ? `'${ this.name }'` : this.name;
        const args = this.args.reduce((results, arg) =>
        {
            results.push(arg.render());
            return results;
        }, []);

        return `{ ${ name }(${ args.join(', ') }): ${ this.value } }`;
    } // end render

    // noinspection JSAnnotator
    eval(scope)
    {
        scope = defaultScope.buildDefaultScope(scope);

        const func = scope[this.name];

        if(typeof func !== 'function')
        {
            const error = new TypeError(`'${this.name}' is not a function on the provided scope.`);
            error.scope = scope;

            throw(error);
        } // end if

        // Always pass the `this` and `scope` as the last arguments
        this.value = func.apply(this, this.args.concat([ scope ]));

        return this;
    } // end eval
} // end Func

//---------------------------------------------------------------------------------------------------------------------

module.exports = Func;

//---------------------------------------------------------------------------------------------------------------------
