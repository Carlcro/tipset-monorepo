import { GroupResult } from "../results/groupResult";
import { GoalScorer } from "../types/goalScorer";
import { TeamResult } from "../types/teamResult";
import { Bet } from "../types/bet";

export const calculateAdvancePoints = (
  betMatchResult: Bet,
  outcomeMatchResult: Bet[],
  pointsPerMatch: number,
): number => {
  const { matchId1, matchId2 } = getTeamsInNextStage(betMatchResult);
  const betWinner = getWinningTeam(betMatchResult);
  const outcomeWinners = getWinningTeams(
    outcomeMatchResult,
    matchId1,
    matchId2,
  );

  return outcomeWinners.includes(betWinner) ? pointsPerMatch : 0;
};

function getTeamsInNextStage(bet: Bet): { matchId1: number; matchId2: number } {
  if (bet.matchId >= 37 && bet.matchId <= 44) {
    return { matchId1: 37, matchId2: 44 };
  }

  if (bet.matchId >= 45 && bet.matchId <= 48) {
    return { matchId1: 45, matchId2: 48 };
  }

  if (bet.matchId >= 49 && bet.matchId <= 50) {
    return { matchId1: 49, matchId2: 50 };
  }

  return { matchId1: 51, matchId2: 51 };
}

export function getFinalMatchPointsExplanation(bet: Bet, outcomes: Bet[]) {
  const outcome = outcomes.find((o) => o.matchId === bet.matchId);

  if (!outcome) return null;
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation-final",
    correctResult: calculateFinalCorrectScorePoints(bet, outcome),
    correct1x2: calculateFinalSymbolPoints(bet, outcome),
    correctAdvancingTeam: calculateAdvancePoints(bet, outcomes, 35),
    result: calculateFinalMatchPoints(bet, outcome, outcomes),
  };
}

export function calculateFinalMatchPoints(
  bet: Bet,
  outcome: Bet,
  outcomes: Bet[],
) {
  return (
    calculateFinalCorrectScorePoints(bet, outcome) +
    calculateFinalSymbolPoints(bet, outcome) +
    calculateAdvancePoints(bet, outcomes, 35)
  );
}

export function calculateFinalCorrectScorePoints(bet: Bet, outcome: Bet) {
  return calculateStageMatchPoints(bet, outcome, 25);
}

export function calculateFinalSymbolPoints(bet: Bet, outcome: Bet) {
  return calculateStageSymbolPoints(bet, outcome, 25);
}

export function getSemiFinalMatchPointsExplanation(bet: Bet, outcomes: Bet[]) {
  const outcome = outcomes.find((o) => o.matchId === bet.matchId);

  if (!outcome) return null;
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateSemiFinalCorrectScorePoints(bet, outcome),
    correct1x2: calculateSemiFinalSymbolPoints(bet, outcome),
    correctAdvancingTeam: calculateAdvancePoints(bet, outcomes, 30),

    result: calculateSemiFinalMatchPoints(bet, outcome, outcomes),
  };
}

export function calculateSemiFinalMatchPoints(
  bet: Bet,
  outcome: Bet,
  outcomes: Bet[],
) {
  return (
    calculateSemiFinalCorrectScorePoints(bet, outcome) +
    calculateSemiFinalSymbolPoints(bet, outcome) +
    calculateAdvancePoints(bet, outcomes, 30)
  );
}

export function calculateSemiFinalSymbolPoints(bet: Bet, outcome: Bet) {
  return calculateStageSymbolPoints(bet, outcome, 20);
}

export function calculateSemiFinalCorrectScorePoints(bet: Bet, outcome: Bet) {
  return calculateStageMatchPoints(bet, outcome, 20);
}

export function getGroupOf8MatchPointsExplanation(bet: Bet, outcomes: Bet[]) {
  const outcome = outcomes.find((o) => o.matchId === bet.matchId);

  if (!outcome) return null;
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateGroupOf8CorrectScorePoints(bet, outcome),
    correct1x2: calculateGroupOf8SymbolPoints(bet, outcome),
    correctAdvancingTeam: calculateAdvancePoints(bet, outcomes, 25),

    result: calculateGroupOf8MatchPoints(bet, outcome, outcomes),
  };
}

export function calculateGroupOf8MatchPoints(
  betMatch: Bet,
  outcome: Bet,
  outcomes: Bet[],
) {
  return (
    calculateGroupOf8CorrectScorePoints(betMatch, outcome) +
    calculateGroupOf8SymbolPoints(betMatch, outcome) +
    calculateAdvancePoints(betMatch, outcomes, 25)
  );
}

export function calculateGroupOf8SymbolPoints(bet: Bet, outcome: Bet) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

export function calculateGroupOf8CorrectScorePoints(bet: Bet, outcome: Bet) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

export function getGroupOf16MatchPointsExplanation(bet: Bet, outcomes: Bet[]) {
  const outcome = outcomes.find((o) => o.matchId === bet.matchId);

  if (!outcome) return null;

  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateGroupOf16CorrectScorePoints(bet, outcome),
    correct1x2: calculateGroupOf16SymbolPoints(bet, outcome),
    correctAdvancingTeam: calculateAdvancePoints(bet, outcomes, 25),
    result: calculateGroupOf16MatchPoints(bet, outcome, outcomes),
  };
}

export function calculateGroupOf16MatchPoints(
  bet: Bet,
  outcome: Bet,
  outcomes: Bet[],
) {
  return (
    calculateGroupOf16CorrectScorePoints(bet, outcome) +
    calculateGroupOf16SymbolPoints(bet, outcome) +
    calculateAdvancePoints(bet, outcomes, 25)
  );
}

export function calculateGroupOf16SymbolPoints(bet: Bet, outcome: Bet) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

function calculateStageSymbolPoints(bet: Bet, outcome: Bet, points: number) {
  if (
    bet.team1Id === outcome.team1Id &&
    bet.team2Id === outcome.team2Id &&
    (predictedTeam1Winner(bet, outcome) ||
      predictedTeam2Winner(bet, outcome) ||
      predictedDraw(bet, outcome))
  ) {
    return points;
  } else {
    return 0;
  }
}

export function calculateGroupOf16CorrectScorePoints(bet: Bet, outcome: Bet) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

function calculateStageMatchPoints(bet: Bet, outcome: Bet, points: number) {
  if (predictedScoreAndTeamsCorrectly(bet, outcome)) {
    return points;
  } else {
    return 0;
  }
}

function predictedScoreAndTeamsCorrectly(bet: Bet, outcome: Bet) {
  return (
    Number(bet.team1Score) === Number(outcome.team1Score) &&
    Number(bet.team2Score) === Number(outcome.team2Score) &&
    bet.team1Id === outcome.team1Id &&
    bet.team2Id === outcome.team2Id
  );
}

export function calculateGroupStageScorePoints(bet: Bet, outcome: Bet) {
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

export function getGroupStageScorePointsExplanation(bet: Bet, outcomes: Bet[]) {
  const outcome = outcomes.find((o) => o.matchId === bet.matchId);

  if (!outcome) return null;

  if (predictedScoreCorrectly(bet, outcome)) {
    return {
      outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
      text: "group-stage-explanation-correct-result",
      result: 25,
    };
  } else if (
    predictedTeam1Winner(bet, outcome) ||
    predictedTeam2Winner(bet, outcome) ||
    predictedDraw(bet, outcome)
  ) {
    return {
      outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
      text: "group-stage-explanation-correct-winner-draw",
      goalDiff: penaltyScore(bet, outcome),
      result: 20 - penaltyScore(bet, outcome),
    };
  } else {
    return {
      outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
      text: "group-stage-explanation-wrong-winner-draw",
      goalDiff: penaltyScore(bet, outcome),
      result: 10 - penaltyScore(bet, outcome),
    };
  }
}

function penaltyScore(bet: Bet, outcome: Bet) {
  return (
    Math.abs(bet.team1Score - outcome.team1Score) +
    Math.abs(bet.team2Score - outcome.team2Score)
  );
}

function predictedTeam2Winner(bet: Bet, outcome: Bet) {
  return (
    bet.team1Score < bet.team2Score && outcome.team1Score < outcome.team2Score
  );
}

function predictedDraw(bet: Bet, outcome: Bet) {
  return (
    bet.team1Score === bet.team2Score &&
    outcome.team1Score === outcome.team2Score
  );
}

function predictedTeam1Winner(bet: Bet, outcome: Bet) {
  return (
    bet.team1Score > bet.team2Score && outcome.team1Score > outcome.team2Score
  );
}

function predictedScoreCorrectly(bet: Bet, outcome: Bet) {
  return (
    bet.team1Score === outcome.team1Score &&
    bet.team2Score === outcome.team2Score
  );
}

export function calculatePositionPoints(
  betTeamResult: TeamResult[],
  outcomeTeamResult: TeamResult[],
): number {
  let points = 0;

  for (let i = 0; i < outcomeTeamResult.length; i++) {
    if (betTeamResult[i]?.team.id === outcomeTeamResult[i]?.team.id) {
      points += 5;
    }
  }
  return points;
}

export function calculateAdvanceToGroupOf16Points(
  betTeamResult: TeamResult[],
  outcomeTeamResult: TeamResult[],
): number {
  const first = outcomeTeamResult[0]?.team.id;
  const second = outcomeTeamResult[1]?.team.id;

  let points = 0;
  if ([first, second]?.includes(betTeamResult[0]?.team.id)) {
    points += 10;
  }
  if ([first, second]?.includes(betTeamResult[1]?.team.id)) {
    points += 10;
  }
  return points;
}

export function isGroupFinished(groupResult: GroupResult): boolean {
  return groupResult.results.every((team) => team.played === 3);
}

export function allGroupMatchesSet(betSlip: Bet[]): boolean {
  return betSlip.filter((match) => match.matchId <= 36).length >= 36;
}

export function calculateGoalScorer(
  betGoalScorerId: string | null,
  outcomeGoalScorer: GoalScorer | null,
) {
  if (outcomeGoalScorer?.id === betGoalScorerId) {
    return outcomeGoalScorer.goals * 10;
  }

  return 0;
}

export function getWinningTeam(results: Bet): string | null {
  if (results.penaltyWinnerId) {
    return results.penaltyWinnerId;
  } else if (results.team1Score > results.team2Score) {
    return results.team1Id;
  } else if (results.team2Score > results.team1Score) {
    return results.team2Id;
  } else {
    return null;
  }
}

export function getWinningTeams(
  results: Bet[],
  matchId1: number,
  matchId2: number,
): (string | null)[] {
  const winners: (string | null)[] = [];

  console.log("getWinningTeams", results);

  results
    .filter(
      (result) => result.matchId >= matchId1 && result.matchId <= matchId2,
    )
    .forEach((match) => {
      if (match.penaltyWinnerId) {
        winners.push(match.penaltyWinnerId);
      } else if (match.team1Score > match.team2Score) {
        winners.push(match.team1Id);
      } else if (match.team2Score > match.team1Score) {
        winners.push(match.team2Id);
      } else {
        winners.push(null);
      }
    });

  return winners;
}
