import { calculatePoints } from "./pointCalculation";
import MatchResultBuilder from "../../__builders__/MatchResultBuilder";
import GroupResultBuilder from "../../__builders__/GroupResultBuilder";

const betResults = [
  new MatchResultBuilder().build(),
  new MatchResultBuilder().build(),
  new MatchResultBuilder().build(),
  new MatchResultBuilder().build(),
];

const outcomeResults = [
  new MatchResultBuilder().build(),
  new MatchResultBuilder().build(),
  new MatchResultBuilder().build(),
  new MatchResultBuilder().build(),
];

const groupResults = [
  new GroupResultBuilder().build(),
  new GroupResultBuilder().build(),
];

const groupOutcomes = [
  new GroupResultBuilder().build(),
  new GroupResultBuilder().build(),
];

describe("pointCalculations", () => {
  it("calculatePoints", () => {
    const points = calculatePoints(
      groupResults,
      betResults,
      groupOutcomes,
      outcomeResults
    );

    expect(points).toEqual(100);
  });
});
