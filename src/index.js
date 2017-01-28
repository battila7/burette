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
