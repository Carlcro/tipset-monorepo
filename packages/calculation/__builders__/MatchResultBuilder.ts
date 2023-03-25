import { MatchResult } from "../types/matchResult";
import { Team } from "../types/team";
import TeamBuilder from "./TeamBuilder";

class MatchResultBuilder {
  private matchId: number;
  private team1: Team;
  private team2: Team;
  private team1Score: number;
  private team2Score: number;
  private penaltyWinner: Team;

  constructor() {
    this.matchId = 1;
    this.team1 = new TeamBuilder().build();
    this.team2 = new TeamBuilder().build();
    this.team1Score = 0;
    this.team2Score = 0;
    this.penaltyWinner = new TeamBuilder().build();
  }

  withMatchId(id: number): this {
    this.matchId = id;
    return this;
  }

  withTeam1(team: Team) {
    this.team1 = team;
    return this;
  }
  withTeam2(team: Team) {
    this.team2 = team;
    return this;
  }

  withTeam1Score(score: number) {
    this.team1Score = score;
    return this;
  }

  withTeam2Score(score: number) {
    this.team2Score = score;
    return this;
  }

  withPenaltyWinner(team: Team) {
    this.penaltyWinner = team;
    return this;
  }

  build(): MatchResult {
    return {
      matchId: this.matchId,
      team1: this.team1,
      team2: this.team2,
      team1Score: this.team1Score,
      team2Score: this.team2Score,
      penaltyWinner: this.penaltyWinner,
    };
  }
}

export default MatchResultBuilder;
