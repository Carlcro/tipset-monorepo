import { Match } from "../../types/match";
import { MatchResult } from "../../types/matchResult";
import { RankedGroup } from "../../types/rankedGroup";
import { Team } from "../../types/team";
import { TeamResult } from "../../types/teamResult";
import { calculateInnerTeamRanking } from "./innerTeamRanking";

export function calculateGroupOf16(rankedGroups: RankedGroup[]): Match[] {
  if (rankedGroups.reduce((acc, x) => acc + x.teams.length, 0) < 32) {
    return [];
  }

  return [
    {
      matchId: 49,
      team1: rankedGroups[0].teams[0],
      team2: rankedGroups[1].teams[1],
    },
    {
      matchId: 50,
      team1: rankedGroups[2].teams[0],
      team2: rankedGroups[3].teams[1],
    },
    {
      matchId: 51,
      team1: rankedGroups[1].teams[0],
      team2: rankedGroups[0].teams[1],
    },
    {
      matchId: 52,
      team1: rankedGroups[3].teams[0],
      team2: rankedGroups[2].teams[1],
    },
    {
      matchId: 53,
      team1: rankedGroups[4].teams[0],
      team2: rankedGroups[5].teams[1],
    },
    {
      matchId: 54,
      team1: rankedGroups[6].teams[0],
      team2: rankedGroups[7].teams[1],
    },
    {
      matchId: 55,
      team1: rankedGroups[5].teams[0],
      team2: rankedGroups[4].teams[1],
    },
    {
      matchId: 56,
      team1: rankedGroups[7].teams[0],
      team2: rankedGroups[6].teams[1],
    },
  ];
}

export function calculateGroupOf8(teams: Team[]): Match[] {
  if (teams.length < 8) {
    return [];
  }

  return [
    {
      matchId: 57,
      team1: teams[0],
      team2: teams[1],
    },
    {
      matchId: 58,
      team1: teams[4],
      team2: teams[5],
    },
    {
      matchId: 59,
      team1: teams[2],
      team2: teams[3],
    },
    {
      matchId: 60,
      team1: teams[6],
      team2: teams[7],
    },
  ];
}

export function calculateSemiFinals(teams: Team[]): Match[] {
  if (teams.length < 4) {
    return [];
  }

  return [
    {
      matchId: 61,
      team1: teams[1],
      team2: teams[0],
    },
    {
      matchId: 62,
      team1: teams[2],
      team2: teams[3],
    },
  ];
}

export function calculateThirdPlaceMatch(teams: Team[]): Match[] {
  if (teams.length < 2) {
    return [];
  }

  return [
    {
      matchId: 63,
      team1: teams[0],
      team2: teams[1],
    },
  ];
}

export function calculateFinal(teams: Team[]): Match[] {
  if (teams.length < 2) {
    return [];
  }

  return [
    {
      matchId: 64,
      team1: teams[0],
      team2: teams[1],
    },
  ];
}

export function calculateTeamRanking(
  teamResults: TeamResult[],
  matches: MatchResult[]
): TeamResult[] {
  const results = [...teamResults];
  const groupMatches = [...matches].filter((x) => Boolean(x.matchId));
  const innerRanking = calculateInnerTeamRanking(results, groupMatches);

  results.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    } else if (a.diff !== b.diff) {
      return b.diff - a.diff;
    } else if (a.goals !== b.goals) {
      return b.goals - a.goals;
    } else {
      if (innerRanking.findIndex((x) => x._id === a.team._id) < 0) {
        return 1;
      }
      return (
        innerRanking.findIndex((x) => x._id === b.team._id) -
        innerRanking.findIndex((x) => x._id === a.team._id)
      );
    }
  });

  return results;
}
