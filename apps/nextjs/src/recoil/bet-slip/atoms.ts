import { GoalScorer } from "./../../../../../packages/calculations/src/types/goalScorer";
import { Team } from "./../../../../../packages/calculations/src/types/team";
import { atom } from "recoil";

export type MatchBet = {
  matchId: number;
  team1: Team;
  team2: Team;
  penaltyWinner?: Team | null;
  team1Score: number;
  team2Score: number;
  points?: number;
};

export type BetslipState = Array<MatchBet>;

export type PointsFromGroupState = Array<{
  group: string;
  points: number;
}>;

export type PointsFromAdvancementState = Array<{
  final: string;
  points: number;
}>;

export const betSlipState = atom({
  key: "betSlipState",
  default: [] as BetslipState,
});

export const pointsFromGroupState = atom({
  key: "pointsFromGroup",
  default: [] as PointsFromGroupState,
});

export const pointsFromAdvancementState = atom({
  key: "pointsFromAdvancement",
  default: [] as PointsFromAdvancementState,
});

export const pointsFromGoalscorerState = atom({
  key: "pointsFromGoalscorer",
  default: null as number | null,
});

export const goalscorerState = atom({
  key: "goalsScorerState",
  default: null as null | GoalScorer,
});
