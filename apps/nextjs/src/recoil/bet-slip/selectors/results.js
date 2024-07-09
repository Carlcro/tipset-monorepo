import { selector } from "recoil";
import {
  calculateGroupOf16Results,
  calculateGroupOf8Results,
  calculateGroupResults,
  calculateSemiFinalsResults,
  calculateTeamRanking,
} from "calculations";
import { championshipState } from "../../championship/atoms";
import { betSlipState } from "../../../recoil/bet-slip/atoms";

export const getGroupResults = selector({
  key: "getGroupResults",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    const championship = get(championshipState);

    if (championship) {
      return calculateGroupResults(betSlip, championship.matchGroups);
    } else return [];
  },
});

export const getSortedGroupResults = selector({
  key: "getSortedGroupResults",
  get: ({ get }) => {
    const groupResults = get(getGroupResults);

    const betSlip = get(betSlipState);

    const teamRankings = groupResults.map((gr) => {
      const groupPoints = betSlip?.pointsFromGroup?.find(x.group === gr.name);
      return {
        name: gr.name,
        results: calculateTeamRanking(gr.results, betSlip),
        points: groupPoints?.points,
      };
    });

    return teamRankings;
  },
});

export const selectGroupOf16Results = selector({
  key: "getGroupOf16Results",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    return calculateGroupOf16Results(betSlip);
  },
});

export const selectGroupOf8Results = selector({
  key: "getGroupOf8Results",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    return calculateGroupOf8Results(betSlip);
  },
});

export const getSemiFinalsResults = selector({
  key: "getSemiFinalsResults",
  get: ({ get }) => {
    const betSlip = get(betSlipState);

    return calculateSemiFinalsResults(betSlip);
  },
});
