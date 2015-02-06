# RPGDice

This project is an opinionated dice syntax and roller library designed to be used for any dice-based RPG system. It's
main goal is to use a straightforward, easy to use grammar that has enough flexibility to allow players to easily
codify their dice rolls. One of it's central features, the ability to use variables, exists to facilitate a 'write once'
philosophy of dice rolls.

## Dice are Hard

The single largest complaint I ever hear about a given RPG system is that the dice are "too complicated", or "I can
never remember how to roll that", or "I keep forgetting my bonuses." This is why RPGDice exists: computers are amazing
at calculations; humans aren't. That's why we let the computer do the hard work of keeping track of everything, and the
user just gets to see the results of what they told it to roll.

## Opinionated

There is a semi-formal [dice notation][] floating around. I personally find it's syntax clunky, difficult to use, and
nearly impossible to extend. Instead, I've created a syntax that is, in essence, mathematical operations, plus
functions,  variables, and `XdY` syntax. I feel my version is easy enough to learn for veterans and newbies alike, while
leveraging some basic programing concepts, like the [principal of least surprise][pola].

[dice notation]: http://en.wikipedia.org/wiki/Dice_notation
[pola]: http://en.wikipedia.org/wiki/Principle_of_least_astonishment

## Syntax Summary

`d20 + floor(level / 2) + floor((strength - 10) / 2) + proficiency + weaponEnhancement`

As you can see, the syntax is very nearly a super-simplified version of javascript. It supports standard order of
operations, `XdY` for rolls, function calls, and variables. (This particular roll is the formula for a D&D 4e attack.)

When you make a roll, you will pass in a `scope` object, which RPGDice will use to look up all variables and functions.
By default, we provide several mathematical functions, such as `floor()`, `ceil()`, `round()`. Additionally, we provide
some common RPG rules: `explode()`, `dropLowest()`, `dropHighest()`, `reroll()`.

If you set a variable on the `scope` to a function, but reference it without parenthesis, RPGDice will call it, passing
in no arguments. Ex: `3d8 + strMod`, where `strMod` was defined as:

```javascript
function strMod()
{
    return Math.floor((scope.strength - 10) / 2);
} // end strMod
```

This gives you a lot of power in how you define your scope. You can additionally extend the functionality to support any
rule set your heart desires, without needing explicit support in the syntax. For example, let's say you wanted to play
with loaded dice. There's no special syntax support for that, but you can add it yourself:

```javascript
function rollLoaded(sides)
{
    var roll = Math.floor(Math.random() * sides) + 1;

    // We make ourselves 3 times as likely to roll max, and impossible to roll the minimum.
    // Simply returning the max might look suspicious. :-p
    if(roll < sides/3)
    {
        return sides;
    } // end if

    return roll;
} // end strMod
```

Now, you can roll your loaded dice like such:

`3(rollLoaded(6)) + 4`

This expression calls `rollLoaded(6)` three times, and then adds `4`. It's the equivalent to `3d4`, except the dice
rolling logic has been replaced by your loaded dice rules. Functions get the full results object, which includes the
parse tree for each expression they get as an argument, which means functions can be incredibly powerful.

_If you would like to dive further into the syntax, please check out our [Syntax Documentation]()._

## API

The API for rolling dice is super simple. There are exactly 2 functions, `rpgdice.parse()` and `rpgdice.roll()`. Each
take a dice string to parse, and only differ in what they output; `parse()` simply returns you the tokenized roll, while
`roll()` will return you the parse tree including results. (Additionally, `roll()` can take the results of `parse()`, not
just a string.)

Here's a few examples:

```javascript
// Roll a simple equation
rpgDice.roll('3d6 + 4')
    .then(function(results)
    {
        // Pretty-print the results
        console.log('Results:', results.prettyPrint());

        // Print the total:
        console.log('Total:', results.value);
    });

//----------------------------------------------------------------

// Evaluate an expression
rpgDice.parse('3(4d10 - 2)`)
    .then(function(eval)
    {
        // Do work with the eval object...
    })
    .then(function(eval)
    {
        // Now, get the results for this roll
        var results = rpgDice.roll(eval);
    });
```

_For more details on the API, please check out our [API Documentation]()._