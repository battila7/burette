const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Reagent = Burette.Reagent;

const fibOf = 10;

const dec = Reagent.of({
  condition: x =>  x > 1,
  action: x => [x - 1, x - 2]
}).nShot();

const add = Reagent.of({
  action: (x, y) => x + y
}).nShot();

const createParts = Solution.of([fibOf, dec]);

Solution.of([createParts, add], { mergeReagents: false })
  .react()
  .then(s => console.log(s.multiset));
