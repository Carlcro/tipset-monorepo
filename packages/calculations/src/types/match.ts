import { Team } from "./team";

export interface Match {
  id?: string;
  matchId: number;
  team1: Team;
  team2: Team;
}
