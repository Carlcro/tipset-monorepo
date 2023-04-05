import {
  betSlipState,
  goalscorerState,
  pointsFromAdvancementState,
  pointsFromGoalscorerState,
  pointsFromGroupState,
} from "../atoms";
import { selector, selectorFamily } from "recoil";
import {
  calculateGroupResults,
  calculateGroupOf16Results,
  calculateSemiFinalsResults,
  calculateFinal,
  calculateGroupOf16,
  calculateGroupOf8,
  calculateSemiFinals,
  calculateTeamRanking,
  getBestOfThirds,
  calculateGroupOf8Results,
  calculateSemiFinalsLosers,
  calculateThirdPlaceMatch,
} from "calculations";
import { championshipState } from "../../championship/atoms";

export const setAllMatchesState = selector({
  key: "setAllMatches",
  set: ({ set }, newValue) => {
    const betSlip = [];
    newValue.forEach((match) => {
      betSlip.push({
        matchId: match.matchId,
        team1Score: Math.floor(10 * Math.random()),
        team2Score: Math.floor(10 * Math.random()),
        team1: match.team1,
        team2: match.team2,
      });
    });

    set(betSlipState, betSlip);
  },

  get: () => {},
});

export const resetAllBets = selector({
  key: "resetAllBets",
  set: ({ set }) => {
    const betSlip = [];

    set(betSlipState, betSlip);
  },
  get: () => {},
});

export const setFromBetslipState = selector({
  key: "setFromBetslip",
  set: ({ set }, newValue) => {
    const betSlip = [];
    newValue.bets.forEach((match) => {
      const newBet = {
        matchId: match.matchId,
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        team1: match.team1,
        team2: match.team2,
        points: match.points,
      };
      if (match.penaltyWinner) {
        newBet.penaltyWinner = match.penaltyWinner;
      }

      betSlip.push(newBet);
    });
    set(pointsFromGroupState, newValue.pointsFromGroup);
    set(pointsFromAdvancementState, newValue.pointsFromAdvancement);
    set(pointsFromGoalscorerState, newValue.pointsFromGoalscorer);
    set(betSlipState, betSlip);
    set(goalscorerState, newValue.goalscorer);
  },
  get: () => {},
});

export const getPointsFromAdvancement = selectorFamily({
  key: "getPointsFromAdvancement",
  get:
    (final) =>
    ({ get }) => {
      const pointsFromAdvancement = get(pointsFromAdvancementState)?.find(
        (x) => x.final === final,
      );
      if (pointsFromAdvancement) {
        return pointsFromAdvancement.points;
      }
      return null;
    },
});

export const getPointsFromGroup = selectorFamily({
  key: "getPointsFromGroup",
  get:
    (groupName) =>
    ({ get }) => {
      const groupPoints = get(pointsFromGroupState)?.find(
        (x) => x.group === groupName,
      );
      if (groupPoints) {
        return groupPoints.points;
      } else {
        return null;
      }
    },
});

export const getMatchState = selectorFamily({
  key: "getMatch",
  get:
    (matchId) =>
    ({ get }) => {
      const match = get(betSlipState).find((x) => x.matchId === matchId);

      if (!match)
        return {
          matchId,
          team1Score: "",
          team2Score: "",
        };
      return match;
    },
});

export const getMatchDrawState = selectorFamily({
  key: "getMatchDraw",
  get:
    (matchId) =>
    ({ get }) => {
      const match = get(betSlipState).find((x) => x.matchId === matchId);

      if (!match) return false;

      return match.team1Score === match.team2Score;
    },
});

function updateBetslip(betSlip, stage, newMatch, newIndex, newValue) {
  const index = betSlip.findIndex(
    (match) => match.matchId === newMatch.matchId,
  );
  if (betSlip[index]) {
    let newResult = {
      ...betSlip[index],
      team1: stage[newIndex].team1,
      team2: stage[newIndex].team2,
    };

    if (
      betSlip[index].penaltyWinner &&
      betSlip[index].penaltyWinner._id !== stage[newIndex].team1._id &&
      betSlip[index].penaltyWinner._id !== stage[newIndex].team2._id &&
      betSlip[index].matchId !== newValue.matchId
    ) {
      const newPenaltyWinner =
        betSlip[index].penaltyWinner._id === betSlip[index].team1._id
          ? stage[newIndex].team1
          : stage[newIndex].team2;
      newResult.penaltyWinner = newPenaltyWinner;
    }

    return [newResult, index];
  }

  return [null, null];
}

//Denhär funktionen är en fucking abomination
export const setMatchState = selector({
  key: "setMatch",
  set: ({ get, set }, newValue) => {
    let betSlip = [...get(betSlipState)];
    const championship = get(championshipState);

    const index1 = betSlip.findIndex(
      (match) => match.matchId === newValue.matchId,
    );
    if (index1 > -1) {
      betSlip.splice(index1, 1);
    }
    betSlip.push(newValue);

    const groupResults = calculateGroupResults(
      betSlip,
      championship.matchGroups,
    );

    const teamRankings = groupResults
      .map((gr) => calculateTeamRanking(gr.results, betSlip))
      .map((results) => ({ teams: results.map((result) => result.team) }));
    const bestOfThirds = getBestOfThirds(groupResults, betSlip);

    const newGroupOf16 = calculateGroupOf16(teamRankings, bestOfThirds);
    newGroupOf16.forEach((newMatch, newIndex) => {
      const [newResult, index] = updateBetslip(
        betSlip,
        newGroupOf16,
        newMatch,
        newIndex,
        newValue,
      );
      if (newResult) {
        betSlip.splice(index, 1);
        betSlip.push(newResult);
      }
    });

    const groupOf16Result = calculateGroupOf16Results(betSlip);
    const newGroupOf8 = calculateGroupOf8(groupOf16Result);

    newGroupOf8.forEach((newMatch, newIndex) => {
      const [newResult, index] = updateBetslip(
        betSlip,
        newGroupOf8,
        newMatch,
        newIndex,
        newValue,
      );
      if (newResult) {
        betSlip.splice(index, 1);
        betSlip.push(newResult);
      }
    });

    const groupOf8Result = calculateGroupOf8Results(betSlip);
    const newSemiFinals = calculateSemiFinals(groupOf8Result);

    newSemiFinals.forEach((newMatch, newIndex) => {
      const [newResult, index] = updateBetslip(
        betSlip,
        newSemiFinals,
        newMatch,
        newIndex,
        newValue,
      );
      if (newResult) {
        betSlip.splice(index, 1);
        betSlip.push(newResult);
      }
    });
    const semiFinal = calculateSemiFinalsResults(betSlip);

    const newThirdPlaceFinal = calculateThirdPlaceMatch(semiFinal);

    newThirdPlaceFinal.forEach((newMatch, newIndex) => {
      const [newResult, index] = updateBetslip(
        betSlip,
        newThirdPlaceFinal,
        newMatch,
        newIndex,
        newValue,
      );
      if (newResult) {
        betSlip.splice(index, 1);
        betSlip.push(newResult);
      }
    });

    const newFinal = calculateFinal(semiFinal);

    newFinal.forEach((newMatch, newIndex) => {
      const [newResult, index] = updateBetslip(
        betSlip,
        newFinal,
        newMatch,
        newIndex,
        newValue,
      );
      if (newResult) {
        betSlip.splice(index, 1);
        betSlip.push(newResult);
      }
    });

    set(betSlipState, betSlip);
  },
  get: () => {},
});
