//@ts-nocheck

import { MatchGroup } from "../../types/matchGroup";
import { RawMatchResult } from "../../types/rawMatchResult";
import { Team } from "../../types/team";
import {
  calculateWinners,
  getGroupResults,
  getGroupScores,
  getScores,
} from "../common";
import { GroupResult } from "../groupResult";

export function calculateGroupResults(
  results: RawMatchResult[],
  matchGroups: MatchGroup[],
): GroupResult[] {
  const scores = getScores(results, 1, 36);
  const groupScores = matchGroups.map(getGroupScores(scores));
  return groupScores.map(getGroupResults());
}

export function calculateGroupOf16Results(results: RawMatchResult[]): Team[] {
  return calculateWinners(results, 37, 44);
}

export function calculateGroupOf8Results(results: RawMatchResult[]): Team[] {
  return calculateWinners(results, 45, 48);
}

export function calculateSemiFinalsResults(results: RawMatchResult[]): Team[] {
  return calculateWinners(results, 49, 50);
}
