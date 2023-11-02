/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BetslipState, MatchBet } from "./../atoms";
import {
  betSlipState,
  goalscorerState,
  pointsFromAdvancementState,
  pointsFromGoalscorerState,
  pointsFromGroupState,
} from "../atoms";
import { DefaultValue, selector, selectorFamily } from "recoil";
import {
  calculateGroupResults,
  calculateGroupOf16Results,
  calculateSemiFinalsResults,
  calculateFinal,
  calculateGroupOf16,
  calculateGroupOf8,
  calculateSemiFinals,
  calculateTeamRanking,
  calculateGroupOf8Results,
  calculateSemiFinalsLosers,
  calculateThirdPlaceMatch,
} from "calculations";
import { championshipState } from "../../championship/atoms";
import { Team } from "calculations/src/types/team";
import { RawMatchResult } from "calculations/src/types/rawMatchResult";
import { MatchResult } from "calculations/src/types/matchResult";

export const setAllMatchesState = selector({
  key: "setAllMatches",
  set: ({ set }, newValue: MatchType[] | DefaultValue) => {
    const betSlip: BetslipState = [];

    if (!(newValue instanceof DefaultValue)) {
      newValue.forEach((match: MatchType) => {
        betSlip.push({
          matchId: match.matchId,
          team1Score: Math.floor(10 * Math.random()),
          team2Score: Math.floor(10 * Math.random()),
          team1: match.team1,
          team2: match.team2,
        });
      });
    }

    set(betSlipState, betSlip);
  },

  get: () => [],
});

export const resetAllBets = selector({
  key: "resetAllBets",
  set: ({ set }) => {
    const betSlip: BetslipState = [];

    set(betSlipState, betSlip);
  },
  get: () => {},
});

export const setFromBetslipState = selector({
  key: "setFromBetslip",
  set: ({ set }, newValue: any) => {
    const betSlip: BetslipState = [];
    newValue.bets.forEach((match: any) => {
      const newBet = {
        matchId: match.matchId,
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        team1: match.team1,
        team2: match.team2,
        points: match.points,
        penaltyWinner: undefined,
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
          points: null,
          penaltyWinner: null,
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

function updateBetslip(
  betSlip: MatchBet[],
  matches: MatchType[],
  newMatch: MatchType,
  newIndex: number,
  newValue: MatchBet,
): [MatchBet | null, number] {
  const index = betSlip.findIndex(
    (match) => match.matchId === newMatch.matchId,
  );
  if (index > -1 && matches[newIndex] && betSlip[index]) {
    const newResult = {
      ...betSlip[index],
      team1: matches[newIndex]?.team1,
      team2: matches[newIndex]?.team2,
    };

    if (
      betSlip[index]?.penaltyWinner &&
      betSlip[index]?.penaltyWinner?.id !== matches[newIndex]?.team1.id &&
      betSlip[index]?.penaltyWinner?.id !== matches[newIndex]?.team2.id &&
      betSlip[index]?.matchId !== newValue.matchId
    ) {
      const newPenaltyWinner =
        betSlip[index]?.penaltyWinner?.id === betSlip[index]?.team1?.id
          ? matches[newIndex]?.team1
          : matches[newIndex]?.team2;
      newResult.penaltyWinner = newPenaltyWinner;
    }

    // @ts-ignore
    return [newResult, index];
  }

  return [null, -1];
}

export interface MatchType {
  id?: string;
  matchId: number;
  team1: Team;
  team2: Team;
}

function updateMatches(
  betSlip: MatchBet[],
  stage: MatchType[],
  newValue: MatchBet,
) {
  stage.forEach((newMatch, newIndex) => {
    const [newResult, index] = updateBetslip(
      betSlip,
      stage,
      newMatch,
      newIndex,
      newValue,
    );
    if (index && index > -1 && newResult) {
      betSlip.splice(index, 1);
      betSlip.push(newResult);
    }
  });
}

const defaultMatch: MatchBet = {
  matchId: 0,
  team1Score: 0,
  team2Score: 0,
  team1: { id: "", name: "" },
  team2: { id: "", name: "" },
  points: 0,
};

export const setMatchState = selector({
  key: "setMatch",
  set: ({ get, set }, newValue: MatchBet | DefaultValue) => {
    const betSlip = [...get(betSlipState)];
    const championship = get(championshipState);

    if (!(newValue instanceof DefaultValue) && championship) {
      const matchIndex = betSlip.findIndex(
        (match) => match.matchId === newValue.matchId,
      );
      if (matchIndex > -1) {
        betSlip.splice(matchIndex, 1);
      }
      betSlip.push(newValue);

      const groupResults = calculateGroupResults(
        betSlip as RawMatchResult[],
        championship.matchGroups,
      );

      const teamRankings = groupResults
        .map((gr) => calculateTeamRanking(gr.results, betSlip as MatchResult[]))
        .map((results) => ({ teams: results.map((result) => result.team) }));

      const newGroupOf16 = calculateGroupOf16(teamRankings);
      updateMatches(betSlip, newGroupOf16, newValue);

      const groupOf16Result = calculateGroupOf16Results(
        betSlip as RawMatchResult[],
      );
      const newGroupOf8 = calculateGroupOf8(groupOf16Result);
      updateMatches(betSlip, newGroupOf8, newValue);

      const groupOf8Result = calculateGroupOf8Results(
        betSlip as RawMatchResult[],
      );
      const newSemiFinals = calculateSemiFinals(groupOf8Result);
      updateMatches(betSlip, newSemiFinals, newValue);

      const semiFinal = calculateSemiFinalsResults(betSlip as RawMatchResult[]);
      const newThirdPlaceFinal = calculateThirdPlaceMatch(semiFinal);
      updateMatches(betSlip, newThirdPlaceFinal, newValue);

      const newFinal = calculateFinal(semiFinal);
      updateMatches(betSlip, newFinal, newValue);

      set(betSlipState, betSlip);
    }
  },
  get: () => defaultMatch,
});
