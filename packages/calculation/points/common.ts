import { ObjectId } from "mongodb";
import { GroupResult } from "../results/groupResult";
import { GoalScorer } from "../types/goalScorer";
import { MatchResult } from "../types/matchResult";
import { TeamResult } from "../types/teamResult";

export const calculateGroupOf16AdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
  matchId1: number,
  matchId2: number
): number => {
  let points = 0;
  const teamsInBestOf8Bet = getTeamsInMatches(
    betMatchResults,
    matchId1,
    matchId2
  );
  const teamsInBestOf8Outcome = getTeamsInMatches(
    outcomeMatchResults,
    matchId1,
    matchId2
  );

  teamsInBestOf8Bet.forEach((t) => {
    if (teamsInBestOf8Outcome.includes(t)) points = points + 25;
  });

  return points;
};

export const calculateGroupOf8AdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
  matchId1: number,
  matchId2: number
): number => {
  let points = 0;
  const teamsInBestOf8Bet = getTeamsInMatches(
    betMatchResults,
    matchId1,
    matchId2
  );
  const teamsInBestOf8Outcome = getTeamsInMatches(
    outcomeMatchResults,
    matchId1,
    matchId2
  );

  teamsInBestOf8Bet.forEach((t) => {
    if (teamsInBestOf8Outcome.includes(t)) points = points + 25;
  });

  return points;
};

export const calculateSemiFinalAdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
  matchId1: number,
  matchId2: number
): number => {
  let points = 0;
  const teamsSemiFinalsBet = getTeamsInMatches(
    betMatchResults,
    matchId1,
    matchId2
  );
  const teamsSemiFinalsOutcome = getTeamsInMatches(
    outcomeMatchResults,
    matchId1,
    matchId2
  );

  teamsSemiFinalsBet.forEach((t) => {
    if (teamsSemiFinalsOutcome.includes(t)) points = points + 30;
  });

  return points;
};

export const calculateThirdPlaceAdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
  matchId: number
): number => {
  let points = 0;

  return 0;

  // TODO på nått vis så får bronsmatchen samma lag som finalen. Vet inte varför men tillsvidare så får man 0 poäng från bronsmatchen
  /*  const bet = betMatchResults.find((mr) => mr.matchId === matchId);
  const outcome = outcomeMatchResults.find((mr) => mr.matchId === matchId);

  if (bet && outcome) {
    points = calculateAdvancePoints(bet, outcome, 30);
  }

  return points; */
};

export const calculateFinalAdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
  matchId: number
): number => {
  let points = 0;
  const bet = betMatchResults.find((mr) => mr.matchId === matchId);
  const outcome = outcomeMatchResults.find((mr) => mr.matchId === matchId);

  if (bet && outcome) {
    points = calculateAdvancePoints(bet, outcome, 35);
  }

  return points;
};

export function calculateFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateFinalCorrectScorePoints(bet, outcome) +
    calculateFinalSymbolPoints(bet, outcome)
  );
}

export function calculateThirdPlaceFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateThirdPlaceFinalCorrectScorePoints(bet, outcome) +
    calculateThirdPlaceFinalSymbolPoints(bet, outcome)
  );
}

export function calculateThirdPlaceFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return 0;
  return calculateStageMatchPoints(bet, outcome, 20);
}

export function calculateThirdPlaceFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return 0;
  return calculateStageSymbolPoints(bet, outcome, 20);
}

export function calculateFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 25);
}

export function calculateFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 25);
}

export function calculateSemiFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateSemiFinalCorrectScorePoints(bet, outcome) +
    calculateSemiFinalSymbolPoints(bet, outcome)
  );
}

export function calculateSemiFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 20);
}

export function calculateSemiFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 20);
}

export function calculateGroupOf8MatchPoints(
  betMatch: MatchResult,
  bet: MatchResult
) {
  return (
    calculateGroupOf8CorrectScorePoints(betMatch, bet) +
    calculateGroupOf8SymbolPoints(betMatch, bet)
  );
}

export function calculateGroupOf8SymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

export function calculateGroupOf8CorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

export function calculateGroupOf16MatchPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    calculateGroupOf16CorrectScorePoints(bet, outcome) +
    calculateGroupOf16SymbolPoints(bet, outcome)
  );
}

function calculateAdvancePoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number
) {
  let betWinningTeam;

  if (bet.team1Score > bet.team2Score) {
    betWinningTeam = bet.team1._id.toString();
  } else if (bet.team1Score < bet.team2Score) {
    betWinningTeam = bet.team2._id.toString();
  } else {
    betWinningTeam = bet.penaltyWinner
      ? bet.penaltyWinner._id.toString()
      : bet.team1._id.toString();
  }

  if (outcome.team1Score > outcome.team2Score) {
    if (outcome.team1._id.toString() === betWinningTeam) {
      return points;
    }
  } else if (outcome.team1Score < outcome.team2Score) {
    if (outcome.team2._id.toString() === betWinningTeam) {
      return points;
    }
  } else if (betWinningTeam === outcome.penaltyWinner?._id.toString()) {
    return points;
  }

  return 0;
}

export function calculateGroupOf16SymbolPoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

function calculateStageSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number
) {
  if (
    bet.team1._id.toString() === outcome.team1._id.toString() &&
    bet.team2._id.toString() === outcome.team2._id.toString() &&
    (predictedTeam1Winner(bet, outcome) ||
      predictedTeam2Winner(bet, outcome) ||
      predictedDraw(bet, outcome))
  ) {
    return points;
  } else {
    return 0;
  }
}

export function calculateGroupOf16CorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

function calculateStageMatchPoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number
) {
  if (predictedScoreAndTeamsCorrectly(bet, outcome)) {
    return points;
  } else {
    return 0;
  }
}

function predictedScoreAndTeamsCorrectly(
  bet: MatchResult,
  outcome: MatchResult
) {
  return (
    Number(bet.team1Score) === Number(outcome.team1Score) &&
    Number(bet.team2Score) === Number(outcome.team2Score) &&
    bet.team1._id.toString() === outcome.team1._id.toString() &&
    bet.team2._id.toString() === outcome.team2._id.toString()
  );
}

export function calculateGroupStageScorePoints(
  bet: MatchResult,
  outcome: MatchResult
) {
  if (predictedScoreCorrectly(bet, outcome)) {
    return 25;
  } else if (
    predictedTeam1Winner(bet, outcome) ||
    predictedTeam2Winner(bet, outcome) ||
    predictedDraw(bet, outcome)
  ) {
    return 20 - penaltyScore(bet, outcome);
  } else {
    return 10 - penaltyScore(bet, outcome);
  }
}

function penaltyScore(bet: MatchResult, outcome: MatchResult) {
  return (
    Math.abs(bet.team1Score - outcome.team1Score) +
    Math.abs(bet.team2Score - outcome.team2Score)
  );
}

function predictedTeam2Winner(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score < bet.team2Score && outcome.team1Score < outcome.team2Score
  );
}

function predictedDraw(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score === bet.team2Score &&
    outcome.team1Score === outcome.team2Score
  );
}

function predictedTeam1Winner(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score > bet.team2Score && outcome.team1Score > outcome.team2Score
  );
}

function predictedScoreCorrectly(bet: MatchResult, outcome: MatchResult) {
  return (
    bet.team1Score === outcome.team1Score &&
    bet.team2Score === outcome.team2Score
  );
}

export function calculatePositionPoints(
  betTeamResult: TeamResult[],
  outcomeTeamResult: TeamResult[]
): number {
  let points = 0;

  for (let i = 0; i < outcomeTeamResult.length; i++) {
    if (
      betTeamResult[i].team._id.toString() ===
      outcomeTeamResult[i].team._id.toString()
    ) {
      points += 5;
    }
  }
  return points;
}

export function calculateAdvanceToGroupOf16Points(
  betTeamResult: TeamResult[],
  outcomeTeamResult: TeamResult[]
): number {
  const first = outcomeTeamResult[0].team._id.toString();
  const second = outcomeTeamResult[1].team._id.toString();

  let points = 0;
  if ([first, second].includes(betTeamResult[0].team._id.toString())) {
    points += 10;
  }
  if ([first, second].includes(betTeamResult[1].team._id.toString())) {
    points += 10;
  }
  return points;
}

export function isGroupFinished(groupResult: GroupResult): boolean {
  return groupResult.results.every((team) => team.played === 3);
}

export function allGroupMatchesSet(betSlip: MatchResult[]): boolean {
  return betSlip.filter((match) => match.matchId <= 36).length >= 36;
}

export const getTeamsInMatches = (
  betMatchResults: MatchResult[],
  fromId: number,
  toId: number
): string[] => {
  const teams = betMatchResults.reduce<string[]>((acc, curr) => {
    if (curr.matchId >= fromId && curr.matchId <= toId) {
      return [...acc, curr.team1._id.toString(), curr.team2._id.toString()];
    }
    return acc;
  }, []);

  return teams;
};

export function calculateGoalScorer(
  betGoalScorer: ObjectId,
  outcomeGoalScorer: GoalScorer
) {
  if (outcomeGoalScorer?.player?.equals(betGoalScorer)) {
    return outcomeGoalScorer.goals * 10;
  }

  return 0;
}
