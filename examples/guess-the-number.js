const process = require('process');

const Joi = require('joi');
const Burette = require('../lib/burette.js');

const Solution = Burette.Solution;
const Reagent = Burette.Reagent;
const Catalyst = Burette.Catalyst;

const stdinInput = function stdinInput(propagator) {
  const obj = {
    propagator
  };

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();

    if (chunk !== null) {
      obj.propagator({
        guess: Number.parseInt(chunk)
      });
    }
  });

  return obj;
};

const target = {
  target: 50
};

const shape = [
  Joi.object().keys({ target: Joi.number() }),
  Joi.object().keys({ guess: Joi.number() })
];

const high = Reagent.of({
  shape,
  condition:  (t, g) => t.target < g.guess,
  action: t => [Catalyst.of(() => console.log('Too high!')), t]
}).nShot();

const low = Reagent.of({
  shape,
  condition:  (t, g) => t.target > g.guess,
  action: t => [Catalyst.of(() => console.log('Too low!')), t]
}).nShot();

const match = Reagent.of({
  shape,
  condition:  (t, g) => t.target == g.guess,
  action: () => Catalyst.of(() => { 
    console.log('That\'s it!');

    process.exit(0);
  })
});

const validator = function validator(value, schema) {
  return !Joi.validate(value, schema, { convert: false }).error;
};

Solution.of([high, low, match, target])
        .setShapeValidator(validator)
        .applyValidatorToSubsolutions()
        .input(stdinInput)
        .forever();
