const Burette = require('../../lib/burette.js');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;
const Joi = require('joi');

const validator = function validator(value, schema) {
  return !Joi.validate(value, schema, { convert: false }).error;
};

const split = Tropes.Expander({
  shape: [Joi.object().keys({ l: Joi.number(), u: Joi.number() })],
  condition: i  => i.l != i.u,
  left: i => ({ l: i.l, u: Math.floor((i.l + i.u) / 2)}),
  right: i =>  ({ l: Math.floor((i.l + i.u) / 2) + 1, u: i.u })
});

const toNumber = Tropes.Transmuter({
  shape: [Joi.object().keys({ l: Joi.number(), u: Joi.number() })],
  condition: i => i.l == i.u,
  action: i => i.l
});

module.exports = function generateNumbers(from, to) {
  const interval = {
    l: Math.min(from, to),
    u: Math.max(from, to)
  };

  return Solution.of([interval, toNumber, split], {
    shapeValidator: validator
  });
};
