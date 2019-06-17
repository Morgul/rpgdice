// ----------------------------------------------------------------------------------------------------------------------
// An operation expression.
// ----------------------------------------------------------------------------------------------------------------------

const Expression = require('./Expression');
const defaultScope = require('./defaultScope');

// ----------------------------------------------------------------------------------------------------------------------

const ops 
= {
    add:
    {
        symbol: '+',
        evalValue: (left, right) =>
        {
            return left.value + right.value;
        }
    },
    subtract:
    {
        symbol: '-',
        evalValue: (left, right) =>
        {
            return left.value - right.value;
        }
    },
    multiply:
    {
        symbol: '*',
        evalValue: (left, right) =>
        {
            return left.value * right.value;
        }
    },
    divide:
    {
        symbol: '/',
        evalValue: (left, right) =>
        {
            return left.value / right.value;
        }
    },
    modulo:
    {
        symbol: '%',
        evalValue: (left, right) =>
        {
            return left.value % right.value;
        }
    },
    exponent:
    {
        symbol: '^',
        evalValue: (left, right) =>
        {
            return Math.pow(left.value, right.value);
        }
    },
    or:
    {
        symbol: '||',
        evalValue: (left, right) =>
        {
            return left.value || right.value;
        }
    },
    and:
    {
        symbol: '&&',
        evalValue: (left, right) =>
        {
            return left.value && right.value;
        }
    },
    equal:
    {
        symbol: '==',
        evalValue: (left, right) =>
        {
            return left.value == right.value ? 1 : 0;
        }
    },
    notEqual:
    {
        symbol: '!=',
        evalValue: (left, right) =>
        {
            return left.value != right.value ? 1 : 0;
        }
    },
    greaterThan:
    {
        symbol: '>',
        evalValue: (left, right) =>
        {
            return left.value > right.value ? 1 : 0;
        }
    },
    lessThan:
    {
        symbol: '<',
        evalValue: (left, right) =>
        {
            return left.value < right.value ? 1 : 0;
        }
    },
    greaterThanOrEqual:
    {
        symbol: '>=',
        evalValue: (left, right) =>
        {
            return left.value >= right.value ? 1 : 0;
        }
    },
    lessThanOrEqual:
    {
        symbol: '<=',
        evalValue: (left, right) =>
        {
            return left.value <= right.value ? 1 : 0;
        }
    }
};

function symbolToType(symbol) 
{
    let type = symbol;

    Object.keys(ops).forEach((key) =>
    {
        if(ops[key].symbol === symbol)
        {
            type = key;
        }
    });

    return type;
}

function typeToSymbol(type)
{
    if(ops[type])
    {
        return ops[type].symbol;
    }

    return type;
}

class Operation extends Expression
{
    constructor(symbol, left, right)
    {
        super(symbolToType(symbol));

        this.left = left;
        this.right = right;
    } // end constructor

    toString()
    {
        return `${ this.left.toString() } ${ typeToSymbol(this.type) } ${ this.right.toString() }`;
    } // end toString

    render()
    {
        return `${ this.left.render() } ${ typeToSymbol(this.type) } ${ this.right.render() }`;
    } // end render

    // noinspection JSAnnotator
    eval(scope, depth = 1)
    {
        scope = defaultScope.buildDefaultScope(scope);

        this.left = this.left.eval(scope, depth + 1);
        this.right = this.right.eval(scope, depth + 1);

        if(!ops[this.type])
        {
            // unknown types are not supported
            const error = new TypeError(`'${ this.type }' is not a known operation.`);
            error.code = 'OP_MISSING';
            error.type = this.type;

            throw (error);
        }

        this.value = ops[this.type].evalValue.call(this, this.left, this.right);

        return this;
    } // end eval
} // end Operation

// ----------------------------------------------------------------------------------------------------------------------

module.exports = Operation;

// ----------------------------------------------------------------------------------------------------------------------
