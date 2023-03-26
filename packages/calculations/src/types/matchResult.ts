import { Team } from "./team";

export interface MatchResult {
  matchId: number;
  team1: Team;
  team2: Team;
  team1Score: number;
  team2Score: number;
  penaltyWinner?: Team;
}
