{
  /* Import expression types */
  const Conditional = require('./Conditional');
  const Operation = require('./Operation');
  const Not = require('./Not');
  const Repeat = require('./Repeat');
  const Func = require('./Function');
  const Roll = require('./Roll');
  const Factorial = require('./Factorial');
  const Variable = require('./Variable');
  const Num = require('./Number');
  const Parentheses = require('./Parentheses');

  /* Define side-associative operation helper functions */
  function leftAssocOperation(left, rest) {
    return rest.reduce((left, current) => {
      return new Operation(current.oper, left, current.right);
    }, left);
  }
  function rightAssocOperation(rest, right) {
    return rest.reduce((right, current) => {
      return new Operation(current.oper, current.left, right);
    }, right);
  }
}


///////// Primary parser rules


/* Trim leading & trailing whitespace */
start "start"
  = OWS restart:restart OWS
    { return restart; }

/* The restart point for later rules, purely organizational */
restart "restart"
  = conditional
  / or

/* Parse conditionals to be right-associative */
conditional "conditional"
  = condition:or OWS '?' OWS thenExpr:or OWS ':' OWS elseExpr:(conditional / or)
    { return new Conditional(condition, thenExpr, elseExpr); }

/* Parse ors to be left-associative */
or "or"
  = left:and rest:(OWS oper:'||' OWS right:and { return {oper: oper, right: right}; })*
    { return leftAssocOperation(left, rest); }

/* Parse ands to be left-associative */
and "and"
  = left:equality rest:(OWS oper:'&&' OWS right:equality { return {oper: oper, right: right}; })*
    { return leftAssocOperation(left, rest); }

/* Parse equalities to be left-associative */
equality "equality"
  = left:comparative rest:(OWS oper:('!=' / '==') OWS right:comparative { return {oper: oper, right: right}; })*
    { return leftAssocOperation(left, rest); }

/* Parse comparatives to be left-associative */
comparative "comparative"
  = left:additive rest:(OWS oper:('>=' / '<=' / '>' / '<') OWS right:additive { return {oper: oper, right: right}; })*
    { return leftAssocOperation(left, rest); }

/* Parse additives to be left-associative */
additive "additive"
  = left:multiplicative rest:(OWS oper:[+-] OWS right:multiplicative { return {oper: oper, right: right}; })*
    { return leftAssocOperation(left, rest); }

/* Parse multiplicatives to be left-associative */
multiplicative "multiplicative"
  = left:exponent rest:(OWS oper:[*/%] OWS right:exponent { return {oper: oper, right: right}; })*
    { return leftAssocOperation(left, rest); }

/* Parse exponents to be right-associative */
exponent "exponent"
  = rest:(left:value OWS oper:'^' OWS { return {left: left, oper: oper}; })* right:value
    { return rightAssocOperation(rest, right); }

/* For the rest of the parsing rules we can just use any order that avoids false positives, purely organizational */
value "value"
  = not
  / repeat
  / func
  / roll
  / factorial
  / variable
  / num
  / parentheses

/* Strait forward not */
not "not"
  = '!' OWS content:restart
    { return new Not(content); }

/* Repeat with as many count options as possible */
repeat "repeat"
  = count:(parentheses / factorial / num) OWS '(' OWS content:restart OWS ')'
    { return new Repeat(count, content); }

/* Function allows an array of arguments, if no arguments found return empty array */
func "function"
  = name:identifier OWS '(' args:(OWS first:restart? rest:(OWS ',' OWS arg:restart { return arg; })* { return (first ? [first] : []).concat(rest); }) OWS ')'
    { return new Func(name, args); }

/* Roll uses simplified right-associativity */
roll "die roll"
  = count:(count:(parentheses / factorial / num)? { return count || undefined; }) OWS 'd' OWS sides:(parentheses / roll / factorial / num)
    { return new Roll(count, sides); }

/* Factorial with a fix to prevent '5 != 4' false positive */
factorial "factorial"
  = content:posintnum OWS '!' !('=' !'=')
    { return new Factorial(content); }

/* Strait forward variable */
variable "variable"
  = name:identifier
    { return new Variable(name); }

/* Positive or negative float */
num "number"
  = value:(sign:'-'? value:float { return parseFloat((sign||'')+value); })
    { return new Num(value); }

/* Positive integer */
posintnum "positive integer number"
  = value:integer
    { return new Num(value); }

/* Strait forward parentheses */
parentheses "parentheses"
  = '(' OWS content:restart OWS ')'
    { return new Parentheses(content); }


///////// Helper parser rules


/* Float value */
float "float"
  = value:$([0-9]+ ('.' [0-9]*)? / '.' [0-9]+)
    { return parseFloat(value); }

/* Integer value */
integer "integer"
  = value:$([0-9]+)
    { return parseInt(value, 10); }

/* Identifier string */
identifier "identifier"
  = name:$([A-Za-z_][A-Za-z0-9_]+)
    { return name; }
  / "'" name:$([^']* ("''" [^']+)*) "'"
    { return name; }
  / '[' name:$([^[\]]* ('\\]' [^[\]]+)*) ']'
    { return name; }

/* Omit white space and comments */
OWS "omit white space"
  = ([ \t\r\n] / comment)*

/* Comment */
comment "comment"
  = '/*' (!'*/' .)* '*/'
