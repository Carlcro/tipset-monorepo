//@ts-nocheck

import { Team } from "../../types/team";
import { TeamResult } from "../../types/teamResult";

export const getKnockoutPhase = () => {
  const knockoutPhase = new Map();

  knockoutPhase.set("ABCD", ["A", "D", "B", "C"]);
  knockoutPhase.set("ABCE", ["A", "E", "B", "C"]);
  knockoutPhase.set("ABCF", ["A", "F", "B", "C"]);
  knockoutPhase.set("ABDE", ["D", "E", "A", "B"]);
  knockoutPhase.set("ABDF", ["D", "F", "A", "B"]);
  knockoutPhase.set("ABEF", ["E", "F", "B", "A"]);
  knockoutPhase.set("ACDE", ["E", "D", "C", "A"]);
  knockoutPhase.set("ACDF", ["F", "D", "C", "A"]);
  knockoutPhase.set("ACEF", ["E", "F", "C", "A"]);
  knockoutPhase.set("ADEF", ["E", "F", "D", "A"]);
  knockoutPhase.set("BCDE", ["E", "D", "B", "C"]);
  knockoutPhase.set("BCDF", ["F", "D", "C", "B"]);
  knockoutPhase.set("BCEF", ["F", "E", "C", "B"]);
  knockoutPhase.set("BDEF", ["F", "E", "D", "B"]);
  knockoutPhase.set("CDEF", ["F", "E", "D", "C"]);

  return knockoutPhase;
};

export function getKnockoutPhaseGroups(
  knockoutPhaseLineup: string[],
  thirds: TeamResult[],
): Team[] {
  return knockoutPhaseLineup
    .flatMap((place) => {
      const team = thirds.find((x) => x.groupName === place);
      return team === undefined ? [] : [team];
    })
    .map((teamResult) => teamResult.team);
}

export function mapKnockoutPhaseLineup(groups: string[]): string[] {
  const knockoutPhase = getKnockoutPhase();
  const groupsAsString = groups.sort().join("");
  return knockoutPhase.get(groupsAsString) || [];
}
