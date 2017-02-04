const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Reagent = Burette.Reagent;

const sieve = Reagent.of({
  condition: (x, y) => x % y == 0,
  action: (x, y) => y
}).nShot();

Solution.of([2, 3, 4, 5, sieve])
  .react()
  .then(s => console.log(s.multiset));
