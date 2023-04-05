import { calculateGoalDifference } from "../calculations";
import { Team } from "../../../team";

const team1: Team = { name: "Sverige" };
const team2: Team = { name: "Tyskland" };
const team3: Team = { name: "Danmark" };
const team4: Team = { name: "Frankrike" };

it("goal difference", () => {
  const goalDifference = calculateGoalDifference(
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

  expect(goalDifference.get(team1.name)).toEqual(3);
  expect(goalDifference.get(team2.name)).toEqual(-3);
  expect(goalDifference.get(team3.name)).toEqual(0);
  expect(goalDifference.get(team4.name)).toEqual(0);
});
