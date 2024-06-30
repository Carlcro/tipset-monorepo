// @ts-nocheck

import { GroupResult } from "../results/groupResult";
import { GoalScorer } from "../types/goalScorer";
import { MatchResult } from "../types/matchResult";
import { TeamResult } from "../types/teamResult";

export const calculateGroupOf16AdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
  matchId1: number,
  matchId2: number,
): number => {
  let points = 0;
  const teamsInBestOf8Bet = getWinningTeams(
    betMatchResults,
    matchId1,
    matchId2,
  );

  const teamsInBestOf8Outcome = getWinningTeams(
    outcomeMatchResults,
    matchId1,
    matchId2,
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
  matchId2: number,
): number => {
  let points = 0;
  const teamsInBestOf8Bet = getWinningTeams(
    betMatchResults,
    matchId1,
    matchId2,
  );
  const teamsInBestOf8Outcome = getWinningTeams(
    outcomeMatchResults,
    matchId1,
    matchId2,
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
  matchId2: number,
): number => {
  let points = 0;
  const teamsSemiFinalsBet = getWinningTeams(
    betMatchResults,
    matchId1,
    matchId2,
  );
  const teamsSemiFinalsOutcome = getWinningTeams(
    outcomeMatchResults,
    matchId1,
    matchId2,
  );

  teamsSemiFinalsBet.forEach((t) => {
    if (teamsSemiFinalsOutcome.includes(t)) points = points + 30;
  });

  return points;
};

export const calculateThirdPlaceAdvancePoints = (
  betMatchResults: MatchResult[],
  outcomeMatchResults: MatchResult[],
  matchId: number,
): number => {
  const points = 0;

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
  matchId: number,
): number => {
  let points = 0;
  const bet = betMatchResults.find((mr) => mr.matchId === matchId);
  const outcome = outcomeMatchResults.find((mr) => mr.matchId === matchId);

  if (bet && outcome) {
    points = calculateAdvancePoints(bet, outcome, 35);
  }

  return points;
};

export function getFinalMatchPointsExplanation(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateFinalCorrectScorePoints(bet, outcome),
    correct1x2: calculateFinalSymbolPoints(bet, outcome),
    result:
      calculateFinalCorrectScorePoints(bet, outcome) +
      calculateFinalSymbolPoints(bet, outcome),
  };
}

export function calculateFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return (
    calculateFinalCorrectScorePoints(bet, outcome) +
    calculateFinalSymbolPoints(bet, outcome)
  );
}

export function getThirdPlaceFinalMatchPointsExplanation(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateThirdPlaceFinalCorrectScorePoints(bet, outcome),
    correct1x2: calculateThirdPlaceFinalSymbolPoints(bet, outcome),
  };
}

export function calculateThirdPlaceFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return (
    calculateThirdPlaceFinalCorrectScorePoints(bet, outcome) +
    calculateThirdPlaceFinalSymbolPoints(bet, outcome)
  );
}

export function calculateThirdPlaceFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return 0;
  return calculateStageMatchPoints(bet, outcome, 20);
}

export function calculateThirdPlaceFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return 0;
  return calculateStageSymbolPoints(bet, outcome, 20);
}

export function calculateFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return calculateStageMatchPoints(bet, outcome, 25);
}

export function calculateFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return calculateStageSymbolPoints(bet, outcome, 25);
}

export function calculateSemiFinalMatchPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return (
    calculateSemiFinalCorrectScorePoints(bet, outcome) +
    calculateSemiFinalSymbolPoints(bet, outcome)
  );
}

export function getSemiFinalMatchPointsExplanation(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateSemiFinalCorrectScorePoints(bet, outcome),
    correct1x2: calculateSemiFinalSymbolPoints(bet, outcome),
    result:
      calculateSemiFinalCorrectScorePoints(bet, outcome) +
      calculateSemiFinalSymbolPoints(bet, outcome),
  };
}

export function calculateSemiFinalSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return calculateStageSymbolPoints(bet, outcome, 20);
}

export function calculateSemiFinalCorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return calculateStageMatchPoints(bet, outcome, 20);
}

export function calculateGroupOf8MatchPoints(
  betMatch: MatchResult,
  bet: MatchResult,
) {
  return (
    calculateGroupOf8CorrectScorePoints(betMatch, bet) +
    calculateGroupOf8SymbolPoints(betMatch, bet)
  );
}

export function getGroupOf8MatchPointsExplanation(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateGroupOf8CorrectScorePoints(bet, outcome),
    correct1x2: calculateGroupOf8SymbolPoints(bet, outcome),
    result:
      calculateGroupOf8CorrectScorePoints(bet, outcome) +
      calculateGroupOf8SymbolPoints(bet, outcome),
  };
}

export function calculateGroupOf8SymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

export function calculateGroupOf8CorrectScorePoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

export function calculateGroupOf16MatchPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return (
    calculateGroupOf16CorrectScorePoints(bet, outcome) +
    calculateGroupOf16SymbolPoints(bet, outcome)
  );
}

export function getGroupOf16MatchPointsExplanation(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return {
    outcome: `${outcome.team1Score} - ${outcome.team2Score}`,
    text: "finals-points-explanation",
    correctResult: calculateGroupOf16CorrectScorePoints(bet, outcome),
    correct1x2: calculateGroupOf16SymbolPoints(bet, outcome),
    result:
      calculateGroupOf16CorrectScorePoints(bet, outcome) +
      calculateGroupOf16SymbolPoints(bet, outcome),
  };
}

function calculateAdvancePoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number,
) {
  let betWinningTeam;

  if (bet.team1Score > bet.team2Score) {
    betWinningTeam = bet.team1.id;
  } else if (bet.team1Score < bet.team2Score) {
    betWinningTeam = bet.team2.id;
  } else {
    betWinningTeam = bet.penaltyWinner ? bet.penaltyWinner.id : bet.team1.id;
  }

  if (outcome.team1Score > outcome.team2Score) {
    if (outcome.team1.id === betWinningTeam) {
      return points;
    }
  } else if (outcome.team1Score < outcome.team2Score) {
    if (outcome.team2.id === betWinningTeam) {
      return points;
    }
  } else if (betWinningTeam === outcome.penaltyWinner?.id) {
    return points;
  }

  return 0;
}

export function calculateGroupOf16SymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return calculateStageSymbolPoints(bet, outcome, 15);
}

function calculateStageSymbolPoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number,
) {
  if (
    bet.team1.id === outcome.team1.id &&
    bet.team2.id === outcome.team2.id &&
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
  outcome: MatchResult,
) {
  return calculateStageMatchPoints(bet, outcome, 15);
}

function calculateStageMatchPoints(
  bet: MatchResult,
  outcome: MatchResult,
  points: number,
) {
  if (predictedScoreAndTeamsCorrectly(bet, outcome)) {
    return points;
  } else {
    return 0;
  }
}

function predictedScoreAndTeamsCorrectly(
  bet: MatchResult,
  outcome: MatchResult,
) {
  return (
    Number(bet.team1Score) === Number(outcome.team1Score) &&
    Number(bet.team2Score) === Number(outcome.team2Score) &&
    bet.team1.id === outcome.team1.id &&
    bet.team2.id === outcome.team2.id
  );
}

export function calculateGroupStageScorePoints(
  bet: MatchResult,
  outcome: MatchResult,
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

export function getGroupStageScorePointsExplanation(
  bet: MatchResult,
  outcome: MatchResult,
) {
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
  outcomeTeamResult: TeamResult[],
): number {
  let points = 0;

  for (let i = 0; i < outcomeTeamResult.length; i++) {
    if (betTeamResult[i].team.id === outcomeTeamResult[i].team.id) {
      points += 5;
    }
  }
  return points;
}

export function calculateAdvanceToGroupOf16Points(
  betTeamResult: TeamResult[],
  outcomeTeamResult: TeamResult[],
): number {
  const first = outcomeTeamResult[0].team.id;
  const second = outcomeTeamResult[1].team.id;

  let points = 0;
  if ([first, second].includes(betTeamResult[0].team.id)) {
    points += 10;
  }
  if ([first, second].includes(betTeamResult[1].team.id)) {
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

export function calculateGoalScorer(
  betGoalScorerId: string | null,
  outcomeGoalScorer: GoalScorer | null,
) {
  if (outcomeGoalScorer?.id === betGoalScorerId) {
    return outcomeGoalScorer.goals * 10;
  }

  return 0;
}

export function getWinningTeams(
  results: MatchResult[],
  matchId1: number,
  matchId2: number,
): (string | null)[] {
  const winners: (string | null)[] = [];

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
