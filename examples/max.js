const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Reagent = Burette.Reagent;

const max = Reagent.of({
  action: (x, y) => Math.max(x, y)
});

Solution.of([1, 2, 3, 4, 5, max.nShot()])
  .react()
  .then(s => console.log(s.multiset));
