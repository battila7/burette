# Burette

Chemical programming framework based on Banâtre's Gamma

Please see [API.md](https://github.com/battila7/burette/blob/develop/API.md) for the documentation of Burette.

Explanation of the examples can be found in [examples.md](https://github.com/battila7/burette/blob/develop/examples.md).

## Features

  * **Composable**: Solutions can be combined in an arbitrary way, producing parallel and serial execution flow. 
  * **Parallel execution**: Reagents can operate on the elements of a solution in a parallel manner.
  * **Non-deterministic execution**: The arguments of a Reagent are selected in an arbitrary order.
  * **Functional-first**: Program execution equals to a number of multiset transformations realized by pure Reagents.

Only three (or two and a half) core concepts to understand:

  * **Solution**: A multiset of elements (molecules) that provides an environment for reactions.
  * **Reagent**: Takes some elements out of the enclosing solution and produces new ones (or nothing).
  * **Tropes**: A collection of the most used Reagent patterns.

## Example

This simple example calculates the majority element:

~~~~JavaScript
const Burette = require('burette');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;

const majority = Tropes.Selector((x, y) => x !== y);

const keepOne = Tropes.Reducer((x, y) => y);

Solution.seq([1, 2, 3, 4, 5, 5, majority], keepOne, [])
  .react()
  .then(s => console.log(s.multiset));

// Output: [ 5 ]
~~~~

## Theory

### What does chemical programming mean?

Chemical programming (CP) is not about chemistry-related computations. Instead CP takes advantage of the chemical reaction model to establish a new programming paradigm and express computations. 

Gamma is a formalism proposed by Jean-Pierre Banâtre in 1986, that kickstarted the CP scene. The most important structure in Gamma is the multiset. In a multiset elements does not have to be unique as opposed to the traditional mathematical set. Molecules in this multiset can interact freely and this interaction corresponds to execution. Of course two numbers can hardly interact in any way. But we have reactions, that can take elements from the multiset and emit new elements (or even nothing, for example in the case of an *annihilator*).

A reactions consists of a *reaction condition* and an *action*. If an element satisfies the condition then it's taken out of the multiset and replaced by the results of the action. Multiple parallel reactions can be carried out because no element can be used by two reactions.

For more information on Gamma please read the following article:

[Gamma and the Chemical Reaction Model: Fifteen Years After](http://pop-art.inrialpes.fr/~fradet/PDFs/Gamma15.pdf)

### How does Burette correspond to Gamma?

The aim of Burette is to provide a framework that can be used in production and to enable developers to experience the CP paradigm. Therefore some aspects of Gamma may be altered or even left out if needed. But the core principle remains the same.

I hope that Burette can raise some awareness towards the fascinating world of chemical programming!
