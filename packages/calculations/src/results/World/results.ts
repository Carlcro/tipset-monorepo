import {
  calculateLosers,
  calculateWinners,
  getGroupResults,
  getGroupScores,
  getScores,
} from "../common";
import { GroupResult } from "../groupResult";
import { Team } from "../../types/team";
import { RawMatchResult } from "../../types/rawMatchResult";
import { MatchGroup } from "../../types/matchGroup";

export function calculateGroupResults(
  results: RawMatchResult[],
  matchGroups: MatchGroup[]
): GroupResult[] {
  const scores = getScores(results, 1, 48);
  const groupScores = matchGroups.map(getGroupScores(scores));
  return groupScores.map(getGroupResults());
}

export function calculateGroupOf16Results(results: RawMatchResult[]): Team[] {
  return calculateWinners(results, 49, 56);
}

export function calculateGroupOf8Results(results: RawMatchResult[]): Team[] {
  return calculateWinners(results, 57, 60);
}

export function calculateSemiFinalsResults(results: RawMatchResult[]): Team[] {
  return calculateWinners(results, 61, 62);
}

export function calculateSemiFinalsLosers(results: RawMatchResult[]): Team[] {
  return calculateLosers(results, 61, 62);
}
