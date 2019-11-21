/*
    Write a program that outputs all possibilities to put a + or - or nothing between the numbers 1-9 (in order) such that the result is 100. For example:

    1 + 2 + 34 - 5 + 67 - 8 + 9 = 100
    The function should output a list of strings with these formulas.

    Hint: this is a recursive problem. Use divide and conquer.
 */

type solveT = (input: number[], aimingFor: number) => string[][];

const solve: solveT = (input, valueOfExpresion) => {
  const concat = (a: number, b: number) => parseInt(a.toString() + b.toString());
  const innerSolve:solveT = (i: number[], v: number) => {
    const [head, ...tail] = i;

    // recursion ends here
    if (!tail.length) {
      if (head === v) {
        // success
        return [[head.toString()]];
      }
      // failure
      return [];
    }

    const plus = innerSolve(tail, v - head).reduce(
      (acc: string[][], result: string[]) => {
        if (!result.length) return acc;
        return [...acc, [head.toString(), '+', ...result]];
      },
      []
    );

    const minus = innerSolve(tail, v + head).reduce(
      (acc: string[][], result: string[]) => {
        if (!result.length) return acc;
        return [...acc, [head.toString(), '-', ...result]];
      },
      []
    );

    const [nextHead, ...nextTail] = tail;
    const merge = innerSolve([concat(nextHead, head), ...nextTail], v);

    return [...plus, ...minus, ...merge]
  };
  return innerSolve(input.reverse(), valueOfExpresion).map(_ => _.reverse());
};

const evaluate = (input: string[]) => {
  const num = (a: number) => (fn: Function) => fn(a);
  const plus = (a: number) => (b: number) => a + b;
  const minus = (a: number) => (b: number) => a - b;
  const identity = (a: number) => a;
  // turn numbers and operators into functions
  const functions = input.map((foo: string) => {
    if (foo === "+") return plus;
    if (foo === "-") return minus;
    return num(parseInt(foo));
  });
  // compose functions
  return functions.reduce((acc, f: Function) => f(acc), identity);
};

test("2019 week 47", () => {
  const solutions = solve([1, 2, 3, 4, 5, 6, 7, 8, 9], 100);
  console.log(solutions.map(_ => _.join(' ')));
  solutions.forEach(solution => {
    console.log(solution.join(" "));
    expect(evaluate(solution)).toBe(100);
  });
});
