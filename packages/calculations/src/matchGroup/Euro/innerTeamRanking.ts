//@ts-nocheck

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
        const sortedTiebreaker = SortTiebreaker(
          [matchResult],
          tiedTeams,
          matchResults,
          results,
        );

        sortedTeams.push(...sortedTiebreaker.map((result) => result.team));
      } else {
        const sortedTiebreaker = SortTiebreaker(
          [],
          tiedTeams,
          matchResults,
          results,
        );
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

      const sortedTiebreaker = SortTiebreaker(
        matchResult,
        tiedTeams,
        matchResults,
        results,
      );

      sortedTeams.push(...sortedTiebreaker.map((result) => result.team));
    } else {
      const sortedTiebreaker = SortTiebreaker(
        matchResults,
        tiedTeams,
        matchResults,
        results,
      );

      sortedTeams.push(...sortedTiebreaker.map((result) => result.team));
    }
  });

  return sortedTeams;
}

function SortTiebreaker(
  matchResult: MatchResult[],
  tiedTeams: Team[],
  matchResults: MatchResult[],
  results: TeamResult[],
) {
  const teamsInQuestion = calculateTeamResults(matchResult, tiedTeams);

  const sameShit = groupTeamsWithSameShit(teamsInQuestion);

  if (sameShit.length === 2) {
    teamsInQuestion.sort((a, b) => {
      if (a.diff !== b.diff) {
        return a.diff - b.diff;
      } else {
        if (a.goals !== b.goals) {
          return a.goals - b.goals;
        } else {
          const matchResult = getMatchResultTwoTeams(
            a.team.id,
            b.team.id,
            matchResults,
          );

          if (matchResult) {
            const aScore =
              matchResult.team1.id === a.team.id
                ? matchResult.team1Score
                : matchResult.team2Score;

            const bScore =
              matchResult.team1.id === b.team.id
                ? matchResult.team1Score
                : matchResult.team2Score;

            if (aScore !== bScore) {
              return aScore - bScore;
            } else {
              const aTot = results.find((x) => x.team.id === a.team.id);
              const bTot = results.find((x) => x.team.id === b.team.id);

              if (aTot && bTot) {
                if (aTot.diff !== bTot.diff) {
                  return aTot.diff - bTot.diff;
                } else {
                  if (aTot.goals !== bTot.goals) {
                    return aTot.goals - bTot.goals;
                  } else {
                    if (aTot.won !== bTot.won) {
                      return aTot.won - bTot.won;
                    } else {
                      return 1;
                    }
                  }
                }
              } else {
                return 1;
              }
            }
          } else {
            return 1;
          }
        }
      }
    });
  } else {
    teamsInQuestion.sort((a, b) => {
      if (a.diff !== b.diff) {
        return a.diff - b.diff;
      } else {
        if (a.goals !== b.goals) {
          return a.goals - b.goals;
        } else {
          const aTot = results.find((x) => x.team.id === a.team.id);
          const bTot = results.find((x) => x.team.id === b.team.id);

          if (aTot && bTot) {
            if (aTot.diff !== bTot.diff) {
              return aTot.diff - bTot.diff;
            } else {
              if (aTot.goals !== bTot.goals) {
                return aTot.goals - bTot.goals;
              } else {
                if (aTot.won !== bTot.won) {
                  return aTot.won - bTot.won;
                } else {
                  return 1;
                }
              }
            }
          } else {
            return 1;
          }
        }
      }
    });
  }

  return teamsInQuestion;
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
  return Object.entries(groupBy((x) => `${x.points}`, results)).map((x) =>
    x[1].map((y) => y.team),
  );
}

export function groupTeamsWithSameShit(results: TeamResult[]): Team[][] {
  return Object.entries(
    groupBy((x) => `${x.points}:${x.diff}:${x.goals}`, results),
  ).map((x) => x[1].map((y) => y.team));
}
