const Burette = require('../../lib/burette.js');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;

const generateNumbers = require('./generate-numbers');

const removeMultiplies = Tropes.Reducer({
  condition: (x, y) => x % y == 0, 
  action: (x, y) => y, 
});

module.exports = function generatePrimes(to) {
  return Solution.seq(generateNumbers(2, to), removeMultiplies);
};
