import { add, matrix, Matrix, multiply, subtract, sum } from "mathjs";
import { BaseComponent } from "./component";

const transforms = {
  se: matrix([0, 1, -1]),
  e: matrix([1, 0, -1]),
  ne: matrix([1, -1, 0]),
  nw: matrix([0, -1, 1]),
  w: matrix([-1, 0, 1]),
  sw: matrix([-1, 1, 0]),
};

export interface HECSPosition extends BaseComponent<"hecsPosition"> {
  value: Matrix;
}

export function hecsMove(
  position: Matrix,
  direction: keyof typeof transforms
): Matrix {
  return add(position, transforms[direction]) as Matrix;
}

export function hecsDistance(a: Matrix, b: Matrix): number {
  return sum((subtract(a, b) as Matrix).map(Math.abs)) / 2;
}

export function hecsRound(position: Matrix): Matrix {
  const rounded = position.map(Math.round);
  const diff = (subtract(position, rounded) as Matrix).map(Math.abs);

  if (diff.get([0]) > diff.get([1]) && diff.get([0]) > diff.get([2])) {
    rounded.set([0], -rounded.get([1]) - rounded.get([2]));
  } else if (diff.get([1]) > diff.get([2])) {
    rounded.set([1], -rounded.get([0]) - rounded.get([2]));
  } else {
    rounded.set([2], -rounded.get([0]) - rounded.get([1]));
  }

  return rounded;
}

export function hecsToCartesian(position: Matrix, scale: number): Matrix {
  return multiply(
    multiply(
      matrix([
        [3 / 2, 0],
        [Math.sqrt(3) / 2, Math.sqrt(3)],
      ]),
      position.resize([2])
    ),
    scale
  );
}