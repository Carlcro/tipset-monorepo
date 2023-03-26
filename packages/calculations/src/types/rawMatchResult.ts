import { Team } from "./team";

export interface RawMatchResult {
  matchId: number;
  team1: Team;
  team2: Team;
  penaltyWinner?: Team;
  team1Score: string;
  team2Score: string;
}
