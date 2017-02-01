const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;

const fibOf = 10;

const dec = Tropes.Expander({
  condition: x =>  x > 1,
  left: x => x - 1,
  right: x => x - 2
});

const add = Tropes.Reducer((x , y) => x + y);

const createParts = Solution.of([fibOf, dec]);

Solution.of([createParts, add], { mergeReagents: false })
  .react()
  .then(s => console.log(s.multiset));
