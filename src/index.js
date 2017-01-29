import Combinatorics from 'js-combinatorics';

let shapeValidatorFunc = function validate() {
  return true;
};

const Reagent =  {
  t() {
    return true;
  },
  of(options) {
    const defaults = {
      condition: Reagent.t,
      shape: []
    }; 

    options = Object.assign({}, defaults, options);

    if (typeof options.action != 'function') {
      throw new TypeError('The action must not be omitted and must be a function!');
    }

    if (typeof options.condition != 'function') {
      throw new TypeError('The condition must not be omitted and must be a function!');
    }

    if (!Array.isArray(options.shape)) {
      throw new TypeError('The shape must be an array!');
    }

    const obj = Object.create(Reagent);

    obj.condition = options.condition,
    obj.shape = options.shape;
    obj.action = options.action;

    obj.args = Math.max(obj.condition.length, obj.action.length);

    return obj; 
  },
  nShot(reagent) {
    if (this != Reagent) {
      reagent = this;
    }

    if (!Object.prototype.isPrototypeOf.call(Reagent, reagent)) {
      throw new TypeError('The provided argument is not a reagent!');
    }

    function action(...args) {
      const result = reagent.action(...args);

      if (Array.isArray(result)) {
        return [...result, nShotReagent];
      }

      return [result, nShotReagent];
    }

    var nShotReagent = Reagent.of({ 
      condition: reagent.condition,
      shape: reagent.shape, 
      action 
    });

    nShotReagent.args = reagent.args;

    return nShotReagent;
  }
};

const Solution = {
  of(elements, options) {
    const defaults = {
      mergeReagents: true
    };

    const obj = Object.create(Solution);

    obj.multiset = elements.concat();

    obj.options = Object.assign({}, defaults, options);

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

    return Solution.of(solutions);
  },
  react() {    
    const solutionPromises = this.removeAndGetSolutions()
      .map(s => s.react()
                 .then(solution => this.mergeSolution(solution)));

    const reagentPromises = this.removeAndGetReactions()
      .map(r => this.executeReaction(r)
                    .then(result => this.incorporateResult(result)));

    const promises = solutionPromises.concat(reagentPromises)
      .map(p => p.then(() => this.react()));

    return Promise.all(promises).then(() => this);
  },
  mergeSolution(solution) {
    if (!this.options.mergeReagents) {
      const arr =
        solution.multiset.filter(e => !Object.prototype.isPrototypeOf.call(Reagent, e));

      this.multiset.push(...arr);
    } else {
      this.multiset.push(...solution.multiset);
    }
  },
  incorporateResult(result) {
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
      if (this.validateShape(reagent, args) && reagent.condition(...args)) {
        args.forEach(a => this.multiset.splice(this.multiset.indexOf(a), 1));

        return args;
      }
    }

    return null;
  },
  validateShape(reagent, args) {
    const length = Math.min(reagent.shape.length, args.length);

    for (let i = 0; i < length; i++) {
      if (!shapeValidatorFunc(args[i], reagent.shape[i])) {
        return false;
      }
    }

    return true;
  }
};

export default {
  Solution,
  Reagent,
  get shapeValidator() {
    return shapeValidatorFunc;
  },
  set shapeValidator(func) {
    if (typeof func != 'function') {
      throw new TypeError('The argument is not a function!');
    }

    shapeValidatorFunc = func;
  }
};
