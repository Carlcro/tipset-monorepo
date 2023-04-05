import { Team } from "../../team";
import {
  getKnockoutPhaseGroups,
  mapKnockoutPhaseLineup,
} from "./calculations/knockoutPhase";
import {
  calculateThirdPlace,
  calculateThirdPlaceGroups,
  calculateThirdPlaces,
  calculateTopFourThirdPlaces,
} from "./calculations/thirdPlacements";

const team1: Team = { name: "1" };
const team2: Team = { name: "2" };
const team3: Team = { name: "3" };
const team4: Team = { name: "4" };
const team5: Team = { name: "5" };
const team6: Team = { name: "6" };
const team7: Team = { name: "7" };
const team8: Team = { name: "8" };
const team9: Team = { name: "9" };
const team10: Team = { name: "10" };
const team11: Team = { name: "11" };
const team12: Team = { name: "12" };
const team13: Team = { name: "13" };
const team14: Team = { name: "14" };
const team15: Team = { name: "15" };
const team16: Team = { name: "16" };
const team17: Team = { name: "17" };
const team18: Team = { name: "18" };
const team19: Team = { name: "19" };
const team20: Team = { name: "20" };
const team21: Team = { name: "21" };
const team22: Team = { name: "22" };
const team23: Team = { name: "23" };
const team24: Team = { name: "24" };

const groupResults = [
  {
    name: "A",
    results: [
      {
        team: team1,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 3,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team2,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 2,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team3,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 1,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team4,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 0,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
    ],
  },
  {
    name: "B",
    results: [
      {
        team: team5,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 3,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team6,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 2,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team7,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 1,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team8,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 0,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
    ],
  },
  {
    name: "C",
    results: [
      {
        team: team9,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 3,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team10,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 2,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team11,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 1,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team12,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 0,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
    ],
  },
  {
    name: "D",
    results: [
      {
        team: team13,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 3,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team14,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 2,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team15,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 1,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team16,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 0,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
    ],
  },
  {
    name: "E",
    results: [
      {
        team: team17,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 3,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team18,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 2,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team19,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 1,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team20,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 0,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
    ],
  },
  {
    name: "F",
    results: [
      {
        team: team21,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 3,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team22,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 2,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team23,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 1,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team24,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 0,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
    ],
  },
];

describe("Best of thirds", () => {
  it("calculates one group", () => {
    const teamResult = [
      {
        team: team1,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 3,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team2,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 2,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team3,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 1,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
      {
        team: team4,
        goals: 1,
        conceded: 0,
        diff: 0,
        points: 0,
        played: 1,
        won: 1,
        lost: 0,
        draw: 0,
      },
    ];
    const third = calculateThirdPlace(teamResult);

    expect(third.team).toEqual(team3);
  });

  it("calculates all the third places", () => {
    const thirds = calculateThirdPlaces(groupResults);

    expect(thirds[0].team).toEqual(team3);
    expect(thirds[1].team).toEqual(team7);
    expect(thirds[2].team).toEqual(team11);
    expect(thirds[3].team).toEqual(team15);
    expect(thirds[4].team).toEqual(team19);
    expect(thirds[5].team).toEqual(team23);
  });

  it("calculates the best four third places", () => {
    const bestFour = calculateTopFourThirdPlaces(groupResults);

    expect(bestFour.length).toEqual(4);
    expect(bestFour[0].team).toEqual(team3);
    expect(bestFour[1].team).toEqual(team7);
    expect(bestFour[2].team).toEqual(team11);
    expect(bestFour[3].team).toEqual(team15);
  });

  it("map third placement to group of 16 placements", () => {
    const groups = calculateThirdPlaceGroups(groupResults);

    expect(groups[0]).toEqual("A");
    expect(groups[1]).toEqual("B");
    expect(groups[2]).toEqual("C");
    expect(groups[3]).toEqual("D");
  });

  it("maps correct knockout phase lineup from best third placement groups", () => {
    const groups = calculateThirdPlaceGroups(groupResults);

    const knockoutPhaseLineup = mapKnockoutPhaseLineup(groups);

    expect(knockoutPhaseLineup).toEqual(["A", "D", "B", "C"]);
  });

  it("return correct sorted line up to knockoutPhase", () => {
    const groups = calculateThirdPlaceGroups(groupResults);

    const knockoutPhaseLineup = mapKnockoutPhaseLineup(groups);

    const knockoutPhaseGroups = getKnockoutPhaseGroups(
      knockoutPhaseLineup,
      groupResults,
    );

    expect(knockoutPhaseGroups[0].name).toEqual("A");
    expect(knockoutPhaseGroups[1].name).toEqual("D");
    expect(knockoutPhaseGroups[2].name).toEqual("B");
    expect(knockoutPhaseGroups[3].name).toEqual("C");
  });
});
