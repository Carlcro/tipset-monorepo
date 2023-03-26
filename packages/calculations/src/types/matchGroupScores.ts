import {MatchResult} from "./matchResult";
import {MatchGroup} from "./matchGroup";

export interface MatchGroupScores {
  scores: MatchResult[];
  matchGroup: MatchGroup
}
