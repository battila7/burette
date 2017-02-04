# Examples

Here you can find the explanation of the example codes ordered by complexity.

At the moment most of the examples are translated versions of the Gamma programs from the [Gamma and the Chemical Reaction Model: Fifteen Years After](http://pop-art.inrialpes.fr/~fradet/PDFs/Gamma15.pdf) paper. In the future, more involved examples will be added.

## [max](https://github.com/battila7/burette/blob/develop/examples/max.js)

The *max* program finds the maximum element of the multiset. Only one `Reagent` is used:

~~~~JavaScript
const max = Reagent.of({
  action: (x, y) => Math.max(x, y)
});
~~~~

The `max` `Reagent` takes two parameters and throws away the smaller one. That way in each step, the number of elements in the multiset is reduced by one.

After the `Solution` becomes inert, the only non-`Reagent` element of the `Solution` will be the maximum.

We create an *n-shot* version of `max` by calling the `nShot()` method on it and then we put the obtained `Reagent` to the `Solution`. Without `nShot()`, only one reaction would have been executed.  

## [sieve](https://github.com/battila7/burette/blob/develop/examples/sieve.js)

*sieve* implements a basic prime sieve with one `Reagent`:

~~~~JavaScript
const sieve = Reagent.of({
  condition: (x, y) => x % y == 0,
  action: (x, y) => y
}).nShot();
~~~~

Here we utilized the *condition*. If a number divides another number then only the divisor is kept. That way after the `Solution` becomes *inert*, there are no numbers in it that are divisors of each other. In other words we will only have primes in the `Solution`.

## [fib](https://github.com/battila7/burette/blob/develop/examples/fib.js)

*fib* calculates the *nth* Fibonacci number. It does so by using a divide and conquer approach. First we divide the elements of the multiset into smaller numbers until we reach the base cases - 0 and 1:

~~~~JavaScript
const dec = Reagent.of({
  condition: x =>  x > 1,
  action: x => [x - 1, x - 2]
}).nShot();
~~~~

The divide phase is done in a *subsolution*. After this *subsolution* becomes inert, we combine the results in order to obtain the Fibonacci number. This is done by a simple `add` `Reagent`:

~~~~JavaScript
const add = Reagent.of({
  action: (x, y) => x + y
}).nShot();
~~~~

This is a great example for `Solution` composition and introducing sequentiality through `Solution.seq()`. You can pass `Solution`s, arrays or single elements as parameters to `Solution.seq()` as they will be wrapped into `Solution`s as needed. Then these `Solution`s are executed sequentially from left to right.

## [generate-primes](https://github.com/battila7/burette/blob/develop/examples/generate-primes.js)

This is a much more complex program compared to the others. *generate-primes* utilizes shape matching or shape validation using the *Joi* library. If you read the API, you know that a shape validator function must be supplied to Burette. Here we use the following: 

~~~~JavaScript
Burette.shapeValidator = function validator(value, schema) {
  return !Joi.validate(value, schema, { convert: false }).error;
};
~~~~

So if the built-in `validate()` function of *Joi* returns an error then the shape validator returns false/falsy value. 

This program is different from *sieve* in the sense that here we generate the numbers before applying the sieve reaction. This is done be subsequent interval splitting:

~~~~JavaScript
const split = Reagent.of({
  shape: [Joi.object().keys({ l: Joi.number(), u: Joi.number() })],
  condition: i  => i.l != i.u,
  action(i) {
    const h = Math.floor((i.l + i.u) / 2);

    return [{ l: i.l, u: h }, { l: h + 1, u: i.u}];
  }
}).nShot();
~~~~

Here in the *action* we used the fact that Burette automatically merges array return values into the `Solution`.

If we have an interval of the form `{ l: Number, u: Number }` then we split it into two new intervals. Then we turn intervals with zero-length (the lower and upper bound is the same) into numbers:

~~~~JavaScript
const toNumber = Reagent.of({
  shape: [Joi.object().keys({ l: Joi.number(), u: Joi.number() })],
  condition: i => i.l == i.u,
  action: i => i.l
}).nShot();
~~~~

At this point, it can be clear why we needed shape matching. Numbers and interval objects coexist in the same `Solution` so we must prevent the case when a `Reagent` receives an element of an unexpected type or form.

After the generation phase is done, we use the same sieve reaction as in the *sieve* program. 

## [fib-tropes](https://github.com/battila7/burette/blob/develop/examples/fib-tropes.js)

*fib-tropes* calculates the *nth* Fibonacci number. This program is semantically the same as *fib* but uses the well-known abstractions known as Tropes.

~~~~JavaScript
const dec = Tropes.Expander({
  condition: x =>  x > 1,
  left: x => x - 1,
  right: x => x - 2
});
~~~~

This `Reagent` simply divides a value into two simpler ones. Once only zeros and ones are in the *subsolution*, it dissolves and the following `Reagent` starts doing its work:

~~~~JavaScript
const add = Tropes.Reducer((x , y) => x + y);
~~~~

`add` as its name implies just adds two numbers together, reducing the `Solution`'s content into one value.
