const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;

const dec = Tropes.Expander({
  condition: x =>  x > 1,
  left: x => x - 1,
  right: x => x - 2
});

const add = Tropes.Reducer((x , y) => x + y);

Solution.seq([10, dec], add)
  .react()
  .then(s => console.log(s.multiset));
