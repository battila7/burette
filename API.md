# Burette API

## Burette.Solution

Represents a *solution* that can encapsulate various elements such as ordinary numbers, objects, strings, `Reagent`s and other `Solution`s. A program in Burette is basically just a `Solution`.

Currently the underlying elements of a solution can be accessed using the `multiset` key of a `Solution` object. The multiset is actually represented as an ordinary array. **Note** that the way of reading the contents of a `Solution` will be changed in subsequent versions to a more safe approach as well as the underlying container.

### Solution.of(elements: Array<any>, [options]): Solution

Factory method that returns a `Solution` object encapsulating the passed elements. The `elements` parameter must be an array of arbitrary elements.

The optional `options` parameter is an object with the following keys supported:

  * `mergeReagents` `boolean` `optional` after a *subsolution* becomes *inert* (no reactions can be executed in the `Solution`) its content gets merged into its parent `Solution`. If this option is `false` then `Reagent`s in the subsolution will not be merged into the parent `Solution`. The default value is `false`.
  * `shapeValidator` `function` `optional` a function that will be used to match candidate arguments with a `Reagent`'s *shape* array. For more information on how this works, see `setShapeValidator(func)`.  

### Solution.parallel(element1: any, [element2: any, [element3: any, [... elementN: any]]]): Solution

Factory method that returns a `Solution` object encapsulating the passed elements as `Solution`s. The elements can be of any type. If an element is not a `Solution` object, then it will be wrapped into a `Solution`. If an argument is an array then all of its elements will be added to the newly created `Solution`. Subsolutions of a `Solution` can be executed in a parallel manner, hence the name of this method.

If a `Solution` is denoted by `< a, b, c, ... >` then 

~~~~
parallel(<a, b, c>, [d, e], f)
~~~~

yields

~~~~
< < a, b, c >, < d, e >, < f > >
~~~~

### Solution.seq(element1: any, [element2: any, [element3: any, [... elementN: any]]]): Solution

Factory method that returns a `Solution` object encapsulating the passed elements as `Solution`s. The elements can be of any type. If an element is not a `Solution` object, then it will be wrapped into a `Solution`. If an argument is an array then all of its elements will be added to the newly created `Solution`. The `Solution`s will be executed sequentially, from left to right in the order they appeared in the argument list.

If a `Solution` is denoted by `< a, b, c, ... >` then 

~~~~
seq(< a, b, c >, [d, e], f)
~~~~

yields

~~~~
< < < a, b, c > d, e > f >
~~~~

Of course elements in the same `Solution` can still operate in a parallel fashion, but subsolutions must become *inert* before dissolving. This essentially results in sequential execution.


### react(): Promise<Solution>

Instance method that initiates the chemical computation and returns a `Promise`. The returned `Promise` will be resolved with the *inert* `Solution`. If a computation never terminates then obviously the returned `Promise` will not be resolved. 

### setShapeValidator(func: Function): Solution

Can be used to set the shape validation function used by the `Solution` this method was called on. Returns the instance it was called on to support method chaining.

The shape validator function is called for each shape constraint and actual argument pair.

The shape constraints can be passed to a `Reagent` in an array. The first argument is matched to the first constraint and so on.

By default the following shape validator is used:

~~~~JavaScript
  function validate(value, schema) {
    return true;
  }  
~~~~

Where `value` is the argument and `schema` is the constraint.

A function of the same form can be passed as the `shapeValidator` option to the `Solution.of(elements, options)` function. 

In the examples [Joi](https://github.com/hapijs/joi) is used as a shape validation engine.

### getShapeValidator(): Function

Returns the currently used shape validator of the `Solution`.

### applyValidatorToSubsolutions(overwrite: boolean = false): Solution

Sets the shape validator function of the subsolutions to the validator used by this `Solution`. If `overwrite` is set to `false` then the validator will only be set if it differs from the default validator. 

Returns the instance it was called on to support method chaining.

## Burette.Reagent

`Reagent`s are the bread and butter of Burette. Computation is performed by applying the available `Reagent`s in a `Solution` to other elements. `Reagent`s are higher-order in the sense that they can operate on other `Reagent`s and even return new ones.

A `Reagent` is said to be *n-shot* if it reproduces itself.

A `Reagent` consists of three parts:

  * an optional *condition* that must be evaluated to `true` to apply the `Reagent`
  * an optional *shape* that describes how the parameters of the `Reagent` should look like
  * a mandatory *action* that performs some calculation on the arguments and returns new elements

`Reagent`s should be **pure** in the sense that they should not alter their arguments, but return new elements. Even if some kind of modification is performed in the *action*, the modified arguments will not be put back into the `Solution` unless they're returned by the `Reagent`.

### Reagent.of(options): Reagent

Factory method that returns a new `Reagent` with the configuration described by `options` which is an object with the following valid keys:

  * `condition` `function` `optional` a predicate that must be satisfied by the arguments in order to be passed to the *action*
  * `shape` `array` `optional` an array of constraints on the arguments
  * `action` `function` a function that will be executed if the `condition` and the `shape` constraints are met
  * `acceptReagent` `boolean` `optional` whether the `Reagent` should accept other `Reagent`s as arguments. This constraint can be expressed using the `shape` but by using this property, sometimes the `shape` can be omitted. By default it's `false`.

**Note** that if the return value of the `action` is an array, then its elements will be merged into the containing `Solution`. Therefore if you do want to have array elements in your `Solution`, then wrap the return value into a one-element array.

### Reagent.nShot(reagent): Reagent | nShot(): Reagent

`nShot` can be used as a static method or an instance method. 

When used as `Reagent.nShot(reagent)` then it returns an *n-shot* variant of the passed `Reagent`.

Otherwise, when called on a `Reagent` instance then it produces an *n-shot* variant of the `Reagent` it was called on. 

## Tropes

*Tropes* stands for:

  * **T**ransmuter
  * **R**educer
  * **OP**timizer
  * **E**xpander
  * **S**elector

After examining the structure of various `Reagent`s, some typical patterns were recognized. The most useful 5 patterns are called the Tropes.

For more information on Tropes please see: [A parallel programming style and its algebra of programs](http://www.cse.chalmers.se/~dave/papers/Sands-PARLE93.pdf)

By using Tropes, other programmers can understand your program more easily and reasoning about the program's behaviour becomes simpler.

By the nature of JavaScript, most of the restrictions of the various Tropes can not be expressed in a natural way. Therefore in some cases constructing a Tropes only has a semantic meaning.

**Note** that all Tropes are *n-shot* by default.

### Tropes.Transmuter(options): Reagent

Applies the same operation to all elements of a `Solution` until no element satisfies the condition. The number of elements in the `Solution` does not change.

The keys of the `options` parameter are the same as in the case of `Reagent.of(options)`. This method just increases the readibility.

The `options` parameter can be a `function`. In that case the passed `function` is going to be the *action* of the Transmuter. The *shape* is going to be an empty array, while the condition is `() => true`.

**Can**

  * have a condition and/or a shape

**Should**
 
  * operate on one element
  * return one element

### Tropes.Reducer(options): Reagent

Reduces the size of the `Solution` by applying an operation to pairs of elements and returning only one element.

The keys of the `options` parameter are the same as in the case of `Reagent.of(options)`. This method just increases the readibility.

The `options` parameter can be a `function`. In that case the passed `function` is going to be the *action* of the Reducer. The *shape* is going to be an empty array, while the condition is `() => true`.

**Can**

  * have a condition and/or a shape

**Should**

  * operate on two elements
  * return one element

### Tropes.Optimiser(options): Reagent

Optimises the `Solution` according to a particular criterion while preserving the structure of the `Solution`.

Valid keys of the `options` parameter:

  * `ordering` `function` expresses the criterion. Called as

  ~~~~JavaScript
  ordering({ x: left(x, y), y: right(x, y) }, { x, y })
  ~~~~

  * `left` `function` calculates the first return value of the optimizer, takes two parameters
  * `right` `function` calculates the second return value of the optimizer, takes two parameters
  * `relation` `function` describes the structure, takes two parameters

### Tropes.Expander(options): Reagent

Decomposes the elements of the `Solution` into basic values using a `left` and a `right` function. Takes one element and produces two elements by using the functions.

Valid keys of the `options` parameter:

  * `condition` `function` should take one parameter
  * `shape` `function` should have one parameter
  * `left` `function` should produce one element
  * `right` `function` should produce one element

### Tropes.Selector(options): Reagent

Acts as a filter (annihilator), removing from the `Solution` elements satisfying the *condition*.

The keys of the `options` parameter are the same as in the case of `Reagent.of(options)`. This method just increases the readibility.

The `options` parameter can be a `function`. In that case the passed `function` is going to be the *condition* of the Selector. The *shape* is going to be an empty array, while the action is `() => []`.
