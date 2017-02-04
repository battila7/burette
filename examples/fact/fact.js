const Burette = require('../../lib/burette.js');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;

const generateNumbers = require('./generate-numbers');

const mul = Tropes.Reducer((x, y) => x * y);

Solution.seq(generateNumbers(1, 10), mul, [])
  .react()
  .then(s => console.log(s.multiset));
