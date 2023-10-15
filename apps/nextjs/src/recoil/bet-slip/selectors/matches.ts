import { selector } from "recoil";
import {
  calculateTopFourThirdPlaces,
  calculateFinal,
  calculateGroupOf16,
  calculateGroupOf8,
  calculateSemiFinals,
  calculateTeamRanking,
  calculateThirdPlaceMatch,
} from "calculations";

import { betSlipState } from "../atoms";
import {
  getGroupResults,
  selectGroupOf16Results,
  selectGroupOf8Results,
  getSemiFinalsResults,
  getSemiFinalsLosers,
} from "./results";
import { MatchResult } from "calculations/src/types/matchResult";

export const getGroupOf16 = selector({
  key: "getGroupOf16State",
  get: ({ get }) => {
    const groupResults = get(getGroupResults);

    const betSlip = get(betSlipState);

    const allGroupMatchesSet = !betSlip.some(
      (x) =>
        (!Number.isInteger(x.team1Score) || !Number.isInteger(x.team2Score)) &&
        x.matchId <= 48,
    );

    const teamRankings = groupResults
      .map((gr) => calculateTeamRanking(gr.results, betSlip as MatchResult[]))
      .map((results) => ({ teams: results.map((result) => result.team) }));
    /*     const bestOfThirds = getBestOfThirds(groupResults, betSlip);
     */

    return {
      id: "",
      name: "round-of-16",
      matches: allGroupMatchesSet ? calculateGroupOf16(teamRankings) : [],
      finalsStage: true,
    };
  },
});

/* export const getBestThirds = selector({
  key: "bestThirds",
  get: ({ get }) => {
    const groupResults = get(getGroupResults);
    const betSlip = get(betSlipState);

    const bestOfThirds = calculateTopFourThirdPlaces(groupResults, betSlip);

    return { name: "Topp treor", results: bestOfThirds };
  },
}); */

export const getGroupOf8 = selector({
  key: "getGroupOf8State",
  get: ({ get }) => {
    const groupOf16 = get(selectGroupOf16Results);

    return {
      name: "quarter-finals",
      matches: calculateGroupOf8(groupOf16),
      finalsStage: true,
    };
  },
});

export const getSemifinals = selector({
  key: "getSemiFinalsState",
  get: ({ get }) => {
    const groupOf8 = get(selectGroupOf8Results);

    return {
      name: "semi-finals",
      matches: calculateSemiFinals(groupOf8),
      finalsStage: true,
    };
  },
});

export const getThirdPlaceFinal = selector({
  key: "getThirdPlaceFinal",
  get: ({ get }) => {
    const semiFinalsLosers = get(getSemiFinalsLosers);

    return {
      name: "third-place-final",
      matches: calculateThirdPlaceMatch(semiFinalsLosers),
      finalsStage: true,
    };
  },
});

export const getFinal = selector({
  key: "getFinalsState",
  get: ({ get }) => {
    const semiFinals = get(getSemiFinalsResults);

    return {
      name: "final",
      matches: calculateFinal(semiFinals),
      finalsStage: true,
    };
  },
});
