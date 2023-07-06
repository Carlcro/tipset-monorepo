// @ts-nocheck

import { groupBy } from "ramda";
import { MatchResult } from "../../types/matchResult";
import { Team } from "../../types/team";
import { TeamResult } from "../../types/teamResult";
import { calculateTeamResults } from "../common";

export function calculateInnerTeamRanking(
  results: TeamResult[],
  matchResults: MatchResult[],
): Team[] {
  const sortedTeams: Team[] = [];
  const teamsInTie = groupTiedTeams(results);

  teamsInTie.forEach((tiedTeams) => {
    if (tiedTeams.length === 2) {
      const team1 = tiedTeams[0];
      const team2 = tiedTeams[1];
      const matchResult = getMatchResultTwoTeams(
        team1.id,
        team2.id,
        matchResults,
      );

      if (matchResult) {
        const sortedTiebreaker = SortTiebreaker([matchResult], tiedTeams);

        sortedTeams.push(...sortedTiebreaker.map((result) => result.team));
      } else {
        const sortedTiebreaker = SortTiebreaker([], tiedTeams);
        sortedTeams.push(...sortedTiebreaker.map((result) => result.team));
      }
    } else if (tiedTeams.length === 3) {
      const team1 = tiedTeams[0];
      const team2 = tiedTeams[1];
      const team3 = tiedTeams[2];

      const matchResult = getMatchResultForThreeTeams(
        team1.id,
        team2.id,
        team3.id,
        matchResults,
      );

      const sortedTiebreaker = SortTiebreaker(matchResult, tiedTeams);

      sortedTeams.push(...sortedTiebreaker.map((result) => result.team));
    } else {
      const sortedTiebreaker = SortTiebreaker(matchResults, tiedTeams);

      sortedTeams.push(...sortedTiebreaker.map((result) => result.team));
    }
  });

  return sortedTeams;
}

function SortTiebreaker(matchResult: MatchResult[], tiedTeams: Team[]) {
  const teamsInQuestion = calculateTeamResults(matchResult, tiedTeams);

  const sortedTeams = teamsInQuestion.sort((a, b) => {
    if (a.points !== b.points) {
      return a.points - b.points;
    } else if (a.diff !== b.diff) {
      return a.diff - b.diff;
    } else if (a.goals - b.goals) {
      return a.goals - b.goals;
    } else {
      return b.team.name.localeCompare(a.team.name);
    }
  });

  return sortedTeams;
}

function getMatchResultTwoTeams(
  teamId1: string,
  teamId2: string,
  matches: MatchResult[],
): MatchResult {
  return matches.filter(
    (match) =>
      (match.team1.id === teamId1 && match.team2.id === teamId2) ||
      (match.team1.id === teamId2 && match.team2.id === teamId1),
  )[0];
}

function getMatchResultForThreeTeams(
  teamId1: string,
  teamId2: string,
  teamId3: string,
  matches: MatchResult[],
): MatchResult[] {
  return matches.filter(
    (match) =>
      (match.team1.id === teamId1 && match.team2.id === teamId2) ||
      (match.team1.id === teamId1 && match.team2.id === teamId3) ||
      (match.team1.id === teamId2 && match.team2.id === teamId1) ||
      (match.team1.id === teamId2 && match.team2.id === teamId3) ||
      (match.team1.id === teamId3 && match.team2.id === teamId1) ||
      (match.team1.id === teamId3 && match.team2.id === teamId2),
  );
}

export function groupTiedTeams(results: TeamResult[]): Team[][] {
  return Object.entries(
    groupBy((x) => `${x.points}:${x.diff}:${x.goals}`, results),
  ).map((x) => x[1].map((y) => y.team));
}
