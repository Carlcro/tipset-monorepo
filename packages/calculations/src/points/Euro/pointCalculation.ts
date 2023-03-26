import { GoalScorer } from "../../types/goalScorer";
import { ObjectId } from "mongodb";
import { GroupResult } from "../../results/groupResult";
import {
  allGroupMatchesSet,
  calculateAdvanceToGroupOf16Points,
  calculateFinalAdvancePoints,
  calculateFinalMatchPoints,
  calculateGoalScorer,
  calculateGroupOf16AdvancePoints,
  calculateGroupOf16MatchPoints,
  calculateGroupOf8AdvancePoints,
  calculateGroupOf8MatchPoints,
  calculateGroupStageScorePoints,
  calculatePositionPoints,
  calculateSemiFinalAdvancePoints,
  calculateSemiFinalMatchPoints,
  isGroupFinished,
} from "../common";
import { calculateTeamRanking } from "../../matchGroup/Euro/calculations";
import { getBestOfThirds } from "../../matchGroup/Euro/thirdPlacements";
import { MatchResult } from "../../types/matchResult";

export function calculatePoints(
  betGroupResults: GroupResult[],
  betMatchResults: MatchResult[],
  betGoalScorer: ObjectId,
  adjustedPoints: number,
  outcomeGroupsResults: GroupResult[],
  outcomeMatchResults: MatchResult[],
  outcomeGoalScorer: GoalScorer
): number {
  const positionPoints = betGroupResults
    .map((groupResult, i): number => {
      return calculatePointsFromGroup(
        groupResult,
        outcomeGroupsResults[i],
        betMatchResults,
        outcomeMatchResults
      );
    })
    .reduce((x, y) => x + y, 0);

  let bestOfThirdsPoints = 0;

  if (allGroupMatchesSet(outcomeMatchResults)) {
    bestOfThirdsPoints = calculateBestOfThirdPoints(
      betGroupResults,
      outcomeGroupsResults,
      betMatchResults,
      outcomeMatchResults
    );
  }

  const matchPoints = outcomeMatchResults
    .map((or) => {
      const matchResult = betMatchResults.find((x) => x.matchId === or.matchId);
      if (matchResult) {
        return getMatchPoint(or, matchResult);
      } else {
        return 0;
      }
    })
    .reduce((acc, x) => acc + x, 0);

  const correctAdvancedTeam = calculateCorrectAdvanceTeam(
    betMatchResults,
    outcomeMatchResults
  );

  const goalScorerPoints = calculateGoalScorer(
    betGoalScorer,
    outcomeGoalScorer
  );

  return (
    matchPoints +
    goalScorerPoints +
    positionPoints +
    bestOfThirdsPoints +
    correctAdvancedTeam +
    adjustedPoints
  );
}

export const calculateBestOfThirdPoints = (
  betGroupResults: GroupResult[],
  groupOutcomes: GroupResult[],
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  const betBestOfThirds = getBestOfThirds(betGroupResults, betMatchResults).map(
    (r) => r._id
  );
  const outcomeBestOfThirds = getBestOfThirds(
    groupOutcomes,
    outcomeMatchResults
  ).map((r) => r._id);

  let points = 0;
  if (betBestOfThirds.length === outcomeBestOfThirds.length) {
    outcomeBestOfThirds.forEach((outcome) => {
      if (betBestOfThirds.includes(outcome)) {
        points = points + 10;
      }
    });
  }
  return points;
};

export const getMatchPoint = (
  outcomeResult: MatchResult,
  matchResult: MatchResult
) => {
  if (outcomeResult.matchId <= 36) {
    return calculateGroupStageScorePoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 44) {
    return calculateGroupOf16MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 48) {
    return calculateGroupOf8MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 50) {
    return calculateSemiFinalMatchPoints(matchResult, outcomeResult);
  } else {
    return calculateFinalMatchPoints(matchResult, outcomeResult);
  }
};

const calculateCorrectAdvanceTeam = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  return (
    calculateGroupOf16AdvancePoints(
      betMatchResults,
      outcomeMatchResults,
      45,
      48
    ) +
    calculateGroupOf8AdvancePoints(
      betMatchResults,
      outcomeMatchResults,
      49,
      50
    ) +
    calculateSemiFinalAdvancePoints(
      betMatchResults,
      outcomeMatchResults,
      51,
      51
    ) +
    calculateFinalAdvancePoints(betMatchResults, outcomeMatchResults, 51)
  );
};

export const calculatePointsFromGroup = (
  groupResult: GroupResult,
  groupOutcome: GroupResult,
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[]
): number => {
  const betTeamRanking = calculateTeamRanking(
    groupResult.results,
    betMatchResults
  );
  const outcomeTeamRanking = calculateTeamRanking(
    groupOutcome.results,
    outcomeMatchResults
  );

  if (isGroupFinished(groupOutcome)) {
    return (
      calculatePositionPoints(betTeamRanking, outcomeTeamRanking) +
      calculateAdvanceToGroupOf16Points(betTeamRanking, outcomeTeamRanking)
    );
  } else {
    return 0;
  }
};
