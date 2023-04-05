import { calculateTeamResults } from "./calculations/calculations";
import { Team } from "../../team";

const team1: Team = { name: "Sverige" };
const team2: Team = { name: "Tyskland" };

it("team results", () => {
  const group = calculateTeamResults(
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

  expect(group[0].team.name).toEqual("Sverige");
  expect(group[0].points).toEqual(3);
  expect(group[1].team.name).toEqual("Tyskland");
  expect(group[1].points).toEqual(0);
});
