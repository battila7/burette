const Burette = require('../../lib/burette.js');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;
const Joi = require('joi');

const generatePrimes = require('./generate-primes');

const target = 139;

const toTriplets = Tropes.Transmuter({
  shape: [Joi.number()],
  action: n => ({ n, s: target, k: 0 })
});

const div = Tropes.Transmuter({
  condition: x => x.s % x.n == 0,
  action: x => ({ n: x.n, s: x.s / x.n, k: x.k + 1 })
});

const removeZero = Tropes.Selector(x => x.k == 0);

const removeS = Tropes.Transmuter({
  condition: x => Object.prototype.hasOwnProperty.call(x, 's'),
  action: x => ({ n: x.n, k: x.k })
});

const validator = function validator(value, schema) {
  return !Joi.validate(value, schema, { convert: false }).error;
};

Solution.seq(generatePrimes(target), toTriplets, div, [removeZero, removeS], [])
  .setShapeValidator(validator)
  .applyValidatorToSubsolutions()
  .react()
  .then(s => console.log(s.multiset));
  