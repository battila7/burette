const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Reagent = Burette.Reagent;
const Joi = require('joi');

Burette.shapeValidator = function validator(value, schema) {
  return !Joi.validate(value, schema, { convert: false }).error;
};

const start = {
  l: 2,
  u: 25
};

const split = Reagent.of({
  shape: [Joi.object().keys({ l: Joi.number(), u: Joi.number() })],
  condition: i  => i.l != i.u,
  action(i) {
    const h = Math.floor((i.l + i.u) / 2);

    return [{ l: i.l, u: h }, { l: h + 1, u: i.u}];
  }
}).nShot();

const toNumber = Reagent.of({
  shape: [Joi.object().keys({ l: Joi.number(), u: Joi.number() })],
  condition: i => i.l == i.u,
  action: i => i.l
}).nShot();

const removeMultiplies = Reagent.of({
  condition: (x, y) => x % y == 0,
  action: (x, y) => y
}).nShot();

const generateNumbers = Solution.of([start, toNumber, split]);

Solution.of([generateNumbers, removeMultiplies], { mergeReagents: false })
  .react()
  .then(s => console.log(s.multiset));
