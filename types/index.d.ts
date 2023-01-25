// ---------------------------------------------------------------------------------------------------------------------
// Typescript Types
// ---------------------------------------------------------------------------------------------------------------------

export class Expression {
    /**
     * Returns the Expression as a meaningful plain object.
     */
    toJSON() : Record<string, unknown>;

    /**
     * Renders the Roll Expression into readable human output.
     */
    render() : string;

    /**
     * Evaluates the expression.
     */
    eval() : string;
}

export class Num extends Expression {
    // Overridden in this class
    eval() : never;

    /**
     * Evaluates the number it represents. Since there's no work to do, it just returns itself.
     *
     * @returns Returns the exact same Num instance.
     */
    eval() : Num;
    eval(scope ?: Record<string, unknown>, depth ?: number) : Num;

    /**
     * The current total value of the roll.
     */
    value : number;
}

export class Factorial extends Expression {
    // Overridden in this class
    eval() : never;

    /**
     * Evaluates the Factorial in the given scope, updating the Factorial's `value`.
     *
     * @param scope - The scope for evaluating variables.
     * @param [depth = 1] - How deep in the AST this evaluation is.
     *
     * @returns Returns the same Factorial instance, but with the factorial's value having been evaluated.
     */
    eval(scope : Record<string, unknown>, depth : number) : Factorial;
}

export class Parentheses extends Expression
{
    // Overridden in this class
    eval() : never;

    /**
     * Evaluates the Parentheses in the given scope, updating the Parentheses's `value`.
     *
     * @param scope - The scope for evaluating variables.
     * @param [depth = 1] - How deep in the AST this evaluation is.
     *
     * @returns Returns the same Parentheses instance, but with the paren's value having been evaluated.
     */
    eval(scope : Record<string, unknown>, depth : number) : Factorial;
}

export class Roll extends Expression {
    /**
     * Returns the roll as a parsable string.
     *
     * @returns The roll, in parsable roll syntax.
     */
    toString() : string;

    // Overridden in this class
    eval() : never;

    /**
     * Evaluates the Roll in the given scope, updating the Roll's `value` and `results`.
     *
     * @param scope - The scope for evaluating variables.
     * @param [depth = 1] - How deep in the AST this evaluation is.
     *
     * @returns Returns the same Roll instance, but with the roll having been executed.
     */
    eval(scope : Record<string, unknown>, depth : number) : Roll;

    /**
     * The current total value of the roll.
     */
    value : number;

    /**
     * All the sub-rolls (if any) that make up the roll's value.
     */
    results : number[];

    /**
     * How many sides the die for this roll has. (i.e. `${ count }d${ sides }`)
     */
    sides : Parentheses | Factorial | Num;

    /**
     * How many of `sides` numbered dice to roll. (i.e. `${ count }d${ sides }`)
     */
    count : Parentheses | Factorial | Num;
}

// ---------------------------------------------------------------------------------------------------------------------
// Default Library Export
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Parses a roll string and returns the unevaluated Roll object.
 *
 * @param expr - The expression (in string notation) to evaluate.
 *
 * @returns Returns a parsed (but not evaluated) roll.
 */
export function parse(expr : string) : Roll;

/**
 * Takes either a string or an expression and evaluates it, returning a roll object.
 *
 * @param expr - The expression (either parsed or in string notation) to evaluate.
 * @param scope - The scope to evaluate the expression in.
 */
// @ts-ignore - This is a function we export named eval, but ts gets it wrong...
export function eval(expr : Roll | string, scope : Record<string, unknown>) : Roll;

/**
 * Rolls a single die of the given number of sides.
 * @param sides - The number of sides on the die to roll.
 */
export function rollDie(sides : number) : number;

// ---------------------------------------------------------------------------------------------------------------------
