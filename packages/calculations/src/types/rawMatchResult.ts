import { Team } from "./team";

export interface RawMatchResult {
  matchId: number;
  team1: Team;
  team2: Team;
  penaltyWinner?: Team | null;
  team1Score: number;
  team2Score: number;
}
