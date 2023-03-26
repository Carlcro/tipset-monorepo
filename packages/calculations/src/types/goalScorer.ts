import { ObjectId } from "mongodb";

export interface GoalScorer {
  player: ObjectId;
  goals: number;
}
