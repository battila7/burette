const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const process = require('process');
const Reagent = Burette.Reagent;
const Catalyst = Burette.Catalyst;
const Joi = require('joi');

const stdinInput = function stdinInput(propagator) {
  const obj = {
    propagator
  };

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      obj.propagator(chunk);
    }
  });

  return obj;
};

const shape = [Joi.number(), Joi.string()];

const high = Reagent.of({
  shape,
  condition:  (x, y) => parseInt(y) > x,
  action: x => [Catalyst.of(() => console.log('Too high!')), x]
}).nShot();

const low = Reagent.of({
  shape,
  condition:  (x, y) => parseInt(y) < x,
  action: x => [Catalyst.of(() => console.log('Too low!')), x]
}).nShot();

const match = Reagent.of({
  shape,
  condition: (x, y) => parseInt(y) == x,
  action: () => Catalyst.of(() => { 
    console.log('That\'s it!');

    process.exitCode = 0;
  })
});

const validator = function validator(value, schema) {
  return !Joi.validate(value, schema, { convert: false }).error;
};

Solution.of([high, low, match, 50])
        .setShapeValidator(validator)
        .applyValidatorToSubsolutions()
        .input(stdinInput)
        .forever();
