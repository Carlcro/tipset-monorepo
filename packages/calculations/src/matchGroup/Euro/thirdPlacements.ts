//@ts-nocheck

import { GroupResult } from "../../results/groupResult";
import { MatchGroup } from "../../types/matchGroup";
import { MatchResult } from "../../types/matchResult";
import { Team } from "../../types/team";
import { TeamResult } from "../../types/teamResult";

import { calculateTeamRanking } from "./calculations";
import {
  getKnockoutPhaseGroups,
  mapKnockoutPhaseLineup,
} from "./knockoutPhase";

export function getBestOfThirds(
  groupResults: GroupResult[],
  matches: MatchResult[],
): Team[] {
  const thirds = calculateTopFourThirdPlaces(groupResults, matches);
  const groups = getThirdPlaceGroups(thirds);
  const knockoutPhaseLineup = mapKnockoutPhaseLineup(groups);
  return getKnockoutPhaseGroups(knockoutPhaseLineup, thirds);
}

export function getThirdPlaceGroups(teamResults: TeamResult[]): string[] {
  return teamResults.map((result) => result.groupName);
}

export function calculateTopFourThirdPlaces(
  groupResults: GroupResult[],
  matches: MatchResult[],
): TeamResult[] {
  const thirds = calculateThirdPlaces(groupResults, matches);
  return calculateTeamRanking(thirds, []).slice(0, 4);
}

export function calculateThirdPlaces(
  groupResults: GroupResult[],
  matches: MatchResult[],
): TeamResult[] {
  return groupResults.map((gr) => calculateThirdPlace(gr.results, matches));
}

export function calculateThirdPlace(
  teamResults: TeamResult[],
  matches: MatchResult[],
): TeamResult {
  return calculateTeamRanking(teamResults, matches)[2];
}

export function calculateThirdPlaceGroups(
  groupResults: GroupResult[],
): MatchGroup[] {
  return [];
}
