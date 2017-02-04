const Burette = require('../lib/burette.js');
const Solution = Burette.Solution;
const Tropes = Burette.Tropes;

const majority = Tropes.Selector((x, y) => x !== y);

const keepOne = Tropes.Reducer((x, y) => y);

Solution.seq([1, 2, 3, 4, 5, 5, majority], keepOne, [])
  .react()
  .then(s => console.log(s.multiset));
