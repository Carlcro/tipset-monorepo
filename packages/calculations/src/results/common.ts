import { GroupResult } from "./groupResult";
import { calculateTeamResults } from "../matchGroup/common";
import { MatchResult } from "../types/matchResult";
import { RawMatchResult } from "../types/rawMatchResult";
import { MatchGroup } from "../types/matchGroup";
import { Match } from "../types/match";
import { MatchGroupScores } from "../types/matchGroupScores";
import { Team } from "../types/team";

export function getScores(
  matchResults: RawMatchResult[],
  fromId: number,
  toId: number,
): MatchResult[] {
  return matchResults
    .filter(matchIdRange(fromId, toId))
    .filter(bothScoresAreSet())
    .map(parseScores());
}

function matchIdRange(
  fromId: number,
  toId: number,
): (score: RawMatchResult) => boolean {
  return (score) => score.matchId >= fromId && score.matchId <= toId;
}

function bothScoresAreSet(): (score: RawMatchResult) => boolean {
  return (score) => score.team1Score !== null && score.team2Score !== null;
}

function parseScores(): (score: RawMatchResult) => MatchResult {
  return (score) => {
    return {
      matchId: score.matchId,
      team1: { ...score.team1, name: score.team1.name },
      team2: { ...score.team2, name: score.team2.name },
      team1Score: score.team1Score || 0,
      team2Score: score.team2Score || 0,
      penaltyWinner: score.penaltyWinner,
    };
  };
}

export function getGroupScores(
  scores: MatchResult[],
): (mg: MatchGroup) => MatchGroupScores {
  return (mg) => {
    return { scores: getExistingScores(mg, scores), matchGroup: mg };
  };
}

function getExistingScores(
  mg: MatchGroup,
  scores: MatchResult[],
): MatchResult[] {
  return mg.matches
    .map(findMatchScore(scores))
    .filter(scoreExists()) as MatchResult[];
}

function findMatchScore(
  scores: MatchResult[],
): (match: Match) => MatchResult | undefined {
  return (match) => scores.find((s) => s.matchId === match.matchId);
}

function scoreExists(): (score: MatchResult | undefined) => boolean {
  return (score) => score !== undefined;
}

export function getGroupResults(): (group: MatchGroupScores) => GroupResult {
  return (mgs) => {
    return {
      name: mgs.matchGroup.name,
      results: calculateTeamResults(
        mgs.scores,
        mgs.matchGroup.teams,
        mgs.matchGroup.name,
      ),
    };
  };
}

export function calculateWinners(
  results: RawMatchResult[],
  fromId: number,
  toId: number,
): Team[] {
  const scores = getScores(results, fromId, toId);
  return scores.map(getWinningTeam()).filter((t) => t !== undefined);
}

export function calculateLosers(
  results: RawMatchResult[],
  fromId: number,
  toId: number,
): Team[] {
  const scores = getScores(results, fromId, toId);
  return scores.map(getLosingTeam()).filter((t) => t !== undefined);
}

function getLosingTeam(): (score: MatchResult) => Team {
  return (score) => {
    if (score.team1Score > score.team2Score) {
      return score.team2;
    } else if (score.team1Score < score.team2Score) {
      return score.team1;
    } else {
      return score.penaltyWinner?.id === score.team1.id
        ? score.team2
        : score.team1;
    }
  };
}

function getWinningTeam(): (score: MatchResult) => Team {
  return (score) => {
    if (score.team1Score > score.team2Score) {
      return score.team1;
    } else if (score.team1Score < score.team2Score) {
      return score.team2;
    } else {
      return score.penaltyWinner as Team;
    }
  };
}
