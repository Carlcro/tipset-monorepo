// @ts-nocheck

import {
  getFinalMatchPointsExplanation,
  getGroupOf16MatchPointsExplanation,
  getGroupOf8MatchPointsExplanation,
  getGroupStageScorePointsExplanation,
  getSemiFinalMatchPointsExplanation,
} from "../common";
import { GoalScorer } from "../../types/goalScorer";
import { GroupResult } from "../../results/groupResult";
import {
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
import { MatchResult } from "../../types/matchResult";

export function calculatePoints(
  betGroupResults: GroupResult[],
  betMatchResults: MatchResult[],
  betGoalScorerId: string,
  adjustedPoints: number,
  outcomeGroupsResults: GroupResult[],
  outcomeMatchResults: MatchResult[],
  outcomeGoalScorer: GoalScorer,
): number {
  const positionPoints = betGroupResults
    .map((groupResult, i): number => {
      return calculatePointsFromGroup(
        groupResult,
        outcomeGroupsResults[i],
        betMatchResults,
        outcomeMatchResults,
      );
    })
    .reduce((x, y) => x + y, 0);

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
    outcomeMatchResults,
  ).reduce((acc, x) => acc + x.points, 0);

  const goalScorerPoints = calculateGoalScorer(
    betGoalScorerId,
    outcomeGoalScorer,
  );

  return (
    matchPoints +
    goalScorerPoints +
    positionPoints +
    correctAdvancedTeam +
    adjustedPoints
  );
}

export const getMatchPoint = (
  outcomeResult: MatchResult,
  matchResult: MatchResult,
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

export const getMatchExplanationText = (
  outcomeResult: MatchResult,
  matchResult: MatchResult,
) => {
  if (outcomeResult.matchId <= 36) {
    return getGroupStageScorePointsExplanation(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 44) {
    return getGroupOf16MatchPointsExplanation(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 48) {
    return getGroupOf8MatchPointsExplanation(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 50) {
    return getSemiFinalMatchPointsExplanation(matchResult, outcomeResult);
  } else {
    return getFinalMatchPointsExplanation(matchResult, outcomeResult);
  }
};

interface AdvancementPoints {
  final: string;
  points: number;
}

export const calculateCorrectAdvanceTeam = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
): AdvancementPoints[] => {
  return [
    {
      final: "Åttondelsfinaler",
      points: calculateGroupOf16AdvancePoints(
        betMatchResults,
        outcomeMatchResults,
        45,
        48,
      ),
    },
    {
      final: "Kvartsfinaler",
      points: calculateGroupOf8AdvancePoints(
        betMatchResults,
        outcomeMatchResults,
        49,
        50,
      ),
    },
    {
      final: "Semifinaler",
      points: calculateSemiFinalAdvancePoints(
        betMatchResults,
        outcomeMatchResults,
        51,
        51,
      ),
    },
    {
      final: "Final",
      points: calculateFinalAdvancePoints(
        betMatchResults,
        outcomeMatchResults,
        51,
      ),
    },
  ];
};

export const calculatePointsFromGroup = (
  groupResult: GroupResult,
  groupOutcome: GroupResult,
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
): number => {
  const betTeamRanking = calculateTeamRanking(
    groupResult.results,
    betMatchResults,
  );
  const outcomeTeamRanking = calculateTeamRanking(
    groupOutcome.results,
    outcomeMatchResults,
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
