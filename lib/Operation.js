//----------------------------------------------------------------------------------------------------------------------
// An operation expression
//----------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

//----------------------------------------------------------------------------------------------------------------------

class Operation extends Expression
{
    constructor(type, left, right)
    {
        super(type);
        this.left = left;
        this.right = right;
    } // end constructor

    toString()
    {
        const op = this.type === 'add' ? '+' : this.type === 'subtract' ? '-' : this.type === 'multiply' ? '*' : '/';
        return `${ this.left.toString() } ${ op } ${ this.right.toString() }`;
    } // end toString

    render()
    {
        const op = this.type === 'add' ? '+' : this.type === 'subtract' ? '-' : this.type === 'multiply' ? '*' : '/';
        return `${ this.left.render() } ${ op } ${ this.right.render() }`;
    } // end render

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.left = this.left.eval(scope, depth + 1);
        this.right = this.right.eval(scope, depth + 1);

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
    } // end eval
} // end Operation

//----------------------------------------------------------------------------------------------------------------------

module.exports = Operation;

//----------------------------------------------------------------------------------------------------------------------
