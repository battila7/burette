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
  extract() {
    const promises = [];
    
    const solutionPromises = this.removeAndGetSolutions().map(s => s.extract());

    return Promise.all(solutionPromises);
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
  }
};
