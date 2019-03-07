{
  /* Import expression types */
  const Operation = require('./Operation')
  const Repeat = require('./Repeat');
  const Func = require('./Function');
  const Roll = require('./Roll');
  const Factorial = require('./Factorial');
  const Variable = require('./Variable');
  const Num = require('./Number');
  const Parentheses = require('./Parentheses');

  /* Define side-associative operation helper functions */
  function leftAssocOperation(rest, right) {
    if (!rest.length) return right;
    var current = rest.pop();
    return new Operation(current.oper, leftAssocOperation(rest, current.left), right);
  }

  function rightAssocOperation(left, rest) {
    if (!rest.length) return left;
    var current = rest.shift();
    return new Operation(current.oper, left, rightAssocOperation(current.right, rest));
  }
}


///////// Primary parser rules


/* Trim leading & trailing whitespace */
start "start"
  = OWS additive:additive OWS
    { return additive; }

/* Parse additives to be left-associative */
additive "additive"
  = rest:(left:multiplicative OWS oper:[+-] OWS { return {left: left, oper: oper}; })* right:multiplicative
    { return leftAssocOperation(rest, right); }

/* Parse multiplicatives to be left-associative */
multiplicative "multiplicative"
  = rest:(left:exponent OWS oper:[*/%] OWS { return {left: left, oper: oper}; })* right:exponent
    { return leftAssocOperation(rest, right); }

/* Parse exponents to be right-associative */
exponent "exponent"
  = left:value rest:(OWS oper:'^' OWS right:value { return {oper: oper, right: right}; })*
    { return rightAssocOperation(left, rest); }

/* For the rest of the parsing rules we can just use any order that avoids false positives */
value "value"
  = repeat
  / func
  / roll
  / factorial
  / variable
  / num
  / parentheses

/* Repeat should only allow a positive count, we can't do something negative times now can we? (Although I think 0 still "works", interestingly) */
repeat "repeat"
  = count:posintnum OWS '(' OWS content:additive OWS ')'
    { return new Repeat(count, content); }

/* Function allows an array of arguments, if no arguments found return empty array */
func "function"
  = name:identifier OWS '(' args:(OWS first:additive? rest:(OWS ',' OWS arg:additive { return arg; })* { return (first ? [first] : []).concat(rest); }) OWS ')'
    { return new Func(name, args); }

/* Roll uses simplified right-associativity, a positive count (including 0), and an integer number of sides */
roll "die roll"
  = count:(count:(factorial / posintnum) OWS { return count; })? 'd' OWS sides:(roll / factorial / intnum)
    { return new Roll(count || undefined, sides); }

/* Strait forward factorial */
factorial "factorial"
  = content:posintnum OWS '!'
    { return new Factorial(content); }

/* Strait forward variable */
variable "variable"
  = name:identifier
    { return new Variable(name); }

/* Positive or negative float */
num "number"
  = value:(sign:'-'? value:float { return parseFloat((sign||'')+value); })
    { return new Num(value); }

/* Positive or negative integer */
intnum "integer number"
  = value:(sign:'-'? value:integer { return parseInt((sign||'')+value); })
    { return new Num(value); }

/* Positive integer */
posintnum "positive integer number"
  = value:integer
    { return new Num(value); }

/* Strait forward parentheses */
parentheses "parentheses"
  = '(' OWS content:additive OWS ')'
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

/* White space */
OWS "omit white space"
  = [ \t\r\n]*
