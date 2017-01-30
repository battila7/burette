# Burette
Chemical programming framework based on Banâtre's Gamma

Please see [API.md](https://github.com/battila7/burette/blob/develop/API.md) for the documentation of Burette.

Explanation of the examples can be found in [examples.md](https://github.com/battila7/burette/blob/develop/examples.md).

## What does chemical programming mean?

Chemical programming (CP) is not about chemistry-related computations. Instead CP takes advantage of the chemical reaction model to establish a new programming paradigm and express computations. 

Gamma is a formalism proposed by Jean-Pierre Banâtre in 1986, that kickstarted the CP scene. The most important structure in Gamma is the multiset. In a multiset elements does not have to be unique as opposed to the traditional mathematical set. Molecules in this multiset can interact freely and this interaction corresponds to execution. Of course two numbers can hardly interact in any way. But we have reactions, that can take elements from the multiset and emit new elements (or even nothing, for example in the case of an *annihilator*).

A reactions consists of a *reaction condition* and an *action*. If an element satisfies the condition then it's taken out of the multiset and replaced by the results of the action. Multiple parallel reactions can be carried out because no element can be used by two reactions.

For more information on Gamma please read the following article:

[Gamma and the Chemical Reaction Model: Fifteen Years After](http://pop-art.inrialpes.fr/~fradet/PDFs/Gamma15.pdf)

## How does Burette correspond to Gamma?

The aim of Burette is to provide a framework that can be used in production and to enable developers to experience the CP paradigm. Therefore some aspects of Gamma may be altered or even left out if needed. But the core principle remains the same.

I hope that Burette can raise some awareness towards the fascinating world of chemical programming!
