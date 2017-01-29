import Combinatorics from 'js-combinatorics';

export const Reagent =  {
  t() {
    return true;
  },
  of(condition, action) {
    const obj = Object.create(Reagent);

    if (!action) {
      action = condition;

      obj.condition = Reagent.t;
    } else {
      obj.condition = condition;
    }

    obj.action = action;

    obj.args = Math.max(obj.condition.length, obj.action.length);

    return obj; 
  },
  nShot(reagent) {
    if (!Object.prototype.isPrototypeOf.call(Reagent, reagent)) {
      throw new TypeError('The provided argument is not a reagent!');
    }

    function action(...args) {
      return [reagent.action(...args), result];
    }

    var result = Reagent.of(reagent.condition, action);

    result.args = reagent.args;

    return result;
  }
};

export const Solution = {
  of(elements) {
    const obj = Object.create(Solution);

    obj.multiset = elements.concat();

    return obj;
  },
  parallel(...args) {
    const solutions = args.map(function toSolution(a) {
      if (Object.prototype.isPrototypeOf.call(Solution, a)) {
        return a;
      } else if (Array.isArray(a)) {
        return Solution.of(a);
      }

      return Solution.of([a]);
    });

    if (this != Solution) {
      this.multiset.push(...solutions);

      return this;
    } else {
      return Solution.of(solutions);
    }
  },
  react() {    
    const solutionPromises = this.removeAndGetSolutions()
      .map(s => s.react());

    const reagentPromises = this.removeAndGetReactions()
      .map(r => this.executeReaction(r));

    const promises = solutionPromises.concat(reagentPromises)
      .map(p => p.then(result => this.incorporateResult(result))
                 .then(() => this.react()));

    return Promise.all(promises).then(() => this);
  },
  incorporateResult(result) {
    if (Object.prototype.isPrototypeOf.call(Solution, result)) {
      result = result.multiset;
    }

    if (Array.isArray(result)) {
      this.multiset.push(...result);
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
        const reagent = this.multiset.splice(i, 1)[0];

        const args = this.findMatchingArguments(reagent);

        if (!args) {
          this.multiset.push(reagent);
        } else {
          reactions.push({ reagent, args });

          i = this.multiset.length;
        }
      }
    }
    
    return reactions;
  },
  findMatchingArguments(reagent) {
    if (reagent.args == 0) {
      return [];
    }

    if (reagent.args > this.multiset.length) {
      return null;
    }

    const perm = Combinatorics.permutation(this.multiset, reagent.args);

    let args;

    // eslint-disable-next-line no-cond-assign
    while (args = perm.next()) {
      if (reagent.condition(...args)) {
        args.forEach(a => this.multiset.splice(this.multiset.indexOf(a), 1));

        return args;
      }
    }

    return null;
  }
};
