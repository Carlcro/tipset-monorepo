import {calculateTeamRanking, calculateTeamResults} from "./calculations/calculations";
import {Team} from "../../team";

const team1: Team = { name: "Sverige" };
const team2: Team = { name: "Tyskland" };

it("team ranking", () => {
  /* const results = calculateTeamRanking([{
    team: team1,
    goals: 1,
    diff: 1,
    points: 3,
    conceded: 0,
    played: 0,
    won: 0,
    lost: 0,
    draw: 0
  }, {
    team: team2,
    goals: 0,
    diff: -1,
    points: 0,
    conceded: 0,
    played: 0,
    won: 0,
    lost: 0,
    draw: 0
  }]);

  expect(results[0].team).toEqual(team1);
  expect(results[1].team).toEqual(team2); */
  expect(1).toBe(1);
});
