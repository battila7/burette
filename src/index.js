import Combinatorics from 'js-combinatorics';

const t = function t() {
  return true;
};

const Reagent =  {
  of(options) {
    const defaults = {
      condition: t,
      shape: [],
      acceptReagent: false
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

const returnGenericTropes = function returnGenericTropes(options) {
  if (typeof options == 'function') {
    return Reagent.of({
      action: options
    }).nShot();
  }

  return Reagent.of(options).nShot();
};

const Tropes = {
  Transmuter: returnGenericTropes,
  Reducer: returnGenericTropes,
  Optimiser(options) {
    const action = function action(x, y) {
      return [options.left(x, y), options.right(x, y)];
    };

    const condition = function condition(x, y) {
      const left = options.left(x, y);
      const right = options.right(x, y);

      return options.ordering({ x: left, y: right }, { x, y }) && options.relation(x, y) && options.relation(left, right);
    };

    return Reagent.of({
      condition,
      shape: options.shape || [],
      action
    }).nShot();
  },
  Expander(options) {
    const action = function action(x) {
      return [options.left(x), options.right(x)];
    };

    return Reagent.of({
      condition: options.condition,
      shape: options.shape || [],
      action
    }).nShot();
  },
  Selector: returnGenericTropes
};

const argsIntoSolutions = function argsIntoSolutions(...args) {
  return args.map(function toSolution(a) {
    if (Object.prototype.isPrototypeOf.call(Solution, a)) {
      return a;
    } else if (Array.isArray(a)) {
      return Solution.of(a);
    }

    return Solution.of([a]);
  });
};

const Solution = {
  of(elements, options) {
    const defaults = {
      mergeReagents: false,
      shapeValidator: t
    };

    const obj = Object.create(Solution);

    obj.multiset = elements.concat();

    obj.options = Object.assign({}, defaults, options);

    return obj;
  },
  seq(...args) {
    const solutions = argsIntoSolutions(...args);

    for (let i = 0; i < solutions.length - 1; i++) {
      solutions[i + 1].multiset.push(solutions[i]);
    }

    return solutions[solutions.length - 1];
  },
  parallel(...args) {
    return Solution.of(argsIntoSolutions(...args));
  },
  setShapeValidator(func) {
    if (typeof func != 'function') {
      throw new TypeError('The shape validator must be a function!');
    }

    this.options.shapeValidator = func;

    return this;
  },
  getShapeValidator() {
    return this.options.shapeValidator;
  },
  applyValidatorToSubsolutions(overwrite) {
    const validator = this.getShapeValidator();

    (function recursivelySet(solution) {
      solution.multiset.filter(function filterSolutions(element) {
        return Object.prototype.isPrototypeOf.call(Solution, element);
      }).forEach(function setter(subsolution) {
        if (overwrite || subsolution.options.shapeValidator == t) {
          subsolution.setShapeValidator(validator);
        }

        recursivelySet(subsolution);
      });
    })(this);

    return this;
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
      const noReagentMatch = !reagent.acceptReagent
                           && Object.prototype.isPrototypeOf.call(Reagent, args[i]);

      if (noReagentMatch || !this.options.shapeValidator(args[i], reagent.shape[i])) {
        return false;
      }
    }

    return true;
  }
};

export default {
  Solution,
  Reagent,
  Tropes
};
