# Burette API

## Burette.Solution

Represents a *solution* that can encapsulate various elements such as ordinary numbers, objects, strings, `Reagent`s and other `Solution`s. A program in Burette is basically just a `Solution`.

### Solution.of(elements, [options])

Factory method that returns a `Solution` object encapsulating the passed elements. The `elements` parameter must be an array of arbitrary elements.

The optional `options` parameter is an object with the following keys supported:

* `mergeReagents` `boolean` `optional` after a *subsolution* becomes *inert* (no reactions can be executed in the `Solution`) its content gets merged into its parent `Solution`. If this option is `false` then `Reagent`s in the subsolution will not be merged into the parent `Solution`. The default value is `true`.

### Solution.parallel(element1, [element2, [element3, [... elementN]]])

Factory method that returns a `Solution` object encapsulating the passed elements as `Solution`s. The elements can be of any type. If an element is not a `Solution` object, then it will be wrapped into a `Solution`. Subsolutions of a `Solution` can be executed in a parallel manner, hence the name of this method.

### react()

Instance method that initiates the chemical computation and returns a `Promise`. The returned `Promise` will be resolved with the *inert* `Solution`. If a computation never terminates then obviously the returned `Promise` will not be resolved. 

## Burette.Reagent

`Reagent`s are the bread and butter of Burette. Computation is performed by applying the available `Reagent`s in a `Solution` to other elements. `Reagent`s are higher-order in the sense that they can operate on other `Reagent`s and even return new ones.

A `Reagent` is said to be *n-shot* if it reproduces itself.

A `Reagent` consists of three parts:

  * an optional *condition* that must be evaluated to `true` to apply the `Reagent`
  * an optional *shape* that describes how the parameters of the `Reagent` should look like
  * a mandatory *action* that performs some calculation on the arguments and returns new elements

`Reagent`s should be **pure** in the sense that they should not alter their arguments, but return new elements. Even if some kind of modification is performed in the *action*, the modified arguments will not be put back into the `Solution` unless they're returned by the `Reagent`.

### Reagent.of(options)

Factory method that returns a new `Reagent` with the configuration described by `options` which is an object with the following valid keys:

  * `condition` `function` `optional` a predicate that must be satisfied by the arguments in order to be passed to the *action*
  * `shape` `array` `optional` an array of constraints on the arguments
  * `action` `function` a function that will be executed if the `condition` and the `shape` constraints are met
  * `acceptReagent` `boolean` `optional` whether the `Reagent` should accept other `Reagent`s as arguments. This constraint can be expressed using the `shape` but by using this property, sometimes the `shape` can be omitted. By default it's `false`.

### Reagent.nShot(reagent) | nShot()

`nShot` can be used as a static method or an instance method. 

When used as `Reagent.nShot(reagent)` then it returns an *n-shot* variant of the passed `Reagent`.

Otherwise, when called on a `Reagent` instance then it produces an *n-shot* variant of the `Reagent` it was called on. 

## Burette.shapeValidator property

A property that can be used to get or set the shape validator function to be used by Burette.

The shape validator function is called for each shape constraint and actual argument pair.

The shape constraints can be passed to a `Reagent` in an array. The first argument is matched to the first constraint and so on.

By default the following shape validator is used:

~~~~JavaScript
  function validate(value, schema) {
    return true;
  }  
~~~~

Where `value` is the argument and `schema` is the constraint.

In the examples [Joi](https://github.com/hapijs/joi) is used as a shape validation engine.