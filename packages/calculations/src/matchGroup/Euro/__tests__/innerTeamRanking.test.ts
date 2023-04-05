import { Team } from "../../../team";
import { calculateInnerTeamRanking, groupTiedTeams } from "../innerTeamRanking";
import { TeamResult } from "../../../teamResult";
import { MatchResult } from "../../../matchResult";

const team1: Team = { name: "Sverige" };
const team2: Team = { name: "Tyskland" };
const team3: Team = { name: "Danmark" };
const team4: Team = { name: "Frankrike" };

it("group tied teams", () => {
  const teamResults = [
    createTeamResult(team1),
    createTeamResult(team2),
    createTeamResult(team3),
    createTeamResult(team4),
  ];

  const grouped = groupTiedTeams(teamResults);

  expect(grouped[0][0]).toEqual(team1);
  expect(grouped[0][1]).toEqual(team2);
});

it("inner team ranking, 2 teams", () => {
  const teamResults = [createTeamResult(team1), createTeamResult(team2)];
  const matchResults = [createMatchResult(team1, team2)];

  let ranked = calculateInnerTeamRanking(teamResults, matchResults);

  expect(ranked[0]).toEqual(team1);
});

it("inner team ranking", () => {
  const teamResults = createTeamResults(team1, team2, team3, team4);
  const matchResults = createMatchResults(team1, team2, team3, team4);

  let ranked = calculateInnerTeamRanking(teamResults, matchResults);

  expect(ranked[0]).toEqual(team1);
  expect(ranked[1]).toEqual(team2);
});

function createTeamResult(team: Team): TeamResult {
  return {
    team: team,
    goals: 1,
    conceded: 0,
    diff: 1,
    points: 3,
    played: 1,
    won: 1,
    lost: 0,
    draw: 0,
  };
}

function createMatchResult(team1: Team, team2: Team): MatchResult {
  return {
    matchId: 1,
    team1: team1,
    team2: team2,
    team1Score: 1,
    team2Score: 0,
  };
}

function createTeamResults(
  team1: Team,
  team2: Team,
  team3: Team,
  team4: Team,
): TeamResult[] {
  return [
    {
      team: team1,
      goals: 10,
      conceded: 5,
      diff: 5,
      points: 4,
      played: 2,
      won: 1,
      lost: 0,
      draw: 1,
    },
    {
      team: team2,
      goals: 10,
      conceded: 5,
      diff: 5,
      points: 4,
      played: 2,
      won: 1,
      lost: 0,
      draw: 1,
    },
    {
      team: team3,
      goals: 0,
      conceded: 0,
      diff: 0,
      points: 0,
      played: 0,
      won: 0,
      lost: 0,
      draw: 0,
    },
    {
      team: team4,
      goals: 0,
      conceded: 0,
      diff: 0,
      points: 0,
      played: 0,
      won: 0,
      lost: 0,
      draw: 0,
    },
  ];
}

function createMatchResults(
  team1: Team,
  team2: Team,
  team3: Team,
  team4: Team,
): MatchResult[] {
  return [
    {
      matchId: 1,
      team1: team1,
      team2: team2,
      team1Score: 1,
      team2Score: 0,
    },
  ];
}
