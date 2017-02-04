const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Reagent = Burette.Reagent;
const Tropes = Burette.Tropes;
const Joi = require('joi');

const addIndex = Reagent.of({
  action: () => ({ index: 0 })
});

const assignIndex = Tropes.Transmuter({
  shape: [Joi.number(), Joi.object().keys({ index: Joi.number() })],
  action: (n, i) => [{ index: i.index, n }, { index: i.index + 1 }]
});

const removeIndex = Tropes.Selector([Joi.object().keys({ index: Joi.number() })]);

const sorter = Tropes.Optimiser({
  left: (a, b) => ({ index: a.index, n: b.n }),
  right: (a, b) => ({ index: b.index, n: a.n }),
  ordering: (a, b, c, d) => b.n < d.n,
  relation: (a, b) => a.index > b.index
});

const validator = function validator(value, schema) {
  return !Joi.validate(value, schema, { convert: false }).error;
};

Solution.seq([2, 4, 5, 3, 1], addIndex, assignIndex, removeIndex, sorter, [])
        .setShapeValidator(validator)
        .applyValidatorToSubsolutions()
        .react()
        .then(s => console.log(s.multiset));
