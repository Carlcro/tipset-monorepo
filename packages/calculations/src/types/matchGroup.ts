import { Team } from "./team";
import { Match } from "./match";

export interface MatchGroup {
  name: string;
  teams: Team[];
  matches: Match[];
}
