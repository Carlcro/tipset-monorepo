import {
  getFinalMatchPointsExplanation,
  getGroupOf16MatchPointsExplanation,
  getGroupOf8MatchPointsExplanation,
  getGroupStageScorePointsExplanation,
  getSemiFinalMatchPointsExplanation,
} from "../common";
import { GroupResult } from "../../results/groupResult";
import {
  calculateAdvanceToGroupOf16Points,
  calculateFinalMatchPoints,
  calculateGroupOf16MatchPoints,
  calculateGroupOf8MatchPoints,
  calculateGroupStageScorePoints,
  calculatePositionPoints,
  calculateSemiFinalMatchPoints,
  isGroupFinished,
} from "../common";
import { calculateTeamRanking } from "../../matchGroup/Euro/calculations";
import { Bet } from "../../types/bet";

export const getMatchPoint = (
  outcomeResult: Bet,
  matchResult: Bet,
  outcomes: Bet[],
) => {
  if (outcomeResult.matchId <= 36) {
    return calculateGroupStageScorePoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 44) {
    return calculateGroupOf16MatchPoints(matchResult, outcomeResult, outcomes);
  } else if (outcomeResult.matchId <= 48) {
    return calculateGroupOf8MatchPoints(matchResult, outcomeResult, outcomes);
  } else if (outcomeResult.matchId <= 50) {
    return calculateSemiFinalMatchPoints(matchResult, outcomeResult, outcomes);
  } else {
    return calculateFinalMatchPoints(matchResult, outcomeResult, outcomes);
  }
};

export const getMatchExplanationText = (
  outcomeResults: Bet[],
  matchResult: Bet,
) => {
  if (matchResult.matchId <= 36) {
    return getGroupStageScorePointsExplanation(matchResult, outcomeResults);
  } else if (matchResult.matchId <= 44) {
    return getGroupOf16MatchPointsExplanation(matchResult, outcomeResults);
  } else if (matchResult.matchId <= 48) {
    return getGroupOf8MatchPointsExplanation(matchResult, outcomeResults);
  } else if (matchResult.matchId <= 50) {
    return getSemiFinalMatchPointsExplanation(matchResult, outcomeResults);
  } else {
    return getFinalMatchPointsExplanation(matchResult, outcomeResults);
  }
};

export const calculatePointsFromGroup = (
  groupResult: GroupResult,
  groupOutcome: GroupResult,
  betMatchResults: Bet[],
  outcomeMatchResults: Bet[],
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
