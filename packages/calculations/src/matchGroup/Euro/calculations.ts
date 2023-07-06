//@ts-nocheck

import { Match } from "../../types/match";
import { MatchResult } from "../../types/matchResult";
import { RankedGroup } from "../../types/rankedGroup";
import { Team } from "../../types/team";
import { TeamResult } from "../../types/teamResult";
import { calculateInnerTeamRanking } from "./innerTeamRanking";

export function calculateGroupOf16(
  rankedGroups: RankedGroup[],
  bestOfThirds: Team[],
): Match[] {
  if (rankedGroups.reduce((acc, x) => acc + x.teams.length, 0) < 24) {
    return [];
  }

  return [
    {
      matchId: 40,
      team1: rankedGroups[1].teams[0],
      team2: bestOfThirds[0],
    },
    {
      matchId: 38,
      team1: rankedGroups[0].teams[0],
      team2: rankedGroups[2].teams[1],
    },
    {
      matchId: 42,
      team1: rankedGroups[5].teams[0],
      team2: bestOfThirds[3],
    },
    {
      matchId: 41,
      team1: rankedGroups[3].teams[1],
      team2: rankedGroups[4].teams[1],
    },
    {
      matchId: 44,
      team1: rankedGroups[4].teams[0],
      team2: bestOfThirds[2],
    },
    {
      matchId: 43,
      team1: rankedGroups[3].teams[0],
      team2: rankedGroups[5].teams[1],
    },
    {
      matchId: 39,
      team1: rankedGroups[2].teams[0],
      team2: bestOfThirds[1],
    },
    {
      matchId: 37,
      team1: rankedGroups[0].teams[1],
      team2: rankedGroups[1].teams[1],
    },
  ];
}

export function calculateGroupOf8(teams: Team[]): Match[] {
  if (teams.length < 8) {
    return [];
  }

  return [
    {
      matchId: 45,
      team1: teams[2],
      team2: teams[3],
    },
    {
      matchId: 46,
      team1: teams[0],
      team2: teams[1],
    },
    {
      matchId: 47,
      team1: teams[6],
      team2: teams[7],
    },
    {
      matchId: 48,
      team1: teams[4],
      team2: teams[5],
    },
  ];
}

export function calculateSemiFinals(teams: Team[]): Match[] {
  if (teams.length < 4) {
    return [];
  }

  return [
    {
      matchId: 49,
      team1: teams[1],
      team2: teams[0],
    },
    {
      matchId: 50,
      team1: teams[3],
      team2: teams[2],
    },
  ];
}

export function calculateFinal(teams: Team[]): Match[] {
  if (teams.length < 2) {
    return [];
  }

  return [
    {
      matchId: 51,
      team1: teams[0],
      team2: teams[1],
    },
  ];
}

export function calculateTeamRanking(
  teamResults: TeamResult[],
  matches: MatchResult[],
): TeamResult[] {
  const results = [...teamResults];
  const groupMatches = [...matches].filter((x) => Boolean(x.matchId));
  const innerRanking = calculateInnerTeamRanking(results, groupMatches);

  results.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    } else {
      if (innerRanking.findIndex((x) => x.id === a.team.id) < 0) {
        return 1;
      }
      return (
        innerRanking.findIndex((x) => x.id === b.team.id) -
        innerRanking.findIndex((x) => x.id === a.team.id)
      );
    }
  });

  return results;
}
