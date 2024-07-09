// @ts-nocheck

import {
  getGroupOf16MatchPointsExplanation,
  getGroupStageScorePointsExplanation,
  getSemiFinalMatchPointsExplanation,
  getThirdPlaceFinalMatchPointsExplanation,
  getGroupOf8MatchPointsExplanation,
  getFinalMatchPointsExplanation,
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
  calculateThirdPlaceFinalMatchPoints,
  isGroupFinished,
} from "../common";
import { calculateTeamRanking } from "../../matchGroup/World/calculations";
import { MatchResult } from "../../types/matchResult";

export const getMatchPoint = (
  outcomeResult: MatchResult,
  matchResult: MatchResult,
) => {
  if (outcomeResult.matchId <= 48) {
    return calculateGroupStageScorePoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 56) {
    return calculateGroupOf16MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 60) {
    return calculateGroupOf8MatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 62) {
    return calculateSemiFinalMatchPoints(matchResult, outcomeResult);
  } else if (outcomeResult.matchId === 63) {
    return calculateThirdPlaceFinalMatchPoints(matchResult, outcomeResult);
  } else {
    return calculateFinalMatchPoints(matchResult, outcomeResult);
  }
};

export const getMatchExplanationText = (
  outcomeResult: MatchResult,
  matchResult: MatchResult,
) => {
  if (outcomeResult.matchId <= 48) {
    return getGroupStageScorePointsExplanation(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 56) {
    return getGroupOf16MatchPointsExplanation(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 60) {
    return getGroupOf8MatchPointsExplanation(matchResult, outcomeResult);
  } else if (outcomeResult.matchId <= 62) {
    return getSemiFinalMatchPointsExplanation(matchResult, outcomeResult);
  } else if (outcomeResult.matchId === 63) {
    return getThirdPlaceFinalMatchPointsExplanation(matchResult, outcomeResult);
  } else {
    return getFinalMatchPointsExplanation(matchResult, outcomeResult);
  }
};

interface AdvancementPoints {
  final: string;
  points: number;
}

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
