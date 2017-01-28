function permute(permutation) {
  var length = permutation.length,
      result = new Array([0, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600][length]),
      c = new Array(length).fill(0),
      i = 1,
      j = 1;

  result[0] = permutation.slice();
  while (i < length) {
    if (c[i] < i) {
      var k = (i % 2) ? c[i] : 0,
          p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result[j] = permutation.slice();
      ++j;
    } else {
      c[i] = 0;
      ++i;
    }
  }

  return result;
}

export const Reagent =  {
  t() {
    return true;
  },
  of(condition, action) {
    if (!action) {
      action = condition;
    }

    const obj = Object.create(Reagent);

    obj.condition = Reagent.t;

    obj.action = action;

    obj.args = obj.condition.length;

    return obj; 
  },
  nShot(reagent) {
    if (!Object.prototype.isPrototypeOf.call(Reagent, reagent)) {
      throw new TypeError('The provided argument is not a reagent!');
    }

    const action = function action(...args) {
      return [reagent.action(...args), reagent];
    };

    return Reagent.of(reagent.condition, action);
  }
};

export const Solution = {
  of(elements) {
    const obj = Object.create(Solution);

    obj.multiset = elements;

    return obj;
  },
  react() {    
    const solutionPromises = this.removeAndGetSolutions()
      .map(s => s.react());

    const reagentPromises = this.removeAndGetReactions()
      .map(r => this.executeReaction(r));

    const promises = solutionPromises.concat(reagentPromises)
      .map(p => p.then(result => this.incorporateResult(result)));

    return Promise.all(promises);
  },
  incorporateResult(result) {
    if (Array.isArray(results)) {
      this.multiset.push(...results);
    } else if (result !== undefined) {
      this.multiset.push(result);
    }
  },
  executeReaction(reaction) {
    return new Promise(function promise(resolve) {
      resolve(reaction.reagent.action(...reaction.args));
    });
  },
  removeAndGetSolutions() {
    let i = this.multiset.length;

    const solutions = [];

    while (i--) {
      if (Object.prototype.isPrototypeOf.call(Solution, this.multiset[i])) {
        solutions.push(this.multiset.splice(i, 1)[0]);
      }
    }

    return solutions;
  },
  removeAndGetReactions() {
    let i = this.multiset.length;

    const reactions = [];

    while (i--) {
      if (Object.prototype.isPrototypeOf.call(Reagent, this.multiset[i])) {
        const reagent = this.multiset.splice(index, 1)[0];

        const args = findMatchingArguments(reagent);

        if (!args) {
          this.multiset.push(reagent);
        } else {
          reactions.push({ reagent, args });
        }
      }
    }
    
    return reactions;
  },
  findMatchingArguments(reagent) {
    if (reagent.args == 0) {
      return [];
    }

    for (let i = 0; i < this.multiset.length - reagent.args; i++) {
       const args = permute(this.multiset.slice(i, i + reagent.args + 1))
          .find(a => reagent.condition(...a));

       if (args) {
         this.multiset.splice(i, reagent.args);

         return args;
       }
    }

    return null;
  }
};
