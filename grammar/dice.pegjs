{
	var Roll = require('./Roll');
	var Operation = require('./Operation');
	var Num = require('./Number');
	var Variable = require('./Variable');
	var Func = require('./Function');
}

start
  = additive:additive OWS { return additive; }

additive
  = left:multiplicative OWS oper:[+-] right:additive { return new Operation((oper == '+') ? 'add' : 'subtract', left, right); }
  / multiplicative

multiplicative
  = left:primary OWS oper:[*/] right:multiplicative
    { return new Operation((oper == '*') ? 'multiply' : 'divide', left, right); }
  / primary

primary
  = count:number OWS '(' additive:additive OWS ')'
    { return {type: 'repeat', count: count, right: additive}; }
  / function
  / value
  / OWS '(' additive:additive OWS ')' { return additive; }

function
  = name:identifier OWS '(' arg1:additive? rest:(OWS ',' arg:additive { return arg; })* OWS ')' { return new Func(name, [arg1].concat(rest)); }

value
  = roll
  / variable
  / numberValue

///////

roll "die roll"
  = count:integer? OWS 'd' sides:integer
    { return new Roll((!count && count != 0) ? 1 : count, sides); }

variable
  = name:identifier { return new Variable(name); }

numberValue "numeric value"
  = value:number { return new Num(value); }

///////

number "number"
  = OWS value:$([0-9]+ ('.' [0-9]*)? / '.' [0-9]+)
    { return parseFloat(value); }

integer "integer"
  = OWS digits:$([0-9]+) { return parseInt(digits, 10); }

identifier "identifier"
  = (OWS name:$([A-Za-z_][A-Za-z0-9_]+) { return name; })
  / (OWS "'" name:$([^']* ("''" [^']+)*) "'" { return name; })
  / (OWS '[' name:$([^[\]]* ('\\]' [^[\]]+)*) ']' { return name; })

OWS = [ \t\r\n]*
