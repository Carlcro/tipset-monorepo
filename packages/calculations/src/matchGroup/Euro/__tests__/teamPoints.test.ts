import { calculateTeamPoints } from "./calculations/calculations";
import { Team } from "../../team";

const team1: Team = { name: "Sverige" };
const team2: Team = { name: "Tyskland" };
const team3: Team = { name: "Danmark" };
const team4: Team = { name: "Frankrike" };

it("team points - team1 wins", () => {
  const points = calculateTeamPoints(
    [
      {
        matchId: 1,
        team1Score: 2,
        team2Score: 1,
        team1: team1,
        team2: team2,
      },
    ],
    [team1, team2],
  );

  expect(points.get(team1.name)).toEqual(3);
  expect(points.get(team2.name)).toEqual(0);
});

it("team points - team2 wins", () => {
  const points = calculateTeamPoints(
    [
      {
        matchId: 1,
        team1Score: 1,
        team2Score: 2,
        team1: team1,
        team2: team2,
      },
    ],
    [team1, team2],
  );

  expect(points.get(team1.name)).toEqual(0);
  expect(points.get(team2.name)).toEqual(3);
});

it("team points - draw", () => {
  const points = calculateTeamPoints(
    [
      {
        matchId: 1,
        team1Score: 1,
        team2Score: 1,
        team1: team1,
        team2: team2,
      },
    ],
    [team1, team2],
  );

  expect(points.get(team1.name)).toEqual(1);
  expect(points.get(team2.name)).toEqual(1);
});

it("team points - multiple results", () => {
  const points = calculateTeamPoints(
    [
      { matchId: 1, team1Score: 1, team2Score: 0, team1: team1, team2: team2 },
      { matchId: 2, team1Score: 1, team2Score: 0, team1: team1, team2: team3 },
      { matchId: 3, team1Score: 1, team2Score: 0, team1: team1, team2: team4 },
      { matchId: 4, team1Score: 0, team2Score: 1, team1: team2, team2: team3 },
      { matchId: 5, team1Score: 0, team2Score: 1, team1: team2, team2: team4 },
      { matchId: 6, team1Score: 1, team2Score: 1, team1: team3, team2: team4 },
    ],
    [team1, team2, team3, team4],
  );

  expect(points.get(team1.name)).toEqual(9);
  expect(points.get(team2.name)).toEqual(0);
  expect(points.get(team3.name)).toEqual(4);
  expect(points.get(team4.name)).toEqual(4);
});
