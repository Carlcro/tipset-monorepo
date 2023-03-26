import { GroupResult } from "../results/groupResult";
import { TeamResult } from "../types/teamResult";
import TeamResultBuilder from "./TeamResultBuilder";

export default class GroupResultBuilder {
  private name: string;
  private results: TeamResult[];

  constructor() {
    this.name = "A";
    this.results = [new TeamResultBuilder().build()];
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  withResults(results: TeamResult[]) {
    this.results = results;
    return this;
  }

  build(): GroupResult {
    return {
      name: this.name,
      results: this.results,
    };
  }
}
