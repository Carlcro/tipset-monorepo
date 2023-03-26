import { Team } from "../types/team";
import { TeamResult } from "../types/teamResult";
import TeamBuilder from "./TeamBuilder";

export default class TeamResultBuilder {
  private team: Team;
  private goals: number;
  private conceded: number;
  private diff: number;
  private points: number;
  private played: number;
  private won: number;
  private lost: number;
  private draw: number;

  constructor() {
    this.team = new TeamBuilder().build();
    this.goals = 0;
    this.conceded = 0;
    this.diff = 0;
    this.points = 0;
    this.played = 0;
    this.won = 0;
    this.lost = 0;
    this.draw = 0;
  }

  withTeam(team: Team): this {
    this.team = team;
    return this;
  }

  withGoals(value: number) {
    this.goals = value;
    return this;
  }

  withConceded(value: number) {
    this.conceded = value;
    return this;
  }
  withDiff(value: number) {
    this.diff = value;
    return this;
  }
  withPoints(value: number) {
    this.points = value;
    return this;
  }
  withPlayed(value: number) {
    this.played = value;
    return this;
  }
  withWon(value: number) {
    this.won = value;
    return this;
  }
  withLost(value: number) {
    this.lost = value;
    return this;
  }
  withDraw(value: number) {
    this.draw = value;
    return this;
  }

  build(): TeamResult {
    return {
      team: this.team,
      goals: this.goals,
      conceded: this.conceded,
      diff: this.diff,
      points: this.points,
      played: this.played,
      won: this.won,
      lost: this.lost,
      draw: this.draw,
    };
  }
}
