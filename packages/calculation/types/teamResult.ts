import { Team } from "./team";

export interface TeamResult {
  team: Team;
  goals: number;
  conceded: number;
  diff: number;
  points: number;
  played: number;
  won: number;
  lost: number;
  draw: number;
}
